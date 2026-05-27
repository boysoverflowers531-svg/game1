const holes = document.querySelectorAll(".hole");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const highScoreText = document.getElementById("highScore");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const gameTime = 30;
const characters = [
  { name: "キングモグラ", points: 10, image: "king.png", weight: 1 },
  { name: "イケメンモグラ", points: 5, image: "ikemen.png", weight: 3 },
  { name: "きゃぴモグラ", points: 3, image: "kyapi.png", weight: 5 },
  { name: "おじモグラ", points: 1, image: "oji.png", weight: 9 }
];

let score = 0;
let timeLeft = gameTime;
let currentMole = -1;
let currentCharacter = null;
let gamePlaying = false;
let timerId = null;
let moleId = null;

// 最高スコアはブラウザに保存します。使えない時でもゲームは動くようにします。
function loadHighScore() {
  try {
    return Number(localStorage.getItem("whackMoleHighScore")) || 0;
  } catch (error) {
    return 0;
  }
}

function saveHighScore(newHighScore) {
  try {
    localStorage.setItem("whackMoleHighScore", newHighScore);
  } catch (error) {
    // 保存できないブラウザでも、今回の画面では最高スコアを表示します
  }
}

let highScore = loadHighScore();
highScoreText.textContent = highScore;

function startGame() {
  score = 0;
  timeLeft = gameTime;
  gamePlaying = true;
  currentMole = -1;
  currentCharacter = null;

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
    saveHighScore(highScore);
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
  currentCharacter = pickCharacter();
  currentMole = randomIndex;
  holes[currentMole].classList.add("mole");
  holes[currentMole].innerHTML = `<img class="mole-image" src="${currentCharacter.image}" alt="${currentCharacter.name}">`;
}

function clearMole() {
  holes.forEach((hole) => {
    hole.classList.remove("mole");
    hole.innerHTML = "";
  });
}

function hitMole(index) {
  if (!gamePlaying || index !== currentMole || currentCharacter === null) {
    return;
  }

  score += currentCharacter.points;
  scoreText.textContent = score;
  message.textContent = `${currentCharacter.name} +${currentCharacter.points}点！`;
  holes[index].classList.add("hit");

  // 同じモグラを何回も押せないようにします
  currentMole = -1;
  currentCharacter = null;
  clearMole();

  setTimeout(() => {
    holes[index].classList.remove("hit");
  }, 160);

  showRandomMole();
}

function pickCharacter() {
  // weightが大きいキャラほど出やすくなります
  const totalWeight = characters.reduce((total, character) => total + character.weight, 0);
  let randomNumber = Math.random() * totalWeight;

  for (const character of characters) {
    randomNumber -= character.weight;

    if (randomNumber <= 0) {
      return character;
    }
  }

  return characters[characters.length - 1];
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
