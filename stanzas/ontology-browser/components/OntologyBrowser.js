import { LitElement, html, css, nothing } from "lit";

import loaderPNG from "togostanza-utils/spinner.png";

import {
  applyConstructor,
  cachedAxios,
  debounce,
  getByPath,
} from "../utils.js";

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
      clickedRole: {
        type: String,
        status: true,
      },
    };
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }

    .container {
      height: 100%;
    }

    .spinner {
      z-index: 10;
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .spinner > img {
      display: block;
      width: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `;

  constructor(element, params) {
    super();
    this._timer = null;

    element.append(this);

    this.data = [];

    this.API = new cachedAxios(this.apiEndpoint);
    this.updateParams(params);
  }

  updateParams(params) {
    this.loading = false;
    this.clickedRole = undefined;
    this.diseaseId = this.initialId;

    applyConstructor.call(this, params);
  }

  willUpdate(changed) {
    if (changed.has("diseaseId") && this.diseaseId) {
      this.API.get(this._getURL(this.diseaseId))
        .then(({ data }) => {
          this._loadingEnded();

          this.data = {
            role: this.clickedRole,
            ...this._getDataObject(data),
          };
        })
        .catch((e) => {
          console.error("API error");
        });
    }
  }

  firstUpdated() {
    this._loadingStarted();
    this.diseaseId = this.initialId;
  }

  _getDataObject(incomingData) {
    return {
      details: {
        ...getByPath(incomingData, this.nodeDetails_path),
        id: getByPath(incomingData, this.nodeId_path),
        label: getByPath(incomingData, this.nodeLabel_path),
      },
      relations: {
        children: getByPath(incomingData, this.nodeRelationsChildren_path).map(
          (item) => ({
            ...item,
            id: item[this.nodeRelationsId_key],
            label: item[this.nodeRelationsLabel_key],
          })
        ),
        parents: getByPath(incomingData, this.nodeRelationsParents_path).map(
          (item) => ({
            ...item,
            id: item[this.nodeRelationsId_key],
            label: item[this.nodeRelationsLabel_key],
          })
        ),
      },
    };
  }

  _getURL(id) {
    return this.apiEndpoint.replace("<>", id);
  }

  _changeDiseaseEventHadnler(e) {
    e.stopPropagation();
    this.diseaseId = e.detail.id;
    this.clickedRole = e.detail.role;
    this._loadingStarted();

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent("disease-selected", {
          // here we can pass any data to the event through this.data
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
    // });
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

  render() {
    return html`
      <!-- <ontology-browser-text-search
        @input="${debounce(this._keyup, 300)}"
      ></ontology-browser-text-search> -->
      <div class="container">
        ${this.loading
          ? html`<div class="spinner">
              <img src="${loaderPNG}"></img>
            </div>`
          : nothing}

        <ontology-browser-view
          .data=${this.data}
          @column-click="${this._changeDiseaseEventHadnler}"
        ></ontology-browser-view>
      </div>
    `;
  }
}

customElements.define("ontology-browser", OntologyBrowser);
