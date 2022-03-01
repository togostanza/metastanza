import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import cytoscape from "cytoscape";
import euler from "cytoscape-euler";
import popper from "cytoscape-popper";
import { scaleOrdinal } from "d3-scale";
import debounce from "lodash.debounce";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "force-graph"),
      downloadPngMenuItem(this, "force-graph"),
      downloadJSONMenuItem(this, "force-graph", this._data),
      downloadCSVMenuItem(this, "force-graph", this._data),
      downloadTSVMenuItem(this, "force-graph", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //data

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this._data = values;

    //Overall
    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);

    // Nodes
    const showNodeLabels = this.params["show-node-labels"];
    const nodeLabelKey = this.params["node-label-key"] || "id";
    const showNodeTooltips = this.params["show-node-tooltips"];
    const nodeTooltipKey = this.params["node-tooltip-key"] || nodeLabelKey;
    const nodeColorKey = this.params["node-color-key"];

    const nodeLabelOutlineWidth =
      parseInt(css("--togostanza-node-label-outline-width")) || 1;
    const nodeLabelOutlineOpacity =
      parseFloat(css("--togostanza-node-label-outline-opacity")) || 1;

    const nodeLabelStyle = {
      "font-size": css("--togostanza-node-label-font-size") || "10px",
      "font-family": css("--togostanza-node-label-font-family") || "sans-serif",
      color: css("--togostanza-node-label-font-color") || "#000000",
      ...(nodeLabelOutlineWidth ? { "text-outline-color": "data(color)" } : {}),
      ...(nodeLabelOutlineWidth
        ? { "text-outline-width": nodeLabelOutlineWidth }
        : {}),
      ...(nodeLabelOutlineWidth
        ? { "text-outline-opacity": nodeLabelOutlineOpacity }
        : {}),
      "text-margin-y": parseInt(css("--togostanza-node-label-margin-y")) || 20,
    };

    const nodePathStartEndOutlineColor = "red";
    const nodePathStartEndOutlineWidth = 5;
    const nodePathStartEndOutlineOpacity = 0.6;

    const nodePathInBetweenOutlineColor = "blue";
    const nodePathInBetweenOutlineWidth = 4;
    const nodePathInBetweenOutlineOpacity = 0.6;

    const nodeBorderStyle = {
      "border-color": css("--togostanza-border-color") || "#4E5059",
      "border-width": css("--togostanza-border-width") || "1px",
      "border-style": css("--togostanza-border-style") || "solid",
    };
    // Edges
    const showEdgeLabels = this.params["show-edge-labels"];
    const edgeLabelKey = "label";
    const showEdgeTooltips = this.params["show-edge-tooltips"];
    const edgeTooltipKey = this.params["edge-tooltip-key"] || "id";

    const edgeLabelStyle = {
      "text-rotation":
        parseInt(css("--togostanza-edge-label-rotation").trim()) + "deg" ||
        "autorotate",
      "text-margin-x": "0px",
      "text-margin-y": "0px",
      "font-size": css("--togostanza-edge-label-font-size").trim() || "10px",
      "font-weight":
        css("--togostanza-edge-label-font-weight").trim() || "normal",
      "font-family":
        css("--togostanza-edge-label-font-family").trim() || "sans-serif",
      color: css("--togostanza-edge-label-font-color").trim() || "#000000",
      "text-background-color":
        css("--togostanza-edge-label-background-color").trim() || "#e6e6e6",
      "text-background-opacity":
        css("--togostanza-edge-label-background-opacity") || 1,
    };

    const edgePathOutlineColor = "red";
    const edgePathOutlineWidth = 5;
    const edgePathOutlineOpacity = 0.5;

    // Others
    const highlightPath = true;

    let selectedNodes = [];

    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }

    const el = this.root.getElementById("force-graph");

    el.style.width = width + "px";
    el.style.height = height + "px";

    const color = scaleOrdinal().range(togostanzaColors);

    cytoscape.use(euler);
    cytoscape.use(popper);

    const nodes = values.nodes.map((node) => ({
      group: "nodes",
      data: { ...node, label: node.id, color: color(node[nodeColorKey]) },
    }));

    const edges = values.links.map((link) => ({
      group: "edges",
      data: { ...link, label: "some label" },
    }));

    const elements = [...nodes, ...edges];

    const edgeStyle = {
      width: 1,
      "line-color": "#369",
      "target-arrow-color": "#369",
      "curve-style": "straight",
      "target-arrow-shape": "triangle",
      "target-arrow-fill": "fill",
    };

    const cy = cytoscape({
      container: el, // container to render in
      elements, // elements to start with
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            ...(showNodeLabels ? { label: `data(${nodeLabelKey})` } : {}),
            "background-color": "data(color)",
            ...nodeBorderStyle,
            ...nodeLabelStyle,
          },
        },

        {
          selector: ".node-start-end-highlighted",
          style: {
            "border-color": nodePathStartEndOutlineColor,
            "border-width": nodePathStartEndOutlineWidth,
            "border-opacity": nodePathStartEndOutlineOpacity,
          },
        },
        {
          selector: ".node-in-between-highlighted",
          style: {
            "border-color": nodePathInBetweenOutlineColor,
            "border-width": nodePathInBetweenOutlineWidth,
            "border-opacity": nodePathInBetweenOutlineOpacity,
          },
        },

        {
          selector: "edge",
          style: edgeStyle,
        },

        {
          selector: "edge[label]",
          style: {
            ...(showEdgeLabels ? { label: `data(${edgeLabelKey})` } : {}),
            ...edgeLabelStyle,
          },
        },

        {
          selector: ".edge-highlighted",
          style: {
            "line-color": edgePathOutlineColor,
            width: edgePathOutlineWidth,
            "line-opacity": edgePathOutlineOpacity,
          },
        },
      ],
      zoom: 1,
      pan: { x: 250, y: 250 },
    });

    const layout = cy.layout({
      name: "euler",

      // The ideal length of a spring
      // - This acts as a hint for the edge length
      // - The edge length can be longer or shorter if the forces are set to extreme values
      springLength: (edge) => 100,

      // Hooke's law coefficient
      // - The value ranges on [0, 1]
      // - Lower values give looser springs
      // - Higher values give tighter springs
      springCoeff: (edge) => 0.0002,

      // The mass of the node in the physics simulation
      // - The mass affects the gravity node repulsion/attraction
      mass: (node) => {
        return Math.sqrt(parseInt(node._private.edges.length * 10));
      },

      // Coulomb's law coefficient
      // - Makes the nodes repel each other for negative values
      // - Makes the nodes attract each other for positive values
      gravity: -1,

      // A force that pulls nodes towards the origin (0, 0)
      // Higher values keep the components less spread out
      pull: 0.0003,

      // Theta coefficient from Barnes-Hut simulation
      // - Value ranges on [0, 1]
      // - Performance is better with smaller values
      // - Very small values may not create enough force to give a good result
      theta: 0.99,

      // Friction / drag coefficient to make the system stabilise over time
      dragCoeff: 0.02,

      // When the total of the squared position deltas is less than this value, the simulation ends
      movementThreshold: 1,

      // The amount of time passed per tick
      // - Larger values result in faster runtimes but might spread things out too far
      // - Smaller values produce more accurate results
      timeStep: 20,

      // The number of ticks per frame for animate:true
      // - A larger value reduces rendering cost but can be jerky
      // - A smaller value increases rendering cost but is smoother
      refresh: 10,

      // Whether to animate the layout
      // - true : Animate while the layout is running
      // - false : Just show the end result
      // - 'end' : Animate directly to the end result
      animate: true,

      // Animation duration used for animate:'end'
      animationDuration: undefined,

      // Easing for animate:'end'
      animationEasing: undefined,

      // Maximum iterations and time (in ms) before the layout will bail out
      // - A large value may allow for a better result
      // - A small value may make the layout end prematurely
      // - The layout may stop before this if it has settled
      maxIterations: 1000,
      maxSimulationTime: 4000,

      // Prevent the user grabbing nodes during the layout (usually with animate:true)
      ungrabifyWhileSimulating: false,

      // Whether to fit the viewport to the repositioned graph
      // true : Fits at end of layout for animate:false or animate:'end'; fits on each frame for animate:true
      fit: true,

      // Padding in rendered co-ordinates around the layout
      padding: 40,

      // Constrain layout bounds with one of
      // - { x1, y1, x2, y2 }
      // - { x1, y1, w, h }
      // - undefined / null : Unconstrained
      boundingBox: undefined,

      /*eslint-disable */
      // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
      ready: function () {
        // on layoutready
        // el.style.width += 1;
        // el.style.width -= 1;
        // cy.resize();
      },
      stop: function () {}, // on layoutstop
      /*eslint-enable */

      // Whether to randomize the initial positions of the nodes
      // true : Use random positions within the bounding box
      // false : Use the current node positions as the initial positions
      randomize: false,
    });

    layout.run();

    layout.one("layoutstop", () => {
      cy.resize();
    });

    // some Cytoscape magic to make tooltips work in shadow dom
    cy.on("mouseup", () => {
      cy.renderer().hoverData.capture = true;
    });

    if (showNodeTooltips) {
      cy.nodes().unbind("mouseover");
      cy.nodes().bind("mouseover", (event) => {
        event.target.popperRefObj = event.target.popper({
          content: () => {
            const content = document.createElement("div");
            const arrow = document.createElement("div");
            const container = document.createElement("div");

            container.classList.add("popper-container");
            content.classList.add("popper-div");
            arrow.classList.add("popper-arrow");

            content.innerText = event.target.data(nodeTooltipKey);

            container.appendChild(content);
            container.appendChild(arrow);
            this.root.appendChild(container);

            return container;
          },
          popper: { placement: "top" },
        });
      });

      cy.nodes().unbind("mouseout");
      cy.nodes().bind("mouseout", (event) => {
        if (event.target.popper) {
          event.target.popperRefObj.state.elements.popper.remove();
          event.target.popperRefObj.destroy();
        }
      });
    }

    if (showEdgeTooltips) {
      cy.edges().unbind("mouseover");
      cy.edges().bind("mouseover", (event) => {
        event.target.popperRefObj = event.target.popper({
          content: () => {
            const content = document.createElement("div");
            const container = document.createElement("div");

            content.classList.add("popper-div");
            container.classList.add("popper-container");
            content.innerText = event.target.data(edgeTooltipKey);

            container.appendChild(content);

            this.root.appendChild(container);

            return container;
          },
          popper: { placement: "auto" },
        });
      });

      cy.edges().unbind("mouseout");
      cy.edges().bind("mouseout", (event) => {
        if (event.target.popper) {
          event.target.popperRefObj.state.elements.popper.remove();
          event.target.popperRefObj.destroy();
        }
      });
    }

    if (highlightPath) {
      let connectedEdges;
      let connectedNodes;

      cy.nodes().unbind("click");
      cy.nodes().bind("click", (event) => {
        if (selectedNodes.includes(event.target)) {
          // delete node from selectedNodes (toggle selection)
          selectedNodes = selectedNodes.filter((node) => node !== event.target);

          event.target.removeClass("node-start-end-highlighted");

          // if there are already paths, remove them
          if (connectedEdges) {
            connectedEdges.removeClass("edge-highlighted");
            connectedEdges = undefined;
          }
          // if there are already paths, remove them
          if (connectedNodes) {
            connectedNodes.removeClass("node-in-between-highlighted");
            connectedNodes = undefined;
          }
        } else {
          // if we are adding, and there are not 2 nodes in selected array, add this node

          if (selectedNodes.length < 2) {
            selectedNodes.push(event.target);
            event.target.addClass("node-start-end-highlighted");
          }
          // if we selected 2 nodes, we can calculate the shortest path
          if (selectedNodes.length === 2) {
            const dfs = cy.elements().aStar({
              root: selectedNodes[0],
              goal: selectedNodes[1],
              weight: (edge) => edge.value,
            });

            connectedEdges = dfs.path.edges();
            connectedNodes = dfs.path.nodes();
            connectedNodes.forEach((node, i) => {
              if (i !== 0 && i !== connectedNodes.length - 1) {
                node.addClass("node-in-between-highlighted");
              }
            });
            connectedEdges.addClass("edge-highlighted");
            // console.log(connectedNodes);
          }
        }
      });
    }

    cy.on("dblclick", () => layout.run());

    // rerender the cytoscape
    const scrollHandler = debounce(() => {
      cy.resize();
    }, 100);

    document.addEventListener("scroll", scrollHandler);
  }
}
