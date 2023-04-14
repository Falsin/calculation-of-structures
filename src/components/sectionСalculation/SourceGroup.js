import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import calcScale from "../../javascript/calcScale";
import drawShapesArray, { drawCommonAxis } from "../../javascript/drawShapesArray";
import Axis from "./AxisComponent";

function SourceGroup({arrayShapes, setViewBoxSize, className, children}) {
  const [localArrayShapes, setLocalArrayShapes] = useState([]);
  const [scale, setScale] = useState(1);
  const [arrayAxes, setArrayAxes] = useState([])
  const sourceGroup = useRef(null);
  const shapesGroup = useRef(null);

  useEffect(() => {
    sourceGroup.current.setAttributeNS(null, "visibility", "hidden");
    setLocalArrayShapes(drawShapesArray(shapesGroup, arrayShapes));
  }, [arrayShapes.length])

  useEffect(() => {
    setScale(calcScale(shapesGroup));
    setViewBoxSize(shapesGroup.current);
    setArrayAxes(localArrayShapes.map((shape, id) => {
      return drawCommonAxis(shape, shapesGroup, scale, id);
    }))
  }, [localArrayShapes.length])

  useEffect(() => {
    sourceGroup.current.setAttributeNS(null, "visibility", "visible");
  }, [scale])

  return <g ref={sourceGroup} className={className}>
    <g ref={shapesGroup} className="shapes">
      {localArrayShapes.map((shape, id) => {
        return <g key={shape.uniqid} transform-origin={`${shape.relativeCenterX} ${shape.relativeCenterY}`} transform={`rotate(${-shape.degree})`}>
            <path id={shape.uniqid} d={shape.d}/>

            {shape.coords.map(item => {
              console.log("hello1")
              return <text
                fontSize={`${(16/scale)+2}`}
                transform-origin={`${shape.relativeCenterX+item.x} ${shape.relativeCenterY+item.y}`}
                transform={`scale(${shape.activeCase == 2 ? -1 : 1} -1) rotate(${-shape.degree})`}
                x={shape.relativeCenterX + item.x}
                y={shape.relativeCenterY + item.y}
              >
                {(shape.centerX + item.x).toFixed(1)}, {(shape.centerY + item.y).toFixed(1)}
              </text>
            })}
        </g>
      })}
    </g>

    <g className="commonAxes">
      {arrayAxes.map((elem, id) => {
        return <g key={localArrayShapes[id].uniqid}>
          {elem.map((axisObj, index) => {
          return <Axis elem={axisObj} scale={scale} activeCase={localArrayShapes[id].activeCase} localArrayShapes={localArrayShapes} />
        })}
        </g>
      })}
    </g>
  </g>
}

const StyledSourceGroup = styled(SourceGroup)`
  .shapes path {
    fill: white;
  }
    
  path {
    stroke: black;
    vector-effect: non-scaling-stroke;
    stroke-width: 1
  }

  text {
    text-anchor: middle;
  }
`

export default StyledSourceGroup;