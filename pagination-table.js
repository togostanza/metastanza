import { H as commonjsGlobal$1, S as Stanza, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as copyHTMLSnippetToClipboardMenuItem, g as appendCustomCss, h as defineStanzaElement } from './index-39ae45f1.js';
import { t as toRefs, r as ref, c as computed, o as onMounted, a as onUnmounted, w as watch, b as createBlock, m as mergeProps, d as openBlock, e as defineComponent, h as h$1, f as onUpdated, g as createElementBlock, i as createBaseVNode, n as normalizeClass, j as createVNode, F as Fragment, k as renderList, l as createTextVNode, p as toDisplayString, q as createCommentVNode, s as resolveComponent, u as normalizeStyle, v as reactive, x as onRenderTriggered, y as withDirectives, z as vModelText, A as vModelSelect, B as withCtx, T as Transition, C as vModelCheckbox, D as createApp } from './runtime-dom.esm-bundler-bcdf4715.js';
import { l as loadData } from './load-data-bf9d5410.js';

function l(t){return -1!==[null,void 0,!1].indexOf(t)}function c(t){var e={exports:{}};return t(e,e.exports),e.exports}function f(t){return (f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var p=c((function(t,e){t.exports=function(){var t=["decimals","thousand","mark","prefix","suffix","encoder","decoder","negativeBefore","negative","edit","undo"];function e(t){return t.split("").reverse().join("")}function r(t,e){return t.substring(0,e.length)===e}function n(t,e){return t.slice(-1*e.length)===e}function i(t,e,r){if((t[e]||t[r])&&t[e]===t[r])throw new Error(e)}function o(t){return "number"==typeof t&&isFinite(t)}function a(t,e){return t=t.toString().split("e"),(+((t=(t=Math.round(+(t[0]+"e"+(t[1]?+t[1]+e:e)))).toString().split("e"))[0]+"e"+(t[1]?+t[1]-e:-e))).toFixed(e)}function s(t,r,n,i,s,u,l,c,f,p,d,h){var m,v,g,b=h,y="",x="";return u&&(h=u(h)),!!o(h)&&(!1!==t&&0===parseFloat(h.toFixed(t))&&(h=0),h<0&&(m=!0,h=Math.abs(h)),!1!==t&&(h=a(h,t)),-1!==(h=h.toString()).indexOf(".")?(g=(v=h.split("."))[0],n&&(y=n+v[1])):g=h,r&&(g=e(g).match(/.{1,3}/g),g=e(g.join(e(r)))),m&&c&&(x+=c),i&&(x+=i),m&&f&&(x+=f),x+=g,x+=y,s&&(x+=s),p&&(x=p(x,b)),x)}function u(t,e,i,a,s,u,l,c,f,p,d,h){var m,v="";return d&&(h=d(h)),!(!h||"string"!=typeof h)&&(c&&r(h,c)&&(h=h.replace(c,""),m=!0),a&&r(h,a)&&(h=h.replace(a,"")),f&&r(h,f)&&(h=h.replace(f,""),m=!0),s&&n(h,s)&&(h=h.slice(0,-1*s.length)),e&&(h=h.split(e).join("")),i&&(h=h.replace(i,".")),m&&(v+="-"),""!==(v=(v+=h).replace(/[^0-9\.\-.]/g,""))&&(v=Number(v),l&&(v=l(v)),!!o(v)&&v))}function l(e){var r,n,o,a={};for(void 0===e.suffix&&(e.suffix=e.postfix),r=0;r<t.length;r+=1)if(void 0===(o=e[n=t[r]]))"negative"!==n||a.negativeBefore?"mark"===n&&"."!==a.thousand?a[n]=".":a[n]=!1:a[n]="-";else if("decimals"===n){if(!(o>=0&&o<8))throw new Error(n);a[n]=o;}else if("encoder"===n||"decoder"===n||"edit"===n||"undo"===n){if("function"!=typeof o)throw new Error(n);a[n]=o;}else {if("string"!=typeof o)throw new Error(n);a[n]=o;}return i(a,"mark","thousand"),i(a,"prefix","negative"),i(a,"prefix","negativeBefore"),a}function c(e,r,n){var i,o=[];for(i=0;i<t.length;i+=1)o.push(e[t[i]]);return o.push(n),r.apply("",o)}function p(t){if(!(this instanceof p))return new p(t);"object"===f(t)&&(t=l(t),this.to=function(e){return c(t,s,e)},this.from=function(e){return c(t,u,e)});}return p}();}));function d$1(t){return (d$1="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var h=c((function(t,e){t.exports=function(){var t="14.6.3";function e(t){return "object"===d$1(t)&&"function"==typeof t.to&&"function"==typeof t.from}function r(t){t.parentElement.removeChild(t);}function n(t){return null!=t}function i(t){t.preventDefault();}function o(t){return t.filter((function(t){return !this[t]&&(this[t]=!0)}),{})}function a(t,e){return Math.round(t/e)*e}function s(t,e){var r=t.getBoundingClientRect(),n=t.ownerDocument,i=n.documentElement,o=g(n);return /webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(o.x=0),e?r.top+o.y-i.clientTop:r.left+o.x-i.clientLeft}function u(t){return "number"==typeof t&&!isNaN(t)&&isFinite(t)}function l(t,e,r){r>0&&(h(t,e),setTimeout((function(){m(t,e);}),r));}function c(t){return Math.max(Math.min(t,100),0)}function f(t){return Array.isArray(t)?t:[t]}function p(t){var e=(t=String(t)).split(".");return e.length>1?e[1].length:0}function h(t,e){t.classList&&!/\s/.test(e)?t.classList.add(e):t.className+=" "+e;}function m(t,e){t.classList&&!/\s/.test(e)?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ");}function v(t,e){return t.classList?t.classList.contains(e):new RegExp("\\b"+e+"\\b").test(t.className)}function g(t){var e=void 0!==window.pageXOffset,r="CSS1Compat"===(t.compatMode||"");return {x:e?window.pageXOffset:r?t.documentElement.scrollLeft:t.body.scrollLeft,y:e?window.pageYOffset:r?t.documentElement.scrollTop:t.body.scrollTop}}function b(){return window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"}}function y(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0;}});window.addEventListener("test",null,e);}catch(t){}return t}function x(){return window.CSS&&CSS.supports&&CSS.supports("touch-action","none")}function S(t,e){return 100/(e-t)}function w(t,e,r){return 100*e/(t[r+1]-t[r])}function E(t,e){return w(t,t[0]<0?e+Math.abs(t[0]):e-t[0],0)}function C(t,e){return e*(t[1]-t[0])/100+t[0]}function N(t,e){for(var r=1;t>=e[r];)r+=1;return r}function P(t,e,r){if(r>=t.slice(-1)[0])return 100;var n=N(r,t),i=t[n-1],o=t[n],a=e[n-1],s=e[n];return a+E([i,o],r)/S(a,s)}function A(t,e,r){if(r>=100)return t.slice(-1)[0];var n=N(r,e),i=t[n-1],o=t[n],a=e[n-1];return C([i,o],(r-a)*S(a,e[n]))}function k(t,e,r,n){if(100===n)return n;var i=N(n,t),o=t[i-1],s=t[i];return r?n-o>(s-o)/2?s:o:e[i-1]?t[i-1]+a(n-t[i-1],e[i-1]):n}function U(e,r,n){var i;if("number"==typeof r&&(r=[r]),!Array.isArray(r))throw new Error("noUiSlider ("+t+"): 'range' contains invalid value.");if(!u(i="min"===e?0:"max"===e?100:parseFloat(e))||!u(r[0]))throw new Error("noUiSlider ("+t+"): 'range' value isn't numeric.");n.xPct.push(i),n.xVal.push(r[0]),i?n.xSteps.push(!isNaN(r[1])&&r[1]):isNaN(r[1])||(n.xSteps[0]=r[1]),n.xHighestCompleteStep.push(0);}function V(t,e,r){if(e)if(r.xVal[t]!==r.xVal[t+1]){r.xSteps[t]=w([r.xVal[t],r.xVal[t+1]],e,0)/S(r.xPct[t],r.xPct[t+1]);var n=(r.xVal[t+1]-r.xVal[t])/r.xNumSteps[t],i=Math.ceil(Number(n.toFixed(3))-1),o=r.xVal[t]+r.xNumSteps[t]*i;r.xHighestCompleteStep[t]=o;}else r.xSteps[t]=r.xHighestCompleteStep[t]=r.xVal[t];}function M(t,e,r){var n;this.xPct=[],this.xVal=[],this.xSteps=[r||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=e;var i=[];for(n in t)t.hasOwnProperty(n)&&i.push([t[n],n]);for(i.length&&"object"===d$1(i[0][0])?i.sort((function(t,e){return t[0][0]-e[0][0]})):i.sort((function(t,e){return t[0]-e[0]})),n=0;n<i.length;n++)U(i[n][1],i[n][0],this);for(this.xNumSteps=this.xSteps.slice(0),n=0;n<this.xNumSteps.length;n++)V(n,this.xNumSteps[n],this);}M.prototype.getDistance=function(e){var r,n=[];for(r=0;r<this.xNumSteps.length-1;r++){var i=this.xNumSteps[r];if(i&&e/i%1!=0)throw new Error("noUiSlider ("+t+"): 'limit', 'margin' and 'padding' of "+this.xPct[r]+"% range must be divisible by step.");n[r]=w(this.xVal,e,r);}return n},M.prototype.getAbsoluteDistance=function(t,e,r){var n,i=0;if(t<this.xPct[this.xPct.length-1])for(;t>this.xPct[i+1];)i++;else t===this.xPct[this.xPct.length-1]&&(i=this.xPct.length-2);r||t!==this.xPct[i+1]||i++;var o=1,a=e[i],s=0,u=0,l=0,c=0;for(n=r?(t-this.xPct[i])/(this.xPct[i+1]-this.xPct[i]):(this.xPct[i+1]-t)/(this.xPct[i+1]-this.xPct[i]);a>0;)s=this.xPct[i+1+c]-this.xPct[i+c],e[i+c]*o+100-100*n>100?(u=s*n,o=(a-100*n)/e[i+c],n=1):(u=e[i+c]*s/100*o,o=0),r?(l-=u,this.xPct.length+c>=1&&c--):(l+=u,this.xPct.length-c>=1&&c++),a=e[i+c]*o;return t+l},M.prototype.toStepping=function(t){return t=P(this.xVal,this.xPct,t)},M.prototype.fromStepping=function(t){return A(this.xVal,this.xPct,t)},M.prototype.getStep=function(t){return t=k(this.xPct,this.xSteps,this.snap,t)},M.prototype.getDefaultStep=function(t,e,r){var n=N(t,this.xPct);return (100===t||e&&t===this.xPct[n-1])&&(n=Math.max(n-1,1)),(this.xVal[n]-this.xVal[n-1])/r},M.prototype.getNearbySteps=function(t){var e=N(t,this.xPct);return {stepBefore:{startValue:this.xVal[e-2],step:this.xNumSteps[e-2],highestStep:this.xHighestCompleteStep[e-2]},thisStep:{startValue:this.xVal[e-1],step:this.xNumSteps[e-1],highestStep:this.xHighestCompleteStep[e-1]},stepAfter:{startValue:this.xVal[e],step:this.xNumSteps[e],highestStep:this.xHighestCompleteStep[e]}}},M.prototype.countStepDecimals=function(){var t=this.xNumSteps.map(p);return Math.max.apply(null,t)},M.prototype.convert=function(t){return this.getStep(this.toStepping(t))};var D={to:function(t){return void 0!==t&&t.toFixed(2)},from:Number},O={target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",touchArea:"touch-area",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",connects:"connects",ltr:"ltr",rtl:"rtl",textDirectionLtr:"txt-dir-ltr",textDirectionRtl:"txt-dir-rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"},F={tooltips:".__tooltips",aria:".__aria"};function L(r){if(e(r))return !0;throw new Error("noUiSlider ("+t+"): 'format' requires 'to' and 'from' methods.")}function j(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'step' is not numeric.");e.singleStep=r;}function z(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'keyboardPageMultiplier' is not numeric.");e.keyboardPageMultiplier=r;}function H(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'keyboardDefaultStep' is not numeric.");e.keyboardDefaultStep=r;}function q(e,r){if("object"!==d$1(r)||Array.isArray(r))throw new Error("noUiSlider ("+t+"): 'range' is not an object.");if(void 0===r.min||void 0===r.max)throw new Error("noUiSlider ("+t+"): Missing 'min' or 'max' in 'range'.");if(r.min===r.max)throw new Error("noUiSlider ("+t+"): 'range' 'min' and 'max' cannot be equal.");e.spectrum=new M(r,e.snap,e.singleStep);}function R(e,r){if(r=f(r),!Array.isArray(r)||!r.length)throw new Error("noUiSlider ("+t+"): 'start' option is incorrect.");e.handles=r.length,e.start=r;}function T(e,r){if(e.snap=r,"boolean"!=typeof r)throw new Error("noUiSlider ("+t+"): 'snap' option must be a boolean.")}function B(e,r){if(e.animate=r,"boolean"!=typeof r)throw new Error("noUiSlider ("+t+"): 'animate' option must be a boolean.")}function _(e,r){if(e.animationDuration=r,"number"!=typeof r)throw new Error("noUiSlider ("+t+"): 'animationDuration' option must be a number.")}function X(e,r){var n,i=[!1];if("lower"===r?r=[!0,!1]:"upper"===r&&(r=[!1,!0]),!0===r||!1===r){for(n=1;n<e.handles;n++)i.push(r);i.push(!1);}else {if(!Array.isArray(r)||!r.length||r.length!==e.handles+1)throw new Error("noUiSlider ("+t+"): 'connect' option doesn't match handle count.");i=r;}e.connect=i;}function Y(e,r){switch(r){case"horizontal":e.ort=0;break;case"vertical":e.ort=1;break;default:throw new Error("noUiSlider ("+t+"): 'orientation' option is invalid.")}}function I(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'margin' option must be numeric.");0!==r&&(e.margin=e.spectrum.getDistance(r));}function $(e,r){if(!u(r))throw new Error("noUiSlider ("+t+"): 'limit' option must be numeric.");if(e.limit=e.spectrum.getDistance(r),!e.limit||e.handles<2)throw new Error("noUiSlider ("+t+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function W(e,r){var n;if(!u(r)&&!Array.isArray(r))throw new Error("noUiSlider ("+t+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(Array.isArray(r)&&2!==r.length&&!u(r[0])&&!u(r[1]))throw new Error("noUiSlider ("+t+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(0!==r){for(Array.isArray(r)||(r=[r,r]),e.padding=[e.spectrum.getDistance(r[0]),e.spectrum.getDistance(r[1])],n=0;n<e.spectrum.xNumSteps.length-1;n++)if(e.padding[0][n]<0||e.padding[1][n]<0)throw new Error("noUiSlider ("+t+"): 'padding' option must be a positive number(s).");var i=r[0]+r[1],o=e.spectrum.xVal[0];if(i/(e.spectrum.xVal[e.spectrum.xVal.length-1]-o)>1)throw new Error("noUiSlider ("+t+"): 'padding' option must not exceed 100% of the range.")}}function G(e,r){switch(r){case"ltr":e.dir=0;break;case"rtl":e.dir=1;break;default:throw new Error("noUiSlider ("+t+"): 'direction' option was not recognized.")}}function J(e,r){if("string"!=typeof r)throw new Error("noUiSlider ("+t+"): 'behaviour' must be a string containing options.");var n=r.indexOf("tap")>=0,i=r.indexOf("drag")>=0,o=r.indexOf("fixed")>=0,a=r.indexOf("snap")>=0,s=r.indexOf("hover")>=0,u=r.indexOf("unconstrained")>=0;if(o){if(2!==e.handles)throw new Error("noUiSlider ("+t+"): 'fixed' behaviour must be used with 2 handles");I(e,e.start[1]-e.start[0]);}if(u&&(e.margin||e.limit))throw new Error("noUiSlider ("+t+"): 'unconstrained' behaviour cannot be used with margin or limit");e.events={tap:n||a,drag:i,fixed:o,snap:a,hover:s,unconstrained:u};}function K(e,r){if(!1!==r)if(!0===r){e.tooltips=[];for(var n=0;n<e.handles;n++)e.tooltips.push(!0);}else {if(e.tooltips=f(r),e.tooltips.length!==e.handles)throw new Error("noUiSlider ("+t+"): must pass a formatter for all handles.");e.tooltips.forEach((function(e){if("boolean"!=typeof e&&("object"!==d$1(e)||"function"!=typeof e.to))throw new Error("noUiSlider ("+t+"): 'tooltips' must be passed a formatter or 'false'.")}));}}function Q(t,e){t.ariaFormat=e,L(e);}function Z(t,e){t.format=e,L(e);}function tt(e,r){if(e.keyboardSupport=r,"boolean"!=typeof r)throw new Error("noUiSlider ("+t+"): 'keyboardSupport' option must be a boolean.")}function et(t,e){t.documentElement=e;}function rt(e,r){if("string"!=typeof r&&!1!==r)throw new Error("noUiSlider ("+t+"): 'cssPrefix' must be a string or `false`.");e.cssPrefix=r;}function nt(e,r){if("object"!==d$1(r))throw new Error("noUiSlider ("+t+"): 'cssClasses' must be an object.");if("string"==typeof e.cssPrefix)for(var n in e.cssClasses={},r)r.hasOwnProperty(n)&&(e.cssClasses[n]=e.cssPrefix+r[n]);else e.cssClasses=r;}function it(e){var r={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:D,format:D},i={step:{r:!1,t:j},keyboardPageMultiplier:{r:!1,t:z},keyboardDefaultStep:{r:!1,t:H},start:{r:!0,t:R},connect:{r:!0,t:X},direction:{r:!0,t:G},snap:{r:!1,t:T},animate:{r:!1,t:B},animationDuration:{r:!1,t:_},range:{r:!0,t:q},orientation:{r:!1,t:Y},margin:{r:!1,t:I},limit:{r:!1,t:$},padding:{r:!1,t:W},behaviour:{r:!0,t:J},ariaFormat:{r:!1,t:Q},format:{r:!1,t:Z},tooltips:{r:!1,t:K},keyboardSupport:{r:!0,t:tt},documentElement:{r:!1,t:et},cssPrefix:{r:!0,t:rt},cssClasses:{r:!0,t:nt}},o={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",keyboardSupport:!0,cssPrefix:"noUi-",cssClasses:O,keyboardPageMultiplier:5,keyboardDefaultStep:10};e.format&&!e.ariaFormat&&(e.ariaFormat=e.format),Object.keys(i).forEach((function(a){if(!n(e[a])&&void 0===o[a]){if(i[a].r)throw new Error("noUiSlider ("+t+"): '"+a+"' is required.");return !0}i[a].t(r,n(e[a])?e[a]:o[a]);})),r.pips=e.pips;var a=document.createElement("div"),s=void 0!==a.style.msTransform,u=void 0!==a.style.transform;r.transformRule=u?"transform":s?"msTransform":"webkitTransform";var l=[["left","top"],["right","bottom"]];return r.style=l[r.dir][r.ort],r}function ot(e,n,a){var u,p,d,S,w,E,C=b(),N=x()&&y(),P=e,A=n.spectrum,k=[],U=[],V=[],M=0,D={},O=e.ownerDocument,L=n.documentElement||O.documentElement,j=O.body,z=-1,H=0,q=1,R=2,T="rtl"===O.dir||1===n.ort?0:100;function B(t,e){var r=O.createElement("div");return e&&h(r,e),t.appendChild(r),r}function _(t,e){var r=B(t,n.cssClasses.origin),i=B(r,n.cssClasses.handle);return B(i,n.cssClasses.touchArea),i.setAttribute("data-handle",e),n.keyboardSupport&&(i.setAttribute("tabindex","0"),i.addEventListener("keydown",(function(t){return vt(t,e)}))),i.setAttribute("role","slider"),i.setAttribute("aria-orientation",n.ort?"vertical":"horizontal"),0===e?h(i,n.cssClasses.handleLower):e===n.handles-1&&h(i,n.cssClasses.handleUpper),r}function X(t,e){return !!e&&B(t,n.cssClasses.connect)}function Y(t,e){var r=B(e,n.cssClasses.connects);p=[],(d=[]).push(X(r,t[0]));for(var i=0;i<n.handles;i++)p.push(_(e,i)),V[i]=i,d.push(X(r,t[i+1]));}function I(t){return h(t,n.cssClasses.target),0===n.dir?h(t,n.cssClasses.ltr):h(t,n.cssClasses.rtl),0===n.ort?h(t,n.cssClasses.horizontal):h(t,n.cssClasses.vertical),h(t,"rtl"===getComputedStyle(t).direction?n.cssClasses.textDirectionRtl:n.cssClasses.textDirectionLtr),B(t,n.cssClasses.base)}function $(t,e){return !!n.tooltips[e]&&B(t.firstChild,n.cssClasses.tooltip)}function W(){return P.hasAttribute("disabled")}function G(t){return p[t].hasAttribute("disabled")}function J(){w&&(xt("update"+F.tooltips),w.forEach((function(t){t&&r(t);})),w=null);}function K(){J(),w=p.map($),bt("update"+F.tooltips,(function(t,e,r){if(w[e]){var i=t[e];!0!==n.tooltips[e]&&(i=n.tooltips[e].to(r[e])),w[e].innerHTML=i;}}));}function Q(){xt("update"+F.aria),bt("update"+F.aria,(function(t,e,r,i,o){V.forEach((function(t){var e=p[t],i=wt(U,t,0,!0,!0,!0),a=wt(U,t,100,!0,!0,!0),s=o[t],u=n.ariaFormat.to(r[t]);i=A.fromStepping(i).toFixed(1),a=A.fromStepping(a).toFixed(1),s=A.fromStepping(s).toFixed(1),e.children[0].setAttribute("aria-valuemin",i),e.children[0].setAttribute("aria-valuemax",a),e.children[0].setAttribute("aria-valuenow",s),e.children[0].setAttribute("aria-valuetext",u);}));}));}function Z(e,r,n){if("range"===e||"steps"===e)return A.xVal;if("count"===e){if(r<2)throw new Error("noUiSlider ("+t+"): 'values' (>= 2) required for mode 'count'.");var i=r-1,o=100/i;for(r=[];i--;)r[i]=i*o;r.push(100),e="positions";}return "positions"===e?r.map((function(t){return A.fromStepping(n?A.getStep(t):t)})):"values"===e?n?r.map((function(t){return A.fromStepping(A.getStep(A.toStepping(t)))})):r:void 0}function tt(t,e,r){function n(t,e){return (t+e).toFixed(7)/1}var i={},a=A.xVal[0],s=A.xVal[A.xVal.length-1],u=!1,l=!1,c=0;return (r=o(r.slice().sort((function(t,e){return t-e}))))[0]!==a&&(r.unshift(a),u=!0),r[r.length-1]!==s&&(r.push(s),l=!0),r.forEach((function(o,a){var s,f,p,d,h,m,v,g,b,y,x=o,S=r[a+1],w="steps"===e;if(w&&(s=A.xNumSteps[a]),s||(s=S-x),!1!==x)for(void 0===S&&(S=x),s=Math.max(s,1e-7),f=x;f<=S;f=n(f,s)){for(g=(h=(d=A.toStepping(f))-c)/t,y=h/(b=Math.round(g)),p=1;p<=b;p+=1)i[(m=c+p*y).toFixed(5)]=[A.fromStepping(m),0];v=r.indexOf(f)>-1?q:w?R:H,!a&&u&&f!==S&&(v=0),f===S&&l||(i[d.toFixed(5)]=[f,v]),c=d;}})),i}function et(t,e,r){var i=O.createElement("div"),o=[];o[H]=n.cssClasses.valueNormal,o[q]=n.cssClasses.valueLarge,o[R]=n.cssClasses.valueSub;var a=[];a[H]=n.cssClasses.markerNormal,a[q]=n.cssClasses.markerLarge,a[R]=n.cssClasses.markerSub;var s=[n.cssClasses.valueHorizontal,n.cssClasses.valueVertical],u=[n.cssClasses.markerHorizontal,n.cssClasses.markerVertical];function l(t,e){var r=e===n.cssClasses.value,i=r?o:a;return e+" "+(r?s:u)[n.ort]+" "+i[t]}function c(t,o,a){if((a=e?e(o,a):a)!==z){var s=B(i,!1);s.className=l(a,n.cssClasses.marker),s.style[n.style]=t+"%",a>H&&((s=B(i,!1)).className=l(a,n.cssClasses.value),s.setAttribute("data-value",o),s.style[n.style]=t+"%",s.innerHTML=r.to(o));}}return h(i,n.cssClasses.pips),h(i,0===n.ort?n.cssClasses.pipsHorizontal:n.cssClasses.pipsVertical),Object.keys(t).forEach((function(e){c(e,t[e][0],t[e][1]);})),i}function rt(){S&&(r(S),S=null);}function nt(t){rt();var e=t.mode,r=t.density||1,n=t.filter||!1,i=tt(r,e,Z(e,t.values||!1,t.stepped||!1)),o=t.format||{to:Math.round};return S=P.appendChild(et(i,n,o))}function ot(){var t=u.getBoundingClientRect(),e="offset"+["Width","Height"][n.ort];return 0===n.ort?t.width||u[e]:t.height||u[e]}function at(t,e,r,i){var o=function(o){return !!(o=st(o,i.pageOffset,i.target||e))&&!(W()&&!i.doNotReject)&&!(v(P,n.cssClasses.tap)&&!i.doNotReject)&&!(t===C.start&&void 0!==o.buttons&&o.buttons>1)&&(!i.hover||!o.buttons)&&(N||o.preventDefault(),o.calcPoint=o.points[n.ort],void r(o,i))},a=[];return t.split(" ").forEach((function(t){e.addEventListener(t,o,!!N&&{passive:!0}),a.push([t,o]);})),a}function st(t,e,r){var n,i,o=0===t.type.indexOf("touch"),a=0===t.type.indexOf("mouse"),s=0===t.type.indexOf("pointer");if(0===t.type.indexOf("MSPointer")&&(s=!0),"mousedown"===t.type&&!t.buttons&&!t.touches)return !1;if(o){var u=function(t){return t.target===r||r.contains(t.target)||t.target.shadowRoot&&t.target.shadowRoot.contains(r)};if("touchstart"===t.type){var l=Array.prototype.filter.call(t.touches,u);if(l.length>1)return !1;n=l[0].pageX,i=l[0].pageY;}else {var c=Array.prototype.find.call(t.changedTouches,u);if(!c)return !1;n=c.pageX,i=c.pageY;}}return e=e||g(O),(a||s)&&(n=t.clientX+e.x,i=t.clientY+e.y),t.pageOffset=e,t.points=[n,i],t.cursor=a||s,t}function ut(t){var e=100*(t-s(u,n.ort))/ot();return e=c(e),n.dir?100-e:e}function lt(t){var e=100,r=!1;return p.forEach((function(n,i){if(!G(i)){var o=U[i],a=Math.abs(o-t);(a<e||a<=e&&t>o||100===a&&100===e)&&(r=i,e=a);}})),r}function ct(t,e){"mouseout"===t.type&&"HTML"===t.target.nodeName&&null===t.relatedTarget&&pt(t,e);}function ft(t,e){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===t.buttons&&0!==e.buttonsProperty)return pt(t,e);var r=(n.dir?-1:1)*(t.calcPoint-e.startCalcPoint);Ct(r>0,100*r/e.baseSize,e.locations,e.handleNumbers);}function pt(t,e){e.handle&&(m(e.handle,n.cssClasses.active),M-=1),e.listeners.forEach((function(t){L.removeEventListener(t[0],t[1]);})),0===M&&(m(P,n.cssClasses.drag),At(),t.cursor&&(j.style.cursor="",j.removeEventListener("selectstart",i))),e.handleNumbers.forEach((function(t){St("change",t),St("set",t),St("end",t);}));}function dt(t,e){if(e.handleNumbers.some(G))return !1;var r;1===e.handleNumbers.length&&(r=p[e.handleNumbers[0]].children[0],M+=1,h(r,n.cssClasses.active)),t.stopPropagation();var o=[],a=at(C.move,L,ft,{target:t.target,handle:r,listeners:o,startCalcPoint:t.calcPoint,baseSize:ot(),pageOffset:t.pageOffset,handleNumbers:e.handleNumbers,buttonsProperty:t.buttons,locations:U.slice()}),s=at(C.end,L,pt,{target:t.target,handle:r,listeners:o,doNotReject:!0,handleNumbers:e.handleNumbers}),u=at("mouseout",L,ct,{target:t.target,handle:r,listeners:o,doNotReject:!0,handleNumbers:e.handleNumbers});o.push.apply(o,a.concat(s,u)),t.cursor&&(j.style.cursor=getComputedStyle(t.target).cursor,p.length>1&&h(P,n.cssClasses.drag),j.addEventListener("selectstart",i,!1)),e.handleNumbers.forEach((function(t){St("start",t);}));}function ht(t){t.stopPropagation();var e=ut(t.calcPoint),r=lt(e);if(!1===r)return !1;n.events.snap||l(P,n.cssClasses.tap,n.animationDuration),kt(r,e,!0,!0),At(),St("slide",r,!0),St("update",r,!0),St("change",r,!0),St("set",r,!0),n.events.snap&&dt(t,{handleNumbers:[r]});}function mt(t){var e=ut(t.calcPoint),r=A.getStep(e),n=A.fromStepping(r);Object.keys(D).forEach((function(t){"hover"===t.split(".")[0]&&D[t].forEach((function(t){t.call(E,n);}));}));}function vt(t,e){if(W()||G(e))return !1;var r=["Left","Right"],i=["Down","Up"],o=["PageDown","PageUp"],a=["Home","End"];n.dir&&!n.ort?r.reverse():n.ort&&!n.dir&&(i.reverse(),o.reverse());var s,u=t.key.replace("Arrow",""),l=u===o[0],c=u===o[1],f=u===i[0]||u===r[0]||l,p=u===i[1]||u===r[1]||c,d=u===a[0],h=u===a[1];if(!(f||p||d||h))return !0;if(t.preventDefault(),p||f){var m=n.keyboardPageMultiplier,v=f?0:1,g=jt(e)[v];if(null===g)return !1;!1===g&&(g=A.getDefaultStep(U[e],f,n.keyboardDefaultStep)),(c||l)&&(g*=m),g=Math.max(g,1e-7),g*=f?-1:1,s=k[e]+g;}else s=h?n.spectrum.xVal[n.spectrum.xVal.length-1]:n.spectrum.xVal[0];return kt(e,A.toStepping(s),!0,!0),St("slide",e),St("update",e),St("change",e),St("set",e),!1}function gt(t){t.fixed||p.forEach((function(t,e){at(C.start,t.children[0],dt,{handleNumbers:[e]});})),t.tap&&at(C.start,u,ht,{}),t.hover&&at(C.move,u,mt,{hover:!0}),t.drag&&d.forEach((function(e,r){if(!1!==e&&0!==r&&r!==d.length-1){var i=p[r-1],o=p[r],a=[e];h(e,n.cssClasses.draggable),t.fixed&&(a.push(i.children[0]),a.push(o.children[0])),a.forEach((function(t){at(C.start,t,dt,{handles:[i,o],handleNumbers:[r-1,r]});}));}}));}function bt(t,e){D[t]=D[t]||[],D[t].push(e),"update"===t.split(".")[0]&&p.forEach((function(t,e){St("update",e);}));}function yt(t){return t===F.aria||t===F.tooltips}function xt(t){var e=t&&t.split(".")[0],r=e?t.substring(e.length):t;Object.keys(D).forEach((function(t){var n=t.split(".")[0],i=t.substring(n.length);e&&e!==n||r&&r!==i||yt(i)&&r!==i||delete D[t];}));}function St(t,e,r){Object.keys(D).forEach((function(i){var o=i.split(".")[0];t===o&&D[i].forEach((function(t){t.call(E,k.map(n.format.to),e,k.slice(),r||!1,U.slice(),E);}));}));}function wt(t,e,r,i,o,a){var s;return p.length>1&&!n.events.unconstrained&&(i&&e>0&&(s=A.getAbsoluteDistance(t[e-1],n.margin,0),r=Math.max(r,s)),o&&e<p.length-1&&(s=A.getAbsoluteDistance(t[e+1],n.margin,1),r=Math.min(r,s))),p.length>1&&n.limit&&(i&&e>0&&(s=A.getAbsoluteDistance(t[e-1],n.limit,0),r=Math.min(r,s)),o&&e<p.length-1&&(s=A.getAbsoluteDistance(t[e+1],n.limit,1),r=Math.max(r,s))),n.padding&&(0===e&&(s=A.getAbsoluteDistance(0,n.padding[0],0),r=Math.max(r,s)),e===p.length-1&&(s=A.getAbsoluteDistance(100,n.padding[1],1),r=Math.min(r,s))),!((r=c(r=A.getStep(r)))===t[e]&&!a)&&r}function Et(t,e){var r=n.ort;return (r?e:t)+", "+(r?t:e)}function Ct(t,e,r,n){var i=r.slice(),o=[!t,t],a=[t,!t];n=n.slice(),t&&n.reverse(),n.length>1?n.forEach((function(t,r){var n=wt(i,t,i[t]+e,o[r],a[r],!1);!1===n?e=0:(e=n-i[t],i[t]=n);})):o=a=[!0];var s=!1;n.forEach((function(t,n){s=kt(t,r[t]+e,o[n],a[n])||s;})),s&&n.forEach((function(t){St("update",t),St("slide",t);}));}function Nt(t,e){return n.dir?100-t-e:t}function Pt(t,e){U[t]=e,k[t]=A.fromStepping(e);var r="translate("+Et(10*(Nt(e,0)-T)+"%","0")+")";p[t].style[n.transformRule]=r,Ut(t),Ut(t+1);}function At(){V.forEach((function(t){var e=U[t]>50?-1:1,r=3+(p.length+e*t);p[t].style.zIndex=r;}));}function kt(t,e,r,n,i){return i||(e=wt(U,t,e,r,n,!1)),!1!==e&&(Pt(t,e),!0)}function Ut(t){if(d[t]){var e=0,r=100;0!==t&&(e=U[t-1]),t!==d.length-1&&(r=U[t]);var i=r-e,o="translate("+Et(Nt(e,i)+"%","0")+")",a="scale("+Et(i/100,"1")+")";d[t].style[n.transformRule]=o+" "+a;}}function Vt(t,e){return null===t||!1===t||void 0===t?U[e]:("number"==typeof t&&(t=String(t)),t=n.format.from(t),!1===(t=A.toStepping(t))||isNaN(t)?U[e]:t)}function Mt(t,e,r){var i=f(t),o=void 0===U[0];e=void 0===e||!!e,n.animate&&!o&&l(P,n.cssClasses.tap,n.animationDuration),V.forEach((function(t){kt(t,Vt(i[t],t),!0,!1,r);}));for(var a=1===V.length?0:1;a<V.length;++a)V.forEach((function(t){kt(t,U[t],!0,!0,r);}));At(),V.forEach((function(t){St("update",t),null!==i[t]&&e&&St("set",t);}));}function Dt(t){Mt(n.start,t);}function Ot(e,r,n,i){if(!((e=Number(e))>=0&&e<V.length))throw new Error("noUiSlider ("+t+"): invalid handle number, got: "+e);kt(e,Vt(r,e),!0,!0,i),St("update",e),n&&St("set",e);}function Ft(){var t=k.map(n.format.to);return 1===t.length?t[0]:t}function Lt(){for(var t in xt(F.aria),xt(F.tooltips),n.cssClasses)n.cssClasses.hasOwnProperty(t)&&m(P,n.cssClasses[t]);for(;P.firstChild;)P.removeChild(P.firstChild);delete P.noUiSlider;}function jt(t){var e=U[t],r=A.getNearbySteps(e),i=k[t],o=r.thisStep.step,a=null;if(n.snap)return [i-r.stepBefore.startValue||null,r.stepAfter.startValue-i||null];!1!==o&&i+o>r.stepAfter.startValue&&(o=r.stepAfter.startValue-i),a=i>r.thisStep.startValue?r.thisStep.step:!1!==r.stepBefore.step&&i-r.stepBefore.highestStep,100===e?o=null:0===e&&(a=null);var s=A.countStepDecimals();return null!==o&&!1!==o&&(o=Number(o.toFixed(s))),null!==a&&!1!==a&&(a=Number(a.toFixed(s))),[a,o]}function zt(){return V.map(jt)}function Ht(t,e){var r=Ft(),i=["margin","limit","padding","range","animate","snap","step","format","pips","tooltips"];i.forEach((function(e){void 0!==t[e]&&(a[e]=t[e]);}));var o=it(a);i.forEach((function(e){void 0!==t[e]&&(n[e]=o[e]);})),A=o.spectrum,n.margin=o.margin,n.limit=o.limit,n.padding=o.padding,n.pips?nt(n.pips):rt(),n.tooltips?K():J(),U=[],Mt(t.start||r,e);}function qt(){u=I(P),Y(n.connect,u),gt(n.events),Mt(n.start),n.pips&&nt(n.pips),n.tooltips&&K(),Q();}return qt(),E={destroy:Lt,steps:zt,on:bt,off:xt,get:Ft,set:Mt,setHandle:Ot,reset:Dt,__moveHandles:function(t,e,r){Ct(t,e,U,r);},options:a,updateOptions:Ht,target:P,removePips:rt,removeTooltips:J,getTooltips:function(){return w},getOrigins:function(){return p},pips:nt}}function at(e,r){if(!e||!e.nodeName)throw new Error("noUiSlider ("+t+"): create requires a single element, got: "+e);if(e.noUiSlider)throw new Error("noUiSlider ("+t+"): Slider was already initialized.");var n=ot(e,it(r),r);return e.noUiSlider=n,n}return {__spectrum:M,version:t,cssClasses:O,create:at}}();}));var m={name:"Slider",emits:["input","update:modelValue","update","change"],props:{...{value:{validator:function(t){return t=>"number"==typeof t||t instanceof Array||null==t||!1===t},required:!1},modelValue:{validator:function(t){return t=>"number"==typeof t||t instanceof Array||null==t||!1===t},required:!1}},id:{type:[String,Number],required:!1,default:"slider"},disabled:{type:Boolean,required:!1,default:!1},min:{type:Number,required:!1,default:0},max:{type:Number,required:!1,default:100},step:{type:Number,required:!1,default:1},orientation:{type:String,required:!1,default:"horizontal"},direction:{type:String,required:!1,default:"ltr"},tooltips:{type:Boolean,required:!1,default:!0},options:{type:Object,required:!1,default:()=>({})},merge:{type:Number,required:!1,default:-1},height:{type:String,required:!1,default:"300px"},format:{type:[Object,Function,Boolean],required:!1,default:null}},setup(a,s){const u=function(r,n,i){var o=toRefs(r),a=o.value,s=o.modelValue,u=void 0!==n.expose?s:a,c=ref(u.value);if(l(u.value))throw new Error("Slider v-model must be a Number or Array");if(Array.isArray(u.value)&&0==u.value.length)throw new Error("Slider v-model must not be an empty array");return {value:u,initialValue:c}}(a,s),c=function(e,n,i){var o=toRefs(e),a=o.orientation,s=o.height;return {style:computed((function(){return "vertical"==a.value?{height:s.value}:[]}))}}(a),f=function(e,n,i){var o=toRefs(e),a=o.format,s=o.step,u=i.value,l=computed((function(){return a&&a.value?"function"==typeof a.value?{to:a.value}:p(Object.assign({},a.value)):p({decimals:s.value>=0?0:2})}));return {tooltipsFormat:computed((function(){return Array.isArray(u.value)?u.value.map((function(t){return l.value})):l.value})),tooltipsMerge:function(t,e,r){var n="rtl"===getComputedStyle(t).direction,i="rtl"===t.noUiSlider.options.direction,o="vertical"===t.noUiSlider.options.orientation,a=t.noUiSlider.getTooltips(),s=t.noUiSlider.getOrigins();a.forEach((function(t,e){t&&s[e].appendChild(t);})),t.noUiSlider.on("update",(function(t,s,u,c,f){var p=[[]],d=[[]],h=[[]],m=0;a[0]&&(p[0][0]=0,d[0][0]=f[0],h[0][0]=l.value.to(parseFloat(t[0])));for(var v=1;v<f.length;v++)(!a[v]||f[v]-f[v-1]>e)&&(p[++m]=[],h[m]=[],d[m]=[]),a[v]&&(p[m].push(v),h[m].push(l.value.to(parseFloat(t[v]))),d[m].push(f[v]));p.forEach((function(t,e){for(var s=t.length,u=0;u<s;u++){var l=t[u];if(u===s-1){var c=0;d[e].forEach((function(t){c+=1e3-10*t;}));var f=o?"bottom":"right",p=i?0:s-1,m=1e3-10*d[e][p];c=(n&&!o?100:0)+c/s-m,a[l].innerHTML=h[e].join(r),a[l].style.display="block",a[l].style[f]=c+"%";}else a[l].style.display="none";}}));}));}}}(a,0,{value:u.value}),d=function(a,s,u){var c=toRefs(a),f=c.options,p=c.orientation,d=c.direction,m=c.tooltips,v=c.step,g=c.min,b=c.max,y=c.merge,x=c.format,S=c.id,w=c.disabled,E=u.value,C=u.initialValue,N=u.tooltipsFormat,P=u.tooltipsMerge,A=u.style,k=ref(null),U=ref(null),V=ref(!1),M=computed((function(){var t={cssPrefix:"slider-",orientation:p.value,direction:d.value,tooltips:!!m.value&&N.value,connect:"lower",start:l(E.value)?g.value:E.value,range:{min:g.value,max:b.value}};return v.value>0&&(t.step=v.value),Array.isArray(E.value)&&(t.connect=!0),t})),D=computed((function(){var t={id:S.value,style:A.value};return w.value&&(t.disabled=!0),t})),O=computed((function(){return Array.isArray(E.value)})),F=function(){var t=U.value.get();return Array.isArray(t)?t.map((function(t){return parseFloat(t)})):parseFloat(t)},L=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];U.value.set(t,e);},j=function(t){s.emit("input",t),s.emit("update:modelValue",t),s.emit("update",t);},z=function(){U.value=h.create(k.value,Object.assign({},M.value,f.value)),m.value&&O.value&&y.value>=0&&P(k.value,y.value," - "),U.value.on("set",(function(t){s.emit("change",F());})),U.value.on("update",(function(t){V.value&&j(F());})),V.value=!0;},H=function(){U.value.off(),U.value.destroy(),U.value=null;},q=function(){V.value=!1,H(),z();};return onMounted(z),onUnmounted(H),watch(O,q,{immediate:!1}),watch(g,q,{immediate:!1}),watch(b,q,{immediate:!1}),watch(v,q,{immediate:!1}),watch(p,q,{immediate:!1}),watch(d,q,{immediate:!1}),watch(m,q,{immediate:!1}),watch(x,q,{immediate:!1,deep:!0}),watch(y,q,{immediate:!1}),watch(f,q,{immediate:!1,deep:!0}),watch(E,(function(t){var e,r,n;l(t)?L(g.value,!1):(O.value&&(e=t,r=F(),n=r.slice().sort(),e.length!==r.length||!e.slice().sort().every((function(t,e){return t===n[e]})))||!O.value&&t!=F())&&L(t,!1);}),{deep:!0}),{slider:k,slider$:U,isRange:O,sliderProps:D,init:z,destroy:H,refresh:q,update:L,reset:function(){j(C.value);}}}(a,s,{value:u.value,initialValue:u.initialValue,tooltipsFormat:f.tooltipsFormat,tooltipsMerge:f.tooltipsMerge,style:c.style});return {...c,...f,...d}}};m.render=function(t,e,r,n,i,o){return openBlock(),createBlock("div",mergeProps(t.sliderProps,{ref:"slider"}),null,16)},m.__file="src/Slider.vue";

/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var noop$1 = function noop() {};

var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
  mark: noop$1,
  measure: noop$1
};

try {
  if (typeof window !== 'undefined') _WINDOW = window;
  if (typeof document !== 'undefined') _DOCUMENT = document;
  if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver;
  if (typeof performance !== 'undefined') _PERFORMANCE = performance;
} catch (e) {}

var _ref = _WINDOW.navigator || {},
    _ref$userAgent = _ref.userAgent,
    userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var PERFORMANCE = _PERFORMANCE;
!!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
var UNITS_IN_GRID = 16;
var DEFAULT_FAMILY_PREFIX = 'fa';
var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
var DATA_FA_I2SVG = 'data-fa-i2svg';
(function () {
  try {
    return "production" === 'production';
  } catch (e) {
    return false;
  }
})();
var DUOTONE_CLASSES = {
  GROUP: 'group',
  SWAP_OPACITY: 'swap-opacity',
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
};

var initial = WINDOW.FontAwesomeConfig || {};

function getAttrConfig(attr) {
  var element = DOCUMENT.querySelector('script[' + attr + ']');

  if (element) {
    return element.getAttribute(attr);
  }
}

function coerce(val) {
  // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
  // We'll assume that this is an indication that it should be toggled to true
  // For example <script data-search-pseudo-elements src="..."></script>
  if (val === '') return true;
  if (val === 'false') return false;
  if (val === 'true') return true;
  return val;
}

if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
  var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
  attrs.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        attr = _ref2[0],
        key = _ref2[1];

    var val = coerce(getAttrConfig(attr));

    if (val !== undefined && val !== null) {
      initial[key] = val;
    }
  });
}

var _default = {
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: 'async',
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};

var _config = _objectSpread({}, _default, initial);

if (!_config.autoReplaceSvg) _config.observeMutations = false;

var config = _objectSpread({}, _config);

WINDOW.FontAwesomeConfig = config;

var w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w[NAMESPACE_IDENTIFIER];

var functions = [];

var listener = function listener() {
  DOCUMENT.removeEventListener('DOMContentLoaded', listener);
  loaded = 1;
  functions.map(function (fn) {
    return fn();
  });
};

var loaded = false;

if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
  if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
}

typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';
typeof setImmediate === 'undefined' ? setTimeout : setImmediate;

var d = UNITS_IN_GRID;
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};
function insertCss(css) {
  if (!css || !IS_DOM) {
    return;
  }

  var style = DOCUMENT.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;

  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || '').toUpperCase();

    if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }

  DOCUMENT.head.insertBefore(style, beforeChild);
  return css;
}
var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextUniqueId() {
  var size = 12;
  var id = '';

  while (size-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }

  return id;
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
    return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
  }, '').trim();
}
function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
  }, '');
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref) {
  var transform = _ref.transform,
      containerWidth = _ref.containerWidth,
      iconWidth = _ref.iconWidth;
  var outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  var inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  var path = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer: outer,
    inner: inner,
    path: path
  };
}
function transformForCss(_ref2) {
  var transform = _ref2.transform,
      _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height,
      _ref2$startCentered = _ref2.startCentered,
      startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
  var val = '';

  if (startCentered && IS_IE) {
    val += "translate(".concat(transform.x / d - width / 2, "em, ").concat(transform.y / d - height / 2, "em) ");
  } else if (startCentered) {
    val += "translate(calc(-50% + ".concat(transform.x / d, "em), calc(-50% + ").concat(transform.y / d, "em)) ");
  } else {
    val += "translate(".concat(transform.x / d, "em, ").concat(transform.y / d, "em) ");
  }

  val += "scale(".concat(transform.size / d * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d * (transform.flipY ? -1 : 1), ") ");
  val += "rotate(".concat(transform.rotate, "deg) ");
  return val;
}

