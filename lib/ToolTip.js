import { LitElement, html } from "lit-element";

export default class ToolTip extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <style>
        .origin {
          position: absolute;
          top: 0;
          left: 0;
        }
        .tooltip {
          padding: 2px 12px;
          position: absolute;
          transition: all 0.2s;
          z-index: 10000;
          background-color: white;
          filter: drop-shadow(0 0.5px 1px black);
          font-size: 12px;
          line-height: 1.5;
          transform: translate(-50%, -100%);
          border-radius: 10px;
          opacity: 0;
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
        }
      </style>
      <div class="origin"></div>
      <div class="tooltip"></div>
    `;
  }

  setup(nodes) {
    const tooltip = this.shadowRoot.querySelector(".tooltip");
    nodes.forEach((node) => {
      node.addEventListener("mouseover", () => {
        const originRect = this.shadowRoot
          .querySelector(".origin")
          .getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        if (node.dataset.tooltipHtml === "true") {
          tooltip.innerHTML = node.dataset.tooltip;
        } else {
          tooltip.textContent = node.dataset.tooltip;
        }
        tooltip.style.left = rect.x + rect.width * 0.5 - originRect.x + "px";
        tooltip.style.top = rect.y - originRect.y + "px";
        tooltip.classList.add("-show");
      });
      node.addEventListener("mouseleave", () => {
        tooltip.classList.remove("-show");
      });
    });
  }
}

customElements.define("togostanza--tooltip", ToolTip);
