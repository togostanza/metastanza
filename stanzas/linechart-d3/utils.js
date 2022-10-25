import * as d3 from "d3";

export function parseValue(value, scaleType) {
  if (scaleType === "linear" || scaleType === "log") {
    return parseFloat(value);
  } else if (scaleType === "time") {
    const parsedDate = new Date(value);
    return parsedDate instanceof Date ? parsedDate : NaN;
  } else {
    return value;
  }
}

//TODO place adding error bars and other stuff to utils.
export function addErrorBars(d, that) {
  const errorBarGroup = d3.select(this);

  errorBarGroup
    .select(".vertical")
    .attr("d", errorVertical.bind(that)(d, [d.y * 0.9, d.y * 1.1]));
  errorBarGroup
    .select(".top")
    .attr("d", errorHorizontalTop.bind(that)(d, [d.y * 0.9, d.y * 1.1]));
  errorBarGroup
    .select(".bottom")
    .attr("d", errorHorizontalBottom.bind(that)(d, [d.y * 0.9, d.y * 1.1]));
}

const errorVertical = (d, error) => {
  let delta = 0;
  if (this.xScale === "ordinal") {
    delta = this._scaleX.bandwidth() / 2;
  }

  return `M ${delta},${-Math.abs(
    this._scaleY(d.y) - this._scaleY(error[1])
  )} L ${delta},${Math.abs(this._scaleY(d.y) - this._scaleY(error[0]))}`;
};

const errorHorizontalTop = (d, error) => {
  const barWidth = 5;
  let delta = 0;
  if (this.xScale === "ordinal") {
    delta = this._scaleX.bandwidth() / 2;
  }
  return `M ${delta - barWidth / 2},${-Math.abs(
    this._scaleY(d.y) - this._scaleY(error[1])
  )} L ${delta + barWidth / 2},${-Math.abs(
    this._scaleY(d.y) - this._scaleY(error[1])
  )}`;
};

const errorHorizontalBottom = (d, error) => {
  const barWidth = 5;
  let delta = 0;
  if (this.xScale === "ordinal") {
    delta = this._scaleX.bandwidth() / 2;
  }
  return `M ${delta - barWidth / 2},${Math.abs(
    this._scaleY(d.y) - this._scaleY(error[0])
  )} L ${delta + barWidth / 2},${Math.abs(
    this._scaleY(d.y) - this._scaleY(error[0])
  )}`;
};
