import { LitElement, html, css } from "lit";

class OntologyError extends LitElement {
  static styles = css`
    .error-wrapper {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(5px);
      z-index: 11;
    }
    .error-container {
      width: max(50%, 15rem);
      min-width: 5rem;
      background-color: white;
      border-radius: 15px;
      padding: 0 1rem;
    }
  `;

  static get properties() {
    return {
      message: {
        type: String,
        attribute: "message",
      },
    };
  }

  constructor() {
    super();
    this.message = "";
  }

  render() {
    return html`
      <div class="error-wrapper">
        <div class="error-container" part="error-box">
          <h3>Error</h3>
          <p>${this.message}</p>
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-error", OntologyError);
