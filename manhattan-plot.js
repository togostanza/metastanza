import { x as dispatch, S as Stanza, d as defineStanzaElement } from './index-28113ace.js';
import { s as select, d as downloadSvgMenuItem, a as downloadPngMenuItem } from './metastanza_utils-99a9ac59.js';

function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

function nopropagation(event) {
  event.stopImmediatePropagation();
}

function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function dragDisable(view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

var constant = x => () => x;

function DragEvent(type, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x, y, dx, dy,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    subject: {value: subject, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    identifier: {value: identifier, enumerable: true, configurable: true},
    active: {value: active, enumerable: true, configurable: true},
    x: {value: x, enumerable: true, configurable: true},
    y: {value: y, enumerable: true, configurable: true},
    dx: {value: dx, enumerable: true, configurable: true},
    dy: {value: dy, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(event, d) {
  return d == null ? {x: event.x, y: event.y} : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function drag() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned(event, d) {
    if (touchending || !filter.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    dragDisable(event.view);
    nopropagation(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }

  function mousemoved(event) {
    noevent(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }

  function mouseupped(event) {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent(event);
    gestures.mouse("end", event);
  }

  function touchstarted(event, d) {
    if (!filter.call(this, event, d)) return;
    var touches = event.changedTouches,
        c = container.call(this, event, d),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        nopropagation(event);
        gesture("start", event, touches[i]);
      }
    }
  }

  function touchmoved(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent(event);
        gesture("drag", event, touches[i]);
      }
    }
  }

  function touchended(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event);
        gesture("end", event, touches[i]);
      }
    }
  }

  function beforestart(that, container, event, d, identifier, touch) {
    var dispatch = listeners.copy(),
        p = pointer(touch || event, container), dx, dy,
        s;

    if ((s = subject.call(that, new DragEvent("beforestart", {
        sourceEvent: event,
        target: drag,
        identifier,
        active,
        x: p[0],
        y: p[1],
        dx: 0,
        dy: 0,
        dispatch
      }), d)) == null) return;

    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;

    return function gesture(type, event, touch) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[identifier] = gesture, n = active++; break;
        case "end": delete gestures[identifier], --active; // nobreak
        case "drag": p = pointer(touch || event, container), n = active; break;
      }
      dispatch.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch
        }),
        d
      );
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}

