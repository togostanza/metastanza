import { d as defineStanzaElement } from './stanza-element-40ac9902.js';
import { S as Stanza } from './stanza-7a5318fa.js';
import { l as loadData } from './load-data-0be92417.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as copyHTMLSnippetToClipboardMenuItem, g as appendCustomCss } from './index-1e0b4ea1.js';

var colorString$1 = {exports: {}};

var colorName = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

var simpleSwizzle = {exports: {}};

var isArrayish$1 = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};

var isArrayish = isArrayish$1;

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle$1 = simpleSwizzle.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle$1.wrap = function (fn) {
	return function () {
		return fn(swizzle$1(arguments));
	};
};

/* MIT license */

var colorNames = colorName;
var swizzle = simpleSwizzle.exports;
var hasOwnProperty = Object.hasOwnProperty;

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (hasOwnProperty.call(colorNames, name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = colorString$1.exports = {
	to: {},
	get: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var keyword = /^(\w+)$/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		if (!hasOwnProperty.call(colorNames, match[1])) {
			return null;
		}

		rgb = colorNames[match[1]];
		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = Math.round(num).toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

/* MIT license */

/* eslint-disable no-mixed-operators */
const cssKeywords = colorName;

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert$2 = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

var conversions$2 = convert$2;

// Hide .channels and .labels properties
for (const model of Object.keys(convert$2)) {
	if (!('channels' in convert$2[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert$2[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert$2[model].labels.length !== convert$2[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert$2[model];
	delete convert$2[model].channels;
	delete convert$2[model].labels;
	Object.defineProperty(convert$2[model], 'channels', {value: channels});
	Object.defineProperty(convert$2[model], 'labels', {value: labels});
}

convert$2.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert$2.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert$2.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert$2.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert$2.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert$2.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert$2.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert$2.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert$2.rgb.lab = function (rgb) {
	const xyz = convert$2.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert$2.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert$2.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert$2.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert$2.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert$2.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert$2.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert$2.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert$2.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert$2.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert$2.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert$2.rgb.ansi16(convert$2.hsv.rgb(args), args[2]);
};

convert$2.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert$2.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert$2.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert$2.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert$2.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert$2.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert$2.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert$2.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert$2.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert$2.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert$2.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert$2.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert$2.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert$2.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert$2.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert$2.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert$2.gray.hsv = convert$2.gray.hsl;

convert$2.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert$2.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert$2.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert$2.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};

const conversions$1 = conversions$2;

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions$1);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions$1[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions$1[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions$1[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

var route$1 = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

const conversions = conversions$2;
const route = route$1;

const convert$1 = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert$1[fromModel] = {};

	Object.defineProperty(convert$1[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert$1[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert$1[fromModel][toModel] = wrapRounded(fn);
		convert$1[fromModel][toModel].raw = wrapRaw(fn);
	});
});

var colorConvert = convert$1;

const colorString = colorString$1.exports;
const convert = colorConvert;

const _slice = [].slice;

const skippedModels = [
	// To be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// Gray conflicts with some method names, and has its own method defined.
	'gray',

	// Shouldn't really be in color-convert either...
	'hex',
];

const hashedModelKeys = {};
for (const model of Object.keys(convert)) {
	hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
}

const limiters = {};

function Color(object, model) {
	if (!(this instanceof Color)) {
		return new Color(object, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	let i;
	let channels;

	if (object == null) { // eslint-disable-line no-eq-null,eqeqeq
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (object instanceof Color) {
		this.model = object.model;
		this.color = object.color.slice();
		this.valpha = object.valpha;
	} else if (typeof object === 'string') {
		const result = colorString.get(object);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + object);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (object.length > 0) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		const newArray = _slice.call(object, 0, channels);
		this.color = zeroArray(newArray, channels);
		this.valpha = typeof object[channels] === 'number' ? object[channels] : 1;
	} else if (typeof object === 'number') {
		// This is always RGB - can be converted later on.
		this.model = 'rgb';
		this.color = [
			(object >> 16) & 0xFF,
			(object >> 8) & 0xFF,
			object & 0xFF,
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		const keys = Object.keys(object);
		if ('alpha' in object) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof object.alpha === 'number' ? object.alpha : 0;
		}

		const hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(object));
		}

		this.model = hashedModelKeys[hashedKeys];

		const labels = convert[this.model].labels;
		const color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(object[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// Perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			const limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString() {
		return this.string();
	},

	toJSON() {
		return this[this.model]();
	},

	string(places) {
		let self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to[self.model](args);
	},

	percentString(places) {
		const self = this.rgb().round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to.rgb.percent(args);
	},

	array() {
		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
	},

	object() {
		const result = {};
		const channels = convert[this.model].channels;
		const labels = convert[this.model].labels;

		for (let i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray() {
		const rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject() {
		const rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round(places) {
		places = Math.max(places || 0, 0);
		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
	},

	alpha(value) {
		if (arguments.length > 0) {
			return new Color(this.color.concat(Math.max(0, Math.min(1, value))), this.model);
		}

		return this.valpha;
	},

	// Rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(100)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(100)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword(value) {
		if (arguments.length > 0) {
			return new Color(value);
		}

		return convert[this.model].keyword(this.color);
	},

	hex(value) {
		if (arguments.length > 0) {
			return new Color(value);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	hexa(value) {
		if (arguments.length > 0) {
			return new Color(value);
		}

		const rgbArray = this.rgb().round().color;

		let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
		if (alphaHex.length === 1) {
			alphaHex = '0' + alphaHex;
		}

		return colorString.to.hex(rgbArray) + alphaHex;
	},

	rgbNumber() {
		const rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity() {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		const rgb = this.rgb().color;

		const lum = [];
		for (const [i, element] of rgb.entries()) {
			const chan = element / 255;
			lum[i] = (chan <= 0.039_28) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast(color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		const lum1 = this.luminosity();
		const lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level(color2) {
		const contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	isDark() {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		const rgb = this.rgb().color;
		const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	isLight() {
		return !this.isDark();
	},

	negate() {
		const rgb = this.rgb();
		for (let i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}

		return rgb;
	},

	lighten(ratio) {
		const hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken(ratio) {
		const hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten(ratio) {
		const hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken(ratio) {
		const hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale() {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		const rgb = this.rgb().color;
		const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(value, value, value);
	},

	fade(ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer(ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate(degrees) {
		const hsl = this.hsl();
		let hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix(mixinColor, weight) {
		// Ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		if (!mixinColor || !mixinColor.rgb) {
			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
		}

		const color1 = mixinColor.rgb();
		const color2 = this.rgb();
		const p = weight === undefined ? 0.5 : weight;

		const w = 2 * p - 1;
		const a = color1.alpha() - color2.alpha();

		const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
		const w2 = 1 - w1;

		return Color.rgb(
			w1 * color1.red() + w2 * color2.red(),
			w1 * color1.green() + w2 * color2.green(),
			w1 * color1.blue() + w2 * color2.blue(),
			color1.alpha() * p + color2.alpha() * (1 - p));
	},
};

// Model conversion methods and static constructors
for (const model of Object.keys(convert)) {
	if (skippedModels.includes(model)) {
		continue;
	}

	const channels = convert[model].channels;

	// Conversion methods
	Color.prototype[model] = function () {
		if (this.model === model) {
			return new Color(this);
		}

		if (arguments.length > 0) {
			return new Color(arguments, model);
		}

		const newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
		return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
	};

	// 'static' construction methods
	Color[model] = function (color) {
		if (typeof color === 'number') {
			color = zeroArray(_slice.call(arguments), channels);
		}

		return new Color(color, model);
	};
}

function roundTo(number, places) {
	return Number(number.toFixed(places));
}

function roundToPlace(places) {
	return function (number) {
		return roundTo(number, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	for (const m of model) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	}

	model = model[0];

	return function (value) {
		let result;

		if (arguments.length > 0) {
			if (modifier) {
				value = modifier(value);
			}

			result = this[model]();
			result.color[channel] = value;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(value) {
	return Array.isArray(value) ? value : [value];
}

function zeroArray(array, length) {
	for (let i = 0; i < length; i++) {
		if (typeof array[i] !== 'number') {
			array[i] = 0;
		}
	}

	return array;
}

var color = Color;

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$2=Symbol(),n$4=new Map;class s$3{constructor(t,n){if(this._$cssResult$=!0,n!==e$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t;}get styleSheet(){let e=n$4.get(this.cssText);return t$1&&void 0===e&&(n$4.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const o$3=t=>new s$3("string"==typeof t?t:t+"",e$2),i$1=(e,n)=>{t$1?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S$1=t$1?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window.trustedTypes,r$1=e$1?e$1.emptyScript:"",h$1=window.reactiveElementPolyfillSupport,o$2={toAttribute(t,i){switch(i){case Boolean:t=t?r$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$3=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$2,reflect:!1,hasChanged:n$3};class a$1 extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o();}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S$1(i));}else void 0!==i&&s.push(S$1(i));return s}static _$Eh(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1);}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$ES(t,i,s=l$2){var e,r;const h=this.constructor._$Eh(t,s);if(void 0!==h&&!0===s.reflect){const n=(null!==(r=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==r?r:o$2.toAttribute)(i,s.type);this._$Ei=t,null==n?this.removeAttribute(h):this.setAttribute(h,n),this._$Ei=null;}}_$AK(t,i){var s,e,r;const h=this.constructor,n=h._$Eu.get(t);if(void 0!==n&&this._$Ei!==n){const t=h.getPropertyOptions(n),l=t.converter,a=null!==(r=null!==(e=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof l?l:null)&&void 0!==r?r:o$2.fromAttribute;this._$Ei=n,this[n]=a(i,t.type),this._$Ei=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$3)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ep=this._$EC());}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU();}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EU(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return !0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$E_=void 0),this._$EU();}updated(t){}firstUpdated(t){}}a$1.finalized=!0,a$1.elementProperties=new Map,a$1.elementStyles=[],a$1.shadowRootOptions={mode:"open"},null==h$1||h$1({ReactiveElement:a$1}),(null!==(s$2=globalThis.reactiveElementVersions)&&void 0!==s$2?s$2:globalThis.reactiveElementVersions=[]).push("1.2.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=globalThis.trustedTypes,s$1=i?i.createPolicy("lit-html",{createHTML:t=>t}):void 0,e=`lit$${(Math.random()+"").slice(9)}$`,o$1="?"+e,n$2=`<${o$1}>`,l$1=document,h=(t="")=>l$1.createComment(t),r=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea)$/i,p=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),$=p(1),b=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),T=new WeakMap,x=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,p=-1,$=0;for(;$<s.length&&(d.lastIndex=$,u=d.exec(s),null!==u);)$=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,p=-1):void 0===u[1]?p=-2:(p=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$2:p>=0?(l.push(o),s.slice(0,p)+"$lit$"+s.slice(p)+e+y):s+e+(-2===p?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==s$1?s$1.createHTML(u):u,l]};class E{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=E.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?H:"@"===i[1]?I:S});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e),s=t.length-1;if(s>0){l.textContent=i?i.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h());}}}else if(8===l.nodeType)if(l.data===o$1)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e,t+1));)c.push({type:7,index:r}),t+=e.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function P(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=P(t,d._$AS(t,i.values),d,e)),i}class V{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),r(t)?t===w||null==t||""===t?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):u(t)?this.A(t):this.$(t);}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t));}$(t){this._$AH!==w&&r(this._$AH)?this._$AA.nextSibling.data=t:this.S(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=E.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new V(o,this),i=t.p(this.options);t.m(s),this.S(i),this._$AH=t;}}_$AC(t){let i=T.get(t.strings);return void 0===i&&T.set(t.strings,i=new E(t)),i}A(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.M(h()),this.M(h()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P(this,t,i,0),n=!r(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=P(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r(h)||h!==this._$AH[l]),h===w?t=w:t!==w&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.k(t);}k(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}k(t){this.element[this.name]=t===w?void 0:t;}}const k=i?i.emptyScript:"";class H extends S{constructor(){super(...arguments),this.type=4;}k(t){t&&t!==w?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=P(this,t,i,0))&&void 0!==s?s:w)===b)return;const e=this._$AH,o=t===w&&e!==w||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==w&&(e===w||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t);}}const z=window.litHtmlPolyfillSupport;null==z||z(E,N),(null!==(t=globalThis.litHtmlVersions)&&void 0!==t?t:globalThis.litHtmlVersions=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends a$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=x(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$1=globalThis.litElementPolyfillSupport;null==n$1||n$1({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.1.1");

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'. See https://lit.dev/msg/deprecated-import-path for more information.");

class ToolTip extends s {
  constructor() {
    super();
  }

  render() {
    return $`
      <style>
        .origin {
          position: absolute;
          top: 0;
          left: 0;
        }
        .tooltip {
          padding: 2px 12px;
          position: absolute;
          transition: all 0.2s;
          z-index: 10000;
          background-color: white;
          filter: drop-shadow(0 0.5px 1px black);
          font-size: 12px;
          line-height: 1.5;
          transform: translate(-50%, -100%);
          border-radius: 10px;
          opacity: 0;
        }
        .tooltip::before {
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 5px 0 4px;
          border-color: white transparent transparent transparent;
          display: block;
          position: absolute;
          left: 50%;
          bottom: -5px;
          transform: translateX(-50%);
        }
        .tooltip.-show {
          opacity: 1;
        }
      </style>
      <div class="origin"></div>
      <div class="tooltip"></div>
    `;
  }

  setup(nodes) {
    const tooltip = this.shadowRoot.querySelector(".tooltip");
    nodes.forEach((node) => {
      node.addEventListener("mouseover", () => {
        const originRect = this.shadowRoot
          .querySelector(".origin")
          .getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        if (node.dataset.tooltipHtml === "true") {
          tooltip.innerHTML = node.dataset.tooltip;
        } else {
          tooltip.textContent = node.dataset.tooltip;
        }
        tooltip.style.left = rect.x + rect.width * 0.5 - originRect.x + "px";
        tooltip.style.top = rect.y - originRect.y + "px";
        tooltip.classList.add("-show");
      });
      node.addEventListener("mouseleave", () => {
        tooltip.classList.remove("-show");
      });
    });
  }
}

customElements.define("togostanza--tooltip", ToolTip);

class Legend extends s {
  constructor() {
    super();
    this.items = [];
  }

  static get properties() {
    return {
      items: { type: Array },
    };
  }

  render() {
    return $`
      <style>
        .origin {
          position: absolute;
          top: 0;
          left: 0;
        }
        .legend {
          padding: 3px 9px;
          position: absolute;
          font-size: 10px;
          line-height: 1.5;
          max-height: 100%;
          overflow-y: auto;
          color: var(--togostanza-label-font-color);
          background-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
        }
        .legend > table > tbody > tr > td > .marker {
          display: inline-block;
          width: 1em;
          height: 1em;
          border-radius: 100%;
          vertical-align: middle;
          margin-right: 0.3em;
        }
        .legend > table > tbody > tr > td.number {
          text-align: right;
        }
        .leader {
          position: absolute;
          border-left: dotted 1px black;
          z-index: 10000;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s;
        }
        .leader[data-direction="top"] {
          border-top: dotted 1px black;
        }
        .leader[data-direction="bottom"] {
          border-bottom: dotted 1px black;
        }
        .leader.-show {
          opacity: 0.5;
        }
      </style>
      <div class="origin"></div>
      <div class="legend">
        <table>
          <tbody>
            ${this.items.map((item) => {
              return $` <tr data-id="${item.id}">
                <td>
                  <span
                    class="marker"
                    style="background-color: ${item.color}"
                  ></span
                  >${item.label}
                </td>
                ${item.value
                  ? $`<td class="${(typeof item.value).toLowerCase()}">
                      ${item.value}
                    </td>`
                  : ""}
              </tr>`;
            })}
          </tbody>
        </table>
      </div>
      <div class="leader"></div>
    `;
  }

  /**
   *
   * @param {*} data
   * @param {Node} container
   * @param {Object} opt
   *  - direction 'vertical' or 'horizontal'
   *  - position
   *  - fadeoutNodes
   */
  setup(items, container, opt) {
    this.items = items;
    this.render();
    const positions = opt.position || ["top", "right"];

    //  name of style property to fadeout. for fill - "opacity", for path's stroke - "stroke-opacity" etc.
    const fadeProp = opt.fadeProp || "opacity";

    // placement
    const legend = this.shadowRoot.querySelector(".legend");
    positions.forEach((position) => (legend.style[position] = 0));

    if (!opt.fadeoutNodes) {
      return;
    }

    const leader = this.shadowRoot.querySelector(".leader");

    // event
    window.requestAnimationFrame(() => {
      this.shadowRoot
        .querySelectorAll(".legend > table > tbody > tr")
        .forEach((tr) => {
          tr.addEventListener("mouseover", () => {
            const datum = items.find((item) => item.id === tr.dataset.id);

            if (datum) {
              opt.fadeoutNodes.forEach((node) => {
                node.style[fadeProp] = 0.2;
              });
              datum.node.style[fadeProp] = "";

              leader.classList.add("-show");
              const originRect = this.shadowRoot
                .querySelector(".origin")
                .getBoundingClientRect();
              const legendRect = tr.getBoundingClientRect();
              const targetRect = datum.node.getBoundingClientRect();
              leader.style.left =
                targetRect.x + targetRect.width * 0.5 - originRect.x + "px";
              leader.style.width =
                legendRect.x - targetRect.right + targetRect.width * 0.5 + "px";
              const legendMiddle = legendRect.y + legendRect.height * 0.5;
              const targetMiddle = targetRect.y + targetRect.height * 0.5;
              if (legendMiddle < targetMiddle) {
                leader.dataset.direction = "top";
                leader.style.top = legendMiddle - originRect.y + "px";
                leader.style.height = targetMiddle - legendMiddle + "px";
              } else {
                leader.dataset.direction = "bottom";
                leader.style.top = targetMiddle - originRect.y + "px";
                leader.style.height = legendMiddle - targetMiddle + "px";
              }
            }
          });
          tr.addEventListener("mouseleave", () => {
            opt.fadeoutNodes.forEach((node) => {
              node.style[fadeProp] = "";
            });
            leader.classList.remove("-show");
          });
        });
    });
  }
}

customElements.define("togostanza--legend", Legend);

class VennStanza extends Stanza {
  // colorSeries;
  // data;
  // totals;
  // dataLabels;
  // numberOfData;
  // venn;
  // tooltip;
  // legend;

  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
      downloadJSONMenuItem(this, "vennstanza", this.data),
      downloadCSVMenuItem(this, "vennstanza", this.data),
      downloadTSVMenuItem(this, "vennstanza", this.data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    this.colorSeries = this.getColorSeries();

    this.renderTemplate({ template: "stanza.html.hbs" });

    // append tooltip, legend
    const root = this.root.querySelector(":scope > div");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    // get data
    this.data = await this.getData();
    console.log(this.data);
    this.totals = this.data.map((datum) => {
      const total = {
        set: datum.set,
        size: 0,
      };
      const matchedData = this.data.filter((datum2) =>
        datum.set.every((item) => datum2.set.indexOf(item) !== -1)
      );
      total.size = matchedData.reduce((acc, datum) => acc + datum.size, 0);
      return total;
    });
    this.dataLabels = Array.from(
      new Set(this.data.map((datum) => datum.set).flat())
    );
    this.numberOfData = this.dataLabels.length;
    this.venn = new Map();

    // draw
    this.drawVennDiagram();
  }

  drawVennDiagram() {
    // set common parameters and styles
    const container = this.root.querySelector("#venn-diagrams");
    const svgWidth = this.params["width"];
    const svgHeight = this.params["height"];
    container.style.width = svgWidth + "px";
    container.style.height = svgHeight + "px";

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(
      `.venn-diagram[data-number-of-data="${this.numberOfData}"]`
    );
    if (!selectedDiagram) {
      console.error(
        "Venn diagrams with more than six elements are not supported. Please try using Euler diagrams."
      );
      return;
    }
    selectedDiagram.classList.add("-current");
    this.venn.set("node", selectedDiagram);

    // set scale
    const containerRect = this.root
      .querySelector("main")
      .getBoundingClientRect();
    const rect = selectedDiagram.getBoundingClientRect();
    const margin = Math.max(rect.x - containerRect.x, rect.y - containerRect.y);
    const scale = Math.min(
      svgWidth / (rect.width + margin * 2),
      svgHeight / (rect.height + margin * 2)
    );
    selectedDiagram.setAttribute("transform", `scale(${scale})`);
    const labelFontSize = +window
      .getComputedStyle(this.element)
      .getPropertyValue("--togostanza-label-font-size")
      .trim();
    selectedDiagram.querySelectorAll("text").forEach((text) => {
      text.style.fontSize = labelFontSize / scale + "px";
    });

    // shapes
    selectedDiagram.querySelectorAll(":scope > g").forEach((group) => {
      const targets = group.dataset.targets.split(",").map((target) => +target);
      const labels = targets.map((target) => this.dataLabels[target]);
      const count =
        this.data.find((datum) => {
          return (
            datum.set.length === labels.length &&
            labels.every((label) =>
              datum.set.find((label2) => label === label2)
            )
          );
        })?.size ?? "";
      // set color
      const color = this.getBlendedColor(targets);
      group
        .querySelector(":scope > .part")
        .setAttribute("fill", color.toString());
      // set label
      group.querySelector(":scope > text.label").textContent = labels.join(",");
      group.querySelector(":scope > text.value").textContent = count;
      // tooltip
      group.dataset.tooltip = `<strong>${labels.join("∩")}</strong>: ${count}`;
      group.dataset.tooltipHtml = true;
      // this.setTooltip(group);
    });
    this.tooltip.setup(selectedDiagram.querySelectorAll("[data-tooltip]"));

    // legend
    const items = this.data.map((datum) => {
      const id = datum.set
        .map((item) => this.dataLabels.indexOf(item))
        .sort()
        .join(",");
      const color = this.getBlendedColor(
        datum.set.map((item) => this.dataLabels.indexOf(item))
      );
      return Object.fromEntries([
        ["id", id],
        ["label", datum.set.map((item) => item).join("∩")],
        ["color", color.toString()],
        ["value", datum.size],
        [
          "node",
          selectedDiagram.querySelector(`:scope > g[data-targets="${id}"]`),
        ],
      ]);
    });
    this.legend.setup(items, this.root.querySelector("main"), {
      fadeoutNodes: selectedDiagram.querySelectorAll(":scope > g"),
    });
  }

  getColorSeries() {
    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map((variable) => getPropertyValue(variable).trim());
  }

  getBlendedColor(targets) {
    let blendedColor = color(this.colorSeries[targets[0]]);
    targets.forEach((target, index) => {
      if (index > 0) {
        blendedColor = blendedColor.mix(
          color(this.colorSeries[target]),
          1 / (index + 1)
        );
      }
    });
    const ratio = (targets.length - 1) / (this.numberOfData - 1);
    switch (this.params["blend-mode"]) {
      case "multiply":
        blendedColor = blendedColor.saturate(ratio);
        blendedColor = blendedColor.darken(ratio * 0.5);
        break;
      case "screen":
        blendedColor = blendedColor.saturate(ratio);
        blendedColor = blendedColor.lighten(ratio * 0.5);
        break;
    }
    return blendedColor;
  }

  async getData() {
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    // // processing
    // for (const datum of data) {
    //   datum.orgs = datum.orgs.split(', ');
    //   datum.count = Number(datum.count);
    // }
    return data;
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': VennStanza
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "venn-diagram",
	"stanza:label": "Venn diagram",
	"stanza:definition": "Venn diagram MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-08-03",
	"stanza:updated": "2022-01-23",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/3sets-data.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "label-0",
		"stanza:type": "string",
		"stanza:example": "10090",
		"stanza:description": "Label name",
		"stanza:required": true
	},
	{
		"stanza:key": "label-1",
		"stanza:type": "string",
		"stanza:example": "7955",
		"stanza:description": "Label name",
		"stanza:required": false
	},
	{
		"stanza:key": "label-2",
		"stanza:type": "string",
		"stanza:example": "9606",
		"stanza:description": "Label name",
		"stanza:required": false
	},
	{
		"stanza:key": "label-3",
		"stanza:type": "string",
		"stanza:example": "9601",
		"stanza:description": "Label name",
		"stanza:required": false
	},
	{
		"stanza:key": "label-4",
		"stanza:type": "string",
		"stanza:example": "9606",
		"stanza:description": "Label name",
		"stanza:required": false
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 380,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "blend-mode",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"normal",
			"multiply",
			"screen"
		],
		"stanza:example": "screen",
		"stanza:description": "How to mix colors in overlapping areas",
		"stanza:required": true
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
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Label font size"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"drawArea\">\n  <svg\n    id=\"venn-diagrams\"\n    version=\"1.1\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    xmlns:a=\"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/\"\n    xml:space=\"preserve\"\n  >\n\n    <!-- 1 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"1\">\n      <g data-targets=\"0\">\n        <circle class=\"part\" cx=\"182.5\" cy=\"182.5\" r=\"90\"></circle>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"178\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"192\"></text>\n      </g>\n    </g>\n\n    <!-- 2 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"2\">\n      <g data-targets=\"0\">\n        <path\n          class=\"part\"\n          d=\"M182.5,62.5c-49.7,0-90,40.3-90,90c0,10.5,1.8,20.6,5.1,30c12.4-35,45.7-60,84.9-60s72.5,25,84.9,60 c3.3-9.4,5.1-19.5,5.1-30C272.5,102.8,232.2,62.5,182.5,62.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"93\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"107\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path\n          class=\"part\"\n          d=\"M182.5,242.5c-39.2,0-72.5-25-84.9-60c-3.3,9.4-5.1,19.5-5.1,30c0,49.7,40.3,90,90,90s90-40.3,90-90 c0-10.5-1.8-20.6-5.1-30C255,217.5,221.7,242.5,182.5,242.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"266\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"280\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path\n          class=\"part\"\n          d=\"M182.5,122.5c-39.2,0-72.5,25-84.9,60c12.4,35,45.7,60,84.9,60s72.5-25,84.9-60 C255,147.5,221.7,122.5,182.5,122.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"178\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"192\"></text>\n      </g>\n    </g>\n\n    <!-- 3 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"3\">\n      <g data-targets=\"0\">\n        <path\n          class=\"part\"\n          d=\"M182.5,135.1c25.9-12.4,57.2-12.3,84,3.2c2,1.1,3.9,2.4,5.7,3.6c-3.5-46.5-42.3-83.2-89.7-83.2 S96.3,95.4,92.8,142c1.9-1.3,3.8-2.5,5.7-3.6C125.3,122.9,156.6,122.7,182.5,135.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"98\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"112\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path\n          class=\"part\"\n          d=\"M272.2,142c0.2,2.2,0.3,4.5,0.3,6.8c0,30.9-15.5,58.1-39.2,74.3c-2.2,28.6-18,55.7-44.7,71.1 c-2,1.1-4,2.2-6,3.2c42,20.2,93.2,5,116.9-36.1C323.1,220.2,310.8,168.2,272.2,142z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"264\" y=\"233\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"264\" y=\"247\"></text>\n      </g>\n      <g data-targets=\"2\">\n        <path\n          class=\"part\"\n          d=\"M131.7,223.1c-23.7-16.2-39.2-43.4-39.2-74.3c0-2.3,0.1-4.6,0.3-6.8c-38.6,26.3-50.9,78.2-27.2,119.3 c23.7,41.1,74.9,56.3,116.9,36.1c-2-1-4-2-6-3.2C149.7,278.8,133.9,251.7,131.7,223.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"102\" y=\"233\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"102\" y=\"247\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path\n          class=\"part\"\n          d=\"M182.5,135.1c15.8,7.6,29.6,19.8,39,36.1s13.1,34.3,11.8,51.8c23.7-16.2,39.2-43.4,39.2-74.3 c0-2.3-0.1-4.6-0.3-6.8c-1.9-1.3-3.8-2.5-5.7-3.6C239.7,122.9,208.4,122.7,182.5,135.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"242\" y=\"156\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"242\" y=\"170\"></text>\n      </g>\n      <g data-targets=\"0,2\">\n        <path\n          class=\"part\"\n          d=\"M131.7,223.1c-1.3-17.5,2.4-35.5,11.8-51.8s23.2-28.6,39-36.1c-25.9-12.4-57.2-12.3-84,3.2 c-2,1.1-3.9,2.4-5.7,3.6c-0.2,2.2-0.3,4.5-0.3,6.8C92.5,179.6,108,206.9,131.7,223.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"122\" y=\"156\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"122\" y=\"170\"></text>\n      </g>\n      <g data-targets=\"1,2\">\n        <path\n          class=\"part\"\n          d=\"M233.3,223.1c-14.5,9.9-31.9,15.7-50.8,15.7s-36.3-5.8-50.8-15.7c2.2,28.6,18,55.7,44.7,71.1 c2,1.1,4,2.2,6,3.2c2-1,4-2,6-3.2C215.3,278.8,231.1,251.7,233.3,223.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"258\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"272\"></text>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path\n          class=\"part\"\n          d=\"M221.5,171.3c-9.4-16.3-23.2-28.6-39-36.1c-15.8,7.6-29.6,19.8-39,36.1 s-13.1,34.3-11.8,51.8c14.5,9.9,31.9,15.7,50.8,15.7s36.3-5.8,50.8-15.7C234.6,205.6,230.9,187.6,221.5,171.3z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"190\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"204\"></text>\n      </g>\n    </g>\n\n    <!-- 4 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"4\">\n      <g data-targets=\"0\">\n        <path\n          class=\"part\"\n          d=\"M247.2,98.5c16.1-1.5,31.3,0.5,44.4,5.9c-2.6-8.9-6.9-17-12.9-24.2c-21-25-58.1-31.2-96.2-19.7 c19.7,5.9,39.6,16.6,57.7,31.7C242.6,94.3,244.9,96.4,247.2,98.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"244\" y=\"75\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"244\" y=\"89\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path\n          class=\"part\"\n          d=\"M291.6,104.4c5,17.1,3.9,36.8-2.8,56.5c10.1,30,7.5,59.8-10,80.7c-7,8.4-15.9,14.7-26,18.9 c-2.6,8.9-6.9,17-12.9,24.2c-13.7,16.3-34.2,24.6-57.3,25.2c30.8,0.9,66.2-11.8,96.5-37.2c53.1-44.6,70.4-111.5,38.5-149.5 C310.6,114.9,301.7,108.6,291.6,104.4z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"312\" y=\"160\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"312\" y=\"174\"></text>\n      </g>\n      <g data-targets=\"2\">\n        <path\n          class=\"part\"\n          d=\"M125.2,284.8c-6-7.2-10.3-15.3-12.9-24.2c-10.1-4.2-19-10.5-26-18.9c-17.6-21-20.2-50.8-10-80.7 c-6.7-19.8-7.8-39.4-2.8-56.5c-10.1,4.2-19,10.5-26,18.9c-31.9,38-14.6,104.9,38.5,149.5c30.3,25.4,65.8,38.1,96.5,37.2 C159.3,309.4,138.8,301.1,125.2,284.8z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"53\" y=\"160\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"53\" y=\"174\"></text>\n      </g>\n      <g data-targets=\"3\">\n        <path\n          class=\"part\"\n          d=\"M117.8,98.5c2.3-2.1,4.6-4.2,7-6.3c18.1-15.2,38-25.8,57.7-31.7c-38.1-11.5-75.2-5.3-96.2,19.7 c-6,7.2-10.3,15.3-12.9,24.2C86.5,99,101.8,97,117.8,98.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"121\" y=\"75\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"121\" y=\"89\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path\n          class=\"part\"\n          d=\"M247.2,98.5c20,18.7,34.2,40.6,41.6,62.5c6.7-19.8,7.8-39.4,2.8-56.5C278.5,99,263.2,97,247.2,98.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"280\" y=\"113\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"280\" y=\"127\"></text>\n      </g>\n      <g data-targets=\"0,2\">\n        <path\n          class=\"part\"\n          d=\"M111.5,217.2C94.8,200,82.8,180.4,76.2,161c-10.1,30-7.5,59.8,10,80.7c7,8.4,15.9,14.7,26,18.9 C108.4,247.3,108.2,232.5,111.5,217.2z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"92\" y=\"217\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"92\" y=\"231\"></text>\n      </g>\n      <g data-targets=\"0,3\">\n        <path\n          class=\"part\"\n          d=\"M117.8,98.5c21.1,1.9,43.6,9.7,64.7,23.1c21.1-13.4,43.6-21.2,64.7-23.1c-2.3-2.1-4.6-4.2-7-6.3 c-18.1-15.2-38-25.8-57.7-31.7c-19.7,5.9-39.6,16.6-57.7,31.7C122.4,94.3,120.1,96.4,117.8,98.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"91\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"105\"></text>\n      </g>\n      <g data-targets=\"1,2\">\n        <path\n          class=\"part\"\n          d=\"M239.8,284.8c6-7.2,10.3-15.3,12.9-24.2c-20,8.3-44.9,8.5-70.2,0.9c-25.3,7.6-50.2,7.5-70.2-0.9 c2.6,8.9,6.9,17,12.9,24.2c13.7,16.3,34.2,24.6,57.3,25.2C205.7,309.4,226.2,301.1,239.8,284.8z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"283\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"297\"></text>\n      </g>\n      <g data-targets=\"1,3\">\n        <path\n          class=\"part\"\n          d=\"M252.7,260.6c10.1-4.2,19-10.5,26-18.9c17.6-21,20.2-50.8,10-80.7c-6.6,19.5-18.5,39-35.2,56.3 C256.8,232.5,256.6,247.3,252.7,260.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"273\" y=\"217\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"273\" y=\"231\"></text>\n      </g>\n      <g data-targets=\"2,3\">\n        <path\n          class=\"part\"\n          d=\"M76.2,161c7.4-21.8,21.5-43.8,41.6-62.5c-16.1-1.5-31.3,0.5-44.4,5.9C68.4,121.6,69.6,141.2,76.2,161z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"85\" y=\"113\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"85\" y=\"127\"></text>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path\n          class=\"part\"\n          d=\"M111.5,217.2c-3.2,15.2-3.1,30,0.8,43.3c20,8.3,44.9,8.5,70.2,0.9c-19.7-5.9-39.6-16.6-57.7-31.7 C120.1,225.7,115.6,221.5,111.5,217.2z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"134\" y=\"251\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"134\" y=\"265\"></text>\n      </g>\n      <g data-targets=\"0,1,3\">\n        <path\n          class=\"part\"\n          d=\"M247.2,98.5c-21.1,1.9-43.6,9.7-64.7,23.1c6.4,4.1,12.7,8.6,18.8,13.7c28.1,23.6,46.2,53.4,52.2,81.9 c16.7-17.3,28.6-36.8,35.2-56.3C281.4,139.1,267.2,117.2,247.2,98.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"246\" y=\"143\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"246\" y=\"157\"></text>\n      </g>\n      <g data-targets=\"0,2,3\">\n        <path\n          class=\"part\"\n          d=\"M163.7,135.3c6.1-5.1,12.4-9.7,18.8-13.7c-21.1-13.4-43.6-21.2-64.7-23.1c-20,18.7-34.2,40.6-41.6,62.5 c6.6,19.5,18.5,39,35.2,56.3C117.5,188.7,135.6,158.9,163.7,135.3z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"119\" y=\"143\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"119\" y=\"157\"></text>\n      </g>\n      <g data-targets=\"1,2,3\">\n        <path\n          class=\"part\"\n          d=\"M253.5,217.2c-4.2,4.3-8.6,8.5-13.4,12.5c-18.1,15.2-38,25.8-57.7,31.7c25.3,7.6,50.2,7.5,70.2-0.9 C256.6,247.3,256.8,232.5,253.5,217.2z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"231\" y=\"251\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"231\" y=\"265\"></text>\n      </g>\n      <g data-targets=\"0,1,2,3\">\n        <path\n          class=\"part\"\n          d=\"M253.5,217.2c-6.1-28.5-24.1-58.3-52.2-81.9c-6.1-5.1-12.4-9.7-18.8-13.7c-6.4,4.1-12.7,8.6-18.8,13.7 c-28.1,23.6-46.2,53.4-52.2,81.9c4.2,4.3,8.6,8.5,13.4,12.5c18.1,15.2,38,25.8,57.7,31.7c19.7-5.9,39.6-16.6,57.7-31.7 C244.9,225.7,249.4,221.5,253.5,217.2z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"190\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"204\"></text>\n      </g>\n    </g>\n\n    <!-- 5 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"5\">\n      <g data-targets=\"0\">\n        <path\n          class=\"part\"\n          d=\"M234.9,81.5c9.7,7,15.5,18.2,17.7,32.2c4.4-0.3,8.7-0.4,12.9-0.5C255.3,55,227.6,13.2,195,13.2 c-26.8,0-50.3,28.2-63.5,70.6c9.3,1.3,18.8,3.2,28.5,5.7C189.3,72.5,216.9,68.5,234.9,81.5z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"196\" y=\"50\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"196\" y=\"64\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path\n          class=\"part\"\n          d=\"M351.2,151.8c-8.2-25.3-41.8-38.9-85.7-38.6c1.8,10.1,3,20.7,3.7,31.7c24.1,22.2,35.7,46.6,29,67.3 c-3.7,11.4-12.6,20.4-25.3,26.9c1.5,3.8,2.8,7.5,4.1,11.2C329.8,222.6,361.4,183,351.2,151.8z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"314\" y=\"158\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"314\" y=\"172\"></text>\n      </g>\n      <g data-targets=\"2\">\n        <path\n          class=\"part\"\n          d=\"M195,312.3c-12.1,0-23.5-5.8-33.6-16c-3.5,2.9-7,5.6-10.4,8.2c42.5,41.2,89.6,58.7,116,39.5 c21.6-15.7,24.1-52,10.1-93.7c-8.3,4.3-17,8.4-26.3,12.1C237.1,293,217.2,312.3,195,312.3z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"240\" y=\"321\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"240\" y=\"335\"></text>\n      </g>\n      <g data-targets=\"3\">\n        <path\n          class=\"part\"\n          d=\"M129.9,281.7c-32.6-3.8-56.4-16.7-63.2-37.4c-3.6-11.2-1.9-23.4,4.2-35.8c-3.6-2.3-7-4.6-10.4-7 c-25.8,53-27.8,102.9-1.5,122c21.5,15.6,56.6,6.9,91.8-19C143.8,297.6,136.7,289.9,129.9,281.7z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"88\" y=\"295\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"88\" y=\"309\"></text>\n      </g>\n      <g data-targets=\"4\">\n        <path\n          class=\"part\"\n          d=\"M91.1,102c9.9-7.2,22.8-9.2,37.2-6.7c1-4,2.1-7.8,3.3-11.6c-58.9-8.5-107.6,4.9-117.8,36.1 c-8.2,25.3,11.1,56.2,46.8,81.7c4.3-8.8,9.2-17.6,14.7-26.4C68.4,142.3,73.2,115.1,91.1,102z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"46\" y=\"125\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"46\" y=\"139\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path\n          class=\"part\"\n          d=\"M253.6,132.1c5.7,4.2,10.9,8.4,15.6,12.8c-0.7-11-1.9-21.6-3.7-31.7c-4.2,0-8.5,0.2-12.9,0.5 C253.6,119.4,253.9,125.6,253.6,132.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"261\" y=\"124\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"261\" y=\"138\"></text>\n      </g>\n      <g data-targets=\"0,2\">\n        <path\n          class=\"part\"\n          d=\"M177.9,281.2c-5.5,5.4-11,10.5-16.6,15.1c10.1,10.2,21.5,16,33.6,16c22.2,0,42.1-19.3,55.7-49.9 c-6,2.4-12.2,4.7-18.6,6.8C213.5,275.2,195.2,279.2,177.9,281.2z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"199\" y=\"292\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"199\" y=\"306\"></text>\n      </g>\n      <g data-targets=\"0,3\">\n        <path\n          class=\"part\"\n          d=\"M228.9,116.4c8.1-1.3,16-2.2,23.7-2.7c-2.2-14-8.1-25.1-17.7-32.2c-18-13.1-45.7-9.1-74.9,7.9 c6.3,1.6,12.7,3.4,19.1,5.5C197.2,100.8,214,108.2,228.9,116.4z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"214\" y=\"90\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"214\" y=\"104\"></text>\n      </g>\n      <g data-targets=\"0,4\">\n        <path\n          class=\"part\"\n          d=\"M144.3,99.6c5.2-3.8,10.5-7.2,15.7-10.2c-9.7-2.5-19.2-4.3-28.5-5.7c-1.2,3.7-2.2,7.6-3.3,11.6 C133.4,96.2,138.8,97.6,144.3,99.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"140\" y=\"89\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"140\" y=\"103\"></text>\n      </g>\n      <g data-targets=\"1,2\">\n        <path\n          class=\"part\"\n          d=\"M257.4,245.3c-2,6-4.2,11.8-6.6,17.1c9.2-3.7,18-7.7,26.3-12.1c-1.2-3.7-2.6-7.4-4.1-11.2 C268.2,241.5,263,243.6,257.4,245.3z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"264\" y=\"248\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"264\" y=\"262\"></text>\n      </g>\n      <g data-targets=\"1,3\">\n        <path\n          class=\"part\"\n          d=\"M90.5,219.6c-6.9-3.5-13.4-7.3-19.6-11.1c-6.1,12.4-7.8,24.6-4.2,35.8c6.7,20.7,30.6,33.6,63.2,37.4 c-3.9-4.7-7.7-9.6-11.4-14.7C107.1,251.4,97.8,235.3,90.5,219.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"86\" y=\"243\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"86\" y=\"257\"></text>\n      </g>\n      <g data-targets=\"1,4\">\n        <path\n          class=\"part\"\n          d=\"M264.2,219.6c3.3,6.6,6.2,13.1,8.8,19.6c12.7-6.5,21.6-15.5,25.3-26.9c6.7-20.7-4.9-45.1-29-67.3 c0.3,5.8,0.5,11.8,0.5,17.8C269.8,182.9,267.8,202.1,264.2,219.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"282\" y=\"201\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"282\" y=\"215\"></text>\n      </g>\n      <g data-targets=\"2,3\">\n        <path\n          class=\"part\"\n          d=\"M150.4,282.8c-7.1,0-14-0.4-20.5-1.2c6.8,8.2,13.8,15.9,21,22.8c3.5-2.6,7-5.3,10.4-8.2 C157.5,292.4,153.9,287.9,150.4,282.8z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"148\" y=\"290\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"148\" y=\"304\"></text>\n      </g>\n      <g data-targets=\"2,4\">\n        <path\n          class=\"part\"\n          d=\"M123.9,116.4c1.2-7.3,2.7-14.3,4.4-21.1c-14.4-2.5-27.3-0.5-37.2,6.7c-17.9,13-22.7,40.3-15.8,73.1 c3.5-5.5,7.2-11.1,11.2-16.6C98.2,142.5,110.9,128.4,123.9,116.4z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"99\" y=\"114\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"99\" y=\"128\"></text>\n      </g>\n      <g data-targets=\"3,4\">\n        <path\n          class=\"part\"\n          d=\"M80.3,193.7c-2-6.3-3.7-12.5-5-18.6c-5.5,8.8-10.5,17.6-14.7,26.4c3.3,2.4,6.8,4.7,10.4,7 C73.4,203.6,76.5,198.6,80.3,193.7z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"71\" y=\"190\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"71\" y=\"204\"></text>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path\n          class=\"part\"\n          d=\"M204.4,250.6c-8.4,11.2-17.3,21.4-26.5,30.6c17.3-2,35.6-6,54.2-12c6.4-2.1,12.6-4.4,18.6-6.8 c2.4-5.4,4.6-11.1,6.6-17.1C242.4,249.7,224.3,251.5,204.4,250.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"220\" y=\"259\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"220\" y=\"273\"></text>\n      </g>\n      <g data-targets=\"0,1,3\">\n        <path\n          class=\"part\"\n          d=\"M253.6,132.1c0.3-6.5-0.1-12.7-1-18.4c-7.7,0.5-15.6,1.4-23.7,2.7C237.9,121.4,246.1,126.6,253.6,132.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"244\" y=\"117\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"244\" y=\"131\"></text>\n      </g>\n      <g data-targets=\"0,1,4\">\n        <path\n          class=\"part\"\n          d=\"M242.3,183c8.5,12.1,15.8,24.4,21.9,36.6c3.6-17.5,5.6-36.7,5.6-56.8c0-6-0.2-12-0.5-17.8 c-4.7-4.4-10-8.6-15.6-12.8C253,147.5,249.1,164.8,242.3,183z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"257\" y=\"177\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"257\" y=\"191\"></text>\n      </g>\n      <g data-targets=\"0,2,3\">\n        <path\n          class=\"part\"\n          d=\"M150.4,282.8c3.4,5.1,7.1,9.6,10.9,13.5c5.6-4.6,11.1-9.7,16.6-15.1C168.4,282.3,159.2,282.9,150.4,282.8z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"164\" y=\"285\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"164\" y=\"299\"></text>\n      </g>\n      <g data-targets=\"0,2,4\">\n        <path\n          class=\"part\"\n          d=\"M144.3,99.6c-5.5-2-10.9-3.5-16.1-4.3c-1.7,6.8-3.2,13.8-4.4,21.1C130.7,110.2,137.5,104.6,144.3,99.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"131\" y=\"102\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"131\" y=\"116\"></text>\n      </g>\n      <g data-targets=\"0,3,4\">\n        <path\n          class=\"part\"\n          d=\"M228.9,116.4c-14.9-8.3-31.7-15.6-49.8-21.5c-6.4-2.1-12.8-3.9-19.1-5.5c-5.2,3-10.4,6.4-15.7,10.2 c14.4,5.2,29.7,14.2,44.9,26.2C202.7,121.7,216.1,118.5,228.9,116.4z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"187\" y=\"108\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"187\" y=\"122\"></text>\n      </g>\n      <g data-targets=\"1,2,3\">\n        <path\n          class=\"part\"\n          d=\"M90.5,219.6c7.3,15.7,16.6,31.7,28,47.4c3.7,5.1,7.5,10,11.4,14.7c6.5,0.8,13.4,1.1,20.5,1.2 c-8.4-12.5-15.4-28.4-20.6-46.7C115.8,231.4,102.6,225.8,90.5,219.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"122\" y=\"253\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"122\" y=\"267\"></text>\n      </g>\n      <g data-targets=\"1,2,4\">\n        <path\n          class=\"part\"\n          d=\"M257.4,245.3c5.7-1.7,10.9-3.7,15.6-6.1c-2.6-6.5-5.5-13-8.8-19.6C262.3,228.6,260,237.2,257.4,245.3z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"265\" y=\"232\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"265\" y=\"246\"></text>\n      </g>\n      <g data-targets=\"1,3,4\">\n        <path\n          class=\"part\"\n          d=\"M80.3,193.7c-3.8,4.9-6.9,9.9-9.3,14.8c6.1,3.9,12.7,7.6,19.6,11.1C86.4,210.8,83,202.2,80.3,193.7z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"78\" y=\"205\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"78\" y=\"219\"></text>\n      </g>\n      <g data-targets=\"2,3,4\">\n        <path\n          class=\"part\"\n          d=\"M120.3,157.9c0.2-14.5,1.5-28.4,3.6-41.5c-13,12-25.7,26.1-37.4,42.2c-4,5.5-7.7,11-11.2,16.6 c1.3,6,2.9,12.2,5,18.6C89.9,181.2,103.5,169,120.3,157.9z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"102\" y=\"154\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"102\" y=\"168\"></text>\n      </g>\n      <g data-targets=\"0,1,2,3\">\n        <path\n          class=\"part\"\n          d=\"M204.4,250.6c-22.2-1-46.6-5.4-71.5-13.5c-1-0.3-2-0.7-3-1c5.2,18.3,12.2,34.2,20.6,46.7 c8.8,0,18-0.5,27.5-1.6C187.1,272.1,196,261.8,204.4,250.6z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"165\" y=\"262\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"165\" y=\"276\"></text>\n      </g>\n      <g data-targets=\"0,1,2,4\">\n        <path\n          class=\"part\"\n          d=\"M242.3,183c-7.8,20.7-19.5,42.4-34.8,63.5c-1,1.4-2.1,2.8-3.1,4.1c19.9,0.9,38-1,53-5.4 c2.7-8,5-16.6,6.8-25.7C258.1,207.4,250.8,195.1,242.3,183z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"241\" y=\"222\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"241\" y=\"236\"></text>\n      </g>\n      <g data-targets=\"0,1,3,4\">\n        <path\n          class=\"part\"\n          d=\"M189.2,125.9c17.5,13.9,34.8,31.9,50.3,53.2c0.9,1.3,1.9,2.6,2.8,3.9c6.9-18.2,10.7-35.6,11.3-50.9 c-7.5-5.5-15.8-10.8-24.7-15.7C216.1,118.5,202.7,121.7,189.2,125.9z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"232\" y=\"141\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"232\" y=\"155\"></text>\n      </g>\n      <g data-targets=\"0,2,3,4\">\n        <path\n          class=\"part\"\n          d=\"M120.3,157.9c18.5-12.2,40.8-23,65.6-31c1.1-0.4,2.2-0.7,3.3-1c-15.2-12.1-30.5-21-44.9-26.2 c-6.8,5-13.7,10.6-20.4,16.8C121.8,129.5,120.5,143.5,120.3,157.9z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"147\" y=\"122\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"147\" y=\"136\"></text>\n      </g>\n      <g data-targets=\"1,2,3,4\">\n        <path\n          class=\"part\"\n          d=\"M129.8,236.1c-6.1-21.7-9.6-46.7-9.6-73.4c0-1.6,0-3.2,0.1-4.8c-16.8,11.1-30.4,23.3-40,35.8 c2.7,8.4,6.1,17.1,10.2,25.9C102.6,225.8,115.8,231.4,129.8,236.1z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"105\" y=\"198\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"105\" y=\"212\"></text>\n      </g>\n      <g data-targets=\"0,1,2,3,4\">\n        <path\n          class=\"part\"\n          d=\"M189.2,125.9c-1.1,0.3-2.2,0.7-3.3,1c-24.8,8.1-47.1,18.8-65.6,31c0,1.6-0.1,3.2-0.1,4.8 c0,26.7,3.5,51.7,9.6,73.4c1,0.3,2,0.7,3,1c24.9,8.1,49.3,12.5,71.5,13.5c1-1.4,2.1-2.7,3.1-4.1c15.3-21.1,27-42.8,34.8-63.5 c-0.9-1.3-1.8-2.6-2.8-3.9C224,157.8,206.7,139.8,189.2,125.9z\"\n        ></path>\n        <text class=\"label\" text-anchor=\"middle\" x=\"176\" y=\"187\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"176\" y=\"201\"></text>\n      </g>\n    </g>\n\n  </svg>\n  <div id=\"euler-diagram\"></div>\n\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=venn-diagram.js.map
