import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledAddBeam } from "./AddBeam";
import { StyledAddChannel } from "./AddChannel";
import { StyledAddCorner } from "./AddCorner";
import { StyledAddRectangle } from "./AddRectangle";

function sectionСalculation({ className, children }) {
  const svg = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);

  const saveShape = (func) => setArrayShapes([...arrayShapes, func]);

  useEffect(() => {
    draw()
  }, [arrayShapes])

  function draw() {
    svg.current.replaceChildren();

    let style = getComputedStyle(svg.current);
    const centerX = parseFloat(style.width) / 2;
    const centerY = parseFloat(style.height) / 2;

    const arrayXCoords = arrayShapes.reduce((prevVal, currVal) => {
      const shapeObj = currVal();
      return [...prevVal, shapeObj.coordX, shapeObj.coordX + shapeObj.b]
    }, []);

    const arrayYCoords = arrayShapes.reduce((prevVal, currVal) => {
      const shapeObj = currVal();
      return [...prevVal, shapeObj.coordY, shapeObj.coordY + shapeObj.h]
    }, [])

    const xLimits = [Math.min(...arrayXCoords), Math.max(...arrayXCoords)];
    const yLimits = [Math.min(...arrayYCoords), Math.max(...arrayYCoords)];
    arrayShapes.forEach(shape => shape(svg, centerX - ((xLimits[0] + xLimits[1])/2), centerY - ((yLimits[0] + yLimits[1])/2)))
  }

  async function submit(e) {
    e.preventDefault();

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
      <SVG ref={svg} />
      <form onSubmit={submit}>
        <ul>
          {<StyledAddBeam saveShape={saveShape} />}
          {<StyledAddChannel saveShape={saveShape} />}
          {<StyledAddCorner saveShape={saveShape} />}
          {<StyledAddRectangle saveShape={saveShape} />}
        </ul>

        <button>рассчитать</button>
      </form>
    </div>
  )
}

export const StyledSectionСalculation = styled(sectionСalculation)`
  display: flex;
`

const SVG = styled.svg`
  width: 600px;
  height: 300px;
  border: 1px solid black;
`

const Canvas = styled.canvas`
  border: 1px solid black;
`