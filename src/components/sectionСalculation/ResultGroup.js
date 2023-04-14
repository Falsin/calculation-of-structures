import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import uniqid from 'uniqid';
import { drawMainAxis } from "../../javascript/drawShapesArray";
import calcScale from "../../javascript/calcScale";

function ResultGroup({className, children, arrayShapes, sourceGroup, result}) {
  const [scale, setScale] = useState(1);
  const style = getComputedStyle(sourceGroup.current);

  const { justResultAxes, resultMainAxes } = drawMainAxis(arrayShapes, sourceGroup, result)
    .reduce((prev, curr) => {
      if (curr.axisName != "V" && curr.axisName != "U") {
        return {...prev, justResultAxes: [...prev.justResultAxes, curr]}
      } else {
        return {...prev, resultMainAxes: [...prev.resultMainAxes, curr]}
      }
    }, {justResultAxes: [], resultMainAxes: []})

  useEffect(() => {
    setScale(calcScale(sourceGroup))
  }, [])

  return <g className={className}>
    <g>
      {justResultAxes.map(elem => {
          const id = uniqid();

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
                transform={`scale(1 -1)`}
                //transform={`scale(${shape.activeCase == 2 ? -1 : 1} -1)`}
              >
                {elem.axisName}
              </text>
          </g>
        })}
    </g>
    <g style={{transform: `rotate(${!result ? 0 : -result.degree.value}deg)`}} transform-origin={`${parseFloat(style.width)/2} ${parseFloat(style.height)/2}`} className="mainAxes">
        {console.log(resultMainAxes)}
        {resultMainAxes.map(elem => {
          const id = uniqid();

          return <>
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
                  transform={`scale(1 -1) rotate(${-result.degree.value})`}
                  //transform={`scale(${shape.activeCase == 2 ? -1 : 1} -1)`}
                >
                  {elem.axisName}
                </text>
          </>
        })}

    </g>

  </g>
}

const StyledResultGroup = styled(ResultGroup)`
  path {
    stroke: black;
    vector-effect: non-scaling-stroke;
    stroke-width: 1
  }

  text {
    text-anchor: middle;
  }
`

export default StyledResultGroup;