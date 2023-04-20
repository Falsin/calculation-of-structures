import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createAxisArray, drawCommonAxis } from "../../javascript/drawShapesArray";
import Axis from "./AxisComponent";
import styled from "styled-components";
import { Beam, Channel, EqualAnglesCorner, Rectangle, UnequalAnglesCorner } from "../../javascript/Section";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";

function Preview({ sectionName, degree, activeCase, setIdCoordInArray, isBtnPointsActive, className, children }) {
  const svg = useRef(null);
  const sectionPath = useRef(null)
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [deg, setDeg] = useState(degree);
  const [circles, setCircles] = useState([]);
  const [axesArr, setAxesArr] = useState([]);
  const [sectionInstance, setSectionInstance] = useState(null)
  
  const section = useSelector(state => {
    const sectionArr = state[sectionName][sectionName];
    const reqElem = sectionArr.find(elem => (elem.h || elem.B || elem.b) >= 100);
    return reqElem
  });

  const {B, h, b, s, t, z0, x0, y0} = !section ? {} : section;

  const sectionsObj = {
    beams: (centerX, centerY) => new Beam(centerX, centerY, deg, section),
    channels: (centerX, centerY) => new Channel(centerX, centerY, deg, section),
    equalAnglesCorners: (centerX, centerY) => new EqualAnglesCorner(centerX, centerY, deg, section),
    unequalAnglesCorners: (centerX, centerY) => new UnequalAnglesCorner(centerX, centerY, deg, section),
    rectangles: (centerX, centerY) => new Rectangle(centerX, centerY, deg, section),
  }


  useEffect(() => {
    if (degree !== deg) {
      setDeg(deg + 90)
    }
  }, [degree]);

  useEffect(() => {
    transformDependingOnActiveCase()
  }, [activeCase])

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
      sectionInstance.createD();
      createCirclesInSvg(sectionInstance)  
      setSectionInstance(sectionInstance)
    }
  }, [section, activeCase])

  useEffect(() => {
    if (sectionPath.current) {
      const distY = (B/2 || h/2 || b/2) - (h/2 || z0*10 || y0*10);

      const copySectionInstance = {...sectionInstance};

      copySectionInstance.relativeCenterY = height/2 - distY
      setAxesArr(drawCommonAxis(copySectionInstance, sectionPath));
    } 
  }, [sectionInstance, activeCase])

  function findRelativeCenter() {
    const distX = b/2 - (z0*10 || x0*10 || b/2);
    const distY = (B/2 || h/2 || b/2) - (h/2 || z0*10 || y0*10)

    const centerX = width/2 - distX;
    const centerY = height/2 + distY;
    return { centerX, centerY }
  }

  useEffect(() => {
    createCircles()
  }, [isBtnPointsActive]);

  const coords = {
    beams: [
      {x: -b/2, y: h/2},
      {x: b/2, y: h/2},
      {x: b/2, y: -h/2},
      {x: -b/2, y: -h/2}
    ],
    channels: [
      {x: -b/2, y: h/2},
      {x: b/2, y: h/2},
      {x: b/2, y: -h/2},
      {x: -b/2, y: -h/2},
    ],
    equalAnglesCorners: [
      {x: -b/2, y: b/2},
      {x: b/2, y: -b/2},
      {x: -b/2, y: -b/2}
    ],
    unequalAnglesCorners: [
      [
        {x: -b/2, y: B/2},
        {x: b/2, y: -B/2},
        {x: -b/2, y: -B/2}
      ],
      [
        {x: b/2, y: B/2},
        {x: b/2, y: -B/2},
        {x: -b/2, y: -B/2},
      ]
    ]
  }

  function transformDependingOnActiveCase() {
    circles.forEach(elem => elem.setAttributeNS(null, "transform", `scale(${activeCase == 2 ? -1 : 1}, 1)`));
  }

  function createCircles() {
    const circles = svg.current.querySelectorAll("circle");
    circles.forEach(elem => elem.remove());

    if (section && isBtnPointsActive) {  
      const arr = !activeCase ? coords[sectionName] : coords[sectionName][activeCase-1];

      const circlesArr = arr.map((elem, id) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "cx", `${width/2 + elem.x}`);
        circle.setAttributeNS(null, "cy", `${height/2 + elem.y}`);
        circle.setAttributeNS(null, "r", `${4}`);
        circle.setAttributeNS(null, "fill", "blue");
        circle.setAttributeNS(null, "transform-origin", `${width/2} ${height/2}`);

        circle.addEventListener("click", () => setIdCoordInArray(id))
        g.current.appendChild(circle);
        return circle;
      });

      setCircles(circlesArr)
    }
  }

  return (
    <svg className={className} ref={svg} style={{display: "block", maxHeight: "150px", transform: "scale(1, 1)"}}>
      <g style={{transform: `rotate(${deg}deg)`, transformOrigin: "50% 50%"}}>
        {!section 
          ? null
          :
          <>
            <g style={{transformOrigin: `${width/2}px ${height/2}px`, transform: `scale(${activeCase == 2 ? -1 : 1}, -1)`}}>
              {axesArr.map(axisObj => <Axis elem={axisObj} scale={1} />)}
            </g>
            {!sectionInstance ? null : <path ref={sectionPath} style={{fillOpacity: 0}} transform-origin={`${width/2} ${height/2}`}
              transform={`scale(${activeCase == 2 ? -1 : 1}, 1)`} d={sectionInstance.d} stroke="black" />}
          </> 
        }
      </g>
    </svg>
  )
}

const StyledPreview = styled(Preview)`
  g g:first-child path,
  g g:first-child marker  {
    stroke: green;
    fill: green;
  }

  g g:nth-child(2) path,
  g g:nth-child(2) marker  {
    stroke: red;
    fill: red;
  }

  * {
    transition-property: transform;
    transition-duration: 1s;
    transition-timing-function: linear;
  }
`

export default StyledPreview;