var dataset$1 = {
	"Study name is not half-width character.": [
		{
			"not provided": {
				"not provided": {
					condition1: "not provided",
					condition2: "hepatitis B",
					variants: [
						{
							ref: "A",
							stop: 14705100,
							"p-value": 0.0000467,
							start: 14705100,
							alt: "C",
							rsId: "rs7511708",
							chr: "chr1"
						},
						{
							gene_name: "NEK7",
							ref: "C",
							stop: 198097051,
							"p-value": 0.0000255,
							start: 198097051,
							alt: "T",
							rsId: "rs2226273",
							entrez_id: 140609,
							chr: "chr1"
						},
						{
							gene_name: "PLD5",
							ref: "G",
							stop: 242198204,
							"p-value": 0.0000401,
							start: 242198204,
							alt: "A",
							rsId: "rs871243",
							entrez_id: 200150,
							chr: "chr1"
						},
						{
							gene_name: "STAT4",
							ref: "G",
							stop: 191966452,
							"p-value": 0.0000402,
							start: 191966452,
							alt: "C",
							rsId: "rs7568275",
							entrez_id: 6775,
							chr: "chr2"
						},
						{
							gene_name: "STAT4",
							ref: "G",
							stop: 191969879,
							"p-value": 0.0000626,
							start: 191969879,
							alt: "C",
							rsId: "rs10181656",
							entrez_id: 6775,
							chr: "chr2"
						},
						{
							gene_name: "STAT4",
							ref: "C",
							stop: 191970120,
							"p-value": 0.0000294,
							start: 191970120,
							alt: "G",
							rsId: "rs7582694",
							entrez_id: 6775,
							chr: "chr2"
						},
						{
							gene_name: "CACNA2D3",
							ref: "G",
							stop: 54477378,
							"p-value": 0.0000531,
							start: 54477378,
							alt: "A",
							rsId: "rs11922560",
							entrez_id: 55799,
							chr: "chr3"
						},
						{
							gene_name: "RNF150",
							ref: "T",
							stop: 142011012,
							"p-value": 0.0000654,
							start: 142011012,
							alt: "C",
							rsId: "rs11931358",
							entrez_id: 57484,
							chr: "chr4"
						},
						{
							gene_name: "TENM2",
							ref: "C",
							stop: 165128192,
							"p-value": 0.0000971,
							start: 165128192,
							alt: "A",
							rsId: "rs4090557",
							entrez_id: 57451,
							chr: "chr5"
						},
						{
							gene_name: "TENM2",
							ref: "A",
							stop: 166456414,
							"p-value": 0.0000301,
							start: 166456414,
							alt: "C",
							rsId: "rs7708152",
							entrez_id: 57451,
							chr: "chr5"
						},
						{
							gene_name: "TENM2",
							ref: "C",
							stop: 166478982,
							"p-value": 0.0000987,
							start: 166478982,
							alt: "T",
							rsId: "rs11960582",
							entrez_id: 57451,
							chr: "chr5"
						},
						{
							gene_name: "OR5V1",
							ref: "T",
							stop: 29316852,
							"p-value": 0.000013,
							start: 29316852,
							alt: "C",
							rsId: "rs10447393",
							entrez_id: 81696,
							chr: "chr6"
						},
						{
							gene_name: "RAN",
							ref: "A",
							stop: 30434566,
							"p-value": 0.0000137,
							start: 30434566,
							alt: "G",
							rsId: "rs7764934",
							entrez_id: 5901,
							chr: "chr6"
						},
						{
							gene_name: "RAN",
							ref: "G",
							stop: 30446055,
							"p-value": 0.0000233,
							start: 30446055,
							alt: "A",
							rsId: "rs9295897",
							entrez_id: 5901,
							chr: "chr6"
						},
						{
							gene_name: "RAN",
							ref: "C",
							stop: 30449046,
							"p-value": 0.0000177,
							start: 30449046,
							alt: "T",
							rsId: "rs9295898",
							entrez_id: 5901,
							chr: "chr6"
						},
						{
							gene_name: "PPP1R10",
							ref: "A",
							stop: 30560796,
							"p-value": 0.0000198,
							start: 30560796,
							alt: "G",
							rsId: "rs13195066",
							entrez_id: 5514,
							chr: "chr6"
						},
						{
							gene_name: "ATAT1",
							ref: "T",
							stop: 30601067,
							"p-value": 0.00000716,
							start: 30601067,
							alt: "C",
							rsId: "rs13201129",
							entrez_id: 79969,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "A",
							stop: 30772378,
							"p-value": 5.03e-8,
							start: 30772378,
							alt: "G",
							rsId: "rs3094123",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "T",
							stop: 30782105,
							"p-value": 0.0000949,
							start: 30782105,
							alt: "C",
							rsId: "rs2894046",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "G",
							stop: 30786676,
							"p-value": 0.0000825,
							start: 30786676,
							alt: "A",
							rsId: "rs9348843",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "T",
							stop: 30788191,
							"p-value": 3.79e-8,
							start: 30788191,
							alt: "C",
							rsId: "rs3094111",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "T",
							stop: 30796738,
							"p-value": 1.91e-8,
							start: 30796738,
							alt: "C",
							rsId: "rs3130785",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "C",
							stop: 30800326,
							"p-value": 0.0000236,
							start: 30800326,
							alt: "T",
							rsId: "rs3130648",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "C",
							stop: 30822413,
							"p-value": 0.0000106,
							start: 30822413,
							alt: "T",
							rsId: "rs3095345",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "DDR1",
							ref: "G",
							stop: 30853796,
							"p-value": 0.0000206,
							start: 30853796,
							alt: "A",
							rsId: "rs3131034",
							entrez_id: 780,
							chr: "chr6"
						},
						{
							gene_name: "CDSN",
							ref: "A",
							stop: 31085200,
							"p-value": 0.0000608,
							start: 31085200,
							alt: "G",
							rsId: "rs3132553",
							entrez_id: 1041,
							chr: "chr6"
						},
						{
							gene_name: "CDSN",
							ref: "A",
							stop: 31085269,
							"p-value": 0.0000875,
							start: 31085269,
							alt: "G",
							rsId: "rs3132552",
							entrez_id: 1041,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "G",
							stop: 31086048,
							"p-value": 8.58e-7,
							start: 31086048,
							alt: "A",
							rsId: "rs3132550",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "G",
							stop: 31086402,
							"p-value": 0.0000222,
							start: 31086402,
							alt: "A",
							rsId: "rs3094211",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "C",
							stop: 31087240,
							"p-value": 0.0000144,
							start: 31087240,
							alt: "T",
							rsId: "rs3095323",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "T",
							stop: 31087908,
							"p-value": 0.0000207,
							start: 31087908,
							alt: "G",
							rsId: "rs3132547",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "A",
							stop: 31088232,
							"p-value": 0.0000205,
							start: 31088232,
							alt: "G",
							rsId: "rs2302398",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "C",
							stop: 31088241,
							"p-value": 0.0000166,
							start: 31088241,
							alt: "T",
							rsId: "rs2302397",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "G",
							stop: 31098832,
							"p-value": 2.54e-9,
							start: 31098832,
							alt: "A",
							rsId: "rs3131009",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C2",
							ref: "T",
							stop: 31107087,
							"p-value": 0.00000149,
							start: 31107087,
							alt: "C",
							rsId: "rs3094663",
							entrez_id: 170680,
							chr: "chr6"
						},
						{
							gene_name: "PSORS1C1",
							ref: "C",
							stop: 31107648,
							"p-value": 4.11e-7,
							start: 31107648,
							alt: "T",
							rsId: "rs1063646",
							entrez_id: 170679,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "G",
							stop: 31109882,
							"p-value": 0.00000237,
							start: 31109882,
							alt: "T",
							rsId: "rs1265086",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "T",
							stop: 31111400,
							"p-value": 7.66e-8,
							start: 31111400,
							alt: "C",
							rsId: "rs9263740",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "A",
							stop: 31113030,
							"p-value": 0.00000164,
							start: 31113030,
							alt: "G",
							rsId: "rs3132539",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "G",
							stop: 31114515,
							"p-value": 4.66e-7,
							start: 31114515,
							alt: "A",
							rsId: "rs9263749",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "CCHCR1",
							ref: "A",
							stop: 31115874,
							"p-value": 0.00000111,
							start: 31115874,
							alt: "G",
							rsId: "rs9263758",
							entrez_id: 54535,
							chr: "chr6"
						},
						{
							gene_name: "POU5F1",
							ref: "A",
							stop: 31137165,
							"p-value": 8.46e-8,
							start: 31137165,
							alt: "G",
							rsId: "rs3130503",
							entrez_id: 5460,
							chr: "chr6"
						},
						{
							gene_name: "HCG27",
							ref: "A",
							stop: 31145271,
							"p-value": 1.92e-7,
							start: 31145271,
							alt: "G",
							rsId: "rs9501066",
							entrez_id: 253018,
							chr: "chr6"
						},
						{
							gene_name: "HCG27",
							ref: "C",
							stop: 31145991,
							"p-value": 1.04e-7,
							start: 31145991,
							alt: "T",
							rsId: "rs3871248",
							entrez_id: 253018,
							chr: "chr6"
						},
						{
							gene_name: "HCG27",
							ref: "G",
							stop: 31146439,
							"p-value": 0.00000558,
							start: 31146439,
							alt: "C",
							rsId: "rs1052986",
							entrez_id: 253018,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "G",
							stop: 31177034,
							"p-value": 6.58e-9,
							start: 31177034,
							alt: "A",
							rsId: "rs35016370",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "A",
							stop: 31177298,
							"p-value": 8.52e-9,
							start: 31177298,
							alt: "G",
							rsId: "rs35299283",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "G",
							stop: 31185265,
							"p-value": 7.45e-9,
							start: 31185265,
							alt: "A",
							rsId: "rs34518279",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-C",
							ref: "G",
							stop: 31233906,
							"p-value": 0.0000145,
							start: 31233906,
							alt: "A",
							rsId: "rs2524104",
							entrez_id: 3107,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31271320,
							"p-value": 6.64e-8,
							start: 31271320,
							alt: "A",
							rsId: "rs28367685",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31271680,
							"p-value": 2.69e-7,
							start: 31271680,
							alt: "C",
							rsId: "rs9468940",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31273745,
							"p-value": 7.28e-7,
							start: 31273745,
							alt: "C",
							rsId: "rs3873386",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31284476,
							"p-value": 0.00000104,
							start: 31284476,
							alt: "C",
							rsId: "rs28367701",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31288943,
							"p-value": 0.0000204,
							start: 31288943,
							alt: "G",
							rsId: "rs9265156",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31297092,
							"p-value": 0.0000056,
							start: 31297092,
							alt: "T",
							rsId: "rs9265477",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31297286,
							"p-value": 0.00000926,
							start: 31297286,
							alt: "T",
							rsId: "rs9265486",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31297936,
							"p-value": 0.00000535,
							start: 31297936,
							alt: "T",
							rsId: "rs9265526",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31299112,
							"p-value": 0.00000318,
							start: 31299112,
							alt: "T",
							rsId: "rs9265587",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31299189,
							"p-value": 0.00000613,
							start: 31299189,
							alt: "A",
							rsId: "rs9265596",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31299450,
							"p-value": 0.00000845,
							start: 31299450,
							alt: "T",
							rsId: "rs9265604",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31299694,
							"p-value": 0.00000394,
							start: 31299694,
							alt: "G",
							rsId: "rs9265621",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31300658,
							"p-value": 0.0000107,
							start: 31300658,
							alt: "C",
							rsId: "rs9265662",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "C",
							stop: 31300968,
							"p-value": 0.00000594,
							start: 31300968,
							alt: "T",
							rsId: "rs9265675",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31301014,
							"p-value": 0.00000222,
							start: 31301014,
							alt: "A",
							rsId: "rs9265678",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31301118,
							"p-value": 0.00000598,
							start: 31301118,
							alt: "G",
							rsId: "rs9265682",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31302141,
							"p-value": 0.0000109,
							start: 31302141,
							alt: "A",
							rsId: "rs9265725",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31302791,
							"p-value": 0.00000611,
							start: 31302791,
							alt: "T",
							rsId: "rs28752875",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31303236,
							"p-value": 0.0000287,
							start: 31303236,
							alt: "G",
							rsId: "rs1634775",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31303879,
							"p-value": 0.0000136,
							start: 31303879,
							alt: "G",
							rsId: "rs28752923",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31307157,
							"p-value": 0.0000186,
							start: 31307157,
							alt: "C",
							rsId: "rs28753018",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "T",
							stop: 31313760,
							"p-value": 0.00000158,
							start: 31313760,
							alt: "C",
							rsId: "rs28380912",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "G",
							stop: 31314924,
							"p-value": 0.0000408,
							start: 31314924,
							alt: "A",
							rsId: "rs9265936",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31318820,
							"p-value": 0.0000747,
							start: 31318820,
							alt: "C",
							rsId: "rs9266044",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "HLA-B",
							ref: "A",
							stop: 31320810,
							"p-value": 3.24e-7,
							start: 31320810,
							alt: "G",
							rsId: "rs2596503",
							entrez_id: 3106,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31329734,
							"p-value": 0.0000913,
							start: 31329734,
							alt: "T",
							rsId: "rs2523570",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31330370,
							"p-value": 0.00000469,
							start: 31330370,
							alt: "A",
							rsId: "rs2523564",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "A",
							stop: 31332239,
							"p-value": 6.17e-7,
							start: 31332239,
							alt: "C",
							rsId: "rs2596551",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31334174,
							"p-value": 0.00000648,
							start: 31334174,
							alt: "A",
							rsId: "rs2596574",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31336870,
							"p-value": 0.0000171,
							start: 31336870,
							alt: "T",
							rsId: "rs2253907",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31343221,
							"p-value": 0.0000086,
							start: 31343221,
							alt: "T",
							rsId: "rs2844550",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31343919,
							"p-value": 0.00000669,
							start: 31343919,
							alt: "A",
							rsId: "rs2523640",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31344098,
							"p-value": 0.00000565,
							start: 31344098,
							alt: "T",
							rsId: "rs2523639",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "T",
							stop: 31344273,
							"p-value": 0.0000211,
							start: 31344273,
							alt: "C",
							rsId: "rs2523638",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "T",
							stop: 31345513,
							"p-value": 0.0000131,
							start: 31345513,
							alt: "G",
							rsId: "rs28366078",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31345523,
							"p-value": 0.0000119,
							start: 31345523,
							alt: "T",
							rsId: "rs28366079",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31345844,
							"p-value": 0.00000737,
							start: 31345844,
							alt: "A",
							rsId: "rs2523632",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31346080,
							"p-value": 0.00000731,
							start: 31346080,
							alt: "A",
							rsId: "rs2523630",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31348464,
							"p-value": 2.73e-11,
							start: 31348464,
							alt: "A",
							rsId: "rs9266683",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31349922,
							"p-value": 0.0000417,
							start: 31349922,
							alt: "T",
							rsId: "rs9266722",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31350154,
							"p-value": 0.00000938,
							start: 31350154,
							alt: "T",
							rsId: "rs2523547",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "T",
							stop: 31350579,
							"p-value": 9.5e-12,
							start: 31350579,
							alt: "C",
							rsId: "rs3094596",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31351079,
							"p-value": 0.00000679,
							start: 31351079,
							alt: "T",
							rsId: "rs2523646",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31351313,
							"p-value": 0.0000777,
							start: 31351313,
							alt: "T",
							rsId: "rs9266749",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "A",
							stop: 31351999,
							"p-value": 0.00000508,
							start: 31351999,
							alt: "G",
							rsId: "rs28752473",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352201,
							"p-value": 0.00000963,
							start: 31352201,
							alt: "A",
							rsId: "rs28366088",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31352366,
							"p-value": 0.0000105,
							start: 31352366,
							alt: "A",
							rsId: "rs28752479",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352459,
							"p-value": 0.00000672,
							start: 31352459,
							alt: "T",
							rsId: "rs28366091",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352674,
							"p-value": 0.0000165,
							start: 31352674,
							alt: "A",
							rsId: "rs28366093",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352830,
							"p-value": 0.0000107,
							start: 31352830,
							alt: "A",
							rsId: "rs28366097",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "G",
							stop: 31352844,
							"p-value": 0.0000146,
							start: 31352844,
							alt: "A",
							rsId: "rs28366098",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICA",
							ref: "C",
							stop: 31352902,
							"p-value": 0.00000676,
							start: 31352902,
							alt: "T",
							rsId: "rs28366099",
							entrez_id: 100507436,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "T",
							stop: 31386019,
							"p-value": 0.00000762,
							start: 31386019,
							alt: "G",
							rsId: "rs9295990",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "T",
							stop: 31390621,
							"p-value": 0.00000734,
							start: 31390621,
							alt: "C",
							rsId: "rs2516447",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31417159,
							"p-value": 0.0000818,
							start: 31417159,
							alt: "A",
							rsId: "rs17200421",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31431691,
							"p-value": 0.00000786,
							start: 31431691,
							alt: "T",
							rsId: "rs2255221",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31431874,
							"p-value": 0.0000137,
							start: 31431874,
							alt: "T",
							rsId: "rs2395030",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31432006,
							"p-value": 0.00000815,
							start: 31432006,
							alt: "A",
							rsId: "rs2263318",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "T",
							stop: 31449022,
							"p-value": 0.0000421,
							start: 31449022,
							alt: "C",
							rsId: "rs2523650",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "G",
							stop: 31463718,
							"p-value": 0.00000248,
							start: 31463718,
							alt: "A",
							rsId: "rs3828901",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MICB",
							ref: "C",
							stop: 31465637,
							"p-value": 0.0000674,
							start: 31465637,
							alt: "T",
							rsId: "rs6915833",
							entrez_id: 4277,
							chr: "chr6"
						},
						{
							gene_name: "MCCD1",
							ref: "C",
							stop: 31488904,
							"p-value": 0.0000552,
							start: 31488904,
							alt: "T",
							rsId: "rs3093995",
							entrez_id: 401250,
							chr: "chr6"
						},
						{
							gene_name: "MCCD1",
							ref: "A",
							stop: 31495370,
							"p-value": 0.0000664,
							start: 31495370,
							alt: "G",
							rsId: "rs3093984",
							entrez_id: 401250,
							chr: "chr6"
						},
						{
							gene_name: "MCCD1",
							ref: "G",
							stop: 31497744,
							"p-value": 0.0000527,
							start: 31497744,
							alt: "A",
							rsId: "rs3093979",
							entrez_id: 401250,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31499354,
							"p-value": 0.0000571,
							start: 31499354,
							alt: "T",
							rsId: "rs3130056",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31502767,
							"p-value": 0.0000552,
							start: 31502767,
							alt: "T",
							rsId: "rs3131628",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31503703,
							"p-value": 0.0000102,
							start: 31503703,
							alt: "T",
							rsId: "rs2075581",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "T",
							stop: 31506624,
							"p-value": 0.0000637,
							start: 31506624,
							alt: "C",
							rsId: "rs1129640",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "A",
							stop: 31506744,
							"p-value": 0.0000357,
							start: 31506744,
							alt: "C",
							rsId: "rs2516393",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31506854,
							"p-value": 0.0000783,
							start: 31506854,
							alt: "T",
							rsId: "rs2523511",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "DDX39B",
							ref: "C",
							stop: 31507447,
							"p-value": 0.00000982,
							start: 31507447,
							alt: "T",
							rsId: "rs2239709",
							entrez_id: 7919,
							chr: "chr6"
						},
						{
							gene_name: "ATP6V1G2",
							ref: "G",
							stop: 31512799,
							"p-value": 0.0000106,
							start: 31512799,
							alt: "A",
							rsId: "rs2071593",
							entrez_id: 534,
							chr: "chr6"
						},
						{
							gene_name: "LTA",
							ref: "T",
							stop: 31526856,
							"p-value": 0.0000183,
							start: 31526856,
							alt: "C",
							rsId: "rs13192469",
							entrez_id: 4049,
							chr: "chr6"
						},
						{
							gene_name: "LTA",
							ref: "G",
							stop: 31528690,
							"p-value": 0.0000212,
							start: 31528690,
							alt: "A",
							rsId: "rs13215091",
							entrez_id: 4049,
							chr: "chr6"
						},
						{
							gene_name: "AIF1",
							ref: "C",
							stop: 31566204,
							"p-value": 0.0000103,
							start: 31566204,
							alt: "T",
							rsId: "rs2509217",
							entrez_id: 199,
							chr: "chr6"
						},
						{
							gene_name: "AIF1",
							ref: "C",
							stop: 31575276,
							"p-value": 4.85e-9,
							start: 31575276,
							alt: "T",
							rsId: "rs9348876",
							entrez_id: 199,
							chr: "chr6"
						},
						{
							gene_name: "PRRC2A",
							ref: "G",
							stop: 31604842,
							"p-value": 2.32e-7,
							start: 31604842,
							alt: "A",
							rsId: "rs3817659",
							entrez_id: 7916,
							chr: "chr6"
						},
						{
							gene_name: "BAG6",
							ref: "G",
							stop: 31615167,
							"p-value": 0.0000237,
							start: 31615167,
							alt: "A",
							rsId: "rs2844463",
							entrez_id: 7917,
							chr: "chr6"
						},
						{
							gene_name: "BAG6",
							ref: "T",
							stop: 31615514,
							"p-value": 1.05e-7,
							start: 31615514,
							alt: "C",
							rsId: "rs10484558",
							entrez_id: 7917,
							chr: "chr6"
						},
						{
							gene_name: "APOM",
							ref: "G",
							stop: 31625507,
							"p-value": 0.0000379,
							start: 31625507,
							alt: "T",
							rsId: "rs707922",
							entrez_id: 55937,
							chr: "chr6"
						},
						{
							gene_name: "LY6G5B",
							ref: "C",
							stop: 31639845,
							"p-value": 1.41e-7,
							start: 31639845,
							alt: "A",
							rsId: "rs11758242",
							entrez_id: 58496,
							chr: "chr6"
						},
						{
							gene_name: "ABHD16A",
							ref: "G",
							stop: 31665452,
							"p-value": 0.0000155,
							start: 31665452,
							alt: "A",
							rsId: "rs805273",
							entrez_id: 7920,
							chr: "chr6"
						},
						{
							gene_name: "SNORD48",
							ref: "C",
							stop: 31803074,
							"p-value": 3.57e-7,
							start: 31803074,
							alt: "T",
							rsId: "rs17201241",
							entrez_id: 26801,
							chr: "chr6"
						},
						{
							gene_name: "NEU1",
							ref: "C",
							stop: 31819164,
							"p-value": 1.34e-7,
							start: 31819164,
							alt: "A",
							rsId: "rs13191375",
							entrez_id: 4758,
							chr: "chr6"
						},
						{
							gene_name: "STK19",
							ref: "G",
							stop: 31947460,
							"p-value": 1.29e-10,
							start: 31947460,
							alt: "T",
							rsId: "rs389883",
							entrez_id: 8859,
							chr: "chr6"
						},
						{
							gene_name: "TNXB",
							ref: "C",
							stop: 32050544,
							"p-value": 0.0000181,
							start: 32050544,
							alt: "T",
							rsId: "rs3130287",
							entrez_id: 7148,
							chr: "chr6"
						},
						{
							gene_name: "TNXB",
							ref: "C",
							stop: 32071893,
							"p-value": 0.0000094,
							start: 32071893,
							alt: "T",
							rsId: "rs3134954",
							entrez_id: 7148,
							chr: "chr6"
						},
						{
							gene_name: "ATF6B",
							ref: "A",
							stop: 32080146,
							"p-value": 0.0000218,
							start: 32080146,
							alt: "C",
							rsId: "rs3130342",
							entrez_id: 1388,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "C",
							stop: 32170433,
							"p-value": 2.24e-8,
							start: 32170433,
							alt: "T",
							rsId: "rs2071287",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32171683,
							"p-value": 2.54e-10,
							start: 32171683,
							alt: "C",
							rsId: "rs2071277",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "G",
							stop: 32176782,
							"p-value": 6.46e-7,
							start: 32176782,
							alt: "T",
							rsId: "rs3132947",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "G",
							stop: 32182759,
							"p-value": 1.17e-13,
							start: 32182759,
							alt: "A",
							rsId: "rs206015",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32188640,
							"p-value": 1.22e-8,
							start: 32188640,
							alt: "C",
							rsId: "rs520692",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32188642,
							"p-value": 2.69e-7,
							start: 32188642,
							alt: "C",
							rsId: "rs520688",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "T",
							stop: 32189841,
							"p-value": 1.33e-8,
							start: 32189841,
							alt: "G",
							rsId: "rs715299",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "NOTCH4",
							ref: "C",
							stop: 32191339,
							"p-value": 5.86e-8,
							start: 32191339,
							alt: "T",
							rsId: "rs3830041",
							entrez_id: 4855,
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32199144,
							"p-value": 4.74e-8,
							start: 32199144,
							alt: "A",
							rsId: "rs377763",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32203347,
							"p-value": 2.11e-8,
							start: 32203347,
							alt: "A",
							rsId: "rs508445",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32205045,
							"p-value": 1.01e-8,
							start: 32205045,
							alt: "A",
							rsId: "rs549182",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32208324,
							"p-value": 6.96e-8,
							start: 32208324,
							alt: "T",
							rsId: "rs424232",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32209027,
							"p-value": 2.48e-7,
							start: 32209027,
							alt: "C",
							rsId: "rs382259",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32209562,
							"p-value": 3.5e-9,
							start: 32209562,
							alt: "C",
							rsId: "rs380571",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32209963,
							"p-value": 1.45e-7,
							start: 32209963,
							alt: "C",
							rsId: "rs371156",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32210799,
							"p-value": 2.08e-7,
							start: 32210799,
							alt: "G",
							rsId: "rs419132",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32213008,
							"p-value": 3.11e-8,
							start: 32213008,
							alt: "A",
							rsId: "rs454875",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32218843,
							"p-value": 0.0000327,
							start: 32218843,
							alt: "G",
							rsId: "rs3115573",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32220685,
							"p-value": 0.0000327,
							start: 32220685,
							alt: "A",
							rsId: "rs3130315",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32236054,
							"p-value": 4.49e-8,
							start: 32236054,
							alt: "T",
							rsId: "rs3132933",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "T",
							stop: 32253544,
							"p-value": 2.7e-8,
							start: 32253544,
							alt: "C",
							rsId: "rs6902465",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32283394,
							"p-value": 1.79e-7,
							start: 32283394,
							alt: "G",
							rsId: "rs493136",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32286252,
							"p-value": 2.02e-8,
							start: 32286252,
							alt: "A",
							rsId: "rs503042",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32292818,
							"p-value": 6.16e-8,
							start: 32292818,
							alt: "A",
							rsId: "rs536693",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32298814,
							"p-value": 5.79e-8,
							start: 32298814,
							alt: "A",
							rsId: "rs3129949",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32299592,
							"p-value": 0.00000167,
							start: 32299592,
							alt: "A",
							rsId: "rs1003879",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32299822,
							"p-value": 4.44e-8,
							start: 32299822,
							alt: "A",
							rsId: "rs1003878",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "G",
							stop: 32301910,
							"p-value": 5.34e-8,
							start: 32301910,
							alt: "A",
							rsId: "rs2022537",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32309911,
							"p-value": 2.64e-7,
							start: 32309911,
							alt: "T",
							rsId: "rs3117137",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32321597,
							"p-value": 2.16e-8,
							start: 32321597,
							alt: "G",
							rsId: "rs1265761",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "A",
							stop: 32338695,
							"p-value": 0.0000189,
							start: 32338695,
							alt: "G",
							rsId: "rs3129943",
							chr: "chr6"
						},
						{
							gene_name: "TSBP1",
							ref: "C",
							stop: 32339511,
							"p-value": 0.00000866,
							start: 32339511,
							alt: "T",
							rsId: "rs2076535",
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "T",
							stop: 32343369,
							"p-value": 0.00000258,
							start: 32343369,
							alt: "C",
							rsId: "rs3117106",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "C",
							stop: 32345595,
							"p-value": 0.0000321,
							start: 32345595,
							alt: "G",
							rsId: "rs2395153",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "G",
							stop: 32346491,
							"p-value": 0.0000307,
							start: 32346491,
							alt: "A",
							rsId: "rs9268435",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "BTNL2",
							ref: "G",
							stop: 32370816,
							"p-value": 0.0000326,
							start: 32370816,
							alt: "A",
							rsId: "rs28362680",
							entrez_id: 56244,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32376176,
							"p-value": 0.00000266,
							start: 32376176,
							alt: "T",
							rsId: "rs3763311",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32379535,
							"p-value": 0.00000173,
							start: 32379535,
							alt: "C",
							rsId: "rs11961777",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32383573,
							"p-value": 1.77e-7,
							start: 32383573,
							alt: "T",
							rsId: "rs6912701",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32389255,
							"p-value": 0.00000209,
							start: 32389255,
							alt: "A",
							rsId: "rs3135365",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32391695,
							"p-value": 8.13e-10,
							start: 32391695,
							alt: "C",
							rsId: "rs28895026",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32396475,
							"p-value": 0.0000023,
							start: 32396475,
							alt: "G",
							rsId: "rs3129846",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32396506,
							"p-value": 4.81e-12,
							start: 32396506,
							alt: "G",
							rsId: "rs3129847",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32396615,
							"p-value": 3.74e-12,
							start: 32396615,
							alt: "T",
							rsId: "rs3135342",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32403655,
							"p-value": 2.69e-12,
							start: 32403655,
							alt: "G",
							rsId: "rs983561",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32404135,
							"p-value": 2.35e-12,
							start: 32404135,
							alt: "G",
							rsId: "rs5000563",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32407302,
							"p-value": 0.00000226,
							start: 32407302,
							alt: "G",
							rsId: "rs2395179",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32407310,
							"p-value": 0.00000173,
							start: 32407310,
							alt: "G",
							rsId: "rs2395180",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32408012,
							"p-value": 0.00000259,
							start: 32408012,
							alt: "A",
							rsId: "rs3129876",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "A",
							stop: 32408044,
							"p-value": 5.1e-12,
							start: 32408044,
							alt: "C",
							rsId: "rs9268644",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32408597,
							"p-value": 2.36e-12,
							start: 32408597,
							alt: "A",
							rsId: "rs3129877",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32409242,
							"p-value": 1.36e-8,
							start: 32409242,
							alt: "A",
							rsId: "rs3135392",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32409484,
							"p-value": 9.65e-14,
							start: 32409484,
							alt: "T",
							rsId: "rs3129881",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32409530,
							"p-value": 1.93e-7,
							start: 32409530,
							alt: "A",
							rsId: "rs3129882",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32410137,
							"p-value": 0.0000758,
							start: 32410137,
							alt: "C",
							rsId: "rs3129883",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32410576,
							"p-value": 0.0000323,
							start: 32410576,
							alt: "C",
							rsId: "rs3129886",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "G",
							stop: 32410691,
							"p-value": 2.32e-8,
							start: 32410691,
							alt: "A",
							rsId: "rs3129887",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "T",
							stop: 32411376,
							"p-value": 2.65e-8,
							start: 32411376,
							alt: "G",
							rsId: "rs2239805",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRA",
							ref: "C",
							stop: 32411846,
							"p-value": 0.0000636,
							start: 32411846,
							alt: "G",
							rsId: "rs2239802",
							entrez_id: 3122,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32413317,
							"p-value": 0.0000526,
							start: 32413317,
							alt: "T",
							rsId: "rs2395182",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32415218,
							"p-value": 9.32e-8,
							start: 32415218,
							alt: "A",
							rsId: "rs9469113",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "T",
							stop: 32421190,
							"p-value": 3.12e-7,
							start: 32421190,
							alt: "C",
							rsId: "rs28895131",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32421798,
							"p-value": 0.0000691,
							start: 32421798,
							alt: "T",
							rsId: "rs6457590",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "T",
							stop: 32427789,
							"p-value": 0.0000485,
							start: 32427789,
							alt: "C",
							rsId: "rs9268832",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "G",
							stop: 32447953,
							"p-value": 3.19e-8,
							start: 32447953,
							alt: "A",
							rsId: "rs2395194",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB5",
							ref: "A",
							stop: 32448808,
							"p-value": 2.9e-8,
							start: 32448808,
							alt: "G",
							rsId: "rs7748494",
							entrez_id: 3127,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DRB6",
							ref: "C",
							stop: 32498584,
							"p-value": 3.55e-7,
							start: 32498584,
							alt: "A",
							rsId: "rs16870187",
							entrez_id: 3128,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32561370,
							"p-value": 0.00000188,
							start: 32561370,
							alt: "T",
							rsId: "rs35139284",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32574060,
							"p-value": 0.00000548,
							start: 32574060,
							alt: "C",
							rsId: "rs9270986",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32575369,
							"p-value": 0.00000322,
							start: 32575369,
							alt: "T",
							rsId: "rs9271055",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32577531,
							"p-value": 0.00000195,
							start: 32577531,
							alt: "G",
							rsId: "rs9271152",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32577646,
							"p-value": 0.00000291,
							start: 32577646,
							alt: "G",
							rsId: "rs9271160",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32578449,
							"p-value": 0.00000504,
							start: 32578449,
							alt: "C",
							rsId: "rs9271191",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32578885,
							"p-value": 0.00000206,
							start: 32578885,
							alt: "C",
							rsId: "rs9271203",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32581782,
							"p-value": 0.00000182,
							start: 32581782,
							alt: "T",
							rsId: "rs1966001",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32582577,
							"p-value": 0.00000585,
							start: 32582577,
							alt: "C",
							rsId: "rs3104415",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32583159,
							"p-value": 4.99e-10,
							start: 32583159,
							alt: "C",
							rsId: "rs4959106",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32583677,
							"p-value": 3.28e-10,
							start: 32583677,
							alt: "C",
							rsId: "rs36124427",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32584153,
							"p-value": 5.65e-11,
							start: 32584153,
							alt: "A",
							rsId: "rs28383233",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32585068,
							"p-value": 4.82e-7,
							start: 32585068,
							alt: "C",
							rsId: "rs28752534",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32586854,
							"p-value": 0.00000167,
							start: 32586854,
							alt: "A",
							rsId: "rs9271366",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32587768,
							"p-value": 0.00000252,
							start: 32587768,
							alt: "A",
							rsId: "rs9271413",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32587923,
							"p-value": 0.0000617,
							start: 32587923,
							alt: "G",
							rsId: "rs9271425",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32589051,
							"p-value": 0.0000343,
							start: 32589051,
							alt: "A",
							rsId: "rs9271489",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32589862,
							"p-value": 0.0000711,
							start: 32589862,
							alt: "A",
							rsId: "rs9271526",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32589983,
							"p-value": 0.0000766,
							start: 32589983,
							alt: "A",
							rsId: "rs9271538",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32593010,
							"p-value": 0.00000523,
							start: 32593010,
							alt: "A",
							rsId: "rs9271692",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32593095,
							"p-value": 0.0000182,
							start: 32593095,
							alt: "A",
							rsId: "rs9271697",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32593392,
							"p-value": 0.0000148,
							start: 32593392,
							alt: "A",
							rsId: "rs9271709",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32593507,
							"p-value": 0.00000483,
							start: 32593507,
							alt: "A",
							rsId: "rs9271720",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32594248,
							"p-value": 0.0000063,
							start: 32594248,
							alt: "A",
							rsId: "rs9271770",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32594274,
							"p-value": 0.000006,
							start: 32594274,
							alt: "C",
							rsId: "rs9271771",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32595027,
							"p-value": 0.00000965,
							start: 32595027,
							alt: "G",
							rsId: "rs9271848",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32595147,
							"p-value": 0.00000617,
							start: 32595147,
							alt: "T",
							rsId: "rs9271857",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32595679,
							"p-value": 0.000088,
							start: 32595679,
							alt: "A",
							rsId: "rs9271887",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32595859,
							"p-value": 0.00000354,
							start: 32595859,
							alt: "T",
							rsId: "rs9271893",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32595874,
							"p-value": 0.0000695,
							start: 32595874,
							alt: "T",
							rsId: "rs9271894",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32595954,
							"p-value": 0.00000888,
							start: 32595954,
							alt: "A",
							rsId: "rs9271897",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32596007,
							"p-value": 0.00000153,
							start: 32596007,
							alt: "G",
							rsId: "rs9271899",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "G",
							stop: 32596566,
							"p-value": 0.00000391,
							start: 32596566,
							alt: "T",
							rsId: "rs9271926",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32600003,
							"p-value": 0.0000221,
							start: 32600003,
							alt: "C",
							rsId: "rs3104376",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32600291,
							"p-value": 0.00000893,
							start: 32600291,
							alt: "C",
							rsId: "rs9272113",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32600411,
							"p-value": 0.00000984,
							start: 32600411,
							alt: "T",
							rsId: "rs9272117",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32600501,
							"p-value": 0.00000728,
							start: 32600501,
							alt: "G",
							rsId: "rs9272120",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "A",
							stop: 32600638,
							"p-value": 0.00000488,
							start: 32600638,
							alt: "G",
							rsId: "rs9272130",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "T",
							stop: 32602482,
							"p-value": 0.0000247,
							start: 32602482,
							alt: "C",
							rsId: "rs3104369",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA1",
							ref: "C",
							stop: 32609094,
							"p-value": 2.82e-9,
							start: 32609094,
							alt: "T",
							rsId: "rs1129737",
							entrez_id: 3117,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB1",
							ref: "G",
							stop: 32626086,
							"p-value": 0.0000027,
							start: 32626086,
							alt: "A",
							rsId: "rs7744001",
							entrez_id: 3119,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB1",
							ref: "A",
							stop: 32627700,
							"p-value": 2.84e-8,
							start: 32627700,
							alt: "G",
							rsId: "rs6689",
							entrez_id: 3119,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB1",
							ref: "A",
							stop: 32630407,
							"p-value": 1.5e-8,
							start: 32630407,
							alt: "G",
							rsId: "rs9274177",
							entrez_id: 3119,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32636433,
							"p-value": 4.99e-11,
							start: 32636433,
							alt: "G",
							rsId: "rs35800511",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32636785,
							"p-value": 4.73e-8,
							start: 32636785,
							alt: "T",
							rsId: "rs9274684",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32637418,
							"p-value": 9.23e-11,
							start: 32637418,
							alt: "A",
							rsId: "rs17205647",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32637538,
							"p-value": 1.7e-11,
							start: 32637538,
							alt: "A",
							rsId: "rs28371212",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32637833,
							"p-value": 2.01e-7,
							start: 32637833,
							alt: "A",
							rsId: "rs35195457",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32648490,
							"p-value": 1.5e-8,
							start: 32648490,
							alt: "A",
							rsId: "rs9275071",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32648809,
							"p-value": 2.05e-8,
							start: 32648809,
							alt: "G",
							rsId: "rs9275086",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32649416,
							"p-value": 4.75e-9,
							start: 32649416,
							alt: "T",
							rsId: "rs9275105",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32650256,
							"p-value": 1.42e-8,
							start: 32650256,
							alt: "T",
							rsId: "rs9275123",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32650550,
							"p-value": 5.61e-9,
							start: 32650550,
							alt: "C",
							rsId: "rs2858303",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32651495,
							"p-value": 1e-8,
							start: 32651495,
							alt: "T",
							rsId: "rs9275146",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32653018,
							"p-value": 1.37e-13,
							start: 32653018,
							alt: "C",
							rsId: "rs28371251",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32657452,
							"p-value": 3.58e-9,
							start: 32657452,
							alt: "C",
							rsId: "rs28371254",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32657505,
							"p-value": 2.63e-11,
							start: 32657505,
							alt: "C",
							rsId: "rs4538748",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32657543,
							"p-value": 3.36e-8,
							start: 32657543,
							alt: "T",
							rsId: "rs4642516",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32657817,
							"p-value": 3.34e-10,
							start: 32657817,
							alt: "T",
							rsId: "rs9275210",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32658310,
							"p-value": 0.0000102,
							start: 32658310,
							alt: "A",
							rsId: "rs9469220",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32658429,
							"p-value": 1.14e-14,
							start: 32658429,
							alt: "C",
							rsId: "rs9368737",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32659087,
							"p-value": 3.78e-7,
							start: 32659087,
							alt: "C",
							rsId: "rs9275220",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32663919,
							"p-value": 1.44e-9,
							start: 32663919,
							alt: "G",
							rsId: "rs2858313",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32664093,
							"p-value": 4.21e-10,
							start: 32664093,
							alt: "G",
							rsId: "rs2647015",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32664126,
							"p-value": 0.00000295,
							start: 32664126,
							alt: "G",
							rsId: "rs9275300",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32664279,
							"p-value": 7.62e-10,
							start: 32664279,
							alt: "T",
							rsId: "rs2647014",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32664677,
							"p-value": 2.71e-10,
							start: 32664677,
							alt: "G",
							rsId: "rs2647007",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32665311,
							"p-value": 0.0000247,
							start: 32665311,
							alt: "C",
							rsId: "rs17206147",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32666831,
							"p-value": 7.28e-7,
							start: 32666831,
							alt: "T",
							rsId: "rs9275329",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32667119,
							"p-value": 9.5e-8,
							start: 32667119,
							alt: "C",
							rsId: "rs3135006",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32667318,
							"p-value": 1.7e-7,
							start: 32667318,
							alt: "T",
							rsId: "rs9275337",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32668258,
							"p-value": 0.00000302,
							start: 32668258,
							alt: "T",
							rsId: "rs9275370",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32668296,
							"p-value": 3.09e-8,
							start: 32668296,
							alt: "C",
							rsId: "rs9275371",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32668323,
							"p-value": 0.0000666,
							start: 32668323,
							alt: "A",
							rsId: "rs2858310",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32668388,
							"p-value": 7.95e-7,
							start: 32668388,
							alt: "T",
							rsId: "rs9275372",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32668632,
							"p-value": 0.00000143,
							start: 32668632,
							alt: "A",
							rsId: "rs9275375",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32669018,
							"p-value": 4.04e-8,
							start: 32669018,
							alt: "A",
							rsId: "rs1612904",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32669084,
							"p-value": 4.72e-7,
							start: 32669084,
							alt: "C",
							rsId: "rs9275388",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32669568,
							"p-value": 3.14e-7,
							start: 32669568,
							alt: "C",
							rsId: "rs9275398",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32669767,
							"p-value": 3.96e-13,
							start: 32669767,
							alt: "C",
							rsId: "rs2647050",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32669883,
							"p-value": 4.37e-7,
							start: 32669883,
							alt: "G",
							rsId: "rs9275405",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32670000,
							"p-value": 2.81e-9,
							start: 32670000,
							alt: "T",
							rsId: "rs2858308",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32670110,
							"p-value": 4.44e-7,
							start: 32670110,
							alt: "C",
							rsId: "rs9275408",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32670136,
							"p-value": 5.08e-8,
							start: 32670136,
							alt: "C",
							rsId: "rs3135001",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32670244,
							"p-value": 4.91e-7,
							start: 32670244,
							alt: "G",
							rsId: "rs9275418",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32670255,
							"p-value": 3.09e-13,
							start: 32670255,
							alt: "T",
							rsId: "rs2856718",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32670956,
							"p-value": 1.79e-9,
							start: 32670956,
							alt: "T",
							rsId: "rs2856705",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32671014,
							"p-value": 2.83e-13,
							start: 32671014,
							alt: "A",
							rsId: "rs2856704",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32671103,
							"p-value": 0.0000281,
							start: 32671103,
							alt: "C",
							rsId: "rs13192471",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32671596,
							"p-value": 3.68e-7,
							start: 32671596,
							alt: "T",
							rsId: "rs9275440",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32671601,
							"p-value": 0.0000483,
							start: 32671601,
							alt: "T",
							rsId: "rs28451714",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32579708,
							"p-value": 0.00000279,
							start: 32579708,
							alt: "C",
							rsId: "rs13207945",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32672529,
							"p-value": 8.37e-9,
							start: 32672529,
							alt: "T",
							rsId: "rs9275474",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32672903,
							"p-value": 0.0000261,
							start: 32672903,
							alt: "A",
							rsId: "rs35030589",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32674130,
							"p-value": 0.0000777,
							start: 32674130,
							alt: "A",
							rsId: "rs9275507",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32674343,
							"p-value": 1.86e-7,
							start: 32674343,
							alt: "A",
							rsId: "rs28371271",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32674440,
							"p-value": 4.02e-8,
							start: 32674440,
							alt: "C",
							rsId: "rs28371272",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32674558,
							"p-value": 1.39e-8,
							start: 32674558,
							alt: "C",
							rsId: "rs28371274",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32674573,
							"p-value": 0.0000157,
							start: 32674573,
							alt: "C",
							rsId: "rs9275515",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32674643,
							"p-value": 0.0000505,
							start: 32674643,
							alt: "G",
							rsId: "rs9275516",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32674649,
							"p-value": 0.00000486,
							start: 32674649,
							alt: "G",
							rsId: "rs9275517",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32674700,
							"p-value": 0.00000643,
							start: 32674700,
							alt: "A",
							rsId: "rs9275518",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32675032,
							"p-value": 6.95e-10,
							start: 32675032,
							alt: "T",
							rsId: "rs17206343",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675067,
							"p-value": 1.58e-8,
							start: 32675067,
							alt: "C",
							rsId: "rs17206350",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675109,
							"p-value": 2.33e-9,
							start: 32675109,
							alt: "C",
							rsId: "rs9275524",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32675266,
							"p-value": 7.59e-10,
							start: 32675266,
							alt: "T",
							rsId: "rs17212748",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675449,
							"p-value": 8.39e-10,
							start: 32675449,
							alt: "C",
							rsId: "rs17212818",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32675497,
							"p-value": 1.09e-9,
							start: 32675497,
							alt: "C",
							rsId: "rs17212832",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32675691,
							"p-value": 1e-9,
							start: 32675691,
							alt: "A",
							rsId: "rs17212867",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32676040,
							"p-value": 5.77e-10,
							start: 32676040,
							alt: "T",
							rsId: "rs28371287",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32676075,
							"p-value": 9.69e-10,
							start: 32676075,
							alt: "G",
							rsId: "rs28371289",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32677152,
							"p-value": 4.43e-10,
							start: 32677152,
							alt: "A",
							rsId: "rs16898264",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32677454,
							"p-value": 1.98e-8,
							start: 32677454,
							alt: "C",
							rsId: "rs28371302",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32678136,
							"p-value": 0.00000677,
							start: 32678136,
							alt: "T",
							rsId: "rs9275569",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678265,
							"p-value": 5.26e-10,
							start: 32678265,
							alt: "G",
							rsId: "rs28371311",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32678388,
							"p-value": 4.45e-10,
							start: 32678388,
							alt: "C",
							rsId: "rs28371315",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678740,
							"p-value": 1.15e-9,
							start: 32678740,
							alt: "G",
							rsId: "rs28371318",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678973,
							"p-value": 4.25e-8,
							start: 32678973,
							alt: "G",
							rsId: "rs17615250",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32678999,
							"p-value": 0.0000179,
							start: 32678999,
							alt: "G",
							rsId: "rs9275572",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32679047,
							"p-value": 9.67e-11,
							start: 32679047,
							alt: "A",
							rsId: "rs28371322",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32679346,
							"p-value": 1.53e-10,
							start: 32679346,
							alt: "A",
							rsId: "rs28371333",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32679489,
							"p-value": 3.5e-10,
							start: 32679489,
							alt: "C",
							rsId: "rs17615293",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32680585,
							"p-value": 7.91e-10,
							start: 32680585,
							alt: "C",
							rsId: "rs17581425",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32680696,
							"p-value": 6.7e-9,
							start: 32680696,
							alt: "A",
							rsId: "rs17219288",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32680727,
							"p-value": 4.61e-9,
							start: 32680727,
							alt: "C",
							rsId: "rs17219309",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32680970,
							"p-value": 6.61e-9,
							start: 32680970,
							alt: "T",
							rsId: "rs7745656",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32681049,
							"p-value": 9.48e-9,
							start: 32681049,
							alt: "C",
							rsId: "rs2647087",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32681085,
							"p-value": 2.05e-9,
							start: 32681085,
							alt: "G",
							rsId: "rs2858333",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32681518,
							"p-value": 1.11e-8,
							start: 32681518,
							alt: "G",
							rsId: "rs2647088",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32682174,
							"p-value": 1.09e-8,
							start: 32682174,
							alt: "A",
							rsId: "rs3104404",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32682402,
							"p-value": 7.33e-13,
							start: 32682402,
							alt: "T",
							rsId: "rs3997849",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32682915,
							"p-value": 4.68e-10,
							start: 32682915,
							alt: "G",
							rsId: "rs3997854",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32684069,
							"p-value": 1.08e-8,
							start: 32684069,
							alt: "T",
							rsId: "rs6936707",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32685550,
							"p-value": 6.44e-9,
							start: 32685550,
							alt: "A",
							rsId: "rs3916765",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32685685,
							"p-value": 3.09e-9,
							start: 32685685,
							alt: "A",
							rsId: "rs3104398",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32687212,
							"p-value": 9.02e-10,
							start: 32687212,
							alt: "G",
							rsId: "rs3129743",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32687358,
							"p-value": 2.67e-9,
							start: 32687358,
							alt: "G",
							rsId: "rs3104401",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32687689,
							"p-value": 1.15e-7,
							start: 32687689,
							alt: "A",
							rsId: "rs9275689",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32688055,
							"p-value": 1.36e-7,
							start: 32688055,
							alt: "T",
							rsId: "rs9275700",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32688060,
							"p-value": 7.43e-8,
							start: 32688060,
							alt: "C",
							rsId: "rs9275701",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32688273,
							"p-value": 4.64e-9,
							start: 32688273,
							alt: "G",
							rsId: "rs9275714",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32688288,
							"p-value": 8.22e-10,
							start: 32688288,
							alt: "A",
							rsId: "rs9275715",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32688343,
							"p-value": 1.71e-7,
							start: 32688343,
							alt: "C",
							rsId: "rs9275717",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32688617,
							"p-value": 1.04e-7,
							start: 32688617,
							alt: "G",
							rsId: "rs9275727",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32688804,
							"p-value": 1.6e-7,
							start: 32688804,
							alt: "T",
							rsId: "rs9275737",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32688925,
							"p-value": 4.08e-8,
							start: 32688925,
							alt: "T",
							rsId: "rs9275743",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32689503,
							"p-value": 2.83e-8,
							start: 32689503,
							alt: "C",
							rsId: "rs9275772",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32689622,
							"p-value": 1.19e-7,
							start: 32689622,
							alt: "A",
							rsId: "rs9275773",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32689687,
							"p-value": 7.68e-8,
							start: 32689687,
							alt: "C",
							rsId: "rs9275775",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32690153,
							"p-value": 1.25e-7,
							start: 32690153,
							alt: "A",
							rsId: "rs9275798",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32690251,
							"p-value": 3.05e-7,
							start: 32690251,
							alt: "A",
							rsId: "rs9275802",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32690671,
							"p-value": 1.51e-7,
							start: 32690671,
							alt: "T",
							rsId: "rs9275825",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32690713,
							"p-value": 1.05e-8,
							start: 32690713,
							alt: "G",
							rsId: "rs9275826",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32691662,
							"p-value": 3.88e-7,
							start: 32691662,
							alt: "G",
							rsId: "rs9275878",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32691721,
							"p-value": 7.41e-8,
							start: 32691721,
							alt: "G",
							rsId: "rs9275879",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32691854,
							"p-value": 1.11e-7,
							start: 32691854,
							alt: "A",
							rsId: "rs9275884",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32691999,
							"p-value": 1.13e-7,
							start: 32691999,
							alt: "C",
							rsId: "rs9275894",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692023,
							"p-value": 1.07e-7,
							start: 32692023,
							alt: "C",
							rsId: "rs9275895",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32692060,
							"p-value": 1.13e-7,
							start: 32692060,
							alt: "G",
							rsId: "rs9275896",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32692122,
							"p-value": 6.85e-9,
							start: 32692122,
							alt: "T",
							rsId: "rs9275900",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							stop: 32692449,
							"p-value": 1.05e-7,
							start: 32692449,
							alt: "G",
							rsId: "rs9282246",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32692553,
							"p-value": 7.26e-8,
							start: 32692553,
							alt: "A",
							rsId: "rs9275917",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692580,
							"p-value": 1.06e-7,
							start: 32692580,
							alt: "C",
							rsId: "rs9275918",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32692588,
							"p-value": 1.2e-8,
							start: 32692588,
							alt: "A",
							rsId: "rs9275920",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692617,
							"p-value": 4.63e-7,
							start: 32692617,
							alt: "C",
							rsId: "rs9275921",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32692745,
							"p-value": 2.9e-8,
							start: 32692745,
							alt: "A",
							rsId: "rs9275926",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32692889,
							"p-value": 8.73e-8,
							start: 32692889,
							alt: "G",
							rsId: "rs9275934",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32692919,
							"p-value": 9.87e-8,
							start: 32692919,
							alt: "G",
							rsId: "rs9275935",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693079,
							"p-value": 1.36e-7,
							start: 32693079,
							alt: "G",
							rsId: "rs9275944",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693182,
							"p-value": 1.87e-7,
							start: 32693182,
							alt: "G",
							rsId: "rs9275951",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32693520,
							"p-value": 5.33e-8,
							start: 32693520,
							alt: "A",
							rsId: "rs9275967",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693570,
							"p-value": 3.43e-9,
							start: 32693570,
							alt: "G",
							rsId: "rs9275969",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32693681,
							"p-value": 5.49e-7,
							start: 32693681,
							alt: "G",
							rsId: "rs9275971",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32693752,
							"p-value": 1.63e-7,
							start: 32693752,
							alt: "A",
							rsId: "rs9275974",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32693821,
							"p-value": 2.26e-7,
							start: 32693821,
							alt: "T",
							rsId: "rs9275975",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32693861,
							"p-value": 3.81e-8,
							start: 32693861,
							alt: "A",
							rsId: "rs9275978",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32693903,
							"p-value": 1.27e-7,
							start: 32693903,
							alt: "A",
							rsId: "rs9275979",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32694452,
							"p-value": 3.88e-8,
							start: 32694452,
							alt: "T",
							rsId: "rs9275999",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32694519,
							"p-value": 1.15e-7,
							start: 32694519,
							alt: "G",
							rsId: "rs9276000",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32694520,
							"p-value": 1.61e-7,
							start: 32694520,
							alt: "G",
							rsId: "rs9276001",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32694604,
							"p-value": 1.08e-7,
							start: 32694604,
							alt: "G",
							rsId: "rs9276007",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32694633,
							"p-value": 6.11e-8,
							start: 32694633,
							alt: "T",
							rsId: "rs9276008",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32694641,
							"p-value": 9.87e-8,
							start: 32694641,
							alt: "C",
							rsId: "rs9276009",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32695168,
							"p-value": 5.75e-8,
							start: 32695168,
							alt: "A",
							rsId: "rs5029393",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32695432,
							"p-value": 9.14e-8,
							start: 32695432,
							alt: "T",
							rsId: "rs9276036",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32695434,
							"p-value": 2.37e-7,
							start: 32695434,
							alt: "G",
							rsId: "rs9276037",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32695521,
							"p-value": 1.35e-7,
							start: 32695521,
							alt: "C",
							rsId: "rs9276040",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32695603,
							"p-value": 3.13e-7,
							start: 32695603,
							alt: "C",
							rsId: "rs9276041",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32695904,
							"p-value": 2.35e-7,
							start: 32695904,
							alt: "C",
							rsId: "rs9276058",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32697100,
							"p-value": 3.85e-7,
							start: 32697100,
							alt: "G",
							rsId: "rs9276107",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32697887,
							"p-value": 1.81e-7,
							start: 32697887,
							alt: "C",
							rsId: "rs9276137",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32697907,
							"p-value": 2.05e-7,
							start: 32697907,
							alt: "C",
							rsId: "rs9276139",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32697943,
							"p-value": 2.37e-7,
							start: 32697943,
							alt: "T",
							rsId: "rs9276140",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32697962,
							"p-value": 7.58e-8,
							start: 32697962,
							alt: "T",
							rsId: "rs9276142",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32698098,
							"p-value": 2.01e-7,
							start: 32698098,
							alt: "C",
							rsId: "rs9276147",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32698322,
							"p-value": 1.54e-7,
							start: 32698322,
							alt: "C",
							rsId: "rs9276155",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32698369,
							"p-value": 1.37e-7,
							start: 32698369,
							alt: "C",
							rsId: "rs9276157",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32698899,
							"p-value": 3.29e-9,
							start: 32698899,
							alt: "A",
							rsId: "rs7751699",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32699716,
							"p-value": 1.02e-7,
							start: 32699716,
							alt: "T",
							rsId: "rs9276202",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32699745,
							"p-value": 3.38e-10,
							start: 32699745,
							alt: "C",
							rsId: "rs9276203",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32699904,
							"p-value": 2.96e-7,
							start: 32699904,
							alt: "T",
							rsId: "rs9276210",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32700741,
							"p-value": 6.19e-8,
							start: 32700741,
							alt: "C",
							rsId: "rs9276229",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32700833,
							"p-value": 4.73e-8,
							start: 32700833,
							alt: "A",
							rsId: "rs2859090",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32702422,
							"p-value": 1.01e-9,
							start: 32702422,
							alt: "A",
							rsId: "rs9276276",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32702449,
							"p-value": 5.18e-8,
							start: 32702449,
							alt: "G",
							rsId: "rs2859078",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32702813,
							"p-value": 9.66e-8,
							start: 32702813,
							alt: "C",
							rsId: "rs9276291",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32704630,
							"p-value": 0.0000134,
							start: 32704630,
							alt: "G",
							rsId: "rs12183007",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32704659,
							"p-value": 2.97e-8,
							start: 32704659,
							alt: "C",
							rsId: "rs9276311",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32704977,
							"p-value": 9.62e-9,
							start: 32704977,
							alt: "T",
							rsId: "rs9276317",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32705248,
							"p-value": 0.0000144,
							start: 32705248,
							alt: "C",
							rsId: "rs13214069",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32705276,
							"p-value": 0.0000106,
							start: 32705276,
							alt: "T",
							rsId: "rs13199787",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32705419,
							"p-value": 1.6e-8,
							start: 32705419,
							alt: "C",
							rsId: "rs9276328",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32705422,
							"p-value": 0.0000119,
							start: 32705422,
							alt: "C",
							rsId: "rs28576901",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32706042,
							"p-value": 4.43e-8,
							start: 32706042,
							alt: "G",
							rsId: "rs7773149",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32706234,
							"p-value": 5.02e-9,
							start: 32706234,
							alt: "A",
							rsId: "rs7773068",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32706334,
							"p-value": 4.82e-9,
							start: 32706334,
							alt: "G",
							rsId: "rs7773694",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32706480,
							"p-value": 5.21e-9,
							start: 32706480,
							alt: "T",
							rsId: "rs7755597",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32706719,
							"p-value": 0.000025,
							start: 32706719,
							alt: "C",
							rsId: "rs7773955",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32706974,
							"p-value": 0.0000256,
							start: 32706974,
							alt: "A",
							rsId: "rs12203644",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32707018,
							"p-value": 4.97e-8,
							start: 32707018,
							alt: "C",
							rsId: "rs9276362",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "A",
							stop: 32707551,
							"p-value": 0.0000145,
							start: 32707551,
							alt: "G",
							rsId: "rs10947337",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32710396,
							"p-value": 0.0000368,
							start: 32710396,
							alt: "A",
							rsId: "rs9276410",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32710552,
							"p-value": 1.57e-8,
							start: 32710552,
							alt: "A",
							rsId: "rs9276412",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "C",
							stop: 32711691,
							"p-value": 3.88e-10,
							start: 32711691,
							alt: "A",
							rsId: "rs16870693",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32712085,
							"p-value": 1.93e-8,
							start: 32712085,
							alt: "T",
							rsId: "rs9276428",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "G",
							stop: 32712104,
							"p-value": 4.74e-8,
							start: 32712104,
							alt: "A",
							rsId: "rs9276429",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQA2",
							ref: "T",
							stop: 32712247,
							"p-value": 4.61e-8,
							start: 32712247,
							alt: "C",
							rsId: "rs9276431",
							entrez_id: 3118,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "C",
							stop: 32718162,
							"p-value": 5.81e-8,
							start: 32718162,
							alt: "T",
							rsId: "rs9276482",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "A",
							stop: 32725193,
							"p-value": 4.09e-8,
							start: 32725193,
							alt: "G",
							rsId: "rs2301271",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "C",
							stop: 32729459,
							"p-value": 2.41e-10,
							start: 32729459,
							alt: "T",
							rsId: "rs2071551",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "C",
							stop: 32729821,
							"p-value": 1.89e-9,
							start: 32729821,
							alt: "A",
							rsId: "rs7768538",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "A",
							stop: 32730012,
							"p-value": 1.08e-9,
							start: 32730012,
							alt: "G",
							rsId: "rs7453920",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DQB2",
							ref: "G",
							stop: 32730086,
							"p-value": 1.78e-9,
							start: 32730086,
							alt: "A",
							rsId: "rs2051549",
							entrez_id: 3120,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "A",
							stop: 32731710,
							"p-value": 0.0000666,
							start: 32731710,
							alt: "G",
							rsId: "rs1978029",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32733931,
							"p-value": 0.0000664,
							start: 32733931,
							alt: "A",
							rsId: "rs9276595",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32735295,
							"p-value": 0.0000538,
							start: 32735295,
							alt: "T",
							rsId: "rs2395264",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32735506,
							"p-value": 0.0000615,
							start: 32735506,
							alt: "G",
							rsId: "rs6457655",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32736103,
							"p-value": 0.0000366,
							start: 32736103,
							alt: "C",
							rsId: "rs9296043",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32736936,
							"p-value": 0.0000617,
							start: 32736936,
							alt: "T",
							rsId: "rs6901084",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32739888,
							"p-value": 4.86e-14,
							start: 32739888,
							alt: "C",
							rsId: "rs1383265",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "A",
							stop: 32739967,
							"p-value": 0.000018,
							start: 32739967,
							alt: "T",
							rsId: "rs1383264",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32757297,
							"p-value": 0.0000131,
							start: 32757297,
							alt: "T",
							rsId: "rs9276711",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32759448,
							"p-value": 0.00000235,
							start: 32759448,
							alt: "A",
							rsId: "rs3948793",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32672135,
							"p-value": 0.0000261,
							start: 32672135,
							alt: "T",
							rsId: "rs17499655",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32763888,
							"p-value": 0.0000173,
							start: 32763888,
							alt: "C",
							rsId: "rs9276726",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32765268,
							"p-value": 0.000022,
							start: 32765268,
							alt: "C",
							rsId: "rs6912002",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32765730,
							"p-value": 0.000019,
							start: 32765730,
							alt: "C",
							rsId: "rs1383259",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "A",
							stop: 32766345,
							"p-value": 0.0000177,
							start: 32766345,
							alt: "G",
							rsId: "rs7383562",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32766593,
							"p-value": 0.0000132,
							start: 32766593,
							alt: "T",
							rsId: "rs7383606",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32766854,
							"p-value": 0.0000108,
							start: 32766854,
							alt: "A",
							rsId: "rs9276734",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32767170,
							"p-value": 0.00000859,
							start: 32767170,
							alt: "G",
							rsId: "rs7382679",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32767432,
							"p-value": 0.0000138,
							start: 32767432,
							alt: "T",
							rsId: "rs7740209",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32767496,
							"p-value": 0.0000148,
							start: 32767496,
							alt: "C",
							rsId: "rs7382714",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "T",
							stop: 32770482,
							"p-value": 0.0000135,
							start: 32770482,
							alt: "C",
							rsId: "rs6899857",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32775001,
							"p-value": 0.0000146,
							start: 32775001,
							alt: "T",
							rsId: "rs6917315",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "C",
							stop: 32776087,
							"p-value": 0.0000105,
							start: 32776087,
							alt: "T",
							rsId: "rs7382649",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32776292,
							"p-value": 0.0000145,
							start: 32776292,
							alt: "A",
							rsId: "rs9276785",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOB",
							ref: "G",
							stop: 32783896,
							"p-value": 0.0000301,
							start: 32783896,
							alt: "A",
							rsId: "rs2621326",
							entrez_id: 3112,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "T",
							stop: 32786882,
							"p-value": 4.06e-8,
							start: 32786882,
							alt: "C",
							rsId: "rs3763355",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "G",
							stop: 32786917,
							"p-value": 1.44e-8,
							start: 32786917,
							alt: "A",
							rsId: "rs3763354",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "T",
							stop: 32788511,
							"p-value": 0.0000112,
							start: 32788511,
							alt: "C",
							rsId: "rs9784758",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "C",
							stop: 32788878,
							"p-value": 1.67e-8,
							start: 32788878,
							alt: "A",
							rsId: "rs9784876",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "G",
							stop: 32804217,
							"p-value": 0.0000642,
							start: 32804217,
							alt: "A",
							rsId: "rs3819714",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "G",
							stop: 32804219,
							"p-value": 0.0000189,
							start: 32804219,
							alt: "T",
							rsId: "rs3819715",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "TAP2",
							ref: "C",
							stop: 32805307,
							"p-value": 9.74e-7,
							start: 32805307,
							alt: "T",
							rsId: "rs2071466",
							entrez_id: 6891,
							chr: "chr6"
						},
						{
							gene_name: "PSMB8",
							ref: "C",
							stop: 32806576,
							"p-value": 0.0000822,
							start: 32806576,
							alt: "T",
							rsId: "rs4148869",
							entrez_id: 5696,
							chr: "chr6"
						},
						{
							gene_name: "PSMB8",
							ref: "T",
							stop: 32806786,
							"p-value": 0.0000642,
							start: 32806786,
							alt: "G",
							rsId: "rs4713598",
							entrez_id: 5696,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "C",
							stop: 32816700,
							"p-value": 0.0000182,
							start: 32816700,
							alt: "A",
							rsId: "rs2071482",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "T",
							stop: 32816998,
							"p-value": 0.0000163,
							start: 32816998,
							alt: "C",
							rsId: "rs12527715",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "T",
							stop: 32817774,
							"p-value": 0.0000368,
							start: 32817774,
							alt: "G",
							rsId: "rs2395269",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "TAP1",
							ref: "T",
							stop: 32819865,
							"p-value": 0.0000263,
							start: 32819865,
							alt: "C",
							rsId: "rs2071481",
							entrez_id: 6890,
							chr: "chr6"
						},
						{
							gene_name: "PSMB9",
							ref: "G",
							stop: 32823567,
							"p-value": 0.0000129,
							start: 32823567,
							alt: "A",
							rsId: "rs991760",
							entrez_id: 5698,
							chr: "chr6"
						},
						{
							gene_name: "PSMB9",
							ref: "C",
							stop: 32825507,
							"p-value": 0.0000072,
							start: 32825507,
							alt: "T",
							rsId: "rs9276815",
							entrez_id: 5698,
							chr: "chr6"
						},
						{
							gene_name: "PPP1R2P1",
							ref: "A",
							stop: 32837737,
							"p-value": 0.0000354,
							start: 32837737,
							alt: "C",
							rsId: "rs17220262",
							entrez_id: 100507444,
							chr: "chr6"
						},
						{
							gene_name: "PPP1R2P1",
							ref: "G",
							stop: 32845672,
							"p-value": 0.0000109,
							start: 32845672,
							alt: "T",
							rsId: "rs4959118",
							entrez_id: 100507444,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "C",
							stop: 32850839,
							"p-value": 0.0000631,
							start: 32850839,
							alt: "T",
							rsId: "rs9276909",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "C",
							stop: 32851701,
							"p-value": 0.0000245,
							start: 32851701,
							alt: "T",
							rsId: "rs4947354",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "T",
							stop: 32852647,
							"p-value": 0.0000137,
							start: 32852647,
							alt: "C",
							rsId: "rs2187689",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "C",
							stop: 32853042,
							"p-value": 0.00000537,
							start: 32853042,
							alt: "A",
							rsId: "rs7767277",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "G",
							stop: 32854697,
							"p-value": 0.0000197,
							start: 32854697,
							alt: "A",
							rsId: "rs10046257",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "A",
							stop: 32859000,
							"p-value": 0.0000326,
							start: 32859000,
							alt: "G",
							rsId: "rs241413",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "G",
							stop: 32865911,
							"p-value": 0.00000115,
							start: 32865911,
							alt: "A",
							rsId: "rs9276915",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "T",
							stop: 32865997,
							"p-value": 0.0000296,
							start: 32865997,
							alt: "C",
							rsId: "rs241404",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "T",
							stop: 32869045,
							"p-value": 0.000028,
							start: 32869045,
							alt: "C",
							rsId: "rs241402",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "G",
							stop: 32871536,
							"p-value": 0.000037,
							start: 32871536,
							alt: "A",
							rsId: "rs241400",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMB",
							ref: "A",
							stop: 32895351,
							"p-value": 0.0000292,
							start: 32895351,
							alt: "G",
							rsId: "rs12526120",
							entrez_id: 3109,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DMA",
							ref: "G",
							stop: 32910877,
							"p-value": 0.0000245,
							start: 32910877,
							alt: "A",
							rsId: "rs16871169",
							entrez_id: 3108,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOA",
							ref: "G",
							stop: 32968339,
							"p-value": 8e-9,
							start: 32968339,
							alt: "C",
							rsId: "rs2894311",
							entrez_id: 3111,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DOA",
							ref: "T",
							stop: 32971150,
							"p-value": 6.74e-9,
							start: 32971150,
							alt: "C",
							rsId: "rs11966070",
							entrez_id: 3111,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 32977420,
							"p-value": 0.0000476,
							start: 32977420,
							alt: "T",
							rsId: "rs381218",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 32998564,
							"p-value": 0.0000046,
							start: 32998564,
							alt: "T",
							rsId: "rs1431396",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33017502,
							"p-value": 0.0000578,
							start: 33017502,
							alt: "A",
							rsId: "rs3130177",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33020777,
							"p-value": 5.33e-7,
							start: 33020777,
							alt: "T",
							rsId: "rs3097662",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33020842,
							"p-value": 0.00000147,
							start: 33020842,
							alt: "G",
							rsId: "rs3128953",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33020849,
							"p-value": 0.00000162,
							start: 33020849,
							alt: "G",
							rsId: "rs3128954",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33020929,
							"p-value": 0.00000194,
							start: 33020929,
							alt: "G",
							rsId: "rs7743129",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33021221,
							"p-value": 0.00000173,
							start: 33021221,
							alt: "G",
							rsId: "rs3128956",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33021256,
							"p-value": 0.00000139,
							start: 33021256,
							alt: "A",
							rsId: "rs3130586",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33021362,
							"p-value": 0.00000114,
							start: 33021362,
							alt: "G",
							rsId: "rs9277138",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33022467,
							"p-value": 0.00000142,
							start: 33022467,
							alt: "G",
							rsId: "rs3097663",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33022487,
							"p-value": 0.00000442,
							start: 33022487,
							alt: "A",
							rsId: "rs3130181",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33022518,
							"p-value": 0.00000165,
							start: 33022518,
							alt: "G",
							rsId: "rs3097664",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33022961,
							"p-value": 9.5e-7,
							start: 33022961,
							alt: "T",
							rsId: "rs9277171",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33023063,
							"p-value": 0.00000173,
							start: 33023063,
							alt: "C",
							rsId: "rs9277174",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33023150,
							"p-value": 0.0000143,
							start: 33023150,
							alt: "T",
							rsId: "rs9277176",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33023162,
							"p-value": 0.000004,
							start: 33023162,
							alt: "T",
							rsId: "rs9277177",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33023265,
							"p-value": 0.00000124,
							start: 33023265,
							alt: "G",
							rsId: "rs9277182",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33024606,
							"p-value": 1.31e-12,
							start: 33024606,
							alt: "G",
							rsId: "rs376877",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33024654,
							"p-value": 3.99e-20,
							start: 33024654,
							alt: "C",
							rsId: "rs3135402",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33025440,
							"p-value": 1.9e-7,
							start: 33025440,
							alt: "C",
							rsId: "rs2116260",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33025740,
							"p-value": 0.00000127,
							start: 33025740,
							alt: "C",
							rsId: "rs7757860",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33025824,
							"p-value": 5.01e-8,
							start: 33025824,
							alt: "A",
							rsId: "rs5025825",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33026110,
							"p-value": 8.47e-20,
							start: 33026110,
							alt: "C",
							rsId: "rs422544",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33026214,
							"p-value": 1.19e-21,
							start: 33026214,
							alt: "A",
							rsId: "rs2395308",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33026246,
							"p-value": 5.88e-23,
							start: 33026246,
							alt: "G",
							rsId: "rs2395309",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33026316,
							"p-value": 8.21e-22,
							start: 33026316,
							alt: "T",
							rsId: "rs2395310",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33026388,
							"p-value": 8.46e-7,
							start: 33026388,
							alt: "A",
							rsId: "rs34889247",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33031677,
							"p-value": 2.51e-21,
							start: 33031677,
							alt: "A",
							rsId: "rs35953215",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33032272,
							"p-value": 4.29e-21,
							start: 33032272,
							alt: "T",
							rsId: "rs17214533",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33032347,
							"p-value": 1.37e-21,
							start: 33032347,
							alt: "G",
							rsId: "rs17220927",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33032636,
							"p-value": 1.92e-21,
							start: 33032636,
							alt: "G",
							rsId: "rs17220961",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33032663,
							"p-value": 3.05e-21,
							start: 33032663,
							alt: "A",
							rsId: "rs17220968",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33032668,
							"p-value": 5.47e-21,
							start: 33032668,
							alt: "G",
							rsId: "rs17214573",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33032975,
							"p-value": 0.00000156,
							start: 33032975,
							alt: "C",
							rsId: "rs7905",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33033022,
							"p-value": 7.54e-22,
							start: 33033022,
							alt: "G",
							rsId: "rs3077",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33034113,
							"p-value": 9.4e-22,
							start: 33034113,
							alt: "C",
							rsId: "rs6899851",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33034815,
							"p-value": 0.00000209,
							start: 33034815,
							alt: "A",
							rsId: "rs1367728",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33034876,
							"p-value": 5.01e-21,
							start: 33034876,
							alt: "C",
							rsId: "rs9469332",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33035771,
							"p-value": 1.45e-7,
							start: 33035771,
							alt: "C",
							rsId: "rs1054025",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33035969,
							"p-value": 5.42e-22,
							start: 33035969,
							alt: "G",
							rsId: "rs3179779",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33036177,
							"p-value": 1.02e-21,
							start: 33036177,
							alt: "G",
							rsId: "rs3180554",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33037104,
							"p-value": 1.05e-21,
							start: 33037104,
							alt: "T",
							rsId: "rs34950776",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33037675,
							"p-value": 2.34e-21,
							start: 33037675,
							alt: "A",
							rsId: "rs10214910",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33039376,
							"p-value": 1.74e-21,
							start: 33039376,
							alt: "T",
							rsId: "rs34624643",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33039484,
							"p-value": 1.19e-21,
							start: 33039484,
							alt: "G",
							rsId: "rs13196639",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33039503,
							"p-value": 4.05e-21,
							start: 33039503,
							alt: "T",
							rsId: "rs34197320",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33039652,
							"p-value": 4.03e-7,
							start: 33039652,
							alt: "T",
							rsId: "rs35979982",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33039755,
							"p-value": 1.9e-21,
							start: 33039755,
							alt: "C",
							rsId: "rs13213265",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33039837,
							"p-value": 1.89e-21,
							start: 33039837,
							alt: "A",
							rsId: "rs36043556",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "G",
							stop: 33040138,
							"p-value": 1.34e-7,
							start: 33040138,
							alt: "A",
							rsId: "rs4582419",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33040596,
							"p-value": 2.17e-21,
							start: 33040596,
							alt: "G",
							rsId: "rs4640928",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33040654,
							"p-value": 3.1e-7,
							start: 33040654,
							alt: "G",
							rsId: "rs6914348",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33040781,
							"p-value": 2.55e-21,
							start: 33040781,
							alt: "G",
							rsId: "rs9380337",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "T",
							stop: 33040877,
							"p-value": 5.77e-22,
							start: 33040877,
							alt: "C",
							rsId: "rs9380339",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "A",
							stop: 33041073,
							"p-value": 7.36e-8,
							start: 33041073,
							alt: "C",
							rsId: "rs9357156",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPA1",
							ref: "C",
							stop: 33041226,
							"p-value": 2.25e-21,
							start: 33041226,
							alt: "T",
							rsId: "rs4247257",
							entrez_id: 3113,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33041734,
							"p-value": 2.04e-11,
							start: 33041734,
							alt: "C",
							rsId: "rs2856830",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33042291,
							"p-value": 1.01e-7,
							start: 33042291,
							alt: "G",
							rsId: "rs9380340",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33042551,
							"p-value": 1.36e-7,
							start: 33042551,
							alt: "T",
							rsId: "rs9296073",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33042598,
							"p-value": 1.17e-7,
							start: 33042598,
							alt: "G",
							rsId: "rs9296074",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33042880,
							"p-value": 8.33e-7,
							start: 33042880,
							alt: "G",
							rsId: "rs987870",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33043526,
							"p-value": 4.53e-7,
							start: 33043526,
							alt: "T",
							rsId: "rs2071350",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33046082,
							"p-value": 7.85e-18,
							start: 33046082,
							alt: "T",
							rsId: "rs2856819",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33048921,
							"p-value": 3.76e-7,
							start: 33048921,
							alt: "G",
							rsId: "rs7770370",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33049211,
							"p-value": 1.58e-18,
							start: 33049211,
							alt: "T",
							rsId: "rs928976",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33049309,
							"p-value": 1.3e-7,
							start: 33049309,
							alt: "G",
							rsId: "rs9378176",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33049384,
							"p-value": 1.16e-7,
							start: 33049384,
							alt: "G",
							rsId: "rs9378177",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33049979,
							"p-value": 7.42e-19,
							start: 33049979,
							alt: "G",
							rsId: "rs9277357",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33050024,
							"p-value": 6.73e-17,
							start: 33050024,
							alt: "A",
							rsId: "rs9277359",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33050045,
							"p-value": 3.89e-18,
							start: 33050045,
							alt: "C",
							rsId: "rs9277361",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050078,
							"p-value": 2.38e-18,
							start: 33050078,
							alt: "G",
							rsId: "rs9277362",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050279,
							"p-value": 3.73e-18,
							start: 33050279,
							alt: "G",
							rsId: "rs9277378",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050325,
							"p-value": 0.0000166,
							start: 33050325,
							alt: "C",
							rsId: "rs9277379",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050441,
							"p-value": 1.85e-18,
							start: 33050441,
							alt: "A",
							rsId: "rs9277382",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050521,
							"p-value": 3.13e-18,
							start: 33050521,
							alt: "T",
							rsId: "rs9277387",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050654,
							"p-value": 9.13e-18,
							start: 33050654,
							alt: "A",
							rsId: "rs3128960",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33050742,
							"p-value": 3.26e-18,
							start: 33050742,
							alt: "A",
							rsId: "rs3128961",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33050877,
							"p-value": 1.2e-17,
							start: 33050877,
							alt: "G",
							rsId: "rs9277393",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33051051,
							"p-value": 5.51e-18,
							start: 33051051,
							alt: "G",
							rsId: "rs9277395",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051139,
							"p-value": 5.06e-17,
							start: 33051139,
							alt: "A",
							rsId: "rs9277396",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051562,
							"p-value": 7.17e-19,
							start: 33051562,
							alt: "A",
							rsId: "rs9277408",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051640,
							"p-value": 8.8e-16,
							start: 33051640,
							alt: "A",
							rsId: "rs9277410",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051683,
							"p-value": 4.95e-18,
							start: 33051683,
							alt: "T",
							rsId: "rs9277411",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051689,
							"p-value": 1.56e-17,
							start: 33051689,
							alt: "T",
							rsId: "rs9277412",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051720,
							"p-value": 4.42e-18,
							start: 33051720,
							alt: "A",
							rsId: "rs9277413",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051749,
							"p-value": 3.02e-17,
							start: 33051749,
							alt: "T",
							rsId: "rs9277418",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33051820,
							"p-value": 6.44e-18,
							start: 33051820,
							alt: "A",
							rsId: "rs9277421",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33051865,
							"p-value": 4.62e-18,
							start: 33051865,
							alt: "C",
							rsId: "rs9277424",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33051910,
							"p-value": 1.41e-18,
							start: 33051910,
							alt: "A",
							rsId: "rs9277426",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33052007,
							"p-value": 9.69e-18,
							start: 33052007,
							alt: "A",
							rsId: "rs9277429",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33052186,
							"p-value": 3.32e-18,
							start: 33052186,
							alt: "G",
							rsId: "rs9277434",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33052250,
							"p-value": 4.7e-18,
							start: 33052250,
							alt: "G",
							rsId: "rs9277437",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33052354,
							"p-value": 2.91e-17,
							start: 33052354,
							alt: "A",
							rsId: "rs9277441",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33053167,
							"p-value": 4.48e-18,
							start: 33053167,
							alt: "C",
							rsId: "rs9277458",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33053307,
							"p-value": 3.17e-18,
							start: 33053307,
							alt: "T",
							rsId: "rs9277463",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33053352,
							"p-value": 3.37e-18,
							start: 33053352,
							alt: "T",
							rsId: "rs9277464",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33053399,
							"p-value": 8.03e-18,
							start: 33053399,
							alt: "C",
							rsId: "rs9277466",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33053682,
							"p-value": 6.22e-18,
							start: 33053682,
							alt: "A",
							rsId: "rs9277471",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33053820,
							"p-value": 1.19e-17,
							start: 33053820,
							alt: "G",
							rsId: "rs9277481",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33053942,
							"p-value": 3.06e-18,
							start: 33053942,
							alt: "C",
							rsId: "rs9277489",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33054074,
							"p-value": 2.17e-19,
							start: 33054074,
							alt: "T",
							rsId: "rs9277496",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "T",
							stop: 33054177,
							"p-value": 1.28e-18,
							start: 33054177,
							alt: "C",
							rsId: "rs9277508",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054207,
							"p-value": 1.02e-17,
							start: 33054207,
							alt: "G",
							rsId: "rs9277509",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33054281,
							"p-value": 6.83e-18,
							start: 33054281,
							alt: "A",
							rsId: "rs9277517",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054457,
							"p-value": 4.22e-18,
							start: 33054457,
							alt: "G",
							rsId: "rs1042544",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "G",
							stop: 33054550,
							"p-value": 9.54e-18,
							start: 33054550,
							alt: "A",
							rsId: "rs931",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33054721,
							"p-value": 5.38e-18,
							start: 33054721,
							alt: "T",
							rsId: "rs9277533",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054807,
							"p-value": 3.65e-17,
							start: 33054807,
							alt: "G",
							rsId: "rs9277534",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "A",
							stop: 33054861,
							"p-value": 6.55e-18,
							start: 33054861,
							alt: "G",
							rsId: "rs9277535",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB1",
							ref: "C",
							stop: 33054890,
							"p-value": 3.3e-18,
							start: 33054890,
							alt: "T",
							rsId: "rs9277536",
							entrez_id: 3115,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33055009,
							"p-value": 4.66e-18,
							start: 33055009,
							alt: "A",
							rsId: "rs9277537",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33055079,
							"p-value": 8.63e-19,
							start: 33055079,
							alt: "G",
							rsId: "rs9277539",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33055247,
							"p-value": 3.71e-17,
							start: 33055247,
							alt: "C",
							rsId: "rs9277542",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33055323,
							"p-value": 3.57e-18,
							start: 33055323,
							alt: "T",
							rsId: "rs9277545",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33055346,
							"p-value": 8.4e-18,
							start: 33055346,
							alt: "G",
							rsId: "rs9277546",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33055419,
							"p-value": 2.55e-17,
							start: 33055419,
							alt: "G",
							rsId: "rs9277549",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33055780,
							"p-value": 7.91e-18,
							start: 33055780,
							alt: "T",
							rsId: "rs3128963",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33055818,
							"p-value": 2.64e-18,
							start: 33055818,
							alt: "G",
							rsId: "rs3128964",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33055899,
							"p-value": 0.0000054,
							start: 33055899,
							alt: "A",
							rsId: "rs3128965",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33055946,
							"p-value": 0.000019,
							start: 33055946,
							alt: "A",
							rsId: "rs3128966",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33056069,
							"p-value": 4.83e-18,
							start: 33056069,
							alt: "A",
							rsId: "rs3117229",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33056207,
							"p-value": 1.74e-18,
							start: 33056207,
							alt: "T",
							rsId: "rs3130186",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33056405,
							"p-value": 3.71e-18,
							start: 33056405,
							alt: "T",
							rsId: "rs3130187",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33056435,
							"p-value": 5.88e-18,
							start: 33056435,
							alt: "T",
							rsId: "rs3117228",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33056566,
							"p-value": 5.18e-18,
							start: 33056566,
							alt: "C",
							rsId: "rs3091281",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33056962,
							"p-value": 1.47e-7,
							start: 33056962,
							alt: "T",
							rsId: "rs3097649",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33057013,
							"p-value": 1.28e-18,
							start: 33057013,
							alt: "C",
							rsId: "rs9277567",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33057244,
							"p-value": 2.55e-18,
							start: 33057244,
							alt: "G",
							rsId: "rs3091284",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33057440,
							"p-value": 1.59e-18,
							start: 33057440,
							alt: "T",
							rsId: "rs3097650",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33057711,
							"p-value": 3.85e-18,
							start: 33057711,
							alt: "A",
							rsId: "rs3117225",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33057835,
							"p-value": 3.3e-18,
							start: 33057835,
							alt: "T",
							rsId: "rs3097652",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33058718,
							"p-value": 2.29e-7,
							start: 33058718,
							alt: "A",
							rsId: "rs2068204",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33058952,
							"p-value": 4.08e-7,
							start: 33058952,
							alt: "A",
							rsId: "rs10484569",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33059262,
							"p-value": 6.41e-18,
							start: 33059262,
							alt: "C",
							rsId: "rs2179919",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33059669,
							"p-value": 0.00000806,
							start: 33059669,
							alt: "T",
							rsId: "rs2281390",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33059796,
							"p-value": 0.0000198,
							start: 33059796,
							alt: "G",
							rsId: "rs2281389",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33059996,
							"p-value": 1.54e-18,
							start: 33059996,
							alt: "G",
							rsId: "rs3128917",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33060064,
							"p-value": 2.55e-18,
							start: 33060064,
							alt: "A",
							rsId: "rs3117223",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33060118,
							"p-value": 1.83e-7,
							start: 33060118,
							alt: "A",
							rsId: "rs2281388",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33060870,
							"p-value": 0.0000131,
							start: 33060870,
							alt: "T",
							rsId: "rs2295119",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33060949,
							"p-value": 1.02e-17,
							start: 33060949,
							alt: "T",
							rsId: "rs3117222",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33061098,
							"p-value": 0.00001,
							start: 33061098,
							alt: "C",
							rsId: "rs3128918",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33061690,
							"p-value": 1.99e-18,
							start: 33061690,
							alt: "C",
							rsId: "rs3130190",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33061947,
							"p-value": 1.78e-18,
							start: 33061947,
							alt: "T",
							rsId: "rs3117221",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33062587,
							"p-value": 2.28e-18,
							start: 33062587,
							alt: "A",
							rsId: "rs3117219",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33062715,
							"p-value": 0.000012,
							start: 33062715,
							alt: "A",
							rsId: "rs3117218",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33062822,
							"p-value": 5.6e-18,
							start: 33062822,
							alt: "G",
							rsId: "rs2144016",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33062889,
							"p-value": 3.92e-19,
							start: 33062889,
							alt: "A",
							rsId: "rs2144015",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33063196,
							"p-value": 3.93e-18,
							start: 33063196,
							alt: "G",
							rsId: "rs2179916",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33063272,
							"p-value": 1.51e-18,
							start: 33063272,
							alt: "T",
							rsId: "rs3130197",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33063931,
							"p-value": 3.32e-18,
							start: 33063931,
							alt: "G",
							rsId: "rs3130198",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33064451,
							"p-value": 4.11e-18,
							start: 33064451,
							alt: "A",
							rsId: "rs3117214",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33064598,
							"p-value": 0.0000288,
							start: 33064598,
							alt: "A",
							rsId: "rs3130200",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33064786,
							"p-value": 1.62e-18,
							start: 33064786,
							alt: "G",
							rsId: "rs7757520",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33065676,
							"p-value": 1.48e-17,
							start: 33065676,
							alt: "G",
							rsId: "rs2395316",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33067211,
							"p-value": 1.09e-18,
							start: 33067211,
							alt: "T",
							rsId: "rs2395319",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33070749,
							"p-value": 1.38e-18,
							start: 33070749,
							alt: "A",
							rsId: "rs3128921",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33071600,
							"p-value": 0.0000117,
							start: 33071600,
							alt: "A",
							rsId: "rs3128925",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33071708,
							"p-value": 0.000051,
							start: 33071708,
							alt: "A",
							rsId: "rs3129196",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33072172,
							"p-value": 2.5e-7,
							start: 33072172,
							alt: "G",
							rsId: "rs4282438",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33072266,
							"p-value": 0.0000155,
							start: 33072266,
							alt: "T",
							rsId: "rs2064478",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33072539,
							"p-value": 4.85e-8,
							start: 33072539,
							alt: "T",
							rsId: "rs9296079",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33072729,
							"p-value": 0.000036,
							start: 33072729,
							alt: "T",
							rsId: "rs3130210",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33073068,
							"p-value": 0.0000171,
							start: 33073068,
							alt: "G",
							rsId: "rs3117236",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33073322,
							"p-value": 1.24e-17,
							start: 33073322,
							alt: "G",
							rsId: "rs2064476",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33073515,
							"p-value": 0.0000225,
							start: 33073515,
							alt: "A",
							rsId: "rs2064473",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33073789,
							"p-value": 5.54e-7,
							start: 33073789,
							alt: "C",
							rsId: "rs17221241",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33073904,
							"p-value": 7.2e-8,
							start: 33073904,
							alt: "T",
							rsId: "rs9368752",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33073984,
							"p-value": 0.0000238,
							start: 33073984,
							alt: "G",
							rsId: "rs3117234",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33074569,
							"p-value": 0.0000281,
							start: 33074569,
							alt: "G",
							rsId: "rs3117232",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33074908,
							"p-value": 1.84e-18,
							start: 33074908,
							alt: "G",
							rsId: "rs3117231",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33075443,
							"p-value": 0.0000313,
							start: 33075443,
							alt: "T",
							rsId: "rs910320",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33075635,
							"p-value": 0.0000337,
							start: 33075635,
							alt: "G",
							rsId: "rs3117230",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33076539,
							"p-value": 3.53e-7,
							start: 33076539,
							alt: "T",
							rsId: "rs9296080",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33079166,
							"p-value": 6.98e-7,
							start: 33079166,
							alt: "T",
							rsId: "rs9380343",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33079385,
							"p-value": 4.66e-8,
							start: 33079385,
							alt: "T",
							rsId: "rs12174662",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33079476,
							"p-value": 7.66e-17,
							start: 33079476,
							alt: "A",
							rsId: "rs9394133",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33079689,
							"p-value": 7.79e-7,
							start: 33079689,
							alt: "T",
							rsId: "rs9380344",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33079812,
							"p-value": 0.00000145,
							start: 33079812,
							alt: "G",
							rsId: "rs6937061",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33080360,
							"p-value": 1.42e-7,
							start: 33080360,
							alt: "G",
							rsId: "rs9348906",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33080799,
							"p-value": 0.00000725,
							start: 33080799,
							alt: "G",
							rsId: "rs9366814",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33081707,
							"p-value": 0.00000283,
							start: 33081707,
							alt: "T",
							rsId: "rs34823653",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33082040,
							"p-value": 0.0000932,
							start: 33082040,
							alt: "C",
							rsId: "rs9277628",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33082267,
							"p-value": 0.0000159,
							start: 33082267,
							alt: "A",
							rsId: "rs9277630",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33082308,
							"p-value": 0.0000191,
							start: 33082308,
							alt: "A",
							rsId: "rs733208",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33082359,
							"p-value": 0.0000178,
							start: 33082359,
							alt: "C",
							rsId: "rs9277632",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33082468,
							"p-value": 0.000019,
							start: 33082468,
							alt: "C",
							rsId: "rs733209",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33082635,
							"p-value": 0.0000167,
							start: 33082635,
							alt: "T",
							rsId: "rs9277637",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33082692,
							"p-value": 0.0000128,
							start: 33082692,
							alt: "C",
							rsId: "rs9277638",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33083134,
							"p-value": 0.00000739,
							start: 33083134,
							alt: "A",
							rsId: "rs2395349",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33083458,
							"p-value": 0.00000229,
							start: 33083458,
							alt: "A",
							rsId: "rs9277641",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "A",
							stop: 33083599,
							"p-value": 0.00000876,
							start: 33083599,
							alt: "G",
							rsId: "rs9277644",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33084596,
							"p-value": 0.000019,
							start: 33084596,
							alt: "A",
							rsId: "rs9277660",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33084641,
							"p-value": 0.0000231,
							start: 33084641,
							alt: "C",
							rsId: "rs9277661",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33085461,
							"p-value": 0.0000297,
							start: 33085461,
							alt: "A",
							rsId: "rs9277664",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33085575,
							"p-value": 0.0000105,
							start: 33085575,
							alt: "A",
							rsId: "rs9277668",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33085851,
							"p-value": 7.87e-10,
							start: 33085851,
							alt: "T",
							rsId: "rs3117039",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33086657,
							"p-value": 0.00000643,
							start: 33086657,
							alt: "A",
							rsId: "rs9277676",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "C",
							stop: 33087972,
							"p-value": 7.94e-7,
							start: 33087972,
							alt: "T",
							rsId: "rs9380346",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33088825,
							"p-value": 0.0000965,
							start: 33088825,
							alt: "A",
							rsId: "rs9277691",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "G",
							stop: 33089196,
							"p-value": 9.67e-8,
							start: 33089196,
							alt: "A",
							rsId: "rs3129286",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33091605,
							"p-value": 0.00000463,
							start: 33091605,
							alt: "C",
							rsId: "rs41288893",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "HLA-DPB2",
							ref: "T",
							stop: 33094663,
							"p-value": 1.56e-8,
							start: 33094663,
							alt: "C",
							rsId: "rs3130231",
							entrez_id: 3116,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33098569,
							"p-value": 0.0000184,
							start: 33098569,
							alt: "T",
							rsId: "rs9277768",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33104652,
							"p-value": 1.09e-8,
							start: 33104652,
							alt: "T",
							rsId: "rs9277839",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33112576,
							"p-value": 7.13e-8,
							start: 33112576,
							alt: "T",
							rsId: "rs3129229",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "G",
							stop: 33112640,
							"p-value": 1.2e-8,
							start: 33112640,
							alt: "T",
							rsId: "rs3129227",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "G",
							stop: 33112936,
							"p-value": 2.76e-8,
							start: 33112936,
							alt: "A",
							rsId: "rs3130149",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "T",
							stop: 33113394,
							"p-value": 8.29e-9,
							start: 33113394,
							alt: "C",
							rsId: "rs3129222",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "A",
							stop: 33116848,
							"p-value": 0.0000972,
							start: 33116848,
							alt: "G",
							rsId: "rs9277898",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "C",
							stop: 33117258,
							"p-value": 1.18e-8,
							start: 33117258,
							alt: "T",
							rsId: "rs3129214",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "A",
							stop: 33122331,
							"p-value": 1.78e-8,
							start: 33122331,
							alt: "G",
							rsId: "rs756440",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "A",
							stop: 33123281,
							"p-value": 0.0000968,
							start: 33123281,
							alt: "G",
							rsId: "rs9277909",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "COL11A2",
							ref: "G",
							stop: 33124069,
							"p-value": 0.00000163,
							start: 33124069,
							alt: "A",
							rsId: "rs3129208",
							entrez_id: 1302,
							chr: "chr6"
						},
						{
							gene_name: "VPS52",
							ref: "C",
							stop: 33194717,
							"p-value": 0.0000518,
							start: 33194717,
							alt: "T",
							rsId: "rs9277946",
							entrez_id: 6293,
							chr: "chr6"
						},
						{
							gene_name: "SYNGAP1",
							ref: "G",
							stop: 33404064,
							"p-value": 0.0000324,
							start: 33404064,
							alt: "A",
							rsId: "rs10807124",
							entrez_id: 8831,
							chr: "chr6"
						},
						{
							gene_name: "BAK1",
							ref: "G",
							stop: 33511229,
							"p-value": 4.7e-7,
							start: 33511229,
							alt: "A",
							rsId: "rs210203",
							entrez_id: 578,
							chr: "chr6"
						},
						{
							gene_name: "ITPR3",
							ref: "T",
							stop: 33564412,
							"p-value": 0.0000697,
							start: 33564412,
							alt: "C",
							rsId: "rs6457736",
							entrez_id: 3710,
							chr: "chr6"
						},
						{
							gene_name: "IP6K3",
							ref: "A",
							stop: 33677400,
							"p-value": 9.54e-7,
							start: 33677400,
							alt: "G",
							rsId: "rs1555965",
							entrez_id: 117283,
							chr: "chr6"
						},
						{
							gene_name: "IP6K3",
							ref: "C",
							stop: 33690796,
							"p-value": 0.00000295,
							start: 33690796,
							alt: "T",
							rsId: "rs4713668",
							entrez_id: 117283,
							chr: "chr6"
						},
						{
							gene_name: "MLN",
							ref: "A",
							stop: 33762625,
							"p-value": 0.00000329,
							start: 33762625,
							alt: "G",
							rsId: "rs11758463",
							entrez_id: 4295,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "C",
							stop: 33791515,
							"p-value": 0.0000261,
							start: 33791515,
							alt: "T",
							rsId: "rs767896",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "A",
							stop: 33852948,
							"p-value": 0.00000489,
							start: 33852948,
							alt: "G",
							rsId: "rs4711363",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "G",
							stop: 33865343,
							"p-value": 0.00000293,
							start: 33865343,
							alt: "T",
							rsId: "rs10947465",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "G",
							stop: 33869806,
							"p-value": 0.00000104,
							start: 33869806,
							alt: "A",
							rsId: "rs9296102",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "A",
							stop: 33872616,
							"p-value": 0.00000951,
							start: 33872616,
							alt: "G",
							rsId: "rs9368782",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "MIR1275",
							ref: "C",
							stop: 33873699,
							"p-value": 0.0000199,
							start: 33873699,
							alt: "T",
							rsId: "rs4563711",
							entrez_id: 100302123,
							chr: "chr6"
						},
						{
							gene_name: "BMP5",
							ref: "T",
							stop: 55618190,
							"p-value": 0.0000476,
							start: 55618190,
							alt: "C",
							rsId: "rs7773142",
							entrez_id: 653,
							chr: "chr6"
						},
						{
							gene_name: "DST",
							ref: "A",
							stop: 56127621,
							"p-value": 0.0000347,
							start: 56127621,
							alt: "G",
							rsId: "rs1925163",
							entrez_id: 667,
							chr: "chr6"
						},
						{
							gene_name: "PLEKHG1",
							ref: "C",
							stop: 150925101,
							"p-value": 0.000052,
							start: 150925101,
							alt: "G",
							rsId: "rs1546096",
							entrez_id: 57480,
							chr: "chr6"
						},
						{
							gene_name: "MAGI2",
							ref: "G",
							stop: 78230996,
							"p-value": 0.0000105,
							start: 78230996,
							alt: "A",
							rsId: "rs319875",
							entrez_id: 9863,
							chr: "chr7"
						},
						{
							gene_name: "AGK",
							ref: "T",
							stop: 140728682,
							"p-value": 0.0000674,
							start: 140728682,
							alt: "C",
							rsId: "rs2688430",
							entrez_id: 55750,
							chr: "chr7"
						},
						{
							gene_name: "MCPH1",
							ref: "T",
							stop: 5085053,
							"p-value": 0.0000389,
							start: 5085053,
							alt: "C",
							rsId: "rs10089783",
							entrez_id: 79648,
							chr: "chr8"
						},
						{
							gene_name: "BNC2",
							ref: "A",
							stop: 16658915,
							"p-value": 0.0000413,
							start: 16658915,
							alt: "G",
							rsId: "rs10810584",
							entrez_id: 54796,
							chr: "chr9"
						},
						{
							gene_name: "CTNNA3",
							ref: "A",
							stop: 66984552,
							"p-value": 0.0000184,
							start: 66984552,
							alt: "G",
							rsId: "rs9414881",
							entrez_id: 29119,
							chr: "chr10"
						},
						{
							gene_name: "COL13A1",
							ref: "G",
							stop: 71427874,
							"p-value": 0.000005,
							start: 71427874,
							alt: "A",
							rsId: "rs2616068",
							entrez_id: 1305,
							chr: "chr10"
						},
						{
							gene_name: "C11orf68",
							ref: "G",
							stop: 65669903,
							"p-value": 0.0000694,
							start: 65669903,
							alt: "A",
							rsId: "rs9919533",
							entrez_id: 83638,
							chr: "chr11"
						},
						{
							gene_name: "GRAMD1B",
							ref: "G",
							stop: 123182169,
							"p-value": 0.0000927,
							start: 123182169,
							alt: "A",
							rsId: "rs10750236",
							entrez_id: 57476,
							chr: "chr11"
						},
						{
							gene_name: "KLRA1P",
							ref: "G",
							stop: 10747616,
							"p-value": 0.0000131,
							start: 10747616,
							alt: "A",
							rsId: "rs17809421",
							entrez_id: 10748,
							chr: "chr12"
						},
						{
							gene_name: "MAGOHB",
							ref: "C",
							stop: 10762757,
							"p-value": 0.0000189,
							start: 10762757,
							alt: "T",
							rsId: "rs10845181",
							entrez_id: 55110,
							chr: "chr12"
						},
						{
							gene_name: "CNOT2",
							ref: "G",
							stop: 70429915,
							"p-value": 0.0000633,
							start: 70429915,
							alt: "A",
							rsId: "rs11178054",
							entrez_id: 4848,
							chr: "chr12"
						},
						{
							gene_name: "TMEM132C",
							ref: "G",
							stop: 127839964,
							"p-value": 0.0000604,
							start: 127839964,
							alt: "A",
							rsId: "rs7966852",
							entrez_id: 92293,
							chr: "chr12"
						},
						{
							gene_name: "TMEM132C",
							ref: "G",
							stop: 127840232,
							"p-value": 0.0000985,
							start: 127840232,
							alt: "A",
							rsId: "rs7967228",
							entrez_id: 92293,
							chr: "chr12"
						},
						{
							gene_name: "SGCG",
							ref: "G",
							stop: 22542740,
							"p-value": 0.0000743,
							start: 22542740,
							alt: "A",
							rsId: "rs7319718",
							entrez_id: 6445,
							chr: "chr13"
						},
						{
							ref: "C",
							stop: 40795744,
							"p-value": 0.0000175,
							start: 40795744,
							alt: "T",
							rsId: "rs7319395",
							chr: "chr13"
						},
						{
							gene_name: "PCDH9",
							ref: "T",
							stop: 64556345,
							"p-value": 0.0000851,
							start: 64556345,
							alt: "C",
							rsId: "rs11842829",
							entrez_id: 5101,
							chr: "chr13"
						},
						{
							gene_name: "NALCN",
							ref: "A",
							stop: 101603150,
							"p-value": 0.0000161,
							start: 101603150,
							alt: "G",
							rsId: "rs2803214",
							entrez_id: 259232,
							chr: "chr13"
						},
						{
							gene_name: "C14orf177",
							ref: "C",
							stop: 98935548,
							"p-value": 0.0000713,
							start: 98935548,
							alt: "T",
							rsId: "rs17096983",
							entrez_id: 283598,
							chr: "chr14"
						},
						{
							gene_name: "C14orf177",
							ref: "T",
							stop: 98984324,
							"p-value": 0.0000964,
							start: 98984324,
							alt: "C",
							rsId: "rs1951102",
							entrez_id: 283598,
							chr: "chr14"
						},
						{
							gene_name: "ALOX12",
							ref: "A",
							stop: 6847073,
							"p-value": 0.0000688,
							start: 6847073,
							alt: "G",
							rsId: "rs2135845",
							entrez_id: 239,
							chr: "chr17"
						},
						{
							gene_name: "ASIC2",
							ref: "C",
							stop: 32193700,
							"p-value": 0.0000226,
							start: 32193700,
							alt: "T",
							rsId: "rs17783671",
							entrez_id: 40,
							chr: "chr17"
						},
						{
							gene_name: "ASIC2",
							ref: "T",
							stop: 32200518,
							"p-value": 0.00000807,
							start: 32200518,
							alt: "G",
							rsId: "rs1041719",
							entrez_id: 40,
							chr: "chr17"
						},
						{
							gene_name: "ASIC2",
							ref: "C",
							stop: 32201521,
							"p-value": 0.0000597,
							start: 32201521,
							alt: "A",
							rsId: "rs915484",
							entrez_id: 40,
							chr: "chr17"
						},
						{
							gene_name: "DLGAP1",
							ref: "C",
							stop: 3774446,
							"p-value": 0.0000659,
							start: 3774446,
							alt: "T",
							rsId: "rs8097867",
							entrez_id: 9229,
							chr: "chr18"
						},
						{
							gene_name: "RPL12",
							ref: "A",
							stop: 53317873,
							"p-value": 0.0000162,
							start: 53317873,
							alt: "G",
							rsId: "rs6068956",
							entrez_id: 6136,
							chr: "chr20"
						},
						{
							gene_name: "RPL12",
							ref: "G",
							stop: 53328421,
							"p-value": 0.0000445,
							start: 53328421,
							alt: "T",
							rsId: "rs2206914",
							entrez_id: 6136,
							chr: "chr20"
						},
						{
							gene_name: "BACH1",
							ref: "A",
							stop: 30556454,
							"p-value": 0.0000748,
							start: 30556454,
							alt: "G",
							rsId: "rs9983214",
							entrez_id: 571,
							chr: "chr21"
						},
						{
							gene_name: "EP300",
							ref: "G",
							stop: 41498627,
							"p-value": 0.0000606,
							start: 41498627,
							alt: "A",
							rsId: "rs7286979",
							entrez_id: 2033,
							chr: "chr22"
						},
						{
							gene_name: "L3MBTL2",
							ref: "A",
							stop: 41597377,
							"p-value": 0.0000616,
							start: 41597377,
							alt: "C",
							rsId: "rs8138990",
							entrez_id: 83746,
							chr: "chr22"
						},
						{
							gene_name: "C22orf34",
							ref: "C",
							stop: 49790537,
							"p-value": 0.0000236,
							start: 49790537,
							alt: "T",
							rsId: "rs1108785",
							entrez_id: 348645,
							chr: "chr22"
						}
					]
				}
			}
		}
	]
};
var data = {
	dataset: dataset$1
};

