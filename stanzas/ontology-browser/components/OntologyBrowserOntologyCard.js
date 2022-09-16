import { LitElement, html, css, nothing } from "lit";
import { ref, createRef } from "lit/directives/ref.js";

export class OntologyCard extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      position: relative;
      --default-bg-color: white;
    }

    .-hero-right:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-hero-left:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-hero-left:after {
      position: absolute;
      content: "";
      width: 0px;
      height: 0px;
      border: 8px solid transparent;
      border-left: 8px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      right: 0;
      transform: translate(50%, -50%) scaleY(0.5);
      box-sizing: border-box;
      z-index: 9;
    }

    .-children-first:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% - min(50%, 15px) + 5px);
      border-left: 1px solid var(--togostanza-node-border-color);
      bottom: -6px;
      box-sizing: border-box;
    }

    .-children-first:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-last:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(min(50%, 15px) + 6px);
      border-left: 1px solid var(--togostanza-node-border-color);
      top: -6px;
      box-sizing: border-box;
    }

    .-children-last:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-top:  1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-mid:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% + 14px);
      border-left: 1px solid var(--togostanza-node-border-color);
      top: -6px;
      box-sizing: border-box;
    }

    .-children-mid:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-first:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% - min(50%, 15px) + 5px);
      border-right: 1px solid var(--togostanza-node-border-color);
      bottom: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-first:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-last:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(min(50%, 15px) + 6px);
      border-right: 1px solid var(--togostanza-node-border-color);
      top: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-last:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-top: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-mid:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 1px;
      height: calc(100% + 14px);
      border-right: 1px solid var(--togostanza-node-border-color);
      top: -6px;
      right: 0;
      box-sizing: border-box;
    }

    .-parents-mid:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-parents-single:after {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .-children-single:before {
      position: absolute;
      z-index: 9;
      content: "";
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      box-sizing: border-box;
    }

    .ontology-card {
      padding: 10px;
      font-family: var(--togostanza-font-family);
      border: 1px solid var(--togostanza-node-border-color);
      border-radius: 8px;
      background-color: var(--togostanza-node-bg-color);
      cursor: pointer;
      position: relative;
      width: min(85%, 20rem);
      max-width: 30rem;
      box-sizing: border-box;
      overflow: hidden;
    }

    .ontology-card:hover {
      filter: brightness(0.98)
    }
    
    .children-arrow {
      overflow: visible;
    }

    .children-arrow:before {
      position: absolute;
      content: "";
      width: 0px;
      height: 0px;
      border: 8px solid transparent;
      border-left: 8px solid var(--togostanza-node-border-color);
      top: min(50%, 15px);
      left: 0;
      transform: translate(-50%, -50%) scaleY(0.5);
      box-sizing: border-box;
      z-index: 9;
    }

    h3 {
      display: inline;
      margin: 0;
      color: var(--togostanza-label-font-color);
    }

    .card-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    .connector {
      position: relative;
      flex-grow: 1;
    }

    .selected {
      background-color: var(--togostanza-node-bg-color-selected);
      border-color: var(--togostanza-node-border-color-selected);
    }

    .hidden {
      visibility: hidden;
    }

    .table-container {
      overflow-y: auto;
    }

    .hero-list {
      padding-inline-start: 1rem;
    }

    .hero-list li {
      font-size: 0.6rem;
      margin-left: 0.5rem;
    }

    table {
      width: 100%
      max-width: 10rem;
      table-layout: fixed;
    }

    table td.key {
      vertical-align: top;
      font-style: italic;
      font-size: 0.5rem;
    }

    table td.data {
      overflow: auto;
      display: inline-block;
    }
  `;
  }

  static get properties() {
    return {
      data: { type: Object, state: true },
      hidden: { type: Boolean, attribute: true },
      id: { type: String, attribute: true, reflect: true },
      mode: {
        type: String,
        state: true,
      },
      order: {
        type: String,
        state: true,
      },
      prevRect: {
        type: Object,
        state: true,
      },
      content: {
        type: Object,
        state: true,
      },
    };
  }

  shouldUpdate() {
    if (this.data.id === "dummy") {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
    return true;
  }

  constructor() {
    super();
    this.data = {};
    this.hidden = false;
    this.mode = "";
    this.order = "";
    this.prevRect = { x: 0, y: 0, width: 0, height: 0 };
    this._skipKeys = ["label", "children", "parents", "leaf", "root"];
    this.cardRef = createRef();
    this._leftCoinnector = createRef;
    this.leftConnectorClassName = "";
    this.rightConnectorClassName = "";
    this.content = {};
  }

  willUpdate(prevParams) {
    if (this.mode === "hero") {
      // do not display connection liner to right of hero node without children and to left of hero node without parents
      if (this.data.leaf) {
        this.leftConnectorClassName = "-hero-left";
      } else if (this.data.root) {
        this.rightConnectorClassName = "-hero-right";
      } else {
        this.leftConnectorClassName = `-hero-left`;
        this.rightConnectorClassName = `-hero-right`;
      }
    } else if (this.mode === "children") {
      this.leftConnectorClassName = `-${this.mode}-${this.order}`;
    } else if (this.mode === "parents") {
      this.rightConnectorClassName = `-${this.mode}-${this.order}`;
    }

    this.prevMode = prevParams.get("mode");
    if (this.data.id === "dummy") {
      this.leftConnectorClassName = "";
      this.rightConnectorClassName = "";
    }
  }

  updated() {
    const animProps = {
      duration: 500,
      easing: "ease-out",
    };
    if (this.mode === "hero") {
      const animation = [
        {
          height: `${this.prevRect?.height || 0}px`,
          overflow: "hidden",
        },
        {
          height: `${
            this.cardRef?.value.getBoundingClientRect().height || 0
          }px`,
        },
      ];

      animation[0].backgroundColor = this.defaultBgColor;
      animation[1].backgroundColor = this.selectedBgColor;

      this.cardRef.value.animate(animation, animProps);
    }
  }

  firstUpdated() {
    this.defaultBgColor = getComputedStyle(this.cardRef.value).getPropertyValue(
      "--default-bg-color"
    );
    this.selectedBgColor = getComputedStyle(
      this.cardRef.value
    ).getPropertyValue("--selected-bg-color");
  }

  render() {
    return html`
      <div class="card-container">
        <div class="connector ${this.leftConnectorClassName}"></div>
        <div
          ${ref(this.cardRef)}
          class="ontology-card ${this.hidden ? "hidden" : ""} ${this.mode ===
          "hero"
            ? "selected"
            : ""} ${this.mode === "children" ? "children-arrow" : ""}"
        >
          <h3>${this.data.label || "..."}</h3>
          ${this.mode === "hero"
            ? html`
                <div class="table-container">
                  <table>
                    <tbody>
                      ${this.data.showDetailsKeys?.map((key) => {
                        return html`
                          <tr>
                            <td class="key">${key}</td>
                            <td class="data">
                              ${this.data[key] instanceof Array
                                ? html`<ul class="hero-list">
                                    ${this.data[key].map(
                                      (item) => html`<li>${item}</li> `
                                    )}
                                  </ul>`
                                : this.data[key]}
                            </td>
                          </tr>
                        `;
                      })}
                    </tbody>
                  </table>
                </div>
              `
            : nothing}
        </div>
        <div class="connector ${this.rightConnectorClassName}"></div>
      </div>
    `;
  }
}

customElements.define("ontology-card", OntologyCard);
