import React, { useState } from "react";
import uniqid from 'uniqid';

export default function Axis({elem, scale, result}) {
  const [id] = useState(uniqid())

  return <g>
    <defs>
        <marker
          id={id}
          markerWidth="8" 
          markerHeight="10"
          refX="4"
          refY="10"
          stroke="black"
          orient={`${elem.x1 == elem.x2 ? '0' : '-90'}`}
        >
            <path d="M 0.5, 0 l 3.5 10 l 3.5 -10"/>
        </marker>   
      </defs>

      <path d={`M ${elem.x1} ${elem.y1} L ${elem.x2} ${elem.y2}`} markerEnd={`url(#${id})`}/>

      <text
        x={`${elem.x2}`}
        y={`${elem.y2}`}
        transform-origin={`${elem.x2} ${elem.y2}`}
        textAnchor="middle"
        fontSize={`${(16/scale)+2}`}
        transform={`scale(1 -1) rotate(${result ? -result.degree.value : 0})`}
      >
        {elem.axisName}
      </text>
  </g>
}