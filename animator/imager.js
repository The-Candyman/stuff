const display = document.querySelector("#display");
const importer = document.querySelector("#import");
const exporter = document.querySelector("#export");
var imageCounter = 0;
function downloadImage() {
  let dataURL = display.toDataURL("image/png");
  let abcdefgun = document.createElement('a');
  abcdefgun.href = dataURL;
  abcdefgun.download = 'animator-nameofanimation-randomstring-single-' + imageCounter + '.png';
  abcdefgun.click();
  imageCounter++;
}
exporter.addEventListener("buttondown", downloadImage);