var ALL_SPACE = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%'
};

function fillBlack(abstract) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (abstract.attributes && (abstract.attributes.fill || force)) {
    abstract.attributes.fill = 'black';
  }

  return abstract;
}

function deGroup(abstract) {
  if (abstract.tag === 'g') {
    return abstract.children;
  } else {
    return [abstract];
  }
}

function makeIconMasking (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      mask = _ref.mask,
      explicitMaskId = _ref.maskId,
      transform = _ref.transform;
  var mainWidth = main.width,
      mainPath = main.icon;
  var maskWidth = mask.width,
      maskPath = mask.icon;
  var trans = transformForSvg({
    transform: transform,
    containerWidth: maskWidth,
    iconWidth: mainWidth
  });
  var maskRect = {
    tag: 'rect',
    attributes: _objectSpread({}, ALL_SPACE, {
      fill: 'white'
    })
  };
  var maskInnerGroupChildrenMixin = mainPath.children ? {
    children: mainPath.children.map(fillBlack)
  } : {};
  var maskInnerGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.inner),
    children: [fillBlack(_objectSpread({
      tag: mainPath.tag,
      attributes: _objectSpread({}, mainPath.attributes, trans.path)
    }, maskInnerGroupChildrenMixin))]
  };
  var maskOuterGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.outer),
    children: [maskInnerGroup]
  };
  var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
  var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
  var maskTag = {
    tag: 'mask',
    attributes: _objectSpread({}, ALL_SPACE, {
      id: maskId,
      maskUnits: 'userSpaceOnUse',
      maskContentUnits: 'userSpaceOnUse'
    }),
    children: [maskRect, maskOuterGroup]
  };
  var defs = {
    tag: 'defs',
    children: [{
      tag: 'clipPath',
      attributes: {
        id: clipId
      },
      children: deGroup(maskPath)
    }, maskTag]
  };
  children.push(defs, {
    tag: 'rect',
    attributes: _objectSpread({
      fill: 'currentColor',
      'clip-path': "url(#".concat(clipId, ")"),
      mask: "url(#".concat(maskId, ")")
    }, ALL_SPACE)
  });
  return {
    children: children,
    attributes: attributes
  };
}

