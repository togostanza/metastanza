/* eslint-disable */

module.exports = {
  mergeExamples: function mergeExamples(arrays, key) {
    const r = [];
    const hash = Object.create(null);

    arrays.forEach(function (a) {
      a.forEach(function (o) {
        if (!hash[o[key]]) {
          hash[o[key]] = {};
          r.push(hash[o[key]]);
        }
        Object.keys(o).forEach(function (k) {
          hash[o[key]][k] = o[k];
        });
      });
    });
    return r;
  },
};
