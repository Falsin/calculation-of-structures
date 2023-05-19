import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { drawCommonAxis } from "../../javascript/drawShapesArray";
import Axis from "./AxisComponent";
import styled from "styled-components";
import { createBeam, createChannel, createEqualAnglesCorner, createUnequalAnglesCorner, createRectangle } from "../../javascript/sections/Sections"
import { createD } from "../../javascript/sections/sectionsMethods";

function Preview({ sectionName, degree, activeCase, setIdCoordInArray, isBtnPointsActive, className }) {
  const svg = useRef(null);
  const sectionPath = useRef(null)
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [deg, setDeg] = useState(degree);
  const [axesArr, setAxesArr] = useState([]);
  const [sectionInstance, setSectionInstance] = useState(null)
  
  const section = useSelector(state => {
    const sectionObj = state[sectionName].entities;
    return  Object.values(sectionObj).find(elem => (elem.h || elem.B || elem.b) >= 100);
  });

  const {B, h, b, z0, x0, y0} = !section ? {} : section;

  const sectionsObj = {
    beams: (centerX, centerY) => createBeam(centerX, centerY, deg, section),
    channels: (centerX, centerY) => createChannel(centerX, centerY, deg, section),
    equalAnglesCorners: (centerX, centerY) => createEqualAnglesCorner(centerX, centerY, deg, section),
    unequalAnglesCorners: (centerX, centerY) => createUnequalAnglesCorner(centerX, centerY, deg, section, activeCase),
    rectangles: (centerX, centerY) => createRectangle(centerX, centerY, deg, section),
  }

  useEffect(() => {
    if (degree !== deg) {
      setDeg(deg + 90)
    }
  }, [degree]);

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width));
    setHeight(parseFloat(style.height));
  }, [])

  useEffect(() => {
    if (section) {
      const { centerX, centerY } = findRelativeCenter();
      const sectionInstance = sectionsObj[sectionName](centerX, centerY);

      sectionInstance.relativeCenterX = centerX;
      sectionInstance.relativeCenterY = centerY;

      setSectionInstance(sectionInstance)
    }
  }, [section])

  useEffect(() => {
    if (sectionPath.current) {
      const distY = (B/2 || h/2 || b/2) - (h/2 || z0*10 || y0*10);

      const copySectionInstance = {...sectionInstance};

      copySectionInstance.relativeCenterY = height/2 - distY
      setAxesArr(drawCommonAxis(copySectionInstance, sectionPath));
    } 
  }, [sectionInstance])

  function findRelativeCenter() {
    const distX = b/2 - (z0*10 || x0*10 || b/2);
    const distY = (B/2 || h/2 || b/2) - (h/2 || z0*10 || y0*10);

    const centerX = width/2 - distX;
    const centerY = height/2 + distY;
    return { centerX, centerY }
  }

  const points = !isBtnPointsActive 
    ? null 
    : sectionInstance.coords.map((coordObj, id) => (
        <circle 
          cx={sectionInstance.relativeCenterX+coordObj.x} 
          cy={sectionInstance.relativeCenterY-coordObj.y}
          onClick={() => setIdCoordInArray(id)}
        />
    ))

  const drawing = !sectionInstance 
    ? null
    : <>
        <g className="axes" style={{transformOrigin: `${width/2}px ${height/2}px`, transform: `scale(${activeCase == 2 ? -1 : 1}, 1)`}}>
          {axesArr.map(axisObj => <Axis elem={axisObj} scale={1} />)}
        </g>

        <g className="shape" transform-origin={`${width/2} ${height/2}`} transform={`scale(${activeCase == 2 ? -1 : 1}, -1)`} >
          <path ref={sectionPath} d={createD.call(sectionInstance, sectionName)} />
          {points}
        </g>
      </>

  return (
    <svg className={className} ref={svg}>
      <g style={{transform: `rotate(${-deg}deg)`}}>{drawing}</g>
    </svg>
  )
}

const StyledPreview = styled(Preview)`
  display: block;
  max-height: 150px;
  transform: scale(1, -1);

  & > g {
    transform-origin: 50% 50%;

    .axes {
      g:first-child path,
      g:first-child marker {
        stroke: green;
        fill: green;
      }

      g:nth-child(2) path,
      g:nth-child(2) marker {
        stroke: red;
        fill: red;
      }
    }

    .shape {
      path {
        fill-opacity: 0;
        stroke: black;
      }

      circle {
        fill: blue;
        r: 4;
      }
    }
  }

  * {
    transition-property: transform;
    transition-duration: 1s;
    transition-timing-function: linear;
  }
`

export default StyledPreview;