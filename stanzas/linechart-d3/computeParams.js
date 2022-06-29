import * as d3 from "d3";

export const computeParams = (validatedParams, thisparams, data) => {
  const resultParams = new Map(validatedParams);

  for (const param of validatedParams) {
    if (thisparams.get(param[0])["stanza:computed"]) {
      switch (param[0]) {
        case "axis-x-title":
          resultParams.set("axis-x-title");
          break;
        case "axis-x-range_min":
          resultParams.set("axis-x-range_min", {
            ...param[1],
            value: getRange("x")[0],
          });
          break;
        case "axis-x-range_max":
          resultParams.set("axis-x-range_max", {
            ...param[1],
            value: getRange("x")[1],
          });
          break;
        case "axis-y-range_min":
          resultParams.set("axis-y-range_min", {
            ...param[1],
            value: getRange("y")[0],
          });
          break;
        case "axis-y-range_max":
          resultParams.set("axis-y-range_max", {
            ...param[1],
            value: getRange("y")[1],
          });
          break;
        case "axis-x-ticks_interval":
          resultParams.set("axis-x-ticks_interval", {
            ...param[1],
            value: getTickInterval("x"),
          });
          break;
        case "axis-y-ticks_interval":
          resultParams.set("axis-y-ticks_interval", {
            ...param[1],
            value: getTickInterval("y"),
          });
          break;
        default:
          break;
      }
    }
  }

  return resultParams;

  function getTickInterval(axis) {
    const interval = validatedParams.get(`axis-${axis}-ticks_interval`).value;

    if (interval && interval.value) {
      if (validatedParams.get(`axis-${axis}-scale`).value === "time") {
        const regex = /^(\d+.?\d+)(\w{0,7})/;
        const [, intervalNum, unit] = interval.match(regex);
        return [+intervalNum, unit];
      } else if (
        validatedParams.get(`axis-${axis}-scale`).value === "ordinal"
      ) {
        return 1;
      } else {
        return +interval;
      }
    } else {
      // if no interval is specified, compute it based on the data
      const [dataMin, dataMax] = getRange(axis);

      return (dataMax - dataMin) / 5;
    }
  }

  function getRange(axis) {
    if (validatedParams.get(`axis-${axis}-scale`).value === "time") {
      // if scale for this axis is time, parse it first
      return d3.extent(data, (d) =>
        Date.parse(d[validatedParams.get(`axis-${axis}-data_key`)])
      );
    } else if (validatedParams.get(`axis-${axis}-scale`).value === "ordinal") {
      return [
        data[0][validatedParams.get(`axis-${axis}-data_key`).value],
        data[data.length - 1][
          validatedParams.get(`axis-${axis}-data_key`).value
        ],
      ];
    }

    return d3.extent(
      data.map((d) => +d[validatedParams.get(`axis-${axis}-data_key`).value])
    );
  }
};
