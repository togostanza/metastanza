import { D as z, E as i, F as t, G as e$2, H as b, I as x, a as s$2, J as i$1, y, S as Stanza, d as defineStanzaElement } from './transform-54fb0dda.js';
import { f as appendCustomCss } from './index-29de360d.js';
import { s as spinner } from './spinner-0571803e.js';

var axios$2 = {exports: {}};

var bind$2 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

var bind$1 = bind$2;

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

var utils$h = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};

var utils$g = utils$h;

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL$2 = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils$g.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils$g.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils$g.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils$g.forEach(val, function parseValue(v) {
        if (utils$g.isDate(v)) {
          v = v.toISOString();
        } else if (utils$g.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

var utils$f = utils$h;

function InterceptorManager$1() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager$1.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager$1.prototype.forEach = function forEach(fn) {
  utils$f.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager$1;

var utils$e = utils$h;

var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$e.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

var utils$d = utils$h;

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError$5(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils$d.inherits(AxiosError$5, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError$5.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError$5, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError$5.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils$d.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError$5.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

var AxiosError_1 = AxiosError$5;

var transitional = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var utils$c = utils$h;

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData$1(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils$c.isDate(value)) {
      return value.toISOString();
    }

    if (utils$c.isArrayBuffer(value) || utils$c.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils$c.isPlainObject(data) || utils$c.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils$c.forEach(data, function each(value, key) {
        if (utils$c.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils$c.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils$c.endsWith(key, '[]') && (arr = utils$c.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils$c.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

var toFormData_1 = toFormData$1;

var AxiosError$4 = AxiosError_1;

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle$1 = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$4(
      'Request failed with status code ' + response.status,
      [AxiosError$4.ERR_BAD_REQUEST, AxiosError$4.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};

var utils$b = utils$h;

var cookies$1 = (
  utils$b.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils$b.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils$b.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils$b.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL$1 = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

var isAbsoluteURL = isAbsoluteURL$1;
var combineURLs = combineURLs$1;

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
var buildFullPath$2 = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

var utils$a = utils$h;

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders$1 = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils$a.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils$a.trim(line.substr(0, i)).toLowerCase();
    val = utils$a.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var utils$9 = utils$h;

var isURLSameOrigin$1 = (
  utils$9.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils$9.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

var AxiosError$3 = AxiosError_1;
var utils$8 = utils$h;

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError$3(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError$3.call(this, message == null ? 'canceled' : message, AxiosError$3.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils$8.inherits(CanceledError$3, AxiosError$3, {
  __CANCEL__: true
});

var CanceledError_1 = CanceledError$3;

var parseProtocol$1 = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};

var utils$7 = utils$h;
var settle = settle$1;
var cookies = cookies$1;
var buildURL$1 = buildURL$2;
var buildFullPath$1 = buildFullPath$2;
var parseHeaders = parseHeaders$1;
var isURLSameOrigin = isURLSameOrigin$1;
var transitionalDefaults$1 = transitional;
var AxiosError$2 = AxiosError_1;
var CanceledError$2 = CanceledError_1;
var parseProtocol = parseProtocol$1;

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils$7.isFormData(requestData) && utils$7.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath$1(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError$2('Request aborted', AxiosError$2.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError$2('Network Error', AxiosError$2.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults$1;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError$2(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError$2.ETIMEDOUT : AxiosError$2.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils$7.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils$7.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError$2() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError$2('Unsupported protocol ' + protocol + ':', AxiosError$2.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};

// eslint-disable-next-line strict
var _null = null;

var utils$6 = utils$h;
var normalizeHeaderName = normalizeHeaderName$1;
var AxiosError$1 = AxiosError_1;
var transitionalDefaults = transitional;
var toFormData = toFormData_1;

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils$6.isUndefined(headers) && utils$6.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = xhr;
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils$6.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$6.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults$3 = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils$6.isFormData(data) ||
      utils$6.isArrayBuffer(data) ||
      utils$6.isBuffer(data) ||
      utils$6.isStream(data) ||
      utils$6.isFile(data) ||
      utils$6.isBlob(data)
    ) {
      return data;
    }
    if (utils$6.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$6.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils$6.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils$6.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults$3.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils$6.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _null
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils$6.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults$3.headers[method] = {};
});

utils$6.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults$3.headers[method] = utils$6.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults$3;

var utils$5 = utils$h;
var defaults$2 = defaults_1;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData$1 = function transformData(data, headers, fns) {
  var context = this || defaults$2;
  /*eslint no-param-reassign:0*/
  utils$5.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

var isCancel$1 = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var utils$4 = utils$h;
var transformData = transformData$1;
var isCancel = isCancel$1;
var defaults$1 = defaults_1;
var CanceledError$1 = CanceledError_1;

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest$1 = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils$4.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils$4.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults$1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

var utils$3 = utils$h;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig$2 = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils$3.isPlainObject(target) && utils$3.isPlainObject(source)) {
      return utils$3.merge(target, source);
    } else if (utils$3.isPlainObject(source)) {
      return utils$3.merge({}, source);
    } else if (utils$3.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$3.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils$3.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils$3.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils$3.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils$3.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};

var data = {
  "version": "0.27.2"
};

var VERSION = data.version;
var AxiosError = AxiosError_1;

var validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator$1 = {
  assertOptions: assertOptions,
  validators: validators$1
};

var utils$2 = utils$h;
var buildURL = buildURL$2;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var buildFullPath = buildFullPath$2;
var validator = validator$1;

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios$1.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig$1(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios$1.prototype.getUri = function getUri(config) {
  config = mergeConfig$1(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils$2.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils$2.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios$1.prototype[method] = generateHTTPMethod();

  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios_1 = Axios$1;

var CanceledError = CanceledError_1;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

var utils$1 = utils$h;

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
var isAxiosError = function isAxiosError(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
};

var utils = utils$h;
var bind = bind$2;
var Axios = Axios_1;
var mergeConfig = mergeConfig$2;
var defaults = defaults_1;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios$1 = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios$1.Axios = Axios;

// Expose Cancel & CancelToken
axios$1.CanceledError = CanceledError_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel$1;
axios$1.VERSION = data.version;
axios$1.toFormData = toFormData_1;

// Expose AxiosError class
axios$1.AxiosError = AxiosError_1;

// alias for CanceledError for backward compatibility
axios$1.Cancel = axios$1.CanceledError;

// Expose all/spread
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;

// Expose isAxiosError
axios$1.isAxiosError = isAxiosError;

axios$2.exports = axios$1;

// Allow use of default import syntax in TypeScript
axios$2.exports.default = axios$1;

var axios = axios$2.exports;

/** Cached axios */
class cachedAxios {
  /**
   * Create cached axios instance
   * @param {string} baseURL - base URL.
   * @param {number} maxCacheSize - maximum cache entries number. After reaching this treshold, oldest entries will be deleted from cache.
   */
  constructor(maxCacheSize = 100) {
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

      if (Object.keys(res.data).length === 0) {
        throw new Error("Empty response from API");
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

function debounce(func, ms = 1000) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}

function getByPath(object, path) {
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

function camelize(s) {
  return s.replace(/-./g, (x) => x[1].toUpperCase());
}

function applyConstructor(params) {
  for (const param in params) {
    this[camelize(param)] = params[param] || undefined;
  }
}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const {H:l$1}=z,e$1=o=>void 0===o.strings,c$2=()=>document.createComment(""),r$1=(o,t,i)=>{var n;const d=o._$AA.parentNode,v=void 0===t?o._$AB:t._$AA;if(void 0===i){const t=d.insertBefore(c$2(),v),n=d.insertBefore(c$2(),v);i=new l$1(t,n,o,o.options);}else {const l=i._$AB.nextSibling,t=i._$AM,e=t!==o;if(e){let l;null===(n=i._$AQ)||void 0===n||n.call(i,o),i._$AM=o,void 0!==i._$AP&&(l=o._$AU)!==t._$AU&&i._$AP(l);}if(l!==v||e){let o=i._$AA;for(;o!==l;){const l=o.nextSibling;d.insertBefore(o,v),o=l;}}}return i},u$1=(o,l,t=o)=>(o._$AI(l,t),o),f={},s$1=(o,l=f)=>o._$AH=l,m=o=>o._$AH,p=o=>{var l;null===(l=o._$AP)||void 0===l||l.call(o,!1,!0);let t=o._$AA;const i=o._$AB.nextSibling;for(;t!==i;){const o=t.nextSibling;t.remove(),t=o;}};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=(i,t)=>{var e,o;const r=i._$AN;if(void 0===r)return !1;for(const i of r)null===(o=(e=i)._$AO)||void 0===o||o.call(e,t,!1),s(i,t);return !0},o$1=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===(null==e?void 0:e.size))},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),l(t);}};function n$1(i){void 0!==this._$AN?(o$1(this),this._$AM=i,r(this)):this._$AM=i;}function h$1(i,t=!1,e=0){const r=this._$AH,n=this._$AN;if(void 0!==n&&0!==n.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s(r[i],!1),o$1(r[i]);else null!=r&&(s(r,!1),o$1(r));else s(this,i);}const l=i=>{var t$1,s,o,r;i.type==t.CHILD&&(null!==(t$1=(o=i)._$AP)&&void 0!==t$1||(o._$AP=h$1),null!==(s=(r=i)._$AQ)&&void 0!==s||(r._$AQ=n$1));};class c$1 extends i{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU;}_$AO(i,t=!0){var e,r;i!==this.isConnected&&(this.isConnected=i,i?null===(e=this.reconnected)||void 0===e||e.call(this):null===(r=this.disconnected)||void 0===r||r.call(this)),t&&(s(this,i),o$1(this));}setValue(t){if(e$1(this._$Ct))this._$Ct._$AI(t,this);else {const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0);}}disconnected(){}reconnected(){}}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=()=>new o;class o{}const h=new WeakMap,n=e$2(class extends c$1{render(t){return b}update(t,[s]){var e;const o=s!==this.Y;return o&&void 0!==this.Y&&this.rt(void 0),(o||this.lt!==this.dt)&&(this.Y=s,this.ct=null===(e=t.options)||void 0===e?void 0:e.host,this.rt(this.dt=t.element)),b}rt(i){var t;if("function"==typeof this.Y){const s=null!==(t=this.ct)&&void 0!==t?t:globalThis;let e=h.get(s);void 0===e&&(e=new WeakMap,h.set(s,e)),void 0!==e.get(this.Y)&&this.Y.call(this.ct,void 0),e.set(this.Y,i),void 0!==i&&this.Y.call(this.ct,i);}else this.Y.value=i;}get lt(){var i,t,s;return "function"==typeof this.Y?null===(t=h.get(null!==(i=this.ct)&&void 0!==i?i:globalThis))||void 0===t?void 0:t.get(this.Y):null===(s=this.Y)||void 0===s?void 0:s.value}disconnected(){this.lt===this.dt&&this.rt(void 0);}reconnected(){this.rt(this.dt);}});

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u=(e,s,t)=>{const r=new Map;for(let l=s;l<=t;l++)r.set(e[l],l);return r},c=e$2(class extends i{constructor(e){if(super(e),e.type!==t.CHILD)throw Error("repeat() can only be used in text expressions")}ht(e,s,t){let r;void 0===t?t=s:void 0!==s&&(r=s);const l=[],o=[];let i=0;for(const s of e)l[i]=r?r(s,i):i,o[i]=t(s,i),i++;return {values:o,keys:l}}render(e,s,t){return this.ht(e,s,t).values}update(s,[t,r,c]){var d;const a=m(s),{values:p$1,keys:v}=this.ht(t,r,c);if(!Array.isArray(a))return this.ut=v,p$1;const h=null!==(d=this.ut)&&void 0!==d?d:this.ut=[],m$1=[];let y,x$1,j=0,k=a.length-1,w=0,A=p$1.length-1;for(;j<=k&&w<=A;)if(null===a[j])j++;else if(null===a[k])k--;else if(h[j]===v[w])m$1[w]=u$1(a[j],p$1[w]),j++,w++;else if(h[k]===v[A])m$1[A]=u$1(a[k],p$1[A]),k--,A--;else if(h[j]===v[A])m$1[A]=u$1(a[j],p$1[A]),r$1(s,m$1[A+1],a[j]),j++,A--;else if(h[k]===v[w])m$1[w]=u$1(a[k],p$1[w]),r$1(s,a[j],a[k]),k--,w++;else if(void 0===y&&(y=u(v,w,A),x$1=u(h,j,k)),y.has(h[j]))if(y.has(h[k])){const e=x$1.get(v[w]),t=void 0!==e?a[e]:null;if(null===t){const e=r$1(s,a[j]);u$1(e,p$1[w]),m$1[w]=e;}else m$1[w]=u$1(t,p$1[w]),r$1(s,a[j],t),a[e]=null;w++;}else p(a[k]),k--;else p(a[j]),j++;for(;w<=A;){const e=r$1(s,m$1[A+1]);u$1(e,p$1[w]),m$1[w++]=e;}for(;j<=k;){const e=a[j++];null!==e&&p(e);}return this.ut=v,s$1(s,m$1),x}});

const disconnectedRects = new Map();
class Flip extends c$1 {
  constructor() {
    super();

    this.parent = undefined;
    this.element = undefined;
    this.boundingRect = undefined;
    this.id = undefined;
    this.role = "";
    this.parentRect = null;
  }

  render() {
    return b;
  }

  update(
    part,
    [
      {
        id = undefined,
        role = "",
        options = {},
        heroId = undefined,
        scrolledHeroRect = null,
      } = {},
    ]
  ) {
    this.id = id;
    this.role = role;
    this.heroId = heroId;
    this.scrolledHeroRect = scrolledHeroRect;

    if (this.role === "hero" && this.id !== this.heroId) {
      // then remove the element from the DOM with animation
      requestAnimationFrame(() => {
        this.boundingRect = { y: 0, x: 0, width: 0, height: 0 };
        this.remove();
      });
    }

    if (this.role !== "hero" && !disconnectedRects.has(this.id)) {
      disconnectedRects.set(this.id, { y: 0, x: 0, width: 0, height: 0 });
    }

    this.options = {
      ...this.options,
      ...options,
    };

    if (this.element !== part.element) {
      this.element = part.element;

      this.parent =
        this.element.parentElement ||
        this.element.getRootNode().querySelector(".column");
    }
    // memorize boundingRect before element updates
    if (this.boundingRect) {
      this.boundingRect = this.element.getBoundingClientRect();
    }
    // the timing on which LitElement batches its updates, to capture the "last" frame of our animation.
    Promise.resolve().then(() => this.prepareToFlip());
    return x;
  }

  prepareToFlip() {
    if (!this.boundingRect) {
      this.boundingRect = disconnectedRects.has(this.id)
        ? disconnectedRects.get(this.id)
        : this.element.getBoundingClientRect();
      disconnectedRects.delete(this.id);
    }

    this.flip();
  }

  flip(listener, removing) {
    let previous = this.boundingRect;

    if (this.id === this.heroId) {
      previous = this.scrolledHeroRect;

      this.boundingRect = this.element.parentElement.getBoundingClientRect();
    } else {
      this.boundingRect = this.element.getBoundingClientRect();
    }

    const deltaY = (previous?.y || 0) - (this.boundingRect?.y || 0);

    if (!deltaY && !removing) {
      return;
    }

    const filteredListener = (event) => {
      if (event.target === this.element) {
        listener(event);
        this.element.removeEventListener("transitionend", filteredListener);
      }
    };

    this.element.addEventListener("transitionend", filteredListener);

    this.element.animate(
      [
        {
          transform: `translate(0, ${deltaY}px)`,
          position: this.id === this.heroId ? "absolute" : "relative",
          width: `${this.boundingRect.width}px`,
        },
        {
          transform: `translate(0,0)`,
          position: this.id === this.heroId ? "absolute" : "relative",
          width: `${this.boundingRect.width}px`,
        },
      ],
      this.options
    );
    // }
  }

  remove() {
    this.element.animate(
      [
        {
          opacity: 1,

          transform: `translateY(0)`,
        },
        {
          opacity: 0,

          transform: `translateY(${
            this.element.getBoundingClientRect().y + 200
          }px)`,
        },
      ],
      this.options
    ).onfinish = () => {
      if (disconnectedRects.has(this.id)) {
        disconnectedRects.delete(this.id);
      }
      this.element.remove();
    };
  }

  disconnected() {
    this.boundingRect = this.element.getBoundingClientRect();
    if (typeof this.id !== "undefined") {
      disconnectedRects.set(this.id, this.boundingRect);
      requestAnimationFrame(() => {
        if (disconnectedRects.has(this.id)) {
          this.remove();
        }
      });
    }
  }
}

const flip = e$2(Flip);

class OntologyCard extends s$2 {
  static get styles() {
    return i$1`
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
      padding: 6px;
      font-family: var(--togostanza-font-family);
      border: 1px solid var(--togostanza-node-border-color);
      border-radius: 8px;
      background-color: var(--togostanza-node-bg-color);
      cursor: pointer;
      position: relative;
      width: min(90%, 20rem);
      max-width: 30rem;
      box-sizing: border-box;
    }

    .ontology-card:hover {
      filter: brightness(0.98)
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
      padding-left: 10px;
      padding-right: 10px;
      max-height: 100%;
    }

    .hidden {
      visibility: hidden;
    }

    p.note {
      margin: 0;
      color: #94928d;
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
    this.cardRef = e();
    this._leftCoinnector = e;
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
    return y`
      <div class="card-container">
        <div class="connector ${this.leftConnectorClassName}"></div>
        <div
          ${n(this.cardRef)}
          class="ontology-card ${this.hidden ? "hidden" : ""} ${this.mode ===
          "hero"
            ? "selected"
            : ""} ${this.mode === "children" ? "children-arrow" : ""}"
        >
          <h3>${this.data.label || "..."}</h3>
          ${this.mode === "hero"
            ? y`
                <div class="table-container">
                  <table>
                    <tbody>
                      ${this.data.showDetailsKeys?.map((key) => {
                        return y`
                          <tr>
                            <td class="key">${key}</td>
                            <td class="data">
                              ${this.data[key] instanceof Array
                                ? y`<ul class="hero-list">
                                    ${this.data[key].map(
                                      (item) => y`<li>${item}</li> `
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
            : b}
        </div>
        <div class="connector ${this.rightConnectorClassName}"></div>
      </div>
    `;
  }
}

customElements.define("ontology-card", OntologyCard);

class OntologyBrowserColumn extends s$2 {
  static get styles() {
    return i$1`
      :host {
        flex-grow: 1;
        flex-basis: 0;
        display: block;
        position: relative;
      }

      .column {
        height: 100%;
        flex-direction: column;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
      }

      ontology-card {
        margin-top: 6px;
      }

      ontology-card:last-child {
        margin-bottom: 10px;
      }
    `;
  }

  static get properties() {
    return {
      nodes: { type: Array, state: true },
      role: { type: String, state: true },
      heroId: {
        type: String,
        state: true,
      },
      scrolledHeroRect: { type: Object, state: true },
      animationOptions: { type: Object, state: true },
    };
  }
  constructor() {
    super();
    this.nodes = []; // array of nodes in children / parents, or [details]
    this.heroId = undefined;
    this.role = "";
    this.scrolledHeroRect = null;
    this.animationOptions = {};
    this.idNodeMap = new Map();
  }

  willUpdate(changed) {
    if (changed.has("nodes")) {
      this.nodes.forEach((node) => {
        this.idNodeMap.set(node.id, node);
      });
    }
  }

  _handleClick(e) {
    if (e.target.tagName === "ONTOLOGY-CARD") {
      // only if clicked on the card itself, not on connector div
      if (!e.path[0].classList.contains("connector") && this.role !== "hero") {
        // dispatch event to load new data by id
        this.dispatchEvent(
          new CustomEvent("column-click", {
            detail: {
              role: this.role,
              rect: e.target.getBoundingClientRect(),
              ...this.idNodeMap.get(e.target.id),
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  render() {
    return y`
      <div
        class="column"
        @click="${this.nodes[0].id === "dummy" ? null : this._handleClick}"
      >
        ${this.nodes.length
          ? y`
              ${c(
                this.nodes,
                (node) => node.id,
                (node, index) => {
                  return y`<ontology-card
                    key="${node.id}"
                    id="${node.id}"
                    .data=${node}
                    .mode=${this.role}
                    .prevRect=${this.scrolledHeroRect}
                    .order=${this.nodes.length === 1
                      ? "single"
                      : index === 0
                      ? "first"
                      : index === this.nodes.length - 1
                      ? "last"
                      : "mid"}
                    ${flip({
                      id: node.id,
                      heroId: this.heroId,
                      role: this.role,
                      scrolledHeroRect: this.scrolledHeroRect,
                      options: this.animationOptions,
                    })}
                  />`;
                }
              )}
            `
          : b}
      </div>
    `;
  }
}

customElements.define("ontology-browser-column", OntologyBrowserColumn);

class OntologyBrowserView extends s$2 {
  static get styles() {
    return i$1`
      :host {
        font-size: 10px;
        display: block;
        height: 100%;
      }

      .clip {
        height: 100%;
        overflow: hidden;
        position: relative;
      }

      .flex {
        height: 100%;
        display: flex;
        flex-direction: row;
      }
    `;
  }

  constructor() {
    super();
    this.flexRef = e();
    this.clipRef = e();
    this.nodeRef = e();
    this.movement = "";
    this.flexWidth = 0;
    this.deltaWidth = 0;
    this.nodeWidth = 0;
    this.gap = 0;
    this.animate = null;
    this.scrolledRect = null;

    this.dataColumns = {
      _parents: [],
      parents: [],
      hero: [],
      children: [],
      _children: [],
    };
    this.animationOptions = {
      duration: 500,
      easing: "ease-in-out",
    };

    this._id = "";
    this._columns = ["parents", "hero", "children"];
    this.data = {};
  }

  static get properties() {
    return {
      data: { type: Object, state: true },
      _columns: {
        type: Array,
        state: true,
      },
    };
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("data")) {
      if (changedProperties.get("data")) {
        if (
          this.data.details.id &&
          changedProperties.get("data").id !== this.data.details.id
        ) {
          // parents before update
          this.dataColumns._parents = changedProperties.get("data")
            ?.parents || [{ id: "dummy", label: "dummy" }];
          // children before update
          this.dataColumns._children = changedProperties.get("data")
            ?.children || [{ id: "dummy", label: "dummy" }];

          if (this._columns.length === 4) {
            let movement;
            if (this._columns.includes("_parents")) {
              movement = "left";
            } else if (this._columns.includes("_children")) {
              movement = "right";
            } else {
              movement = "";
            }

            // hero before update
            if (movement === "left") {
              this.dataColumns.hero = this.dataColumns._children;
            } else if (movement === "right") {
              this.dataColumns.hero = this.dataColumns._parents;
            }
          } else {
            this.dataColumns.hero = [
              {
                ...this.data.details,
                leaf:
                  !this.data.relations?.children ||
                  !this.data.relations?.children.length,
                root:
                  !this.data.relations?.parents ||
                  !this.data.relations?.parents.length,
              },
            ];
          }

          //parents after update
          this.dataColumns.parents = this.data.relations?.parents || [];
          //children after update
          this.dataColumns.children = this.data.relations?.children || [];
        }
      }

      this.updateComplete.then(() => {
        if (this.data.role === "children") {
          this.movement = "left";

          this._columns = ["_parents", "parents", "hero", "children"];
        } else if (this.data.role === "parents") {
          this.movement = "right";

          this._columns = ["parents", "hero", "children", "_children"];
        }
      });
    }
    if (changedProperties.has("_columns")) {
      this.nodeWidth =
        this.nodeRef.value?.getBoundingClientRect().width -
          (this.nodeRef.value?.getBoundingClientRect().right -
            this.clipRef.value?.getBoundingClientRect().right) || 0;
      this.gap =
        (this.clipRef.value?.getBoundingClientRect().width -
          this.nodeWidth * 3) /
        2;

      this.flexWidth =
        this._columns.length === 4
          ? this.nodeWidth * this._columns.length +
            (this._columns.length - 1) * this.gap +
            "px"
          : "100%";

      this.deltaWidth = this.nodeWidth + this.gap;
    }
  }

  _handleClick(e) {
    if (e.target?.role === "parents" || e.target?.role === "children") {
      this.scrolledRect = e.detail?.rect || null;
    }
  }

  updated() {
    if (this.movement === "left") {
      this.animate = this.flexRef.value.animate(
        [
          { transform: "translateX(0)" },
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
        ],
        this.animationOptions
      );
    } else if (this.movement === "right") {
      this.animate = this.flexRef.value.animate(
        [
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
          { transform: "translateX(0)" },
        ],
        this.animationOptions
      );
    }

    if (this.animate) {
      this.animate.onfinish = () => {
        this.movement = "";
        this._columns = ["parents", "hero", "children"];
        this.animate = null;
      };
    }
  }

  render() {
    return y`
      <div class="clip" ${n(this.clipRef)}>
        <div
          class="flex"
          @column-click="${this._handleClick}"
          style="width: ${this.flexWidth}"
          ${n(this.flexRef)}
        >
          ${c(
            this._columns,
            (column) => column,
            (column) => {
              return y`
                <ontology-browser-column
                  .role="${column}"
                  .nodes="${this.dataColumns[column].length
                    ? this.dataColumns[column]
                    : [{ id: "dummy", label: "dummy" }]}"
                  ${n(this.nodeRef)}
                  .heroId="${column === "hero"
                    ? this.data.details?.id
                    : undefined}"
                  .scrolledHeroRect="${this.scrolledRect}"
                  .animationOptions="${this.animationOptions}"
                ></ontology-browser-column>
              `;
            }
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-browser-view", OntologyBrowserView);

class OntologyError extends s$2 {
  static get styles() {
    return i$1`
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
        background-color: var(--togostanza-node-bg-color);
        border-radius: 15px;
        padding: 0 1rem;
        border: 1px solid var(--togostanza-node-border-color);
      }

      h3 {
        margin-top: 0.8rem;
      }
    `;
  }

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
    return y`
      <div class="error-wrapper">
        <div class="error-container">
          <h3>Error</h3>
          <p>${this.message}</p>
        </div>
      </div>
    `;
  }
}

customElements.define("ontology-error", OntologyError);

class OntologyBrowser extends s$2 {
  static get styles() {
    return i$1`
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

    this.API = new cachedAxios();
  }

  updateParams(params) {
    try {
      this._validateParams(params);

      applyConstructor.call(this, params);

      this.showKeys = this.nodeDetails_show_keys
        ? this.nodeDetails_show_keys.split(",").map((key) => key.trim())
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
    if (
      (changed.has("diseaseId") || changed.has("apiEndpoint")) &&
      this.diseaseId
    ) {
      this.error = { message: "", isError: false };
      this._loadData();
    }
  }

  firstUpdated() {
    this._loadingStarted();
    this.diseaseId = this.initialId;
  }

  _getDataObject(incomingData) {
    //validate
    const nodeIdVal = getByPath(incomingData, this.nodeId_path);
    if (!nodeIdVal) {
      throw new Error("Node id path is not valid");
    }
    const nodeLabelVal = getByPath(incomingData, this.nodeLabel_path);
    if (!nodeLabelVal) {
      throw new Error("Node label path is not valid");
    }
    const childrenArr = getByPath(
      incomingData,
      this.nodeRelationsChildren_path
    );

    if (childrenArr instanceof Array) {
      if (childrenArr.length > 0) {
        if (!childrenArr.some((item) => item[this.nodeRelationsId_key])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!childrenArr.some((item) => item[this.nodeRelationsLabel_key])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node children is not valid ");
    }

    const parentsArr = getByPath(incomingData, this.nodeRelationsParents_path);

    if (parentsArr instanceof Array) {
      if (parentsArr.length > 0) {
        if (!parentsArr.some((item) => item[this.nodeRelationsId_key])) {
          throw new Error("Path to node children id is not valid ");
        }
        if (!parentsArr.some((item) => item[this.nodeRelationsLabel_key])) {
          throw new Error("Path to node children label is not valid ");
        }
      }
    } else {
      throw new Error("Path to node parents is not valid ");
    }

    return {
      details: {
        ...getByPath(incomingData, this.nodeDetails_path),
        id: nodeIdVal,
        label: nodeLabelVal,
        showDetailsKeys: this.showKeys,
      },
      relations: {
        children: childrenArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsId_key],
          label: item[this.nodeRelationsLabel_key],
        })),
        parents: parentsArr.map((item) => ({
          ...item,
          id: item[this.nodeRelationsId_key],
          label: item[this.nodeRelationsLabel_key],
        })),
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
    return y`
      <!-- <ontology-browser-text-search
        @input="${debounce(this._keyup, 300)}"
      ></ontology-browser-text-search> -->
      <div class="container">
        ${this.loading
          ? y`<div class="spinner">
              <img src="${spinner}"></img>
            </div>`
          : b}
        ${this.error.isError
          ? y`
              <ontology-error message="${this.error.message}"> </ontology-error>
            `
          : b}
        <ontology-browser-view
          .data=${this.data}
          @column-click="${this._changeDiseaseEventHadnler}"
        ></ontology-browser-view>
      </div>
    `;
  }
}

customElements.define("ontology-browser", OntologyBrowser);

class Linechart extends Stanza {
  menu() {
    return [];
  }

  render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const root = this.root.querySelector("main");

    if (!this.ontologyViewer) {
      this.ontologyViewer = new OntologyBrowser(root);
    }

    this.ontologyViewer.updateParams(this.params);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Linechart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "ontology-browser",
	"stanza:label": "Ontology browser",
	"stanza:definition": "Graphical ontology browser",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2022-09-06",
	"stanza:updated": "2022-09-06",
	"stanza:parameter": [
	{
		"stanza:key": "api-endpoint",
		type: "string",
		"stanza:example_old": "https://togovar.biosciencedbc.jp/api/inspect/disease?node=<>",
		"stanza:example": "https://hpo.jax.org/api/hpo/term/<>",
		"stanza:description": "Get node details and relations API endpoint",
		"stanza:required": true
	},
	{
		"stanza:key": "initial-id",
		type: "string",
		"stanza:example_old": "MONDO_0005709",
		"stanza:example": "HP:0001168",
		"stanza:description": "Node id to be shown at load time",
		"stanza:required": true
	},
	{
		"stanza:key": "node-id_path",
		type: "string",
		"stanza:example_old": "id",
		"stanza:example": "details.id",
		"stanza:description": "Key with unique node id",
		"stanza:required": true
	},
	{
		"stanza:key": "node-label_path",
		type: "string",
		"stanza:example_old": "label",
		"stanza:example": "details.name",
		"stanza:description": "JSON path to node label path, separated by dot '.' (e.g. 'details.label') ",
		"stanza:required": true
	},
	{
		"stanza:key": "node-details_path",
		"stanza:type": "string",
		"stanza:example_old": "",
		"stanza:example": "details",
		"stanza:description": "JSON path to node details data in API response, separated by dot '.' (e.g. 'data.details') ",
		"stanza:required": false
	},
	{
		"stanza:key": "node-details_show_keys",
		"stanza:type": "string",
		"stanza:example": "definition, synonyms, xrefs",
		"stanza:description": "Show keys list, comma separated",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-parents_path",
		"stanza:type": "string",
		"stanza:example_old": "parents",
		"stanza:example": "relations.parents",
		"stanza:description": "JSON path to node parents array, separated by dot '.' (e.g. 'data.relations.parents')",
		"stanza:required": true
	},
	{
		"stanza:key": "node-relations-children_path",
		"stanza:type": "string",
		"stanza:example_old": "children",
		"stanza:example": "relations.children",
		"stanza:description": "JSON path to node children array,  separated by dot '.' (e.g. 'data.relations.children')",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-id_key",
		"stanza:type": "string",
		"stanza:example_old": "id",
		"stanza:example": "ontologyId",
		"stanza:description": "JSON path to node children array,  separated by dot '.' (e.g. 'data.relations.children')",
		"stanza:required": false
	},
	{
		"stanza:key": "node-relations-label_key",
		"stanza:type": "string",
		"stanza:example_old": "label",
		"stanza:example": "name",
		"stanza:description": "JSON path to node children array,  separated by dot '.' (e.g. 'data.relations.children')",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font Size"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "text",
		"stanza:default": "500px",
		"stanza:description": "Stanza height"
	},
	{
		"stanza:key": "--togostanza-node-border-color",
		"stanza:type": "color",
		"stanza:default": "#9b9ca1",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-node-border-color-selected",
		"stanza:type": "color",
		"stanza:default": "#1f9dad",
		"stanza:description": "Selected border color"
	},
	{
		"stanza:key": "--togostanza-node-bg-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "Node background color"
	},
	{
		"stanza:key": "--togostanza-node-bg-color-selected",
		"stanza:type": "color",
		"stanza:default": "#fff6e0",
		"stanza:description": "Selected node background color"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
],
	"stanza:outgoingEvent": [
	{
		"stanza:key": "ontology-node-changed",
		"stanza:description": "Being dispatched on change of the active node. `event.details` contains the info of that node."
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=ontology-browser.js.map
