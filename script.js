/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const score = document.getElementById("score");
const title = document.getElementById("title");
const button = document.getElementById("play");
const chart = document.getElementById("myChart");

let canvasChart;

if (localStorage.getItem("numbers") == null) {
  localStorage.setItem("numbers", "[]");
  localStorage.setItem("scores", "[]");
}

let numbers = Array.from(JSON.parse(localStorage.getItem("numbers")));
let scores = Array.from(JSON.parse(localStorage.getItem("scores")));

function setCanvas() {
  canvas.setAttribute("height", innerHeight + "px");
  canvas.setAttribute("width", innerWidth + "px");
}

setCanvas();
window.addEventListener("resize", setCanvas);

const ctx = canvas.getContext("2d");
const snake = new Image();
snake.src = "snake.svg";
const apple = new Image();
apple.src = "apple.svg";
let appleX;
let appleY;

let turned = false;
let axis = "";

let head = {
  dx: 0,
  dy: 0,
};

let snakesPositions = [
  { x: canvas.width / 2, y: canvas.height / 2 },
  { x: canvas.width / 2 - 80, y: canvas.height / 2 },
];

function play() {
  chart.style.display = "none";
  score.innerText = "0";
  title.style.display = "none";
  button.style.display = "none";

  title.innerText = "Game Over";
  button.innerText = "Play Again";

  axis = "";

  head = {
    dx: 0,
    dy: -80,
  };

  snakesPositions = [
    { x: canvas.width / 2, y: canvas.height / 2 },
    { x: canvas.width / 2 - 80, y: canvas.height / 2 },
  ];
  update();
}

button.onclick = play;

function changePos() {
  for (let index = snakesPositions.length - 1; index >= 1; index--) {
    snakesPositions[index].x = snakesPositions[index - 1].x;
    snakesPositions[index].y = snakesPositions[index - 1].y;
  }
  snakesPositions[0].x += head.dx;
  snakesPositions[0].y += head.dy;
}

function appleXY() {
  appleX = Math.round(Math.random() * canvas.width - 100);
  appleY = Math.round(Math.random() * canvas.height - 100);
  if (
    appleX <= 200 ||
    appleY <= 200 ||
    appleX >= canvas.width - 200 ||
    appleY >= canvas.height - 200
  ) {
    appleXY();
  }
}

appleXY();

function spawnApple() {
  ctx.drawImage(apple, appleX, appleY, 70, 70);
}

function out() {
  if (
    snakesPositions[0].x <= 0 ||
    snakesPositions[0].y <= 0 ||
    snakesPositions[0].x >= canvas.width ||
    snakesPositions[0].y >= canvas.height
  ) {
    return true;
  }
  for (const part of snakesPositions.slice(1)) {
    if (
      Math.abs(snakesPositions[0].x - part.x) <= 30 &&
      Math.abs(snakesPositions[0].y - part.y) <= 30
    ) {
      return true;
    }
  }
  return false;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  changePos();

  for (const part of snakesPositions) {
    ctx.drawImage(snake, part.x, part.y, 80, 80);
  }

  spawnApple();
  if (
    Math.abs(snakesPositions[0].x - appleX + 40) <= 80 &&
    Math.abs(snakesPositions[0].y - appleY + 40) <= 80
  ) {
    score.innerText = +score.innerText + 1;
    appleXY();
    snakesPositions.push({
      x: snakesPositions[snakesPositions.length - 1].x,
      y: snakesPositions[snakesPositions.length - 1].y,
    });
  }

  if (out()) {
    numbers.push(1);
    scores.push(score.innerText);

    localStorage.setItem("numbers", JSON.stringify(numbers));
    localStorage.setItem("scores", JSON.stringify(scores));

    numbers = Array.from(JSON.parse(localStorage.getItem("numbers")));
    scores = Array.from(JSON.parse(localStorage.getItem("scores")));

    canvasChart.destroy();

    plotChart();

    setTimeout(() => {
      chart.style.display = "block";
    }, 100);
    title.style.display = "block";
    button.style.display = "block";

    return;
  }
  setTimeout(requestAnimationFrame, 215, update);
}

function keyup(e) {
  if (e.key == "ArrowUp" && axis !== "Y") {
    axis = "Y";
    head.dy = -80;
    head.dx = 0;
  } else if (e.key == "ArrowDown" && axis !== "Y") {
    axis = "Y";
    head.dy = 80;
    head.dx = 0;
  } else if (e.key == "ArrowRight" && axis !== "X") {
    axis = "X";
    head.dy = 0;
    head.dx = 80;
  } else if (e.key == "ArrowLeft" && axis !== "X") {
    axis = "X";
    head.dy = 0;
    head.dx = -80;
  }
}

document.addEventListener("keyup", keyup);

function plotChart() {
  canvasChart = new Chart(chart, {
    type: "line",
    data: {
      labels: Array.from(JSON.parse(localStorage.getItem("numbers"))).map(
        (e, i) => i + 1
      ),
      datasets: [
        {
          label: "Score",
          data: Array.from(JSON.parse(localStorage.getItem("scores"))).map(
            (e) => e
          ),
          borderWidth: 1,
          pointRadius: 6,
          borderWidth: 5,
          borderColor: "#1e90ff",
          pointBackgroundColor: "red",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

plotChart();
