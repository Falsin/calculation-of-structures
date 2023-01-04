import React, { useState } from "react";
import styled from "styled-components";

function AddCorner({ saveShape, className, children }) {
  const [width, setWidth] = useState(20);
  const [t, setT] = useState(3);
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);

  function drawCorner(width, t, coordX, coordY) {
    return function (ctx) {
      if (ctx === undefined) {
        return { width, t, coordX, coordY }
      }

      let currentX = coordX;
      let currentY = coordY;

      ctx.save();
      ctx.translate(-width/2, -width/2);

      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(currentX += t, currentY);
      ctx.lineTo(currentX, currentY += width-t);
      ctx.lineTo(currentX += width-t, currentY);
      ctx.lineTo(currentX, currentY += t);
      ctx.lineTo(currentX -= width, currentY);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }
  }

  function convertToNumber(e, setState) {
    const value = e.target.value;
    setState((value[value.length - 1] === ".") ? value : parseFloat(value))
  }

  return (
    <li className={className}>
      <p>Уголок</p>

      <label htmlFor="cornerWidth">Ширина полки (b):</label>
      <input id="cornerWidth" onChange={(e) => convertToNumber(e, setWidth)} /* value={width} */ defaultValue={20} />

      <label htmlFor="cornerT">Толщина полки (t):</label>
      <input id="cornerT" onChange={(e) => convertToNumber(e, setT)} /* value={t} */ defaultValue={3} />
        
      <div>
        <p>Координаты</p>
        <label>x <input value={coordX} onChange={(e) => convertToNumber(e, setCoordX)} /></label>
        <label>y <input value={coordY} onChange={(e) => convertToNumber(e, setCoordY)} /></label>
      </div>

      <input type="button" value="Добавить" onClick={() => saveShape(drawCorner(width, t, coordX, coordY))} />
    </li>
  )
}

export const StyledAddCorner = styled(AddCorner)`
  label, input {
    display: block;
  }
`