function makeIconStandard (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      transform = _ref.transform,
      styles = _ref.styles;
  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  if (transformIsMeaningful(transform)) {
    var trans = transformForSvg({
      transform: transform,
      containerWidth: main.width,
      iconWidth: main.width
    });
    children.push({
      tag: 'g',
      attributes: _objectSpread({}, trans.outer),
      children: [{
        tag: 'g',
        attributes: _objectSpread({}, trans.inner),
        children: [{
          tag: main.icon.tag,
          children: main.icon.children,
          attributes: _objectSpread({}, main.icon.attributes, trans.path)
        }]
      }]
    });
  } else {
    children.push(main.icon);
  }

  return {
    children: children,
    attributes: attributes
  };
}

function asIcon (_ref) {
  var children = _ref.children,
      main = _ref.main,
      mask = _ref.mask,
      attributes = _ref.attributes,
      styles = _ref.styles,
      transform = _ref.transform;

  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width,
        height = main.height;
    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes['style'] = joinStyles(_objectSpread({}, styles, {
      'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }

  return [{
    tag: 'svg',
    attributes: attributes,
    children: children
  }];
}

function asSymbol (_ref) {
  var prefix = _ref.prefix,
      iconName = _ref.iconName,
      children = _ref.children,
      attributes = _ref.attributes,
      symbol = _ref.symbol;
  var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: 'svg',
    attributes: {
      style: 'display: none;'
    },
    children: [{
      tag: 'symbol',
      attributes: _objectSpread({}, attributes, {
        id: id
      }),
      children: children
    }]
  }];
}

function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons,
      main = _params$icons.main,
      mask = _params$icons.mask,
      prefix = params.prefix,
      iconName = params.iconName,
      transform = params.transform,
      symbol = params.symbol,
      title = params.title,
      maskId = params.maskId,
      titleId = params.titleId,
      extra = params.extra,
      _params$watchable = params.watchable,
      watchable = _params$watchable === void 0 ? false : _params$watchable;

  var _ref = mask.found ? mask : main,
      width = _ref.width,
      height = _ref.height;

  var isUploadedIcon = prefix === 'fak';
  var widthClass = isUploadedIcon ? '' : "fa-w-".concat(Math.ceil(width / height * 16));
  var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : '', widthClass].filter(function (c) {
    return extra.classes.indexOf(c) === -1;
  }).filter(function (c) {
    return c !== '' || !!c;
  }).concat(extra.classes).join(' ');
  var content = {
    children: [],
    attributes: _objectSpread({}, extra.attributes, {
      'data-prefix': prefix,
      'data-icon': iconName,
      'class': attrClass,
      'role': extra.attributes.role || 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': "0 0 ".concat(width, " ").concat(height)
    })
  };
  var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf('fa-fw') ? {
    width: "".concat(width / height * 16 * 0.0625, "em")
  } : {};

  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = '';
  }

  if (title) content.children.push({
    tag: 'title',
    attributes: {
      id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
    },
    children: [title]
  });

  var args = _objectSpread({}, content, {
    prefix: prefix,
    iconName: iconName,
    main: main,
    mask: mask,
    maskId: maskId,
    transform: transform,
    symbol: symbol,
    styles: _objectSpread({}, uploadedIconWidthStyle, extra.styles)
  });

  var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
      children = _ref2.children,
      attributes = _ref2.attributes;

  args.children = children;
  args.attributes = attributes;

  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}
