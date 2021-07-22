import React, { useRef, useEffect, useCallback } from 'react'
import useKeyPress from './useKeyPress';

const Canvas = props => {
  const keyUp = useKeyPress('ArrowUp');
  const keyLeft = useKeyPress('ArrowLeft');
  const keyRight = useKeyPress('ArrowRight');
  const { sendMove, upPressed, leftPressed, rightPressed, released, socket, ...otherProps } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playerRef = useRef({
    w: 120,
    h: 120,
    x: 0,
    y: 540,
    speed: 10,
    dx: 0,
    dy: 0,
  });

  const gravity = 0.2;
  const drag = 1;

  const updatePlayerLocation = () => {
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

  const drawPlayer = ctx => {
    
    ctx.beginPath();
    ctx.arc(playerRef.current.x + 60, playerRef.current.y + 60, 60, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#000000';
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
      console.log("CLIENT: send stop horizontal move");
      sendMove('StopHorizontal');
    }
  }, [keyLeft, keyRight])

  useEffect(() => {
    playerRef.current.dx = -playerRef.current.speed
  }, [leftPressed])

  useEffect(() => {
    playerRef.current.dx = playerRef.current.speed
  }, [rightPressed])

  useEffect(() => {
    playerRef.current.dx = 0;
  }, [released]);

  useEffect(() => {
    if (keyUp && playerRef.current.y === 540) {
      sendMove('ArrowUp');
    }
  }, [keyUp]);

  useEffect(() => {
    if (upPressed) {
      playerRef.current.dy = -5;
    }
  }, [upPressed]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const render = () => {
          clear(ctx);
          updatePlayerLocation();
          drawPlayer(ctx);
          requestAnimationFrame(render);
        }
        render();
      }
    }
  }, [])
  
  return <canvas id="canvas" width="1000" height="600" style={{backgroundColor: "#4050B5"}} ref={canvasRef} {...otherProps}/>
}

export default Canvas