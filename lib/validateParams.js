/**
 * Validates params given to a stanza
 * Throws error if params marked as `required` are not present
 * @param {object} metadata contents of metadata JSON file
 * @param {object} thisparams this.params object of a stanza
 * @returns {Map} map of params with values {default: value, required: boolean}
 */
export default function validateParams(metadata, thisparams) {
  const exampleHosts = ["localhost", "127.0.0.1", "togostanza.github.io"];
  const examplePathname = `/${metadata["@id"]}.html`;
  // TODO how to know if this is an example page or user page? Better way to do this?
  const isExamplePage =
    exampleHosts.includes(window.location.hostname) &&
    window.location.pathname === examplePathname;

  const params = new Map(
    metadata["stanza:parameter"].map((param) => {
      return [
        param["stanza:key"],
        {
          value:
            typeof thisparams[param["stanza:key"]] === "undefined"
              ? (isExamplePage
                  ? param["stanza:example"]
                  : param["stanza:default"]) || null
              : thisparams[param["stanza:key"]],
          computed: !!param["stanza:computed"],
        },
      ];
    })
  );

  // // loop in all params from user
  // for (const param in thisparams) {
  //   if (
  //     params.get(param).required &&
  //     typeof thisparams[param] === "undefined"
  //   ) {
  //     throw new Error(`Required parameter ${param} is not defined`);
  //   } else {
  //     params.set(param, {
  //       ...params.get(param),
  //       value:
  //         typeof thisparams[param] !== "undefined"
  //           ? thisparams[param]
  //           : params.get(param).value,
  //     });
  //   }
  // }

  return params;
}
