import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { drawMainAxis } from "../../javascript/drawShapesArray";
import calcScale from "../../javascript/calcScale";
import Axis from "./AxisComponent";
import DimensionalAxesLines from "./DimensionalAxesLines";

function ResultGroup({className, children, arrayShapes, sourceGroup, result}) {
  const [scale, setScale] = useState(1);
  const [visibility, setVisibility] = useState("hidden")

  const axesArray = drawMainAxis(arrayShapes, sourceGroup, result);
  const justResultAxes = axesArray.filter(elem => elem.axisName != "V" && elem.axisName != "U");
  const resultMainAxes = axesArray.filter(elem => elem.axisName == "V" || elem.axisName == "U");

  const minXCoord = Math.min(...arrayShapes.map(obj => obj.relativeCenterX));
  const minYCoord = Math.min(...arrayShapes.map(obj => obj.relativeCenterY));

  useEffect(() => {
    setScale(calcScale(sourceGroup))
  }, [])

  useEffect(() => {
    setVisibility("visible")
  }, [scale])

  return <g style={{visibility: visibility}} className={className}>
    <g>
      {justResultAxes.map(elem => <Axis elem={elem} scale={scale}/>)}
      <DimensionalAxesLines arrayShapes={arrayShapes} justResultAxes={justResultAxes} scale={scale} />
    </g>
    <g style={{transform: `rotate(${!result ? 0 : -result.degree.value}deg)`}} transform-origin={`${minXCoord+result.centerOfGravity.value.Xc} ${minYCoord+result.centerOfGravity.value.Yc}`}>
      {resultMainAxes.map(elem => <Axis elem={elem} scale={scale} result={result}/>)}
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