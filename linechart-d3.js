import { d as defineStanzaElement } from './stanza-element-6c3c8ad1.js';
import { S as Stanza } from './stanza-d00018f6.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss, s as select } from './index-c3245d93.js';
import { l as loadData } from './load-data-162104b1.js';
import { L as Legend } from './Legend-e5f079ed.js';
import { I as InternMap, o as ordinal, i as initRange, f as format } from './ordinal-538ccecd.js';
import { c as constant, p as path, m as max } from './constant-abe3b5f1.js';
import { l as linear } from './linear-c2a699dc.js';

function identity$1(x) {
  return x;
}

function group(values, ...keys) {
  return nest(values, identity$1, identity$1, keys);
}

function nest(values, map, reduce, keys) {
  return (function regroup(values, i) {
    if (i >= keys.length) return reduce(values);
    const groups = new InternMap();
    const keyof = keys[i++];
    let index = -1;
    for (const value of values) {
      const key = keyof(value, ++index, values);
      const group = groups.get(key);
      if (group) group.push(value);
      else groups.set(key, [value]);
    }
    for (const [key, values] of groups) {
      groups.set(key, regroup(values, i));
    }
    return map(groups);
  })(values, 0);
}

function min(values, valueof) {
  let min;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  }
  return min;
}

function range(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

function identity(x) {
  return x;
}

var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6;

function translateX(x) {
  return "translate(" + x + ",0)";
}

function translateY(y) {
  return "translate(0," + y + ")";
}

function number(scale) {
  return d => +scale(d);
}

function center(scale, offset) {
  offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
  if (scale.round()) offset = Math.round(offset);
  return d => +scale(d) + offset;
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + offset,
        range1 = +range[range.length - 1] + offset,
        position = (scale.bandwidth ? center : number)(scale.copy(), offset),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon)
          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", epsilon)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient === right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d) + offset); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = Array.from(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  axis.offset = function(_) {
    return arguments.length ? (offset = +_, axis) : offset;
  };

  return axis;
}

function axisTop(scale) {
  return axis(top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      r0 = 0,
      r1 = 1,
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = r1 < r0,
        start = reverse ? r1 : r0,
        stop = reverse ? r0 : r1;
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = range(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };

  scale.rangeRound = function(_) {
    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band(domain(), [r0, r1])
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return initRange.apply(rescale(), arguments);
}

function array(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
}

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // falls through
      default: this._context.lineTo(x, y); break;
    }
  }
};

function curveLinear(context) {
  return new Linear(context);
}

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

function line(x$1, y$1) {
  var defined = constant(true),
      context = null,
      curve = curveLinear,
      output = null;

  x$1 = typeof x$1 === "function" ? x$1 : (x$1 === undefined) ? x : constant(x$1);
  y$1 = typeof y$1 === "function" ? y$1 : (y$1 === undefined) ? y : constant(y$1);

  function line(data) {
    var i,
        n = (data = array(data)).length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), line) : x$1;
  };

  line.y = function(_) {
    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), line) : y$1;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

