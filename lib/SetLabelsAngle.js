export function getXTextLabelProps(
  angle,
  xLabelsMarginUp,
  axisPlacement = "bottom"
) {
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
    default:
      break;
  }

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
  };
}
export function getYTextLabelProps(
  angle,
  yLabelsMarginRight,
  axisPlacement = "left"
) {
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
    default:
      break;
  }

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
  };
}
