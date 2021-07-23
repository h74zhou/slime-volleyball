import React, { useRef, useEffect, useCallback } from 'react'
import useKeyPress from './useKeyPress';

const Canvas = props => {
  const keyUp = useKeyPress('ArrowUp');
  const keyLeft = useKeyPress('ArrowLeft');
  const keyRight = useKeyPress('ArrowRight');
  const { 
    sendMove, 
    upPressed, 
    upPressedTwo,
    leftPressed, 
    leftPressedTwo,
    rightPressed, 
    rightPressedTwo,
    released, 
    releasedTwo,
    socket, 
    firstPlayer,
    secondPlayer,
    name,
    ...otherProps 
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const firstPlayerRef = useRef({
    w: 120,
    h: 120,
    x: 0,
    y: 540,
    speed: 10,
    dx: 0,
    dy: 0,
  });

  const secondPlayerRef = useRef({
    w: 120,
    h: 120,
    x: 400,
    y: 540,
    speed: 10,
    dx: 0,
    dy: 0,
  })

  const gravity = 0.2;
  const drag = 1;

  const updatePlayerLocation = (playerRef) => {
    playerRef.current.x += playerRef.current.dx;
    playerRef.current.dy += gravity;
    playerRef.current.dy *= drag;
    playerRef.current.y += playerRef.current.dy;
    
    if (canvasRef.current != null && playerRef.current.x < 0) {
      playerRef.current.x = 0;
      playerRef.current.dx = 0;
    }

    if (canvasRef.current != null && playerRef.current.x > canvasRef.current?.width - playerRef.current.w) {
      playerRef.current.x = canvasRef.current?.width - playerRef.current.w;
      playerRef.current.dx = 0;
    }

    if (canvasRef.current != null && playerRef.current.y >= 540) {
      playerRef.current.y = 540;
      playerRef.current.dy = 0;
    }
  };

  const updateFirstPlayerLocation = () => {
    updatePlayerLocation(firstPlayerRef);
  };

  const updateSecondPlayerLocation = () => {
    updatePlayerLocation(secondPlayerRef);
  }

  const drawFirstPlayer = ctx => {
    
    ctx.beginPath();
    ctx.arc(firstPlayerRef.current.x + 60, firstPlayerRef.current.y + 60, 60, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#000000';
    ctx.fill();
  }

  const drawSecondPlayer = ctx => {
    ctx.beginPath();
    ctx.arc(secondPlayerRef.current.x + 60, secondPlayerRef.current.y + 60, 60, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#800000';
    ctx.fill();
  }

  const clear = ctx => {
   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  useEffect(() => {
    if (keyLeft) {
      sendMove('ArrowLeft');
    }
    if (keyRight) {
      sendMove('ArrowRight');
    }
    if (socket != null && !keyLeft && !keyRight) {
      sendMove('StopHorizontal');
    }
  }, [keyLeft, keyRight])

  useEffect(() => {
    firstPlayerRef.current.dx = -firstPlayerRef.current.speed
  }, [leftPressed])

  useEffect(() => {
    secondPlayerRef.current.dx = -secondPlayerRef.current.speed
  }, [leftPressedTwo])

  useEffect(() => {
    firstPlayerRef.current.dx = firstPlayerRef.current.speed
  }, [rightPressed])

  useEffect(() => {
    secondPlayerRef.current.dx = secondPlayerRef.current.speed
  }, [rightPressedTwo])

  useEffect(() => {
    firstPlayerRef.current.dx = 0;
  }, [released]);

  useEffect(() => {
    secondPlayerRef.current.dx = 0;
  }, [releasedTwo]);

  useEffect(() => {
    if (keyUp) {
      console.log(`Key Up Called, Name is: ${name}`)
      console.log(`Key Up Called, First Player is: ${firstPlayer}`);
      console.log(`Key Up Called, Second Player is: ${secondPlayer}`);
      if (
        (name === firstPlayer && firstPlayerRef.current.y === 540) ||
        (name === secondPlayer && secondPlayerRef.current.y === 540)
      ) {
        console.log("sending arrow up");
        sendMove("ArrowUp")
      }
    }
  }, [keyUp, firstPlayer, secondPlayer]);

  useEffect(() => {
    if (upPressed) {
      firstPlayerRef.current.dy = -5;
    }
  }, [upPressed]);

  useEffect(() => {
    if (upPressedTwo) {
      secondPlayerRef.current.dy = -5;
    }
  }, [upPressedTwo]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const render = () => {
          clear(ctx);
          updateFirstPlayerLocation();
          updateSecondPlayerLocation();
          drawFirstPlayer(ctx);
          drawSecondPlayer(ctx);
          requestAnimationFrame(render);
        }
        render();
      }
    }
  }, [])
  
  return <canvas id="canvas" width="1000" height="600" style={{backgroundColor: "#4050B5"}} ref={canvasRef} {...otherProps}/>
}

export default Canvas