class Linechart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //data
    const xKeyName = this.params["x-axis-key"];
    const yKeyName = this.params["y-axis-key"];
    const xAxisTitle = this.params["x-axis-title"] || "";
    const yAxisTitle = this.params["y-axis-title"] || "";
    const showXTicks = this.params["xtick"] === "true" ? true : false;
    const showYTicks = this.params["ytick"] === "true" ? true : false;
    const xTicksNumber = this.params["xticks-number"] || 5;
    const yTicksNumber = this.params["yticks-number"] || 3;
    const groupKeyName = this.params["group-by"];
    const showXGrid = this.params["xgrid"] === "true" ? true : false;
    const showYGrid = this.params["ygrid"] === "true" ? true : false;
    const xLabelAngle =
      parseInt(this.params["xlabel-angle"]) === 0
        ? 0
        : parseInt(this.params["xlabel-angle"]) || -90;
    const yLabelAngle =
      parseInt(this.params["ylabel-angle"]) === 0
        ? 0
        : parseInt(this.params["ylabel-angle"]) || 0;

    const xDataType = this.params["x-axis-data-type"] || "string";
    const errorKeyName = this.params["error-key"] || "error";
    const showErrorBars = this.params["error-bars"] === "true" ? true : false;
    const errorBarWidth =
      typeof this.params["error-bar-width"] !== "undefined"
        ? this.params["error-bar-width"]
        : 0.4;
    const xLabelPadding =
      parseInt(this.params["xlabel-padding"]) === 0
        ? 0
        : parseInt(this.params["xlabel-padding"]) || 7;
    const yLabelPadding =
      parseInt(this.params["ylabel-padding"]) === 0
        ? 0
        : parseInt(this.params["ylabel-padding"]) || 10;

    const ylabelFormat = this.params["ylabel-format"] || null;

    const xAxisPlacement = this.params["xaxis-placement"] || "bottom";
    const yAxisPlacement = this.params["yaxis-placement"] || "left";

    const xTitlePadding = this.params["xtitle-padding"] || 15;
    const yTitlePadding = this.params["ytitle-padding"] || 15;

    const xTickSize = this.params["xtick-size"] || 5;
    const yTickSize = this.params["ytick-size"] || 5;
    const axisTitleFontSize =
      parseInt(css("--togostanza-title-font-size")) || 10;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const legendShow = this.params["legend"] || "none";

    const root = this.root.querySelector(":scope > div");

    // On change params rerender - Check if legend and svg already existing and remove them -
    const existingLegend = this.root.querySelector("togostanza--legend");
    if (existingLegend) {
      existingLegend.remove();
    }
    const existingSVG = this.root.querySelector("svg");
    if (existingSVG) {
      existingSVG.remove();
    }
    // ====

    // Add legend

    if (legendShow !== "none") {
      this.legend = new Legend();
      root.append(this.legend);
    }

    let values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    // TODO change data to include errors. For now, artificially add 20% error
    values.forEach((item) => {
      item.error = item.count * 0.2;
    });

    //Filter out all non-numeric x-axis values from data
    if (xDataType === "number") {
      values = values.filter((item) => !isNaN(item[xKeyName]));
    }

    this._data = values;

    const categorizedData = group(values, (d) => d[groupKeyName]);

    const groups = [...categorizedData.keys()];

    const toggleState = new Map(groups.map((_, index) => ["" + index, false]));

    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }

    const color = ordinal().domain(groups).range(togostanzaColors);

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);

    const MARGIN = {
      TOP:
        xAxisPlacement === "top"
          ? Math.max(60, xTitlePadding + 10 + xTickSize + axisTitleFontSize)
          : 10,
      BOTTOM:
        xAxisPlacement === "top"
          ? 10
          : Math.max(60, xTitlePadding + xTickSize + 10 + axisTitleFontSize),
      LEFT:
        yAxisPlacement === "left"
          ? Math.max(60, yTitlePadding + yTickSize + 10 + axisTitleFontSize)
          : 10,
      RIGHT:
        yAxisPlacement === "right"
          ? Math.max(60, yTitlePadding + yTickSize + 10 + axisTitleFontSize)
          : 10,
    };

    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const el = this.root.querySelector("#linechart-d3");

    const svg = select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const graphArea = svg.append("g").attr("class", "chart");

    const linesArea = graphArea
      .append("g")
      .attr("class", "lines")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const dataGroup = linesArea.append("g").attr("class", "data-lines");

    const xAxisArea = graphArea.append("g").attr("class", "x axis");

    const yAxisArea = graphArea.append("g").attr("class", "y axis");

    const yTitleArea = graphArea.append("g").attr("class", "y axis title");

    const xTitleArea = graphArea.append("g").attr("class", "x axis title");

    if (xAxisPlacement === "top") {
      xAxisArea.attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

      xTitleArea
        .attr(
          "transform",
          `translate(0,${MARGIN.TOP - xTitlePadding - xTickSize})`
        )
        .attr("dominant-baseline", "bottom");
    } else {
      xAxisArea.attr(
        "transform",
        `translate(${MARGIN.LEFT},${HEIGHT + MARGIN.TOP})`
      );
      xTitleArea
        .attr(
          "transform",
          `translate(0,${HEIGHT + MARGIN.TOP + xTickSize + xTitlePadding})`
        )
        .attr("dominant-baseline", "hanging");
    }

    if (yAxisPlacement === "right") {
      yAxisArea.attr(
        "transform",
        `translate(${MARGIN.LEFT + WIDTH},${MARGIN.TOP})`
      );
      yTitleArea.attr(
        "transform",
        `translate(${MARGIN.LEFT + WIDTH + yTickSize + yTitlePadding},0)`
      );
    } else {
      yAxisArea.attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);
      yTitleArea.attr(
        "transform",
        `translate(${MARGIN.LEFT - yTickSize - yTitlePadding},0)`
      );
    }

    yTitleArea
      .append("text")
      .text(yAxisTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -HEIGHT / 2 - MARGIN.TOP);

    xTitleArea
      .append("text")
      .text(xAxisTitle)
      .attr("text-anchor", "middle")
      .attr("x", MARGIN.LEFT + WIDTH / 2);

    const errorBarsGroup = linesArea
      .append("g")
      .attr("class", "error-bars-group");

    const xAxisLabelsProps = getXTextLabelProps(
      xLabelAngle,
      xLabelPadding + xTickSize,
      xAxisPlacement
    );
    const yAxisLabelsProps = getYTextLabelProps(
      yLabelAngle,
      yLabelPadding + yTickSize,
      yAxisPlacement
    );

    // Axes preparation
    let dataMax, dataMin;
    if (showErrorBars) {
      dataMax = max(values, (d) => +d[yKeyName] + d[errorKeyName]);
      dataMin = min(values, (d) => +d[yKeyName] - d[errorKeyName]);
    } else {
      dataMax = max(values, (d) => +d[yKeyName]);
      dataMin = min(values, (d) => +d[yKeyName]);
    }

    let x;
    if (xDataType === "number") {
      const xAxisData = values.map((d) => +d[xKeyName]);
      const xDataMinMax = [min(xAxisData), max(xAxisData)];
      x = linear().domain(xDataMinMax).range([0, WIDTH]);
    } else {
      const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
      x = band().domain(xAxisLabels).range([0, WIDTH]);
    }

    const y = linear().domain([dataMin, dataMax]).range([HEIGHT, 0]);

    const xAxisGridGenerator = axisBottom(x)
      .tickSize(-HEIGHT)
      .tickFormat("")
      .ticks(xTicksNumber);

    const yAxisGridGenerator = axisLeft(y)
      .tickSize(-WIDTH)
      .tickFormat("")
      .ticks(yTicksNumber);

    const xGridLines = linesArea
      .append("g")
      .attr("class", "x gridlines")
      .attr("transform", "translate(0," + HEIGHT + ")");

    const yGridLines = linesArea.append("g").attr("class", "y gridlines");

    const update = (values) => {
      const categorizedData = group(values, (d) => d[groupKeyName]);

      if (showErrorBars) {
        dataMax = max(values, (d) => +d[yKeyName] + d[errorKeyName]);
        dataMin = min(values, (d) => +d[yKeyName] - d[errorKeyName]);
      } else {
        dataMax = max(values, (d) => +d[yKeyName]);
        dataMin = min(values, (d) => +d[yKeyName]);
      }

      if (xDataType === "number") {
        const xAxisData = values.map((d) => +d[xKeyName]);
        const xDataMinMax = [min(xAxisData), max(xAxisData)];
        x.domain(xDataMinMax);
      } else {
        const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
        x.domain(xAxisLabels);
      }

      y.domain([dataMin, dataMax]);

      let xAxisGenerator;

      if (xAxisPlacement === "top") {
        xAxisGenerator = axisTop(x);
      } else {
        xAxisGenerator = axisBottom(x);
      }
      xAxisGenerator.tickSizeOuter(0).tickSizeInner(xTickSize);

      if (xDataType === "number") {
        xAxisGenerator.ticks(xTicksNumber);
      }

      if (!showXTicks) {
        xAxisGenerator.tickSize(0);
      }

      xAxisArea
        .transition()
        .duration(200)
        .call(xAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", xAxisLabelsProps.textAnchor)
        .attr("alignment-baseline", xAxisLabelsProps.dominantBaseline)
        .attr("y", xAxisLabelsProps.y)
        .attr("x", xAxisLabelsProps.x)
        .attr("dy", null)
        .attr("transform", `rotate(${xLabelAngle})`);

      let yAxisGenerator;

      if (yAxisPlacement === "right") {
        yAxisGenerator = axisRight(y).tickSizeOuter(0);
      } else {
        yAxisGenerator = axisLeft(y).tickSizeOuter(0);
      }

      yAxisGenerator
        .ticks(yTicksNumber)
        .tickFormat((d) => format(ylabelFormat)(d))
        .tickSizeInner(yTickSize);

      if (!showYTicks) {
        yAxisGenerator.tickSize(0);
      }

      yAxisArea
        .transition()
        .duration(200)
        .call(yAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", yAxisLabelsProps.textAnchor)
        .attr("alignment-baseline", yAxisLabelsProps.dominantBaseline)
        .attr("dy", null)
        .attr("x", yAxisLabelsProps.x)
        .attr("y", yAxisLabelsProps.y)
        .attr("transform", `rotate(${yLabelAngle})`);

      const g = dataGroup.selectAll("path").data(categorizedData, (d) => d[0]);

      g.exit().remove();

      // update
      g.transition()
        .duration(200)
        .attr("d", function (d) {
          return line()
            .x(function (d) {
              if (xDataType === "number") {
                return x(d[xKeyName]);
              } else {
                return x(d[xKeyName]) + x.bandwidth() / 2;
              }
            })
            .y(function (d) {
              return y(+d[yKeyName]);
            })(d[1]);
        });

      // enter
      g.enter()
        .append("path")
        .attr("id", (d) => "data-" + groups.findIndex((item) => item === d[0]))
        .attr("class", "data-lines")
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return color(d[0]);
        })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
          return line()
            .x(function (d) {
              if (xDataType === "number") {
                return x(d[xKeyName]);
              } else {
                return x(d[xKeyName]) + x.bandwidth() / 2;
              }
            })
            .y(function (d) {
              return y(+d[yKeyName]);
            })(d[1]);
        });

      if (showErrorBars) {
        //Draw error bars
        const barGroups = errorBarsGroup
          .selectAll("g")
          .data(
            values,
            (d) => `${d[groupKeyName]}-${d[yKeyName]}-${d[xKeyName]}`
          );

        const barGroupsEnter = barGroups
          .enter()
          .append("g")
          .attr("class", "errorbar-group");

        barGroupsEnter.append("line").attr("class", "errorbar vl");
        barGroupsEnter.append("line").attr("class", "errorbar bl");
        barGroupsEnter.append("line").attr("class", "errorbar tl");

        barGroups
          .merge(barGroupsEnter)
          .select("line.errorbar.vl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));

        barGroups
          .merge(barGroupsEnter)
          .select("line.errorbar.bl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] - d[errorKeyName] / 2));

        barGroups
          .merge(barGroupsEnter)
          .select("line.errorbar.tl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] + d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));

        barGroups.exit().remove();

        barGroupsEnter
          .select("line.errorbar-vl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));

        barGroupsEnter
          .select("line.errorbar-bl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] - d[errorKeyName] / 2));

        barGroupsEnter
          .select("line.errorbar-tl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] + d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));
      }

      // Show/hide grid lines
      if (showXGrid) {
        xGridLines.transition().duration(200).call(xAxisGridGenerator);
      }

      if (showYGrid) {
        yGridLines.transition().duration(200).call(yAxisGridGenerator);
      }

      // update legend
      if (legendShow !== "none") {
        this.legend.setup(
          groups.map((item, index) => ({
            id: "" + index,
            label: item,
            color: color(item),
            node: this.root.querySelector(`svg #data-${index}`) || null,
          })),
          this.root.querySelector("main"),
          {
            fadeoutNodes: this.root.querySelectorAll("path.data-lines"),
            position: legendShow.split("-"),
            fadeProp: "stroke-opacity",
          }
        );
      }
    };

    update(values);

    if (legendShow !== "none") {
      const legend = this.root
        .querySelector("togostanza--legend")
        .shadowRoot.querySelector(".legend > table > tbody");

      // Set toggle behaviour
      legend.addEventListener("click", (e) => {
        const parentNode = e.target.parentNode;
        if (parentNode.nodeName === "TR") {
          const id = parentNode.dataset.id;
          parentNode.style.opacity = toggleState.get("" + id) ? 1 : 0.5;
          toggleState.set("" + id, !toggleState.get("" + id));

          // filter out data wich was clicked
          const newData = values.filter(
            (item) => !toggleState.get("" + groups.indexOf(item[groupKeyName]))
          );

          update(newData);
        }
      });
    }
  }
}

function getXTextLabelProps(angle, xLabelsMarginUp, axisPlacement = "bottom") {
  let textAnchor, dominantBaseline;
  angle = parseInt(angle);
  xLabelsMarginUp = parseInt(xLabelsMarginUp);

  let sign = 1;
  if (axisPlacement === "top") {
    dominantBaseline = "bottom";
    sign = -1;
  } else {
    dominantBaseline = "hanging";
  }

  const x = sign * xLabelsMarginUp * Math.sin((angle * Math.PI) / 180);
  const y = sign * xLabelsMarginUp * Math.cos((angle * Math.PI) / 180);

  switch (true) {
    case angle < 0 && angle % 180 !== 0:
      if (axisPlacement === "top") {
        textAnchor = "start";
      } else {
        textAnchor = "end";
      }
      if (angle === -90) {
        dominantBaseline = "central";
      }
      break;

    case angle > 0 && angle % 180 !== 0:
      if (axisPlacement === "top") {
        textAnchor = "end";
      } else {
        textAnchor = "start";
      }
      if (angle === 90) {
        dominantBaseline = "central";
      }
      break;
    case angle === 0:
      textAnchor = "middle";
      break;
    case angle % 180 === 0:
      textAnchor = "middle";
      dominantBaseline = "bottom";
      break;
  }

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
  };
}
function getYTextLabelProps(angle, yLabelsMarginRight, axisPlacement = "left") {
  let textAnchor, dominantBaseline;
  angle = parseInt(angle);
  yLabelsMarginRight = parseInt(yLabelsMarginRight);

  let sign = 1;

  if (axisPlacement === "right") {
    sign = -1;
    dominantBaseline = "hanging";
    textAnchor = "start";
  } else {
    dominantBaseline = "bottom";
    textAnchor = "end";
  }

  const x = -sign * yLabelsMarginRight * Math.cos((angle * Math.PI) / 180);
  const y = sign * yLabelsMarginRight * Math.sin((angle * Math.PI) / 180);

  switch (true) {
    case angle < 0 && angle % 180 !== 0:
      if (axisPlacement === "right") {
        dominantBaseline = "hanging";
      } else {
        dominantBaseline = "bottom";
      }
      if (angle === -90) {
        textAnchor = "middle";
      }
      break;

    case angle > 0 && angle % 180 !== 0:
      if (axisPlacement === "right") {
        dominantBaseline = "bottom";
      } else {
        dominantBaseline = "hanging";
      }
      if (angle === 90) {
        textAnchor = "middle";
      }
      break;

    case angle % 180 === 0:
      if (angle > 0) {
        textAnchor = "start";
      }
      dominantBaseline = "central";
      break;
  }

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
  };
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Linechart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "linechart-d3",
	"stanza:label": "Linechart-D3",
	"stanza:definition": "Linechart-D3 MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-01-06",
	"stanza:updated": "2021-01-06",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "x-axis-key",
		"stanza:example": "chromosome",
		"stanza:description": "Variable to be assigned as x axis value",
		"stanza:required": true
	},
	{
		"stanza:key": "y-axis-key",
		"stanza:example": "count",
		"stanza:description": "Variable to be assigned as y axis value",
		"stanza:required": true
	},
	{
		"stanza:key": "x-axis-data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"number",
			"string"
		],
		"stanza:example": "string",
		"stanza:description": "Data type of x-axis",
		"stanza:required": false
	},
	{
		"stanza:key": "group-by",
		"stanza:example": "category",
		"stanza:description": "Variable to be assigned as group",
		"stanza:required": true
	},
	{
		"stanza:key": "error-bars",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show error bars",
		"stanza:required": false
	},
	{
		"stanza:key": "error-key",
		"stanza:type": "string",
		"stanza:example": "error",
		"stanza:description": "Error data key name",
		"stanza:required": false
	},
	{
		"stanza:key": "error-bar-width",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Error bar horizontal line width",
		"stanza:required": false
	},
	{
		"stanza:key": "x-axis-title",
		"stanza:example": "chromosome",
		"stanza:description": "X axis title",
		"stanza:required": false
	},
	{
		"stanza:key": "y-axis-title",
		"stanza:example": "count",
		"stanza:description": "Y axis title",
		"stanza:required": false
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 600,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "legend",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right"
		],
		"stanza:example": "top-right",
		"stanza:description": "Where to show the legend. 'none' for no legend"
	},
	{
		"stanza:key": "xgrid",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": false,
		"stanza:description": "Show X grid"
	},
	{
		"stanza:key": "ygrid",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show Y grid"
	},
	{
		"stanza:key": "xtick",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show X tick"
	},
	{
		"stanza:key": "ytick",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show Y tick"
	},
	{
		"stanza:key": "xtick-size",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "X axis tick size"
	},
	{
		"stanza:key": "ytick-size",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Y axis tick size"
	},
	{
		"stanza:key": "xticks-number",
		"stanza:example": 5,
		"stanza:description": "X axis ticks number \n (used only if x-adis-data-type is 'number')",
		"stanza:required": false
	},
	{
		"stanza:key": "yticks-number",
		"stanza:example": 3,
		"stanza:description": "Y axis ticks number",
		"stanza:required": true
	},
	{
		"stanza:key": "xlabel-angle",
		"stanza:example": -90,
		"stanza:description": "X label angle (in degree)"
	},
	{
		"stanza:key": "ylabel-angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Y label angle (in degree)"
	},
	{
		"stanza:key": "xlabel-padding",
		"stanza:type": "number",
		"stanza:example": 7,
		"stanza:description": "Padding between X label and axis"
	},
	{
		"stanza:key": "ylabel-padding",
		"stanza:type": "number",
		"stanza:example": 7,
		"stanza:description": "Padding between Y label and tick"
	},
	{
		"stanza:key": "xtitle-padding",
		"stanza:type": "number",
		"stanza:example": 25,
		"stanza:description": "Padding between X title and label"
	},
	{
		"stanza:key": "ytitle-padding",
		"stanza:type": "number",
		"stanza:example": 40,
		"stanza:description": "Padding between Y title and label"
	},
	{
		"stanza:key": "xaxis-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top",
			"bottom"
		],
		"stanza:example": "bottom",
		"stanza:description": "X axis placement"
	},
	{
		"stanza:key": "yaxis-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"right"
		],
		"stanza:example": "left",
		"stanza:description": "Y axis placement"
	},
	{
		"stanza:key": "ylabel-format",
		"stanza:type": "string",
		"stanza:example": ",.2r",
		"stanza:description": "Y axis tick labels number format. See more format strings in d3.format() documentation"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-line-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Chart lines width"
	},
	{
		"stanza:key": "--togostanza-line-opacity",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Chart lines opacity"
	},
	{
		"stanza:key": "--togostanza-axis-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Axis color"
	},
	{
		"stanza:key": "--togostanza-axis-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Axis width"
	},
	{
		"stanza:key": "--togostanza-grid-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Grid color"
	},
	{
		"stanza:key": "--togostanza-grid-dash-length",
		"stanza:type": "number",
		"stanza:default": "",
		"stanza:description": "Grid dash length (Blank for solid lines)"
	},
	{
		"stanza:key": "--togostanza-grid-opacity",
		"stanza:type": "number",
		"stanza:default": 0.1,
		"stanza:description": "Grid opacity (0-1)"
	},
	{
		"stanza:key": "--togostanza-grid-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Grid width"
	},
	{
		"stanza:key": "--togostanza-tick-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Tick color"
	},
	{
		"stanza:key": "--togostanza-tick-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Tick width (in pixel)"
	},
	{
		"stanza:key": "--togostanza-errorbar-line-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Errorbar line width"
	},
	{
		"stanza:key": "--togostanza-errorbar-line-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Errorbar line color"
	},
	{
		"stanza:key": "--togostanza-errorbar-line-opacity",
		"stanza:type": "number",
		"stanza:default": 0.4,
		"stanza:description": "Errorbar line opacity"
	},
	{
		"stanza:key": "--togostanza-title-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Title font color"
	},
	{
		"stanza:key": "--togostanza-title-font-size",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Title font size"
	},
	{
		"stanza:key": "--togostanza-title-font-weight",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Title font weight"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"linechart-d3\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=linechart-d3.js.map