function makeLayersTextAbstract(params) {
  var content = params.content,
      width = params.width,
      height = params.height,
      transform = params.transform,
      title = params.title,
      extra = params.extra,
      _params$watchable2 = params.watchable,
      watchable = _params$watchable2 === void 0 ? false : _params$watchable2;

  var attributes = _objectSpread({}, extra.attributes, title ? {
    'title': title
  } : {}, {
    'class': extra.classes.join(' ')
  });

  if (watchable) {
    attributes[DATA_FA_I2SVG] = '';
  }

  var styles = _objectSpread({}, extra.styles);

  if (transformIsMeaningful(transform)) {
    styles['transform'] = transformForCss({
      transform: transform,
      startCentered: true,
      width: width,
      height: height
    });
    styles['-webkit-transform'] = styles['transform'];
  }

  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  var val = [];
  val.push({
    tag: 'span',
    attributes: attributes,
    children: [content]
  });

  if (title) {
    val.push({
      tag: 'span',
      attributes: {
        class: 'sr-only'
      },
      children: [title]
    });
  }

  return val;
}

var noop$1$1 = function noop() {};

config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1$1,
  measure: noop$1$1
};

/**
 * Internal helper to bind a function known to have 4 arguments
 * to a given context.
 */

var bindInternal4 = function bindInternal4(func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};

/**
 * # Reduce
 *
 * A fast object `.reduce()` implementation.
 *
 * @param  {Object}   subject      The object to reduce over.
 * @param  {Function} fn           The reducer function.
 * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
 * @param  {Object}   thisContext  The context for the reducer.
 * @return {mixed}                 The final result.
 */


var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
      i,
      key,
      result;

  if (initialValue === undefined) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }

  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }

  return result;
};

function defineIcons(prefix, icons) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _params$skipHooks = params.skipHooks,
      skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }

    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
  }
  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */


  if (prefix === 'fas') {
    defineIcons('fa', icons);
  }
}

var styles = namespace.styles,
    shims = namespace.shims;
var build = function build() {
  var lookup = function lookup(reducer) {
    return reduce(styles, function (o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };

  lookup(function (acc, icon, iconName) {
    if (icon[3]) {
      acc[icon[3]] = iconName;
    }

    return acc;
  });
  lookup(function (acc, icon, iconName) {
    var ligatures = icon[2];
    acc[iconName] = iconName;
    ligatures.forEach(function (ligature) {
      acc[ligature] = iconName;
    });
    return acc;
  });
  var hasRegular = 'far' in styles;
  reduce(shims, function (acc, shim) {
    var oldName = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];

    if (prefix === 'far' && !hasRegular) {
      prefix = 'fas';
    }

    acc[oldName] = {
      prefix: prefix,
      iconName: iconName
    };
    return acc;
  }, {});
};
build();

namespace.styles;
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix: prefix,
      iconName: iconName,
      icon: mapping[prefix][iconName]
    };
  }
}

function toHtml(abstractNodes) {
  var tag = abstractNodes.tag,
      _abstractNodes$attrib = abstractNodes.attributes,
      attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
      _abstractNodes$childr = abstractNodes.children,
      children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

  if (typeof abstractNodes === 'string') {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
  }
}

var parseTransformString = function parseTransformString(transformString) {
  var transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };

  if (!transformString) {
    return transform;
  } else {
    return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
      var parts = n.toLowerCase().split('-');
      var first = parts[0];
      var rest = parts.slice(1).join('-');

      if (first && rest === 'h') {
        acc.flipX = true;
        return acc;
      }

      if (first && rest === 'v') {
        acc.flipY = true;
        return acc;
      }

      rest = parseFloat(rest);

      if (isNaN(rest)) {
        return acc;
      }

      switch (first) {
        case 'grow':
          acc.size = acc.size + rest;
          break;

        case 'shrink':
          acc.size = acc.size - rest;
          break;

        case 'left':
          acc.x = acc.x - rest;
          break;

        case 'right':
          acc.x = acc.x + rest;
          break;

        case 'up':
          acc.y = acc.y - rest;
          break;

        case 'down':
          acc.y = acc.y + rest;
          break;

        case 'rotate':
          acc.rotate = acc.rotate + rest;
          break;
      }

      return acc;
    }, transform);
  }
};

function MissingIcon(error) {
  this.name = 'MissingIcon';
  this.message = error || 'Icon unavailable';
  this.stack = new Error().stack;
}
MissingIcon.prototype = Object.create(Error.prototype);
MissingIcon.prototype.constructor = MissingIcon;

var FILL = {
  fill: 'currentColor'
};
var ANIMATION_BASE = {
  attributeType: 'XML',
  repeatCount: 'indefinite',
  dur: '2s'
};
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
  })
});

var OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
  attributeName: 'opacity'
});

({
  tag: 'circle',
  attributes: _objectSpread({}, FILL, {
    cx: '256',
    cy: '364',
    r: '28'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, ANIMATION_BASE, {
      attributeName: 'r',
      values: '28;14;28;28;14;28;'
    })
  }, {
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;1;1;0;1;'
    })
  }]
});
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '1',
    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;0;0;0;1;'
    })
  }]
});
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '0',
    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '0;0;1;1;0;0;'
    })
  }]
});

namespace.styles;
function asFoundIcon(icon) {
  var width = icon[0];
  var height = icon[1];

  var _icon$slice = icon.slice(4),
      _icon$slice2 = _slicedToArray(_icon$slice, 1),
      vectorData = _icon$slice2[0];

  var element = null;

  if (Array.isArray(vectorData)) {
    element = {
      tag: 'g',
      attributes: {
        class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: 'currentColor',
          d: vectorData[0]
        }
      }, {
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: 'currentColor',
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: 'path',
      attributes: {
        fill: 'currentColor',
        d: vectorData
      }
    };
  }

  return {
    found: true,
    width: width,
    height: height,
    icon: element
  };
}

namespace.styles;

var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}";

function css () {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config.familyPrefix;
  var rc = config.replacementClass;
  var s = baseStyles;

  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
    var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
    var rPatt = new RegExp("\\.".concat(drc), 'g');
    s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }

  return s;
}

var Library =
/*#__PURE__*/
function () {
  function Library() {
    _classCallCheck(this, Library);

    this.definitions = {};
  }

  _createClass(Library, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }

      var additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach(function (key) {
        _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key]);
        defineIcons(key, additions[key]);
        build();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map(function (key) {
        var _normalized$key = normalized[key],
            prefix = _normalized$key.prefix,
            iconName = _normalized$key.iconName,
            icon = _normalized$key.icon;
        if (!additions[prefix]) additions[prefix] = {};
        additions[prefix][iconName] = icon;
      });
      return additions;
    }
  }]);

  return Library;
}();

