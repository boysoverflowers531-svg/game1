const holes = document.querySelectorAll(".hole");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const highScoreText = document.getElementById("highScore");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const gameTime = 30;
let score = 0;
let timeLeft = gameTime;
let currentMole = -1;
let gamePlaying = false;
let timerId = null;
let moleId = null;

// 最高スコアはブラウザに保存します
let highScore = Number(localStorage.getItem("whackMoleHighScore")) || 0;
highScoreText.textContent = highScore;

function startGame() {
  score = 0;
  timeLeft = gameTime;
  gamePlaying = true;
  currentMole = -1;

  scoreText.textContent = score;
  timeText.textContent = timeLeft;
  message.textContent = "モグラをタップ！";
  startButton.disabled = true;
  restartButton.disabled = false;

  clearMole();
  showRandomMole();

  // 1秒ごとに残り時間を減らします
  timerId = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // モグラの場所を短い間隔で変えます
  moleId = setInterval(showRandomMole, 750);
}

function endGame() {
  gamePlaying = false;
  clearInterval(timerId);
  clearInterval(moleId);
  clearMole();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("whackMoleHighScore", highScore);
    highScoreText.textContent = highScore;
    message.textContent = `終了！ 最終スコア ${score}（新記録！）`;
  } else {
    message.textContent = `終了！ 最終スコア ${score}`;
  }

  startButton.disabled = false;
  startButton.textContent = "スタート";
  restartButton.disabled = false;
}

function showRandomMole() {
  clearMole();

  // 0から8までのランダムな数字を作ります
  const randomIndex = Math.floor(Math.random() * holes.length);
  currentMole = randomIndex;
  holes[currentMole].classList.add("mole");
}

function clearMole() {
  holes.forEach((hole) => {
    hole.classList.remove("mole");
  });
}

function hitMole(index) {
  if (!gamePlaying || index !== currentMole) {
    return;
  }

  score++;
  scoreText.textContent = score;
  holes[index].classList.add("hit");

  // 同じモグラを何回も押せないようにします
  currentMole = -1;
  clearMole();

  setTimeout(() => {
    holes[index].classList.remove("hit");
  }, 160);

  showRandomMole();
}

holes.forEach((hole, index) => {
  hole.addEventListener("click", () => {
    hitMole(index);
  });
});

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", () => {
  clearInterval(timerId);
  clearInterval(moleId);
  startGame();
});
