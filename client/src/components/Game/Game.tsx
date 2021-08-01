import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Canvas from './Canvas';
import {Button, CircularProgress, Typography} from '@material-ui/core';
import { PlayCircleOutlineRounded } from '@material-ui/icons';

let socket;

type ballMoveType = {
  x: number,
  y: number,
  dx: number,
  dy: number,
}

type playerType = {
  x: number,
  y: number,
  dx: number,
  dy: number,
  name: string,
}

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

  // VolleyBall
  const [ballMove, setBallMove] = useState<ballMoveType>({
    x: 120,
    y: 100,
    dx: 0,
    dy: 5,
  });

  // Game Score State
  const [firstPlayerScore, setFirstPlayerScore] = useState<number>(0);
  const [secondPlayerScore, setSecondPlayerScore] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(0);

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

  useEffect(() => {
    socket.on('ballMove', (ballMove: ballMoveType) => {
      setBallMove({
        x: ballMove.x,
        y: ballMove.y,
        dx: ballMove.dx,
        dy: ballMove.dy,
      });
    })
  }, [])

  const sendMove = (move) => {
    if (move) {
      socket.emit('sendMove', move);
    };
  }

  const sendBallMove = (ballMove : ballMoveType, playerCollided: playerType) => {
    if (ballMove) {
      socket.emit('sendBallMove', {
        ballMove: ballMove,
        playerCollided: playerCollided,
      });
    }
  };

  const sendRestartGame = () => {
    socket.emit('sendRestartGame');
  }

  useEffect(() => {
    socket.on('restartGame', () => {
      setFirstPlayerScore(0);
      setSecondPlayerScore(0);
      setRefresh(prev => prev + 1);
    })
  }, []);

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
              sendBallMove={sendBallMove}
              ballMove={ballMove}
              sendRestartGame={sendRestartGame}
              setFirstPlayerScore={setFirstPlayerScore}
              setSecondPlayerScore={setSecondPlayerScore}
              refresh={refresh}
            /> :
            <div>
              <CircularProgress size={60} style={{marginRight: 30, marginTop: 80}}/>
              <Typography display="inline" color='primary' variant="h5">
                Waiting For Opponent...
              </Typography>
            </div>
        }
      </div>
      <div style={{marginBottom: 20}}>
        <Button variant="contained" color="secondary" onClick={() => leaveGame()}>
            Leave Game
        </Button>
      </div>
      {
        (firstPlayerScore >= 5 || secondPlayerScore >= 5) &&
        <div>
          <Button variant="contained" color="primary" onClick={() => sendRestartGame()}>
              Restart Game
          </Button>
        </div>
      }
    </div> 
  )
}

export default Game;