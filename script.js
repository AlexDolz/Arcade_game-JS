const trafficAudio = document.querySelector('#traffic_audio');
const bonusAudio = document.querySelector('#bonus_audio');
const gameOverAudio = document.querySelector('#game_over_audio');
const crashAudio = document.querySelector('#crash_audio');
const startAudio = document.querySelector('#start_audio');
const levelCompleteAudio = document.querySelector('#level_complete_audio');
const startGame = document.querySelector('.start');
const soundOn = document.querySelector('.sound_on');
const soundOff = document.querySelector('.sound_off');
const levelCounterDiv = document.querySelector('.level_counter');

let levelCounter = 1;
soundOff.style.display = 'none';

function stopAudio() {
  trafficAudio.muted = true;
  bonusAudio.muted = true;
  gameOverAudio.muted = true;
  crashAudio.muted = true;
  startAudio.muted = true;
  levelCompleteAudio.muted = true;
}
function playAudio() {
  trafficAudio.muted = false;
  bonusAudio.muted = false;
  gameOverAudio.muted = false;
  crashAudio.muted = false;
  startAudio.muted = false;
  levelCompleteAudio.muted = false;
}

soundOn.addEventListener('click', () => {
  soundOn.style.display = 'none';
  soundOff.style.display = 'block';
  stopAudio();
});
soundOff.addEventListener('click', () => {
  soundOff.style.display = 'none';
  soundOn.style.display = 'block';
  playAudio();
});

startGame.addEventListener('click', () => {
  startGame.style.display = 'none';
  startAudio.play();
  trafficAudio.play();
  trafficAudio.loop = true;
  runTimer();
});

let time = 45;
function runTimer() {
  const needToDecrease =
    document.getElementsByClassName('level_complete').length === 0 &&
    document.getElementsByClassName('game_over').length === 0;
  if (needToDecrease) {
    time = time - 0.1;
  }
  const seconds = Math.floor(time);
  const miliseconds = Math.floor((time % 1) * 10);
  document.getElementById('timer').innerHTML = `00:${
    seconds < 10 ? `0${seconds}` : seconds
  }:${miliseconds < 10 ? `0${miliseconds}` : miliseconds}`;
  if (seconds === 0 && miliseconds === 0) {
    gameOverAudio.play();
    gameOverTime();
    life = 0;
    drawLife();
    time = 45;
  }
  setTimeout(runTimer, 100);
}

let vehiclesCollection = [];
const vehiclesColors = [
  'red',
  'darkred',
  'indigo',
  'darkmagenta',
  'tomato',
  'green',
  'darkgreen',
  'lightgreen',
  'orange',
  'pink',
  'blue',
  'navy',
];

function addVehicle(x, y, speed, width, className, direction) {
  const height = className === 'car' ? 20 : 10;

  if (hasCollision(x, y, width, height)) {
    return;
  }
  const maxX = document.body.clientWidth;
  const minX = -width;
  const vehicle = document.createElement('div');
  const framePerSecond = 60;
  const index = vehiclesCollection.length;
  vehiclesCollection[index] = {
    x: x,
    y: y,
    width: width,
    height: height,
  };
  function drawFrame() {
    if (Number.isFinite(vehiclesCollection[index].x)) {
      const sign = direction === 'left' ? -1 : 1;
      const newX = Math.max(
        Math.min(x + (sign * speed) / framePerSecond, maxX),
        minX
      );
      vehiclesCollection[index].x = -Infinity;
      const collision = hasCollision(newX + sign * 5, y, width, height);
      if (!collision) {
        x = newX;
        vehicle.style.left = `${x}px`;
      }
      vehiclesCollection[index].x = x;
      if (x !== maxX && x !== minX) {
        setTimeout(drawFrame, 450 / framePerSecond);
      } else {
        vehiclesCollection[index].x = -Infinity;
        document.body.removeChild(vehicle);
      }
    }
  }
  const colorIndex = Math.ceil(Math.random() * vehiclesColors.length);
  const color = vehiclesColors[colorIndex];
  vehicle.classList.add(className);
  vehicle.style.top = `${y}px`;
  vehicle.style.left = `${x}px`;
  vehicle.style.backgroundColor = color;
  document.body.appendChild(vehicle);
  setTimeout(drawFrame, 1000 / framePerSecond);
}

function hasCollision(x, y, width, height) {
  for (let i = 0; i < vehiclesCollection.length; i++) {
    const item = vehiclesCollection[i];
    const dX = Math.abs(x - item.x);
    const dY = Math.abs(y - item.y);
    const actualWidth = x > item.x ? item.width : width;
    const actualHeight = y > item.y ? item.height : height;
    if (dX < actualWidth && dY < actualHeight) {
      return true;
    }
  }
  return false;
}

