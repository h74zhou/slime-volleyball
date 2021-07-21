const players = [];

const addPlayer = ({ id, name, room }) => {
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

const removePlayer = (id) => {
  const index = players.findIndex((player) => player.id === id);

  if (index !== - 1) {
    return players.splice(index, 1)[0];
  }
}

const getPlayer = (id) => players.find((player) => player.id === id);

const getPlayersInRoom = (room) => players.filter((player) => player.room === room);

module.exports = { addPlayer, removePlayer, getPlayer, getPlayersInRoom};