/**
 * Validates params given to a stanza
 * Throws error if params marked as `required` are not present
 * @param {object} metadata contents of metadata JSON file
 * @param {object} thisparams this.params object of a stanza
 * @returns {Map} map of params with values {default: value, required: boolean}
 */
export default function validateParams(metadata, thisparams) {
  const params = new Map(
    metadata["stanza:parameter"].map((param) => [
      param["stanza:key"],
      {
        default: param["stanza:example"],
        required: !!param["stanza:required"],
      },
    ])
  );

  for (const param in thisparams) {
    if (
      params.get(param).required &&
      typeof thisparams[param] === "undefined"
    ) {
      throw new Error(`Required parameter ${param} is not defined`);
    }
  }

  return params;
}
