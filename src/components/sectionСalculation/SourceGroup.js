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
    return [];
  }

  useEffect(() => {
    setScale(calcScale(shapesGroup));
    setViewBoxSize(shapesGroup.current);

    setArrayAxes(coordsArr.map((shape, id) => 
      drawCommonAxis(shape, shapesGroup, id)
    ))
  }, [xLimits[0], xLimits[1], yLimits[0], yLimits[1]])

  useEffect(() => {
    setVisibleStatus(true);
  }, [scale])

  const axesList = !arrayAxes.length || !arrayShapes.length ? null : arrayAxes.map((elem, id) => (
      <g key={arrayShapes[id].uniqid}>
        {elem.map(axisObj => <Axis elem={axisObj} scale={scale} localArrayShapes={arrayShapes}/>)}
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