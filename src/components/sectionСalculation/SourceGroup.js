import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import calcScale from "../../javascript/calcScale";
import drawShapesArray, { drawCommonAxis } from "../../javascript/drawShapesArray";
import Axis from "./AxisComponent";
import calcRotateCoords from "../../javascript/calcRotateCoords";

function SourceGroup({arrayShapes, setViewBoxSize, className, children, shapeDataForCirclesMode, setShapeDataForCirclesMode}) {
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
    <g className="commonAxes">
      {arrayAxes.map((elem, id) => {
        return <g key={localArrayShapes[id].uniqid}>
          {elem.map((axisObj, index) => {
          return <Axis elem={axisObj} scale={scale} activeCase={localArrayShapes[id].activeCase} localArrayShapes={localArrayShapes} />
        })}
        </g>
      })}
    </g>

    <g ref={shapesGroup} className="shapes">
      {localArrayShapes.map((shape, id) => {
        return <g key={shape.uniqid} style={{transform: `rotate(${-shape.degree}deg)`, transformOrigin: `${shape.relativeCenterX}px ${shape.relativeCenterY}px`}}>
            <path id={shape.uniqid} d={shape.d}/>
            {shape.coords.map(item => {
              let actualValueX = item.x;
              let actualValueY = item.y;

              if (shape.degree != 0) {
                const rotateCoordsObj = calcRotateCoords(item, shape.centerX, shape.centerY, shape.degree);
                actualValueX = rotateCoordsObj.rotateX;
                actualValueY = rotateCoordsObj.rotateY;
              }

              return <>
                <text
                  style={{transform: `scale(${shape.activeCase == 2 ? -1 : 1}, -1) rotate(${-shape.degree}deg)`, transformOrigin: `${shape.relativeCenterX+item.x}px ${shape.relativeCenterY+item.y}px`, fontSize: `${(16/scale)+2}px`}}
                  x={shape.relativeCenterX + item.x}
                  y={shape.relativeCenterY + item.y}
                >
                  {(shape.centerX + actualValueX).toFixed(1)}, {(shape.centerY + actualValueY).toFixed(1)}
                </text>

                {!shapeDataForCirclesMode
                  ? null
                  : <circle onClick={() => shapeDataForCirclesMode.shape.calcRelativeCenter(shape, {x: actualValueX, y: actualValueY}, shapeDataForCirclesMode)}
                      cx={shape.relativeCenterX + item.x} 
                      cy={shape.relativeCenterY + item.y} 
                      r="2" 
                    />
                }
              </>
            })}
        </g>
      })}
    </g>
  </g>
}

const StyledSourceGroup = styled(SourceGroup)`
  .shapes {
    & g,
    & text {
      transition-property: transform;
      transition-duration: 1s;
      transition-timing-function: linear;
    }

    path {
      fill-opacity: 0;
    }

    circle {
      fill: blue;
    }
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