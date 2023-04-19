import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import calcScale from "../../javascript/calcScale";
import drawShapesArray, { drawCommonAxis } from "../../javascript/drawShapesArray";
import Axis from "./AxisComponent";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";

function SourceGroup({saveShape, arrayShapes, setViewBoxSize, useShapeDataForCirclesMode, showCoords, className, children}) {
  const [localArrayShapes, setLocalArrayShapes] = useState([]);
  const [scale, setScale] = useState(1);
  const [arrayAxes, setArrayAxes] = useState([])
  const sourceGroup = useRef(null);
  const shapesGroup = useRef(null);
  const objShapeData = useShapeDataForCirclesMode.getShapeData();

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
      {!arrayAxes.length ? null : arrayAxes.map((elem, id) => {
        return <g key={localArrayShapes[id].uniqid}>
          {elem.map(axisObj => <Axis elem={axisObj} scale={scale} localArrayShapes={localArrayShapes}/>)}
        </g>
      })}
    </g>

    <g ref={shapesGroup} className="shapes">
      {localArrayShapes.map((shape, id) => {
        return <g key={shape.uniqid} style={{transform: `rotate(${-shape.degree}deg)`, transformOrigin: `${shape.relativeCenterX}px ${shape.relativeCenterY}px`}}>
            <path style={{transform: `scale(${shape.activeCase == 2 ? -1 : 1}, -1)`, transformOrigin: `${shape.relativeCenterX}px ${shape.relativeCenterY}px`}} id={shape.uniqid} d={shape.d} className={shape.isActive ? "active" : ""} />
            {shape.coords.map((item, id) => {
              const rotateCoordsArr = createCirclesInSvg.shapeCollectObj[shape.uniqid]

              return <>
                <text
                  style={{visibility: showCoords ? "visible" : "hidden", transform: `scale(1, -1) rotate(${-shape.degree}deg)`, transformOrigin: `${shape.relativeCenterX+item.x}px ${shape.relativeCenterY+item.y}px`, fontSize: `${(16/scale)+2}px`}}
                  x={shape.relativeCenterX + item.x}
                  y={shape.relativeCenterY + item.y}
                >
                  {rotateCoordsArr[id].x}, {rotateCoordsArr[id].y}
                </text>

                {!objShapeData
                  ? null
                  : <circle onClick={() => {
                    objShapeData.shape.calcRelativeCenter(shape, id, objShapeData);
                    saveShape(objShapeData.shape);
                    useShapeDataForCirclesMode.changeShapeData();
                  }}
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

      &:active {
        stroke: red;
      }
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