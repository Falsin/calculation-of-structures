import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import calcScale from "../../javascript/calcScale";
import drawShapesArray, { drawCommonAxis } from "../../javascript/drawShapesArray";
import Axis from "./AxisComponent";

import { selectAllShapes } from "../../redux/shapeCollectionSlice";
import { useSelector } from "react-redux";
import ShapeComponent from "./ShapeForSourceGroup";

function SourceGroup({setViewBoxSize, useShapeDataForCirclesMode, showCoords, className}) {
  const [scale, setScale] = useState(1);
  const [arrayAxes, setArrayAxes] = useState([])
  const shapesGroup = useRef(null);
  const [bottomYLimit, setBottomYLimit] = useState(0);
  const [leftXLimit, setLeftXLimit] = useState(0);
  const visible = useRef(false);
 
  const arrayShapes = useSelector(state => selectAllShapes(state));

  const coordsArr = createCoordsArr();

  function createCoordsArr() {
    if (arrayShapes.length) {
      const { auxiliaryProps, sectionArr } = drawShapesArray(shapesGroup, arrayShapes);

      if (auxiliaryProps.bottomYLimit != bottomYLimit && auxiliaryProps.leftXLimit != leftXLimit) {
        visible.current = false;
        setBottomYLimit(auxiliaryProps.bottomYLimit);
        setLeftXLimit(auxiliaryProps.leftXLimit);
      }

      return sectionArr;
    }
    return [];
  }

  useEffect(() => {
    setScale(arrayShapes.length ? calcScale(shapesGroup) : scale);
    setViewBoxSize(shapesGroup.current);

    setArrayAxes(coordsArr.map((shape, id) => 
      drawCommonAxis(shape, shapesGroup, id)
    ))

    visible.current = true;
  }, [bottomYLimit, leftXLimit])

  const axesList = !arrayAxes.length ? null : arrayAxes.map((elem, id) => 
    <g key={arrayShapes[id].id}>
      {elem.map((axisObj, id) => <Axis elem={axisObj} key={id} scale={scale} localArrayShapes={arrayShapes}/>)}
    </g>
  )

  const shapeList = arrayShapes.map((shape, id) => 
    <ShapeComponent key={shape.id} coordObj={coordsArr[id]} showCoords={showCoords} scale={scale} useShapeDataForCirclesMode={useShapeDataForCirclesMode} />
  )

  return <g className={className} style={{visibility: visible.current ? "visible" : "hidden"}}>
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