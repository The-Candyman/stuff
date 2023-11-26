class LineShape {
  constructor(points, objSettings = {}, center = [], preview = true) {
    this.points = points;
    this.settings = Object.assign({
      display: true,
      smooth: false,
      tension: 0.35,
      edgeColor: "black", // console.log(objects[objects.push(new LineShape([[100,100],[100,300],[300,300],[300,100]], settings.Paint)) - 1]); render(false);
      edgeWidth: 2,
      closed: false,
      filled: false,
      fillColor: "black"
    }, objSettings);
    if (center.length === 2) {this.center = center} else {
      this.center = [0, 0];
      this.resetCenter();
    }
    if (!preview) {previewRender(this);};
  }
  changeSettings(newSettings = {}) {
    Object.assign(this.settings, newSettings);  // objects[0].changeSettings({closed:true,filled:true,fillColor:"brown"});
    render();
  }
  draw(isPreview, pb) {
    if (this.settings.display  &&  (this.settings.edgeWidth  ||  this.settings.filled)) {
      pb.beginPath();
      pb.strokeStyle = this.settings.edgeColor;
      pb.lineWidth = this.settings.edgeWidth;
      if (this.settings.smooth  &&  !isPreview  &&  this.points.length > 1) {
        let controls = generateSplineControlPoints(this.points, this.settings.tension, this.settings.closed);
        pb.moveTo(this.points[0][0] + this.center[0], this.points[0][1] + this.center[1]);
        for (let i = 1; i < this.points.length; i++) {
             //console.log(...controls[2 * i - 1].map((e, i) => e + this.center[i%2]), ...controls[2 * i].map((e, i) => e + this.center[i%2]), ...this.points[i].map((e, i) => e + this.center[i%2]));
          pb.bezierCurveTo(...controls[2 * i - 1].map((e, i) => e + this.center[i%2]), ...controls[2 * i].map((e, i) => e + this.center[i%2]), ...this.points[i].map((e, i) => e + this.center[i%2]));
        }
        if (this.settings.closed) {
             //console.log(...controls[controls.length - 1].map((e, i) => e + this.center[i%2]), ...controls[0].map((e, i) => e + this.center[i%2]), ...this.points[i].map((e, i) => e + this.center[i%2]));
          pb.bezierCurveTo(...controls[controls.length - 1].map((e, i) => e + this.center[i%2]), ...controls[0].map((e, i) => e + this.center[i%2]), ...this.points[0].map((e, i) => e + this.center[i%2]));
        }
      } else {
        pb.moveTo(this.points[0][0] + this.center[0], this.points[0][1] + this.center[1]);
        for (let i = 0; i < this.points.length; i++) {
          pb.lineTo(this.points[i][0] + this.center[0], this.points[i][1] + this.center[1]);
        }
        if (this.settings.closed) {
          pb.lineTo(this.points[0][0] + this.center[0], this.points[0][1] + this.center[1]);
        }
      }
      if (this.settings.filled) {
        pb.fillStyle = this.settings.fillColor;
        pb.fill();
      }
      if (this.settings.edgeWidth) {
        pb.stroke();
     pb.moveTo(this.points[0][0] + this.center[0], this.points[0][1] + this.center[1]);
        pb.arc(this.points[0][0] + this.center[0], this.points[0][1] + this.center[1], this.settings.edgeWidth / 4, 0, 2 * Math.PI);
     pb.moveTo(this.points[this.points.length - 1][0] + this.center[0], this.points[this.points.length - 1][1] + this.center[1]);
        pb.arc(this.points[this.points.length - 1][0] + this.center[0], this.points[this.points.length - 1][1] + this.center[1], this.settings.edgeWidth / 4, 0, 2 * Math.PI);
        pb.lineWidth /= 2;
        pb.stroke();
      }
      pb.closePath();
    }
  }
  addPoint(point) {
    this.points.push([point[0] - this.center[0], point[1] - this.center[1]]);
    previewRender(this);
  }
  deletePoint(i) {
    this.points.splice(i, 1);
    previewRender(this);
  }
  splicePoints(i, del, points) {
    this.points.splice(i, del, ...points);
    previewRender(this);
  }
  setCenter(newCenter) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i][0] += this.center[0] - newCenter[0];
      this.points[i][1] += this.center[1] - newCenter[1];
    }
    this.center = newCenter;
  }
  resetCenter() {
    this.setCenter(this.getBoundingBoxCenter("global"));
  }
  setPosition(x, y) {
    this.center = [x, y];
    previewRender(this);
  }
  translate(x, y) {
    this.center[0] += x;
    this.center[1] += y;
    previewRender(this);
  }
  translateLocal(x, y) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i][0] += x;
      this.points[i][1] += y;
    }
    previewRender(this);
  }
  rotate(angle) {
    let oldAngle;
    let radius;
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i][0] === 0  &&  this.points[i][1] === 0) {continue;}
      oldAngle = Math.atan2(this.points[i][1], this.points[i][0]);
      radius = Math.sqrt(this.points[i][0] ** 2 + this.points[i][1] ** 2);  // objects[0].rotate(1);
      this.points[i][0] = radius * Math.cos(angle + oldAngle);
      this.points[i][1] = radius * Math.sin(angle + oldAngle);
    }
    previewRender(this);
  }
  stretch(xFactor, yFactor) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i][0] *= xFactor;
      this.points[i][1] *= yFactor;
    }
  }
  stretchX(xFactor) {this.stretch(xFactor, 1);}
  stretchY(yFactor) {this.stretch(1, yFactor);}
  scale(factor) {this.stretch(factor, factor);}
  getBoundingBox(localOrGlobal, valuesOrPoints = "values") {
    if (this.points.length === 1) {
      return (valuesOrPoints == "values"?
        (localOrGlobal == "local"? 
                [this.points[0][1], this.points[0][1], this.points[0][0], this.points[0][0]] : 
                    [this.points[0][1] + this.center[1], 
                     this.points[0][1] + this.center[1], 
                     this.points[0][0] + this.center[0], 
                     this.points[0][0] + this.center[0]]) : 
        (localOrGlobal == "local"? 
                Array(4).fill(this.points[0]) : 
                Array(4).fill([this.points[0][0] + this.center[0], this.points[0][1] + this.center[1]])));
    }
    let top = this.points[0][1];
    let bottom = this.points[0][1];
    let left = this.points[0][0];
    let right = this.points[0][0];
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i][1] > bottom) {
        bottom = this.points[i][1];
      } else if (this.points[i][1] < top) {      // bottom > top
        top = this.points[i][1];
      }
      if (this.points[i][0] > right) {
        right = this.points[i][0];
      } else if (this.points[i][0] < left) {    // right > left
        left = this.points[i][0];
      }
    }
    if (valuesOrPoints == "values") {
      return (localOrGlobal == "local"? 
              [top, bottom, left, right] : 
              [top + this.center[1], bottom + this.center[1], left + this.center[0], right + this.center[0]]);
    } else {
      return (localOrGlobal == "local"? 
              [[left, top], [right, top], [right, bottom], [left, bottom]] : 
                  [[left + this.center[0], bottom + this.center[1]], 
                   [right + this.center[0], bottom + this.center[1]], 
                   [right + this.center[0], top + this.center[1]], 
                   [left + this.center[0], top + this.center[1]]]);
    }
  }
  getBoundingBoxCenter(localOrGlobal) {
    if (this.points.length === 1) {return (localOrGlobal == "local"? this.points[0] : [this.points[0][0] + this.center[0], this.points[0][1] + this.center[1]]);}
    let bounds = this.getBoundingBox(localOrGlobal);
    return [(bounds[2] + bounds[3]) / 2, (bounds[0] + bounds[1]) / 2];
  }
}

