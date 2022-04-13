import { I as InternMap } from './ordinal-0cb0fa8d.js';

function identity(x) {
  return x;
}

function group(values, ...keys) {
  return nest(values, identity, identity, keys);
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

export { group as g };
//# sourceMappingURL=group-ac79bcd0.js.map
