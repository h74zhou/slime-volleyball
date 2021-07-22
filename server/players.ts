type playerType = {
  id: string,
  name: string,
  room: string;
};

const players : Array<playerType> = [];

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

const getPlayer = (id : string) => players.find((player) => player.id === id);

const getPlayersInRoom = (room : string) => players.filter((player) => player.room === room);

module.exports = { addPlayer, removePlayer, getPlayer, getPlayersInRoom};