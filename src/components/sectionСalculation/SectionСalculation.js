import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledAddBeam } from "./AddBeam";
import { StyledAddChannel } from "./AddChannel";
import { StyledAddCorner } from "./AddCorner";
import { StyledAddRectangle } from "./AddRectangle";

function sectionСalculation({ className, children }) {
  const canvas = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);

  const saveShape = (func) => setArrayShapes([...arrayShapes, func])

  useEffect(() => {
    const ratio = window.devicePixelRatio;

    canvas.current.width = 600 * ratio;
    canvas.current.height = 300 * ratio;

    canvas.current.style.width = "600px";
    canvas.current.style.height = "300px";

    let ctx = canvas.current.getContext("2d");
    ctx.scale(ratio, ratio);
    
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
  }, [])

  function draw(func) {
    setArrayShapes([...arrayShapes, func])
  }

  useEffect(() => {
    draw()
  }, [arrayShapes])

  function draw() {
    let ctx = canvas.current.getContext("2d");
    ctx.save();

    if (arrayShapes.length > 1) {
      clearShapes();

      const arrayXCoords = arrayShapes.map(elem => elem().coordX);
      const arrayYCoords = arrayShapes.map(elem => elem().coordY);

      const xLimits = [Math.min(...arrayXCoords), Math.max(...arrayXCoords)];
      const yLimits = [Math.min(...arrayYCoords), Math.max(...arrayYCoords)];

      ctx.translate((canvas.current.width / 2) - (xLimits[0] + xLimits[1]) / 2, (canvas.current.height / 2) - (yLimits[0] + yLimits[1]) / 2);
    } else if (arrayShapes.length === 1) {
      ctx.translate(canvas.current.width / 2, canvas.current.height / 2);
    } 

    arrayShapes.forEach(item => item(ctx))
    ctx.restore()
  }

  function clearShapes() {
    let ctx = canvas.current.getContext("2d");

    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
  }

  async function send() {
    const request = await fetch("http://localhost:3000/flatSection/", {
      method: "PUT",
      body: JSON.stringify(arrayShapes.map(item => item())),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    const response = await request.json();
    console.log(response)
  }

  return (
    <div className={className}>
      <Canvas ref={canvas} />
      <div>
        <ul>
          {<StyledAddBeam saveShape={saveShape} />}
          {<StyledAddChannel saveShape={saveShape} />}
          {<StyledAddCorner saveShape={saveShape} />}
          {<StyledAddRectangle saveShape={saveShape} />}
          <button onClick={clearShapes} >Delete</button>
        </ul>

        <button onClick={send}>рассчитать</button>
      </div>
    </div>
  )
}

export const StyledSectionСalculation = styled(sectionСalculation)`
  display: flex;
`

const Canvas = styled.canvas`
  border: 1px solid black;
/*   width: 600px;
  height: 300px; */
`