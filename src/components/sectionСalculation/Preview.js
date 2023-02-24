import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Preview({ sectionName, degree, activeCase }) {
  const svg = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const section = useSelector(state => state[sectionName][sectionName][0]);
  const {B, h, b, s, t} = !section ? {} : section;

  const drawStringSections = {
    beams: `M ${width/2 - b/2}, ${height/2 - h/2} h ${b} v ${t} h -${(b - s)/2} v ${h-2*t} h ${(b - s)/2} v ${t} h -${b} v -${t} h ${(b - s)/2} v -${h - 2*t} h -${(b - s)/2} z`,
    channels: `M ${width/2 - b/2}, ${height/2 - h/2} h ${b} v ${t} h -${b - s} v ${h-2*t} h ${b - s} v ${t} h -${b}  z`,
    equalAnglesCorners: `M ${width/2 - b/2}, ${height/2 - b/2} h ${t} v ${b - t} h ${b - t} v ${t} h ${-b} z`,
    unequalAnglesCorners: `M ${width/2 - b/2}, ${height/2 - B/2} h ${t} v ${B - t} h ${b - t} v ${t} h ${-b} z`
  }

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width))
    setHeight(parseFloat(style.height))
  })

  return (
    <svg ref={svg} style={{display: "block"}}>
      {!section 
        ? null 
        : <path 
          d={drawStringSections[sectionName]}
          transform-origin={(activeCase == 2) ? "50% 50%" : ""}
          transform={(activeCase == 2) ? `scale(-1 1) rotate(${-degree})` : `rotate(${degree}, ${width/2}, ${height/2})`}
          fill="white" 
          stroke="black"  
        />
      }
    </svg>
  )
}