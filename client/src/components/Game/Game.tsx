import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Canvas from './Canvas';

let socket;

const Game = ({location}) => {
  const [name, setName] = useState<string | null>('');
  const [room, setRoom] = useState<string | null>('');
  const [pressUp, setPressUp] = useState<number>(0);
  const [pressRight, setPressRight] = useState<number>(0);
  const [pressLeft, setPressLeft] = useState<number>(0);
  const [release, setRelease] = useState<number>(0);

  const ENDPOINT = 'localhost:5000';

  const ARROW_UP = 'ArrowUp';
  const ARROW_LEFT = 'ArrowLeft';
  const ARROW_RIGHT = 'ArrowRight';
  const RELEASE = 'StopHorizontal';

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
      if (move === ARROW_UP) {
        setPressUp(prev => prev + 1);
      } else if (move === ARROW_LEFT) {
        setPressLeft(prev => prev + 1);
      } else if (move === ARROW_RIGHT) {
        setPressRight(prev => prev + 1);
      } else if (move === RELEASE) {
        setRelease(prev => prev + 1);
      }
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
      <Canvas 
        sendMove={sendMove} 
        upPressed={pressUp} 
        leftPressed={pressLeft} 
        rightPressed={pressRight}
        released={release}
        socket={socket}
      />
    </div> 
  )
}

export default Game;