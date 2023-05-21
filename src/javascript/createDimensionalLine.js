import React from "react";

export default function createDimensionalLine (coordObj, degree, height, scale, orientation) {
  const { x, y, length } = coordObj;

  if (degree/360%1*360 == 90 || degree/360%1*360 == 270) {
    degree = (orientation == "vertical") ? degree -= 90 : degree += 90
  }

  return <g style={{transformOrigin: `${x}px ${y}px`, transform: `rotate(${(orientation == "vertical") ? "90deg" : "0"})`}}>
    <path d={`M ${x-2} ${y+height} l ${length+4} ${0}`}/>

    <path d={`M ${x} ${y+(height > 0 ? 2 : -2)} l ${0} ${height}`}/>
    <path d={`M ${x+length} ${y+(height > 0 ? 2 : -2)} l ${0} ${height}`}/>

    <path d={`M ${x} ${y+(height-2)} l ${0} ${4}`} style={{transform: `rotate(-45deg)`, transformOrigin: `${x}px ${y+height}px`}}/>
    <path d={`M ${x+length} ${y+(height-2)} l ${0} ${4}`} style={{transform: `rotate(-45deg)`, transformOrigin: `${x+length}px ${y+height}px`}}/>

    <g style={{transformOrigin: `${x+length/2}px ${y+height}px`, transform: `rotate(${degree}deg)`}}>
      <text 
        style={{fontSize: `${(16/scale)+2}px`, transform: `scale(1, -1)`, transformOrigin: `${x+length/2}px ${y+height+2}px`}}
        x={x+length/2} 
        y={y+height+2}
      >
        {length}
      </text>
    </g>
  </g>
}