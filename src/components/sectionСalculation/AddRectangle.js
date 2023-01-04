import React, { useState } from "react";
import styled from "styled-components";

function AddRectangle({ saveShape, className, children }) {
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(50);
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);

  function drawRectangle(width, height, coordX, coordY) {
    return function (ctx) {
      if (ctx === undefined) {
        return { width, height, coordX, coordY }
      }

      let currentX = coordX;
      let currentY = coordY;

      ctx.save();

      ctx.translate(-width/2, -height/2);
      ctx.strokeRect(currentX, currentY, width, height);

      ctx.fillText(`(${currentX}, ${currentY})`, currentX-10, currentY-5);
      ctx.fillText(`(${currentX+width}, ${currentY})`, currentX+width-10, currentY-5);
      ctx.fillText(`(${currentX}, ${currentY+height})`, currentX-10, currentY+height+10);
      ctx.fillText(`(${currentX+width}, ${currentY+height})`, currentX+width-15, currentY+height+10);

      ctx.restore();
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
  label, input {
    display: block;
  }
`