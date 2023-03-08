import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AddBeam from "./AddBeam";
import AddChannel from "./AddChannel";
import AddEqualAnglesCorners from "./AddEqualAnglesCorners";
import AddUnequalAnglesCorners from "./AddUnequalAnglesCorners";
import AddRectangle from "./AddRectangle";
import drawShapesArray from "../../javascript/drawShapesArray";
import changeStatus from "../../javascript/changeStatusInList";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import SectionComposition from "./SectionComposition";

function InputingData({className, children, setResult, result}) {
  const svg = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);
  const [isPointsModeActive, setPointsMode] = useState(false);

  const saveShape = (func) => {
    return func ? setArrayShapes([...arrayShapes, func]) : arrayShapes;
  }

  useEffect(() => {
    draw()
  }, [arrayShapes, result])

  function draw() {
    svg.current.replaceChildren();

    drawShapesArray(svg, arrayShapes, result)
  }

  useEffect(() => {
    setPointsMode(arrayShapes.length ? true : false);
  }, [arrayShapes.length])
  
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
    setResult(response);
  }

  createCirclesInSvg.svg = svg.current;

  return (
    <div className={className}>
      <SVG ref={svg} />
      <form onSubmit={submit}>
        <ul style={{position: "relative"}}>
          <li>
            <h2 onClick={(e) => changeStatus(e)}>Простые сечения</h2>
            
            <ul style={{position: "relative"}}>
              {<AddBeam saveShape={saveShape} isPointsModeActive={isPointsModeActive}/>}
              {<AddChannel saveShape={saveShape} isPointsModeActive={isPointsModeActive}/>}
              {<AddEqualAnglesCorners saveShape={saveShape} isPointsModeActive={isPointsModeActive}/>}
              {<AddUnequalAnglesCorners saveShape={saveShape} isPointsModeActive={isPointsModeActive}/>}
              {<AddRectangle saveShape={saveShape} isPointsModeActive={isPointsModeActive}/>}
            </ul>
          </li>

          <li>
            <h2 onClick={(e) => changeStatus(e)}>Состав сечения ({arrayShapes.length})</h2>

            {!arrayShapes.length 
              ? <p>Вы ещё не добавили ни одного сечения</p>
              : <SectionComposition arrayShapes={arrayShapes} setArrayShapes={setArrayShapes} />
            }
          </li>
        </ul>

        <button>рассчитать</button>
      </form>
    </div>
  )
}

const StyledInputingData = styled(InputingData)`
  display: flex;

  h2 {
    margin: 0;
  }

  li > h2 ~ ul,
  li > h3 ~ ul {
    overflow: hidden;
    max-height: 0;
    padding: 0;
    transition-timing-function: linear;
    transition: 1s;
  }

  li > h2.active ~ ul,
  li > h3.active ~ ul {
    max-height: 1000px;
    margin-top: 10px;
  }
`

const SVG = styled.svg`
  width: 800px;
  height: 600px;
  border: 1px solid black;
  transform: scale(1, -1);

  path.active {
    stroke: red;
  }
`

export default StyledInputingData;