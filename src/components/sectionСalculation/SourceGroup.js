import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import calcScale from "../../javascript/calcScale";
import drawShapesArray, { drawCommonAxis } from "../../javascript/drawShapesArray";
import Axis from "./AxisComponent";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import createDimensionalLine from "../../javascript/createDimensionalLine";
import { calcRelativeCenter, createD } from "../../javascript/sections/sectionsMethods";

import { addShape, selectAllShapes, selectSpecificShape } from "../../redux/shapeCollectionSlice";
import { useDispatch, useSelector } from "react-redux";

function SourceGroup({setViewBoxSize, useShapeDataForCirclesMode, showCoords, className}) {
  const [localArrayShapes, setLocalArrayShapes] = useState([]);
  const [scale, setScale] = useState(1);
  const [arrayAxes, setArrayAxes] = useState([])
  const shapesGroup = useRef(null);
  const [xLimits, setXLimits] = useState([0, 0]);
  const [yLimits, setYLimits] = useState([0, 0]);
  const [isVisible, setVisibleStatus] = useState(false);

  const arrayShapes = useSelector(state => selectAllShapes(state));

  const coordsArr = createCoordsArr();

  function createCoordsArr() {
    if (shapesGroup.current) {
      const { auxiliaryProps, sectionArr } = drawShapesArray(shapesGroup, arrayShapes);
      
      const checkXLimits = auxiliaryProps.xLimits.some((elem, id) => elem != xLimits[id]);
      const checkYLimits = auxiliaryProps.yLimits.some((elem, id) => elem != yLimits[id]);

      if (checkXLimits || checkYLimits) {
        setVisibleStatus(false);
        setXLimits(auxiliaryProps.xLimits);
        setYLimits(auxiliaryProps.yLimits);
      }

      return sectionArr;
    }
  }

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

  const shapeList = arrayShapes.map((shape, id) => 
    <ShapeComponent coordObj={coordsArr[id]} showCoords={showCoords} scale={scale} useShapeDataForCirclesMode={useShapeDataForCirclesMode} />
  )

  return <g className={className} style={{visibility: isVisible ? "visible" : "hidden"}}>
    <g className="commonAxes">
      {axesList}
    </g>

    <g ref={shapesGroup} className="shapes">
      {shapeList}
    </g>
  </g>
}

function ShapeComponent({ coordObj, showCoords, scale, useShapeDataForCirclesMode }) {
  const shape = useSelector(state => selectSpecificShape(state, coordObj.id));
  const dispatch = useDispatch();

  const objShapeData = useShapeDataForCirclesMode.getShapeData();

  const rotateCoordsArr = createCirclesInSvg.shapeCollectObj[shape.id];

  const createText = (item, rotateCoordsArr, id) => (
    <text
      style={{visibility: showCoords ? "visible" : "hidden", transform: `scale(1, -1) rotate(${-shape.degree}deg)`, transformOrigin: `${coordObj.relativeCenterX+item.x}px ${coordObj.relativeCenterY+item.y}px`, fontSize: `${(16/scale)+2}px`}}
      x={coordObj.relativeCenterX + item.x}
      y={coordObj.relativeCenterY + item.y}
    >
      {rotateCoordsArr[id].x}, {rotateCoordsArr[id].y}
    </text>
  )

  const createCircles = (item, id) => (
    !objShapeData
      ? null
      : <circle onClick={() => {
            const relativeCenter = calcRelativeCenter.call(objShapeData.shape, shape, id, objShapeData);
            objShapeData.shape.centerX = relativeCenter.centerX,
            objShapeData.shape.centerY = relativeCenter.centerY

            dispatch(addShape({
              ...shape,
              ...Object.assign(objShapeData.shape, relativeCenter)
            }))

            useShapeDataForCirclesMode.changeShapeData();
          }}
          cx={coordObj.relativeCenterX + item.x} 
          cy={coordObj.relativeCenterY + item.y} 
          r="2" 
        />
  )

  const createDimensionalShapeLines = (shape) => {
    const coordControlPointForWidth = {...shape.coords[0]};
    coordControlPointForWidth.x += coordObj.relativeCenterX;
    coordControlPointForWidth.y += coordObj.relativeCenterY;
    coordControlPointForWidth.length = shape.b;

    const coordControlPointForHeight = {...shape.coords[shape.coords.length-1]};
    coordControlPointForHeight.x += coordObj.relativeCenterX;
    coordControlPointForHeight.y += coordObj.relativeCenterY;
    coordControlPointForHeight.length = shape.h || shape.B || shape.b;

    if (shape.activeCase == 2) {
      coordControlPointForWidth.x -= shape.b;
      coordControlPointForHeight.x -= shape.b;
    }

    const degree = shape.degree;
    const dimensionalLineHeight = 10;

    const width = createDimensionalLine(coordControlPointForWidth, degree, dimensionalLineHeight, scale);
    const height = createDimensionalLine(coordControlPointForHeight, degree, dimensionalLineHeight, scale, "vertical");

    return [width, height]
  }

  return <g key={shape.id} style={{transform: `rotate(${-shape.degree}deg)`, transformOrigin: `${coordObj.relativeCenterX}px ${coordObj.relativeCenterY}px`}}>
      <path 
        style={{transform: `scale(${shape.activeCase == 2 ? -1 : 1}, -1)`, 
        transformOrigin: `${coordObj.relativeCenterX}px ${coordObj.relativeCenterY}px`}} 
        id={shape.id} 
        d={createD.call(Object.assign({}, shape, coordObj))} 
        className={shape.isActive ? "active" : ""} />
      {shape.coords.map((item, id) => (
        <>
          {createText(item, rotateCoordsArr, id)}
          {createCircles(item, id)}
        </>
      ))}
      {createDimensionalShapeLines(shape).map(elem => elem)}
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