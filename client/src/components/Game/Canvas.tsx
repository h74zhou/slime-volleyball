import React, { useRef, useEffect, useCallback } from 'react'
import useKeyPress from './useKeyPress';
import useMultiKeyPress from './useMultiKeyPress';

function areKeysPressed(keys = [], keysPressed = []) {
  const required = new Set(keys);
  for (var elem of keysPressed) {
    required.delete(elem);
  }
  return required.size === 0;
}

const Canvas = props => {
  const keyUp = useKeyPress('ArrowUp');
  const keyDown = useKeyPress('ArrowDown');
  const keyLeft = useKeyPress('ArrowLeft');
  const keyRight = useKeyPress('ArrowRight');
  const keysPressed = useMultiKeyPress();

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
    // Check Left Border
    // if (playerRef.current.x <= 0) {
    //   playerRef.current.dx = 0;
    // } 

    // Check Right Border
    // if (canvasRef.current != null && playerRef.current.x > canvasRef.current?.width - playerRef.current.w) {
    //   playerRef.current.dx = 0;
    // }

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
    playerRef.current.dx = keyLeft ? -playerRef.current.speed : 0;
  }, [keyLeft]);

  useEffect(() => {
    playerRef.current.dx = keyRight ? playerRef.current.speed : 0;
  }, [keyRight]);

  useEffect(() => {
    if (keyUp && playerRef.current.y === 540) {
      console.log("HERUN")
      playerRef.current.dy = -5;
    }
  }, [keyUp]);

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
  
  return <canvas id="canvas" width="1000" height="600" style={{backgroundColor: "#0000FF"}} ref={canvasRef} {...props}/>
}

export default Canvas