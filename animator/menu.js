const menu = document.querySelector("#menu");
const pb = menu.getContext("2d");

var selected;

var settings = {
  Paint: {
    display: true,
    smooth: true,
    tension: 0.35,
    edgeWidth: 2,
    edgeColor: "black",
    edgeWidth: 2,
    closed: false,
    filled: false,
    fillColor: "black"
  },
  Shape: {
    Polygon: {
      sides: 4,
      Manual__Input: {
        radius: 50,
        x: 0,
        y: 0,
        angle: 0
      }
    },
    Circle: {
      Manual__Input: {
        radius: 50,
        x: 0,
        y: 0,
      }
    },
    Input__Custom__Points: {
      Manual__Input: {
        center: {
          auto: true,
          x: 0,
          y: 0
        },
        closed: false,
        index: 0
      },
      Mouse__Input: {
        adding__points: false,
        closed: false,
        snap__settings: {
          snap_to__points: false,
          snap_to__distance: false,
          from__distance: 10,
          snap_to__angle: false,
          snap_angle__symmetry: 8,
          from__angle: 3,
          minimum__distance: 30
        }
      }
    }
  },
  Selection: {
    type: "box",
    Actions: {
      Change__Settings: {
        display: true,
        smooth: true,
        tension: 0.35,
        edgeWidth: 2,
        edgeColor: "black",
        edgeWidth: 2,
        closed: false,
        filled: false,
        fillColor: "black"
      },
      Manipulate: {
        addPoint: {x: 0, y: 0},
        insertPoint: {index: 0, x: 0, y: 0},
        deletePoint: {index: 0},
        splicePoints: {index: 0, del: 0, points: [[0, 0]]},
        setCenter: {newCenter: [0, 0]},
        resetCenter: {},
        setPosition: {x: 0, y: 0},
        translate: {x: 0, y: 0},
        translateLocal: {x: 0, y: 0},
        rotate: {angle: 0},
        stretch: {xFactor: 1, yFactor: 1},
        stretchX: {xFactor: 1},
        stretchY: {yFactor: 1},
        scale: {factor: 1}
      }
    }
  },
  Edit__Canvas: {
    bg_color: "white",
    width: 400,
    height: 400,
  }, 
};

let a = settings.Selection.Actions.Manipulate;
a.addPoint.run = function() {selected.addPoint([
  a.addPoint.x, 
  a.addPoint.y]);};
a.insertPoint.run = function() {selected.splicePoints(
  a.insertPoint.index, 0, 
  [[a.insertPoint.x, a.insertPoint.y]]);};
a.deletePoint.run = function() {selected.deletePoint(
  a.deletePoint.index);};
a.splicePoints.run = function() {selected.splicePoints(
  a.splicePoints.index,
  a.splicePoints.del,
  a.splicePoints.points);};
a.setCenter.run = function() {selected.setCenter(
  a.setCenter.newCenter);};
a.resetCenter.run = function() {selected.resetCenter();};
a.setPosition.run = function() {selected.setPosition(
  a.setPosition.x,
  a.setPosition.y);};
a.translate.run = function() {selected.translate(
  a.translate.x,
  a.translate.y);};
a.translateLocal.run = function() {selected.translateLocal(
  a.translateLocal.x,
  a.translateLocal.y);};
a.rotate.run = function() {selected.rotate(
  a.rotate.angle);};
a.stretch.run = function() {selected.stretch(
  a.stretch.xFactor,
  a.stretch.yFactor);};
a.stretchX.run = function() {selected.stretchX(
  a.stretchX.xFactor);};
a.stretchY.run = function() {selected.stretchY(
  a.stretchY.yFactor);};
a.scale.run = function() {selected.scale(
  a.scale.factor);};

console.log(settings);

var path = [0];

function followNestedPath(s, layers, thisPath) {
  for (let i = 0; i < layers; i++) {
    s = s[Object.keys(s)[thisPath[i]]];
  }
  return s;
}

function getNestedLength(s, layers, thisPath) {
  return Object.keys(followNestedPath(s, layers, thisPath)).length;
}

function drawMenu() {
  pb.clearRect(0, 0, menu.width, menu.height);
  function drawObject(obj, layer) {
    let queue = [];
    Object.entries(obj).forEach((e, i, a) => {
      const key = e[0];
      const value = e[1];
      pb.beginPath();
      pb.rect(100 * layer, i * 400 / a.length, 100, 400 / a.length);
      pb.fillStyle = i === path[layer]  &&  typeof value === "object"? "lightgray" : "gray";
      pb.fill();
      pb.strokeStyle = "black";
      pb.lineWidth = 2;
      pb.stroke();
      pb.fillStyle = "black";
      pb.font = "20px arial";
      let keyText = key.toString().split("__").map(f => f.split("_").join(" "));
      if (typeof value !== "function") {
        keyText.forEach((f, j, b) => {
          pb.fillText(f, 100 * layer + 50 - Math.min(pb.measureText(f).width, 96) / 2, (i + 0.5) * 400 / a.length + 14 + 10 * (j - 0.7) * b.length, 96);
        });
      }
      pb.closePath();
      if (typeof value === "object") {
        if (i === path[layer]) {
          queue.push(value);
        }
      } else if (layer >= path.length) {
        pb.beginPath();
        pb.rect(100 + 100 * layer, i * 400 / a.length, 100, 400 / a.length);
        pb.fillStyle = "gray";
        pb.fill();
        pb.strokeStyle = "black";
        pb.lineWidth = 2;
        pb.stroke();
        pb.fillStyle = "black";
        pb.font = "20px arial";
        const text = typeof value === "function"? key.toString() : value.toString();
        pb.fillText(text, 100 * layer + 150 - Math.min(pb.measureText(text).width, 96) / 2, (i + 0.5) * 400 / a.length + 7, 96);
        pb.closePath();
      }
    });
    if (layer < path.length) {
      queue.forEach((e, i, a) => {drawObject(e, layer + 1);});
    }
  };
  drawObject(settings, 0);
}
drawMenu();

let savePath = [];
let saveColumnNum;
let saveRowNum;

["mousedown", "touchdown"].forEach(qwerty => menu.addEventListener(qwerty, (e) => {
  const columnNum = Math.floor(e.offsetX / 100);
  const rowNum = path[columnNum]; // change path[columnNum] to modify path itself, since rowNum just gets reassigned when changed
  const columnObj = followNestedPath(settings, columnNum, path);
  const key = Object.keys(columnObj)[Math.floor(Object.keys(columnObj).length * e.offsetY / 400)];
  const val = columnObj[key]; // same as rowNum
  switch (typeof val) {
    case "object": 
      const rowClicked = Math.floor(getNestedLength(settings, columnNum, path) * e.offsetY / 400);
      if (rowNum !== rowClicked) {
        if (savePath.length !== 0  &&  columnNum === saveColumnNum  &&  rowNum === saveRowNum) {
          path = [...savePath];
          savePath = [];
        } else {
          path[columnNum] = rowClicked;
          path.length = columnNum + 1;
        }
      } else {
        savePath = [...path];
        saveColumnNum = columnNum;
        saveRowNum = rowNum;
        path.length = columnNum;
      }
      break;
    case "function": 
      (val)();
      break;
    case "boolean": 
      columnObj[key] = !val;
      break;
    case "number":
      let testnum = Number(prompt("Enter a number"));
      if (testnum.toString() !== "NaN") {columnObj[key] = testnum;}
      break;
    case "string" :
      columnObj[key] = prompt("Enter the new setting");
      break;
  }
  drawMenu();
}));

/*

menu.addEventListener("mousemove", (e) => {
  
  
});

*/