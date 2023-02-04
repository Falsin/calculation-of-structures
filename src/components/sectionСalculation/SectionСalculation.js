import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledAddBeam } from "./AddBeam";
import { StyledAddChannel } from "./AddChannel";
import { StyledAddEqualAnglesCorners } from "./AddEqualAnglesCorners";
import { StyledAddUnequalAnglesCorners } from "./AddUnequalAnglesCorners";
import { StyledAddRectangle } from "./AddRectangle";

import { MathComponent } from "mathjax-react";

function sectionСalculation({ className, children }) {
  const [result, setResult] = useState(null)

  return (
    <div>
      <StyledInputingData setResult={setResult} />
      {!result ? null : <OutputingData result={result} />}
    </div>
  )
}

function InputingData({className, children, setResult}) {
  const svg = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);

  const saveShape = (func) => setArrayShapes([...arrayShapes, func]);

  useEffect(() => {
    draw()
  }, [arrayShapes])

  function draw() {
    svg.current.replaceChildren();

    let style = getComputedStyle(svg.current);
    const centerXWindow = parseFloat(style.width) / 2;
    const centerYWindow = parseFloat(style.height) / 2;

    const arrayCentersCoordsX = arrayShapes.map(shapeFunc => {
      const shapeObj = shapeFunc();

      return shapeObj.centerX;
    })

    const arrayCentersCoordsY = arrayShapes.map(shapeFunc => {
      const shapeObj = shapeFunc();

      return shapeObj.centerY;
    })

    const xLimits = [Math.min(...arrayCentersCoordsX), Math.max(...arrayCentersCoordsX)];
    const yLimits = [Math.min(...arrayCentersCoordsY), Math.max(...arrayCentersCoordsY)];
    const leftXLimit = centerXWindow - (xLimits[1] - xLimits[0])/2;
    const bottomYLimit = centerYWindow - (yLimits[1] - yLimits[0])/2;

    arrayShapes.forEach((shape, id) => {
      shape(svg, leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]), bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]));
    })
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
    setResult(response)
  }

  return (
    <div className={className}>
      <SVG ref={svg} transform="scale(1, -1)" />
      <form onSubmit={submit}>
        <ul>
          {<StyledAddBeam saveShape={saveShape} />}
          {<StyledAddChannel saveShape={saveShape} />}
          {<StyledAddEqualAnglesCorners saveShape={saveShape} />}
          {<StyledAddUnequalAnglesCorners saveShape={saveShape} />}
          {<StyledAddRectangle saveShape={saveShape} />}
        </ul>

        <button>рассчитать</button>
      </form>
    </div>
  )
}

const StyledInputingData = styled(InputingData)`
  display: flex;
`

function OutputingData({result}) {
  console.log(result)
  return (
    <div>
      <MathComponent tex={result.centerOfGravity.mathStringX} />
      <MathComponent tex={result.centerOfGravity.mathStringY} />
      <MathComponent tex={result.Ix.mathString} />
      <MathComponent tex={result.Iy.mathString} />
    </div>
  )
}

export const StyledSectionСalculation = styled(sectionСalculation)`
  & > div {
    display: flex;
  }
`

const SVG = styled.svg`
  width: 600px;
  height: 300px;
  border: 1px solid black;
`

function Report({result}) {
  return <MathComponent tex={result} />
}