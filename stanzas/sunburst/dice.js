export default function (parent, x0, y0, x1, y1) {
  var nodes = parent.children,
    node,
    i = -1,
    n = nodes.length;

  let nodeSum = 0;
  while (++i < n) {
    nodeSum += nodes[i].value2;
  }
  i = -1;

  let k = parent.value && (x1 - x0) / nodeSum;

  while (++i < n) {
    (node = nodes[i]), (node.y0 = y0), (node.y1 = y1);
    (node.x0 = x0), (node.x1 = x0 += node.value2 * k);
  }
}