function addCar(x, y, direction) {
  addVehicle(x, y, 60, 30, 'car', direction);
}

function addBike(x, y, direction) {
  addVehicle(x, y, 90, 25, 'bike', direction);
}

let life = 3;
function drawLife() {
  const lifebar = document.getElementsByClassName('lifebar')[0];
  lifebar.innerHTML = '';
  for (let i = 0; i < life; i++) {
    const life = document.createElement('img');
    life.src = `img/life.png`;
    life.classList.add('life');
    lifebar.appendChild(life);
  }
}
drawLife();

function gameOver() {
  const gameOverImg = document.createElement('img');
  gameOverImg.src = `img/game-over.png`;

  const restartBtn = document.createElement('div');
  restartBtn.classList.add('btn', 'game_over_button');
  restartBtn.innerHTML = 'Restart';
  document.getElementById('go').style.display = 'none';

  const gameOver = document.createElement('div');
  gameOver.classList.add('game_over');

  const gameOverTitle = document.createElement('div');
  gameOverTitle.classList.add('game_over_title');
  gameOverTitle.innerHTML = 'Game over';

  const gameOverResult = document.createElement('div');
  gameOverResult.classList.add('game_over_result');
  gameOverResult.innerHTML = `Your result: level ${levelCounter}`;

  gameOver.append(gameOverTitle, gameOverResult, gameOverImg, restartBtn);
  document.body.appendChild(gameOver);

  restartBtn.addEventListener('click', () => {
    document.getElementById('go').removeAttribute('disabled');
    gameOver.classList.remove('game_over');
    document.body.removeChild(gameOver);
    startAudio.play();
    life = 3;
    drawLife();
    goToLevel(2);
  });
}

function gameOverTime() {
  const gameOverTimeImg = document.createElement('img');
  gameOverTimeImg.src = `img/game-over-time.png`;

  const restartBtn = document.createElement('div');
  restartBtn.classList.add('btn', 'game_over_button');
  restartBtn.innerHTML = 'Restart';
  document.getElementById('go').style.display = 'none';

  const gameOver = document.createElement('div');
  gameOver.classList.add('game_over');

  const gameOverTitle = document.createElement('div');
  gameOverTitle.classList.add('game_over_title');
  gameOverTitle.innerHTML = 'Game over';

  const gameOverResult = document.createElement('div');
  gameOverResult.classList.add('game_over_result');
  gameOverResult.innerHTML = `Your result: level ${levelCounter}`;

  gameOver.append(gameOverTitle, gameOverResult, gameOverTimeImg, restartBtn);
  document.body.appendChild(gameOver);

  restartBtn.addEventListener('click', () => {
    document.getElementById('go').removeAttribute('disabled');
    gameOver.classList.remove('game_over');
    document.body.removeChild(gameOver);
    startAudio.play();

    life = 3;
    drawLife();
    goToLevel(2);
  });
}

function levelComplete() {
  const levelCompleteImg = document.createElement('img');
  levelCompleteImg.src = `img/win.png`;

  const levelComplete = document.createElement('div');
  levelComplete.classList.add('level_complete');

  levelCounterDiv.classList.add('level_counter');
  levelCounter++;
  levelCounterDiv.innerHTML = `Level ${levelCounter}`;

  const levelCompleteTitle = document.createElement('div');
  levelCompleteTitle.classList.add('game_over_title');
  levelCompleteTitle.innerHTML = 'Level complete';

  const button = document.createElement('div');
  button.classList.add('btn', 'game_over_button');
  button.innerHTML = 'Next level';
  button.addEventListener('click', function () {
    startAudio.play();
    life = 3;
    drawLife();
    document.body.removeChild(levelComplete);
    nextLevel();
    document.getElementById('go').removeAttribute('disabled');
  });

  levelComplete.append(levelCompleteTitle, levelCompleteImg, button);
  document.getElementById('go').style.display = 'none';

  document.body.appendChild(levelComplete);
}

let bonusX = 0;
let bonusY = 0;
function addBonus(x, y) {
  bonusX = x;
  bonusY = y;
  const bonus = document.createElement('img');
  bonus.src = `img/bonus.png`;
  bonus.classList.add('bonus');
  bonus.style.top = `${y}px`;
  bonus.style.left = `${x}px`;
  document.body.appendChild(bonus);
}

