import trumpImage from "./trump1.png";
import bgImage from "./bg.jpg";
const SKETCH_ID = "sketch";

document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "trumpified_chart.png";
  link.href = document.querySelector("#sketch canvas").toDataURL();
  link.click();
  link.remove();
});

const s = p => {
  const { width, height } = document
    .getElementById(SKETCH_ID)
    .getBoundingClientRect();
  const isLandscape = height <= width;
  const scaleFactor = isLandscape ? height / 1000 : width / 1000;
  let trump;
  let background;
  let chart;
  let trumpYShift = 0;

  const chartPosition = {
    x: 254 * scaleFactor,
    y: 53 * scaleFactor,
    width: 742 * scaleFactor,
    height: 452 * scaleFactor
  };

  const uploadButton = document.getElementById("upload");
  uploadButton.addEventListener("change", function() {
    if (file.type === "image") {
      chart = p.loadImage(URL.createObjectURL(uploadButton.files[0]));
      uploadButton.value = "";
    } else {
      chart = null;
    }
    uploadButton.value = null;
  });

  p.preload = function() {
    trump = p.loadImage(trumpImage);
    background = p.loadImage(bgImage);
  };

  p.setup = function() {
    background.resize(0, height);

    const widthToUse = Math.min(width, background.width);
    p.createCanvas(widthToUse, height);

    trump.resize(isLandscape ? 0 : width, isLandscape ? height : 0);
    trumpYShift = trump.height < height ? height - trump.height : 0;
    p.noStroke();

    p.background(200);
  };

  p.draw = function() {
    p.image(background, 0, 0);

    p.fill("rgb(50, 50, 50)");
    p.rect(
      chartPosition.x,
      chartPosition.y + trumpYShift,
      chartPosition.width,
      chartPosition.height
    );

    if (chart) {
      const widthFactor = chartPosition.width / chart.width;
      const heightFactor = chartPosition.height / chart.height;
      const factor = Math.min(widthFactor, heightFactor);

      const newWidth = chart.width * factor;
      const newHeight = chart.height * factor;

      const moveX =
        newWidth < chartPosition.width
          ? (chartPosition.width - newWidth) / 2
          : 0;
      const moveY =
        newHeight < chartPosition.height
          ? (chartPosition.height - newHeight) / 2
          : 0;

      p.image(
        chart,
        chartPosition.x + moveX,
        chartPosition.y + moveY + trumpYShift,
        newWidth,
        newHeight
      );
    }

    p.image(trump, 0, 0 + trumpYShift);
  };

  function handleFile(file) {
    if (file.type === "image") {
      chart = p.createImg(file.data, "");
      chart.hide();
    } else {
      chart = null;
    }
  }
};

new p5(s, SKETCH_ID);
