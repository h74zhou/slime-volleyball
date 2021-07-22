import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Canvas from './Canvas';

let socket;

const Game = ({location}) => {
  const [name, setName] = useState<string | null>('');
  const [room, setRoom] = useState<string | null>('');
  const [moves, setMoves] = useState<string[]>([]);
  const [pressed, setPressed] = useState<string[]>([])

  const ENDPOINT = 'localhost:5000';

  const ALLOWED_MOVES = ['ArrowUp', 'ArrowLeft', 'ArrowRight'];

  useEffect(() => {
    const {name, room} = queryString.parse(location.search);

    socket = io(ENDPOINT);

    typeof name === 'string' && setName(name);
    typeof room === 'string' && setName(room); 

    socket.emit('join', {name, room}, ({error}) => {
      if (error) {
        alert(error.message);
      }
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT, location.search])

  useEffect(() => {
    socket.on('message', ({player, move}: {player: string, move: string}) => {
      setMoves([...moves, move]);
      console.log(`Player pressed: ${move}`)
    });
  }, [])

  const sendMove = (move) => {
    if (move) {
      socket.emit('sendMove', move, () => {
        console.log("SendMove Callback called!");
      });
    };
  }

  return (
    <div style={{justifyContent: "center", textAlign: "center"}}>
      <Canvas sendMove={sendMove}/>
    </div> 
  )
}

export default Game;