function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css());

    _cssInserted = true;
  }
}

function apiObject(val, abstractCreator) {
  Object.defineProperty(val, 'abstract', {
    get: abstractCreator
  });
  Object.defineProperty(val, 'html', {
    get: function get() {
      return val.abstract.map(function (a) {
        return toHtml(a);
      });
    }
  });
  Object.defineProperty(val, 'node', {
    get: function get() {
      if (!IS_DOM) return;
      var container = DOCUMENT.createElement('div');
      container.innerHTML = val.html;
      return container.children;
    }
  });
  return val;
}

function findIconDefinition(iconLookup) {
  var _iconLookup$prefix = iconLookup.prefix,
      prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix,
      iconName = iconLookup.iconName;
  if (!iconName) return;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}

function resolveIcons(next) {
  return function (maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    var mask = params.mask;

    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }

    return next(iconDefinition, _objectSpread({}, params, {
      mask: mask
    }));
  };
}

var library = new Library();
var _cssInserted = false;
var parse = {
  transform: function transform(transformString) {
    return parseTransformString(transformString);
  }
};
var icon = resolveIcons(function (iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform = params.transform,
      transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
      _params$symbol = params.symbol,
      symbol = _params$symbol === void 0 ? false : _params$symbol,
      _params$mask = params.mask,
      mask = _params$mask === void 0 ? null : _params$mask,
      _params$maskId = params.maskId,
      maskId = _params$maskId === void 0 ? null : _params$maskId,
      _params$title = params.title,
      title = _params$title === void 0 ? null : _params$title,
      _params$titleId = params.titleId,
      titleId = _params$titleId === void 0 ? null : _params$titleId,
      _params$classes = params.classes,
      classes = _params$classes === void 0 ? [] : _params$classes,
      _params$attributes = params.attributes,
      attributes = _params$attributes === void 0 ? {} : _params$attributes,
      _params$styles = params.styles,
      styles = _params$styles === void 0 ? {} : _params$styles;
  if (!iconDefinition) return;
  var prefix = iconDefinition.prefix,
      iconName = iconDefinition.iconName,
      icon = iconDefinition.icon;
  return apiObject(_objectSpread({
    type: 'icon'
  }, iconDefinition), function () {
    ensureCss();

    if (config.autoA11y) {
      if (title) {
        attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes['aria-hidden'] = 'true';
        attributes['focusable'] = 'false';
      }
    }

    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix: prefix,
      iconName: iconName,
      transform: _objectSpread({}, meaninglessTransform, transform),
      symbol: symbol,
      title: title,
      maskId: maskId,
      titleId: titleId,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: classes
      }
    });
  });
});
var text = function text(content) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform2 = params.transform,
      transform = _params$transform2 === void 0 ? meaninglessTransform : _params$transform2,
      _params$title2 = params.title,
      title = _params$title2 === void 0 ? null : _params$title2,
      _params$classes2 = params.classes,
      classes = _params$classes2 === void 0 ? [] : _params$classes2,
      _params$attributes2 = params.attributes,
      attributes = _params$attributes2 === void 0 ? {} : _params$attributes2,
      _params$styles2 = params.styles,
      styles = _params$styles2 === void 0 ? {} : _params$styles2;
  return apiObject({
    type: 'text',
    content: content
  }, function () {
    ensureCss();
    return makeLayersTextAbstract({
      content: content,
      transform: _objectSpread({}, meaninglessTransform, transform),
      title: title,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: ["".concat(config.familyPrefix, "-layers-text")].concat(_toConsumableArray(classes))
      }
    });
  });
};

/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var faAngleDoubleLeft = {
  prefix: 'fas',
  iconName: 'angle-double-left',
  icon: [448, 512, [], "f100", "M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"]
};
var faAngleDoubleRight = {
  prefix: 'fas',
  iconName: 'angle-double-right',
  icon: [448, 512, [], "f101", "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"]
};
var faAngleLeft = {
  prefix: 'fas',
  iconName: 'angle-left',
  icon: [256, 512, [], "f104", "M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"]
};
var faAngleRight = {
  prefix: 'fas',
  iconName: 'angle-right',
  icon: [256, 512, [], "f105", "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"]
};
var faEllipsisH = {
  prefix: 'fas',
  iconName: 'ellipsis-h',
  icon: [512, 512, [], "f141", "M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"]
};
var faFilter = {
  prefix: 'fas',
  iconName: 'filter',
  icon: [512, 512, [], "f0b0", "M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"]
};
var faSearch = {
  prefix: 'fas',
  iconName: 'search',
  icon: [512, 512, [], "f002", "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"]
};
var faSort = {
  prefix: 'fas',
  iconName: 'sort',
  icon: [320, 512, [], "f0dc", "M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"]
};
var faSortDown = {
  prefix: 'fas',
  iconName: 'sort-down',
  icon: [320, 512, [], "f0dd", "M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"]
};
var faSortUp = {
  prefix: 'fas',
  iconName: 'sort-up',
  icon: [320, 512, [], "f0de", "M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"]
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var humps = createCommonjsModule(function (module) {
(function(global) {

  var _processKeys = function(convert, obj, options) {
    if(!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
      return obj;
    }

    var output,
        i = 0,
        l = 0;

    if(_isArray(obj)) {
      output = [];
      for(l=obj.length; i<l; i++) {
        output.push(_processKeys(convert, obj[i], options));
      }
    }
    else {
      output = {};
      for(var key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)) {
          output[convert(key, options)] = _processKeys(convert, obj[key], options);
        }
      }
    }
    return output;
  };

  // String conversion methods

  var separateWords = function(string, options) {
    options = options || {};
    var separator = options.separator || '_';
    var split = options.split || /(?=[A-Z])/;

    return string.split(split).join(separator);
  };

  var camelize = function(string) {
    if (_isNumerical(string)) {
      return string;
    }
    string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    // Ensure 1st char is always lowercase
    return string.substr(0, 1).toLowerCase() + string.substr(1);
  };

  var pascalize = function(string) {
    var camelized = camelize(string);
    // Ensure 1st char is always uppercase
    return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
  };

  var decamelize = function(string, options) {
    return separateWords(string, options).toLowerCase();
  };

  // Utilities
  // Taken from Underscore.js

  var toString = Object.prototype.toString;

  var _isFunction = function(obj) {
    return typeof(obj) === 'function';
  };
  var _isObject = function(obj) {
    return obj === Object(obj);
  };
  var _isArray = function(obj) {
    return toString.call(obj) == '[object Array]';
  };
  var _isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };
  var _isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };
  var _isBoolean = function(obj) {
    return toString.call(obj) == '[object Boolean]';
  };

  // Performant way to determine if obj coerces to a number
  var _isNumerical = function(obj) {
    obj = obj - 0;
    return obj === obj;
  };

  // Sets up function which handles processing keys
  // allowing the convert function to be modified by a callback
  var _processor = function(convert, options) {
    var callback = options && 'process' in options ? options.process : options;

    if(typeof(callback) !== 'function') {
      return convert;
    }

    return function(string, options) {
      return callback(string, convert, options);
    }
  };

  var humps = {
    camelize: camelize,
    decamelize: decamelize,
    pascalize: pascalize,
    depascalize: decamelize,
    camelizeKeys: function(object, options) {
      return _processKeys(_processor(camelize, options), object);
    },
    decamelizeKeys: function(object, options) {
      return _processKeys(_processor(decamelize, options), object, options);
    },
    pascalizeKeys: function(object, options) {
      return _processKeys(_processor(pascalize, options), object);
    },
    depascalizeKeys: function () {
      return this.decamelizeKeys.apply(this, arguments);
    }
  };

  if (module.exports) {
    module.exports = humps;
  } else {
    global.humps = humps;
  }

})(commonjsGlobal);
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Converts a CSS style into a plain Javascript object.
 * @param {String} style The style to converts into a plain Javascript object.
 * @returns {Object}
 */
function styleToObject(style) {
  return style.split(';').map(function (s) {
    return s.trim();
  }).filter(function (s) {
    return s;
  }).reduce(function (output, pair) {
    var idx = pair.indexOf(':');
    var prop = humps.camelize(pair.slice(0, idx));
    var value = pair.slice(idx + 1).trim();

    output[prop] = value;
    return output;
  }, {});
}

/**
 * Converts a CSS class list into a plain Javascript object.
 * @param {Array<String>} classes The class list to convert.
 * @returns {Object}
 */
function classToObject(classes) {
  return classes.split(/\s+/).reduce(function (output, className) {
    output[className] = true;
    return output;
  }, {});
}

/**
 * Converts a FontAwesome abstract element of an icon into a Vue VNode.
 * @param {AbstractElement | String} abstractElement The element to convert.
 * @param {Object} props The user-defined props.
 * @param {Object} attrs The user-defined native HTML attributes.
 * @returns {VNode}
 */
function convert(abstractElement) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // If the abstract element is a string, we'll just return a string render function
  if (typeof abstractElement === 'string') {
    return abstractElement;
  }

  // Converting abstract element children into Vue VNodes
  var children = (abstractElement.children || []).map(function (child) {
    return convert(child);
  });

  // Converting abstract element attributes into valid Vue format
  var mixins = Object.keys(abstractElement.attributes || {}).reduce(function (mixins, key) {
    var value = abstractElement.attributes[key];

    switch (key) {
      case 'class':
        mixins.class = classToObject(value);
        break;
      case 'style':
        mixins.style = styleToObject(value);
        break;
      default:
        mixins.attrs[key] = value;
    }

    return mixins;
  }, {
    attrs: {},
    class: {},
    style: {}
  });

  // Now, we'll return the VNode

  attrs.class;
      var _attrs$style = attrs.style,
      aStyle = _attrs$style === undefined ? {} : _attrs$style,
      otherAttrs = objectWithoutProperties(attrs, ['class', 'style']);

  return h$1(abstractElement.tag, _extends({}, props, {
    class: mixins.class,
    style: _extends({}, mixins.style, aStyle)
  }, mixins.attrs, otherAttrs), children);
}

var PRODUCTION = false;

try {
  PRODUCTION = "production" === 'production';
} catch (e) {}

function log () {
  if (!PRODUCTION && console && typeof console.error === 'function') {
    var _console;

    (_console = console).error.apply(_console, arguments);
  }
}

function objectWithKey(key, value) {
  return Array.isArray(value) && value.length > 0 || !Array.isArray(value) && value ? defineProperty({}, key, value) : {};
}

function classList(props) {
  var _classes;

  var classes = (_classes = {
    'fa-spin': props.spin,
    'fa-pulse': props.pulse,
    'fa-fw': props.fixedWidth,
    'fa-border': props.border,
    'fa-li': props.listItem,
    'fa-inverse': props.inverse,
    'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
    'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both'
  }, defineProperty(_classes, 'fa-' + props.size, props.size !== null), defineProperty(_classes, 'fa-rotate-' + props.rotation, props.rotation !== null), defineProperty(_classes, 'fa-pull-' + props.pull, props.pull !== null), defineProperty(_classes, 'fa-swap-opacity', props.swapOpacity), _classes);

  return Object.keys(classes).map(function (key) {
    return classes[key] ? key : null;
  }).filter(function (key) {
    return key;
  });
}

function normalizeIconArgs(icon$$1) {
  if (icon$$1 === null) {
    return null;
  }

  if ((typeof icon$$1 === 'undefined' ? 'undefined' : _typeof(icon$$1)) === 'object' && icon$$1.prefix && icon$$1.iconName) {
    return icon$$1;
  }

  if (Array.isArray(icon$$1) && icon$$1.length === 2) {
    return { prefix: icon$$1[0], iconName: icon$$1[1] };
  }

  if (typeof icon$$1 === 'string') {
    return { prefix: 'fas', iconName: icon$$1 };
  }
}

var FontAwesomeIcon = defineComponent({
  name: 'FontAwesomeIcon',

  props: {
    border: {
      type: Boolean,
      default: false
    },
    fixedWidth: {
      type: Boolean,
      default: false
    },
    flip: {
      type: String,
      default: null,
      validator: function validator(value) {
        return ['horizontal', 'vertical', 'both'].indexOf(value) > -1;
      }
    },
    icon: {
      type: [Object, Array, String],
      required: true
    },
    mask: {
      type: [Object, Array, String],
      default: null
    },
    listItem: {
      type: Boolean,
      default: false
    },
    pull: {
      type: String,
      default: null,
      validator: function validator(value) {
        return ['right', 'left'].indexOf(value) > -1;
      }
    },
    pulse: {
      type: Boolean,
      default: false
    },
    rotation: {
      type: [String, Number],
      default: null,
      validator: function validator(value) {
        return [90, 180, 270].indexOf(Number.parseInt(value, 10)) > -1;
      }
    },
    swapOpacity: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null,
      validator: function validator(value) {
        return ['lg', 'xs', 'sm', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'].indexOf(value) > -1;
      }
    },
    spin: {
      type: Boolean,
      default: false
    },
    transform: {
      type: [String, Object],
      default: null
    },
    symbol: {
      type: [Boolean, String],
      default: false
    },
    title: {
      type: String,
      default: null
    },
    inverse: {
      type: Boolean,
      default: false
    }
  },

  setup: function setup(props, _ref) {
    var attrs = _ref.attrs;

    var icon$$1 = computed(function () {
      return normalizeIconArgs(props.icon);
    });
    var classes = computed(function () {
      return objectWithKey('classes', classList(props));
    });
    var transform = computed(function () {
      return objectWithKey('transform', typeof props.transform === 'string' ? parse.transform(props.transform) : props.transform);
    });
    var mask = computed(function () {
      return objectWithKey('mask', normalizeIconArgs(props.mask));
    });

    var renderedIcon = computed(function () {
      return icon(icon$$1.value, _extends({}, classes.value, transform.value, mask.value, {
        symbol: props.symbol,
        title: props.title
      }));
    });

    watch(renderedIcon, function (value) {
      if (!value) {
        return log('Could not find one or more icon(s)', icon$$1.value, mask.value);
      }
    }, { immediate: true });

    var vnode = computed(function () {
      return renderedIcon.value ? convert(renderedIcon.value.abstract[0], {}, attrs) : null;
    });
    return function () {
      return vnode.value;
    };
  }
});

defineComponent({
  name: 'FontAwesomeLayers',

  props: {
    fixedWidth: {
      type: Boolean,
      default: false
    }
  },

  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var familyPrefix = config.familyPrefix;


    var className = computed(function () {
      return [familyPrefix + '-layers'].concat(toConsumableArray(props.fixedWidth ? [familyPrefix + '-fw'] : []));
    });

    return function () {
      return h$1('div', { class: className.value }, slots.default ? slots.default() : []);
    };
  }
});

