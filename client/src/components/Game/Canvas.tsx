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
    w: 60,
    h: 60,
    x: 120,
    y: 600,
    speed: 10,
    dx: 0,
    dy: 0,
  });

  const secondPlayerRef = useRef({
    w: 60,
    h: 60,
    x: 880,
    y: 600,
    speed: 10,
    dx: 0,
    dy: 0,
  });

  const volleyBallRef = useRef({
    w: 20,
    h: 20,
    x: 20,
    y: 300,
    speed: 15,
    dx: 5,
    dy: 5,
  })

  const gravity = 0.2;
  const drag = 1;

  const updateVolleyBallLocation = () => {
    volleyBallRef.current.x += volleyBallRef.current.dx;

    if (canvasRef.current != null && volleyBallRef.current.y < canvasRef.current?.height - volleyBallRef.current.h * 2) {
      volleyBallRef.current.dy += gravity;
    }
    
    volleyBallRef.current.y += volleyBallRef.current.dy;

    if (canvasRef.current != null && 
        (volleyBallRef.current.x < 0 + volleyBallRef.current.w || 
          volleyBallRef.current.x > canvasRef.current?.width - volleyBallRef.current.w ||
          ballPlayerCollision()
        )
      ) {
      volleyBallRef.current.dx *= -1;
    }

    if (canvasRef.current != null && 
        (volleyBallRef.current.y < 0 + volleyBallRef.current.w || 
          volleyBallRef.current.y > canvasRef.current?.height - volleyBallRef.current.h ||
          ballPlayerCollision()
        )
      ) {
      volleyBallRef.current.dy *= -1;
    }
  };

  const updatePlayerLocation = (playerRef) => {
    playerRef.current.x += playerRef.current.dx;
    playerRef.current.dy += gravity;
    playerRef.current.dy *= drag;
    playerRef.current.y += playerRef.current.dy;
    
    if (canvasRef.current != null && playerRef.current.x < 0 + playerRef.current.w) {
      playerRef.current.x = 0 + playerRef.current.w;
      playerRef.current.dx = 0;
    }

    if (canvasRef.current != null && playerRef.current.x > canvasRef.current?.width - playerRef.current.w) {
      playerRef.current.x = canvasRef.current?.width - playerRef.current.w;
      playerRef.current.dx = 0;
    }

    if (canvasRef.current != null && playerRef.current.y > canvasRef.current.height) {
      playerRef.current.y = canvasRef.current.height;
      playerRef.current.dy = 0;
    }
  };

  const ballPlayerCollision = () => {
    const combinedRadiusFirst = firstPlayerRef.current.w + volleyBallRef.current.w;
    const combinedRadiusSecond = secondPlayerRef.current.w + volleyBallRef.current.w;
    const yDeltaFirst = Math.abs(volleyBallRef.current.y - firstPlayerRef.current.y);
    const xDeltaFirst = Math.abs(volleyBallRef.current.x - firstPlayerRef.current.x);
    const yDeltaSecond = Math.abs(volleyBallRef.current.y - secondPlayerRef.current.y);
    const xDeltaSecond = Math.abs(volleyBallRef.current.x - secondPlayerRef.current.x);
    const deltaDistanceFirst = Math.sqrt(Math.pow(yDeltaFirst, 2) + Math.pow(xDeltaFirst, 2)); 
    const deltaDistanceSecond = Math.sqrt(Math.pow(yDeltaSecond, 2) + Math.pow(xDeltaSecond, 2)); 
    return combinedRadiusFirst >= deltaDistanceFirst || combinedRadiusSecond >= deltaDistanceSecond;
  }

  const updateFirstPlayerLocation = () => {
    updatePlayerLocation(firstPlayerRef);
  };

  const updateSecondPlayerLocation = () => {
    updatePlayerLocation(secondPlayerRef);
  }

  const drawFirstPlayer = ctx => {
    ctx.beginPath();
    ctx.arc(firstPlayerRef.current.x, firstPlayerRef.current.y, firstPlayerRef.current.w, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#000000';
    ctx.fill();
  }

  const drawSecondPlayer = ctx => {
    ctx.beginPath();
    ctx.arc(secondPlayerRef.current.x, secondPlayerRef.current.y, secondPlayerRef.current.w, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#800040';
    ctx.fill();
  };

  const drawVolleyBall = ctx => {
    ctx.beginPath();
    ctx.arc(volleyBallRef.current.x, volleyBallRef.current.y, volleyBallRef.current.w, 0, Math.PI * 2, true)
    ctx.fillStyle = '#F5C600';
    ctx.fill()
  };

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
      console.log("KEY UP was hit");
      if (
        (name === firstPlayer && firstPlayerRef.current.y === canvasRef.current?.height) ||
        (name === secondPlayer && secondPlayerRef.current.y === canvasRef.current?.height)
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
          updateVolleyBallLocation();
          drawFirstPlayer(ctx);
          drawSecondPlayer(ctx);
          drawVolleyBall(ctx);
          requestAnimationFrame(render);
        }
        render();
      }
    }
  }, [])
  
  return <canvas id="canvas" width="1000" height="600" style={{backgroundColor: "#4050B5"}} ref={canvasRef} {...otherProps}/>
}

export default Canvas