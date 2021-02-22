import { a as commonjsGlobal, d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { t as toRefs, r as ref, c as computed, o as onMounted, a as onUnmounted, w as watch, b as createBlock, d as openBlock, e as defineComponent, f as reactive, g as onUpdated, l as lodash_zip, h as lodash_orderby, i as resolveComponent, j as createVNode, k as withModifiers, m as withDirectives, v as vModelText, T as Transition, n as withCtx, F as Fragment, p as renderList, q as createCommentVNode, s as withKeys, u as createTextVNode, x as toDisplayString, y as mergeProps, z as vModelCheckbox, A as createApp } from './index-88c8ccc1.js';

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

var lodash_uniq = uniq;

function u(t){return -1!==[null,void 0,!1].indexOf(t)}function l(t){var e={exports:{}};return t(e,e.exports),e.exports}function c(t){return (c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var f=l((function(t,e){t.exports=function(){var t=["decimals","thousand","mark","prefix","suffix","encoder","decoder","negativeBefore","negative","edit","undo"];function e(t){return t.split("").reverse().join("")}function r(t,e){return t.substring(0,e.length)===e}function n(t,e){return t.slice(-1*e.length)===e}function i(t,e,r){if((t[e]||t[r])&&t[e]===t[r])throw new Error(e)}function o(t){return "number"==typeof t&&isFinite(t)}function a(t,e){return t=t.toString().split("e"),(+((t=(t=Math.round(+(t[0]+"e"+(t[1]?+t[1]+e:e)))).toString().split("e"))[0]+"e"+(t[1]?+t[1]-e:-e))).toFixed(e)}function s(t,r,n,i,s,u,l,c,f,p,d,h){var m,v,g,b=h,y="",x="";return u&&(h=u(h)),!!o(h)&&(!1!==t&&0===parseFloat(h.toFixed(t))&&(h=0),h<0&&(m=!0,h=Math.abs(h)),!1!==t&&(h=a(h,t)),-1!==(h=h.toString()).indexOf(".")?(g=(v=h.split("."))[0],n&&(y=n+v[1])):g=h,r&&(g=e(g).match(/.{1,3}/g),g=e(g.join(e(r)))),m&&c&&(x+=c),i&&(x+=i),m&&f&&(x+=f),x+=g,x+=y,s&&(x+=s),p&&(x=p(x,b)),x)}function u(t,e,i,a,s,u,l,c,f,p,d,h){var m,v="";return d&&(h=d(h)),!(!h||"string"!=typeof h)&&(c&&r(h,c)&&(h=h.replace(c,""),m=!0),a&&r(h,a)&&(h=h.replace(a,"")),f&&r(h,f)&&(h=h.replace(f,""),m=!0),s&&n(h,s)&&(h=h.slice(0,-1*s.length)),e&&(h=h.split(e).join("")),i&&(h=h.replace(i,".")),m&&(v+="-"),""!==(v=(v+=h).replace(/[^0-9\.\-.]/g,""))&&(v=Number(v),l&&(v=l(v)),!!o(v)&&v))}function l(e){var r,n,o,a={};for(void 0===e.suffix&&(e.suffix=e.postfix),r=0;r<t.length;r+=1)if(void 0===(o=e[n=t[r]]))"negative"!==n||a.negativeBefore?"mark"===n&&"."!==a.thousand?a[n]=".":a[n]=!1:a[n]="-";else if("decimals"===n){if(!(o>=0&&o<8))throw new Error(n);a[n]=o;}else if("encoder"===n||"decoder"===n||"edit"===n||"undo"===n){if("function"!=typeof o)throw new Error(n);a[n]=o;}else {if("string"!=typeof o)throw new Error(n);a[n]=o;}return i(a,"mark","thousand"),i(a,"prefix","negative"),i(a,"prefix","negativeBefore"),a}function f(e,r,n){var i,o=[];for(i=0;i<t.length;i+=1)o.push(e[t[i]]);return o.push(n),r.apply("",o)}function p(t){if(!(this instanceof p))return new p(t);"object"===c(t)&&(t=l(t),this.to=function(e){return f(t,s,e)},this.from=function(e){return f(t,u,e)});}return p}();}));function p(t){return (p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var d=l((function(t,e){t.exports=function(){var t="14.6.3";function e(t){return "object"===p(t)&&"function"==typeof t.to&&"function"==typeof t.from}function r(t){t.parentElement.removeChild(t);}function n(t){return null!=t}function i(t){t.preventDefault();}function o(t){return t.filter((function(t){return !this[t]&&(this[t]=!0)}),{})}function a(t,e){return Math.round(t/e)*e}function s(t,e){var r=t.getBoundingClientRect(),n=t.ownerDocument,i=n.documentElement,o=g(n);return /webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(o.x=0),e?r.top+o.y-i.clientTop:r.left+o.x-i.clientLeft}function u(t){return "number"==typeof t&&!isNaN(t)&&isFinite(t)}function l(t,e,r){r>0&&(h(t,e),setTimeout((function(){m(t,e);}),r));}function c(t){return Math.max(Math.min(t,100),0)}function f(t){return Array.isArray(t)?t:[t]}function d(t){var e=(t=String(t)).split(".");return e.length>1?e[1].length:0}function h(t,e){t.classList&&!/\s/.test(e)?t.classList.add(e):t.className+=" "+e;}function m(t,e){t.classList&&!/\s/.test(e)?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ");}function v(t,e){return t.classList?t.classList.contains(e):new RegExp("\\b"+e+"\\b").test(t.className)}function g(t){var e=void 0!==window.pageXOffset,r="CSS1Compat"===(t.compatMode||"");return {x:e?window.pageXOffset:r?t.documentElement.scrollLeft:t.body.scrollLeft,y:e?window.pageYOffset:r?t.documentElement.scrollTop:t.body.scrollTop}}function b(){return window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"}}function y(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0;}});window.addEventListener("test",null,e);}catch(t){}return t}function x(){return window.CSS&&CSS.supports&&CSS.supports("touch-action","none")}function S(t,e){return 100/(e-t)}function w(t,e,r){return 100*e/(t[r+1]-t[r])}function E(t,e){return w(t,t[0]<0?e+Math.abs(t[0]):e-t[0],0)}function C(t,e){return e*(t[1]-t[0])/100+t[0]}function N(t,e){for(var r=1;t>=e[r];)r+=1;return r}function P(t,e,r){if(r>=t.slice(-1)[0])return 100;var n=N(r,t),i=t[n-1],o=t[n],a=e[n-1],s=e[n];return a+E([i,o],r)/S(a,s)}function A(t,e,r){if(r>=100)return t.slice(-1)[0];var n=N(r,e),i=t[n-1],o=t[n],a=e[n-1];return C([i,o],(r-a)*S(a,e[n]))}function k(t,e,r,n){if(100===n)return n;var i=N(n,t),o=t[i-1],s=t[i];return r?n-o>(s-o)/2?s:o:e[i-1]?t[i-1]+a(n-t[i-1],e[i-1]):n}function U(e,r,n){var i;if("number"==typeof r&&(r=[r]),!Array.isArray(r))throw new Error("noUiSlider ("+t+"): 'range' contains invalid value.");if(!u(i="min"===e?0:"max"===e?100:parseFloat(e))||!u(r[0]))throw new Error("noUiSlider ("+t+"): 'range' value isn't numeric.");n.xPct.push(i),n.xVal.push(r[0]),i?n.xSteps.push(!isNaN(r[1])&&r[1]):isNaN(r[1])||(n.xSteps[0]=r[1]),n.xHighestCompleteStep.push(0);}function V(t,e,r){if(e)if(r.xVal[t]!==r.xVal[t+1]){r.xSteps[t]=w([r.xVal[t],r.xVal[t+1]],e,0)/S(r.xPct[t],r.xPct[t+1]);var n=(r.xVal[t+1]-r.xVal[t])/r.xNumSteps[t],i=Math.ceil(Number(n.toFixed(3))-1),o=r.xVal[t]+r.xNumSteps[t]*i;r.xHighestCompleteStep[t]=o;}else r.xSteps[t]=r.xHighestCompleteStep[t]=r.xVal[t];}function M(t,e,r){var n;this.xPct=[],this.xVal=[],this.xSteps=[r||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=e;var i=[];for(n in t)t.hasOwnProperty(n)&&i.push([t[n],n]);for(i.length&&"object"===p(i[0][0])?i.sort((function(t,e){return t[0][0]-e[0][0]})):i.sort((function(t,e){return t[0]-e[0]})),n=0;n<i.length;n++)U(i[n][1],i[n][0],this);for(this.xNumSteps=this.xSteps.slice(0),n=0;n<this.xNumSteps.length;n++)V(n,this.xNumSteps[n],this);}M.prototype.getDistance=function(e){var r,n=[];for(r=0;r<this.xNumSteps.length-1;r++){var i=this.xNumSteps[r];if(i&&e/i%1!=0)throw new Error("noUiSlider ("+t+"): 'limit', 'margin' and 'padding' of "+this.xPct[r]+"% range must be divisible by step.");n[r]=w(this.xVal,e,r);}return n},M.prototype.getAbsoluteDistance=function(t,e,r){var n,i=0;if(t<this.xPct[this.xPct.length-1])for(;t>this.xPct[i+1];)i++;else t===this.xPct[this.xPct.length-1]&&(i=this.xPct.length-2);r||t!==this.xPct[i+1]||i++;var o=1,a=e[i],s=0,u=0,l=0,c=0;for(n=r?(t-this.xPct[i])/(this.xPct[i+1]-this.xPct[i]):(this.xPct[i+1]-t)/(this.xPct[i+1]-this.xPct[i]);a>0;)s=this.xPct[i+1+c]-this.xPct[i+c],e[i+c]*o+100-100*n>100?(u=s*n,o=(a-100*n)/e[i+c],n=1):(u=e[i+c]*s/100*o,o=0),r?(l-=u,this.xPct.length+c>=1&&c--):(l+=u,this.xPct.length-c>=1&&c++),a=e[i+c]*o;return t+l},M.prototype.toStepping=function(t){return t=P(this.xVal,this.xPct,t)},M.prototype.fromStepping=function(t){return A(this.xVal,this.xPct,t)},M.prototype.getStep=function(t){return t=k(this.xPct,this.xSteps,this.snap,t)},M.prototype.getDefaultStep=function(t,e,r){var n=N(t,this.xPct);return (100===t||e&&t===this.xPct[n-1])&&(n=Math.max(n-1,1)),(this.xVal[n]-this.xVal[n-1])/r},M.prototype.getNearbySteps=function(t){var e=N(t,this.xPct);return {stepBefore:{startValue:this.xVal[e-2],step:this.xNumSteps[e-2],highestStep:this.xHighestCompleteStep[e-2]},thisStep:{startValue:this.xVal[e-1],step:this.xNumSteps[e-1],highestStep:this.xHighestCompleteStep[e-1]},stepAfter:{startValue:this.xVal[e],step:this.xNumSteps[e],highestStep:this.xHighestCompleteStep[e]}}},M.prototype.countStepDecimals=function(){var t=this.xNumSteps.map(d);return Math.max.apply(null,t)},M.prototype.convert=function(t){return this.getStep(this.toStepping(t))};var D={to:function(t){return void 0!==t&&t.toFixed(2)},from:Number},O={target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",touchArea:"touch-area",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",connects:"connects",ltr:"ltr",rtl:"rtl",textDirectionLtr:"txt-dir-ltr",textDirectionRtl:"txt-dir-rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"},F={tooltips:".__tooltips",aria:".__aria"};function L(r){if(e(r))return !0;throw new Error("noUiSlider ("+t+"): 'format' requires 'to' and 'from' methods.")}function j(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'step' is not numeric.");e.singleStep=r;}function z(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'keyboardPageMultiplier' is not numeric.");e.keyboardPageMultiplier=r;}function H(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'keyboardDefaultStep' is not numeric.");e.keyboardDefaultStep=r;}function q(e,r){if("object"!==p(r)||Array.isArray(r))throw new Error("noUiSlider ("+t+"): 'range' is not an object.");if(void 0===r.min||void 0===r.max)throw new Error("noUiSlider ("+t+"): Missing 'min' or 'max' in 'range'.");if(r.min===r.max)throw new Error("noUiSlider ("+t+"): 'range' 'min' and 'max' cannot be equal.");e.spectrum=new M(r,e.snap,e.singleStep);}function R(e,r){if(r=f(r),!Array.isArray(r)||!r.length)throw new Error("noUiSlider ("+t+"): 'start' option is incorrect.");e.handles=r.length,e.start=r;}function T(e,r){if(e.snap=r,"boolean"!=typeof r)throw new Error("noUiSlider ("+t+"): 'snap' option must be a boolean.")}function B(e,r){if(e.animate=r,"boolean"!=typeof r)throw new Error("noUiSlider ("+t+"): 'animate' option must be a boolean.")}function _(e,r){if(e.animationDuration=r,"number"!=typeof r)throw new Error("noUiSlider ("+t+"): 'animationDuration' option must be a number.")}function X(e,r){var n,i=[!1];if("lower"===r?r=[!0,!1]:"upper"===r&&(r=[!1,!0]),!0===r||!1===r){for(n=1;n<e.handles;n++)i.push(r);i.push(!1);}else {if(!Array.isArray(r)||!r.length||r.length!==e.handles+1)throw new Error("noUiSlider ("+t+"): 'connect' option doesn't match handle count.");i=r;}e.connect=i;}function Y(e,r){switch(r){case"horizontal":e.ort=0;break;case"vertical":e.ort=1;break;default:throw new Error("noUiSlider ("+t+"): 'orientation' option is invalid.")}}function I(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'margin' option must be numeric.");0!==r&&(e.margin=e.spectrum.getDistance(r));}function $(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'limit' option must be numeric.");if(e.limit=e.spectrum.getDistance(r),!e.limit||e.handles<2)throw new Error("noUiSlider ("+t+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function W(e,r){var n;if(!u(r)&&!Array.isArray(r))throw new Error("noUiSlider ("+t+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(Array.isArray(r)&&2!==r.length&&!u(r[0])&&!u(r[1]))throw new Error("noUiSlider ("+t+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(0!==r){for(Array.isArray(r)||(r=[r,r]),e.padding=[e.spectrum.getDistance(r[0]),e.spectrum.getDistance(r[1])],n=0;n<e.spectrum.xNumSteps.length-1;n++)if(e.padding[0][n]<0||e.padding[1][n]<0)throw new Error("noUiSlider ("+t+"): 'padding' option must be a positive number(s).");var i=r[0]+r[1],o=e.spectrum.xVal[0];if(i/(e.spectrum.xVal[e.spectrum.xVal.length-1]-o)>1)throw new Error("noUiSlider ("+t+"): 'padding' option must not exceed 100% of the range.")}}function G(e,r){switch(r){case"ltr":e.dir=0;break;case"rtl":e.dir=1;break;default:throw new Error("noUiSlider ("+t+"): 'direction' option was not recognized.")}}function J(e,r){if("string"!=typeof r)throw new Error("noUiSlider ("+t+"): 'behaviour' must be a string containing options.");var n=r.indexOf("tap")>=0,i=r.indexOf("drag")>=0,o=r.indexOf("fixed")>=0,a=r.indexOf("snap")>=0,s=r.indexOf("hover")>=0,u=r.indexOf("unconstrained")>=0;if(o){if(2!==e.handles)throw new Error("noUiSlider ("+t+"): 'fixed' behaviour must be used with 2 handles");I(e,e.start[1]-e.start[0]);}if(u&&(e.margin||e.limit))throw new Error("noUiSlider ("+t+"): 'unconstrained' behaviour cannot be used with margin or limit");e.events={tap:n||a,drag:i,fixed:o,snap:a,hover:s,unconstrained:u};}function K(e,r){if(!1!==r)if(!0===r){e.tooltips=[];for(var n=0;n<e.handles;n++)e.tooltips.push(!0);}else {if(e.tooltips=f(r),e.tooltips.length!==e.handles)throw new Error("noUiSlider ("+t+"): must pass a formatter for all handles.");e.tooltips.forEach((function(e){if("boolean"!=typeof e&&("object"!==p(e)||"function"!=typeof e.to))throw new Error("noUiSlider ("+t+"): 'tooltips' must be passed a formatter or 'false'.")}));}}function Q(t,e){t.ariaFormat=e,L(e);}function Z(t,e){t.format=e,L(e);}function tt(e,r){if(e.keyboardSupport=r,"boolean"!=typeof r)throw new Error("noUiSlider ("+t+"): 'keyboardSupport' option must be a boolean.")}function et(t,e){t.documentElement=e;}function rt(e,r){if("string"!=typeof r&&!1!==r)throw new Error("noUiSlider ("+t+"): 'cssPrefix' must be a string or `false`.");e.cssPrefix=r;}function nt(e,r){if("object"!==p(r))throw new Error("noUiSlider ("+t+"): 'cssClasses' must be an object.");if("string"==typeof e.cssPrefix)for(var n in e.cssClasses={},r)r.hasOwnProperty(n)&&(e.cssClasses[n]=e.cssPrefix+r[n]);else e.cssClasses=r;}function it(e){var r={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:D,format:D},i={step:{r:!1,t:j},keyboardPageMultiplier:{r:!1,t:z},keyboardDefaultStep:{r:!1,t:H},start:{r:!0,t:R},connect:{r:!0,t:X},direction:{r:!0,t:G},snap:{r:!1,t:T},animate:{r:!1,t:B},animationDuration:{r:!1,t:_},range:{r:!0,t:q},orientation:{r:!1,t:Y},margin:{r:!1,t:I},limit:{r:!1,t:$},padding:{r:!1,t:W},behaviour:{r:!0,t:J},ariaFormat:{r:!1,t:Q},format:{r:!1,t:Z},tooltips:{r:!1,t:K},keyboardSupport:{r:!0,t:tt},documentElement:{r:!1,t:et},cssPrefix:{r:!0,t:rt},cssClasses:{r:!0,t:nt}},o={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",keyboardSupport:!0,cssPrefix:"noUi-",cssClasses:O,keyboardPageMultiplier:5,keyboardDefaultStep:10};e.format&&!e.ariaFormat&&(e.ariaFormat=e.format),Object.keys(i).forEach((function(a){if(!n(e[a])&&void 0===o[a]){if(i[a].r)throw new Error("noUiSlider ("+t+"): '"+a+"' is required.");return !0}i[a].t(r,n(e[a])?e[a]:o[a]);})),r.pips=e.pips;var a=document.createElement("div"),s=void 0!==a.style.msTransform,u=void 0!==a.style.transform;r.transformRule=u?"transform":s?"msTransform":"webkitTransform";var l=[["left","top"],["right","bottom"]];return r.style=l[r.dir][r.ort],r}function ot(e,n,a){var u,p,d,S,w,E,C=b(),N=x()&&y(),P=e,A=n.spectrum,k=[],U=[],V=[],M=0,D={},O=e.ownerDocument,L=n.documentElement||O.documentElement,j=O.body,z=-1,H=0,q=1,R=2,T="rtl"===O.dir||1===n.ort?0:100;function B(t,e){var r=O.createElement("div");return e&&h(r,e),t.appendChild(r),r}function _(t,e){var r=B(t,n.cssClasses.origin),i=B(r,n.cssClasses.handle);return B(i,n.cssClasses.touchArea),i.setAttribute("data-handle",e),n.keyboardSupport&&(i.setAttribute("tabindex","0"),i.addEventListener("keydown",(function(t){return vt(t,e)}))),i.setAttribute("role","slider"),i.setAttribute("aria-orientation",n.ort?"vertical":"horizontal"),0===e?h(i,n.cssClasses.handleLower):e===n.handles-1&&h(i,n.cssClasses.handleUpper),r}function X(t,e){return !!e&&B(t,n.cssClasses.connect)}function Y(t,e){var r=B(e,n.cssClasses.connects);p=[],(d=[]).push(X(r,t[0]));for(var i=0;i<n.handles;i++)p.push(_(e,i)),V[i]=i,d.push(X(r,t[i+1]));}function I(t){return h(t,n.cssClasses.target),0===n.dir?h(t,n.cssClasses.ltr):h(t,n.cssClasses.rtl),0===n.ort?h(t,n.cssClasses.horizontal):h(t,n.cssClasses.vertical),h(t,"rtl"===getComputedStyle(t).direction?n.cssClasses.textDirectionRtl:n.cssClasses.textDirectionLtr),B(t,n.cssClasses.base)}function $(t,e){return !!n.tooltips[e]&&B(t.firstChild,n.cssClasses.tooltip)}function W(){return P.hasAttribute("disabled")}function G(t){return p[t].hasAttribute("disabled")}function J(){w&&(xt("update"+F.tooltips),w.forEach((function(t){t&&r(t);})),w=null);}function K(){J(),w=p.map($),bt("update"+F.tooltips,(function(t,e,r){if(w[e]){var i=t[e];!0!==n.tooltips[e]&&(i=n.tooltips[e].to(r[e])),w[e].innerHTML=i;}}));}function Q(){xt("update"+F.aria),bt("update"+F.aria,(function(t,e,r,i,o){V.forEach((function(t){var e=p[t],i=wt(U,t,0,!0,!0,!0),a=wt(U,t,100,!0,!0,!0),s=o[t],u=n.ariaFormat.to(r[t]);i=A.fromStepping(i).toFixed(1),a=A.fromStepping(a).toFixed(1),s=A.fromStepping(s).toFixed(1),e.children[0].setAttribute("aria-valuemin",i),e.children[0].setAttribute("aria-valuemax",a),e.children[0].setAttribute("aria-valuenow",s),e.children[0].setAttribute("aria-valuetext",u);}));}));}function Z(e,r,n){if("range"===e||"steps"===e)return A.xVal;if("count"===e){if(r<2)throw new Error("noUiSlider ("+t+"): 'values' (>= 2) required for mode 'count'.");var i=r-1,o=100/i;for(r=[];i--;)r[i]=i*o;r.push(100),e="positions";}return "positions"===e?r.map((function(t){return A.fromStepping(n?A.getStep(t):t)})):"values"===e?n?r.map((function(t){return A.fromStepping(A.getStep(A.toStepping(t)))})):r:void 0}function tt(t,e,r){function n(t,e){return (t+e).toFixed(7)/1}var i={},a=A.xVal[0],s=A.xVal[A.xVal.length-1],u=!1,l=!1,c=0;return (r=o(r.slice().sort((function(t,e){return t-e}))))[0]!==a&&(r.unshift(a),u=!0),r[r.length-1]!==s&&(r.push(s),l=!0),r.forEach((function(o,a){var s,f,p,d,h,m,v,g,b,y,x=o,S=r[a+1],w="steps"===e;if(w&&(s=A.xNumSteps[a]),s||(s=S-x),!1!==x)for(void 0===S&&(S=x),s=Math.max(s,1e-7),f=x;f<=S;f=n(f,s)){for(g=(h=(d=A.toStepping(f))-c)/t,y=h/(b=Math.round(g)),p=1;p<=b;p+=1)i[(m=c+p*y).toFixed(5)]=[A.fromStepping(m),0];v=r.indexOf(f)>-1?q:w?R:H,!a&&u&&f!==S&&(v=0),f===S&&l||(i[d.toFixed(5)]=[f,v]),c=d;}})),i}function et(t,e,r){var i=O.createElement("div"),o=[];o[H]=n.cssClasses.valueNormal,o[q]=n.cssClasses.valueLarge,o[R]=n.cssClasses.valueSub;var a=[];a[H]=n.cssClasses.markerNormal,a[q]=n.cssClasses.markerLarge,a[R]=n.cssClasses.markerSub;var s=[n.cssClasses.valueHorizontal,n.cssClasses.valueVertical],u=[n.cssClasses.markerHorizontal,n.cssClasses.markerVertical];function l(t,e){var r=e===n.cssClasses.value,i=r?o:a;return e+" "+(r?s:u)[n.ort]+" "+i[t]}function c(t,o,a){if((a=e?e(o,a):a)!==z){var s=B(i,!1);s.className=l(a,n.cssClasses.marker),s.style[n.style]=t+"%",a>H&&((s=B(i,!1)).className=l(a,n.cssClasses.value),s.setAttribute("data-value",o),s.style[n.style]=t+"%",s.innerHTML=r.to(o));}}return h(i,n.cssClasses.pips),h(i,0===n.ort?n.cssClasses.pipsHorizontal:n.cssClasses.pipsVertical),Object.keys(t).forEach((function(e){c(e,t[e][0],t[e][1]);})),i}function rt(){S&&(r(S),S=null);}function nt(t){rt();var e=t.mode,r=t.density||1,n=t.filter||!1,i=tt(r,e,Z(e,t.values||!1,t.stepped||!1)),o=t.format||{to:Math.round};return S=P.appendChild(et(i,n,o))}function ot(){var t=u.getBoundingClientRect(),e="offset"+["Width","Height"][n.ort];return 0===n.ort?t.width||u[e]:t.height||u[e]}function at(t,e,r,i){var o=function(o){return !!(o=st(o,i.pageOffset,i.target||e))&&!(W()&&!i.doNotReject)&&!(v(P,n.cssClasses.tap)&&!i.doNotReject)&&!(t===C.start&&void 0!==o.buttons&&o.buttons>1)&&(!i.hover||!o.buttons)&&(N||o.preventDefault(),o.calcPoint=o.points[n.ort],void r(o,i))},a=[];return t.split(" ").forEach((function(t){e.addEventListener(t,o,!!N&&{passive:!0}),a.push([t,o]);})),a}function st(t,e,r){var n,i,o=0===t.type.indexOf("touch"),a=0===t.type.indexOf("mouse"),s=0===t.type.indexOf("pointer");if(0===t.type.indexOf("MSPointer")&&(s=!0),"mousedown"===t.type&&!t.buttons&&!t.touches)return !1;if(o){var u=function(t){return t.target===r||r.contains(t.target)||t.target.shadowRoot&&t.target.shadowRoot.contains(r)};if("touchstart"===t.type){var l=Array.prototype.filter.call(t.touches,u);if(l.length>1)return !1;n=l[0].pageX,i=l[0].pageY;}else {var c=Array.prototype.find.call(t.changedTouches,u);if(!c)return !1;n=c.pageX,i=c.pageY;}}return e=e||g(O),(a||s)&&(n=t.clientX+e.x,i=t.clientY+e.y),t.pageOffset=e,t.points=[n,i],t.cursor=a||s,t}function ut(t){var e=100*(t-s(u,n.ort))/ot();return e=c(e),n.dir?100-e:e}function lt(t){var e=100,r=!1;return p.forEach((function(n,i){if(!G(i)){var o=U[i],a=Math.abs(o-t);(a<e||a<=e&&t>o||100===a&&100===e)&&(r=i,e=a);}})),r}function ct(t,e){"mouseout"===t.type&&"HTML"===t.target.nodeName&&null===t.relatedTarget&&pt(t,e);}function ft(t,e){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===t.buttons&&0!==e.buttonsProperty)return pt(t,e);var r=(n.dir?-1:1)*(t.calcPoint-e.startCalcPoint);Ct(r>0,100*r/e.baseSize,e.locations,e.handleNumbers);}function pt(t,e){e.handle&&(m(e.handle,n.cssClasses.active),M-=1),e.listeners.forEach((function(t){L.removeEventListener(t[0],t[1]);})),0===M&&(m(P,n.cssClasses.drag),At(),t.cursor&&(j.style.cursor="",j.removeEventListener("selectstart",i))),e.handleNumbers.forEach((function(t){St("change",t),St("set",t),St("end",t);}));}function dt(t,e){if(e.handleNumbers.some(G))return !1;var r;1===e.handleNumbers.length&&(r=p[e.handleNumbers[0]].children[0],M+=1,h(r,n.cssClasses.active)),t.stopPropagation();var o=[],a=at(C.move,L,ft,{target:t.target,handle:r,listeners:o,startCalcPoint:t.calcPoint,baseSize:ot(),pageOffset:t.pageOffset,handleNumbers:e.handleNumbers,buttonsProperty:t.buttons,locations:U.slice()}),s=at(C.end,L,pt,{target:t.target,handle:r,listeners:o,doNotReject:!0,handleNumbers:e.handleNumbers}),u=at("mouseout",L,ct,{target:t.target,handle:r,listeners:o,doNotReject:!0,handleNumbers:e.handleNumbers});o.push.apply(o,a.concat(s,u)),t.cursor&&(j.style.cursor=getComputedStyle(t.target).cursor,p.length>1&&h(P,n.cssClasses.drag),j.addEventListener("selectstart",i,!1)),e.handleNumbers.forEach((function(t){St("start",t);}));}function ht(t){t.stopPropagation();var e=ut(t.calcPoint),r=lt(e);if(!1===r)return !1;n.events.snap||l(P,n.cssClasses.tap,n.animationDuration),kt(r,e,!0,!0),At(),St("slide",r,!0),St("update",r,!0),St("change",r,!0),St("set",r,!0),n.events.snap&&dt(t,{handleNumbers:[r]});}function mt(t){var e=ut(t.calcPoint),r=A.getStep(e),n=A.fromStepping(r);Object.keys(D).forEach((function(t){"hover"===t.split(".")[0]&&D[t].forEach((function(t){t.call(E,n);}));}));}function vt(t,e){if(W()||G(e))return !1;var r=["Left","Right"],i=["Down","Up"],o=["PageDown","PageUp"],a=["Home","End"];n.dir&&!n.ort?r.reverse():n.ort&&!n.dir&&(i.reverse(),o.reverse());var s,u=t.key.replace("Arrow",""),l=u===o[0],c=u===o[1],f=u===i[0]||u===r[0]||l,p=u===i[1]||u===r[1]||c,d=u===a[0],h=u===a[1];if(!(f||p||d||h))return !0;if(t.preventDefault(),p||f){var m=n.keyboardPageMultiplier,v=f?0:1,g=jt(e)[v];if(null===g)return !1;!1===g&&(g=A.getDefaultStep(U[e],f,n.keyboardDefaultStep)),(c||l)&&(g*=m),g=Math.max(g,1e-7),g*=f?-1:1,s=k[e]+g;}else s=h?n.spectrum.xVal[n.spectrum.xVal.length-1]:n.spectrum.xVal[0];return kt(e,A.toStepping(s),!0,!0),St("slide",e),St("update",e),St("change",e),St("set",e),!1}function gt(t){t.fixed||p.forEach((function(t,e){at(C.start,t.children[0],dt,{handleNumbers:[e]});})),t.tap&&at(C.start,u,ht,{}),t.hover&&at(C.move,u,mt,{hover:!0}),t.drag&&d.forEach((function(e,r){if(!1!==e&&0!==r&&r!==d.length-1){var i=p[r-1],o=p[r],a=[e];h(e,n.cssClasses.draggable),t.fixed&&(a.push(i.children[0]),a.push(o.children[0])),a.forEach((function(t){at(C.start,t,dt,{handles:[i,o],handleNumbers:[r-1,r]});}));}}));}function bt(t,e){D[t]=D[t]||[],D[t].push(e),"update"===t.split(".")[0]&&p.forEach((function(t,e){St("update",e);}));}function yt(t){return t===F.aria||t===F.tooltips}function xt(t){var e=t&&t.split(".")[0],r=e?t.substring(e.length):t;Object.keys(D).forEach((function(t){var n=t.split(".")[0],i=t.substring(n.length);e&&e!==n||r&&r!==i||yt(i)&&r!==i||delete D[t];}));}function St(t,e,r){Object.keys(D).forEach((function(i){var o=i.split(".")[0];t===o&&D[i].forEach((function(t){t.call(E,k.map(n.format.to),e,k.slice(),r||!1,U.slice(),E);}));}));}function wt(t,e,r,i,o,a){var s;return p.length>1&&!n.events.unconstrained&&(i&&e>0&&(s=A.getAbsoluteDistance(t[e-1],n.margin,0),r=Math.max(r,s)),o&&e<p.length-1&&(s=A.getAbsoluteDistance(t[e+1],n.margin,1),r=Math.min(r,s))),p.length>1&&n.limit&&(i&&e>0&&(s=A.getAbsoluteDistance(t[e-1],n.limit,0),r=Math.min(r,s)),o&&e<p.length-1&&(s=A.getAbsoluteDistance(t[e+1],n.limit,1),r=Math.max(r,s))),n.padding&&(0===e&&(s=A.getAbsoluteDistance(0,n.padding[0],0),r=Math.max(r,s)),e===p.length-1&&(s=A.getAbsoluteDistance(100,n.padding[1],1),r=Math.min(r,s))),!((r=c(r=A.getStep(r)))===t[e]&&!a)&&r}function Et(t,e){var r=n.ort;return (r?e:t)+", "+(r?t:e)}function Ct(t,e,r,n){var i=r.slice(),o=[!t,t],a=[t,!t];n=n.slice(),t&&n.reverse(),n.length>1?n.forEach((function(t,r){var n=wt(i,t,i[t]+e,o[r],a[r],!1);!1===n?e=0:(e=n-i[t],i[t]=n);})):o=a=[!0];var s=!1;n.forEach((function(t,n){s=kt(t,r[t]+e,o[n],a[n])||s;})),s&&n.forEach((function(t){St("update",t),St("slide",t);}));}function Nt(t,e){return n.dir?100-t-e:t}function Pt(t,e){U[t]=e,k[t]=A.fromStepping(e);var r="translate("+Et(10*(Nt(e,0)-T)+"%","0")+")";p[t].style[n.transformRule]=r,Ut(t),Ut(t+1);}function At(){V.forEach((function(t){var e=U[t]>50?-1:1,r=3+(p.length+e*t);p[t].style.zIndex=r;}));}function kt(t,e,r,n,i){return i||(e=wt(U,t,e,r,n,!1)),!1!==e&&(Pt(t,e),!0)}function Ut(t){if(d[t]){var e=0,r=100;0!==t&&(e=U[t-1]),t!==d.length-1&&(r=U[t]);var i=r-e,o="translate("+Et(Nt(e,i)+"%","0")+")",a="scale("+Et(i/100,"1")+")";d[t].style[n.transformRule]=o+" "+a;}}function Vt(t,e){return null===t||!1===t||void 0===t?U[e]:("number"==typeof t&&(t=String(t)),t=n.format.from(t),!1===(t=A.toStepping(t))||isNaN(t)?U[e]:t)}function Mt(t,e,r){var i=f(t),o=void 0===U[0];e=void 0===e||!!e,n.animate&&!o&&l(P,n.cssClasses.tap,n.animationDuration),V.forEach((function(t){kt(t,Vt(i[t],t),!0,!1,r);}));for(var a=1===V.length?0:1;a<V.length;++a)V.forEach((function(t){kt(t,U[t],!0,!0,r);}));At(),V.forEach((function(t){St("update",t),null!==i[t]&&e&&St("set",t);}));}function Dt(t){Mt(n.start,t);}function Ot(e,r,n,i){if(!((e=Number(e))>=0&&e<V.length))throw new Error("noUiSlider ("+t+"): invalid handle number, got: "+e);kt(e,Vt(r,e),!0,!0,i),St("update",e),n&&St("set",e);}function Ft(){var t=k.map(n.format.to);return 1===t.length?t[0]:t}function Lt(){for(var t in xt(F.aria),xt(F.tooltips),n.cssClasses)n.cssClasses.hasOwnProperty(t)&&m(P,n.cssClasses[t]);for(;P.firstChild;)P.removeChild(P.firstChild);delete P.noUiSlider;}function jt(t){var e=U[t],r=A.getNearbySteps(e),i=k[t],o=r.thisStep.step,a=null;if(n.snap)return [i-r.stepBefore.startValue||null,r.stepAfter.startValue-i||null];!1!==o&&i+o>r.stepAfter.startValue&&(o=r.stepAfter.startValue-i),a=i>r.thisStep.startValue?r.thisStep.step:!1!==r.stepBefore.step&&i-r.stepBefore.highestStep,100===e?o=null:0===e&&(a=null);var s=A.countStepDecimals();return null!==o&&!1!==o&&(o=Number(o.toFixed(s))),null!==a&&!1!==a&&(a=Number(a.toFixed(s))),[a,o]}function zt(){return V.map(jt)}function Ht(t,e){var r=Ft(),i=["margin","limit","padding","range","animate","snap","step","format","pips","tooltips"];i.forEach((function(e){void 0!==t[e]&&(a[e]=t[e]);}));var o=it(a);i.forEach((function(e){void 0!==t[e]&&(n[e]=o[e]);})),A=o.spectrum,n.margin=o.margin,n.limit=o.limit,n.padding=o.padding,n.pips?nt(n.pips):rt(),n.tooltips?K():J(),U=[],Mt(t.start||r,e);}function qt(){u=I(P),Y(n.connect,u),gt(n.events),Mt(n.start),n.pips&&nt(n.pips),n.tooltips&&K(),Q();}return qt(),E={destroy:Lt,steps:zt,on:bt,off:xt,get:Ft,set:Mt,setHandle:Ot,reset:Dt,__moveHandles:function(t,e,r){Ct(t,e,U,r);},options:a,updateOptions:Ht,target:P,removePips:rt,removeTooltips:J,getTooltips:function(){return w},getOrigins:function(){return p},pips:nt}}function at(e,r){if(!e||!e.nodeName)throw new Error("noUiSlider ("+t+"): create requires a single element, got: "+e);if(e.noUiSlider)throw new Error("noUiSlider ("+t+"): Slider was already initialized.");var n=ot(e,it(r),r);return e.noUiSlider=n,n}return {__spectrum:M,version:t,cssClasses:O,create:at}}();}));var h={name:"Slider",emits:["input","update:modelValue","update","change"],props:{...{value:{validator:function(t){return t=>"number"==typeof t||t instanceof Array||null==t||!1===t},required:!1},modelValue:{validator:function(t){return t=>"number"==typeof t||t instanceof Array||null==t||!1===t},required:!1}},id:{type:[String,Number],required:!1,default:"slider"},disabled:{type:Boolean,required:!1,default:!1},min:{type:Number,required:!1,default:0},max:{type:Number,required:!1,default:100},step:{type:Number,required:!1,default:1},orientation:{type:String,required:!1,default:"horizontal"},direction:{type:String,required:!1,default:"ltr"},tooltips:{type:Boolean,required:!1,default:!0},options:{type:Object,required:!1,default:()=>({})},merge:{type:Number,required:!1,default:-1},height:{type:String,required:!1,default:"300px"},format:{type:[Object,Function],required:!1,default:null}},setup(a,s){const l=function(r,n,i){var o=toRefs(r),a=o.value,s=o.modelValue,l=void 0!==n.expose?s:a,c=ref(l.value);if(u(l.value))throw new Error("Slider v-model must be a Number or Array");if(Array.isArray(l.value)&&0==l.value.length)throw new Error("Slider v-model must not be an empty array");return {value:l,initialValue:c}}(a,s),c=function(e,n,i){var o=toRefs(e),a=o.orientation,s=o.height;return {style:computed((function(){return "vertical"==a.value?{height:s.value}:[]}))}}(a),p=function(e,n,i){var o=toRefs(e),a=o.format,s=o.step,u=i.value,l=computed((function(){return a&&a.value?"function"==typeof a.value?{to:a.value}:f(Object.assign({},a.value)):f({decimals:s.value>=0?0:2})}));return {tooltipsFormat:computed((function(){return Array.isArray(u.value)?u.value.map((function(t){return l.value})):l.value})),tooltipsMerge:function(t,e,r){var n="rtl"===getComputedStyle(t).direction,i="rtl"===t.noUiSlider.options.direction,o="vertical"===t.noUiSlider.options.orientation,a=t.noUiSlider.getTooltips(),s=t.noUiSlider.getOrigins();a.forEach((function(t,e){t&&s[e].appendChild(t);})),t.noUiSlider.on("update",(function(t,s,u,c,f){var p=[[]],d=[[]],h=[[]],m=0;a[0]&&(p[0][0]=0,d[0][0]=f[0],h[0][0]=l.value.to(parseFloat(t[0])));for(var v=1;v<f.length;v++)(!a[v]||f[v]-f[v-1]>e)&&(p[++m]=[],h[m]=[],d[m]=[]),a[v]&&(p[m].push(v),h[m].push(l.value.to(parseFloat(t[v]))),d[m].push(f[v]));p.forEach((function(t,e){for(var s=t.length,u=0;u<s;u++){var l=t[u];if(u===s-1){var c=0;d[e].forEach((function(t){c+=1e3-10*t;}));var f=o?"bottom":"right",p=i?0:s-1,m=1e3-10*d[e][p];c=(n&&!o?100:0)+c/s-m,a[l].innerHTML=h[e].join(r),a[l].style.display="block",a[l].style[f]=c+"%";}else a[l].style.display="none";}}));}));}}}(a,0,{value:l.value}),h=function(a,s,l){var c=toRefs(a),f=c.options,p=c.orientation,h=c.direction,m=c.tooltips,v=c.step,g=c.min,b=c.max,y=c.merge,x=c.format,S=l.value,w=l.initialValue,E=l.tooltipsFormat,C=l.tooltipsMerge,N=ref(null),P=ref(null),A=ref(!1),k=computed((function(){var t={cssPrefix:"slider-",orientation:p.value,direction:h.value,tooltips:!!m.value&&E.value,connect:"lower",start:u(S.value)?g.value:S.value,range:{min:g.value,max:b.value}};return v.value>0&&(t.step=v.value),Array.isArray(S.value)&&(t.connect=!0),t})),U=computed((function(){return Array.isArray(S.value)})),V=function(){var t=P.value.get();return Array.isArray(t)?t.map((function(t){return parseFloat(t)})):parseFloat(t)},M=function(t){P.value.set(t);},D=function(t){s.emit("input",t),s.emit("update:modelValue",t),s.emit("update",t);},O=function(){P.value=d.create(N.value,Object.assign({},k.value,f.value)),m.value&&U.value&&y.value>=0&&C(N.value,y.value," - "),P.value.on("set",(function(t){s.emit("change",V());})),P.value.on("update",(function(t){A.value&&D(V());})),A.value=!0;},F=function(){P.value.off(),P.value.destroy(),P.value=null;},L=function(){A.value=!1,F(),O();};return onMounted(O),onUnmounted(F),watch(U,L,{immediate:!1}),watch(g,L,{immediate:!1}),watch(b,L,{immediate:!1}),watch(v,L,{immediate:!1}),watch(p,L,{immediate:!1}),watch(h,L,{immediate:!1}),watch(m,L,{immediate:!1}),watch(x,L,{immediate:!1,deep:!0}),watch(y,L,{immediate:!1}),watch(f,L,{immediate:!1,deep:!0}),watch(S,(function(t){var e,r,n;u(t)?M(g.value):(U.value&&(e=t,r=V(),n=r.slice().sort(),e.length!==r.length||!e.slice().sort().every((function(t,e){return t===n[e]})))||!U.value&&t!=V())&&M(t);}),{deep:!0}),{slider:N,slider$:P,isRange:U,init:O,destroy:F,refresh:L,update:M,reset:function(){D(w.value);}}}(a,s,{value:l.value,initialValue:l.initialValue,tooltipsFormat:p.tooltipsFormat,tooltipsMerge:p.tooltipsMerge});return {...c,...p,...h}}};h.render=function(t,e,r,n,i,o){return openBlock(),createBlock("div",{id:r.id,style:t.style,ref:"slider"},null,12,["id"])},h.__file="src/Slider.vue";

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "table-with-pagination",
	"stanza:label": "table with pagination",
	"stanza:definition": "Table with pagination for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Table",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-12-09",
	"stanza:updated": "2020-12-09",
	"stanza:parameter": [
	{
		"stanza:key": "table_data_api",
		"stanza:example": "http://togostanza.org/sparqlist/api/metastanza_table?taxonomy=9606",
		"stanza:description": "table data api",
		"stanza:required": true
	},
	{
		"stanza:key": "limit",
		"stanza:example": "5",
		"stanza:description": "table page size",
		"stanza:required": true
	},
	{
		"stanza:key": "offset",
		"stanza:example": "0",
		"stanza:description": "page numbere",
		"stanza:required": true
	},
	{
		"stanza:key": "params",
		"stanza:example": "taxonomy='9606'",
		"stanza:description": "parameters for table data api",
		"stanza:required": false
	},
	{
		"stanza:key": "page_slider",
		"stanza:example": "1",
		"stanza:description": "Page slider on/off",
		"stanza:required": false
	},
	{
		"stanza:key": "tableTitle",
		"stanza:example": "Title of this Table",
		"stanza:description": "Title of the table",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--general-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "general font family"
	},
	{
		"stanza:key": "--general-font-color",
		"stanza:type": "color",
		"stanza:default": "#707070",
		"stanza:description": "general font color"
	},
	{
		"stanza:key": "--general-font-size",
		"stanza:type": "number",
		"stanza:default": "12px",
		"stanza:description": "general font size"
	},
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "basic fill color"
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#44b8cc",
		"stanza:description": "emphasized color"
	},
	{
		"stanza:key": "--background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color"
	},
	{
		"stanza:key": "--tabletitle-display",
		"stanza:type": "text",
		"stanza:default": "flex",
		"stanza:description": "display of table title.(flex, block or none)"
	},
	{
		"stanza:key": "--tabletitle-placement",
		"stanza:type": "text",
		"stanza:default": "center",
		"stanza:description": "table title placement when table title is displayed.(left, right, center)"
	},
	{
		"stanza:key": "--tabletitle-margin",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "margin of table title"
	},
	{
		"stanza:key": "--tabletitle-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "font size of table title"
	},
	{
		"stanza:key": "--tabletitle-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "font color of table title"
	},
	{
		"stanza:key": "--table-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "style of table border"
	},
	{
		"stanza:key": "--table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #eee",
		"stanza:description": "style of table shadow"
	},
	{
		"stanza:key": "--ruled-line",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #eee",
		"stanza:description": "style of ruled line"
	},
	{
		"stanza:key": "--searchbox-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "radius of search box"
	},
	{
		"stanza:key": "--searchbox-border-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "border color of search box"
	},
	{
		"stanza:key": "--searchbox-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "color of search box"
	},
	{
		"stanza:key": "--searchbtn-height",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "height of search button"
	},
	{
		"stanza:key": "--searchbtn-width",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "width of search button"
	},
	{
		"stanza:key": "--searchbox-height",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "height of search box"
	},
	{
		"stanza:key": "--searchbox-width",
		"stanza:type": "text",
		"stanza:default": "164px",
		"stanza:description": "width of search box"
	},
	{
		"stanza:key": "--searchbox-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of search box"
	},
	{
		"stanza:key": "--searchbox-font-color",
		"stanza:type": "text",
		"stanza:default": "#707070",
		"stanza:description": "font color of search box"
	},
	{
		"stanza:key": "--searchbox-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of search box"
	},
	{
		"stanza:key": "--searchbtn-border-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "border color of search button"
	},
	{
		"stanza:key": "--searchbtn-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "radius of search button"
	},
	{
		"stanza:key": "--searchbtn-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "color of search button"
	},
	{
		"stanza:key": "--searchbtn-img-width",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "width of search button image"
	},
	{
		"stanza:key": "--searchbtn-img-height",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "height of search button image"
	},
	{
		"stanza:key": "--searchimg-display",
		"stanza:type": "text",
		"stanza:default": "block",
		"stanza:description": "display of search button image"
	},
	{
		"stanza:key": "--searchtext-display",
		"stanza:type": "text",
		"stanza:default": "none",
		"stanza:description": "display of search button text.(dafault: none)"
	},
	{
		"stanza:key": "--searchtext-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "color of search button text"
	},
	{
		"stanza:key": "--searchtext-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of search button text"
	},
	{
		"stanza:key": "--dlbtn-img-width",
		"stanza:type": "text",
		"stanza:default": "13px",
		"stanza:description": "width of download button image"
	},
	{
		"stanza:key": "--dlbtn-img-height",
		"stanza:type": "text",
		"stanza:default": "13px",
		"stanza:description": "height of download button image"
	},
	{
		"stanza:key": "--information-margin",
		"stanza:type": "text",
		"stanza:default": "0px 0px 10px 0px",
		"stanza:description": "margin of information area"
	},
	{
		"stanza:key": "--searchicon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of search icon"
	},
	{
		"stanza:key": "--filtericon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of filter icon"
	},
	{
		"stanza:key": "--sorticon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of sort icon"
	},
	{
		"stanza:key": "--thead-border-top",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "border top of thead"
	},
	{
		"stanza:key": "--thead-border-right",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "border right of thead"
	},
	{
		"stanza:key": "--thead-border-bottom",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "border bottom of thead"
	},
	{
		"stanza:key": "--thead-border-left",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "border left of thead"
	},
	{
		"stanza:key": "--thead-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--tbody-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--thead-font-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "font color of table header"
	},
	{
		"stanza:key": "--thead-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "font weight of table header"
	},
	{
		"stanza:key": "--thead-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table header"
	},
	{
		"stanza:key": "--tbody-font-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "font color of table body"
	},
	{
		"stanza:key": "--tbody-border-right",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border right of table body"
	},
	{
		"stanza:key": "--tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border bottom of table body"
	},
	{
		"stanza:key": "--tbody-border-left",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border left of table body"
	},
	{
		"stanza:key": "--tbody-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--tbody-odd-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--pagination-padding",
		"stanza:type": "text",
		"stanza:default": "12px 0px 0px 0px",
		"stanza:description": "padding of pagination"
	},
	{
		"stanza:key": "--pagination-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "pagination placement"
	},
	{
		"stanza:key": "--showinfo-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "show info placement"
	},
	{
		"stanza:key": "--paginationbtn-font-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "font color of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-background-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "background color of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-border",
		"stanza:type": "text",
		"stanza:default": "1px solid rgba(0, 0, 0, .1)",
		"stanza:description": "border style of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-border-radius",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "border radius of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-padding",
		"stanza:type": "text",
		"stanza:default": "2px 8px",
		"stanza:description": "padding of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of pagination button"
	},
	{
		"stanza:key": "--currentbtn-font-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "font color of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-background-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "background color of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #DDDDDD",
		"stanza:description": "border style of pagination button.(at current page)"
	},
	{
		"stanza:key": "--arrowbtn-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "color of pagination arrow button."
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "font(e.g: serif,san serif,fantasy)"
	},
	{
		"stanza:key": "--greeting-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "text align of greeting"
	}
]
};

var head = {
	vars: [
		"id",
		"uniprot",
		"mnemonic",
		"name",
		"location_name",
		"location_uniprot"
	],
	labels: [
		"Acccession",
		null,
		"Mnemonic",
		"Protein name",
		"Subcellular location",
		null
	],
	order: [
		0,
		-1,
		1,
		2,
		3,
		-1
	],
	href: [
		"uniprot",
		null,
		null,
		null,
		"location_uniprot",
		null
	],
	rowspan: [
		false,
		false,
		false,
		false,
		true,
		false
	]
};
var body = [
	{
		id: {
			type: "literal",
			value: "Q9BSA9"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9BSA9"
		},
		mnemonic: {
			type: "number",
			value: 213
		},
		name: {
			type: "literal",
			value: "Endosomal/lysosomal potassium channel TMEM175"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q14457"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q14457"
		},
		mnemonic: {
			type: "number",
			value: 253
		},
		name: {
			type: "literal",
			value: "Beclin-1"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P61077"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P61077"
		},
		mnemonic: {
			type: "number",
			value: 640
		},
		name: {
			type: "literal",
			value: "Ubiquitin-conjugating enzyme E2 D3"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q99732"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q99732"
		},
		mnemonic: {
			type: "number",
			value: 637
		},
		name: {
			type: "literal",
			value: "Lipopolysaccharide-induced tumor necrosis factor-alpha factor"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q96EK6"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q96EK6"
		},
		mnemonic: {
			type: "number",
			value: 688
		},
		name: {
			type: "literal",
			value: "Glucosamine 6-phosphate N-acetyltransferase"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P20339"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P20339"
		},
		mnemonic: {
			type: "number",
			value: 416
		},
		name: {
			type: "literal",
			value: "Ras-related protein Rab-5A"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P51149"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P51149"
		},
		mnemonic: {
			type: "number",
			value: 391
		},
		name: {
			type: "literal",
			value: "Ras-related protein Rab-7a"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9NP79"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9NP79"
		},
		mnemonic: {
			type: "number",
			value: 343
		},
		name: {
			type: "literal",
			value: "Vacuolar protein sorting-associated protein VTA1 homolog"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q16620"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q16620"
		},
		mnemonic: {
			type: "number",
			value: 608
		},
		name: {
			type: "literal",
			value: "BDNF/NT-3 growth factors receptor"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q96FZ7"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q96FZ7"
		},
		mnemonic: {
			type: "number",
			value: 320
		},
		name: {
			type: "literal",
			value: "Charged multivesicular body protein 6"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9NZZ3"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9NZZ3"
		},
		mnemonic: {
			type: "number",
			value: 611
		},
		name: {
			type: "literal",
			value: "Charged multivesicular body protein 5"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P51795"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P51795"
		},
		mnemonic: {
			type: "number",
			value: 24
		},
		name: {
			type: "literal",
			value: "H(+)/Cl(-) exchange transporter 5"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P51797"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P51797"
		},
		mnemonic: {
			type: "number",
			value: 706
		},
		name: {
			type: "literal",
			value: "Chloride transport protein 6"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P04440"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P04440"
		},
		mnemonic: {
			type: "number",
			value: 478
		},
		name: {
			type: "literal",
			value: "HLA class II histocompatibility antigen, DP beta 1 chain"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P20036"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P20036"
		},
		mnemonic: {
			type: "number",
			value: 433
		},
		name: {
			type: "literal",
			value: "HLA class II histocompatibility antigen, DP alpha 1 chain"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9UBB6"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9UBB6"
		},
		mnemonic: {
			type: "number",
			value: 277
		},
		name: {
			type: "literal",
			value: "Neurochondrin"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P61026"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P61026"
		},
		mnemonic: {
			type: "number",
			value: 609
		},
		name: {
			type: "literal",
			value: "Ras-related protein Rab-10"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q86WG5"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q86WG5"
		},
		mnemonic: {
			type: "number",
			value: 682
		},
		name: {
			type: "literal",
			value: "Myotubularin-related protein 13"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q6UXF1"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q6UXF1"
		},
		mnemonic: {
			type: "number",
			value: 503
		},
		name: {
			type: "literal",
			value: "Transmembrane protein 108"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9Y2I7"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9Y2I7"
		},
		mnemonic: {
			type: "number",
			value: 505
		},
		name: {
			type: "literal",
			value: "1-phosphatidylinositol 3-phosphate 5-kinase"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q8IZ08"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q8IZ08"
		},
		mnemonic: {
			type: "number",
			value: 55
		},
		name: {
			type: "literal",
			value: "G-protein coupled receptor 135"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P11279"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P11279"
		},
		mnemonic: {
			type: "number",
			value: 179
		},
		name: {
			type: "literal",
			value: "Lysosome-associated membrane glycoprotein 1"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q8IY34"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q8IY34"
		},
		mnemonic: {
			type: "number",
			value: 18
		},
		name: {
			type: "literal",
			value: "Solute carrier family 15 member 3"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "O15440"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/O15440"
		},
		mnemonic: {
			type: "number",
			value: 370
		},
		name: {
			type: "literal",
			value: "Multidrug resistance-associated protein 5"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P49281"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P49281"
		},
		mnemonic: {
			type: "number",
			value: 198
		},
		name: {
			type: "literal",
			value: "Natural resistance-associated macrophage protein 2"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9UJY4"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9UJY4"
		},
		mnemonic: {
			type: "number",
			value: 162
		},
		name: {
			type: "literal",
			value: "ADP-ribosylation factor-binding protein GGA2"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9UJY5"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9UJY5"
		},
		mnemonic: {
			type: "number",
			value: 373
		},
		name: {
			type: "literal",
			value: "ADP-ribosylation factor-binding protein GGA1"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9Y328"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9Y328"
		},
		mnemonic: {
			type: "number",
			value: 295
		},
		name: {
			type: "literal",
			value: "Neuronal vesicle trafficking-associated protein 2"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q92673"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q92673"
		},
		mnemonic: {
			type: "number",
			value: 716
		},
		name: {
			type: "literal",
			value: "Sortilin-related receptor"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9Y287"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9Y287"
		},
		mnemonic: {
			type: "number",
			value: 77
		},
		name: {
			type: "literal",
			value: "Integral membrane protein 2B"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9BXJ7"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9BXJ7"
		},
		mnemonic: {
			type: "number",
			value: 292
		},
		name: {
			type: "literal",
			value: "Protein amnionless"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9P2R3"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9P2R3"
		},
		mnemonic: {
			type: "number",
			value: 195
		},
		name: {
			type: "literal",
			value: "Rabankyrin-5"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P62330"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P62330"
		},
		mnemonic: {
			type: "number",
			value: 552
		},
		name: {
			type: "literal",
			value: "ADP-ribosylation factor 6"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q86VI4"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q86VI4"
		},
		mnemonic: {
			type: "number",
			value: 657
		},
		name: {
			type: "literal",
			value: "Lysosomal-associated transmembrane protein 4B"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q2KHT3"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q2KHT3"
		},
		mnemonic: {
			type: "number",
			value: 574
		},
		name: {
			type: "literal",
			value: "Protein CLEC16A"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q15057"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q15057"
		},
		mnemonic: {
			type: "number",
			value: 684
		},
		name: {
			type: "literal",
			value: "Arf-GAP with coiled-coil, ANK repeat and PH domain-containing protein 2"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9UL26"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9UL26"
		},
		mnemonic: {
			type: "number",
			value: 701
		},
		name: {
			type: "literal",
			value: "Ras-related protein Rab-22A"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q13596"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q13596"
		},
		mnemonic: {
			type: "number",
			value: 429
		},
		name: {
			type: "literal",
			value: "Sorting nexin-1"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9NZD8"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9NZD8"
		},
		mnemonic: {
			type: "number",
			value: 759
		},
		name: {
			type: "literal",
			value: "Maspardin"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P34810"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P34810"
		},
		mnemonic: {
			type: "number",
			value: 310
		},
		name: {
			type: "literal",
			value: "Macrosialin"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q99523"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q99523"
		},
		mnemonic: {
			type: "number",
			value: 222
		},
		name: {
			type: "literal",
			value: "Sortilin"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q96H20"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q96H20"
		},
		mnemonic: {
			type: "number",
			value: 768
		},
		name: {
			type: "literal",
			value: "Vacuolar-sorting protein SNF8"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9BZJ8"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9BZJ8"
		},
		mnemonic: {
			type: "number",
			value: 7
		},
		name: {
			type: "literal",
			value: "G-protein coupled receptor 61"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9NZ52"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9NZ52"
		},
		mnemonic: {
			type: "number",
			value: 780
		},
		name: {
			type: "literal",
			value: "ADP-ribosylation factor-binding protein GGA3"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q9Y5X0"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q9Y5X0"
		},
		mnemonic: {
			type: "number",
			value: 508
		},
		name: {
			type: "literal",
			value: "Sorting nexin-10"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P00533"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P00533"
		},
		mnemonic: {
			type: "number",
			value: 292
		},
		name: {
			type: "literal",
			value: "Epidermal growth factor receptor"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "P40818"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/P40818"
		},
		mnemonic: {
			type: "number",
			value: 718
		},
		name: {
			type: "literal",
			value: "Ubiquitin carboxyl-terminal hydrolase 8"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q8N1B4"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q8N1B4"
		},
		mnemonic: {
			type: "number",
			value: 680
		},
		name: {
			type: "literal",
			value: "Vacuolar protein sorting-associated protein 52 homolog"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q96GS6"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q96GS6"
		},
		mnemonic: {
			type: "number",
			value: 400
		},
		name: {
			type: "literal",
			value: "Alpha/beta hydrolase domain-containing protein 17A"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	},
	{
		id: {
			type: "literal",
			value: "Q96J02"
		},
		uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/uniprot/Q96J02"
		},
		mnemonic: {
			type: "number",
			value: 116
		},
		name: {
			type: "literal",
			value: "E3 ubiquitin-protein ligase Itchy homolog"
		},
		location_name: {
			type: "literal",
			value: "Endosome membrane"
		},
		location_uniprot: {
			type: "uri",
			value: "http://purl.uniprot.org/locations/100"
		}
	}
];
var data = {
	head: head,
	body: body
};

var script = defineComponent({
  components: {
    Slider: h,
  },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  setup(params) {
    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      query: "",
      queryByColumn: {
        column: null,
        type: null,
        query: "",
      },
      columnShowingFilters: null,
      columnShowingTextSearch: null,

      sorting: {
        active: null,
        direction: "desc",
      },

      pagination: {
        currentPage: 1,
        perPage: params.limit,
      },

      queryInput: "",
      queryInputByColumn: "",
      jumpToNumberInput: "",

      rangeInputs: {},

      knobDrag: false,
      knobX: 0,
      startX: 0,
      knob: false,
      canvas: false,
      sliderBarWidth: 0,
    });

    const filteredRows = computed(() => {
      const query = state.query;
      const queryByColumn = state.queryByColumn.query;
      const filtered = state.allRows
        .filter((row) => {
          return query ? row.some((cell) => String(cell.value).includes(query)) : true;
        })
        .filter((row) => {
          return queryByColumn
            ? row.some(
                (cell) =>
                  cell.column.label === state.queryByColumn.column &&
                  cell.value.includes(queryByColumn)
              )
            : true;
        })
        .filter((row) => {
          return Object.keys(state.rangeInputs).length !== 0
            ? row.some((cell) => {
                return (
                  cell.column.type === "number" &&
                  cell.value >= state.rangeInputs[cell.column.id].value[0] &&
                  cell.value <= state.rangeInputs[cell.column.id].value[1]
                );
              })
            : true;
        })
        .filter((row) => {
          return row.every((cell) => {
            const valuesForFilter = cell.column.filters
              .filter(({ checked }) => checked)
              .map(({ value }) => value);
            return valuesForFilter.length === 0
              ? false
              : valuesForFilter.includes(cell.value);
          });
        });

      const sortColumn = state.sorting.column;

      if (sortColumn) {
        return lodash_orderby(
          filtered,
          (cells) => {
            const cell = cells.find((cell) => cell.column === sortColumn);

            return cell.value;
          },
          [state.sorting.direction]
        );
      } else {
        return filtered;
      }
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredRows.value.length / state.pagination.perPage);
    });

    const rowsInCurrentPage = computed(() => {
      const startIndex =
        (state.pagination.currentPage - 1) * state.pagination.perPage;
      const endIndex = Number(startIndex) + Number(state.pagination.perPage);
      return filteredRows.value.slice(startIndex, endIndex);
    });

    const surroundingPages = computed(() => {
      const currentPage = state.pagination.currentPage;

      let start, end;

      if (currentPage <= 3) {
        start = 1;
        end = Math.min(start + 4, totalPages.value);
      } else if (totalPages.value - currentPage <= 3) {
        end = totalPages.value;
        start = Math.max(end - 4, 1);
      } else {
        start = Math.max(currentPage - 2, 1);
        end = Math.min(currentPage + 2, totalPages.value);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    const blobUrl = computed(() => {
      const json = state.responseJSON;

      if (!json) {
        return null;
      }

      const blob = new Blob([JSON.stringify(json, null, "  ")], {
        type: "application/json",
      });

      return URL.createObjectURL(blob);
    });

    function setSorting(column) {
      state.sorting.column = column;
      state.sorting.direction =
        state.sorting.direction === "asc" ? "desc" : "asc";
    }

    function setFilters(column, checked) {
      for (const filter of column.filters) {
        filter.checked = checked;
      }
    }

    function jumpToPage(num) {
      state.pagination.currentPage = num ? num : 1;
    }

    function submitQuery(column, type, query) {
      state.queryByColumn.column = column;
      state.queryByColumn.type = type;
      state.queryByColumn.query = query;
    }

    function closeModal() {
      state.columnShowingFilters = null;
      state.columnShowingTextSearch = null;
    }

    const pageSliderWrapper = ref(null);
    const pageSlider = {
      init: () => {
        let wrapper = pageSliderWrapper.value;
        if (!params.page_slider) wrapper.style.display = "none";
        wrapper.onmousemove = pageSlider.move;
        wrapper.onmouseup = pageSlider.up;
        state.knob = wrapper.getElementsByClassName("pageSliderKnob")[0];
        state.canvas = wrapper.getElementsByTagName("canvas")[0];
        let bar = wrapper.getElementsByClassName("pageSliderBar")[0];
        state.sliderBarWidth = bar.offsetWidth;
        pageSlider.setPage(state.knobX, state.pagination.currentPage);
      },
      down: (e) => {
        state.knobDrag = true;
        state.startX = e.pageX;
      },
      move: (e) => {
        if (state.knobDrag) {
          let dragX = state.knobX + e.pageX - state.startX;
          if (dragX < 0) {
            dragX = 0;
          }
          if (dragX > state.sliderBarWidth) {
            dragX = state.sliderBarWidth;
          }
          let page = Math.ceil((totalPages.value * dragX) / state.sliderBarWidth);
          if (page < 1) {
            page = 1;
          }
          pageSlider.setPage(dragX, page);
        }
      },
      up: (e) => {
        if (state.knobDrag) {
          state.knobX += e.pageX - state.startX;
          state.pagination.currentPage = parseInt(state.knob.innerHTML);
          state.knobDrag = false;
        }
      },
      click: () => {
        state.knobX = state.sliderBarWidth / (totalPages.value - 1) * (state.pagination.currentPage - 1);
        pageSlider.setPage(state.knobX, state.pagination.currentPage);
      },
      setPage: (knobX, page) => {
        state.knob.innerHTML = page;
        state.knob.parentNode.style.transform = "translateX(" + knobX + "px)";
        state.canvas.setAttribute("width", state.sliderBarWidth);
        state.canvas.setAttribute("height", 50);
        let pageButton = state.canvas.parentNode.parentNode
            .getElementsByClassName("paginationWrapper")[0].getElementsByTagName("ul")[0];
        if (state.canvas.getContext) {
          const ctx = state.canvas.getContext("2d");
          ctx.clearRect(0, 0, state.canvas.offsetWidth, state.canvas.offsetHeight);
          ctx.beginPath();
          ctx.moveTo(knobX + state.knob.offsetWidth/2 - 8, 50);
          ctx.lineTo(knobX - state.knob.offsetWidth/2 + 8, 50);
          ctx.lineTo(pageButton.offsetLeft - pageButton.parentNode.offsetLeft - 10, 0);
          ctx.lineTo(pageButton.offsetLeft - pageButton.parentNode.offsetLeft + pageButton.offsetWidth - 10, 0);
          ctx.closePath();
          ctx.fillStyle = "#dddddd";
          ctx.fill();
        }
      }
    };

    async function fetchData() {
      // const res = await fetch(params.table_data_api);
      // const data = await res.json();

      state.responseJSON = data;

      const { vars, labels, order, href } = data.head;

      const columns = lodash_zip(vars, labels, order, href)
        .map(([_var, label, _order, _href]) => {
          const values = data.body.map((row) => row[_var].value);
          const datam = data.body[0];
          if (datam[_var].type === "number") {
            state.rangeInputs[_var] = { value: [0, 0], min: 0, max: 0 };
          }
          return {
            id: _var,
            label,
            order: _order,
            href: _href,
            type: datam[_var].type,

            filters: lodash_uniq(values).map((value) => {
              return {
                value,
                checked: true,
              };
            }),
          };
        })
        .filter((column) => column.label !== null);

      state.columns = lodash_orderby(columns, ["order"]);
      state.allRows = data.body.map((row) => {
        return columns.map((column) => {
          if (column.type === "number") {
            if (row[column.id].value < state.rangeInputs[column.id].min) {
              state.rangeInputs[column.id].min = row[column.id].value;
            } else if (
              row[column.id].value > state.rangeInputs[column.id].max
            ) {
              state.rangeInputs[column.id].max = row[column.id].value;
              state.rangeInputs[column.id].value[1] = row[column.id].value;
            }
          }
          return {
            column,
            value: row[column.id].value,
            href: column.href ? row[column.href].value : null,
          };
        });
      });
    }

    onMounted(fetchData);
    onUpdated(pageSlider.init);

    return {
      state,
      totalPages,
      rowsInCurrentPage,
      surroundingPages,
      blobUrl,
      setSorting,
      setFilters,
      jumpToPage,
      submitQuery,
      closeModal,
      pageSliderWrapper,
      pageSlider,
    };
  },
});

const _hoisted_1 = { class: "tableOption" };
const _hoisted_2 = /*#__PURE__*/createVNode("button", {
  class: "searchBtn",
  type: "submit"
}, [
  /*#__PURE__*/createVNode("img", {
    src: "https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-search.svg",
    alt: "search"
  })
], -1 /* HOISTED */);
const _hoisted_3 = {
  key: 0,
  class: "textSearchByColumnWrapper modal"
};
const _hoisted_4 = { class: "title" };
const _hoisted_5 = /*#__PURE__*/createVNode("button", {
  class: "searchBtn",
  type: "submit"
}, [
  /*#__PURE__*/createVNode("img", {
    src: "https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-search.svg",
    alt: "search"
  })
], -1 /* HOISTED */);
const _hoisted_6 = { key: 1 };
const _hoisted_7 = /*#__PURE__*/createVNode("img", {
  src: "https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-download.svg",
  alt: "download"
}, null, -1 /* HOISTED */);
const _hoisted_8 = { key: 0 };
const _hoisted_9 = {
  key: 0,
  class: "filterWrapper"
};
const _hoisted_10 = { class: "filterWindowTitle" };
const _hoisted_11 = { class: "toggleAllButton" };
const _hoisted_12 = { key: 0 };
const _hoisted_13 = { key: 1 };
const _hoisted_14 = { class: "paginationWrapper" };
const _hoisted_15 = { class: "pageNumber" };
const _hoisted_16 = /*#__PURE__*/createTextVNode(" Page ");
const _hoisted_17 = {
  class: "pageSliderWrapper",
  ref: "pageSliderWrapper"
};
const _hoisted_18 = /*#__PURE__*/createVNode("canvas", {
  class: "pageSliderRange",
  height: "50"
}, null, -1 /* HOISTED */);
const _hoisted_19 = { class: "pageSlider" };
const _hoisted_20 = /*#__PURE__*/createVNode("div", { class: "pageSliderBar" }, null, -1 /* HOISTED */);
const _hoisted_21 = /*#__PURE__*/createVNode("li", { class: "pageSliderKnob" }, "1", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Slider = resolveComponent("Slider");

  return (openBlock(), createBlock(Fragment, null, [
    createVNode("div", _hoisted_1, [
      createVNode("form", {
        class: "textSearchWrapper",
        onSubmit: _cache[2] || (_cache[2] = withModifiers($event => (_ctx.state.query = _ctx.state.queryInput), ["prevent"]))
      }, [
        withDirectives(createVNode("input", {
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (_ctx.state.queryInput = $event)),
          type: "text",
          placeholder: "Search for keywords..."
        }, null, 512 /* NEED_PATCH */), [
          [vModelText, _ctx.state.queryInput]
        ]),
        _hoisted_2
      ], 32 /* HYDRATE_EVENTS */),
      createVNode(Transition, { name: "modal" }, {
        default: withCtx(() => [
          (_ctx.state.columnShowingTextSearch !== null)
            ? (openBlock(), createBlock("div", _hoisted_3, [
                createVNode("p", _hoisted_4, " Search for \"" + toDisplayString(_ctx.state.columnShowingTextSearch.label) + "\" ", 1 /* TEXT */),
                (_ctx.state.columnShowingTextSearch.type === 'literal')
                  ? (openBlock(), createBlock("form", {
                      key: 0,
                      class: "textSearchWrapper",
                      onSubmit: _cache[4] || (_cache[4] = withModifiers($event => (
            _ctx.submitQuery(
              _ctx.state.columnShowingTextSearch.label,
              _ctx.state.columnShowingTextSearch.type,
              _ctx.state.queryInputByColumn
            )
          ), ["prevent"]))
                    }, [
                      withDirectives(createVNode("input", {
                        id: "queryInputByColumn",
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => (_ctx.state.queryInputByColumn = $event)),
                        type: "text",
                        placeholder: "Search for keywords...",
                        name: "queryInputByColumn"
                      }, null, 512 /* NEED_PATCH */), [
                        [vModelText, _ctx.state.queryInputByColumn]
                      ]),
                      _hoisted_5
                    ], 32 /* HYDRATE_EVENTS */))
                  : createCommentVNode("v-if", true),
                (_ctx.state.columnShowingTextSearch.type === 'number')
                  ? (openBlock(), createBlock("div", _hoisted_6, [
                      createVNode(_component_Slider, mergeProps({
                        modelValue: _ctx.state.rangeInputs[_ctx.state.columnShowingTextSearch.id].value,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => (_ctx.state.rangeInputs[_ctx.state.columnShowingTextSearch.id].value = $event))
                      }, _ctx.state.rangeInputs[_ctx.state.columnShowingTextSearch.id]), null, 16 /* FULL_PROPS */, ["modelValue"])
                    ]))
                  : createCommentVNode("v-if", true)
              ]))
            : createCommentVNode("v-if", true)
        ]),
        _: 1 /* STABLE */
      }),
      createVNode("a", {
        class: "downloadBtn",
        href: _ctx.blobUrl,
        download: "tableData"
      }, [
        _hoisted_7
      ], 8 /* PROPS */, ["href"])
    ]),
    (_ctx.state.allRows)
      ? (openBlock(), createBlock("table", _hoisted_8, [
          createVNode("thead", null, [
            createVNode("tr", null, [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.state.columns, (column, i) => {
                return (openBlock(), createBlock("th", {
                  key: column.id
                }, [
                  createTextVNode(toDisplayString(column.label) + " ", 1 /* TEXT */),
                  createVNode("span", {
                    class: [
              'icon',
              'sortIcon',
              _ctx.state.sorting.column === column ? _ctx.state.sorting.direction : '',
            ],
                    onClick: $event => (_ctx.setSorting(column))
                  }, null, 10 /* CLASS, PROPS */, ["onClick"]),
                  createVNode("span", {
                    class: [
              'icon',
              'filterIcon',
              { active: column === _ctx.state.columnShowingFilters },
            ],
                    onClick: $event => (_ctx.state.columnShowingFilters = column)
                  }, null, 10 /* CLASS, PROPS */, ["onClick"]),
                  createVNode("span", {
                    class: "icon searchIcon",
                    onClick: $event => (_ctx.state.columnShowingTextSearch = column)
                  }, null, 8 /* PROPS */, ["onClick"]),
                  (column === _ctx.state.columnShowingFilters)
                    ? (openBlock(), createBlock("div", _hoisted_9, [
                        createVNode("div", {
                          class: [
                'filterWindow',
                { lastCol: _ctx.state.columns.length - 1 === i },
              ]
                        }, [
                          createVNode("p", _hoisted_10, toDisplayString(column.label), 1 /* TEXT */),
                          createVNode("ul", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList(column.filters, (filter) => {
                              return (openBlock(), createBlock("li", {
                                key: filter.value
                              }, [
                                withDirectives(createVNode("input", {
                                  id: filter.value,
                                  "onUpdate:modelValue": $event => (filter.checked = $event),
                                  type: "checkbox",
                                  name: "items"
                                }, null, 8 /* PROPS */, ["id", "onUpdate:modelValue"]), [
                                  [vModelCheckbox, filter.checked]
                                ]),
                                createVNode("label", {
                                  for: filter.id
                                }, toDisplayString(filter.value), 9 /* TEXT, PROPS */, ["for"])
                              ]))
                            }), 128 /* KEYED_FRAGMENT */))
                          ]),
                          createVNode("div", _hoisted_11, [
                            createVNode("button", {
                              onClick: $event => (_ctx.setFilters(column, true))
                            }, "Select All", 8 /* PROPS */, ["onClick"]),
                            createVNode("button", {
                              onClick: $event => (_ctx.setFilters(column, false))
                            }, "Clear", 8 /* PROPS */, ["onClick"])
                          ])
                        ], 2 /* CLASS */)
                      ]))
                    : createCommentVNode("v-if", true)
                ]))
              }), 128 /* KEYED_FRAGMENT */))
            ])
          ]),
          createVNode("tbody", null, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.rowsInCurrentPage, (row) => {
              return (openBlock(), createBlock("tr", {
                key: row.id
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(row, (cell) => {
                  return (openBlock(), createBlock("td", {
                    key: cell.column.id
                  }, [
                    (cell.href)
                      ? (openBlock(), createBlock("span", _hoisted_12, [
                          createVNode("a", {
                            href: cell.href,
                            target: "_blank"
                          }, toDisplayString(cell.value), 9 /* TEXT, PROPS */, ["href"])
                        ]))
                      : (openBlock(), createBlock("span", _hoisted_13, toDisplayString(cell.value), 1 /* TEXT */))
                  ]))
                }), 128 /* KEYED_FRAGMENT */))
              ]))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ]))
      : createCommentVNode("v-if", true),
    createVNode("div", _hoisted_14, [
      (_ctx.state.pagination.currentPage !== 1)
        ? (openBlock(), createBlock(Fragment, { key: 0 }, [
            createVNode("span", {
              class: "arrow double left",
              onClick: _cache[6] || (_cache[6] = $event => {_ctx.state.pagination.currentPage = 1; _ctx.pageSlider.click();})
            }),
            createVNode("span", {
              class: "arrow left",
              onClick: _cache[7] || (_cache[7] = $event => {_ctx.state.pagination.currentPage--; _ctx.pageSlider.click();})
            })
          ], 64 /* STABLE_FRAGMENT */))
        : createCommentVNode("v-if", true),
      createVNode("ul", null, [
        (openBlock(true), createBlock(Fragment, null, renderList(_ctx.surroundingPages, (page) => {
          return (openBlock(), createBlock("li", {
            key: page,
            class: [
          'pagination',
          { currentBtn: _ctx.state.pagination.currentPage === page },
        ],
            onClick: $event => {_ctx.state.pagination.currentPage = page; _ctx.pageSlider.click();}
          }, toDisplayString(page), 11 /* TEXT, CLASS, PROPS */, ["onClick"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      (_ctx.state.pagination.currentPage !== _ctx.totalPages)
        ? (openBlock(), createBlock(Fragment, { key: 1 }, [
            createVNode("span", {
              class: "arrow right",
              onClick: _cache[8] || (_cache[8] = $event => {_ctx.state.pagination.currentPage++; _ctx.pageSlider.click();})
            }),
            createVNode("span", {
              class: "arrow double right",
              onClick: _cache[9] || (_cache[9] = $event => {_ctx.state.pagination.currentPage = _ctx.totalPages; _ctx.pageSlider.click();})
            })
          ], 64 /* STABLE_FRAGMENT */))
        : createCommentVNode("v-if", true),
      createVNode("div", _hoisted_15, [
        _hoisted_16,
        withDirectives(createVNode("input", {
          "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => (_ctx.state.jumpToNumberInput = $event)),
          type: "text",
          onKeydown: _cache[11] || (_cache[11] = withKeys($event => (_ctx.jumpToPage(_ctx.state.jumpToNumberInput)), ["enter"]))
        }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */), [
          [
            vModelText,
            _ctx.state.jumpToNumberInput,
            void 0,
            { number: true }
          ]
        ]),
        createTextVNode(" of " + toDisplayString(_ctx.totalPages), 1 /* TEXT */)
      ])
    ]),
    createVNode("div", _hoisted_17, [
      _hoisted_18,
      createVNode("div", _hoisted_19, [
        _hoisted_20,
        createVNode("ul", {
          onMousedown: _cache[12] || (_cache[12] = (...args) => (_ctx.pageSlider.down && _ctx.pageSlider.down(...args)))
        }, [
          _hoisted_21
        ], 32 /* HYDRATE_EVENTS */)
      ])
    ], 512 /* NEED_PATCH */),
    (_ctx.state.columnShowingFilters || _ctx.state.columnShowingTextSearch)
      ? (openBlock(), createBlock("div", {
          key: 1,
          class: ['modalBackground', { black: _ctx.state.columnShowingTextSearch }],
          onClick: _cache[13] || (_cache[13] = $event => (_ctx.closeModal()))
        }, null, 2 /* CLASS */))
      : createCommentVNode("v-if", true)
  ], 64 /* STABLE_FRAGMENT */))
}

script.render = render;
script.__file = "stanzas/table-with-pagination/app.vue";

async function tableWithPagination(stanza, params) {
  const main = stanza.root.querySelector("main");
  createApp(script, params).mount(main);
}

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<style>\n  table {\n      width: 100%;\n  }\n</style>\n\n<div class=\"container\">\n  <div class=\"infomation\">\n    <div class=\"text-search-wrapper\">\n      <input\n        type=\"text\"\n        id=\"search-input\"\n        placeholder=\"Search for keywords...\"\n      />\n      <button id=\"search-btn\" type=\"submit\">\n        <img\n          src=\"https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-search.svg\"\n          alt=\"search\"\n        />\n        <span class=\"search-text\">\n          Search\n        </span>\n      </button>\n    </div>\n    <a id=\"download-btn\" download=\"table-data\">\n      <img\n        src=\"https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-download.svg\"\n        alt=\"download\"\n      />\n    </a>\n  </div>\n  <p class=\"table-title\">\n    Title of this Table\n  </p>\n  <div id=\"renderDiv\"></div>\n\n  <div id=\"pagination\">\n    <ul>\n      <li class=\"first-btn back-btn arrow-btn\">\n        <span></span>\n        <span></span>\n      </li>\n      <li class=\"previous-btn back-btn arrow-btn\">\n        <span></span>\n      </li>\n      <li class=\"current-btn\">\n        1\n      </li>\n      <li>\n        2\n      </li>\n      <li>\n        3\n      </li>\n      <li>\n        4\n      </li>\n      <li>\n        …\n      </li>\n      <li>\n        10\n      </li>\n      <li class=\"next-btn advance-btn arrow-btn\">\n        <span></span>\n      </li>\n      <li class=\"last-btn advance-btn arrow-btn\">\n        <span></span>\n        <span></span>\n      </li>\n    </ul>\n  </div>\n  <p class=\"show-info\">\n    Showing 1 to 10 of 44 entres\n  </p>\n</div>";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\n/* Functional styling;\n* These styles are required for noUiSlider to function.\n* You don't need to change these rules to apply your design.\n*/\n.slider-target,\n.slider-target * {\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -webkit-user-select: none;\n  -ms-touch-action: none;\n  touch-action: none;\n  -ms-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.slider-target {\n  position: relative;\n}\n\n.slider-base,\n.slider-connects {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  z-index: 1;\n}\n\n/* Wrapper for all connect elements.\n*/\n.slider-connects {\n  overflow: hidden;\n  z-index: 0;\n}\n\n.slider-connect,\n.slider-origin {\n  will-change: transform;\n  position: absolute;\n  z-index: 1;\n  top: 0;\n  right: 0;\n  -ms-transform-origin: 0 0;\n  -webkit-transform-origin: 0 0;\n  -webkit-transform-style: preserve-3d;\n  transform-origin: 0 0;\n  transform-style: flat;\n}\n\n.slider-connect {\n  height: 100%;\n  width: 100%;\n}\n\n.slider-origin {\n  height: 10%;\n  width: 10%;\n}\n\n/* Offset direction\n*/\n.slider-txt-dir-rtl.slider-horizontal .slider-origin {\n  left: 0;\n  right: auto;\n}\n\n/* Give origins 0 height/width so they don't interfere with clicking the\n* connect elements.\n*/\n.slider-vertical .slider-origin {\n  width: 0;\n}\n\n.slider-horizontal .slider-origin {\n  height: 0;\n}\n\n.slider-handle {\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  position: absolute;\n}\n\n.slider-touch-area {\n  height: 100%;\n  width: 100%;\n}\n\n.slider-state-tap .slider-connect,\n.slider-state-tap .slider-origin {\n  -webkit-transition: transform 0.3s;\n  transition: transform 0.3s;\n}\n\n.slider-state-drag * {\n  cursor: inherit !important;\n}\n\n/* Slider size and handle placement;\n*/\n.slider-horizontal {\n  height: 6px;\n}\n\n.slider-horizontal .slider-handle {\n  width: 16px;\n  height: 16px;\n  top: -6px;\n  right: -8px;\n}\n\n.slider-vertical {\n  width: 6px;\n  height: 300px;\n}\n\n.slider-vertical .slider-handle {\n  width: 16px;\n  height: 16px;\n  top: -8px;\n  right: -6px;\n}\n\n.slider-txt-dir-rtl.slider-horizontal .slider-handle {\n  left: -8px;\n  right: auto;\n}\n\n/* Styling;\n* Giving the connect element a border radius causes issues with using transform: scale\n*/\n.slider-base {\n  background-color: #d4e0e7;\n  border-radius: 3px;\n}\n\n.slider-connects {\n  border-radius: 3px;\n}\n\n.slider-connect {\n  background: #41b883;\n  cursor: pointer;\n}\n\n/* Handles and cursors;\n*/\n.slider-draggable {\n  cursor: ew-resize;\n}\n\n.slider-vertical .slider-draggable {\n  cursor: ns-resize;\n}\n\n.slider-handle {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  border: 0;\n  right: -8px;\n  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);\n  cursor: grab;\n}\n.slider-handle:focus {\n  outline: none;\n}\n\n.slider-active {\n  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.42);\n  cursor: grabbing;\n}\n\n/* Disabled state;\n*/\n[disabled] .slider-connect {\n  background: #B8B8B8;\n}\n\n[disabled].slider-target,\n[disabled].slider-handle,\n[disabled] .slider-handle {\n  cursor: not-allowed;\n}\n\n[disabled] .slider-tooltip {\n  background: #B8B8B8;\n  border-color: #B8B8B8;\n}\n\n.slider-tooltip {\n  position: absolute;\n  display: block;\n  font-size: 14px;\n  font-weight: 500;\n  white-space: nowrap;\n  padding: 2px 5px;\n  min-width: 20px;\n  text-align: center;\n  color: #fff;\n  border-radius: 5px;\n  border: 1px solid #41b883;\n  background: #41b883;\n}\n\n.slider-horizontal .slider-tooltip {\n  -webkit-transform: translate(-50%, 0);\n  transform: translate(-50%, 0);\n  left: 50%;\n  bottom: 24px;\n}\n.slider-horizontal .slider-tooltip:before {\n  content: \"\";\n  position: absolute;\n  bottom: -10px;\n  left: 50%;\n  width: 0;\n  height: 0;\n  border: 5px solid transparent;\n  border-top-color: inherit;\n  transform: translate(-50%);\n}\n\n.slider-vertical .slider-tooltip {\n  -webkit-transform: translate(0, -50%);\n  transform: translate(0, -50%);\n  top: 50%;\n  right: 24px;\n}\n.slider-vertical .slider-tooltip:before {\n  content: \"\";\n  position: absolute;\n  right: -10px;\n  top: 50%;\n  width: 0;\n  height: 0;\n  border: 5px solid transparent;\n  border-left-color: inherit;\n  transform: translateY(-50%);\n}\n\n.slider-horizontal .slider-origin > .slider-tooltip {\n  -webkit-transform: translate(50%, 0);\n  transform: translate(50%, 0);\n  left: auto;\n  bottom: 14px;\n}\n\n.slider-vertical .slider-origin > .slider-tooltip {\n  -webkit-transform: translate(0, -18px);\n  transform: translate(0, -18px);\n  top: auto;\n  right: 18px;\n}\n\n/* Base;\n*\n*/\n.slider-pips,\n.slider-pips * {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.slider-pips {\n  position: absolute;\n  color: #999;\n}\n\n/* Values;\n*\n*/\n.slider-value {\n  position: absolute;\n  white-space: nowrap;\n  text-align: center;\n}\n\n.slider-value-sub {\n  color: #ccc;\n  font-size: 10px;\n}\n\n/* Markings;\n*\n*/\n.slider-marker {\n  position: absolute;\n  background: #CCC;\n}\n\n.slider-marker-sub {\n  background: #AAA;\n}\n\n.slider-marker-large {\n  background: #AAA;\n}\n\n/* Horizontal layout;\n*\n*/\n.slider-pips-horizontal {\n  padding: 10px 0;\n  height: 80px;\n  top: 100%;\n  left: 0;\n  width: 100%;\n}\n\n.slider-value-horizontal {\n  -webkit-transform: translate(-50%, 50%);\n  transform: translate(-50%, 50%);\n}\n.slider-rtl .slider-value-horizontal {\n  -webkit-transform: translate(50%, 50%);\n  transform: translate(50%, 50%);\n}\n\n.slider-marker-horizontal.slider-marker {\n  margin-left: -1px;\n  width: 2px;\n  height: 5px;\n}\n\n.slider-marker-horizontal.slider-marker-sub {\n  height: 10px;\n}\n\n.slider-marker-horizontal.slider-marker-large {\n  height: 15px;\n}\n\n/* Vertical layout;\n*\n*/\n.slider-pips-vertical {\n  padding: 0 10px;\n  height: 100%;\n  top: 0;\n  left: 100%;\n}\n\n.slider-value-vertical {\n  -webkit-transform: translate(0, -50%);\n  transform: translate(0, -50%);\n  padding-left: 25px;\n}\n.slider-rtl .slider-value-vertical {\n  -webkit-transform: translate(0, 50%);\n  transform: translate(0, 50%);\n}\n\n.slider-marker-vertical.slider-marker {\n  width: 5px;\n  height: 2px;\n  margin-top: -1px;\n}\n\n.slider-marker-vertical.slider-marker-sub {\n  width: 10px;\n}\n\n.slider-marker-vertical.slider-marker-large {\n  width: 15px;\n}\n\nmain {\n  padding: 1rem 2rem;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  list-style: none;\n  color: var(--general-font-color);\n  font-family: var(--general-font-family);\n  font-size: var(--general-font-size);\n}\n\n#renderDiv {\n  width: 100%;\n}\n\n.container {\n  width: 100%;\n  max-width: 800px;\n}\n\n.tableOption {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n  margin: var(--information-margin);\n}\n.tableOption > .downloadBtn > img {\n  width: var(--dlbtn-img-width);\n  height: var(--dlbtn-img-height);\n}\n.tableOption .textSearchWrapper {\n  height: var(--searchbox-height);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.tableOption .textSearchWrapper > input[type=text] {\n  margin-right: 3px;\n  height: var(--searchbox-height);\n  width: var(--searchbox-width);\n  border: 1px solid var(--searchbox-border-color);\n  border-radius: var(--searchbox-radius);\n  font-size: var(--searchbox-font-size);\n  color: var(--searchbox-font-color);\n  background-color: var(--searchbox-background-color);\n}\n.tableOption .textSearchWrapper > input[type=text]::placeholder {\n  padding: 0px 0px 0px 4px;\n  color: var(--searchbox-font-color);\n}\n.tableOption .textSearchWrapper > .searchBtn {\n  border: 1px solid var(--searchbtn-border-color);\n  border-radius: var(--searchbtn-radius);\n  background-color: var(--searchbtn-color);\n  color: #ffffff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  white-space: nowrap;\n  margin-right: 2px;\n  height: var(--searchbtn-height);\n  width: var(--searchbtn-width);\n}\n.tableOption .textSearchWrapper > .searchBtn > img {\n  width: var(--searchbtn-img-width);\n  height: var(--searchbtn-img-height);\n  display: var(--searchimg-display);\n}\n.tableOption > .textSearchByColumnWrapper {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3;\n  background: #ffffff;\n  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);\n}\n.tableOption > .textSearchByColumnWrapper > p.title {\n  display: block;\n  padding: 6px 16px;\n  background-color: var(--thead-font-color);\n  color: #ffffff;\n}\n.tableOption > .textSearchByColumnWrapper > .textSearchWrapper {\n  padding: 26px 40px 26px 20px;\n}\n.tableOption > .textSearchByColumnWrapper > .textSearchWrapper > input {\n  margin-right: 4px;\n}\n.tableOption > .textSearchByColumnWrapper #slider {\n  margin: 60px 40px 30px;\n  width: 230px;\n}\n.tableOption > .textSearchByColumnWrapper #slider .slider-connect {\n  background-color: var(--thead-font-color);\n}\n.tableOption > .textSearchByColumnWrapper .slider-tooltip {\n  border: 1px solid var(--thead-font-color);\n  background: var(--thead-font-color);\n}\n\n.paginationWrapper {\n  padding: var(--pagination-padding);\n  display: flex;\n  justify-content: var(--pagination-placement);\n  align-items: center;\n}\n.paginationWrapper > ul {\n  display: flex;\n  padding: 0;\n}\n.paginationWrapper > ul > li {\n  color: var(--paginationbtn-font-color);\n  background-color: var(--paginationbtn-background-color);\n  border-right: var(--paginationbtn-border);\n  padding: var(--paginationbtn-padding);\n  font-size: var(--paginationbtn-font-size);\n  display: flex;\n  align-items: center;\n}\n.paginationWrapper > ul > li:hover {\n  cursor: pointer;\n  color: var(--currentbtn-font-color);\n  background-color: var(--currentbtn-background-color);\n}\n.paginationWrapper > ul > li:first-of-type {\n  border-top-left-radius: var(--paginationbtn-border-radius);\n  border-bottom-left-radius: var(--paginationbtn-border-radius);\n}\n.paginationWrapper > ul > li:last-of-type {\n  border-top-right-radius: var(--paginationbtn-border-radius);\n  border-bottom-right-radius: var(--paginationbtn-border-radius);\n  border-right: none;\n}\n.paginationWrapper > ul > li.currentBtn {\n  color: var(--currentbtn-font-color);\n  background-color: var(--currentbtn-background-color);\n}\n.paginationWrapper > .arrow {\n  display: inline-block;\n  width: 7px;\n  height: 7px;\n  border: 1px solid;\n  border-color: transparent transparent var(--arrowbtn-color) var(--arrowbtn-color);\n  transform: rotate(45deg);\n  margin: 0 2px 0 6px;\n}\n.paginationWrapper > .arrow.right {\n  transform: rotate(-135deg);\n  margin: 0 6px 0 2px;\n}\n.paginationWrapper > .arrow.double {\n  position: relative;\n}\n.paginationWrapper > .arrow.double:after {\n  content: \"\";\n  display: inline-block;\n  width: 7px;\n  height: 7px;\n  border: 1px solid;\n  border-color: transparent transparent var(--arrowbtn-color) var(--arrowbtn-color);\n  transform: rotate(0deg);\n  top: 30%;\n  left: -80%;\n  position: absolute;\n  box-sizing: border-box;\n}\n.paginationWrapper > .arrow.double.right:after {\n  transform: rotate(0deg);\n}\n.paginationWrapper > .arrow:hover {\n  cursor: pointer;\n}\n.paginationWrapper > .pageNumber {\n  margin-left: 20px;\n}\n.paginationWrapper > .pageNumber > input[type=text] {\n  width: 40px;\n  height: var(--searchbox-height);\n  border: 1px solid var(--searchbox-border-color);\n  border-radius: var(--searchbox-radius);\n  font-size: var(--searchbox-font-size);\n  color: var(--searchbox-font-color);\n  background-color: var(--searchbox-background-color);\n}\n.paginationWrapper > .pageNumber > input[type=text]::placeholder {\n  padding: 0px 0px 0px 4px;\n  color: var(--searchbox-font-color);\n}\n\n.modalBackground {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n.modalBackground.black {\n  background-color: rgba(0, 0, 0, 0.3);\n}\n\ntable {\n  width: 100%;\n  text-align: left;\n  border-collapse: collapse;\n  margin: 0;\n  background-color: var(--background-color);\n  border: var(--table-border);\n  box-shadow: var(--table-shadow);\n}\ntable > thead {\n  background-color: var(--thead-background-color);\n  font-size: var(--thead-font-size);\n  color: var(--thead-font-color);\n  margin-bottom: 0;\n  border-top: var(--thead-border-top);\n  border-right: var(--thead-border-right);\n  border-left: var(--thead-border-left);\n  border-bottom: var(--thead-border-bottom);\n}\ntable > thead > tr > th {\n  color: var(--thead-font-color);\n  font-weight: var(--thead-font-weight);\n  padding: 10px;\n  white-space: nowrap;\n}\ntable > thead > tr > th:first-child {\n  background-color: var(--thead-background-color);\n  padding-left: 20px;\n  padding-right: 20px;\n}\ntable > thead > tr > th > .filterWrapper {\n  display: inline-block;\n  position: relative;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow {\n  position: absolute;\n  top: 4px;\n  left: -20px;\n  z-index: 3;\n  width: auto;\n  height: auto;\n  background-color: #ffffff;\n  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);\n  border-radius: var(--searchbox-radius);\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .filterWindowTitle {\n  padding: 4px 8px;\n  background-color: var(--thead-font-color);\n  color: #ffffff;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > ul {\n  padding: 9px 8px;\n  margin: 9px 8px 6px;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 3px;\n  max-height: 400px;\n  overflow: auto;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > ul > li {\n  display: flex;\n  margin-bottom: 8px;\n  line-height: 1.4em;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > ul > li > input[type=checkbox] {\n  margin-top: 1px;\n  margin-right: 6px;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton {\n  display: flex;\n  justify-content: center;\n  padding: 0 8px;\n  margin-bottom: 9px;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton > button {\n  border: 1px solid var(--searchbtn-border-color);\n  border-radius: var(--searchbtn-radius);\n  background-color: var(--searchbtn-color);\n  color: #ffffff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  white-space: nowrap;\n  padding: 3px 10px;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton > button:first-of-type {\n  margin-right: 4px;\n  width: 60%;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton > button:last-of-type {\n  width: 40%;\n}\ntable > thead > tr > th:last-of-type > .filterWrapper > div.filterWindow {\n  left: auto;\n  right: 11px;\n}\ntable > thead > tr .icon {\n  cursor: pointer;\n  content: \"\";\n  display: inline-block;\n  width: 9px;\n  height: 13px;\n  background-repeat: no-repeat;\n  background-position: center;\n  margin-bottom: -4px;\n  background-size: 8px 8px;\n}\ntable > thead > tr .icon.searchIcon {\n  display: var(--searchicon-display);\n  margin-left: 2px;\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-search.svg);\n}\ntable > thead > tr .icon.filterIcon {\n  display: var(--filtericon-display);\n  margin-left: 2px;\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-filter.svg);\n}\ntable > thead > tr .icon.filterIcon.active {\n  z-index: 3;\n  position: relative;\n  background-color: var(--thead-font-color);\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-filter.svg);\n}\ntable > thead > tr .icon.sortIcon {\n  display: var(--sorticon-display);\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-sort.svg);\n}\ntable > thead > tr .icon.sortIcon.desc {\n  background-image: url(../../assets/gray-sort-des.svg);\n}\ntable > thead > tr .icon.sortIcon.asc {\n  background-image: url(../../assets/gray-sort-asc.svg);\n}\ntable > tbody {\n  font-size: var(--tbody-font-size);\n  color: var(--tbody-font-color);\n  background-color: var(--tbody-background-color);\n  border-right: var(--tbody-border-right);\n  border-bottom: var(--tbody-border-bottom);\n  border-left: var(--tbody-border-left);\n}\ntable > tbody > tr:nth-child(odd) {\n  background-color: var(--tbody-odd-background-color);\n}\ntable > tbody > tr:nth-child(even) {\n  background-color: var(--tbody-even-background-color);\n}\ntable > tbody > tr > td {\n  border-bottom: var(--ruled-line);\n  border-collapse: collapse;\n  padding: 10px;\n}\ntable > tbody > tr > td:first-child {\n  padding-left: 20px;\n}\ntable > tbody > tr > td:last-child {\n  padding-right: 20px;\n}\ntable > tbody > tr:last-of-type > td {\n  border-bottom: none;\n}\n\n.modal-enter-from,\n.modal-leave-to {\n  opacity: 0;\n  margin-top: -20px;\n}\n\n.modal-enter-active,\n.modal-leave-active {\n  transition: opacity 0.4s, margin-top 0.4s;\n}\n\n.modal_bg-enter-from,\n.modal_bg-leave-to {\n  opacity: 0;\n}\n\n.modal_bg-enter-active,\n.modal_bg-leave-active {\n  transition: opacity 0.4s;\n}\n\n.pageSliderWrapper {\n  padding: 0px 0px 10px 0px;\n}\n.pageSliderWrapper > .pageSliderRange {\n  margin-left: 10px;\n}\n\n.pageSlider {\n  width: 100%;\n  text-align: left;\n  position: relative;\n  top: -16px;\n}\n.pageSlider > .pageSliderBar {\n  width: calc(100% - 20px);\n  margin-left: 10px;\n  background-color: #bbbbbb;\n  height: 4px;\n  position: relative;\n  top: 10px;\n  z-index: 0;\n}\n.pageSlider > ul {\n  padding: 0;\n  display: inline-block;\n  z-index: 2;\n}\n.pageSlider > ul > li.pageSliderKnob {\n  color: var(--currentbtn-font-color);\n  background-color: var(--currentbtn-background-color);\n  border: var(--paginationbtn-border);\n  padding: var(--paginationbtn-padding);\n  font-size: var(--paginationbtn-font-size);\n  align-items: center;\n  display: inline;\n  border-radius: var(--paginationbtn-border-radius);\n  user-select: none;\n}\n.pageSlider > ul > li.pageSliderKnob:hover {\n  cursor: pointer;\n  color: var(--paginationbtn-font-color);\n  background-color: var(--paginationbtn-background-color);\n  border-color: var(--searchbox-border-color);\n}";

defineStanzaElement(tableWithPagination, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table-with-pagination.js.map