defineComponent({
  name: 'FontAwesomeLayersText',

  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    transform: {
      type: [String, Object],
      default: null
    },
    counter: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: null,
      validator: function validator(value) {
        return ['bottom-left', 'bottom-right', 'top-left', 'top-right'].indexOf(value) > -1;
      }
    }
  },

  setup: function setup(props, _ref) {
    var attrs = _ref.attrs;
    var familyPrefix = config.familyPrefix;


    var classes = computed(function () {
      return objectWithKey('classes', [].concat(toConsumableArray(props.counter ? [familyPrefix + '-layers-counter'] : []), toConsumableArray(props.position ? [familyPrefix + '-layers-' + props.position] : [])));
    });
    var transform = computed(function () {
      return objectWithKey('transform', typeof props.transform === 'string' ? parse.transform(props.transform) : props.transform);
    });
    var abstractElement = computed(function () {
      var _text = text(props.value.toString(), _extends({}, transform.value, classes.value)),
          abstract = _text.abstract;

      if (props.counter) {
        abstract[0].attributes.class = abstract[0].attributes.class.replace('fa-layers-text', '');
      }
      return abstract[0];
    });

    var vnode = computed(function () {
      return convert(abstractElement.value, {}, attrs);
    });
    return function () {
      return vnode.value;
    };
  }
});

library.add(faAngleRight, faAngleDoubleRight, faAngleLeft, faAngleDoubleLeft);

var script$4 = defineComponent({
  components: {
    Slider: m,
    FontAwesomeIcon,
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    isSliderOn: {
      type: String,
      default: "true",
    },
  },
  emits: ["updateCurrentPage"],
  setup(props, context) {
    const inputtingCurrentPage = ref(1);

    const surroundingPages = computed(() => {
      const totalPages = props.totalPages;
      const currentPage = props.currentPage;
      let start, end;
      if (currentPage <= 3) {
        start = 1;
        end = Math.min(start + 4, totalPages);
      } else if (totalPages - currentPage <= 3) {
        end = totalPages;
        start = Math.max(end - 4, 1);
      } else {
        start = Math.max(currentPage - 2, 1);
        end = Math.min(currentPage + 2, totalPages);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    const paginationWrapper = ref(null);
    const canvas = ref(null);
    const paginationNumList = ref(null);
    function drawKnobArrow() {
      setTimeout(() => {
        const totalPages = props.totalPages;
        if (totalPages <= 5) {
          return;
        }

        canvas.value.width = paginationWrapper.value.clientWidth;
        canvas.value.height = 50;

        const sliderY =
          paginationWrapper.value.getElementsByClassName("pageSlider")[0]
            .offsetTop;
        const tablePaginationOrder =
          paginationNumList.value.offsetTop < sliderY
            ? "column"
            : "column-reverse";

        const paginationNumListX = paginationNumList.value.offsetLeft;
        const paginationNumListY = tablePaginationOrder === "column" ? 0 : 50;

        const knob =
          paginationWrapper.value.getElementsByClassName("slider-origin")[0];
        const knobTranslate = knob.style.transform
          .match(/translate\((.+)%,(.+)\)/)[1]
          .split(",")[0];
        const knobX =
          ((1000 + Number(knobTranslate)) / 1000) * canvas.value.clientWidth;
        const knobY = tablePaginationOrder === "column" ? 50 : 0;

        const ctx = canvas.value.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(
          paginationNumListX - paginationWrapper.value.offsetLeft,
          paginationNumListY
        );
        ctx.lineTo(
          paginationNumListX -
            paginationWrapper.value.offsetLeft +
            paginationNumList.value.clientWidth,
          paginationNumListY
        );
        ctx.lineTo(knobX, knobY);
        ctx.closePath();
        ctx.fillStyle = "#dddddd";
        ctx.fill();
      }, 0);
    }

    function updateCurrentPage(num) {
      inputtingCurrentPage.value = num;
      context.emit("updateCurrentPage", num);
    }

    if (props.isSliderOn === "true") {
      onUpdated(drawKnobArrow);
    }

    return {
      inputtingCurrentPage,
      surroundingPages,
      paginationWrapper,
      drawKnobArrow,
      updateCurrentPage,
      canvas,
      paginationNumList,
    };
  },
});

const _hoisted_1$4 = {
  key: 0,
  ref: "paginationWrapper",
  class: "paginationWrapper"
};
const _hoisted_2$4 = { class: "serialPagination" };
const _hoisted_3$4 = {
  ref: "paginationNumList",
  class: "paginationNumList"
};
const _hoisted_4$2 = ["onClick"];
const _hoisted_5$2 = { class: "pageNumber" };
const _hoisted_6$2 = /*#__PURE__*/createTextVNode(" Page ");
const _hoisted_7$1 = ["value"];
const _hoisted_8$1 = {
  ref: "canvas",
  class: "canvas"
};

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
  const _component_Slider = resolveComponent("Slider");

  return (_ctx.totalPages > 1)
    ? (openBlock(), createElementBlock("div", _hoisted_1$4, [
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("div", {
            class: normalizeClass(['arrowWrapper', { show: _ctx.currentPage !== 1 }])
          }, [
            createVNode(_component_font_awesome_icon, {
              class: "arrow double left",
              icon: "angle-double-left",
              onClick: _cache[0] || (_cache[0] = $event => (_ctx.updateCurrentPage(1)))
            }),
            createVNode(_component_font_awesome_icon, {
              class: "arrow left",
              icon: "angle-left",
              onClick: _cache[1] || (_cache[1] = $event => (_ctx.updateCurrentPage(_ctx.currentPage - 1)))
            })
          ], 2 /* CLASS */),
          createBaseVNode("ul", _hoisted_3$4, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.surroundingPages, (page) => {
              return (openBlock(), createElementBlock("li", {
                key: page,
                class: normalizeClass(['pagination', { currentBtn: _ctx.currentPage === page }]),
                onClick: $event => (_ctx.updateCurrentPage(page))
              }, toDisplayString(page), 11 /* TEXT, CLASS, PROPS */, _hoisted_4$2))
            }), 128 /* KEYED_FRAGMENT */))
          ], 512 /* NEED_PATCH */),
          createBaseVNode("div", {
            class: normalizeClass(['arrowWrapper', { show: _ctx.currentPage !== _ctx.totalPages }])
          }, [
            createVNode(_component_font_awesome_icon, {
              class: "arrow right",
              icon: "angle-right",
              onClick: _cache[2] || (_cache[2] = $event => (_ctx.updateCurrentPage(_ctx.currentPage + 1)))
            }),
            createVNode(_component_font_awesome_icon, {
              class: "arrow double right",
              icon: "angle-double-right",
              onClick: _cache[3] || (_cache[3] = $event => (_ctx.updateCurrentPage(_ctx.totalPages)))
            })
          ], 2 /* CLASS */),
          createBaseVNode("div", _hoisted_5$2, [
            _hoisted_6$2,
            createBaseVNode("input", {
              value: _ctx.currentPage,
              type: "text",
              class: "jumpToNumberInput",
              onInput: _cache[4] || (_cache[4] = $event => (_ctx.updateCurrentPage(Number($event.target.value))))
            }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_7$1),
            createTextVNode(" of " + toDisplayString(_ctx.totalPages), 1 /* TEXT */)
          ])
        ]),
        (_ctx.isSliderOn === 'true' && _ctx.totalPages > 5)
          ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createBaseVNode("canvas", _hoisted_8$1, null, 512 /* NEED_PATCH */),
              createVNode(_component_Slider, {
                modelValue: _ctx.inputtingCurrentPage,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => (_ctx.inputtingCurrentPage = $event)),
                min: 1,
                max: _ctx.totalPages,
                class: "pageSlider",
                onUpdate: _cache[6] || (_cache[6] = $event => (_ctx.updateCurrentPage(_ctx.inputtingCurrentPage)))
              }, null, 8 /* PROPS */, ["modelValue", "max"])
            ], 64 /* STABLE_FRAGMENT */))
          : createCommentVNode("v-if", true)
      ], 512 /* NEED_PATCH */))
    : createCommentVNode("v-if", true)
}

script$4.render = render$4;
script$4.__file = "stanzas/pagination-table/SliderPagination.vue";

var script$3 = defineComponent({
  props: {
    id: {
      type: String,
      default: null,
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },
});

const _hoisted_1$3 = ["id", "name"];
const _hoisted_2$3 = ["for", "innerHTML"];
const _hoisted_3$3 = ["for"];

function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("input", {
      id: _ctx.id,
      type: "checkbox",
      name: _ctx.id
    }, null, 8 /* PROPS */, _hoisted_1$3),
    (_ctx.unescape)
      ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: _ctx.id,
          style: normalizeStyle(`-webkit-line-clamp: ${_ctx.lineClamp}`),
          class: "label",
          innerHTML: _ctx.value
        }, null, 12 /* STYLE, PROPS */, _hoisted_2$3))
      : (openBlock(), createElementBlock("label", {
          key: 1,
          for: _ctx.id,
          style: normalizeStyle(`-webkit-line-clamp: ${_ctx.lineClamp}`),
          class: "label"
        }, toDisplayString(_ctx.value), 13 /* TEXT, STYLE, PROPS */, _hoisted_3$3))
  ], 64 /* STABLE_FRAGMENT */))
}

script$3.render = render$3;
script$3.__file = "stanzas/pagination-table/LineClampCell.vue";

var script$2 = defineComponent({
  components: {
    LineClampCell: script$3,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: "_blank",
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
  },
});

const _hoisted_1$2 = ["href", "target"];
const _hoisted_2$2 = ["href", "target", "innerHTML"];
const _hoisted_3$2 = ["href", "target"];

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LineClampCell = resolveComponent("LineClampCell");

  return (openBlock(), createElementBlock(Fragment, null, [
    (_ctx.unescape && _ctx.lineClamp)
      ? (openBlock(), createElementBlock("a", {
          key: 0,
          href: _ctx.href,
          target: _ctx.target
        }, [
          createVNode(_component_LineClampCell, {
            id: _ctx.id,
            "line-clamp": _ctx.lineClamp,
            unescape: _ctx.unescape,
            value: _ctx.value
          }, null, 8 /* PROPS */, ["id", "line-clamp", "unescape", "value"])
        ], 8 /* PROPS */, _hoisted_1$2))
      : createCommentVNode("v-if", true),
    (_ctx.unescape && !_ctx.lineClamp)
      ? (openBlock(), createElementBlock("a", {
          key: 1,
          href: _ctx.href,
          target: _ctx.target,
          innerHTML: _ctx.value
        }, null, 8 /* PROPS */, _hoisted_2$2))
      : (openBlock(), createElementBlock("a", {
          key: 2,
          href: _ctx.href,
          target: _ctx.target
        }, [
          (_ctx.lineClamp)
            ? (openBlock(), createBlock(_component_LineClampCell, {
                key: 0,
                id: _ctx.id,
                "line-clamp": _ctx.lineClamp,
                value: _ctx.value
              }, null, 8 /* PROPS */, ["id", "line-clamp", "value"]))
            : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(_ctx.value), 1 /* TEXT */)
              ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
        ], 8 /* PROPS */, _hoisted_3$2))
  ], 64 /* STABLE_FRAGMENT */))
}

script$2.render = render$2;
script$2.__file = "stanzas/pagination-table/AnchorCell.vue";

var script$1 = defineComponent({
  props: {
    id: {
      type: String,
      default: null,
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
    charClamp: {
      type: Number,
      default: null,
    },
    charClampOn: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
  },
  emits: ['toggleCharClampOn']
});

const _hoisted_1$1 = ["id", "name"];
const _hoisted_2$1 = ["for", "innerHTML"];
const _hoisted_3$1 = ["for"];
const _hoisted_4$1 = ["id", "value", "name"];
const _hoisted_5$1 = ["for", "innerHTML"];
const _hoisted_6$1 = ["for"];

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.lineClamp)
    ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        createBaseVNode("input", {
          id: _ctx.id,
          type: "checkbox",
          name: _ctx.id,
          class: "lineClampOn"
        }, null, 8 /* PROPS */, _hoisted_1$1),
        (_ctx.unescape)
          ? (openBlock(), createElementBlock("label", {
              key: 0,
              for: _ctx.id,
              style: normalizeStyle(_ctx.lineClamp ? `-webkit-line-clamp: ${_ctx.lineClamp}` : null),
              class: normalizeClass(['label','lineClampOn']),
              innerHTML: _ctx.value
            }, null, 12 /* STYLE, PROPS */, _hoisted_2$1))
          : (openBlock(), createElementBlock("label", {
              key: 1,
              for: _ctx.id,
              style: normalizeStyle(_ctx.lineClamp ? `-webkit-line-clamp: ${_ctx.lineClamp}` : null),
              class: normalizeClass(['label','lineClampOn'])
            }, toDisplayString(_ctx.value), 13 /* TEXT, STYLE, PROPS */, _hoisted_3$1))
      ], 64 /* STABLE_FRAGMENT */))
    : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        createBaseVNode("input", {
          id: _ctx.id,
          value: _ctx.charClampOn,
          type: "checkbox",
          name: _ctx.id,
          class: "charClampOn",
          onChange: _cache[0] || (_cache[0] = $event => (_ctx.$emit('toggleCharClampOn')))
        }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_4$1),
        (_ctx.unescape)
          ? (openBlock(), createElementBlock("label", {
              key: 0,
              for: _ctx.id,
              class: "label charClampOn",
              innerHTML: _ctx.value
            }, null, 8 /* PROPS */, _hoisted_5$1))
          : (openBlock(), createElementBlock("label", {
              key: 1,
              for: _ctx.id,
              class: "label charClampOn"
            }, toDisplayString(_ctx.charClampOn && _ctx.value.length > _ctx.charClamp ? `${_ctx.value.slice(0, _ctx.charClamp)}…` : _ctx.value), 9 /* TEXT, PROPS */, _hoisted_6$1))
      ], 64 /* STABLE_FRAGMENT */))
}

script$1.render = render$1;
script$1.__file = "stanzas/pagination-table/ClampCell.vue";

var lodash_orderby = {exports: {}};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

(function (module, exports) {
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal$1 == 'object' && commonjsGlobal$1 && commonjsGlobal$1.Object === Object && commonjsGlobal$1;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

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
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
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
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
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

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
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
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
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
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

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
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

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
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
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
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

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
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
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
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
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
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
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
 * This method is like `_.sortBy` except that it allows specifying the sort
 * orders of the iteratees to sort by. If `orders` is unspecified, all values
 * are sorted in ascending order. Otherwise, specify an order of "desc" for
 * descending or "asc" for ascending sort order of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @param {string[]} [orders] The sort orders of `iteratees`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 34 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 36 }
 * ];
 *
 * // Sort by `user` in ascending order and by `age` in descending order.
 * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }
  if (!isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }
  orders = guard ? undefined : orders;
  if (!isArray(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return baseOrderBy(collection, iteratees, orders);
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

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
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

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

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = orderBy;
}(lodash_orderby, lodash_orderby.exports));

var orderBy = lodash_orderby.exports;

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
var freeGlobal = typeof commonjsGlobal$1 == 'object' && commonjsGlobal$1 && commonjsGlobal$1.Object === Object && commonjsGlobal$1;

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

var sprintf = {};

/* global window, exports, define */

