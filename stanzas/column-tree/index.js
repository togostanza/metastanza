import Stanza from "togostanza/stanza";
import { createApp } from "vue";
import App from "./app.vue";
import { appendCustomCss } from "@/lib/metastanza_utils.js";

// {/* <table class="layer0">
//   <tbody>
//     <tr>
//       <th>LAYER0</th>
//     </tr>
//     {{#each layer0 as |value|}}
//       <tr class="item" data-id={{value.id}}>
//         <td>{{value.name}}</td>
//       </tr>
//     {{/each}}
//   </tbody>
// </table> */}

// const node = (name) => {
//   const tr = document.createElement("tr");
//   tr.innerText = name;
// };

    // const getNodes = (parentId) => {
    //   return dataset.filter((record) => parentId === record.parent);
    // };

    // const addTable = (nodes, depth, target) => {
    //   const table = document.createElement("table");
    //   table.className = `layer${depth}`;
    //   table.innerHTML = `
    //     <tbody>
    //       <tr>
    //         <th>LAYER${depth}</th>
    //       </tr>
    //         <tr class="node" data-id=${nodes[0].id}>
    //           <td>${nodes[0].name}</td>
    //         </tr>
    //     </tbody>`;
    //   this.root.querySelector(".container").appendChild(table);
    // };

    // const node = (name) => {
    //   const tr = document.createElement("tr");
    //   tr.innerText = name;
    // };
    // const layers = new Map([
    //   ["layer0", dataset.filter((record) => !record.parent)],
    //   ["layer1", []],
    //   ["layer2", []],
    //   ["layer3", []],
    //   ["layer4", []],
    //   ["layer5", []],
    // ]);
    // let nestedData = {};
    // nestedData = first;
    // const firstIds = first.map(record => record.id);
    // for(const parent of nestedData){
    //   nestedData.children = dataset.filter(record => parent.id === record.parent);
    //   for(const child1 of nestedData.children) {
    //     child1.children = dataset.filter(
    //       (record) => child1.id === record.parent
    //     );
    //     for(const child2 of child1.children) {
    //       child2.children = dataset.filter(
    //         (record) => child2.id === record.parent
    //       );
    //     }
    //   }
    // }
    // const second = dataset.filter(record => firstIds.includes(record.parent));
    // const secondIds = second.map(record => record.id);
    // const third = dataset.filter(record => secondIds.includes(record.parent));
    // console.log(nestedData);
    // console.log(second);
    // console.log(third);
    // const values = dataset.map(record => { return { name: record.name} });
    // this.renderTemplate({
    //   template: "stanza.html.hbs",
    //   parameters: {
    //     layer0: layers.get("layer0"),
    //     layer1: layers.get("layer1"),
    //     layer2: layers.get("layer2"),
    //     layer3: layers.get("layer3"),
    //     layer4: layers.get("layer4"),
    //     layer5: layers.get("layer5"),
    //   },
    // });

    // function eventHandlerNode(el) {
    //   const parentTable = el.closest("table").className;
    //   const depth = parseInt(parentTable.slice(-1));
    //   const childNodes = getNodes(parseInt(el.dataset.id));
    //   layers.set(`layer${depth + 1}`, childNodes);
    //   // addTable(childNodes, depth + 1, parentTable);
    //   console.log(layers);
    // }

    // for (const node of this.root.querySelectorAll(".node")) {
    //   console.log(node);
    //   node.addEventListener("click", () => eventHandlerNode(node));
    // }

export default class ColumnTree extends Stanza {
  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";

    this._app?.unmount();
    this._app = createApp(App, this.params);
    this._app.mount(main);

  }
}
