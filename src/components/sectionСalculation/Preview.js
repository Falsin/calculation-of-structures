import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Preview({ sectionName, degree, activeCase, setIdCoordInArray, isBtnPointsActive }) {
  const svg = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const section = useSelector(state => {
    const sectionArr = state[sectionName][sectionName];
    const reqElem = sectionArr.find(elem => (elem.h || elem.B || elem.b) >= 100);
    return reqElem
  });

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

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width));
    setHeight(parseFloat(style.height));
  }, [])

  useEffect(() => {
    const circles = svg.current.querySelectorAll("circle");
    circles.forEach(elem => elem.remove());

    if (section && isBtnPointsActive) {  
      const arr = !activeCase ? coords[sectionName] : coords[sectionName][activeCase-1];

      arr.forEach((elem, id) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "cx", `${width/2 + elem.x}`);
        circle.setAttributeNS(null, "cy", `${height/2 + elem.y}`);
        circle.setAttributeNS(null, "r", `${4}`);
        circle.setAttributeNS(null, "fill", "blue");
        circle.setAttributeNS(null, "transform", `rotate(${degree}, ${width/2}, ${height/2})`);

        circle.addEventListener("click", () => {
          setIdCoordInArray(id);
          console.log(id)
        })
  
        svg.current.appendChild(circle);
      });
    }
  })

  return (
    <svg ref={svg} style={{display: "block", maxHeight: "150px", transform: "scale(1, -1)"}}>
      {!section 
        ? null 
        : <path 
          d={drawStringSections[sectionName]}
          transform-origin="50% 50%"
          transform={(activeCase == 2) ? `scale(-1 -1) rotate(${-degree})` : `scale(1 -1) rotate(${degree})`}
          fill="white" 
          stroke="black"
        />
      }
    </svg>
  )
}