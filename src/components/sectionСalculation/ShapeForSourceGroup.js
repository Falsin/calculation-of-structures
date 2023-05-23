import React from "react";
import { addShape, selectSpecificShape } from "../../redux/shapeCollectionSlice";
import { useDispatch, useSelector } from "react-redux";

import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import createDimensionalLine from "../../javascript/createDimensionalLine";
import { calcRelativeCenter, createD } from "../../javascript/sections/sectionsMethods";

export default React.memo(function ShapeComponent({ coordObj, showCoords, scale, useShapeDataForCirclesMode }) {
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
}, (prevProps, nextProps) => {

  return recCompare(prevProps, nextProps)
})

function recCompare(prevProps, nextProps) {
  if (typeof prevProps !== "object" && typeof prevProps !== "function") {
    return prevProps == nextProps;
  } else if (typeof prevProps == "object") {
    const conditionArray = Object.entries(prevProps).reduce((prev, [key, val]) => 
      [...prev, recCompare(val, nextProps[key])], []);
    return conditionArray.every(item => item == true);
  } else {
    return true;
  }
}