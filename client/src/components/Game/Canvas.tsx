import { useRef, useEffect } from 'react'
import useKeyPress from './useKeyPress';

const PLAYER_ONE_ORIGINAL_X = 120;
const PLAYER_TWO_ORIGINAL_X = 880;
const PLAYER_ORIGINAL_Y = 600;
const BALL_STARTING_HEIGHT = 100;
const NET_STARTING_X_VALUE = 490;
const NET_WIDTH = 20;
const BALL_ORIGINAL_DY = 5;

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
    sendBallMove,
    ballMove,
    refreshGame,
    sendRestartGame,
    setFirstPlayerScore,
    setSecondPlayerScore,
    refresh,
    ...otherProps 
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const firstPlayerRef = useRef({
    w: 60,
    h: 60,
    x: 120,
    y: PLAYER_ORIGINAL_Y,
    speed: 10,
    dx: 0,
    dy: 0,
    name: firstPlayer
  });

  const firstPlayerScoreRef = useRef(0);
  const secondPlayerScoreRef = useRef(0);

  const secondPlayerRef = useRef({
    w: 60,
    h: 60,
    x: 880,
    y: PLAYER_ORIGINAL_Y,
    speed: 10,
    dx: 0,
    dy: 0,
    name: secondPlayer,
  });

  const volleyBallRef = useRef({
    w: 20,
    h: 20,
    x: 120,
    y: BALL_STARTING_HEIGHT,
    speed: 15,
    dx: 0,
    dy: BALL_ORIGINAL_DY,
  });

  const netRef = useRef({
    w: NET_WIDTH,
    h: 70,
    x: NET_STARTING_X_VALUE, 
    y: 530,
  });

  const gravity = 0.2;
  const drag = 1;

  const updateVolleyBallLocation = () => {
    if (firstPlayerScoreRef.current >= 5 || secondPlayerScoreRef.current >= 5) {
      volleyBallRef.current.dx = 0;
      volleyBallRef.current.dy = 0;
      return;
    }

    volleyBallRef.current.x += volleyBallRef.current.dx;

    if (canvasRef.current != null && volleyBallRef.current.y < canvasRef.current?.height - volleyBallRef.current.h * 2) {
      volleyBallRef.current.dy += gravity;
    }
    
    volleyBallRef.current.y += volleyBallRef.current.dy;

    if (canvasRef.current != null && 
        (volleyBallRef.current.x < 0 + volleyBallRef.current.w || 
          volleyBallRef.current.x > canvasRef.current?.width - volleyBallRef.current.w
        )
      ) {
      volleyBallRef.current.dx *= -1;
    }

    if (canvasRef.current != null && volleyBallRef.current.y < 0) {
      volleyBallRef.current.dy *= -1;
    }

    if (canvasRef.current != null && volleyBallRef.current.y > canvasRef.current?.height - volleyBallRef.current.h) {
      resetGame();
    }

    if (ballCollisionPlayer1()) {
      sendBallMove({
        x: volleyBallRef.current.x,
        y: volleyBallRef.current.y,
        dx: volleyBallRef.current.dx,
        dy: volleyBallRef.current.dy,
      }, {
        x: firstPlayerRef.current.x,
        y: firstPlayerRef.current.y,
        dx: firstPlayerRef.current.dx,
        dy: firstPlayerRef.current.dy,
        name: firstPlayer,
      });
    } else if (ballCollisionPlayer2()) {
      sendBallMove({
        x: volleyBallRef.current.x,
        y: volleyBallRef.current.y,
        dx: volleyBallRef.current.dx,
        dy: volleyBallRef.current.dy,
      }, {
        x: secondPlayerRef.current.x,
        y: secondPlayerRef.current.y,
        dx: secondPlayerRef.current.dx,
        dy: secondPlayerRef.current.dy,
        name: secondPlayer,
      });
    } else if (ballCollisionNet()) {
      volleyBallRef.current.dx *= -1;
      volleyBallRef.current.dy *= -1;
    }
  };

  const resetGame = () => {
    // Update Score
    if (canvasRef.current && volleyBallRef.current.x < canvasRef.current?.width / 2) {
      secondPlayerScoreRef.current += 1;
      setSecondPlayerScore(secondPlayerScoreRef.current);
    } else {
      firstPlayerScoreRef.current += 1;
      setFirstPlayerScore(firstPlayerScoreRef.current);
    }

    // Reset the Location of Objects
    volleyBallRef.current.x = PLAYER_ONE_ORIGINAL_X;
    volleyBallRef.current.y = BALL_STARTING_HEIGHT;
    volleyBallRef.current.dx = 0;
    volleyBallRef.current.dy = 5;
    firstPlayerRef.current.x = PLAYER_ONE_ORIGINAL_X;
    firstPlayerRef.current.y = PLAYER_ORIGINAL_Y;
    secondPlayerRef.current.x = PLAYER_TWO_ORIGINAL_X;
    secondPlayerRef.current.y = PLAYER_ORIGINAL_Y;
  };

  const updateFirstPlayerLocation = () => {
    firstPlayerRef.current.x += firstPlayerRef.current.dx;
    firstPlayerRef.current.dy += gravity;
    firstPlayerRef.current.dy *= drag;
    firstPlayerRef.current.y += firstPlayerRef.current.dy;
    
    if (canvasRef.current != null && firstPlayerRef.current.x < 0 + firstPlayerRef.current.w) {
      firstPlayerRef.current.x = 0 + firstPlayerRef.current.w;
      firstPlayerRef.current.dx = 0;
    }

    if (canvasRef.current != null && firstPlayerRef.current.x > NET_STARTING_X_VALUE - firstPlayerRef.current.w) {
      firstPlayerRef.current.x = NET_STARTING_X_VALUE - firstPlayerRef.current.w;
      firstPlayerRef.current.dx = 0;
    }

    if (canvasRef.current != null && firstPlayerRef.current.y > canvasRef.current.height) {
      firstPlayerRef.current.y = canvasRef.current.height;
      firstPlayerRef.current.dy = 0;
    }
  };

  const updateSecondPlayerLocation = () => {
    secondPlayerRef.current.x += secondPlayerRef.current.dx;
    secondPlayerRef.current.dy += gravity;
    secondPlayerRef.current.dy *= drag;
    secondPlayerRef.current.y += secondPlayerRef.current.dy;
    
    if (canvasRef.current != null && secondPlayerRef.current.x < NET_STARTING_X_VALUE + NET_WIDTH + secondPlayerRef.current.w) {
      secondPlayerRef.current.x = NET_STARTING_X_VALUE + NET_WIDTH + secondPlayerRef.current.w;
      secondPlayerRef.current.dx = 0;
    }

    if (canvasRef.current != null && secondPlayerRef.current.x > canvasRef.current?.width - secondPlayerRef.current.w) {
      secondPlayerRef.current.x = canvasRef.current?.width - secondPlayerRef.current.w;
      secondPlayerRef.current.dx = 0;
    }

    if (canvasRef.current != null && secondPlayerRef.current.y > canvasRef.current.height) {
      secondPlayerRef.current.y = canvasRef.current.height;
      secondPlayerRef.current.dy = 0;
    }
  };

  const ballCollisionPlayer1 = () => {
    const combinedRadiusFirst = firstPlayerRef.current.w + volleyBallRef.current.w;
    const yDeltaFirst = Math.abs(volleyBallRef.current.y - firstPlayerRef.current.y);
    const xDeltaFirst = Math.abs(volleyBallRef.current.x - firstPlayerRef.current.x);
    const deltaDistanceFirst = Math.sqrt(Math.pow(yDeltaFirst, 2) + Math.pow(xDeltaFirst, 2)); 
    return combinedRadiusFirst >= deltaDistanceFirst 
  };

  const ballCollisionPlayer2 = () => {
    const combinedRadiusSecond = secondPlayerRef.current.w + volleyBallRef.current.w;
    const yDeltaSecond = Math.abs(volleyBallRef.current.y - secondPlayerRef.current.y);
    const xDeltaSecond = Math.abs(volleyBallRef.current.x - secondPlayerRef.current.x);
    const deltaDistanceSecond = Math.sqrt(Math.pow(yDeltaSecond, 2) + Math.pow(xDeltaSecond, 2)); 
    return combinedRadiusSecond >= deltaDistanceSecond;
  };

  const ballCollisionNet = () => {
    var distX = Math.abs(volleyBallRef.current.x - netRef.current.x - netRef.current.w / 2);
    var distY = Math.abs(volleyBallRef.current.y - netRef.current.y - netRef.current.h / 2);
    
    if (distX > (netRef.current.w / 2 + volleyBallRef.current.w)) {
      return false;
    }
    if (distY > (netRef.current.h / 2 + volleyBallRef.current.h)) {
      return false;
    }
    if (distX <= (netRef.current.w / 2)) {
      return true;
    }
    if (distY <= (netRef.current.h / 2)) {
      return true;
    }
    var x = distX - netRef.current.w / 2;
    var y = distY - netRef.current.h / 2;
    return (x*x+y*y<=(volleyBallRef.current.w * volleyBallRef.current.w));
  };

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
    ctx.fillStyle = '#964B00';
    ctx.fill()
  };

  const drawNet = ctx => {
    ctx.fillStyle = '#006400';
    ctx.fillRect(netRef.current.x, netRef.current.y, netRef.current.w, netRef.current.h);
  };

  const clear = ctx => {
   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawScore = ctx => {
    ctx.font = '40px arial';
    ctx.textAlign = 'center'
    ctx.fillStyle = '#006400';
    if (firstPlayerScoreRef.current >= 5) {
      ctx.fillText("Player 1 Wins", ctx.canvas.width / 2, 50);
    } else if (secondPlayerScoreRef.current >= 5) {
      ctx.fillText("Player 2 Wins", ctx.canvas.width / 2, 50);
    } else {
      ctx.fillText(`${firstPlayerScoreRef.current} - ${secondPlayerScoreRef.current}`, ctx.canvas.width / 2, 50);
    }
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
  }, [keyLeft, keyRight]);

  useEffect(() => {
    volleyBallRef.current.x = ballMove.x;
    volleyBallRef.current.y = ballMove.y;
    volleyBallRef.current.dx = ballMove.dx;
    volleyBallRef.current.dy = ballMove.dy;
  }, [ballMove]);

  useEffect(() => {
    firstPlayerRef.current.dx = -firstPlayerRef.current.speed
  }, [leftPressed]);

  useEffect(() => {
    secondPlayerRef.current.dx = -secondPlayerRef.current.speed
  }, [leftPressedTwo]);

  useEffect(() => {
    firstPlayerRef.current.dx = firstPlayerRef.current.speed
  }, [rightPressed]);

  useEffect(() => {
    secondPlayerRef.current.dx = secondPlayerRef.current.speed
  }, [rightPressedTwo]);

  useEffect(() => {
    firstPlayerRef.current.dx = 0;
  }, [released]);

  useEffect(() => {
    secondPlayerRef.current.dx = 0;
  }, [releasedTwo]);

  useEffect(() => {
    if (keyUp) {
      if (
        (name === firstPlayer && firstPlayerRef.current.y === canvasRef.current?.height) ||
        (name === secondPlayer && secondPlayerRef.current.y === canvasRef.current?.height)
      ) {
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
    firstPlayerScoreRef.current = 0;
    secondPlayerScoreRef.current = 0;
    volleyBallRef.current.dy = BALL_ORIGINAL_DY;
  }, [refresh]);

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
          drawNet(ctx);
          drawFirstPlayer(ctx);
          drawSecondPlayer(ctx);
          drawVolleyBall(ctx);
          drawScore(ctx);
          requestAnimationFrame(render);
        }
        render();
      }
    }
  }, [])
  
  return <canvas id="canvas" width="1000" height="600" style={{backgroundColor: "#add8e6"}} ref={canvasRef} {...otherProps}/>
}

export default Canvas