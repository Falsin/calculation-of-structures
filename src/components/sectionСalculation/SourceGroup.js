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
  const shapesGroup = useRef(null);
  const objShapeData = useShapeDataForCirclesMode.getShapeData();
  const [xLimits, setXLimits] = useState([0, 0]);
  const [yLimits, setYLimits] = useState([0, 0]);
  const [isVisible, setVisibleStatus] = useState(false);

  useEffect(() => {
    const { auxiliaryProps, sectionArr } = drawShapesArray(shapesGroup, arrayShapes);
    const checkXLimits = auxiliaryProps.xLimits.some((elem, id) => elem != xLimits[id]);
    const checkYLimits = auxiliaryProps.yLimits.some((elem, id) => elem != yLimits[id]);

    if (checkXLimits || checkYLimits) {
      setVisibleStatus(false);
      setXLimits(auxiliaryProps.xLimits);
      setYLimits(auxiliaryProps.yLimits);
    }
    setLocalArrayShapes(sectionArr);
  }, [arrayShapes])

  useEffect(() => {
    setScale(calcScale(shapesGroup));
    setViewBoxSize(shapesGroup.current);

    setArrayAxes(localArrayShapes.map((shape, id) => {
      return drawCommonAxis(shape, shapesGroup, id);
    }))
  }, [xLimits[0], xLimits[1], yLimits[0], yLimits[1]])


  useEffect(() => {
    setVisibleStatus(true);
  }, [arrayAxes])

  const axesList = !arrayAxes.length || !localArrayShapes.length ? null : arrayAxes.map((elem, id) => (
      <g key={localArrayShapes[id].uniqid}>
        {elem.map(axisObj => <Axis elem={axisObj} scale={scale} localArrayShapes={localArrayShapes}/>)}
      </g>
    ))

  const createText = (shape, item, rotateCoordsArr, id) => (
    <text
      style={{visibility: showCoords ? "visible" : "hidden", transform: `scale(1, -1) rotate(${-shape.degree}deg)`, transformOrigin: `${shape.relativeCenterX+item.x}px ${shape.relativeCenterY+item.y}px`, fontSize: `${(16/scale)+2}px`}}
      x={shape.relativeCenterX + item.x}
      y={shape.relativeCenterY + item.y}
    >
      {rotateCoordsArr[id].x}, {rotateCoordsArr[id].y}
    </text>
  )

  const createCircles = (shape, item, id) => (
    !objShapeData
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
  )

  const createDimensionalShapeLines = (shape) => {
    const coordControlPointForWidth = {...shape.coords[0]};
    coordControlPointForWidth.x += shape.relativeCenterX;
    coordControlPointForWidth.y += shape.relativeCenterY;

    const coordControlPointForHeight = {...shape.coords[shape.coords.length-1]};
    coordControlPointForHeight.x += shape.relativeCenterX;
    coordControlPointForHeight.y += shape.relativeCenterY;

    let degree = shape.degree;

    const width = createDimensionalLine(coordControlPointForWidth, shape.b, degree);
    const height = createDimensionalLine(coordControlPointForHeight, shape.h, degree, "vertical");

    return [width, height]
  }

  const createDimensionalLine = (coordObj, length, degree, orientation) => {
    const { x, y } = coordObj;

    if (degree/360%1*360 == 90 || degree/360%1*360 == 270) {
      degree = (orientation == "vertical") ? degree -= 90 : degree += 90
    }

    return <g style={{transformOrigin: `${x}px ${y}px`, transform: `rotate(${(orientation == "vertical") ? "90deg" : "0"})`}}>
      <path d={`M ${x-2} ${y+10} l ${length+4} ${0}`}/>

      <path d={`M ${x} ${y+2} l ${0} ${10}`}/>
      <path d={`M ${x+length} ${y+2} l ${0} ${10}`}/>

      <path d={`M ${x} ${y+8} l ${0} ${4}`} style={{transform: `rotate(-45deg)`, transformOrigin: `${x}px ${y+10}px`}}/>
      <path d={`M ${x+length} ${y+8} l ${0} ${4}`} style={{transform: `rotate(-45deg)`, transformOrigin: `${x+length}px ${y+10}px`}}/>

      <g style={{transformOrigin: `${x+length/2}px ${y+10}px`, transform: `rotate(${degree}deg)`}}>
        <text 
          style={{fontSize: `${(16/scale)+2}px`, transform: `scale(1, -1)`, transformOrigin: `${x+length/2}px ${y+12}px`}}
          x={x+length/2} 
          y={y+12}
        >
          {length}
        </text>
      </g>
    </g>
  }

  const shapeList = localArrayShapes.map(shape => {
    const rotateCoordsArr = createCirclesInSvg.shapeCollectObj[shape.uniqid];

    return <g key={shape.uniqid} style={{transform: `rotate(${-shape.degree}deg)`, transformOrigin: `${shape.relativeCenterX}px ${shape.relativeCenterY}px`}}>
      <path style={{transform: `scale(${shape.activeCase == 2 ? -1 : 1}, -1)`, transformOrigin: `${shape.relativeCenterX}px ${shape.relativeCenterY}px`}} id={shape.uniqid} d={shape.d} className={shape.isActive ? "active" : ""} />
      {shape.coords.map((item, id) => (
        <>
          {createText(shape, item, rotateCoordsArr, id)}
          {createCircles(shape, item, id)}
        </>
      ))}
      {createDimensionalShapeLines(shape).map(elem => elem)}
    </g>
  })

  return <g className={className} style={{visibility: isVisible ? "visible" : "hidden"}}>
    <g className="commonAxes">
      {axesList}
    </g>

    <g ref={shapesGroup} className="shapes">
      {shapeList}
    </g>
  </g>
}

const StyledSourceGroup = styled(SourceGroup)`
  .shapes {
    g,
    text {
      transition-property: transform;
      transition-duration: 1s;
      transition-timing-function: linear;
    }

    path {
      fill-opacity: 0;

      &.active {
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