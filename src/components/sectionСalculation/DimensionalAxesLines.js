import React from "react";

import createDimensionalLine from "../../javascript/createDimensionalLine";

export default function DimensionalAxesLines({ arrayShapes, justResultAxes, scale }) {
  const { horizontalDimensionalLinesData, verticalDimensionalLinesData } = createDimensionalLinesData();

  const horizontalDimensionalLines = horizontalDimensionalLinesData.map((elem, id) => {
    let heightHorizontalDimensionalLine = -(4 + Math.floor(id/2)*10);

    return createDimensionalLine(elem, elem.length, 0, heightHorizontalDimensionalLine, scale)
  })

  const verticalDimensionalLinesDatalLines = verticalDimensionalLinesData.map((elem, id) => {
    let heightVerticalDimensionalLine = 4 + Math.floor(id/2)*10;

    return createDimensionalLine(elem, elem.length, 0, heightVerticalDimensionalLine, scale, "vertical")
  })

  function createDimensionalLinesData() {
    const coordsYc = justResultAxes.find(axis => axis.axisName == "Yc");
    const coordsXc = justResultAxes.find(axis => axis.axisName == "Xc");

    const horizontalDimensionalLinesData = createDataArr({y: coordsYc.y1+10, coordsYc, coordsXc});
    const verticalDimensionalLinesData = createDataArr({x: coordsXc.x1+10, coordsYc, coordsXc, orientation: "vetical"});
    
    return { horizontalDimensionalLinesData, verticalDimensionalLinesData };
  }

  function createDataArr({ x, y, coordsYc, coordsXc, orientation }) {
    const dimensionalLinesData = arrayShapes.reduce((prev, curr) => {
    const length = !orientation 
      ? +(Math.max(curr.relativeCenterX, coordsYc.x1) - Math.min(curr.relativeCenterX, coordsYc.x1)).toFixed(2)
      : +(Math.max(curr.relativeCenterY, coordsXc.y1) - Math.min(curr.relativeCenterY, coordsXc.y1)).toFixed(2);

      if (length > 0) {
        return [...prev, {
          x: x ? x : Math.min(curr.relativeCenterX, coordsYc.x1),
          y: y ? y : Math.min(curr.relativeCenterY, coordsXc.y1),
          length: length
        }]
      } else {
        return prev;
      }
    }, [])

    dimensionalLinesData.sort((a, b) => a.length - b.length);
    return dimensionalLinesData;
  }

  return <g>
    {horizontalDimensionalLines}
    {verticalDimensionalLinesDatalLines}
  </g>
}