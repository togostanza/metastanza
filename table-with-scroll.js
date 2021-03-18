import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as defineComponent, m as reactive, o as onMounted, n as lodash_orderby, b as createBlock, h as createVNode, F as Fragment, i as renderList, l as createCommentVNode, d as openBlock, k as toDisplayString, x as createApp } from './index-a48e903e.js';

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array ? array.length : 0,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * This method is like `_.zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * _.unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 */
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }
  var length = 0;
  array = arrayFilter(array, function(group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function(index) {
    return arrayMap(array, baseProperty(index));
  });
}

/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 */
var zip = baseRest(unzip);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
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
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
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
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

var lodash_zip = zip;

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "table-with-scroll",
	"stanza:label": "table with scroll",
	"stanza:definition": "Table with scroll for MetaStanza",
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
		"stanza:example": "10",
		"stanza:description": "table page size",
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
		"stanza:key": "--table-height",
		"stanza:type": "text",
		"stanza:default": "400px",
		"stanza:description": "height of table"
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
		"stanza:key": "--thead-border-color",
		"stanza:type": "text",
		"stanza:default": "#eee",
		"stanza:description": "border color of thead"
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

      offset: 0,

      isFetchingData: false,
    });

    async function fetchData() {
      console.log("fetchData");
      state.isFetchingData = true;
      const res = await fetch(
        `${params.table_data_api}&limit=${params.limit}&offset=${state.offset}`
      );
      const data = await res.json();

      state.responseJSON = data;

      const { vars, labels, order, href } = data.head;

      const columns = lodash_zip(vars, labels, order, href)
        .map(([_var, label, _order, _href]) => {
          return {
            id: _var,
            label,
            order: _order,
            href: _href,
          };
        })
        .filter((column) => column.label !== null);

      state.columns = lodash_orderby(columns, ["order"]);

      state.allRows = state.allRows.concat(
        data.body.map((row) => {
          return columns.map((column) => {
            return {
              column,
              value: row[column.id].value,
              href: column.href ? row[column.href].value : null,
            };
          });
        })
      );
      state.isFetchingData = false;
    }

    function handleScroll(e) {
      if (
        e.path[0].scrollTop ===
          e.path[0].firstChild.clientHeight - e.path[0].clientHeight &&
        !state.isFetchingData
      ) {
        state.offset++;
        fetchData();
      }
    }

    onMounted(() => {
      fetchData();
    });

    return {
      state,
      handleScroll,
    };
  },
});

const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 1 };
const _hoisted_4 = { key: 0 };
const _hoisted_5 = /*#__PURE__*/createVNode("div", { class: "dotTyping" }, null, -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "tableWrapper",
    onScroll: _cache[1] || (_cache[1] = (...args) => (_ctx.handleScroll && _ctx.handleScroll(...args)))
  }, [
    (_ctx.state.allRows)
      ? (openBlock(), createBlock("table", _hoisted_1, [
          createVNode("thead", null, [
            createVNode("tr", null, [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.state.columns, (column) => {
                return (openBlock(), createBlock("th", {
                  key: column.id
                }, toDisplayString(column.label), 1 /* TEXT */))
              }), 128 /* KEYED_FRAGMENT */))
            ])
          ]),
          createVNode("tbody", null, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.state.allRows, (row) => {
              return (openBlock(), createBlock("tr", {
                key: row.id
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(row, (cell) => {
                  return (openBlock(), createBlock("td", {
                    key: cell.column.id
                  }, [
                    (cell.href)
                      ? (openBlock(), createBlock("span", _hoisted_2, [
                          createVNode("a", {
                            href: cell.href,
                            target: "_blank"
                          }, toDisplayString(cell.value), 9 /* TEXT, PROPS */, ["href"])
                        ]))
                      : (openBlock(), createBlock("span", _hoisted_3, toDisplayString(cell.value), 1 /* TEXT */))
                  ]))
                }), 128 /* KEYED_FRAGMENT */))
              ]))
            }), 128 /* KEYED_FRAGMENT */)),
            (_ctx.state.isFetchingData)
              ? (openBlock(), createBlock("tr", _hoisted_4, [
                  createVNode("td", {
                    colspan: _ctx.state.columns.length,
                    class: "loadingWrapper"
                  }, [
                    _hoisted_5
                  ], 8 /* PROPS */, ["colspan"])
                ]))
              : createCommentVNode("v-if", true)
          ])
        ]))
      : createCommentVNode("v-if", true)
  ], 32 /* HYDRATE_EVENTS */))
}

script.render = render;
script.__file = "stanzas/table-with-scroll/app.vue";

async function tableWithPagination(stanza, params) {
  const main = stanza.root.querySelector("main");
  createApp(script, params).mount(main);
}

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<style>\n  table {\n      width: 100%;\n  }\n</style>\n\n<div class=\"container\">\n  <div class=\"infomation\">\n    <div class=\"text-search-wrapper\">\n      <input\n        type=\"text\"\n        id=\"search-input\"\n        placeholder=\"Search for keywords...\"\n      />\n      <button id=\"search-btn\" type=\"submit\">\n        <img\n          src=\"https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-search.svg\"\n          alt=\"search\"\n        />\n        <span class=\"search-text\">\n          Search\n        </span>\n      </button>\n    </div>\n    <a id=\"download-btn\" download=\"table-data\">\n      <img\n        src=\"https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-download.svg\"\n        alt=\"download\"\n      />\n    </a>\n  </div>\n  <p class=\"table-title\">\n    Title of this Table\n  </p>\n  <div id=\"renderDiv\"></div>\n\n  <div id=\"pagination\">\n    <ul>\n      <li class=\"first-btn back-btn arrow-btn\">\n        <span></span>\n        <span></span>\n      </li>\n      <li class=\"previous-btn back-btn arrow-btn\">\n        <span></span>\n      </li>\n      <li class=\"current-btn\">\n        1\n      </li>\n      <li>\n        2\n      </li>\n      <li>\n        3\n      </li>\n      <li>\n        4\n      </li>\n      <li>\n        …\n      </li>\n      <li>\n        10\n      </li>\n      <li class=\"next-btn advance-btn arrow-btn\">\n        <span></span>\n      </li>\n      <li class=\"last-btn advance-btn arrow-btn\">\n        <span></span>\n        <span></span>\n      </li>\n    </ul>\n  </div>\n  <p class=\"show-info\">\n    Showing 1 to 10 of 44 entres\n  </p>\n</div>";
},"useData":true}]
];

var css = "main {\n  padding: 1rem 2rem;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  list-style: none;\n  color: var(--general-font-color);\n  font-family: var(--general-font-family);\n  font-size: var(--general-font-size);\n}\n\n#renderDiv {\n  width: 100%;\n}\n\n.container {\n  width: 100%;\n  max-width: 800px;\n}\n\n.tableWrapper {\n  height: var(--table-height);\n  overflow: auto;\n}\n.tableWrapper > table {\n  width: 100%;\n  text-align: left;\n  border-collapse: collapse;\n  margin: 0;\n  background-color: var(--background-color);\n  border-right: var(--table-border);\n  border-bottom: var(--table-border);\n  border-left: var(--table-border);\n  box-shadow: var(--table-shadow);\n}\n.tableWrapper > table > thead {\n  background-color: var(--thead-background-color);\n  font-size: var(--thead-font-size);\n  color: var(--thead-font-color);\n  margin-bottom: 0;\n}\n.tableWrapper > table > thead > tr > th {\n  color: var(--thead-font-color);\n  font-weight: var(--thead-font-weight);\n  padding: 10px;\n  position: sticky;\n  top: -1px;\n  background: #ffffff;\n}\n.tableWrapper > table > thead > tr > th:after {\n  content: \"\";\n  width: 100%;\n  height: 1px;\n  background-color: var(--thead-border-color);\n  position: absolute;\n  left: 0;\n  bottom: 0;\n}\n.tableWrapper > table > thead > tr > th:first-child {\n  background-color: var(--thead-background-color);\n  padding-left: 20px;\n  padding-right: 20px;\n}\n.tableWrapper > table > tbody {\n  font-size: var(--tbody-font-size);\n  color: var(--tbody-font-color);\n  background-color: var(--tbody-background-color);\n  border-right: var(--tbody-border-right);\n  border-bottom: var(--tbody-border-bottom);\n  border-left: var(--tbody-border-left);\n}\n.tableWrapper > table > tbody > tr:nth-child(odd) {\n  background-color: var(--tbody-odd-background-color);\n}\n.tableWrapper > table > tbody > tr:nth-child(even) {\n  background-color: var(--tbody-even-background-color);\n}\n.tableWrapper > table > tbody > tr > td {\n  border-bottom: var(--ruled-line);\n  border-collapse: collapse;\n  padding: 10px;\n}\n.tableWrapper > table > tbody > tr > td:first-child {\n  padding-left: 20px;\n}\n.tableWrapper > table > tbody > tr > td:last-child {\n  padding-right: 20px;\n}\n.tableWrapper > table > tbody > tr > td.loadingWrapper {\n  text-align: center;\n}\n.tableWrapper > table > tbody > tr:last-of-type > td {\n  border-bottom: none;\n}\n\n.dotTyping {\n  position: relative;\n  left: -9999px;\n  display: inline-block;\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background-color: var(--thead-font-color);\n  box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  animation: dot-typing 1.5s infinite linear;\n}\n\n@keyframes dot-typing {\n  0% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  16.667% {\n    box-shadow: 9991.5px -5px 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  33.333% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  50% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px -5px 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  66.667% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  83.333% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px -5px 0 0 var(--thead-font-color);\n  }\n  100% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n}";

defineStanzaElement(tableWithPagination, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table-with-scroll.js.map
