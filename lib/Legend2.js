import { LitElement, html, css } from "lit";

export default class Legend2 extends LitElement {
  /**
   *
   * @param {Object[]} items - Array of objects
   * @param {string?} items[].id - id of item
   * @param {label} items[].label - label of item
   * @param {string} items[].color - color of item
   * @param {number?} items[].value - value of item
   * @param {HTMLElement?} items[].node - node of item/ Can be array of nodes
   * @param {Object} options - Options object
   * @param {NodeList?} options.fadeoutNodes - Nodelist of nodes to fade out
   * @param {string?} options.fadeProp - Property to fade out
   * @param {string?} options.position - Position of legend
   * @param {boolean} options.showLeaders - Direction of leader
   */
  constructor() {
    if (Legend2._instance) {
      return Legend2._instance;
    }
    super(...arguments);
    Legend2._instance = this;
    this.items = [];
    this.toggled = [];
    this.options = {};
    this.nodes = [];
    this.legend = null;
    this.title = "";
    this._datumMap = new Map();
    this.options.fadeProp = this.options.fadeProp ?? "opacity";
    this.options.position = this.options.position ?? ["top", "right"];
  }

  static get properties() {
    return {
      items: { type: Array },
      nodes: { type: Array },
      options: { type: Object },
      toggled: { type: Array },
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      .origin {
        position: absolute;
        top: 0;
        left: 0;
      }
      .legend {
        padding: 3px 9px;

        font-size: 10px;
        line-height: 1.5;
        max-height: 100%;
        overflow-y: auto;
        color: var(--togostanza-fonts-font_color);
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        white-space: nowrap;
      }
      .legend > table > tbody > tr > td > .marker {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 100%;
        vertical-align: middle;
        margin-right: 0.3em;
      }
      .legend > table > tbody > tr > td.number {
        text-align: right;
      }

      .legend > .title {
        font-size: var(--togostanza-fonts-font_size_secondary);
      }
      .leader {
        position: absolute;
        border-left: dotted 1px black;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
      }
      .leader[data-direction="top"] {
        border-top: dotted 1px black;
      }
      .leader[data-direction="bottom"] {
        border-bottom: dotted 1px black;
      }
      .leader.-show {
        opacity: 0.5;
      }
      .toggled {
        opacity: 0.5;
      }
    `;
  }

  render() {
    return html`
      <div class="origin"></div>
      <div class="legend">
        ${this.title && html`<h2 class="title">${this.title}</h2>`}
        <table>
          <tbody>
            ${this.items.map((item) => {
              return html` <tr>
                <td
                  data-id="${item.id}"
                  class="${item.toggled ? "toggled" : ""}"
                >
                  <span
                    class="marker"
                    style="background-color: ${item.color}"
                  ></span
                  >${item.label}
                </td>
                ${item.value
                  ? html`<td class="${(typeof item.value).toLowerCase()}">
                      ${item.value}
                    </td>`
                  : ""}
              </tr>`;
            })}
          </tbody>
        </table>
      </div>
      <div class="leader"></div>
    `;
  }

  firstUpdated() {
    // placement
    this.legend = this.shadowRoot.querySelector(".legend");
  }

  _mouseOverHandler(e) {
    if (this.nodes?.length) {
      if (e.target.nodeName === "TD") {
        e.stopPropagation();

        const nodes = this._datumMap.get(e.target.dataset.id);

        if (nodes) {
          this.options.fadeoutNodes.forEach((node) => {
            node.style[this.options.fadeProp] = 0.2;
          });

          if (Array.isArray(nodes) && nodes.length !== 0) {
            nodes.forEach((item) => (item.style[this.options.fadeProp] = ""));
          } else if (!Array.isArray(nodes)) {
            nodes.style[this.options.fadeProp] = "";
          } else {
            return;
          }

          if (this.options.showLeaders) {
            this._leader.classList.add("-show");
            const originRect = this.renderRoot
              .querySelector(".origin")
              .getBoundingClientRect();
            const legendRect = e.target.getBoundingClientRect();
            const targetRect = nodes.getBoundingClientRect();
            this._leader.style.left =
              targetRect.x + targetRect.width * 0.5 - originRect.x + "px";
            this._leader.style.width =
              legendRect.x - targetRect.right + targetRect.width * 0.5 + "px";
            const legendMiddle = legendRect.y + legendRect.height * 0.5;
            const targetMiddle = targetRect.y + targetRect.height * 0.5;
            if (legendMiddle < targetMiddle) {
              this._leader.dataset.direction = "top";
              this._leader.style.top = legendMiddle - originRect.y + "px";
              this._leader.style.height = targetMiddle - legendMiddle + "px";
            } else {
              this._leader.dataset.direction = "bottom";
              this._leader.style.top = targetMiddle - originRect.y + "px";
              this._leader.style.height = legendMiddle - targetMiddle + "px";
            }
          }
        }
      }
    }
  }

  _mouseOutHandler(e) {
    if (this.nodes?.length) {
      if (e.target.nodeName === "TD") {
        e.stopPropagation();
        this.options.fadeoutNodes.forEach((node) => {
          node.style[this.options.fadeProp] = "";
        });
        this._leader.classList.remove("-show");
      }
    }
  }

  _clickHandler(e) {
    if (this.nodes?.length) {
      if (e.target.nodeName === "TD") {
        this.renderRoot.dispatchEvent(
          new CustomEvent("legend-item-click", {
            bubbles: true,
            composed: true,
            detail: {
              label: this.items.find((item) => item.id === e.target.dataset.id)
                ?.label,
            },
          })
        );
      }
    }
  }

  willUpdate(changed) {
    if (changed.has("nodes") && this.nodes?.length) {
      this.nodes.forEach((node) => {
        this._datumMap.set(node.id, node.node);
      });
      this._leader = this.shadowRoot.querySelector(".leader");

      this.legend.addEventListener(
        "mouseover",
        this._mouseOverHandler.bind(this)
      );

      this.legend.addEventListener(
        "mouseout",
        this._mouseOutHandler.bind(this)
      );

      this.legend.addEventListener("click", this._clickHandler.bind(this));
    }
  }

  disconnectedCallback() {
    this.legend.removeEventListener(
      "mouseover",
      this._mouseOverHandler.bind(this)
    );
    this.legend.removeEventListener(
      "mouseleave",
      this._mouseOutHandler.bind(this)
    );
    this.legend.removeEventListener("click", this._clickHandler.bind(this));
  }
}

customElements.define("togostanza--legend2", Legend2);
