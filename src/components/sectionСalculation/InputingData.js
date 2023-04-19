import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AddBeam from "./AddBeam";
import AddChannel from "./AddChannel";
import AddEqualAnglesCorners from "./AddEqualAnglesCorners";
import AddUnequalAnglesCorners from "./AddUnequalAnglesCorners";
import AddRectangle from "./AddRectangle";
import changeStatus from "../../javascript/changeStatusInList";
import SectionComposition from "./SectionComposition";
import StyledSourceGroup from "./SourceGroup";
import StyledResultGroup from "./ResultGroup";

function InputingData({className, children, setResult, result}) {
  const svg = useRef(null);
  const sourceGroup = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);
  const [isPointsModeActive, setPointsMode] = useState(false);
  const [viewBox, setViewBox] = useState(`0 0 800 600`);
  const [showCoords, setShowMode] = useState(true);
  const [shapeDataForCirclesMode, setShapeDataForCirclesMode] = useState(null);
  const [funcForSwitchActiveSection, setFuncForSwitchActiveSection] = useState(null);

  useEffect(() => {
    setPointsMode(arrayShapes.length ? true : false);
  }, [arrayShapes.length])

  const saveShape = (obj) => {
    return obj ? setArrayShapes([...arrayShapes, obj]) : arrayShapes;
  }

  async function submit(e) {
    e.preventDefault();

    const request = await fetch("http://localhost:3000/flatSection/", {
      method: "PUT",
      body: JSON.stringify(arrayShapes),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    const response = await request.json();
    setResult(response);
  }

  function setViewBoxSize(box) {
    const style = box.getBBox();

    if (!sourceGroup.current) {
      sourceGroup.current = box;
    }

    setViewBox(`${style.x-50} ${style.y-50} ${Math.round(style.width)+100} ${Math.round(style.height)+100}`);
  }

  function useShapeDataForCirclesMode(obj) {
    if (obj) {
      setShapeDataForCirclesMode(obj);
    }
  }

  useShapeDataForCirclesMode.getShapeData = () => shapeDataForCirclesMode;
  useShapeDataForCirclesMode.changeShapeData = () => setShapeDataForCirclesMode(null);

  return (
    <div className={className}>
      <SVG ref={svg} viewBox={viewBox}>
        <StyledSourceGroup saveShape={saveShape} arrayShapes={arrayShapes} setViewBoxSize={setViewBoxSize} useShapeDataForCirclesMode={useShapeDataForCirclesMode} showCoords={showCoords} />
        {/* <StyledResultGroup arrayShapes={arrayShapes} sourceGroup={sourceGroup} result={result} /> */}
        {!result ? null : <StyledResultGroup arrayShapes={arrayShapes} sourceGroup={sourceGroup} result={result} />}
      </SVG>
      <form onSubmit={submit}>
        <ul style={{position: "relative"}}>
          <li>
            <h2 onClick={(e) => changeStatus(e, funcForSwitchActiveSection)}>Простые сечения</h2>
            
            <ul style={{position: "relative"}}>
              <AddBeam saveShape={saveShape} isPointsModeActive={isPointsModeActive} useShapeDataForCirclesMode={useShapeDataForCirclesMode}/>
              <AddChannel saveShape={saveShape} isPointsModeActive={isPointsModeActive} useShapeDataForCirclesMode={useShapeDataForCirclesMode}/>
              <AddEqualAnglesCorners saveShape={saveShape} isPointsModeActive={isPointsModeActive} useShapeDataForCirclesMode={useShapeDataForCirclesMode}/>
              <AddUnequalAnglesCorners saveShape={saveShape} isPointsModeActive={isPointsModeActive} useShapeDataForCirclesMode={useShapeDataForCirclesMode}/>
              <AddRectangle saveShape={saveShape} isPointsModeActive={isPointsModeActive}/>
            </ul>
          </li>

          <li>
            <h2 onClick={(e) => changeStatus(e, funcForSwitchActiveSection)}>Состав сечения ({arrayShapes.length})</h2>

            {!arrayShapes.length 
              ? <p>Вы ещё не добавили ни одного сечения</p>
              : <SectionComposition 
                  arrayShapes={arrayShapes} 
                  setArrayShapes={setArrayShapes}
                  setFuncForSwitchActiveSection={setFuncForSwitchActiveSection} 
                />
            }
          </li>
        </ul>

        {!arrayShapes.length 
          ? null 
          : <>
            <button type="submit">рассчитать</button>
            <button type="button" onClick={() => setShowMode(!showCoords)}>
              {showCoords ? "Скрыть координаты" : "Показать координаты"}
            </button>
          </>
        }
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