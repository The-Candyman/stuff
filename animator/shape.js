function makePolygonalSpline(polygon, objsettings = {}) { // polygon: [[centerX, centerY], size, sides, rotation (radians)]
  let points = [];
  for (let i = 0; i < polygon[2]; i++) {
    let x = polygon[1] * Math.cos(i * 2 * Math.PI / polygon[2] + polygon[3]);
    let y = polygon[1] * Math.sin(i * 2 * Math.PI / polygon[2] + polygon[3]);
    points.push([x, y]);
  }
  objsettings = Object.assign({
      display: true,
      smooth: false,
      tension: 0.35,
      edgeColor: "black", // console.log(objects[objects.push(makePolygonalSpline([[200, 200], 50, 10, 0])) - 1]); render(false);
      edgeWidth: 2,
      closed: true,
      filled: false,
      fillColor: "black"
    }, objsettings);
  return new LineShape(points, objsettings, polygon[0]);
}

function makeCircleSpline(circle, objSettings = {}) { // circle: [[centerX, centerY], radius]
  return makePolygonalSpline([circle[0], circle[1], 16, 0], Object.assign(Object.assign({}, objSettings), {smooth: true})); // objects.push(makeCircleSpline([[200, 200], 50])); render();
}