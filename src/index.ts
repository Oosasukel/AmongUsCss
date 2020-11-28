import io from 'socket.io-client';
const socket = io('https://amonguscss.herokuapp.com');

socket.on('setupPlayers', (playersToSetup: any) => {
  Object.keys(playersToSetup).forEach((id) => {
    const { top, left, color } = playersToSetup[id];

    addPlayer(id, top, left, color);
  });

  start();
});

socket.on('playerConnect', (id: string, color: string) => {
  addPlayer(id, 0, 0, color);
});

socket.on('playerDisconnect', (id: string) => {
  removePlayer(id);
});

socket.on('playerUpdate', (id: string, player: any) => {
  if (
    (player.walk && !players[id].walk) ||
    (player.walk && player.lookingLeft !== players[id].lookingLeft)
  ) {
    if (player.lookingLeft) {
      walkLeft(id);
    } else {
      walkRight(id);
    }
  }

  if (!player.walk && players[id].walk) {
    idleAnimation(id);
  }

  players[id] = { ...players[id], ...player };

  updatePlayerPosition(id);
});

const speed = 6;

const players: any = {};

const keysPressed = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function removePlayer(id: string) {
  delete players[id];
  const playerToDelete = document.getElementById(id);
  playerToDelete?.remove();
}

function addPlayer(
  id: string,
  topPosition: number,
  leftPosition: number,
  color: string
) {
  const player = document.createElement('div');
  player.classList.add('player');
  player.classList.add(color);
  player.id = id;

  const playerBody = document.createElement('div');
  playerBody.classList.add('body');
  player.appendChild(playerBody);

  const bodyShadow = document.createElement('div');
  bodyShadow.classList.add('shadow');
  playerBody.appendChild(bodyShadow);

  const playerShadow = document.createElement('div');
  playerShadow.classList.add('shadow');
  player.appendChild(playerShadow);

  const glasses = document.createElement('div');
  glasses.classList.add('glasses');
  player.appendChild(glasses);

  const glassesShadow = document.createElement('div');
  glassesShadow.classList.add('shadow');
  glasses.appendChild(glassesShadow);

  const glassesShadowShadow = document.createElement('div');
  glassesShadowShadow.classList.add('shadow');
  glassesShadow.appendChild(glassesShadowShadow);

  const bag = document.createElement('div');
  bag.classList.add('bag');
  player.appendChild(bag);

  const bagShadow = document.createElement('div');
  bagShadow.classList.add('shadow');
  bag.appendChild(bagShadow);

  const legLeft = document.createElement('div');
  legLeft.classList.add('legLeft');
  player.appendChild(legLeft);

  const legRight = document.createElement('div');
  legRight.classList.add('legRight');
  player.appendChild(legRight);

  document.body.appendChild(player);

  const newPlayer = {
    player,
    glasses,
    bag,
    legLeft,
    legRight,
    top: topPosition,
    left: leftPosition,
    walk: false,
    lookingLeft: false,
  };

  players[id] = newPlayer;

  updatePlayerPosition(id);
}

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 's' || key === 'ArrowDown') {
    keysPressed.down = true;
  }
  if (key === 'w' || key === 'ArrowUp') {
    keysPressed.up = true;
  }
  if (key === 'a' || key === 'ArrowLeft') {
    keysPressed.left = true;
  }
  if (key === 'd' || key === 'ArrowRight') {
    keysPressed.right = true;
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key;

  if (key === 's' || key === 'ArrowDown') {
    keysPressed.down = false;
  }
  if (key === 'w' || key === 'ArrowUp') {
    keysPressed.up = false;
  }
  if (key === 'a' || key === 'ArrowLeft') {
    keysPressed.left = false;
  }
  if (key === 'd' || key === 'ArrowRight') {
    keysPressed.right = false;
  }
});

function start() {
  gameLoop();
}

function gameLoop() {
  if (keysPressed.down) {
    socket.emit('moveY-');
    players[socket.id].top += speed;
    if (!players[socket.id].walk) {
      players[socket.id].walk = true;
      if (players[socket.id].lookingLeft) {
        walkLeft(socket.id);
      } else {
        walkRight(socket.id);
      }
    }

    updatePlayerPosition(socket.id);
  }
  if (keysPressed.up) {
    socket.emit('moveY+');
    players[socket.id].top -= speed;
    if (!players[socket.id].walk) {
      players[socket.id].walk = true;
      if (players[socket.id].lookingLeft) {
        walkLeft(socket.id);
      } else {
        walkRight(socket.id);
      }
    }

    updatePlayerPosition(socket.id);
  }
  if (keysPressed.left) {
    socket.emit('moveX-');
    players[socket.id].left -= speed;
    walkLeft(socket.id);
    players[socket.id].lookingLeft = true;

    updatePlayerPosition(socket.id);
  }
  if (keysPressed.right) {
    socket.emit('moveX+');
    players[socket.id].left += speed;
    walkRight(socket.id);
    players[socket.id].lookingLeft = false;

    updatePlayerPosition(socket.id);
  }
  if (
    !keysPressed.down &&
    !keysPressed.up &&
    !keysPressed.left &&
    !keysPressed.right
  ) {
    socket.emit('stopMove');
    if (players[socket.id].walk) {
      players[socket.id].walk = false;
    }
    idleAnimation(socket.id);
  }

  requestAnimationFrame(gameLoop);
}

function updatePlayerPosition(id: string) {
  const playerToMove = players[id];

  playerToMove.player.style.marginLeft = `${playerToMove.left}px`;
  playerToMove.player.style.marginTop = `${playerToMove.top}px`;

  playerToMove.player.style['z-index'] = playerToMove.top;
}

function idleAnimation(id: string) {
  const playerToAnimate = players[id];
  if (playerToAnimate.lookingLeft) {
    playerToAnimate.player.style.transform = 'rotateY(180deg)';
  } else {
    playerToAnimate.player.style.transform = 'rotateY(0deg)';
  }
  playerToAnimate.player.style.animationName = 'none';
  playerToAnimate.glasses.style.animationName = 'none';
  playerToAnimate.bag.style.animationName = 'none';
  playerToAnimate.legLeft.style.animationName = 'none';
  playerToAnimate.legRight.style.animationName = 'none';
}

function walkRight(id: string) {
  const playerToAnimate = players[id];

  playerToAnimate.player.style.animationName = 'playerRight';

  playerToAnimate.glasses.style.animationName = 'glasses';
  playerToAnimate.bag.style.animationName = 'bag';
  playerToAnimate.legLeft.style.animationName = 'legLeft';
  playerToAnimate.legRight.style.animationName = 'legRight';
}

function walkLeft(id: string) {
  const playerToAnimate = players[id];

  playerToAnimate.player.style.animationName = 'playerLeft';

  playerToAnimate.glasses.style.animationName = 'glasses';
  playerToAnimate.bag.style.animationName = 'bag';
  playerToAnimate.legLeft.style.animationName = 'legLeft';
  playerToAnimate.legRight.style.animationName = 'legRight';
}