const pagination = async function (shadowRoot, params, overThreshArray) {
  // const root;
  const pageBtns = shadowRoot.querySelectorAll(".page-btn");
  const prevBtn = shadowRoot.querySelector("#prevBtn");
  const nextBtn = shadowRoot.querySelector("#nextBtn");
  const firstBtn = shadowRoot.querySelector("#firstBtn");
  const lastBtn = shadowRoot.querySelector("#lastBtn");

  let currentPage = 1;
  const recordsPerPage = params["recordsPerPage"];
  const totalPage = Math.ceil(overThreshArray.length / recordsPerPage);

  // this.init = function () {
  updateTable(1);
  addEventListeners();
  // };

  function surroundingPages() {
    let start, end;
    if (currentPage <= 3) {
      start = 1;
      end = Math.min(start + 4, totalPage);
    } else if (totalPage - currentPage <= 3) {
      end = totalPage;
      start = Math.max(end - 4, 1);
    } else {
      start = Math.max(currentPage - 2, 1);
      end = Math.min(currentPage + 2, totalPage);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  function addEventListeners() {
    prevBtn.addEventListener("click", () => {
      updateTable(currentPage - 1);
    });
    nextBtn.addEventListener("click", () => {
      updateTable(currentPage + 1);
    });
    firstBtn.addEventListener("click", () => {
      updateTable(1);
    });
    lastBtn.addEventListener("click", () => {
      updateTable(totalPage);
    });
  }

  function updateTable(page) {
    currentPage = page;
    const listingTable = shadowRoot.querySelector("#listingTable");
    listingTable.innerHTML = "";
    const tableHeadArray = [
      "gene_name",
      "rsId",
      "chr",
      "pos",
      "ref",
      "alt",
      "p-value",
    ];

    for (
      let i = (page - 1) * recordsPerPage;
      i < page * recordsPerPage && i < overThreshArray.length;
      i++
    ) {
      const tr = document.createElement("tr");
      for (let j = 0; j < tableHeadArray.length; j++) {
        const td = document.createElement("td");
        if (overThreshArray[i][`${tableHeadArray[j]}`]) {
          if (tableHeadArray[j] === "gene_name") {
            const displayedGeneName =
              overThreshArray[i][`${tableHeadArray[j]}`];
            td.innerHTML = `<a target="_blank" href="https://mgend.med.kyoto-u.ac.jp/gene/info/${overThreshArray[i].entrez_id}#locuszoom-link">${displayedGeneName}</a>`;
          } else {
            td.innerText = overThreshArray[i][`${tableHeadArray[j]}`];
          }
        } else {
          td.innerText = "";
        }
        tr.appendChild(td);
      }
      listingTable.appendChild(tr);
    }
    updatePagination();
  }

  function updatePagination() {
    const pageNumber = shadowRoot.querySelector("#pageNumber");
    pageNumber.innerHTML = "";
    const surroundingPage = surroundingPages();

    for (const i of surroundingPage) {
      const pageNumBtn = document.createElement("span");
      pageNumBtn.innerText = i;
      pageNumBtn.setAttribute("class", "page-btn");

      if (i === currentPage) {
        pageNumBtn.classList.add("current");
      }

      pageNumBtn.addEventListener("click", () => {
        updateTable(i);
      });
      pageNumber.append(pageNumBtn);
    }
    pageBtns.forEach((pageBtns) => (pageBtns.style.display = "flex"));

    if (currentPage === 1) {
      firstBtn.style.display = "none";
      prevBtn.style.display = "none";
    }

    if (currentPage === totalPage) {
      nextBtn.style.display = "none";
      lastBtn.style.display = "none";
    }
  }
};

//when you put json url
// console.log(params["data-url"]]);
// const dataset = await getFormatedJson(
//   params["data-url"],
//   stanza.root.querySelector("#chart")
// );
// console.log("dataset", dataset);

// study name(single per a json)
const dataset = data.dataset;
const studyName = Object.keys(dataset)[0];

//project data and project names (single per a json)
const project = Object.values(dataset)[0][0];
const projectName = Object.keys(project)[0];

// stage data and stage names
const stageData = Object.values(project)[0];
let stageNames = Object.keys(stageData);

const fixedStageNamesOrder = [
  "discovery",
  "replication",
  "combined",
  "meta analysis",
  "not provided",
];
stageNames = fixedStageNamesOrder.filter((stageName) => {
  if (stageData[stageName]) {
    return true;
  } else {
    return false;
  }
});

//add stage information to each plot
for (let i = 0; i < stageNames.length; i++) {
  for (let j = 0; j < stageData[stageNames[i]].variants.length; j++) {
    stageData[stageNames[i]].variants[j].stage = stageNames[i];
  }
}

//combine variants to display
let totalVariants = [];
stageNames.forEach(
  (stage) => (totalVariants = totalVariants.concat(stageData[stage].variants))
);

// get stage information
const getVariants = () => {
  let variantsArray = [];
  stageNames.forEach((stage) => {
    if (stageData[stage].checked) {
      variantsArray = variantsArray.concat(stageData[stage].variants);
    }
  });
  return variantsArray;
};
let variants = totalVariants; //init

class ManhattanPlot extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "manhattan_plot"),
      downloadPngMenuItem(this, "manhattan_plot"),
    ];
  }

  async render() {
    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        studyName,
        projectName,
      },
    });

    //append checkbox and its conditions to filter stages
    const stageList = this.root.querySelector("#stageList");
    const firstConditionList = this.root.querySelector("#firstConditionList");
    const secondConditionList = this.root.querySelector("#secondConditionList");

    let td, input, label;
    for (let i = 0; i < stageNames.length; i++) {
      td = document.createElement("td");
      input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("class", "stage-btn");
      input.setAttribute("id", `${stageNames[i]}Btn`);
      input.setAttribute("name", "stage");
      input.setAttribute("value", stageNames[i]);
      input.setAttribute("checked", true);
      input.setAttribute("data-stage", stageNames[i]);
      label = document.createElement("label");
      label.textContent = stageNames[i];
      label.setAttribute("for", `${stageNames[i]}Btn`);
      label.setAttribute("data-stage", stageNames[i]);
      stageList.appendChild(td);
      td.appendChild(input);
      td.appendChild(label);
      stageData[stageNames[i]].checked = true;
    }

    firstConditionList.insertAdjacentHTML(
      "beforeend",
      stageNames
        .map(
          (stage) =>
            `<td class="condition-key">${stageData[stage].condition1}</td>`
        )
        .join("")
    );
    secondConditionList.insertAdjacentHTML(
      "beforeend",
      stageNames
        .map(
          (stage) =>
            `<td class="condition-key">${stageData[stage].condition2}</td>`
        )
        .join("")
    );

    // adjust data
    for (let i = 0; i < variants.length; i++) {
      // convert chromosome data from 'chrnum' to 'num'
      let chr = variants[i].chr;
      chr = chr.replace("chr", "");
      variants[i].chr = chr;

      variants[i]["p-value"];

      variants[i]["stop"];
    }

    if (typeof variants === "object") {
      draw(this, this.params);
    }
  }
}

