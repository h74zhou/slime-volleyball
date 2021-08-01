export type playerType = {
  id: string,
  name: string,
  room: string;
};

export type ballMoveType = {
  x: number,
  y: number,
  dx: number,
  dy: number,
};

export type playerCollidedType = {
  x: number,
  y: number,
  dx: number,
  dy: number,
  name: string,
}

const players : Array<playerType> = [];
const MAX_VELOCITY = 10;

const addPlayer = ({ id, name, room } : playerType) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUserName = players.find((player) => player.room === room && player.name === name);

  if (existingUserName) {
    return {
      error: 'Username is already taken'
    }
  }

  const player = {id, name, room};
  players.push(player);
  return {player}
}

const removePlayer = (id : string) => {
  const index = players.findIndex((player) => player.id === id);

  if (index !== - 1) {
    return players.splice(index, 1)[0];
  }
}

const getNewVolleyBallData = (ballMove: ballMoveType, playerCollided: playerCollidedType) => {
  var ballX = ballMove.x;
  var ballY = ballMove.y;
  var ballDX = ballMove.dx;
  var ballDY = ballMove.dy;

  var xDiff = ballX - playerCollided.x;
  var yDiff = ballY - playerCollided.y;
  var absVelocity = Math.abs(ballX) + Math.abs(ballY);

  if (absVelocity > MAX_VELOCITY) {
    absVelocity = MAX_VELOCITY
  }

  if (xDiff === 0) {
    ballDY = -1 * absVelocity;
  } else if (yDiff === 0) {
    ballDX = absVelocity;
  } else {
    const angle = Math.atan2(xDiff, yDiff);
    ballDX = -1 * absVelocity * Math.cos(angle);
    ballDY = -1 * absVelocity * Math.sin(angle);
    if (xDiff < 0) {
      ballDX = ballDX * -1;
      ballDY = ballDY * -1;
    }
  }

  ballDX += playerCollided.dx / 2;
  ballDY += playerCollided.dy / 2;

  return {
    x: ballX,
    y: ballY,
    dx: ballDX,
    dy: ballDY,
  };
}

const getPlayer = (id : string) => players.find((player) => player.id === id);

const getPlayersInRoom = (room : string) => players.filter((player) => player.room === room);

module.exports = { addPlayer, removePlayer, getPlayer, getPlayersInRoom, getNewVolleyBallData};