(function (exports) {
!function() {

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
    };

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments)
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []))
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign;
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i];
            }
            else if (typeof parse_tree[i] === 'object') {
                ph = parse_tree[i]; // convenience purposes only
                if (ph.keys) { // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg == undefined) {
                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                        }
                        arg = arg[ph.keys[k]];
                    }
                }
                else if (ph.param_no) { // positional argument (explicit)
                    arg = argv[ph.param_no];
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                    arg = arg();
                }

                if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
                }

                if (re.number.test(ph.type)) {
                    is_positive = arg >= 0;
                }

                switch (ph.type) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2);
                        break
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10));
                        break
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10);
                        break
                    case 'j':
                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
                        break
                    case 'e':
                        arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
                        break
                    case 'f':
                        arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
                        break
                    case 'g':
                        arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg);
                        break
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8);
                        break
                    case 's':
                        arg = String(arg);
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break
                    case 't':
                        arg = String(!!arg);
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0;
                        break
                    case 'v':
                        arg = arg.valueOf();
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16);
                        break
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                        break
                }
                if (re.json.test(ph.type)) {
                    output += arg;
                }
                else {
                    if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                        sign = is_positive ? '+' : '-';
                        arg = arg.toString().replace(re.sign, '');
                    }
                    else {
                        sign = '';
                    }
                    pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' ';
                    pad_length = ph.width - (sign + arg).length;
                    pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : '';
                    output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg);
                }
            }
        }
        return output
    }

    var sprintf_cache = Object.create(null);

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt]
        }

        var _fmt = fmt, match, parse_tree = [], arg_names = 0;
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0]);
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%');
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [], replacement_field = match[2], field_match = [];
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1]);
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key')
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key')
                    }
                    match[2] = field_list;
                }
                else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
                }

                parse_tree.push(
                    {
                        placeholder: match[0],
                        param_no:    match[1],
                        keys:        match[2],
                        sign:        match[3],
                        pad_char:    match[4],
                        align:       match[5],
                        width:       match[6],
                        precision:   match[7],
                        type:        match[8]
                    }
                );
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder')
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return sprintf_cache[fmt] = parse_tree
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    {
        exports['sprintf'] = sprintf;
        exports['vsprintf'] = vsprintf;
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf;
        window['vsprintf'] = vsprintf;
    }
    /* eslint-enable quote-props */
}(); // eslint-disable-line
}(sprintf));

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "pagination-table",
	"stanza:label": "Pagination table",
	"stanza:definition": "Pagination table MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:contributor": [
],
	"stanza:created": "2020-12-09",
	"stanza:updated": "2020-12-09",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_table_body?taxonomy=9606&limit=1000&offset=0&count=",
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
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:description": "Width"
	},
	{
		"stanza:key": "fixed-columns",
		"stanza:type": "number",
		"stanza:example": 1,
		"stanza:description": "amount of fixed columns",
		"stanza:required": false
	},
	{
		"stanza:key": "padding",
		"stanza:example": "0px",
		"stanza:description": "Padding",
		"stanza:required": false
	},
	{
		"stanza:key": "page-size-option",
		"stanza:example": "10,20,50,100",
		"stanza:description": "Page size list",
		"stanza:required": true
	},
	{
		"stanza:key": "page-slider",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show page slider"
	},
	{
		"stanza:key": "columns",
		"stanza:example": "[{\"id\": \"id\",\"label\": \"Accession\",\"link\": \"uniprot\",\"target\": \"self\"},{\"id\": \"mnemonic\",\"class\": \"mnemonic\",\"label\": \"Mnemonic\"},{\"id\": \"name\",\"label\": \"Proteinname\"},{\"id\": \"mass\",\"label\": \"Mass\",\"type\": \"number\",\"align\": \"right\"},{\"id\": \"location_name\",\"label\": \"Subcellularlocation\",\"link\": \"location_uniprot\",\"type\": \"category\",\"rowspan\": true}]",
		"stanza:description": "Columns' options"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-table-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #EEEEEE",
		"stanza:description": "Table border style"
	},
	{
		"stanza:key": "--togostanza-table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #EEEEEE",
		"stanza:description": "Table shadow style"
	},
	{
		"stanza:key": "--togostanza-thead-border-bottom",
		"stanza:type": "text",
		"stanza:default": "1px solid #EEEEEE",
		"stanza:description": "Border bottom of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Font color of table header"
	},
	{
		"stanza:key": "--togostanza-thead-background-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Background color of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of table header"
	},
	{
		"stanza:key": "--togostanza-tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #EEEEEE",
		"stanza:description": "Border bottom of table body"
	},
	{
		"stanza:key": "--togostanza-tbody-font-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Font color of table body"
	},
	{
		"stanza:key": "--togostanza-tbody-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "Font size of table body"
	},
	{
		"stanza:key": "--togostanza-tbody-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font size of table body"
	},
	{
		"stanza:key": "--togostanza-tbody-odd-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color of table body (odd row)"
	},
	{
		"stanza:key": "--togostanza-tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color of table body (even row)"
	},
	{
		"stanza:key": "--togostanza-control-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #256D80",
		"stanza:description": "Color of control area"
	},
	{
		"stanza:key": "--togostanza-control-active-color",
		"stanza:type": "color",
		"stanza:default": "#ffdf3d",
		"stanza:description": "Active color of control area"
	},
	{
		"stanza:key": "--togostanza-non-active-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255, 255, 255, .7)",
		"stanza:description": "Non active color of control area"
	},
	{
		"stanza:key": "--togostanza-control-font-color",
		"stanza:type": "color",
		"stanza:default": "#707070",
		"stanza:description": "Font color of control area"
	},
	{
		"stanza:key": "--togostanza-control-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "Font size of control area"
	},
	{
		"stanza:key": "--togostanza-control-border-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "Border radius of control area (boxes)"
	},
	{
		"stanza:key": "--togostanza-pagination-font-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "Font color of pagination button"
	},
	{
		"stanza:key": "--togostanza-pagination-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "Font size of pagination button"
	},
	{
		"stanza:key": "--togostanza-pagination-background-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Background color of pagination button"
	},
	{
		"stanza:key": "--togostanza-pagination-border",
		"stanza:type": "text",
		"stanza:default": "1px solid rgba(0, 0, 0, 0.1)",
		"stanza:description": "Border style of pagination button"
	},
	{
		"stanza:key": "--togostanza-pagination-border-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "Border radius of pagination button"
	},
	{
		"stanza:key": "--togostanza-pagination-padding",
		"stanza:type": "text",
		"stanza:default": "2px 8px",
		"stanza:description": "Padding of pagination button"
	},
	{
		"stanza:key": "--togostanza-pagination-current-font-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Font color of pagination button (at current page)"
	},
	{
		"stanza:key": "--togostanza-pagination-current-background-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Background color of pagination button (at current page)"
	},
	{
		"stanza:key": "--togostanza-pagination-current-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #256D80",
		"stanza:description": "Border style of pagination button (at current page)"
	},
	{
		"stanza:key": "--togostanza-pagination-arrow-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Color of pagination arrow button"
	},
	{
		"stanza:key": "--togostanza-vertical-pagination-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"column",
			"column-reverse"
		],
		"stanza:default": "column-reverse",
		"stanza:description": "Vertical pacement of pagination"
	},
	{
		"stanza:key": "--togostanza-horizonal-pagination-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "Horizonal placement of pagination"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "#F8F9FA",
		"stanza:description": "Background color"
	}
]
};

library.add(faEllipsisH, faFilter, faSearch, faSort, faSortUp, faSortDown);

var script = defineComponent({
  components: {
    Slider: m,
    SliderPagination: script$4,
    AnchorCell: script$2,
    ClampCell: script$1,
    FontAwesomeIcon,
  },

  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const sliderPagination = ref();
    const pageSizeOption = params.pageSizeOption.split(",").map(Number);

    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      queryForAllColumns: "",

      sorting: {
        direction: "desc",
      },

      pagination: {
        currentPage: 1,
        perPage: pageSizeOption[0],
        isSliderOn: params.pageSlider,
      },
    });

    const filteredRows = computed(() => {
      const queryForAllColumns = state.queryForAllColumns;
      let filtered = state.allRows.filter((row) => {
        return (
          searchByAllColumns(row, queryForAllColumns) && searchByEachColumn(row)
        );
      });

      const sortColumn = state.sorting.column;

      if (sortColumn) {
        filtered = orderBy(
          filtered,
          (cells) => {
            const cell = cells.find((cell) => cell.column === sortColumn);
            return cell.value;
          },
          [state.sorting.direction]
        );
        return filtered;
      } else {
        return filtered;
      }
    });

    const totalPages = computed(() => {
      const totalPages = Math.ceil(
        filteredRows.value.length / state.pagination.perPage
      );
      return totalPages;
    });

    watch(
      () => totalPages.value,
      (totalPages) => {
        if (totalPages > 0 && state.pagination.currentPage > totalPages) {
          updateCurrentPage(totalPages);
          if (sliderPagination.value) {
            sliderPagination.value.inputtingCurrentPage = totalPages;
          }
        }
      }
    );

    const rowsInCurrentPage = computed(() => {
      const { currentPage, perPage } = state.pagination;

      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;

      return setRowspanState(filteredRows.value.slice(startIndex, endIndex));
    });

    const isModalShowing = computed(() => {
      return state.columns.some(
        ({ isSearchModalShowing }) => isSearchModalShowing
      );
    });

    const isPopupOrModalShowing = computed(() => {
      return (
        state.columns.some(
          ({ isFilterPopupShowing }) => isFilterPopupShowing
        ) || isModalShowing.value
      );
    });

    function setRowspanState(rows) {
      const rowspanCount = {};
      const reversedRows = rows.reverse().map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          if (cell.column.rowspan) {
            delete cell.hide;
            delete cell.rowspanCount;
            const aboveValue = rows[rowIndex + 1]
              ? rows[rowIndex + 1][colIndex].value
              : null;
            const colId = cell.column.id;
            if (cell.value === aboveValue) {
              cell.hide = true;
              rowspanCount[colId] = rowspanCount[colId]
                ? rowspanCount[colId] + 1
                : 1;
            } else if (rowspanCount[colId] >= 1) {
              cell.rowspanCount = rowspanCount[colId] + 1;
              delete rowspanCount[colId];
            }
          }
          return cell;
        });
      });
      return reversedRows.reverse();
    }

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

    function setRangeFilters(column) {
      if (
        column.inputtingRangeMin < column.minValue ||
        column.inputtingRangeMax > column.maxValue
      ) {
        return;
      }
      column.rangeMin = column.inputtingRangeMin;
      column.rangeMax = column.inputtingRangeMax;
    }

    function showModal(column) {
      column.isSearchModalShowing = true;
    }

    function closeModal() {
      for (const column of state.columns) {
        column.isFilterPopupShowing = null;
        column.isSearchModalShowing = null;
      }
    }

    function updateCurrentPage(currentPage) {
      state.pagination.currentPage = currentPage;
    }

    async function fetchData() {
      const data = await loadData(params.dataUrl, params.dataType);
      // const data = testData;

      state.responseJSON = data;
      let columns;
      if (params.columns) {
        columns = JSON.parse(params.columns).map((column, index) => {
          column.fixed = index < params.fixedColumns;
          return column;
        });
      } else if (data.length > 0) {
        const firstRow = data[0];
        columns = Object.keys(firstRow).map((key, index) => {
          return {
            id: key,
            label: key,
            fixed: index < params.fixedColumns,
          };
        });
      } else {
        columns = [];
      }

      state.columns = columns.map((column) => {
        const values = data.map((obj) => obj[column.id]);
        return createColumnState(column, values);
      });

      state.allRows = data.map((row) => {
        return state.columns.map((column) => {
          return {
            column,
            value: column.parseValue(row[column.id]),
            href: column.href ? row[column.href] : null,
            charClampOn: true
          };
        });
      });
    }

    onMounted(fetchData);

    const thead = ref(null);
    onRenderTriggered(() => {
      setTimeout(() => {
        const thList = thead.value.children[0].children;
        state.thListWidth = Array.from(thList).map((th) => th.clientWidth);
      }, 0);
    });

    const json = () => {
      return state.responseJSON;
    };

    return {
      width: params.width ? params.width + "px" : "100%",
      sliderPagination,
      pageSizeOption,
      state,
      totalPages,
      rowsInCurrentPage,
      isModalShowing,
      isPopupOrModalShowing,
      setSorting,
      setFilters,
      setRangeFilters,
      showModal,
      closeModal,
      updateCurrentPage,
      thead,
      json,
    };
  },
});

function createColumnState(columnDef, values) {
  const baseProps = {
    id: columnDef.id,
    label: columnDef.label,
    searchType: columnDef.type,
    rowspan: columnDef.rowspan,
    href: columnDef.link,
    class: columnDef.class,
    unescape: columnDef.escape === false,
    align: columnDef.align,
    fixed: columnDef.fixed,
    target: columnDef.target,
    lineClamp: columnDef["line-clamp"],
    charClamp: columnDef["char-clamp"],
    sprintf: columnDef["sprintf"],
  };

  if (columnDef.type === "number") {
    const nums = values.map(Number);
    const minValue = Math.min(...nums);
    const maxValue = Math.max(...nums) < 1 ? 1 : Math.max(...nums);
    const rangeMin = ref(minValue);
    const rangeMax = ref(maxValue);
    const range = computed(() => [rangeMin.value, rangeMax.value]);
    const inputtingRangeMin = ref(rangeMin.value);
    const inputtingRangeMax = ref(rangeMax.value);

    const isSearchConditionGiven = computed(() => {
      return minValue < rangeMin.value || maxValue > rangeMax.value;
    });

    const setRange = ([min, max]) => {
      rangeMin.value = min;
      rangeMax.value = max;
      inputtingRangeMin.value = min;
      inputtingRangeMax.value = max;
    };

    return {
      ...baseProps,
      minValue,
      maxValue,
      rangeMin,
      rangeMax,
      range,
      setRange,
      isSearchConditionGiven,
      inputtingRangeMin,
      inputtingRangeMax,
      isSearchModalShowing: false,
      parseValue(val) {
        if (columnDef["sprintf"]) {
          val = sprintf.sprintf(columnDef["sprintf"], Number.parseFloat(val));
        }
        return val;
      },

      isMatch(val) {
        return val >= rangeMin.value && val <= rangeMax.value;
      },
    };
  } else {
    const query = ref("");
    const isSearchConditionGiven = computed(() => query.value !== "");

    const filters =
      columnDef.type === "category"
        ? lodash_uniq(values)
            .sort()
            .map((value) => {
              return reactive({
                value,
                checked: true,
              });
            })
        : null;

    const filter = (val) => {
      const selected = filters.filter(({ checked }) => checked);
      return selected.some(({ value }) => value === val);
    };

    const search = (val) => {
      const q = query.value;
      return q ? val.includes(q) : true;
    };

    return {
      ...baseProps,
      parseValue: String,
      query,
      isSearchConditionGiven,
      filters,
      isFilterModalShowing: false,
      isSearchModalShowing: false,

      isMatch(val) {
        return columnDef.type === "category"
          ? search(val) && filter(val)
          : search(val);
      },
    };
  }
}

