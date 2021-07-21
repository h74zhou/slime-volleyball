import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = ctx => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20, 0, 2*Math.PI)
    ctx.fill()
  }
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        //Our first draw
        draw(context);
      }
    }
  }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas