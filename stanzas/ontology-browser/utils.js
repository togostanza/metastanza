import axios from "axios";
/** Cached axios */
export class cachedAxios {
  /**
   * Create cached axios instance
   * @param {string} baseURL - base URL.
   * @param {number} maxCacheSize - maximum cache entries number. After reaching this treshold, oldest entries will be deleted from cache.
   */
  constructor(baseURL, maxCacheSize = 100) {
    this.axios = axios.create({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    this.maxCacheSize = maxCacheSize;
    this.cache = new Map();
  }

  /**
   *
   * @param {string} url - url part bo be fetched. Fetched url will be  baseURL + url
   * @returns {object} {data} - response data
   */
  get(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }
    return this.axios.get(url).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      this.cache.set(url, { data: res.data });
      if (this.cache.size > this.maxCacheSize) {
        const [first] = this.cache.keys();
        this.cache.delete(first);
      }
      return { data: res.data };
    });
  }
}

export function debounce(func, ms = 1000) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}

export function getByPath(object, path) {
  if (!path) {
    return object;
  }
  const pathArr = path.split(".");
  let res = object[pathArr[0]];
  for (const path of pathArr.slice(1)) {
    if (!res) {
      return undefined;
    }
    res = res[path];
  }
  return res;
}

export function camelize(s) {
  return s.replace(/-./g, (x) => x[1].toUpperCase());
}

export function mapJsonToProps(json) {
  const props = {};
  json.forEach((attr) => {
    props[camelize(attr.name)] = {
      type: getType(attr.type),
      attribute: attr.name,
      reflect: true,
    };
  });
  return props;
}

export function applyConstructor(json) {
  json.forEach((attr) => {
    this[camelize(attr.name)] = attr.value || undefined;
  });
}

function getType(type) {
  switch (type) {
    case "String":
      return String;
    case "Number":
      return Number;
    case "Boolean":
      return Boolean;

    default:
      return String;
  }
}
