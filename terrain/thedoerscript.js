const canvas = document.querySelector('#canvas');
const pb = canvas.getContext('2d');

const size = 10;
const heightMap = [];
for (let i = 0; i < size; i++) {
  heightMap.push([]);
  for (let j = 0; j < size; j++) {
    heightMap[i].push(0);
  }
}

const camera = {
  x: 0,
  y: 0,
  z: 0,
  
};

function render() {
  //pb.lineWidth = 2;
  pb.fillStyle = "red";
  pb.beginPath();
  pb.arc(10, 10, 5, 0, 6.28);
  pb.fill();
  pb.closePath();
}
render();