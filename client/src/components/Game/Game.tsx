import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Canvas from './Canvas';
import {Button, CircularProgress, Typography} from '@material-ui/core';

let socket;

const Game = ({location, history}) => {
  const [name, setName] = useState<string | null>('');
  const [room, setRoom] = useState<string | null>('');
  const [firstPlayer, setFirstPlayer] = useState<string | null>(null);
  const [secondPlayer, setSecondPlayer] = useState<string | null>(null);

  // First Player
  const [pressUp, setPressUp] = useState<number>(0);
  const [pressRight, setPressRight] = useState<number>(0);
  const [pressLeft, setPressLeft] = useState<number>(0);
  const [release, setRelease] = useState<number>(0);

  // Second Player
  const [pressUpTwo, setPressUpTwo] = useState<number>(0);
  const [pressRightTwo, setPressRightTwo] = useState<number>(0);
  const [pressLeftTwo, setPressLeftTwo] = useState<number>(0);
  const [releaseTwo, setReleaseTwo] = useState<number>(0);

  const ENDPOINT = 'localhost:5000';

  const ARROW_UP = 'ArrowUp';
  const ARROW_LEFT = 'ArrowLeft';
  const ARROW_RIGHT = 'ArrowRight';
  const RELEASE = 'StopHorizontal';

  useEffect(() => {
    const {name, room} = queryString.parse(location.search);

    socket = io(ENDPOINT);

    typeof name === 'string' && setName(name);
    typeof room === 'string' && setRoom(room); 

    socket.emit('join', {name, room}, ({error}) => {
      if (error) {
        alert(error.message);
      }
    });

    return () => {
      socket.emit('disconnected');
      socket.off();
    }
  }, [ENDPOINT, location.search])



  useEffect(() => {
    socket.on('message', ({player, move, numberOfPlayers}: {player: string, move: string, numberOfPlayers: number}) => {

      if (player === firstPlayer && numberOfPlayers >= 2) {
        // Player 1 Moved
        if (move === ARROW_UP) {
          setPressUp(prev => prev + 1);
        } else if (move === ARROW_LEFT) {
          setPressLeft(prev => prev + 1);
        } else if (move === ARROW_RIGHT) {
          setPressRight(prev => prev + 1);
        } else if (move === RELEASE) {
          setRelease(prev => prev + 1);
        }
      } else if (player === secondPlayer && numberOfPlayers >= 2) {
        // Player 2 Moved
        if (move === ARROW_UP) {
          setPressUpTwo(prev => prev + 1);
        } else if (move === ARROW_LEFT) {
          setPressLeftTwo(prev => prev + 1);
        } else if (move === ARROW_RIGHT) {
          setPressRightTwo(prev => prev + 1);
        } else if (move === RELEASE) {
          setReleaseTwo(prev => prev + 1);
        }
      }
    });

    socket.on('roomData', ({ playerOne, playerTwo }) => {
      playerOne && setFirstPlayer(playerOne);
      playerTwo && setSecondPlayer(playerTwo);
    });

  }, [name, firstPlayer, secondPlayer])

  const sendMove = (move) => {
    if (move) {
      socket.emit('sendMove', move, () => {
        console.log("SendMove Callback called!");
      });
    };
  }

  const leaveGame = () => {
    history.goBack();
  }

  return (
    <div style={{justifyContent: "center", textAlign: "center"}}>
      <div style={{marginBottom: 20}}>
        {
          firstPlayer != null && secondPlayer != null ?
            <Canvas
              sendMove={sendMove}
              upPressed={pressUp}
              upPressedTwo={pressUpTwo}
              leftPressed={pressLeft}
              leftPressedTwo={pressLeftTwo}
              rightPressed={pressRight}
              rightPressedTwo={pressRightTwo}
              released={release}
              releasedTwo={releaseTwo}
              socket={socket}
              firstPlayer={firstPlayer}
              secondPlayer={secondPlayer}
              name={name}
            /> :
            <div>
              <CircularProgress size={60} style={{marginRight: 30}}/>
              <Typography display="inline" color='primary' variant="h5">
                Waiting For Opponent...
              </Typography>
            </div>
        }
      </div>
      <Button variant="contained" color="secondary" onClick={() => leaveGame()}>
          Leave Game
      </Button>
    </div> 
  )
}

export default Game;