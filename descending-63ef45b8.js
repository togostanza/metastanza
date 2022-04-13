function descending(a, b) {
  return a == null || b == null ? NaN
    : b < a ? -1
    : b > a ? 1
    : b >= a ? 0
    : NaN;
}

export { descending as d };
//# sourceMappingURL=descending-63ef45b8.js.map
