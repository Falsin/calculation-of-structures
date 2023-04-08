import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createAxisArray, drawAxis } from "../../javascript/drawShapesArray";

export default function Preview({ sectionName, degree, activeCase, setIdCoordInArray, isBtnPointsActive }) {
  const svg = useRef(null);
  const g = useRef(null)
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [deg, setDeg] = useState(degree);
  const [axisArr, setAxisArr] = useState([]);
  const [circles, setCircles] = useState([]);
  
  const section = useSelector(state => {
    const sectionArr = state[sectionName][sectionName];
    const reqElem = sectionArr.find(elem => (elem.h || elem.B || elem.b) >= 100);
    return reqElem
  });

  useEffect(() => {
    if (degree !== deg) {
      setDeg(deg + 90)
    }
  }, [degree]);

  useEffect(() => {
    createAxis()
  }, [section]);

  useEffect(() => {
    transformDependingOnActiveCase()
  }, [activeCase])

  useEffect(() => {
    addAxisInNode()
  }, [axisArr])

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width));
    setHeight(parseFloat(style.height));
  }, [])

  useEffect(() => {
    createCircles()
  }, [isBtnPointsActive]);

  const {B, h, b, s, t, z0, x0, y0} = !section ? {} : section;

  const drawStringSections = {
    beams: `M ${width/2 - b/2}, ${height/2 - h/2} h ${b} v ${t} h -${(b - s)/2} v ${h-2*t} h ${(b - s)/2} v ${t} h -${b} v -${t} h ${(b - s)/2} v -${h - 2*t} h -${(b - s)/2} z`,
    channels: `M ${width/2 - b/2}, ${height/2 - h/2} h ${b} v ${t} h -${b - s} v ${h-2*t} h ${b - s} v ${t} h -${b}  z`,
    equalAnglesCorners: `M ${width/2 - b/2}, ${height/2 - b/2} h ${t} v ${b - t} h ${b - t} v ${t} h ${-b} z`,
    unequalAnglesCorners: `M ${width/2 - b/2}, ${height/2 - B/2} h ${t} v ${B - t} h ${b - t} v ${t} h ${-b} z`
  }

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

  function createAxis() {
    if (section) {
      const style = getComputedStyle(svg.current);
      const sourceGroup = g.current;

      const dist = z0*10 || x0*10 || b/2;
      let centerX = width/2 + (activeCase == 2 ? b/2 - dist : - b/2 + dist);

      const centerY = height/2 - (B/2 || h/2 || b/2) + (h/2 || z0*10 || y0*10);

      const commonAxes = [
        {x: centerX},
        {y: centerY},
      ]

      const styleObj = sourceGroup.getBBox();

      const arr = createAxisArray({style, commonAxes, id: 0, styleObj})
      setAxisArr(createNodeArr(arr))
    }
  }

  function addAxisInNode() {
    if (axisArr.length) {
      axisArr.forEach(elem => g.current.appendChild(elem))
    }
  }

  function transformDependingOnActiveCase() {
    axisArr.forEach(elem => {
      elem.setAttributeNS(null, "transform", `scale(${activeCase == 2 ? -1 : 1}, 1)`);
    })

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
  
  function createNodeArr(arr) {
    return arr.reduce((prev, curr, id) => {
      const { line, defs } = drawAxis({...curr, color: (id == 1) ? "red" : "green"});
      line.setAttributeNS(null, "transform-origin", `${width/2} ${height/2}`);
      return [...prev, line, defs]
    }, [])
  }

  return (
    <svg ref={svg} style={{display: "block", maxHeight: "150px", transform: "scale(1, -1)"}}>
      <g ref={g} style={{transform: `rotate(${-deg}deg)`, transformOrigin: "50% 50%"}}>
        {!section 
          ? null 
          : <path 
            d={drawStringSections[sectionName]}
            transform-origin="50% 50%"
            transform={`scale(${activeCase == 2 ? -1 : 1}, -1)`}
            fill="white" 
            stroke="black"
          />
        }
      </g>
    </svg>
  )
}