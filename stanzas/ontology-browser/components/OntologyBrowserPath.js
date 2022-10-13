import { LitElement, html, css } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { map } from "lit/directives/map.js";

class OntologyPath extends LitElement {
  constructor() {
    super();
    this.path = [];
    this._container = createRef();
  }

  static get styles() {
    return css`
      .path-container {
        background-color: #ccc;
        white-space: nowrap;
        overflow-x: scroll;
        display: flex;
        gap: 0.2em;
        align-items: center;
        justify-content: flex-start;
        height: 2em;
      }

      .node {
        background-color: var(--togostanza-node-bg-color);
        border-radius: 5px;
        border: 1px solid var(--togostanza-border-color);
        cursor: pointer;
        display: inline-block;
        font-size: var(--togostanza-fonts-font_size_secondary);
        padding: 0 0.6em;
      }

      .node:hover {
        filter: brightness(1.05);
      }

      .-active {
        background-color: var(--togostanza-node-bg-color-selected);
        border-color: var(--togostanza-border-color-selected);
      }
    `;
  }

  static get properties() {
    return {
      path: { type: Array, state: true },
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
      <div
        class="path-container"
        @click="${this._nodeClickHandler}"
        ${ref(this._container)}
      >
        ${map(this.path, (node, i) => {
          const id = `${node.id}-${i}`;
          return html`<span
            id="${id}"
            class="node ${id === this.selectedNodeId && "-active"}"
            >${node.label}</span
          >`;
        })}
      </div>
    `;
  }
}

customElements.define("ontology-browser-path", OntologyPath);
