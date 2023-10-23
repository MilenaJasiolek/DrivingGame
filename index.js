// deklaracja zmiennych
const bubu = document.querySelector(".bubu");
const bubuGif = document.querySelector(".bubu .gif");
const dudu = document.querySelector(".dudu");
const obstacles = document.querySelectorAll(".obstacle");
let movableObstacle1 = document.querySelector(".movableObstacle1");
let movableObstacle2 = document.querySelector(".movableObstacle2");
let moveEnabled = true;
let startGameTime = undefined;
let endGameTime = undefined;
let gameTime = 0;
const gameTimeDiv = document.querySelector(".score");
const tableOfScores = [];
const btn = document.querySelector("button");
const scoresContainer = document.querySelector(".scores-container");
const tableOfScoresElement = document.querySelector("ul");
var seconds = 0;
var tens = 0;
var Interval;
const appendTens = document.getElementById("tens");
const appendSeconds = document.getElementById("seconds");

// funkcja do odliczania czasu gry
function startTimer() {
  tens++;

  if (tens <= 9) {
    appendTens.innerHTML = "0" + tens;
  }

  if (tens > 9) {
    appendTens.innerHTML = tens;
  }

  if (tens > 99) {
    console.log("seconds");
    seconds++;
    appendSeconds.innerHTML = "0" + seconds;
    tens = 0;
    appendTens.innerHTML = "0" + 0;
  }

  if (seconds > 9) {
    appendSeconds.innerHTML = seconds;
  }
}
// Funkcja zmieniająca gif na "boom.gif" w przypadku kolizji z przeszkodą
const changeGifToBoom = () => {
  bubuGif.src = "src/boom.gif";
};

// Funkcja do wyliczenia czasu gry i aktualizacji wyników na ekranie
const displayGameTimeOnScreen = (shouldScoreboardBeUpdated) => {
  if (
    startGameTime &&
    (detectBubuCollisionWithDudu() || detectBubuCollisionWithObstacles())
  ) {
    const gameTime = endGameTime - startGameTime;
    if (shouldScoreboardBeUpdated) {
      tableOfScores.push(gameTime);
    }
  }
};

// Funkcja aktualizująca tabelę wyników na ekranie
const updateScoreboard = (showTable) => {
  if (showTable) {
    tableOfScoresElement.innerHTML = "";
    tableOfScores.forEach((time, index) => {
      const scoreDiv = document.createElement("div");
      const highlightedSpan = document.createElement("span");
      const normalSpan = document.createElement("span");
      scoreDiv.classList.add("score-entry");
      highlightedSpan.classList.add("highlight-text");
      normalSpan.textContent = `${time / 1000}s`;
      highlightedSpan.textContent = `Próba ${index + 1}: `;
      scoreDiv.appendChild(highlightedSpan);
      scoreDiv.appendChild(normalSpan);
      tableOfScoresElement.appendChild(scoreDiv);
      tableOfScoresElement.style.display = "block";
      scoresContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    });
  }

  scoresContainer.style.display = "flex";
};

// Funkcja do detekcji kolizji z przeszkodami
const detectBubuCollisionWithObstacles = () => {
  const bubuRect = bubu.getBoundingClientRect();

  for (const obstacle of obstacles) {
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
      bubuRect.left < obstacleRect.right &&
      bubuRect.right > obstacleRect.left &&
      bubuRect.top < obstacleRect.bottom &&
      bubuRect.bottom > obstacleRect.top
    ) {
      btn.style.display = "block";
      btn.style.top = "70%";
      scoresContainer.style.display = "none";
      return true;
    }
  }

  return false;
};

// Funkcja do detekcji kolizji z Dudu
const detectBubuCollisionWithDudu = () => {
  const bubuRect = bubu.getBoundingClientRect();
  const duduRect = dudu.getBoundingClientRect();
  if (
    bubuRect.left < duduRect.right &&
    bubuRect.right > duduRect.left &&
    bubuRect.top < duduRect.bottom &&
    bubuRect.bottom > duduRect.top
  ) {
    return true;
  }
  return false;
};

