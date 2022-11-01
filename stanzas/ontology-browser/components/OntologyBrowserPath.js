import { LitElement, html, css } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { map } from "lit/directives/map.js";

class OntologyPath extends LitElement {
  constructor() {
    super();
    this.path = [];
    this._container = createRef();
    this.selectedNodeId = "";
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }

      .path-header {
        font-size: var(--togostanza-fonts-font_size_primary);
        margin: 0;
        width: calc(100% - (100% / 3 - min(85% / 3, 20rem)));
        max-width: calc(100% - (100% / 3 - 30rem));
      }

      .path-container {
        white-space: nowrap;
        overflow-x: scroll;
        display: flex;
        gap: 0.2em;
        align-items: center;
        justify-content: flex-start;
        height: 4rem;
        max-width: calc(100% - (100% / 3 - 30rem));
        width: calc(100% - (100% / 3 - min(85% / 3, 20rem)));
      }

      .node {
        cursor: pointer;
        display: inline-block;
        font-size: var(--togostanza-fonts-font_size_secondary);
        padding: 0 0.6em;
        width: 10em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .node-container {
        display: block;
        position: relative;
        margin-right: -3em;
        transform: rotate(340deg);
      }

      .node-container:before {
        content: "";
        display: block;
        width: 5px;
        height: 5px;
        border: 1px solid var(--togostanza-border-color);
        position: absolute;
        border-radius: 50%;
        bottom: 0;
      }

      .node-container + .node-container:after {
        content: "";
        display: block;
        width: 2.35em;
        height: 1px;
        border-bottom: 1px solid var(--togostanza-border-color);
        transform: rotate(200deg);
        transform-origin: left bottom;
        box-sizing: border-box;
        position: absolute;
        bottom: 0.25em;
      }

      .node:hover {
        filter: brightness(1.05);
      }

      .-active {
        font-weight: bold;
      }
    `;
  }

  static get properties() {
    return {
      path: { type: Array, state: true },
      selectedNodeId: { type: String, state: true },
    };
  }

  _nodeClickHandler(e) {
    if (e.target.classList.contains("node")) {
      this.selectedNodeId = e.target.id;
      const selectedNodeId = e.target.id.match(/(^.+(?=-))/g)[0];

      this.dispatchEvent(
        new CustomEvent("history-clicked", {
          detail: {
            id: selectedNodeId,
          },
          composed: true,
        })
      );
    }
  }

  updated(changed) {
    if (changed.get("path")) {
      this._container.value.scrollLeft = this._container.value.scrollWidth;
    }
  }

  render() {
    return html`
      <div class="container">
        <h2 class="path-header">History</h2>
        <div
          class="path-container"
          @click="${this._nodeClickHandler}"
          ${ref(this._container)}
        >
          ${map(this.path, (node, i) => {
            const id = `${node.id}-${i}`;
            return html`<span class="node-container">
              <span
                id="${id}"
                class="node ${id === this.selectedNodeId ? "-active" : ""}"
                title="${node.label}"
                >${node.label}</span
              >
            </span>`;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-browser-path", OntologyPath);
