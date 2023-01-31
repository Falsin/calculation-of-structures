import React, { useState } from "react";
import styled from "styled-components";

function AddRectangle({ saveShape, className, children }) {
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(50);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  function drawRectangle(b, h, coordX, coordY) {
    const rectangleInstance = {
      height: parseFloat(height),
      width: parseFloat(width),
      centerX,
      centerY,
      type: "rectangle",
    }

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return rectangleInstance;
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const {height, width} = rectangleInstance

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - width/2}, ${relativeCenterY - height/2} h ${width} v ${height} h ${-width} z`);
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1)`);

      svg.current.appendChild(path);
    }
  }

  return (
    <li className={className}>
      <p>Прямоугольное сечение</p>

      <label htmlFor="rectangleHeight">Высота (h):</label>
      <input id="rectangleHeight" onChange={(e) => setHeight(e.target.value)} value={height} />

      <label htmlFor="rectangleWidth">Ширина (b):</label>
      <input id="rectangleWidth" onChange={(e) => setWidth(e.target.value)} value={width} />
        
      <div>
        <p>Координаты</p>
        <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
        <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
      </div>

      <input type="button" value="Добавить" onClick={() => saveShape(drawRectangle())} />
    </li>
  )
}

export const StyledAddRectangle = styled(AddRectangle)`
  div input {
    width: 40px;
  }
`