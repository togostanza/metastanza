import { LitElement, html, css, nothing } from "lit";

import loaderPNG from "togostanza-utils/spinner.png";

import {
  applyConstructor,
  cachedAxios,
  debounce,
  getByPath,
} from "../utils.js";

import "./OntologyBrowserOntologyView";
import "./OntologyBrowserError";
import "./OntologyBrowserPath.js";

export class OntologyBrowser extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .spinner {
        z-index: 10;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      ontology-error {
        z-index: 11;
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
  }

  static get properties() {
    return {
      diseaseId: {
        type: String,
        reflect: true,
      },
      data: { state: true },
      loading: { type: Boolean, state: true },
      error: { type: Object, state: true },
      clickedRole: {
        type: String,
        status: true,
      },
      apiEndPoint: {
        type: String,
        state: true,
      },
      showKeys: {
        type: Array,
        state: true,
      },
      pathArray: {
        type: Array,
        state: true,
      },
      activeNode: {
        type: Object,
        state: true,
      },
    };
  }

  constructor(element) {
    super();
    this._timer = null;

    element.append(this);

    this.data = [];
    this.loading = false;
    this.clickedRole = undefined;
    this.diseaseId = undefined;
    this.apiEndpoint = "";
    this.error = { message: "", isError: false };
    this.showKeys = ["id", "label"];
    this.pathArray = [];
    this.activeNode = {};

    this.historyClicked = false;

    this.API = new cachedAxios();
  }

  updateParams(params) {
    try {
      this._validateParams(params);

      applyConstructor.call(this, params);

      this.showKeys = this.nodeDetailsShowKeys
        ? this.nodeDetailsShowKeys.split(",").map((key) => key.trim())
        : [];

      this.error = { message: "", isError: false };

      this.diseaseId = this.initialId;
    } catch (error) {
      this.error = { message: error.message, isError: true };
    }
  }

  _validateParams(params) {
    for (const key in params) {
      if (key === "api-endpoint") {
        if (!params[key].includes("<>")) {
          throw new Error("Placeholder '<>' should be present in the API URL");
        }
      }
    }
  }

  _loadData() {
    this.API.get(this._getURL(this.diseaseId))
      .then(({ data }) => {
        this.data = {
          role: this.clickedRole,
          ...this._getDataObject(data),
        };

        this.activeNode = {
          id: this.data.details.id,
          label: this.data.details.label,
        };

        if (!this.historyClicked) {
          this.pathArray = [...this.pathArray, this.activeNode];
        }
      })
      .catch((e) => {
        console.error(e);
        this.error = { message: e.message, isError: true };
      })
      .finally(() => {
        this._loadingEnded();
      });
  }

  willUpdate(changed) {
    console.log("this.historyClicked", this.historyClicked);
    if (
      (changed.has("diseaseId") || changed.has("apiEndpoint")) &&
      this.diseaseId
    ) {
      this.error = { message: "", isError: false };
      this._loadData();
    }
    if (changed.has("pathArray")) {
      if (this.pathArray.length > 10) {
        this.pathArray = this.pathArray.slice(1);
      }
    }
  }

  firstUpdated() {
    this._loadingStarted();
    this.diseaseId = this.initialId;
  }
  _handleHistoryClick({ detail: { id } }) {
    this.historyClicked = true;
    this.diseaseId = id;
  }

  _getDataObject(incomingData) {
    //validate
    const nodeIdVal = getByPath(incomingData, this.nodeIdPath);
    if (!nodeIdVal) {
      throw new Error("Node id path is not valid");
    }
    const nodeLabelVal = getByPath(incomingData, this.nodeLabelPath);
    if (!nodeLabelVal) {
      throw new Error("Node label path is not valid");
    }
    const childrenArr = getByPath(incomingData, this.nodeRelationsChildrenPath);

    if (childrenArr instanceof Array) {
      if (childrenArr.length > 0) {
        if (!childrenArr.some((item) => item[this.nodeRelationsIdKey])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!childrenArr.some((item) => item[this.nodeRelationsLabelKey])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node children is not valid ");
    }

    const parentsArr = getByPath(incomingData, this.nodeRelationsParentsPath);

    if (parentsArr instanceof Array) {
      if (parentsArr.length > 0) {
        if (!parentsArr.some((item) => item[this.nodeRelationsIdKey])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!parentsArr.some((item) => item[this.nodeRelationsLabelKey])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node parents is not valid ");
    }

    return {
      details: {
        ...getByPath(incomingData, this.nodeDetailsPath),
        id: nodeIdVal,
        label: nodeLabelVal,
        showDetailsKeys: this.showKeys,
      },
      relations: {
        children: childrenArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
        })),
        parents: parentsArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
        })),
      },
    };
  }

  _getURL(id) {
    return this.apiEndpoint.replace("<>", id);
  }

  _changeDiseaseEventHadnler(e) {
    e.stopPropagation();
    this.historyClicked = false;
    this.diseaseId = e.detail.id;
    this.clickedRole = e.detail.role;
    this._loadingStarted();

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent("ontology-node-changed", {
          // here we can pass any data to the event through this.data
          detail: {
            id: e.detail.id,
            label: e.detail.label,
            ...this.data,
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

  render() {
    return html`
      <div class="container">
        ${this.showHistory
          ? html`<ontology-browser-path
              @history-clicked="${this._handleHistoryClick}"
              .path=${this.pathArray}
            >
            </ontology-browser-path>`
          : nothing}
        ${this.loading
          ? html`<div class="spinner">
              <img src="${loaderPNG}"></img>
            </div>`
          : nothing}
        ${this.error.isError
          ? html`
              <ontology-error message="${this.error.message}"> </ontology-error>
            `
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