// Funkcja do wycentrowania przycisku po dotarciu do Dudu
const changeButtonAfterCollisionWithDudu = () => {
  if (detectBubuCollisionWithDudu()) {
    btn.style.display = "block";
    btn.style.top = "70%";
  }
};

// Funkcja do zmiany gifa po dotarciu do Dudu
const changeGifAfterColisionWithDudu = () => {
  const duduGif = document.querySelector(".dudu .gif");
  duduGif.src = "src/finish.gif";
  const bubuGif = document.querySelector(".bubu .gif");
  bubuGif.style.display = "none";
  moveEnabled = false;
};

// Funkcja do poruszania Bubu
const moveBubu = (direction) => {
  if (!startGameTime) {
    Interval = setInterval(startTimer, 10);
    startGameTime = new Date();
  }
  const bubuRect = bubu.getBoundingClientRect();
  if (direction === "ArrowRight") {
    // const currentPosition = bubu.getBoundingClientRect();
    bubu.style.left = `${bubuRect.left + 50}px`;
    bubu.style.transform = "rotateY(180deg)";
  } else if (direction === "ArrowLeft") {
    bubu.style.left = `${bubuRect.left - 50}px`;
    bubu.style.transform = "rotateY(0deg)";
    //TODO: zmień pozycję bubu o 5px w lewo
    //Zmień style bubu tak, aby była odwrócony w lewo
  } else if (direction === "ArrowUp") {
    bubu.style.top = `${bubuRect.y - 50}px`;
    bubu.style.transform = "rotate(90deg)";
    //TODO: zmień pozycję bubu o 5px w górę
    //Zmień style bubu tak, aby był odwrócony o 90 stopni do góry
  } else if (direction === "ArrowDown") {
    bubu.style.top = `${bubuRect.y + 50}px`;
    bubu.style.transform = "rotate(-90deg)";
    //TODO: zmień pozycję bubu o 5px w dół
    //Zmień style bubu tak, aby był odwrócony o 90 stopni w dół
  }

  if (detectBubuCollisionWithObstacles()) {
    changeGifToBoom();
    moveEnabled = false;
    endGameTime = new Date();
    displayGameTimeOnScreen(false);
    updateScoreboard(false);
    clearInterval(Interval);
  }
  if (detectBubuCollisionWithDudu()) {
    changeButtonAfterCollisionWithDudu();
    changeGifAfterColisionWithDudu();
    endGameTime = new Date();
    displayGameTimeOnScreen(true);
    updateScoreboard(true);
    clearInterval(Interval);
  }
};
// Wywołanie funkcji moveBubu w zależności od wciśniętego klawisza
document.addEventListener("keydown", (event) => {
  if (moveEnabled) {
    moveBubu(event.key);
  }
});

// Funkcja resetująca grę
const resetGame = () => {
  // Reset pozycji, gifów, czasu i wyników
  const bubuGif = document.querySelector(".bubu .gif");
  bubuGif.src = "src/bubu_driving.gif";
  bubu.style.left = `${140}px`;
  bubu.style.top = `${40}px`;
  bubu.style.transform = "rotateY(180deg)";
  bubuGif.style.display = "block";
  const duduGif = document.querySelector(".dudu .gif");
  duduGif.src = "src/dudu_sad.gif";
  btn.style.display = "none";
  moveEnabled = true;
  gameTimeDiv.style.display = "none";
  startGameTime = undefined;
  endGameTime = undefined;
  gameTime = 0;
  scoresContainer.style.display = "none";
  tableOfScoresElement.style.display = "none";
  clearInterval(Interval);
  seconds = 0;
  tens = 0;
  appendSeconds.innerHTML = "00";
  appendTens.innerHTML = "00";
};

// Obsługa przycisku "Start" po wciśnięciu klawisza "Enter"
const isEnterKey = (event) => {
  return event.key === "Enter";
};
document.addEventListener("keydown", (event) => {
  if (isEnterKey(event)) {
    resetGame();
  }
});
