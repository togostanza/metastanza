import { d as defineStanzaElement } from './stanza-element-d1cc4290.js';
import { w as dispatch } from './timer-be811b16.js';
import { s as select, m as metastanza } from './metastanza_utils-aa9e4d2c.js';

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

async function manhattanPlot(stanza, params) {
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
      title: params.title
    }
  });

  console.log(params.api);
  let dataset = await metastanza.getFormatedJson(params.api, stanza.root.querySelector('#chart'));
  if (typeof dataset == "object") draw(dataset, stanza, params);
}

async function draw(dataset, stanza, params) {
  const width = 800;
  const height = 400;
  const marginLeft = 30;
  const marginBottom = 30;
  const areaWidth = width - marginLeft;
  const areaHeight = height - marginBottom;

  const chart_element = stanza.root.querySelector('#chart');
  const control_element = stanza.root.querySelector('#control');

  if (params.low_thresh == "") params.low_thresh = 0.5;
  if (params.high_thresh == "") params.high_thresh = Infinity;
  const low_thresh = parseFloat(params.low_thresh);
  const high_thresh = parseFloat(params.high_thresh);
  const even_and_odd = (params.even_and_odd == 'true');

  const chromosomes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20","21", "22", "X", "Y"];
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
      Y: 57227415
    }
  };
  
  let svg = select(chart_element).append("svg").attr("width", width).attr("height", height);
  let plot_g = svg.append("g").attr("id", "plot_group");
  let axis_g = svg.append("g").attr("id", "axis");
  let xlabel_g = svg.append("g").attr("id", "x_label");
  let ylabel_g = svg.append("g").attr("id", "y_label");
  
  let range = []; // [begin position, en _position]
  let max_log_p = 0;
  let max_log_p_int = 0;
  let total;

  // axis line
  axis_g.append("path")
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width +  " Z")
    .attr("class", "axis-line");
  axis_g.append("path")
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight +  " Z")
    .attr("class", "axis-line");

  // select range by drag
  let dragBegin = false;
  svg.on("mousedown", function(e, d){
    if (pointer(e)[1] <= areaHeight) {
      dragBegin = pointer(e)[0];
      svg.append("rect")
	.attr("fill", "rgba(128, 128, 128, 0.2)")
	.attr("stroke", "black")
	.attr("x", dragBegin)
	.attr("y", 0)
	.attr("width", 0)
	.attr("height", areaHeight)
	.attr("id", "selector");
    }
  })
    .on("mousemove", function(e, d){
      if(dragBegin){
	let dragEnd = pointer(e)[0];
	if (dragBegin < dragEnd) {
	  svg.select("#selector")
	    .attr("width", dragEnd - dragBegin);
	} else {
	  svg.select("#selector")
	    .attr("x", dragEnd)
	    .attr("width", dragBegin - dragEnd);
	}
      }
    })
    .on("mouseup", function(e, d){
      if(dragBegin){
	let dragEnd = pointer(e)[0];
	// re-render
	if (-5 > dragEnd - dragBegin) {
	  range = [dragEnd / width * (range[1] - range[0]) + range[0], dragBegin / width * (range[1] - range[0]) + range[0]];
	  reRender();
	} else if (dragEnd - dragBegin > 5) {
	  range = [dragBegin / width * (range[1] - range[0]) + range[0], dragEnd / width * (range[1] - range[0]) + range[0]];
	  reRender();
	}
	svg.select("#selector").remove();
	dragBegin = false;
      }
    });

  // slider
  let ctrl_svg = select(control_element).append("svg").attr("width", width).attr("height", 20);
  ctrl_svg.append("path")
    .attr("d", "M " + marginLeft + ", 10 H " + width +  " Z")
    .attr("stroke", "#888888")
    .attr("stroke-width", "2px");
  ctrl_svg.append("rect")
    .attr("id", "slider")
    .attr("x", marginLeft)
    .attr("y", 2)
    .attr("width", areaWidth)
    .attr("height", 16)
    .attr("fill", "#8888ff")
    .call(
      drag()
	.on("start", function(e){ dragBegin = e.x; })
	.on("drag", function(e){
	  if(dragBegin) {
	    let slider = ctrl_svg.select("rect#slider");
	    let delta = e.x - dragBegin;
	    if (parseFloat(slider.attr("x")) + delta < marginLeft) delta = (parseFloat(slider.attr("x")) - marginLeft) * (-1);
	    else if (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")) + delta > width) delta = width - (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")));
	    slider.attr("transform", "translate(" + delta + ", 0)");
	  }
	})
	.on("end", function(e){
	  if(dragBegin){
	    // re-render
	    let slider = ctrl_svg.select("rect#slider");
	    let delta = e.x - dragBegin;
	    if (parseFloat(slider.attr("x")) + delta < marginLeft) delta = (parseFloat(slider.attr("x")) - marginLeft) * (-1);
	    else if (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")) + delta > width) delta = width - (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")));
	    let move = delta / areaWidth * total;
	    range = [range[0] + move, range[1] + move];
	    reRender();
	    dragBegin = false;
	  }
	})
    );
  
  // button
  let ctrl_button = select(control_element).append("div").attr("id", "ctrl_button");
  ctrl_button.append("input").attr("type", "button").attr("value", "-")
    .on("click", function(){
      let begin = range[0] - (range[1] - range[0]) / 2;
      let end = range[1] + (range[1] - range[0]) / 2;
      if (begin < 0) {
	begin = 0;
	end = (range[1] - range[0]) * 2;
	if (end > total) end = total;
      }else if (end > total) {
	end = total;
	begin = total - (range[1] - range[0]) * 2;
      }
      range = [begin, end];
      reRender();
    });
  ctrl_button.append("input").attr("type", "button").attr("value","+")
    .on("click", function(){
      let begin = range[0] + (range[1] - range[0]) / 4;
      let end = range[1] - (range[1] - range[0]) / 4;
      range = [begin, end];
      reRender();
    });
  ctrl_button.append("input").attr("type", "button").attr("value","reset")
    .on("click", function(){
      range = [];
      reRender();
    });

  reRender();
  
  function reRender(){
    
    if (range[0] == undefined) {
      range = [0,  Object.values(chromosomeNtLength.hg38).reduce((sum, value) => sum +value)];
      total = range[1];
    }
    
    max_log_p = 0;
    
    plot_g.html("");
    xlabel_g.html("");
    ylabel_g.html("");
    
    plot_g.selectAll(".plot")
      .data(dataset)
      .enter()
    // filter: display range
      .filter(function(d){
	if (!d.pos) {
	  // calculate  accumulated position
	  let pos = 0;
	  for(let ch of chromosomes){
	    if (ch == d.Chromosome) break;
	    pos += chromosomeNtLength.hg38[ch];
	  }
	  d.pos = pos + parseInt(d.Physical_position);
	}
	return range[0] <= d.pos && d.pos <= range[1];
      })
    // filter: low p-value
      .filter(function(d){ return Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1) > low_thresh })
      .append("circle")
      .attr("class", function(d, i){
	if (even_and_odd) {
	  let tmp = "even";
	  if (d.Chromosome == "X" || parseInt(d.Chromosome) % 2 == 1) tmp = "odd";
	  return "plot ch_" + tmp;
	}
	return "plot ch_" + d.Chromosome
      })
      .attr("cx", function(d){
	return (d.pos - range[0]) / (range[1] - range[0]) * areaWidth + marginLeft})
      .attr("cy",function(d){
	// set max log(p-value)
	if (max_log_p < Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1)) max_log_p = Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1);
	return areaHeight;
      })
      .attr("r", 2)
    // filter: high p-value
      .filter(function(d){return Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1) > high_thresh })
      .classed("over-thresh-plot", true)
      .on("mouseover", function(e, d){
	svg.append("text").text(d.dbSNP_RS_ID + ", " + d.Symbol)
	  .attr("x", pointer(e)[0] + 10).attr("y", pointer(e)[1]).attr("id", "popup_text");
      })
      .on("mouseout", function(e, d){
	svg.select("#popup_text").remove();
      });

    // set 'cy' from max log(p-value) (int)
    max_log_p_int = Math.floor(max_log_p);
    plot_g.selectAll(".plot")
      .attr("cy", function(d){ return areaHeight  - (Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1) - low_thresh) * areaHeight  / max_log_p_int});

    // x axis label
    xlabel_g.selectAll(".xLabel")
      .data(chromosomes)
      .enter()
      .append("text")
      .attr("class", "axisLabel xLabel")
      .text(function(d){ return d; })
      .attr("x", function(d){
	let pos = chromosomeNtLength.hg38[d] / 2;
	for(let ch of chromosomes){
	  if (ch == d) break;
	  pos += chromosomeNtLength.hg38[ch];
	}
	return (pos - range[0]) / (range[1] - range[0]) * areaWidth + marginLeft;
      })
      .attr("y", areaHeight + 20);

    // y axis label
    for (let i = Math.floor(low_thresh) + 1; i <=  max_log_p_int; i++) {
      let y = areaHeight  - (i - low_thresh) * areaHeight / max_log_p_int;
      ylabel_g.append("text").text(i)
	.attr("class", "axisLabel yLabel")
	.attr("x", marginLeft - 16)
	.attr("y", y)
	.attr("text-anchor", "end");
      ylabel_g.append("path")
	.attr("class", "axis-line")
	.attr("d", "M " + (marginLeft - 10) + ", " + y + " H " + marginLeft + " Z");
    }
    //// y zero (low_thresh)
    ylabel_g.append("text").text(low_thresh)
      .attr("class", "axisLabel yLabel")
      .attr("x", marginLeft - 16)
      .attr("y", areaHeight)
      .attr("text-anchor", "end");
    ylabel_g.append("path")
      .attr("class", "axis-line")
      .attr("d", "M " + (marginLeft - 10) + ", " + areaHeight + " H " + marginLeft + " Z");

    // slider
    ctrl_svg.select("rect#slider")
      .attr("x", marginLeft + range[0] / total * areaWidth)
      .attr("width", (range[1] - range[0]) / total * areaWidth)
      .attr("transform", "translate(0, 0)");
	
  }
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "manhattan_plot",
	"stanza:label": "Manhattan plot",
	"stanza:definition": "Manhattan plot metastanza for GWAS data",
	"stanza:type": "MetaStanza",
	"stanza:display": "Graph",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-10",
	"stanza:updated": "2020-11-10",
	"stanza:parameter": [
	{
		"stanza:key": "api",
		"stanza:example": "https://db-dev.jpostdb.org/test/gwas_test.json",
		"stanza:description": "api (https://db-dev.jpostdb.org/test/gwas_test.json)",
		"stanza:required": true
	},
	{
		"stanza:key": "title",
		"stanza:example": "Manhattan plot",
		"stanza:description": "hoge",
		"stanza:required": false
	},
	{
		"stanza:key": "low_thresh",
		"stanza:example": "1",
		"stanza:description": "filtering threshold. =log10(p-value) default: 0.5",
		"stanza:required": false
	},
	{
		"stanza:key": "high_thresh",
		"stanza:example": "4",
		"stanza:description": "highlight shreshold. =log10(p-value)",
		"stanza:required": false
	},
	{
		"stanza:key": "even_and_odd",
		"stanza:example": false,
		"stanza:description": "color type",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--over-thresh-color",
		"stanza:type": "color",
		"stanza:default": "#ff0000",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-even-color",
		"stanza:type": "color",
		"stanza:default": "#888888",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-odd-color",
		"stanza:type": "color",
		"stanza:default": "#444444",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-1-color",
		"stanza:type": "color",
		"stanza:default": "#ffb6b9",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-2-color",
		"stanza:type": "color",
		"stanza:default": "#fae3d9",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-3-color",
		"stanza:type": "color",
		"stanza:default": "#bbded6",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-4-color",
		"stanza:type": "color",
		"stanza:default": "#8ac6d1",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-5-color",
		"stanza:type": "color",
		"stanza:default": "#a39391",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-6-color",
		"stanza:type": "color",
		"stanza:default": "#716e77",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-7-color",
		"stanza:type": "color",
		"stanza:default": "#ecd6c7",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-8-color",
		"stanza:type": "color",
		"stanza:default": "#e79686",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-9-color",
		"stanza:type": "color",
		"stanza:default": "#cff09e",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-10-color",
		"stanza:type": "color",
		"stanza:default": "#a8dba8",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-11-color",
		"stanza:type": "color",
		"stanza:default": "#79bd9a",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-12-color",
		"stanza:type": "color",
		"stanza:default": "#3b8686",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-13-color",
		"stanza:type": "color",
		"stanza:default": "#a1bd93",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-14-color",
		"stanza:type": "color",
		"stanza:default": "#e1dda1",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-15-color",
		"stanza:type": "color",
		"stanza:default": "#90a9c6",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-16-color",
		"stanza:type": "color",
		"stanza:default": "#1794ac",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-17-color",
		"stanza:type": "color",
		"stanza:default": "#B9A7C2",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-18-color",
		"stanza:type": "color",
		"stanza:default": "#B6D0C9",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-19-color",
		"stanza:type": "color",
		"stanza:default": "#C2DFEA",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-20-color",
		"stanza:type": "color",
		"stanza:default": "#8C95AA",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-21-color",
		"stanza:type": "color",
		"stanza:default": "#C7AFBD",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-22-color",
		"stanza:type": "color",
		"stanza:default": "#a4bf5b",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-X-color",
		"stanza:type": "color",
		"stanza:default": "#79a2a6",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-Y-color",
		"stanza:type": "color",
		"stanza:default": "#CCCC99",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--greeting-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "text align of greeting"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1 id=\"manhattan-title\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":1,"column":25},"end":{"line":1,"column":34}}}) : helper)))
    + "</h1>\n\n<div id=\"chart\"></div>\n<div id=\"control\"></dev>\n";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\ndiv#chart {\n  position: relative;\n}\n\npath.axis-line {\n  stroke: black;\n  stroke-width: 2px;\n}\n\ntext.axisLabel {\n  font-size: 10px;\n}\n\ntext.xLabel {\n  text-anchor: middle;\n  user-select: none;\n}\n\ntext.yLabel {\n  text-anchor: end;\n  dominant-alignment: center;\n  user-select: none;\n}\n\ncircle.ch_even {\n  fill: var(--ch-even-color);\n}\n\ncircle.ch_odd {\n  fill: var(--ch-odd-color);\n}\n\ncircle.ch_1 {\n  fill: var(--ch-1-color);\n}\n\ncircle.ch_2 {\n  fill: var(--ch-2-color);\n}\n\ncircle.ch_3 {\n  fill: var(--ch-3-color);\n}\n\ncircle.ch_4 {\n  fill: var(--ch-4-color);\n}\n\ncircle.ch_5 {\n  fill: var(--ch-5-color);\n}\n\ncircle.ch_6 {\n  fill: var(--ch-6-color);\n}\n\ncircle.ch_7 {\n  fill: var(--ch-7-color);\n}\n\ncircle.ch_8 {\n  fill: var(--ch-8-color);\n}\n\ncircle.ch_9 {\n  fill: var(--ch-9-color);\n}\n\ncircle.ch_10 {\n  fill: var(--ch-10-color);\n}\n\ncircle.ch_11 {\n  fill: var(--ch-11-color);\n}\n\ncircle.ch_12 {\n  fill: var(--ch-12-color);\n}\n\ncircle.ch_13 {\n  fill: var(--ch-13-color);\n}\n\ncircle.ch_14 {\n  fill: var(--ch-14-color);\n}\n\ncircle.ch_15 {\n  fill: var(--ch-15-color);\n}\n\ncircle.ch_16 {\n  fill: var(--ch-16-color);\n}\n\ncircle.ch_17 {\n  fill: var(--ch-17-color);\n}\n\ncircle.ch_18 {\n  fill: var(--ch-18-color);\n}\n\ncircle.ch_19 {\n  fill: var(--ch-19-color);\n}\n\ncircle.ch_20 {\n  fill: var(--ch-20-color);\n}\n\ncircle.ch_21 {\n  fill: var(--ch-21-color);\n}\n\ncircle.ch_22 {\n  fill: var(--ch-22-color);\n}\n\ncircle.ch_X {\n  fill: var(--ch-Y-color);\n}\n\ncircle.ch_Y {\n  fill: var(--ch-X-color);\n}\n\ncircle.over-thresh-plot {\n  fill: var(--over-thresh-color);\n}";

defineStanzaElement(manhattanPlot, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=manhattan_plot.js.map