function searchByAllColumns(row, query) {
  if (!query) {
    return true;
  }

  return row.some(({ value }) => String(value).includes(query));
}

function searchByEachColumn(row) {
  return row.every((cell) => {
    return cell.column.isMatch(cell.value);
  });
}

const _hoisted_1 = { class: "tableOptionWrapper" };
const _hoisted_2 = { class: "tableOption" };
const _hoisted_3 = { class: "entries" };
const _hoisted_4 = /*#__PURE__*/createTextVNode(" Show ");
const _hoisted_5 = ["value"];
const _hoisted_6 = /*#__PURE__*/createTextVNode(" entries ");
const _hoisted_7 = { key: 0 };
const _hoisted_8 = { ref: "thead" };
const _hoisted_9 = { class: "filterWindow" };
const _hoisted_10 = { class: "filterWindowTitle" };
const _hoisted_11 = { class: "filters" };
const _hoisted_12 = ["for"];
const _hoisted_13 = ["id", "onUpdate:modelValue"];
const _hoisted_14 = { class: "toggleAllButton" };
const _hoisted_15 = ["onClick"];
const _hoisted_16 = ["onClick"];
const _hoisted_17 = { class: "title" };
const _hoisted_18 = { key: 0 };
const _hoisted_19 = { class: "rangeInput" };
const _hoisted_20 = /*#__PURE__*/createBaseVNode("span", { class: "rangeInputLabel" }, " From ", -1 /* HOISTED */);
const _hoisted_21 = ["onUpdate:modelValue", "onInput"];
const _hoisted_22 = /*#__PURE__*/createBaseVNode("span", { class: "dash" }, null, -1 /* HOISTED */);
const _hoisted_23 = /*#__PURE__*/createBaseVNode("span", { class: "rangeInputLabel" }, " To ", -1 /* HOISTED */);
const _hoisted_24 = ["onUpdate:modelValue", "onInput"];
const _hoisted_25 = ["onUpdate:modelValue"];
const _hoisted_26 = ["rowspan"];
const _hoisted_27 = { key: 0 };
const _hoisted_28 = { key: 1 };
const _hoisted_29 = ["innerHTML"];
const _hoisted_30 = { key: 3 };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
  const _component_Slider = resolveComponent("Slider");
  const _component_AnchorCell = resolveComponent("AnchorCell");
  const _component_ClampCell = resolveComponent("ClampCell");
  const _component_SliderPagination = resolveComponent("SliderPagination");

  return (openBlock(), createElementBlock("div", {
    class: "wrapper",
    style: normalizeStyle(`width: ${_ctx.width};`)
  }, [
    createBaseVNode("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        withDirectives(createBaseVNode("input", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (_ctx.state.queryForAllColumns = $event)),
          type: "text",
          placeholder: "Search for keywords...",
          class: "textSearchInput"
        }, null, 512 /* NEED_PATCH */), [
          [vModelText, _ctx.state.queryForAllColumns]
        ]),
        createBaseVNode("p", _hoisted_3, [
          _hoisted_4,
          withDirectives(createBaseVNode("select", {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (_ctx.state.pagination.perPage = $event))
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pageSizeOption, (size) => {
              return (openBlock(), createElementBlock("option", {
                key: size,
                value: size
              }, toDisplayString(size), 9 /* TEXT, PROPS */, _hoisted_5))
            }), 128 /* KEYED_FRAGMENT */))
          ], 512 /* NEED_PATCH */), [
            [vModelSelect, _ctx.state.pagination.perPage]
          ]),
          _hoisted_6
        ])
      ]),
      createBaseVNode("div", {
        class: "tableWrapper",
        style: normalizeStyle(`width: ${_ctx.width};`)
      }, [
        (_ctx.state.allRows)
          ? (openBlock(), createElementBlock("table", _hoisted_7, [
              createBaseVNode("thead", _hoisted_8, [
                createBaseVNode("tr", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.state.columns, (column, i) => {
                    return (openBlock(), createElementBlock("th", {
                      key: column.id,
                      class: normalizeClass({ fixed: column.fixed }),
                      style: normalizeStyle(
                  column.fixed
                    ? `left: ${i === 0 ? 0 : _ctx.state.thListWidth[i - 1]}px;`
                    : null
                )
                    }, [
                      createTextVNode(toDisplayString(column.label) + " ", 1 /* TEXT */),
                      (_ctx.state.sorting.column === column)
                        ? (openBlock(), createBlock(_component_font_awesome_icon, {
                            key: `sort-${
                    _ctx.state.sorting.direction === 'asc' ? 'up' : 'down'
                  }`,
                            class: "icon sort active",
                            icon: `sort-${
                    _ctx.state.sorting.direction === 'asc' ? 'up' : 'down'
                  }`,
                            onClick: $event => (_ctx.setSorting(column))
                          }, null, 8 /* PROPS */, ["icon", "onClick"]))
                        : (openBlock(), createBlock(_component_font_awesome_icon, {
                            key: 1,
                            class: "icon sort",
                            icon: "sort",
                            onClick: $event => (_ctx.setSorting(column))
                          }, null, 8 /* PROPS */, ["onClick"])),
                      createVNode(_component_font_awesome_icon, {
                        class: normalizeClass([
                    'icon',
                    'search',
                    { active: column.isSearchConditionGiven },
                  ]),
                        icon: "search",
                        onClick: $event => (_ctx.showModal(column))
                      }, null, 8 /* PROPS */, ["class", "onClick"]),
                      (column.searchType === 'category')
                        ? (openBlock(), createBlock(_component_font_awesome_icon, {
                            key: 2,
                            icon: "filter",
                            class: normalizeClass([
                    'icon',
                    'filter',
                    { isShowing: column.isFilterPopupShowing },
                    {
                      active: column.filters.some((filter) => !filter.checked),
                    },
                  ]),
                            onClick: $event => (column.isFilterPopupShowing = true)
                          }, null, 8 /* PROPS */, ["class", "onClick"]))
                        : createCommentVNode("v-if", true),
                      createVNode(Transition, { name: "modal" }, {
                        default: withCtx(() => [
                          (column.isFilterPopupShowing)
                            ? (openBlock(), createElementBlock("div", {
                                key: 0,
                                class: normalizeClass([
                      'filterWrapper',
                      'modal',
                      { lastCol: _ctx.state.columns.length - 1 === i },
                    ])
                              }, [
                                createBaseVNode("div", _hoisted_9, [
                                  createBaseVNode("p", _hoisted_10, toDisplayString(column.label), 1 /* TEXT */),
                                  createBaseVNode("ul", _hoisted_11, [
                                    (openBlock(true), createElementBlock(Fragment, null, renderList(column.filters, (filter) => {
                                      return (openBlock(), createElementBlock("li", {
                                        key: filter.value
                                      }, [
                                        createBaseVNode("label", {
                                          for: filter.id
                                        }, [
                                          withDirectives(createBaseVNode("input", {
                                            id: filter.value,
                                            "onUpdate:modelValue": $event => (filter.checked = $event),
                                            type: "checkbox",
                                            name: "items"
                                          }, null, 8 /* PROPS */, _hoisted_13), [
                                            [vModelCheckbox, filter.checked]
                                          ]),
                                          createTextVNode(" " + toDisplayString(filter.value), 1 /* TEXT */)
                                        ], 8 /* PROPS */, _hoisted_12)
                                      ]))
                                    }), 128 /* KEYED_FRAGMENT */))
                                  ]),
                                  createBaseVNode("div", _hoisted_14, [
                                    createBaseVNode("button", {
                                      class: "selectAll",
                                      onClick: $event => (_ctx.setFilters(column, true))
                                    }, " Select All ", 8 /* PROPS */, _hoisted_15),
                                    createBaseVNode("button", {
                                      class: "clear",
                                      onClick: $event => (_ctx.setFilters(column, false))
                                    }, " Clear ", 8 /* PROPS */, _hoisted_16)
                                  ])
                                ])
                              ], 2 /* CLASS */))
                            : createCommentVNode("v-if", true)
                        ]),
                        _: 2 /* DYNAMIC */
                      }, 1024 /* DYNAMIC_SLOTS */),
                      createVNode(Transition, { name: "modal" }, {
                        default: withCtx(() => [
                          (column.isSearchModalShowing)
                            ? (openBlock(), createElementBlock("div", {
                                key: 0,
                                class: normalizeClass([
                      'textSearchByColumnWrapper',
                      'modal',
                      { lastCol: _ctx.state.columns.length - 1 === i },
                    ])
                              }, [
                                createBaseVNode("p", _hoisted_17, [
                                  (column.searchType === 'number')
                                    ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                                        createTextVNode(toDisplayString(column.label) + " range ", 1 /* TEXT */)
                                      ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                                    : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                                        createTextVNode(toDisplayString(column.label), 1 /* TEXT */)
                                      ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                                ]),
                                (column.searchType === 'number')
                                  ? (openBlock(), createElementBlock("div", _hoisted_18, [
                                      createVNode(_component_Slider, {
                                        "model-value": column.range,
                                        min: column.minValue,
                                        max: column.maxValue,
                                        tooltips: false,
                                        step: -1,
                                        onUpdate: column.setRange
                                      }, null, 8 /* PROPS */, ["model-value", "min", "max", "onUpdate"]),
                                      createBaseVNode("div", _hoisted_19, [
                                        createBaseVNode("div", null, [
                                          _hoisted_20,
                                          withDirectives(createBaseVNode("input", {
                                            "onUpdate:modelValue": $event => (column.inputtingRangeMin = $event),
                                            type: "text",
                                            class: "min",
                                            onInput: $event => (_ctx.setRangeFilters(column))
                                          }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_21), [
                                            [
                                              vModelText,
                                              column.inputtingRangeMin,
                                              void 0,
                                              { number: true }
                                            ]
                                          ])
                                        ]),
                                        _hoisted_22,
                                        createBaseVNode("div", null, [
                                          _hoisted_23,
                                          withDirectives(createBaseVNode("input", {
                                            "onUpdate:modelValue": $event => (column.inputtingRangeMax = $event),
                                            type: "text",
                                            class: "max",
                                            onInput: $event => (_ctx.setRangeFilters(column))
                                          }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_24), [
                                            [
                                              vModelText,
                                              column.inputtingRangeMax,
                                              void 0,
                                              { number: true }
                                            ]
                                          ])
                                        ])
                                      ])
                                    ]))
                                  : withDirectives((openBlock(), createElementBlock("input", {
                                      key: 1,
                                      "onUpdate:modelValue": $event => (column.query = $event),
                                      type: "text",
                                      placeholder: "Search for keywords...",
                                      name: "queryInputByColumn",
                                      class: "textSearchInput"
                                    }, null, 8 /* PROPS */, _hoisted_25)), [
                                      [vModelText, column.query]
                                    ])
                              ], 2 /* CLASS */))
                            : createCommentVNode("v-if", true)
                        ]),
                        _: 2 /* DYNAMIC */
                      }, 1024 /* DYNAMIC_SLOTS */)
                    ], 6 /* CLASS, STYLE */))
                  }), 128 /* KEYED_FRAGMENT */))
                ])
              ], 512 /* NEED_PATCH */),
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.rowsInCurrentPage, (row, row_index) => {
                  return (openBlock(), createElementBlock("tr", {
                    key: row.id
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(row, (cell, i) => {
                      return (openBlock(), createElementBlock("td", {
                        key: cell.column.id,
                        rowspan: cell.rowspanCount,
                        class: normalizeClass([
                  { hide: cell.hide },
                  cell.column.align,
                  { fixed: cell.column.fixed },
                  cell.column.class,
                ]),
                        style: normalizeStyle(
                  cell.column.fixed
                    ? `left: ${i === 0 ? 0 : _ctx.state.thListWidth[i - 1]}px;`
                    : null
                )
                      }, [
                        (cell.href)
                          ? (openBlock(), createElementBlock("span", _hoisted_27, [
                              createVNode(_component_AnchorCell, {
                                id: `${cell.column.id}_${row_index}`,
                                href: cell.href,
                                value: cell.value,
                                target: 
                      cell.column.target ? `_${cell.column.target}` : '_blank'
                    ,
                                unescape: cell.column.unescape,
                                "line-clamp": cell.column.lineClamp,
                                "char-clamp": cell.column.charClamp,
                                "char-clamp-on": cell.column.charClampOn
                              }, null, 8 /* PROPS */, ["id", "href", "value", "target", "unescape", "line-clamp", "char-clamp", "char-clamp-on"])
                            ]))
                          : (cell.column.lineClamp || cell.column.charClamp)
                            ? (openBlock(), createElementBlock("span", _hoisted_28, [
                                createVNode(_component_ClampCell, {
                                  id: `${cell.column.id}_${row_index}`,
                                  "line-clamp": cell.column.lineClamp,
                                  "char-clamp": cell.column.charClamp,
                                  "char-clamp-on": cell.charClampOn,
                                  unescape: cell.column.unescape,
                                  value: cell.value,
                                  onToggleCharClampOn: $event => (cell.charClampOn = !cell.charClampOn)
                                }, null, 8 /* PROPS */, ["id", "line-clamp", "char-clamp", "char-clamp-on", "unescape", "value", "onToggleCharClampOn"])
                              ]))
                            : (cell.column.unescape)
                              ? (openBlock(), createElementBlock("span", {
                                  key: 2,
                                  innerHTML: cell.value
                                }, null, 8 /* PROPS */, _hoisted_29))
                              : (openBlock(), createElementBlock("span", _hoisted_30, toDisplayString(cell.value), 1 /* TEXT */))
                      ], 14 /* CLASS, STYLE, PROPS */, _hoisted_26))
                    }), 128 /* KEYED_FRAGMENT */))
                  ]))
                }), 128 /* KEYED_FRAGMENT */))
              ])
            ]))
          : createCommentVNode("v-if", true)
      ], 4 /* STYLE */)
    ]),
    createVNode(_component_SliderPagination, {
      ref: "sliderPagination",
      "current-page": _ctx.state.pagination.currentPage,
      "total-pages": _ctx.totalPages,
      "is-slider-on": _ctx.state.pagination.isSliderOn,
      onUpdateCurrentPage: _ctx.updateCurrentPage
    }, null, 8 /* PROPS */, ["current-page", "total-pages", "is-slider-on", "onUpdateCurrentPage"]),
    (_ctx.isPopupOrModalShowing)
      ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modalBackground",
          onClick: _cache[2] || (_cache[2] = $event => (_ctx.closeModal()))
        }))
      : createCommentVNode("v-if", true)
  ], 4 /* STYLE */))
}

script.render = render;
script.__file = "stanzas/pagination-table/app.vue";

class PaginationTable extends Stanza {
  menu() {
    return [
      downloadJSONMenuItem(this, "table", this._component?.json()),
      downloadCSVMenuItem(this, "table", this._component?.json()),
      downloadTSVMenuItem(this, "table", this._component?.json()),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = this.params["padding"];

    this._app?.unmount();
    this._app = createApp(script, this.params);
    this._component = this._app.mount(main);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': PaginationTable
});

var templates = [
  
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=pagination-table.js.map