async function draw(stanza, params) {
  const width = 800;
  const height = 400;
  const marginLeft = 40;
  const marginBottom = 30;
  const paddingTop = 10;
  const areaWidth = width - marginLeft;
  const areaHeight = height - marginBottom;
  const drawAreaHeight = areaHeight - paddingTop;

  const chartElement = stanza.root.querySelector("#chart");
  const controlElement = stanza.root.querySelector("#control");
  let overThreshArray;

  if (params.lowThresh === "") {
    params.lowThresh = 4;
  }
  if (params.highThresh === "") {
    params.highThresh = Infinity;
  }
  if (params.chromosomeKey === "") {
    params.chromosomeKey = "chr";
  }
  if (params.positionKey === "") {
    params.positionKey = "position";
  }
  if (params.pValueKey === "") {
    params.pValueKey = "p-value";
  }

  const lowThresh = parseFloat(params.lowThresh);
  let highThresh = parseFloat(params.highThresh);

  const chromosomeKey = params.chromosomeKey;
  const positionKey = params.positionKey;
  const pValueKey = params.pValueKey;

  const chromosomes = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "X",
    "Y",
  ];

  const chromosomeNtLength = {
    hg38: {
      1: 248956422,
      2: 242193529,
      3: 198295559,
      4: 190214555,
      5: 181538259,
      6: 170805979,
      7: 159345973,
      8: 145138636,
      9: 138394717,
      10: 133797422,
      11: 135086622,
      12: 133275309,
      13: 114364328,
      14: 107043718,
      15: 101991189,
      16: 90338345,
      17: 83257441,
      18: 80373285,
      19: 58617616,
      20: 64444167,
      21: 46709983,
      22: 50818468,
      X: 156040895,
      Y: 57227415,
    },
  };

  const chromosomeSumLength = {};
  Object.keys(chromosomeNtLength).forEach((ref) => {
    chromosomeSumLength[ref] = Object.keys(chromosomeNtLength[ref]).reduce(
      (acc, chr) => chromosomeNtLength[ref][chr] + acc,
      0
    );
  });

  const chromosomeArray = Object.values(chromosomeNtLength.hg38);
  const chromosomeStartPosition = {};
  let startPos = 0;
  for (let i = 0; i < chromosomeArray.length; i++) {
    const chr = chromosomes[i];
    if (chr === "1") {
      chromosomeStartPosition[chr] = 0;
    } else {
      startPos += chromosomeArray[i - 1];
      chromosomeStartPosition[chr] = startPos;
    }
  }

  const canvasDiv = select(chartElement)
    .append("div")
    .style("width", areaWidth + "px")
    .style("overflow", "hidden")
    .style("position", "absolute")
    .style("left", marginLeft + "px");
  const canvas = canvasDiv
    .append("canvas")
    .attr("width", areaWidth)
    .attr("height", areaHeight)
    .style("position", "relative");
  const svg = select(chartElement)
    .append("svg")
    .attr("width", width)
    .attr("height", height + 10);
  const axisGroup = svg.append("g").attr("id", "axis");
  const sliderShadowGroup = svg.append("g").attr("id", "slider_shadow");
  const xLabelGroup = svg.append("g").attr("id", "x_label");
  const yLabelGroup = svg.append("g").attr("id", "y_label");
  const yTitle = svg.append("g").attr("id", "y_title");
  const plotGroup = svg.append("g").attr("id", "plot_group");
  const threshlineGroup = svg.append("g").attr("id", "thresh_line");
  const tooltip = select(chartElement)
    .append("div")
    .attr("class", "tooltip");

  let horizonalRange = []; // [begin position, end position]
  let verticalRange = []; // [begin position, end position]
  let maxLogP = 0;
  let maxLogPInt;
  let total;

  const getRangeLength = function (targetRange) {
    return targetRange[1] - targetRange[0];
  };

  // axis line
  axisGroup
    .append("path")
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width + " Z")
    .attr("class", "axis-line");
  axisGroup
    .append("path")
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight + " Z")
    .attr("class", "axis-line");
  yTitle
    .append("text")
    .text("-log₁₀(p-value)")
    .attr("class", "axis-title")
    .attr("font-size", "14")
    .attr("x", -areaHeight / 2)
    .attr("y", marginLeft - 32)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle");

  // select range by drag
  let horizonalDragBegin = false;
  let verticalDragBegin = false;

  svg
    .on("mousedown", function (e) {
      if (pointer(e)[1] <= areaHeight) {
        horizonalDragBegin = pointer(e)[0];
        verticalDragBegin =
          pointer(e)[1] <= paddingTop ? paddingTop : pointer(e)[1];
        svg
          .append("rect")
          .attr("fill", "rgba(128, 128, 128, 0.2)")
          .attr("stroke", "#000000")
          .attr("x", horizonalDragBegin)
          .attr("y", verticalDragBegin)
          .attr("width", 0)
          .attr("height", 0)
          .attr("id", "selector");
      }
    })
    .on("mousemove", function (e) {
      if (horizonalDragBegin) {
        const horizonalDragEnd = pointer(e)[0];
        if (horizonalDragBegin < horizonalDragEnd) {
          svg
            .select("#selector")
            .attr("width", horizonalDragEnd - horizonalDragBegin);
        } else {
          svg
            .select("#selector")
            .attr("x", horizonalDragEnd)
            .attr("width", horizonalDragBegin - horizonalDragEnd);
        }
      }
      if (verticalDragBegin) {
        const verticalDragEnd =
          pointer(e)[1] > areaHeight ? areaHeight : pointer(e)[1];
        if (verticalDragBegin < verticalDragEnd) {
          svg
            .select("#selector")
            .attr("height", verticalDragEnd - verticalDragBegin);
        } else {
          svg
            .select("#selector")
            .attr("y", verticalDragEnd)
            .attr("height", verticalDragBegin - verticalDragEnd);
        }
      }
    })
    .on("mouseup", function (e) {
      const horizonalRangeLength = getRangeLength(horizonalRange);
      const verticalRangeLength = getRangeLength(verticalRange);
      if (horizonalDragBegin) {
        const horizonalDragEnd = pointer(e)[0];
        // re-render
        if (horizonalDragBegin > horizonalDragEnd) {
          horizonalRange = [
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
          ];
        } else if (horizonalDragEnd > horizonalDragBegin) {
          horizonalRange = [
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
          ];
        }
        svg.select("#selector").remove();
        reRender();
        horizonalDragBegin = false;
      }
      if (verticalDragBegin) {
        const verticalDragEnd =
          pointer(e)[1] > areaHeight ? areaHeight : pointer(e)[1];
        // re-render
        if (verticalDragBegin > verticalDragEnd) {
          const maxLog =
            verticalRange[1] -
            ((verticalDragEnd - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          const minLog =
            verticalRange[1] -
            ((verticalDragBegin - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          verticalRange = [minLog, maxLog];
        } else if (verticalDragEnd - verticalDragBegin > 0) {
          const maxLog =
            verticalRange[1] -
            ((verticalDragBegin - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          const minLog =
            verticalRange[1] -
            ((verticalDragEnd - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          verticalRange = [minLog, maxLog];
        }
        reRender();
        pagination(stanza.root, params, overThreshArray);
        svg.select("#selector").remove();
        horizonalDragBegin = false;
        verticalDragBegin = false;
      }
    });

  // slider
  const ctrlSvg = select(controlElement)
    .append("svg")
    .attr("id", "slider_container")
    .attr("width", width)
    .attr("height", 24);
  ctrlSvg
    .append("text")
    .text("chr:")
    .attr("class", "info-key")
    .attr("fill", "#99ACB2")
    .attr("x", 4)
    .attr("y", 16)
    .attr("width", 10)
    .attr("height", 23);
  ctrlSvg
    .append("rect")
    .attr("x", marginLeft)
    .attr("y", 1)
    .attr("width", areaWidth)
    .attr("height", 23)
    .attr("fill", "#FFFFFF")
    .attr("stroke", "#99ACB2")
    .attr("stroke-width", "1px");
  ctrlSvg
    .append("rect")
    .attr("id", "slider")
    .attr("x", marginLeft)
    .attr("y", 1)
    .attr("width", areaWidth)
    .attr("height", 22)
    .attr("fill", "var(--togostanza-slider-color)")
    .attr("stroke", "#99ACB2")
    .call(
      drag()
        .on("start", function (e) {
          horizonalDragBegin = e.x;
        })
        .on("drag", function (e) {
          if (horizonalDragBegin) {
            const slider = ctrlSvg.select("rect#slider");
            let delta = e.x - horizonalDragBegin;
            if (parseFloat(slider.attr("x")) + delta < marginLeft) {
              delta = (parseFloat(slider.attr("x")) - marginLeft) * -1;
            } else if (
              parseFloat(slider.attr("x")) +
                parseFloat(slider.attr("width")) +
                delta >
              width
            ) {
              delta =
                width -
                (parseFloat(slider.attr("x")) +
                  parseFloat(slider.attr("width")));
            }
            slider.attr("transform", "translate(" + delta + ", 0)");
            const move = (delta / areaWidth) * total;
            canvas
              .style(
                "left",
                ((horizonalRange[0] + move) / getRangeLength(horizonalRange)) *
                  areaWidth +
                  "px"
              )
              .style("display", "block");
            setRange([horizonalRange[0] + move, horizonalRange[1] + move]);
            plotGroup.html("");
            xLabelGroup.html("");
          }
        })
        .on("end", function (e) {
          if (horizonalDragBegin) {
            // re-render
            const slider = ctrlSvg.select("rect#slider");
            let delta = e.x - horizonalDragBegin;
            if (parseFloat(slider.attr("x")) + delta < marginLeft) {
              delta = (parseFloat(slider.attr("x")) - marginLeft) * -1;
            } else if (
              parseFloat(slider.attr("x")) +
                parseFloat(slider.attr("width")) +
                delta >
              width
            ) {
              delta =
                width -
                (parseFloat(slider.attr("x")) +
                  parseFloat(slider.attr("width")));
            }
            const move = (delta / areaWidth) * total;
            horizonalRange = [
              horizonalRange[0] + move,
              horizonalRange[1] + move,
            ];
            reRender();
            pagination(stanza.root, params, overThreshArray);
            horizonalDragBegin = false;
          }
        })
    );

  const sliderLabelGroup = ctrlSvg.append("g").attr("id", "sliderLabel");

  sliderLabelGroup
    .selectAll(".slider-label")
    .data(chromosomes)
    .enter()
    .append("text")
    .attr("class", "axis-label slider-label")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d) {
      let pos = chromosomeNtLength.hg38[d] / 2;
      for (const ch of chromosomes) {
        if (ch === d) {
          break;
        }
        pos += chromosomeNtLength.hg38[ch];
      }
      return (pos / chromosomeSumLength.hg38) * areaWidth + marginLeft;
    })
    .attr("y", 18)
    .attr("font-size", "12")
    .attr("fill", "#2F4D76");

  sliderLabelGroup
    .selectAll(".slider-ine")
    .data(chromosomes)
    .enter()
    .append("path")
    .attr("class", "slider-line")
    .attr("d", function (d) {
      let pos = chromosomeNtLength.hg38[d];
      for (const ch of chromosomes) {
        if (ch === d) {
          break;
        }
        pos += chromosomeNtLength.hg38[ch];
      }
      const sliderLinePos =
        (pos / chromosomeSumLength.hg38) * areaWidth + marginLeft;
      return "M " + sliderLinePos + ", " + 2 + " V " + 24 + " Z";
    });

  // button
  const ctrlBtn = select(controlElement)
    .append("div")
    .attr("id", "ctrl_button");
  ctrlBtn
    .append("span")
    .attr("class", "info-key")
    .text("Position:  ")
    .append("span")
    .attr("class", "range-text")
    .attr("id", "range_text");
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "-")
    .on("click", function () {
      const horizonalRangeLength = getRangeLength(horizonalRange);
      let begin = horizonalRange[0] - horizonalRangeLength / 2;
      let end = horizonalRange[1] + horizonalRangeLength / 2;
      if (begin < 0) {
        begin = 0;
        end = horizonalRangeLength * 2;
        if (end > total) {
          end = total;
        }
      } else if (end > total) {
        end = total;
        begin = total - horizonalRangeLength * 2;
      }
      horizonalRange = [begin, end];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "+")
    .on("click", function () {
      const horizonalRangeLength = getRangeLength(horizonalRange);
      const begin = horizonalRange[0] + horizonalRangeLength / 4;
      const end = horizonalRange[1] - horizonalRangeLength / 4;
      horizonalRange = [begin, end];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "reset")
    .on("click", function () {
      horizonalRange = [];
      verticalRange = [];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("label")
    .attr("class", "info-key -threshold")
    .text("Threshold:  ")
    .append("input")
    .attr("class", "threshold-input")
    .attr("id", "threshold")
    .attr("type", "text")
    .attr("value", "8");

  const threshold = stanza.root.querySelector("#threshold");
  threshold.addEventListener("input", function () {
    highThresh = parseFloat(threshold.value);
    reRender();
    pagination(stanza.root, params, overThreshArray);
  });

  reRender();

  //listen stage checkbox event
  const stageBtn = stanza.root.querySelectorAll(".stage-btn");

  for (let i = 0; i < stageBtn.length; i++) {
    stageBtn[i].addEventListener("change", (e) => {
      const stageName = e.path[0].getAttribute("data-stage");
      stageData[stageName].checked = stageBtn[i].checked;
      variants = getVariants();
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  }

  function reRender() {
    if (horizonalRange[0] === undefined) {
      horizonalRange = [
        0,
        Object.values(chromosomeNtLength.hg38).reduce(
          (sum, value) => sum + value
        ),
      ];
      total = horizonalRange[1];
    }

    overThreshArray = [];
    const pValueArray = variants.map(
      (variant) => Math.log10(parseFloat(variant["p-value"])) * -1
    );

    maxLogP = Math.max(...pValueArray);
    if (maxLogPInt === undefined) {
      maxLogPInt = Math.floor(maxLogP);
    }

    if (verticalRange[0] === undefined) {
      verticalRange = [lowThresh, maxLogPInt];
    }

    xLabelGroup.html("");
    yLabelGroup.html("");
    plotGroup.html("");

    plotGroup
      .selectAll(".plot")
      .data(variants)
      .enter()
      // filter: displayed range
      .filter(function (d) {
        if (!d.pos) {
          // calculate  accumulated position
          let pos = 0;
          for (const ch of chromosomes) {
            if (ch === d[chromosomeKey]) {
              break;
            }
            pos += chromosomeNtLength.hg38[ch];
          }
          d.pos = pos + parseInt(d[positionKey]);
        }
        const logValue = Math.log10(parseFloat(d[pValueKey])) * -1;
        return (
          horizonalRange[0] <= d.pos &&
          d.pos <= horizonalRange[1] &&
          verticalRange[0] <= logValue &&
          logValue <= verticalRange[1]
        );
      })
      .filter(function (d) {
        return Math.log10(parseFloat(d[pValueKey])) * -1 > lowThresh;
      })
      .append("circle")
      .attr("fill", function (d) {
        const stage = d["stage"].replace(/\s/, "-");
        return `var(--togostanza-${stage}-color)`;
      })
      .attr("cx", function (d) {
        return (
          ((d.pos - horizonalRange[0]) / getRangeLength(horizonalRange)) *
            areaWidth +
          marginLeft
        );
      })
      .attr("cy", function (d) {
        const logValue = Math.log10(parseFloat(d[pValueKey])) * -1;
        return (
          ((verticalRange[1] - logValue) / getRangeLength(verticalRange)) *
            drawAreaHeight +
          paddingTop
        );
      })
      .attr("r", 2)
      // filter: high p-value
      .filter(function (d) {
        if (Math.log10(parseFloat(d[pValueKey])) * -1 > highThresh) {
          overThreshArray.push(d);
        }
        return Math.log10(parseFloat(d[pValueKey])) * -1 > highThresh;
      })
      .classed("over-thresh-plot", true)
      .on("mouseover", function (e, d) {
        tooltip
          .style("display", "block")
          .style("left", `${pointer(e)[0] + 8}px`)
          .style(
            "top",
            `${pointer(e)[1]}px`
          ).html(`<p class="tooltip-chr">chr${d.chr}:${d.start}</p>
                <ul class="tooltip-info">
                  <li><span class="tooltip-key">rsId:&nbsp;</span>${d.rsId}</li>
                  <li><span class="tooltip-key">Gene name:&nbsp;</span>${d.gene_name}</li>
                  <li><span class="tooltip-key">Ref/Alt:&nbsp;</span>${d.ref}/${d.alt}</li>
                  <li><span class="tooltip-key">P-value:&nbsp;</span>${d["p-value"]}</li>
                </ul>`);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });
    renderCanvas(variants);

    // x axis label
    xLabelGroup
      .selectAll(".x-label")
      .data(chromosomes)
      .enter()
      .append("text")
      .attr("class", "axis-label x-label")
      .text(function (d) {
        return d;
      })
      .attr("x", function (d) {
        let pos = chromosomeNtLength.hg38[d] / 2;
        for (const ch of chromosomes) {
          if (ch === d) {
            break;
          }
          pos += chromosomeNtLength.hg38[ch];
        }
        return (
          ((pos - horizonalRange[0]) / getRangeLength(horizonalRange)) *
            areaWidth +
          marginLeft
        );
      })
      .attr("font-size", "12")
      .attr("y", areaHeight + 20);

    // chart background
    xLabelGroup
      .selectAll(".x-background")
      .data(chromosomes)
      .enter()
      .append("rect")
      .attr("class", "axis-label x-background")
      .attr("x", function (d) {
        if (
          chromosomeStartPosition[d] < horizonalRange[0] &&
          horizonalRange[0] < chromosomeStartPosition[d + 1]
        ) {
          return (
            ((chromosomeStartPosition[d] - horizonalRange[0]) /
              getRangeLength(horizonalRange)) *
              areaWidth +
            marginLeft
          );
        } else {
          return (
            ((chromosomeStartPosition[d] - horizonalRange[0]) /
              getRangeLength(horizonalRange)) *
              areaWidth +
            marginLeft
          );
        }
      })
      .attr("y", paddingTop)
      .attr("width", function (d) {
        return (
          (chromosomeNtLength.hg38[d] / getRangeLength(horizonalRange)) *
          areaWidth
        );
      })
      .attr("opacity", "0.4")
      .attr("height", drawAreaHeight)
      .attr("fill", function (d) {
        if (d % 2 === 0 || d === "Y") {
          return "#EEEEEE";
        } else if (d % 2 !== 0 || d === "X") {
          return "#FFFFFF";
        }
      });

    // y axis label
    yLabelGroup
      .append("rect")
      .attr("fill", "#FFFFFF")
      .attr("width", marginLeft - 1)
      .attr("height", areaHeight);

    const overThreshLine = stanza.root.querySelectorAll(".overthresh-line");
    for (
      let i = Math.floor(verticalRange[0]) + 1;
      i <= Math.ceil(verticalRange[1]);
      i++
    ) {
      const y =
        areaHeight -
        ((i - verticalRange[0]) / getRangeLength(verticalRange)) *
          drawAreaHeight;
      //Calucurate display of scale
      const tickNum = 20; //Tick number to display (set by manual)
      const tickInterval = Math.floor(getRangeLength(verticalRange) / tickNum);
      if (getRangeLength(verticalRange) < tickNum) {
        yLabelGroup
          .append("text")
          .text(i)
          .attr("class", "axis-label y-label")
          .attr("font-size", "12")
          .attr("x", marginLeft - 12)
          .attr("y", y)
          .attr("text-anchor", "end");
        yLabelGroup
          .append("path")
          .attr("class", "axis-line")
          .attr(
            "d",
            "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
          );
      } else if (getRangeLength(verticalRange) >= tickNum) {
        if (i % tickInterval === 0) {
          yLabelGroup
            .append("text")
            .text(i)
            .attr("class", "axis-label y-label")
            .attr("x", marginLeft - 12)
            .attr("y", y)
            .attr("text-anchor", "end");
          yLabelGroup
            .append("path")
            .attr("class", "axis-line")
            .attr(
              "d",
              "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
            );
        }
      }
      if (i === highThresh) {
        threshlineGroup
          .append("path")
          .attr("d", "M " + marginLeft + ", " + y + " H " + width + " Z")
          .attr("class", "overthresh-line");
      }
    }
    for (let i = 0; i < overThreshLine.length; i++) {
      overThreshLine[i].remove();
    }

    // y zero (lowThresh)
    yLabelGroup
      .append("text")
      .text(Math.floor(verticalRange[0]))
      .attr("class", "axis-label y-label")
      .attr("x", marginLeft - 12)
      .attr("y", areaHeight)
      .attr("text-anchor", "end");
    yLabelGroup
      .append("path")
      .attr("class", "axis-line")
      .attr(
        "d",
        "M " + (marginLeft - 8) + ", " + areaHeight + " H " + marginLeft + " Z"
      );

    // slider
    ctrlSvg
      .select("rect#slider")
      .attr("x", marginLeft + (horizonalRange[0] / total) * areaWidth)
      .attr("width", (getRangeLength(horizonalRange) / total) * areaWidth)
      .attr("transform", "translate(0, 0)");

    const totalOverThreshVariants = stanza.root.querySelector(
      "#totalOverThreshVariants"
    );
    totalOverThreshVariants.innerText = overThreshArray.length;
    setRange(horizonalRange);

    //slider shadow (Show only when chart is zoomed)
    const sliderShadow = stanza.root.querySelectorAll(".slider-shadow");
    for (let i = 0; i < sliderShadow.length; i++) {
      sliderShadow[i].remove();
    }

    if (
      horizonalRange[0] !== 0 &&
      horizonalRange[1] !== chromosomeSumLength.hg38
    ) {
      sliderShadowGroup
        .append("path")
        .attr("class", "slider-shadow")
        .attr("fill", "var(--togostanza-slider-color)")
        .attr("opacity", "0.4")
        .attr(
          "d",
          `
          M ${marginLeft} ${areaHeight}
          L ${width} ${areaHeight}
          L ${
            (horizonalRange[1] / chromosomeSumLength.hg38) * areaWidth +
            marginLeft
          } ${height + 10}
          L ${
            (horizonalRange[0] / chromosomeSumLength.hg38) * areaWidth +
            marginLeft
          } ${height + 10}
          z
        `
        );
    }
  }

  function renderCanvas(variants) {
    const horizonalRangeLength = getRangeLength(horizonalRange);
    if (canvas.node().getContext) {
      canvas.attr("width", (total / horizonalRangeLength) * areaWidth);
      canvas.attr("height", (total / horizonalRangeLength) * areaHeight);
      const ctx = canvas.node().getContext("2d");
      ctx.clearRect(0, 0, areaWidth, areaHeight);

      for (const d of variants) {
        const stage = d["stage"].replace(/\s/, "-").toLowerCase();
        ctx.beginPath();
        ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
          `--togostanza-${stage}-color`
        );
        ctx.arc(
          (d.pos / horizonalRangeLength) * areaWidth,
          areaHeight -
            ((Math.log10(parseFloat(d[pValueKey])) * -1 - lowThresh) *
              areaHeight) /
              maxLogPInt,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      canvas.style(
        "left",
        (horizonalRange[0] / horizonalRangeLength) * areaWidth + "px"
      );
    }
    canvas.style("display", "none");
  }

  function setRange(horizonalRange) {
    let start = 0;
    let text = "";
    for (const ch of chromosomes) {
      if (start + chromosomeNtLength.hg38[ch] >= horizonalRange[0] && !text) {
        text += " chr" + ch + ":" + Math.floor(horizonalRange[0]);
      }
      if (start + chromosomeNtLength.hg38[ch] >= horizonalRange[1]) {
        text += " - chr" + ch + ":" + Math.floor(horizonalRange[1] - start);
        break;
      }
      start += chromosomeNtLength.hg38[ch];
    }
    ctrlBtn.select("#range_text").html(text);
  }

  pagination(stanza.root, params, overThreshArray);
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ManhattanPlot
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "manhattan-plot",
	"stanza:label": "Manhattan plot",
	"stanza:definition": "Manhattan plot MetaStanza (for GWAS)",
	"stanza:type": "Stanza",
	"stanza:display": "Graph",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-01-13",
	"stanza:updated": "2021-01-13",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "",
		"stanza:description": "Data source URL (json)",
		"stanza:required": true
	},
	{
		"stanza:key": "chromosomeKey",
		"stanza:example": "chr",
		"stanza:description": "Key to a chromosome in data frame'",
		"stanza:required": false
	},
	{
		"stanza:key": "positionKey",
		"stanza:example": "stop",
		"stanza:description": "Key to a position on chromosome in data frame",
		"stanza:required": false
	},
	{
		"stanza:key": "pValueKey",
		"stanza:example": "p-value",
		"stanza:description": "Key to a p-value in data frame",
		"stanza:required": false
	},
	{
		"stanza:key": "lowThresh",
		"stanza:example": "4",
		"stanza:description": "Filtering threshold (=log10(p-value))",
		"stanza:required": false
	},
	{
		"stanza:key": "highThresh",
		"stanza:example": "8",
		"stanza:description": "Highlight threshold",
		"stanza:required": false
	},
	{
		"stanza:key": "recordsPerPage",
		"stanza:example": "20",
		"stanza:description": "Records per a page to display on table",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Arial",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-discovery-color",
		"stanza:type": "color",
		"stanza:default": "#3D6589",
		"stanza:description": "Plot color of discovery stage"
	},
	{
		"stanza:key": "--togostanza-replication-color",
		"stanza:type": "color",
		"stanza:default": "#ED707E",
		"stanza:description": "Plot color of replication stage"
	},
	{
		"stanza:key": "--togostanza-combined-color",
		"stanza:type": "color",
		"stanza:default": "#EAB64E",
		"stanza:description": "Plot color of combined stage"
	},
	{
		"stanza:key": "--togostanza-meta-analysis-color",
		"stanza:type": "color",
		"stanza:default": "#52B1C1",
		"stanza:description": "Plot color of meta-analysis stage"
	},
	{
		"stanza:key": "--togostanza-not-provided-color",
		"stanza:type": "color",
		"stanza:default": "#62B28C",
		"stanza:description": "Plot color of not-provided stage"
	},
	{
		"stanza:key": "--togostanza-slider-color",
		"stanza:type": "color",
		"stanza:default": "#C2E3F2",
		"stanza:description": "Slider color"
	},
	{
		"stanza:key": "--togostanza-thead-font-size",
		"stanza:type": "text",
		"stanza:default": "14px",
		"stanza:description": "Font size of table header"
	},
	{
		"stanza:key": "--togostanza-tbody-font-size",
		"stanza:type": "text",
		"stanza:default": "14px",
		"stanza:description": "Font size of table body"
	},
	{
		"stanza:key": "--togostanza-thead-font-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "Font color of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-weight",
		"stanza:type": "text",
		"stanza:default": "600",
		"stanza:description": "Font weight of table header"
	},
	{
		"stanza:key": "--togostanza-thead-background-color",
		"stanza:type": "color",
		"stanza:default": "#C2E3F2",
		"stanza:description": "Background color of table header"
	},
	{
		"stanza:key": "--togostanza-tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "#F2F5F7",
		"stanza:description": "Background color of table body (even row)"
	},
	{
		"stanza:key": "--togostanza-tbody-odd-background-color",
		"stanza:type": "color",
		"stanza:default": "#E6EBEF",
		"stanza:description": "Background color of table body (odd row)"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1 id=\"manhattan-title\">\n  GWAS Study View\n</h1>\n\n<section class=\"info-section\">\n  <dl class=\"datainfo-list\">\n    <dt id=\"study-name\" class=\"info-key\">\n      study name:\n    </dt>\n    <dd>\n      "
    + alias4(((helper = (helper = lookupProperty(helpers,"studyName") || (depth0 != null ? lookupProperty(depth0,"studyName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"studyName","hash":{},"data":data,"loc":{"start":{"line":11,"column":6},"end":{"line":11,"column":19}}}) : helper)))
    + "\n    </dd>\n    <dt id=\"project-name\" class=\"info-key\">\n      project name:\n    </dt>\n    <dd>\n      "
    + alias4(((helper = (helper = lookupProperty(helpers,"projectName") || (depth0 != null ? lookupProperty(depth0,"projectName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"projectName","hash":{},"data":data,"loc":{"start":{"line":17,"column":6},"end":{"line":17,"column":21}}}) : helper)))
    + "\n    </dd>\n  </dl>\n</section>\n\n<hr />\n\n<section class=\"chart-section\">\n  <h2>\n    Manhattan Plot\n  </h2>\n  <table>\n    <tbody>\n      <tr id=\"stageList\">\n        <td class=\"info-key\">\n          Stages:\n        </td>\n      </tr>\n      <tr id=\"firstConditionList\">\n        <td class=\"info-key\">\n          Condition1:\n        </td>\n      </tr>\n      <tr id=\"secondConditionList\">\n        <td class=\"info-key\">\n          Condition2:\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <div id=\"chart\"></div>\n  <div id=\"control\"></div>\n</section>\n\n<hr />\n\n<section class=\"table-section\">\n  <div class=\"table-info\">\n    <div class=\"table-title\">\n      <h2>\n        Top Loci\n      </h2>\n      <p>\n        Only variants with are greater than or equal to the threshold are displayed.\n      </p>\n    </div>\n    <dl class=\"total-overthresh-variants\">\n      <dt class=\"info-key\">\n        Total Variants:\n      </dt>\n      <dd id=\"totalOverThreshVariants\" class=\"info-value\"></dd>\n    </dl>\n  </div>\n  <div class=\"pagination\">\n    <table>\n      <thead id=\"listingTableHead\">\n        <tr>\n          <th>\n            Gene name\n          </th>\n          <th>\n            rsId\n          </th>\n          <th>\n            Chromosome\n          </th>\n          <th>\n            position\n          </th>\n          <th>\n            Ref\n          </th>\n          <th>\n            Alt\n          </th>\n          <th>\n            P-value\n          </th>\n        </tr>\n      </thead>\n      <tbody id=\"listingTable\">\n      </tbody>\n    </table>\n    <div class=\"pagination-block\">\n      <span class=\"page-btn\" id=\"firstBtn\">\n        &lt;&lt;\n      </span>\n      <span class=\"page-btn\" id=\"prevBtn\">\n        &lt;\n      </span>\n      <span class=\"page-number\" id=\"pageNumber\"></span>\n      <span class=\"page-btn\" id=\"nextBtn\">\n        &gt;\n      </span>\n      <span class=\"page-btn\" id=\"lastBtn\">\n        &gt;&gt;\n      </span>\n    </div>\n  </div>\n</section>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=manhattan-plot.js.map
