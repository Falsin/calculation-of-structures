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
  const sourceGroup = useRef(null);
  const resultGroup = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);
  const [isPointsModeActive, setPointsMode] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [viewBox, setViewBox] = useState(`0 0 800 600`)

  const saveShape = (func) => {
    return func ? setArrayShapes([...arrayShapes, func]) : arrayShapes;
  }

  useEffect(() => {
    draw()
  }, [arrayShapes, result])

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width));
    setHeight(parseFloat(style.height));
  }, [svg])

  function draw() {
    sourceGroup.current.replaceChildren();

    drawShapesArray(sourceGroup, resultGroup, arrayShapes, result, svg);
    setViewBoxSize()
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

  createCirclesInSvg.svg = sourceGroup.current;

  function setViewBoxSize() {
    let style = resultGroup.current ? resultGroup.current.getBBox() : sourceGroup.current.getBBox();
    setViewBox(`${style.x-25} ${style.y-25} ${Math.round(style.width)+50} ${Math.round(style.height)+50}`);
  }

  return (
    <div className={className}>
      <SVG ref={svg} viewBox={viewBox} vector-effect="non-scaling-stroke">
        <g ref={sourceGroup}></g>
        {!result 
          ? null 
          : <g ref={resultGroup} style={{transform: `rotate(${!result ? 0 : -result.degree.value}deg)`, transformOrigin: `${width/2}px ${height/2}px`}} />
        }
      </SVG>
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

  form {
    svg > path,
    g > path {
      transition-property: transform;
      transition-duration: 1s;
      transition-timing-function: linear;
    }

    svg g,
    svg circle,
    svg g text {
      transition-property: transform;
      transition-duration: 1s;
      transition-timing-function: linear;
    }
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

  & g {
    width: inherit;
    height: inherit;
  }
`

export default StyledInputingData;