import { s, $ } from './stanza-element-f1811bb2.js';

class ToolTip extends s {
  constructor() {
    super();
  }

  render() {
    return $`
      <style>
        .origin {
          position: absolute;
          top: 0;
          left: 0;
        }
        .tooltip {
          padding: 2px 12px;
          position: absolute;
          z-index: 10000;
          background-color: white;
          filter: drop-shadow(0 0.5px 1px black);
          font-size: 12px;
          line-height: 1.5;
          transform: translate(-50%, -100%);
          border-radius: 10px;
          opacity: 0;
          height: 0;
          visibility: hidden;
          transition: height 0ms 250ms linear, opacity 200ms 0ms linear;
        }
        .tooltip::before {
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 5px 0 4px;
          border-color: white transparent transparent transparent;
          display: block;
          position: absolute;
          left: 50%;
          bottom: -5px;
          transform: translateX(-50%);
        }
        .tooltip.-show {
          opacity: 1;
          visibility: visible;
          height: 1.5em;
          transition: height 0ms 0ms linear, opacity 200ms 0ms linear,
            left 200ms, top 200ms;
        }
      </style>
      <div class="origin"></div>
      <div class="tooltip"></div>
    `;
  }

  // Get tooltip element only after it was mounted
  firstUpdated() {
    this.tooltip = this.shadowRoot.querySelector(".tooltip");
  }

  setup(nodes) {
    nodes.forEach((node) => {
      node.addEventListener("mouseover", () => {
        const originRect = this.shadowRoot
          .querySelector(".origin")
          .getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        if (node.dataset.tooltipHtml === "true") {
          this.tooltip.innerHTML = node.dataset.tooltip;
        } else {
          this.tooltip.textContent = node.dataset.tooltip;
        }
        this.tooltip.style.left =
          rect.x + rect.width * 0.5 - originRect.x + "px";
        this.tooltip.style.top = rect.y - originRect.y - 5 + "px";
        this.tooltip.classList.add("-show");
      });
      node.addEventListener("mouseleave", () => {
        this.tooltip.classList.remove("-show");
      });
    });
  }
}

customElements.define("togostanza--tooltip", ToolTip);

export { ToolTip as T };
//# sourceMappingURL=ToolTip-23bc44c8.js.map
