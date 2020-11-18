const player = document.getElementById('player');
const glasses = player.querySelector('.glasses');
const bag = player.querySelector('.bag');
const legLeft = player.querySelector('.legLeft');
const legRight = player.querySelector('.legRight');

const state = {
  up: false,
  down: false,
  left: false,
  right: false,
  walk: false,
  lookingLeft: false,
};

const speed = 6;

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 's' || key === 'ArrowDown') {
    state.down = true;
  }
  if (key === 'w' || key === 'ArrowUp') {
    state.up = true;
  }
  if (key === 'a' || key === 'ArrowLeft') {
    state.left = true;
  }
  if (key === 'd' || key === 'ArrowRight') {
    state.right = true;
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key;

  if (key === 's' || key === 'ArrowDown') {
    state.down = false;
  }
  if (key === 'w' || key === 'ArrowUp') {
    state.up = false;
  }
  if (key === 'a' || key === 'ArrowLeft') {
    state.left = false;
  }
  if (key === 'd' || key === 'ArrowRight') {
    state.right = false;
  }
});

function start() {
  player.style.marginTop = 0;
  player.style.marginLeft = 0;
  idleAnimation();
  gameLoop();
}

function gameLoop() {
  if (state.left) {
    state.lookingLeft = true;
  } else if (state.right) {
    state.lookingLeft = false;
  }

  if (state.up || state.down || state.left || state.right) {
    state.walk = true;
    walkAnimation();
  } else {
    state.walk = false;
    idleAnimation();
  }

  if (state.down) {
    moveY(speed);
  }
  if (state.up) {
    moveY(-speed);
  }
  if (state.left) {
    moveX(-speed);
  }
  if (state.right) {
    moveX(speed);
  }

  requestAnimationFrame(gameLoop);
}

function moveX(distance) {
  const previousMargin = Number(player.style.marginLeft.replace('px', ''));
  const newMarginLeft = `${previousMargin + distance}px`;

  player.style.marginLeft = newMarginLeft;
}

function moveY(distance) {
  const previousMargin = Number(player.style.marginTop.replace('px', ''));
  const newMarginTop = `${previousMargin + distance}px`;

  player.style.marginTop = newMarginTop;
}

function idleAnimation() {
  if (state.lookingLeft) {
    player.style.transform = 'rotateY(180deg)';
  } else {
    player.style.transform = 'rotateY(0deg)';
  }
  player.style.animationName = 'none';
  glasses.style.animationName = 'none';
  bag.style.animationName = 'none';
  legLeft.style.animationName = 'none';
  legRight.style.animationName = 'none';
}

function walkAnimation() {
  if (state.lookingLeft) {
    player.style.animationName = 'playerLeft';
  } else {
    player.style.animationName = 'playerRight';
  }
  glasses.style.animationName = 'glasses';
  bag.style.animationName = 'bag';
  legLeft.style.animationName = 'legLeft';
  legRight.style.animationName = 'legRight';
}

start();
