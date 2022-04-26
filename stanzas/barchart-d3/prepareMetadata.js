/* eslint-disable */
const fs = require("fs");
const merge = require("deepmerge-json");
const { mergeExamples } = require("../../lib/replaceExampleMetadata");

try {
  const common = require("../../lib/json/stanzaCommon.json");
  const axisXCommon = require("../../lib/json/axisXCommon.json");
  const axisYCommon = require("../../lib/json/axisYCommon.json");
  const DataSeriesCommon = require("../../lib/json/dataSeriesCommon.json");
  const colorDatapointsCommon = require("../../lib/json/coloringDatapointsCommon.json");
  const tooltipsCommon = require("../../lib/json/tooltipsCommon.json");
  const thisStanzaParams = require("./thisStanzaParams.json");
  const exampleValues = require("./customExampleValues.json");

  const merged = merge.multi(
    common,
    thisStanzaParams,
    axisXCommon,
    axisYCommon,
    DataSeriesCommon,
    colorDatapointsCommon,
    tooltipsCommon
  );

  const mergedWithExamplesParams = mergeExamples(
    [merged["stanza:parameter"], exampleValues["stanza:parameter"]],
    "stanza:key"
  );
  const mergedWithExamplesStyles = mergeExamples(
    [merged["stanza:style"], exampleValues["stanza:style"]],
    "stanza:key"
  );

  merged["stanza:parameter"] = mergedWithExamplesParams;
  merged["stanza:style"] = mergedWithExamplesStyles;

  const mergedJSON = JSON.stringify(merged, null, 2);
  fs.writeFileSync("metadata-new.json", mergedJSON);
  console.log("Done merging");
} catch (error) {
  console.error(error);
}