function addPedestrian(x, y) {
  let startX = x;
  let startY = y;
  const button = document.getElementById('go');
  const pedestrian = document.createElement('div');
  pedestrian.classList.add('pedestrian');
  pedestrian.style.top = `${y}px`;
  pedestrian.style.left = `${x}px`;
  document.body.appendChild(pedestrian);
  const framePerSecond = 60;
  const minY = 25 - 5;
  const speed = 50;

  function bonusCheck() {
    const dX = bonusX - x;
    const dY = bonusY - y;
    const hasXCollision = dX >= -10 && dX <= 16;
    const hasYCollision = dY >= -10 && dY <= 16;
    if (hasXCollision && hasYCollision) {
      bonusAudio.play();
      time = time + 15;
      bonusX = -Infinity;
      bonusY = -Infinity;
      const bonuses = [...document.getElementsByClassName('bonus')];
      bonuses.forEach(bonus => {
        bonus.parentNode.removeChild(bonus);
      });
    }
  }

  function drawFrameY() {
    if (life !== 0) {
      const newY = y - speed / framePerSecond;
      const collision = hasCollision(x, newY, 10, 10);
      if (collision) {
        crashAudio.play();
        life--;
        drawLife();
        if (life === 0) {
          gameOverAudio.play();
          gameOver();
        }
        button.removeAttribute('disabled');
        pedestrian.style.top = `${startY}px`;
        pedestrian.style.left = `${startX}px`;
        y = startY;
        x = startX;

        return;
      }
      y = Math.max(newY, minY);
      pedestrian.style.top = `${y}px`;
      if (newY > minY) {
        setTimeout(drawFrameY, 600 / framePerSecond);
      }
      if (y === minY) {
        levelComplete();
        levelCompleteAudio.play();
      }
      bonusCheck();
    }
  }
  let direction = 0; // -1 for moving left, 1 for moving right, 0 for staying at the same spot
  const maxX = document.body.clientWidth - 10;
  const minX = 0;
  function drawFrameX() {
    if (life !== 0) {
      const dX = (speed / framePerSecond) * direction;
      const newX = x + dX;
      x = Math.min(Math.max(minX, newX), maxX);
      pedestrian.style.left = `${x}px`;
    }
    setTimeout(drawFrameX, 1000 / framePerSecond);
    bonusCheck();
  }
  drawFrameX();
  function go() {
    if (!button.getAttribute('disabled')) {
      button.setAttribute('disabled', true);
      drawFrameY();
    }
  }
  document.body.addEventListener('keydown', function (evt) {
    if (life !== 0) {
      if (evt.key === 'ArrowLeft') {
        direction = -1;
      }
      if (evt.key === 'ArrowRight') {
        direction = 1;
      }
      if (evt.key === ' ') {
        go();
        document.getElementById('go').style.display = 'none';
      }
    }
  });
  document.body.addEventListener('keyup', function (evt) {
    direction = 0;
  });
  button.addEventListener('click', () => {
    go();
    document.getElementById('go').style.display = 'none';
  });
  return {
    updatePedestrianPosition: function (updatedX, updatedY) {
      startX = updatedX;
      startY = updatedY;
      pedestrian.style.top = `${updatedY}px`;
      pedestrian.style.left = `${updatedX}px`;
      x = updatedX;
      y = updatedY;
    },
  };
}

let rowsCount = 2;
function createVehicles() {
  const carWidth = 30;
  const bikeWidth = 25;
  const carHeight = 20;
  const bikeHeight = 10;
  for (let i = 0; i < rowsCount; i++) {
    const rand = Math.random();
    const width = rand < 0.5 ? carWidth : bikeWidth;
    const height = rand < 0.5 ? carHeight : bikeHeight;
    const fn = rand < 0.5 ? addCar : addBike;

    const x = i < rowsCount / 2 ? document.body.clientWidth : -width;
    const y = i * 50 + 50 + 25 - height / 2;
    fn(x, y, i < rowsCount / 2 ? 'left' : 'right');
  }
  setTimeout(createVehicles, 1500);
}
createVehicles();

const pedestrianController = addPedestrian(
  document.body.clientWidth / 2 - 5,
  275 - 5
);

function nextLevel() {
  goToLevel(rowsCount / 2 + 1);
}

function goToLevel(n) {
  rowsCount = n * 2;

  const cars = [...document.getElementsByClassName('car')];
  const bikes = [...document.getElementsByClassName('bike')];
  const bonuses = [...document.getElementsByClassName('bonus')];
  cars.forEach(car => {
    car.parentNode.removeChild(car);
  });
  bikes.forEach(bike => {
    bike.parentNode.removeChild(bike);
  });
  bonuses.forEach(bonus => {
    bonus.parentNode.removeChild(bonus);
  });
  vehiclesCollection = vehiclesCollection.map(function (item) {
    item.x = -Infinity;
    return item;
  });

  const randomRow = Math.floor(Math.random() * rowsCount + 1);
  const randomX = Math.random() * (document.body.clientWidth - 200) + 100;
  const randomY = 75 + 50 * randomRow - 8;
  addBonus(randomX, randomY);

  pedestrianController.updatePedestrianPosition(
    document.body.clientWidth / 2 - 5,
    rowsCount * 50 + 75 - 5
  );
}
