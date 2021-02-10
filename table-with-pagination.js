import { a as commonjsGlobal, d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { d as defineComponent, r as reactive, c as computed, o as onMounted, l as lodash_zip, a as lodash_orderby, b as createBlock, e as createVNode, w as withModifiers, f as withDirectives, v as vModelText, t as toDisplayString, g as createCommentVNode, F as Fragment, h as renderList, i as withKeys, j as createTextVNode, k as openBlock, m as vModelCheckbox, n as createApp } from './index-284d928b.js';

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
		"stanza:example": "https://sparql-support.dbcls.jp/rest/api/metastanza_table_example",
		"stanza:description": "table data api",
		"stanza:required": true
	},
	{
		"stanza:key": "limit",
		"stanza:example": "10",
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
		"stanza:default": "30px 0px 0px 0px",
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
		"stanza:default": "1px solid #fff",
		"stanza:description": "border style of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-border-bottom",
		"stanza:type": "text",
		"stanza:default": "1px solid #fff",
		"stanza:description": "border-bottom style of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-border-radius",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "border radius of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-margin",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "margin of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-padding",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "padding of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of pagination button"
	},
	{
		"stanza:key": "--edge-paginationbtn-border-radius",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "border radius of edge pagination button"
	},
	{
		"stanza:key": "--currentbtn-font-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "font color of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-background-color",
		"stanza:type": "color",
		"stanza:default": "#D5E1E8",
		"stanza:description": "background color of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #DDDDDD",
		"stanza:description": "border style of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0px solid #DDDDDD",
		"stanza:description": "border-bottom style of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-border-radius",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "border radius of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-padding",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "padding of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-margin",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "margin of pagination button.(at current page)"
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

var script = defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      query: "",
      queryByColumn: {
        column: null,
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
    });

    const filteredRows = computed(() => {
      const query = state.query;
      const queryByColumn = state.queryByColumn.query;
      const filtered = state.allRows
        .filter((row) => {
          return query ? row.some((cell) => cell.value.includes(query)) : true;
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
      const endIndex = startIndex + state.pagination.perPage;

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
      state.pagination.currentPage = num;
    }

    function submitQuery(column, query) {
      state.queryByColumn.column = column;
      state.queryByColumn.query = query;
    }

    function closeModal() {
      state.columnShowingFilters = null;
      state.columnShowingTextSearch = null;
    }

    async function fetchData() {
      const res = await fetch(params.table_data_api);
      const data = await res.json();

      state.responseJSON = data;

      const { vars, labels, order, href } = data.head;

      const columns = lodash_zip(vars, labels, order, href)
        .map(([_var, label, _order, _href]) => {
          const values = data.body.map((row) => row[_var].value);

          return {
            id: _var,
            label,
            order: _order,
            href: _href,

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
          return {
            column,
            value: row[column.id].value,
            href: column.href ? row[column.href].value : null,
          };
        });
      });
    }

    onMounted(fetchData);

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
  class: "textSearchByColumnWrapper"
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
const _hoisted_6 = /*#__PURE__*/createVNode("img", {
  src: "https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-download.svg",
  alt: "download"
}, null, -1 /* HOISTED */);
const _hoisted_7 = { key: 0 };
const _hoisted_8 = {
  key: 0,
  class: "filterWrapper"
};
const _hoisted_9 = { class: "filterWindowTitle" };
const _hoisted_10 = { class: "toggleAllButton" };
const _hoisted_11 = { key: 0 };
const _hoisted_12 = { key: 1 };
const _hoisted_13 = { class: "paginationWrapper" };
const _hoisted_14 = { class: "pageNumber" };
const _hoisted_15 = /*#__PURE__*/createTextVNode(" Page ");

function render(_ctx, _cache, $props, $setup, $data, $options) {
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
      (_ctx.state.columnShowingTextSearch !== null)
        ? (openBlock(), createBlock("div", _hoisted_3, [
            createVNode("p", _hoisted_4, " Search for \"" + toDisplayString(_ctx.state.columnShowingTextSearch.label) + "\" ", 1 /* TEXT */),
            createVNode("form", {
              class: "textSearchWrapper",
              onSubmit: _cache[4] || (_cache[4] = withModifiers($event => (
          _ctx.submitQuery(
            _ctx.state.columnShowingTextSearch.label,
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
            ], 32 /* HYDRATE_EVENTS */)
          ]))
        : createCommentVNode("v-if", true),
      createVNode("a", {
        class: "downloadBtn",
        href: _ctx.blobUrl,
        download: "tableData"
      }, [
        _hoisted_6
      ], 8 /* PROPS */, ["href"])
    ]),
    (_ctx.state.allRows)
      ? (openBlock(), createBlock("table", _hoisted_7, [
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
                    ? (openBlock(), createBlock("div", _hoisted_8, [
                        createVNode("div", {
                          class: [
                'filterWindow',
                { lastCol: _ctx.state.columns.length - 1 === i },
              ]
                        }, [
                          createVNode("p", _hoisted_9, toDisplayString(column.label), 1 /* TEXT */),
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
                          createVNode("div", _hoisted_10, [
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
                      ? (openBlock(), createBlock("span", _hoisted_11, [
                          createVNode("a", {
                            href: cell.href,
                            target: "_blank"
                          }, toDisplayString(cell.value), 9 /* TEXT, PROPS */, ["href"])
                        ]))
                      : (openBlock(), createBlock("span", _hoisted_12, toDisplayString(cell.value), 1 /* TEXT */))
                  ]))
                }), 128 /* KEYED_FRAGMENT */))
              ]))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ]))
      : createCommentVNode("v-if", true),
    createVNode("div", _hoisted_13, [
      (_ctx.state.pagination.currentPage !== 1)
        ? (openBlock(), createBlock(Fragment, { key: 0 }, [
            createVNode("span", {
              class: "arrow left",
              onClick: _cache[5] || (_cache[5] = $event => (_ctx.state.pagination.currentPage = 1))
            }, "< "),
            createVNode("span", {
              class: "singleArrow left",
              onClick: _cache[6] || (_cache[6] = $event => (_ctx.state.pagination.currentPage--))
            }, "<<")
          ], 64 /* STABLE_FRAGMENT */))
        : createCommentVNode("v-if", true),
      createVNode("ul", null, [
        (openBlock(true), createBlock(Fragment, null, renderList(_ctx.surroundingPages, (page) => {
          return (openBlock(), createBlock("li", {
            key: page,
            class: [
          'pagination',
          { active: _ctx.state.pagination.currentPage === page },
        ],
            onClick: $event => (_ctx.state.pagination.currentPage = page)
          }, toDisplayString(page), 11 /* TEXT, CLASS, PROPS */, ["onClick"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      (_ctx.state.pagination.currentPage !== _ctx.totalPages)
        ? (openBlock(), createBlock(Fragment, { key: 1 }, [
            createVNode("span", {
              class: "singleArrow right",
              onClick: _cache[7] || (_cache[7] = $event => (_ctx.state.pagination.currentPage++))
            }, ">"),
            createVNode("span", {
              class: "arrow right",
              onClick: _cache[8] || (_cache[8] = $event => (_ctx.state.pagination.currentPage = _ctx.totalPages))
            }, ">>")
          ], 64 /* STABLE_FRAGMENT */))
        : createCommentVNode("v-if", true),
      createVNode("div", _hoisted_14, [
        _hoisted_15,
        withDirectives(createVNode("input", {
          "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => (_ctx.state.jumpToNumberInput = $event)),
          type: "text",
          onKeydown: _cache[10] || (_cache[10] = withKeys($event => (_ctx.jumpToPage(_ctx.state.jumpToNumberInput)), ["enter"]))
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
    (_ctx.state.columnShowingFilters || _ctx.state.columnShowingTextSearch)
      ? (openBlock(), createBlock("div", {
          key: 1,
          class: ['modalBackground', { black: _ctx.state.columnShowingTextSearch }],
          onClick: _cache[11] || (_cache[11] = $event => (_ctx.closeModal()))
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

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  list-style: none;\n  color: var(--general-font-color);\n  font-family: var(--general-font-family);\n  font-size: var(--general-font-size);\n}\n\n#renderDiv {\n  width: 100%;\n}\n\n.container {\n  width: 100%;\n  max-width: 800px;\n}\n\n.tableOption {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n  margin: var(--information-margin);\n}\n.tableOption > .downloadBtn > img {\n  width: var(--dlbtn-img-width);\n  height: var(--dlbtn-img-height);\n}\n.tableOption .textSearchWrapper {\n  height: var(--searchbox-height);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.tableOption .textSearchWrapper > input[type=text] {\n  margin-right: 3px;\n  height: var(--searchbox-height);\n  width: var(--searchbox-width);\n  border: 1px solid var(--searchbox-border-color);\n  border-radius: var(--searchbox-radius);\n  font-size: var(--searchbox-font-size);\n  color: var(--searchbox-font-color);\n  background-color: var(--searchbox-background-color);\n}\n.tableOption .textSearchWrapper > input[type=text]::placeholder {\n  padding: 0px 0px 0px 4px;\n  color: var(--searchbox-font-color);\n}\n.tableOption .textSearchWrapper > .searchBtn {\n  border: 1px solid var(--searchbtn-border-color);\n  border-radius: var(--searchbtn-radius);\n  background-color: var(--searchbtn-color);\n  color: #ffffff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  white-space: nowrap;\n  margin-right: 2px;\n  height: var(--searchbtn-height);\n  width: var(--searchbtn-width);\n}\n.tableOption .textSearchWrapper > .searchBtn > img {\n  width: var(--searchbtn-img-width);\n  height: var(--searchbtn-img-height);\n  display: var(--searchimg-display);\n}\n.tableOption > .textSearchByColumnWrapper {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3;\n  background: #ffffff;\n  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);\n}\n.tableOption > .textSearchByColumnWrapper > p.title {\n  display: block;\n  padding: 6px 16px;\n  background-color: var(--thead-font-color);\n  color: #ffffff;\n}\n.tableOption > .textSearchByColumnWrapper > .textSearchWrapper {\n  padding: 26px 40px 26px 20px;\n}\n.tableOption > .textSearchByColumnWrapper > .textSearchWrapper > input {\n  margin-right: 4px;\n}\n\n.paginationWrapper {\n  padding: var(--pagination-padding);\n  display: flex;\n  justify-content: var(--pagination-placement);\n}\n.paginationWrapper > ul {\n  display: flex;\n  padding: 0;\n}\n.paginationWrapper > ul > li {\n  color: var(--paginationbtn-font-color);\n  background-color: var(--paginationbtn-background-color);\n  border: var(--paginationbtn-border);\n  border-bottom: var(--paginationbtn-border-bottom);\n  border-radius: var(--paginationbtn-border-radius);\n  margin: var(--paginationbtn-margin);\n  padding: var(--paginationbtn-padding);\n  font-size: var(--paginationbtn-font-size);\n}\n> .paginationWrapper > ul > li.first-child {\n  border-radius: var(--edge-paginationbtn-border-radius) !important;\n}\n> .paginationWrapper > ul > li.last-child {\n  border-radius: var(--edge-paginationbtn-border-radius) !important;\n}\n.paginationWrapper > ul > li.arrow-btn {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.paginationWrapper > ul > li.back-btn > span {\n  display: block;\n  width: 7px;\n  height: 7px;\n  border: 1px solid;\n  border-color: transparent transparent var(--arrowbtn-color) var(--arrowbtn-color);\n  transform: rotate(45deg);\n}\n.paginationWrapper > ul > li.advance-btn > span {\n  display: block;\n  width: 7px;\n  height: 7px;\n  border: 1px solid;\n  border-color: var(--arrowbtn-color) var(--arrowbtn-color) transparent transparent;\n  transform: rotate(45deg);\n}\n.paginationWrapper > ul > li.current-btn {\n  color: var(--currentbtn-font-color);\n  background-color: var(--currentbtn-background-color);\n  border: var(--currentbtn-border);\n  border-bottom: var(--currentbtn-border-bottom);\n  border-radius: var(--currentbtn-border-radius);\n  padding: var(--currentbtn-padding);\n  margin: var(--currentbtn-margin);\n}\n\n.modalBackground {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n.modalBackground.black {\n  background-color: rgba(0, 0, 0, 0.3);\n}\n\ntable {\n  width: 100%;\n  text-align: left;\n  border-collapse: collapse;\n  margin: 0;\n  background-color: var(--background-color);\n  border: var(--table-border);\n  box-shadow: var(--table-shadow);\n}\ntable > thead {\n  background-color: var(--thead-background-color);\n  font-size: var(--thead-font-size);\n  color: var(--thead-font-color);\n  margin-bottom: 0;\n  border-top: var(--thead-border-top);\n  border-right: var(--thead-border-right);\n  border-left: var(--thead-border-left);\n  border-bottom: var(--thead-border-bottom);\n}\ntable > thead > tr > th {\n  color: var(--thead-font-color);\n  font-weight: var(--thead-font-weight);\n  padding: 10px;\n}\ntable > thead > tr > th:first-child {\n  background-color: var(--thead-background-color);\n  padding-left: 20px;\n  padding-right: 20px;\n}\ntable > thead > tr > th > .filterWrapper {\n  display: inline-block;\n  position: relative;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow {\n  position: absolute;\n  top: 4px;\n  left: -20px;\n  z-index: 3;\n  width: auto;\n  height: auto;\n  background-color: #ffffff;\n  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);\n  border-radius: var(--searchbox-radius);\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .filterWindowTitle {\n  padding: 4px 8px;\n  background-color: var(--thead-font-color);\n  color: #ffffff;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > ul {\n  padding: 9px 8px;\n  margin: 9px 8px 6px;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 3px;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > ul > li {\n  display: flex;\n  margin-bottom: 8px;\n  line-height: 1.4em;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > ul > li > input[type=checkbox] {\n  margin-top: 1px;\n  margin-right: 6px;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton {\n  display: flex;\n  justify-content: center;\n  padding: 0 8px;\n  margin-bottom: 9px;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton > button {\n  border: 1px solid var(--searchbtn-border-color);\n  border-radius: var(--searchbtn-radius);\n  background-color: var(--searchbtn-color);\n  color: #ffffff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  white-space: nowrap;\n  padding: 3px 10px;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton > button:first-of-type {\n  margin-right: 4px;\n  width: 60%;\n}\ntable > thead > tr > th > .filterWrapper > div.filterWindow > .toggleAllButton > button:last-of-type {\n  width: 40%;\n}\ntable > thead > tr > th:last-of-type > .filterWrapper > div.filterWindow {\n  left: auto;\n  right: 11px;\n}\ntable > thead > tr .icon {\n  cursor: pointer;\n  content: \"\";\n  display: inline-block;\n  width: 9px;\n  height: 13px;\n  background-repeat: no-repeat;\n  background-position: center;\n  margin-bottom: -4px;\n  background-size: 8px 8px;\n}\ntable > thead > tr .icon.searchIcon {\n  display: var(--searchicon-display);\n  margin-left: 2px;\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-search.svg);\n}\ntable > thead > tr .icon.filterIcon {\n  display: var(--filtericon-display);\n  margin-left: 2px;\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-filter.svg);\n}\ntable > thead > tr .icon.filterIcon.active {\n  z-index: 3;\n  position: relative;\n  background-color: var(--thead-font-color);\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-filter.svg);\n}\ntable > thead > tr .icon.sortIcon {\n  display: var(--sorticon-display);\n  background-image: url(https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-sort.svg);\n}\ntable > thead > tr .icon.sortIcon.desc {\n  background-image: url(../../assets/gray-sort-des.svg);\n}\ntable > thead > tr .icon.sortIcon.asc {\n  background-image: url(../../assets/gray-sort-asc.svg);\n}\ntable > tbody {\n  font-size: var(--tbody-font-size);\n  color: var(--tbody-font-color);\n  background-color: var(--tbody-background-color);\n  border-right: var(--tbody-border-right);\n  border-bottom: var(--tbody-border-bottom);\n  border-left: var(--tbody-border-left);\n}\ntable > tbody > tr:nth-child(odd) {\n  background-color: var(--tbody-odd-background-color);\n}\ntable > tbody > tr:nth-child(even) {\n  background-color: var(--tbody-even-background-color);\n}\ntable > tbody > tr > td {\n  border-bottom: var(--ruled-line);\n  border-collapse: collapse;\n  padding: 10px;\n}\ntable > tbody > tr > td:first-child {\n  padding-left: 20px;\n}\ntable > tbody > tr > td:last-child {\n  padding-right: 20px;\n}\ntable > tbody > tr:last-of-type > td {\n  border-bottom: none;\n}";

defineStanzaElement(tableWithPagination, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table-with-pagination.js.map
