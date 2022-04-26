/* eslint-disable */
const fs = require("fs");
const merge = require("deepmerge-json");

try {
  const commonParams = require("../../lib/json/stanzaCommon.json");
  const axisXCommonParams = require("../../lib/json/axisXCommon.json");
  const axisYCommonParams = require("../../lib/json/axisYCommon.json");

  const mergedJSON = JSON.stringify(
    merge.multi(commonParams, axisXCommonParams, axisYCommonParams),
    null,
    4
  );
  fs.writeFileSync("metadata.json", mergedJSON);
  console.log("Done merging");
} catch (error) {
  console.error(error);
}