function generateSplineControlPoints(points, tension, closed = false) {
  let controlPoints = [];
  for (let i = 0; i < points.length; i++) {
    const startCap = closed? points[points.length - 1] : [2 * points[0][0] - points[1][0], 2 * points[0][1] - points[1][1]];
    const endCap = closed? points[0] : [2 * points[points.length - 1][0] - points[points.length - 2][0], 2 * points[points.length - 1][1] - points[points.length - 2][1]];
    const x0 = i !== 0? points[i - 1][0] : startCap[0], 
        y0 = i !== 0? points[i - 1][1] : startCap[1], 
        x1 = points[i][0], 
        y1 = points[i][1], 
        x2 = i !== points.length - 1? points[i + 1][0] : endCap[0], 
        y2 = i !== points.length - 1? points[i + 1][1] : endCap[1];
    const angle = Math.atan2(y2 - y0, x2 - x0);
    const projected = projectPointToLine(points[i - 1]  ||  startCap, points[i + 1]  ||  endCap, points[i]);
    const v0 = [tension * (x0 - projected[0]), tension * (y0 - projected[1])];
    const v1 = [tension * (x2 - projected[0]), tension * (y2 - projected[1])];
    controlPoints.push([x1 + v0[0], y1 + v0[1]], [x1 + v1[0], y1 + v1[1]]);
  }
  return controlPoints;
}

function projectPointToLine(p0, p1, q) { // projectPointToLine([4,4], [2,2], [1,2]);
  if (p0[0] === p1[0]  &&  p0[1] === p1[1]) {return p0;}
  let U = ((q[0] - p0[0]) * (p1[0] - p0[0]) + (q[1] - p0[1]) * (p1[1] - p0[1])) / ((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2);
  return [p0[0] + U * (p1[0] - p0[0]), p0[1] + U * (p1[1] - p0[1])];
}