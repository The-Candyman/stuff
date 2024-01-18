const wrapper = document.querySelector(".wrapper");
const display = document.querySelector("#display");
const preview = document.querySelector("#preview");
const pbTop = preview.getContext("2d");
const pbBottom = display.getContext("2d");

let objects = [];

function clearAll() {
  objects = [];
}

function render() {
  //let benchmark = Date.now();
  pbTop.clearRect(0, 0, preview.width, preview.height);
  pbBottom.clearRect(0, 0, display.width, display.height);
  for (let i = 0; i < objects.length; i++) {
    objects[i].draw(false, pbBottom);
  }
  //console.log(Date.now() - benchmark);
}

function previewRender(object) {
  //let benchmark = Date.now();
  pbTop.clearRect(0, 0, preview.width, preview.height);
  object.draw(true, pbTop);
  //console.log(Date.now() - benchmark);
}

let lastPos = [];
let lastTime;

let drawing = false;

["mousemove", "touchmove"].forEach(qwerty => window.addEventListener(qwerty, (e) => {
  e.preventDefault();
  let x = e.clientX - wrapper.offsetLeft;
  let y = e.clientY - wrapper.offsetTop;
  if (x < 0  ||  x > preview.width  ||  y < 0  ||  y > preview.height) {
    if (drawing) {objects[objects.length - 1].addPoint([x, y]);}
    drawing = false;
    lastPos = [];
  } else if (drawing  &&  (Date.now() - lastTime > 20  ||  lastPos.length === 0  ||  Math.abs(x - lastPos[0]) > 2  ||  Math.abs(y - lastPos[1]) > 2)) {
    lastPos = [x, y];
    lastTime = Date.now();
    objects[objects.length - 1].addPoint([x, y]);
    // objects[objects.length - 1].draw();
  }
}));

["mousedown", "touchdown"].forEach(qwerty => wrapper.addEventListener(qwerty, (e) => {
  e.preventDefault();
  drawing = true;
  lastPos = [e.offsetX, e.offsetY];
  lastTime = Date.now();
  console.log(objects[objects.push(new LineShape([[e.offsetX, e.offsetY]], settings.Paint)) - 1]);
}));

["mouseup", "touchup"].forEach(qwerty => window.addEventListener(qwerty, () => {
  drawing = false;
  lastPos = [];
  render();
}));
