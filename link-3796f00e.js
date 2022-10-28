import { s as slice } from './array-80a7907a.js';
import { c as constant } from './constant-c49047a5.js';
import { x, y } from './point-7945b9d0.js';
import { p as path } from './path-a78af922.js';

function pointRadial(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

class Bump {
  constructor(context, x) {
    this._context = context;
    this._x = x;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  }
  point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: {
        this._point = 1;
        if (this._line) this._context.lineTo(x, y);
        else this._context.moveTo(x, y);
        break;
      }
      case 1: this._point = 2; // falls through
      default: {
        if (this._x) this._context.bezierCurveTo(this._x0 = (this._x0 + x) / 2, this._y0, this._x0, y, x, y);
        else this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + y) / 2, x, this._y0, x, y);
        break;
      }
    }
    this._x0 = x, this._y0 = y;
  }
}

class BumpRadial {
  constructor(context) {
    this._context = context;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {}
  point(x, y) {
    x = +x, y = +y;
    if (this._point++ === 0) {
      this._x0 = x, this._y0 = y;
    } else {
      const p0 = pointRadial(this._x0, this._y0);
      const p1 = pointRadial(this._x0, this._y0 = (this._y0 + y) / 2);
      const p2 = pointRadial(x, this._y0);
      const p3 = pointRadial(x, y);
      this._context.moveTo(...p0);
      this._context.bezierCurveTo(...p1, ...p2, ...p3);
    }
  }
}

function bumpX(context) {
  return new Bump(context, true);
}

function bumpY(context) {
  return new Bump(context, false);
}

function bumpRadial(context) {
  return new BumpRadial(context);
}

function linkSource(d) {
  return d.source;
}

function linkTarget(d) {
  return d.target;
}

function link(curve) {
  let source = linkSource;
  let target = linkTarget;
  let x$1 = x;
  let y$1 = y;
  let context = null;
  let output = null;

  function link() {
    let buffer;
    const argv = slice.call(arguments);
    const s = source.apply(this, argv);
    const t = target.apply(this, argv);
    if (context == null) output = curve(buffer = path());
    output.lineStart();
    argv[0] = s, output.point(+x$1.apply(this, argv), +y$1.apply(this, argv));
    argv[0] = t, output.point(+x$1.apply(this, argv), +y$1.apply(this, argv));
    output.lineEnd();
    if (buffer) return output = null, buffer + "" || null;
  }

  link.source = function(_) {
    return arguments.length ? (source = _, link) : source;
  };

  link.target = function(_) {
    return arguments.length ? (target = _, link) : target;
  };

  link.x = function(_) {
    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), link) : x$1;
  };

  link.y = function(_) {
    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), link) : y$1;
  };

  link.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), link) : context;
  };

  return link;
}

function linkHorizontal() {
  return link(bumpX);
}

function linkVertical() {
  return link(bumpY);
}

function linkRadial() {
  const l = link(bumpRadial);
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;
  return l;
}

export { linkHorizontal as a, linkVertical as b, linkRadial as c, bumpX as d, bumpY as e, link as l, pointRadial as p };
//# sourceMappingURL=link-3796f00e.js.map
