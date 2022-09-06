import { LitElement, html, css, nothing } from "lit";

//import "./OntologyBrowserOntologyView.js";
// import "./OntologyBrowserTextSearch.js";

import { applyConstructor, cachedAxios, debounce } from "../utils.js";

import "./OntologyBrowserOntologyView";

export class OntologyBrowser extends LitElement {
  static get properties() {
    return {
      diseaseId: {
        type: String,
        reflect: true,
      },
      data: { state: true },
      loading: { type: Boolean, state: true },
    };
  }

  static styles = css`
    :host {
      height: 300px;
      width: 100%;
    }
  `;

  constructor(element, params) {
    super();
    this._timer = null;

    element.append(this);

    this.data = [];
    this.diseaseId = "";
    this.loading = false;

    applyConstructor.call(this, params);

    this.API = new cachedAxios(this.apiEndpoint);
  }

  // set ontologyBaseUrl(baseURL) {
  //   this.ontologyAPI = new cachedAxios(baseURL);
  //   this.ontologyViewer = new OntologyBrowserView(this.ontologyAPI);
  //   //this.ontologyBrowser = new OntologyBrowserView(new cachedAxios(baseURL)).API
  // }

  // set textSearchUrl(baseURL) {
  //   this.textSearchAPI = new cachedAxios(baseURL);
  //   this.textSearch = new OntologyBrowserTextSearch("", this.textSearchAPI);
  // }

  firstUpdated() {
    this._loadingStarted();
    this.API.get(`?node=${this.initialId}`).then(({ data }) => {
      this.diseaseId = this.initialId;
      this._loadingEnded();
      this.data = { ...data, role: undefined };
    });
  }

  _changeDiseaseEventHadnler(e) {
    e.stopPropagation();
    this.diseaseId = e.detail.id;
    this._loadingStarted();

    this.API.get(`?node=${this.diseaseId}`).then(({ data }) => {
      this._loadingEnded();
      this.data = { ...data, role: e.detail.role };

      //dispatch event to upper levels
      this.dispatchEvent(
        new CustomEvent("disease-selected", {
          detail: {
            id: e.detail.id,
            label: e.detail.label,
            cui: e.detail.cui,
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  _loadingStarted() {
    this._timer = setTimeout(() => {
      this.loading = true;
    }, 200);
  }

  _loadingEnded() {
    this.loading = false;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  // _keyup(e) {
  //   if (e.target && e.target.nodeName === "ontology-browser-text-search") {
  //     this.value = e.target.value;
  //   }
  // }

  // @new-suggestion-selected=${this._changeDiseaseEventHadnler}

  render() {
    return html`
      <!-- <ontology-browser-text-search
        @input="${debounce(this._keyup, 300)}"
      ></ontology-browser-text-search> -->
      <div class="container">
        ${this.loading
          ? html`<div class="loading">
              <span></span>
            </div>`
          : nothing}

        <ontology-browser-view
          .data=${this.data}
          @column-click="${this._changeDiseaseEventHadnler}"
        ></ontology-browser-view>
      </div>
    `;
  }

  // // do not create shadow dom
  // createRenderRoot() {
  //   return this;
  // }
}

customElements.define("ontology-browser", OntologyBrowser);
