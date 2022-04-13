import { s, $ } from './stanza-element-f1811bb2.js';

class Legend extends s {
  constructor() {
    super();
    this.items = [];
  }

  static get properties() {
    return {
      items: { type: Array },
    };
  }

  render() {
    return $`
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
              return $` <tr data-id="${item.id}">
                <td>
                  <span
                    class="marker"
                    style="background-color: ${item.color}"
                  ></span
                  >${item.label}
                </td>
                ${item.value
                  ? $`<td class="${(typeof item.value).toLowerCase()}">
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
  /**
   *
   * @param {Object[]} items
   * @param {string?} items[].id
   * @param {label} items[].label
   * @param {string} items[].color
   * @param {number?} items[].value
   * @param {HTMLElement?} items[].node
   * @param {Node} container
   * @param {Object} opt
   * @param {NodeList?} opt.fadeoutNodes
   * @param {string?} opt.fadeProp
   */
  setup(items, container, opt) {
    console.log(container);
    this.items = items;

    this.render();

    const positions = opt.position || ["top", "right"];

    //  name of style property to fadeout. for fill - "opacity", for path's stroke - "stroke-opacity" etc.
    const fadeProp = opt.fadeProp || "opacity";

    // show/not show leaders
    const showLeaders = opt.showLeaders;
    // placement
    const legend = this.shadowRoot.querySelector(".legend");

    ["top", "bottom", "left", "right"].forEach((pos) => {
      legend.style[pos] = "";
    });

    positions.forEach((position) => {
      legend.style[position] = 0;
    });

    if (!opt.fadeoutNodes) {
      return;
    }

    const leader = this.shadowRoot.querySelector(".leader");

    // event
    window.requestAnimationFrame(() => {
      this.shadowRoot
        .querySelectorAll(".legend > table > tbody > tr")
        .forEach((tr) => {
          tr.addEventListener("mouseover", () => {
            const datum = items.find((item) => item.id === tr.dataset.id);
            if (!datum.node) {
              return;
            }
            if (datum) {
              opt.fadeoutNodes.forEach((node) => {
                node.style[fadeProp] = 0.2;
              });

              if (Array.isArray(datum.node) && datum.node.length !== 0) {
                datum.node.forEach((item) => (item.style[fadeProp] = ""));
              } else if (!Array.isArray(datum.node)) {
                datum.node.style[fadeProp] = "";
              } else {
                return;
              }

              if (showLeaders) {
                leader.classList.add("-show");
                const originRect = this.shadowRoot
                  .querySelector(".origin")
                  .getBoundingClientRect();
                const legendRect = tr.getBoundingClientRect();
                const targetRect = datum.node.getBoundingClientRect();
                leader.style.left =
                  targetRect.x + targetRect.width * 0.5 - originRect.x + "px";
                leader.style.width =
                  legendRect.x -
                  targetRect.right +
                  targetRect.width * 0.5 +
                  "px";
                const legendMiddle = legendRect.y + legendRect.height * 0.5;
                const targetMiddle = targetRect.y + targetRect.height * 0.5;
                if (legendMiddle < targetMiddle) {
                  leader.dataset.direction = "top";
                  leader.style.top = legendMiddle - originRect.y + "px";
                  leader.style.height = targetMiddle - legendMiddle + "px";
                } else {
                  leader.dataset.direction = "bottom";
                  leader.style.top = targetMiddle - originRect.y + "px";
                  leader.style.height = legendMiddle - targetMiddle + "px";
                }
              }
            }
          });
          tr.addEventListener("mouseleave", () => {
            opt.fadeoutNodes.forEach((node) => {
              node.style[fadeProp] = "";
            });
            leader.classList.remove("-show");
          });
        });
    });
  }
}

customElements.define("togostanza--legend", Legend);

export { Legend as L };
//# sourceMappingURL=Legend-08cf2f79.js.map
