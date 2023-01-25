import React, { useState } from "react";
import styled from "styled-components";

function AddRectangle({ saveShape, className, children }) {
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(50);
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);

  function drawRectangle(b, h, coordX, coordY) {
    return function (svg, startPointX, startPointY) {
      if (svg === undefined) {
        return { b, h, coordX, coordY, type: "rectangle" }
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const currentX = startPointX + coordX;
      const currentY = startPointY + coordY;

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${currentX}, ${currentY} h ${b} v ${h} h ${-b} z`);
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");

      svg.current.appendChild(path);
    }
  }

  function convertToNumber(e, setState) {
    const value = e.target.value;
    setState((value[value.length - 1] === ".") ? value : parseFloat(value))
  }

  return (
    <li className={className}>
      <p>Прямоугольное сечение</p>

      <label htmlFor="rectangleHeight">Высота (h):</label>
      <input id="rectangleHeight" onChange={(e) => convertToNumber(e, setHeight)} /* value={height} */ defaultValue={100} />

      <label htmlFor="rectangleWidth">Ширина (b):</label>
      <input id="rectangleWidth" onChange={(e) => convertToNumber(e, setWidth)} /* value={width} */ defaultValue={50} />
        
      <div>
        <p>Координаты</p>
        <label>x <input value={coordX} onChange={(e) => convertToNumber(e, setCoordX)} /></label>
        <label>y <input value={coordY} onChange={(e) => convertToNumber(e, setCoordY)} /></label>
      </div>

      <input type="button" value="Добавить" onClick={() => saveShape(drawRectangle(width, height, coordX, coordY))} />
    </li>
  )
}

export const StyledAddRectangle = styled(AddRectangle)`
  div input {
    width: 40px;
  }
`