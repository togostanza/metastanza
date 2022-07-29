import { LitElement, html } from "lit-element";

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
  constructor(items, options) {
    super(...arguments);
    this.items = items;
    this.options = options;
    this.options.fadeProp = this.options.fadeProp ?? "opacity";
    this.options.position = this.options.position ?? ["top", "right"];
  }

  static get properties() {
    return {
      items: { type: Array },
      options: { type: Object },
    };
  }

  render() {
    return html`
      <style>
        .origin {
          position: absolute;
          top: 0;
          left: 0;
        }
        .legend {
          padding: 3px 9px;
          position: absolute;
          font-size: 10px;
          line-height: 1.5;
          max-height: 100%;
          overflow-y: auto;
          color: var(--togostanza-label-font-color);
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
      </style>
      <div class="origin"></div>
      <div class="legend">
        <table>
          <tbody>
            ${this.items.map((item) => {
              return html` <tr>
                <td data-id="${item.id}">
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
    const legend = this.shadowRoot.querySelector(".legend");

    ["top", "bottom", "left", "right"].forEach((pos) => {
      legend.style[pos] = "";
    });

    this.options.position.forEach((position) => {
      legend.style[position] = 0;
    });

    if (!this.options.fadeoutNodes) {
      return;
    }

    this._leader = this.shadowRoot.querySelector(".leader");

    legend.addEventListener("mouseover", this._mouseOverHandler.bind(this));

    legend.addEventListener("mouseout", this._mouseOutHandler.bind(this));

    legend.addEventListener("click", this._clickHandler.bind(this));
  }

  _mouseOutHandler(e) {
    if (e.target.nodeName === "TD") {
      e.stopPropagation();
      this.options.fadeoutNodes.forEach((node) => {
        node.style[this.options.fadeProp] = "";
      });
      this._leader.classList.remove("-show");
    }
  }

  _mouseOverHandler(e) {
    if (e.target.nodeName === "TD") {
      e.stopPropagation();
      const datum = this.items.find((item) => item.id === e.target.dataset.id);
      if (!datum.node) {
        return;
      }
      if (datum) {
        this.options.fadeoutNodes.forEach((node) => {
          node.style[this.options.fadeProp] = 0.2;
        });

        if (Array.isArray(datum.node) && datum.node.length !== 0) {
          datum.node.forEach(
            (item) => (item.style[this.options.fadeProp] = "")
          );
        } else if (!Array.isArray(datum.node)) {
          datum.node.style[this.options.fadeProp] = "";
        } else {
          return;
        }

        if (this.options.showLeaders) {
          this._leader.classList.add("-show");
          const originRect = this.renderRoot
            .querySelector(".origin")
            .getBoundingClientRect();
          const legendRect = e.target.getBoundingClientRect();
          const targetRect = datum.node.getBoundingClientRect();
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

  _clickHandler(e) {
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

  disconnectedCallback() {
    this.removeEventListener("mouseover", this._mouseOverHandler.bind(this));
    this.removeEventListener("mouseleave", this._mouseLeaveHandler.bind(this));
    this.removeEventListener("click", this._clickHandler.bind(this));
  }
}

customElements.define("togostanza--legend2", Legend2);
