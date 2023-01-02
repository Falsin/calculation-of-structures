import React, { useState } from "react";
import styled from "styled-components";

function AddCorner({ draw, className, children }) {
  const [width, setWidth] = useState(20);
  const [t, setT] = useState(3);

  function drawCorner(ctx, currentX, currentY) {
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
        
      <input type="button" value="Добавить" onClick={() => draw(drawCorner)} />
    </li>
  )
}

export const StyledAddCorner = styled(AddCorner)`
  label, input {
    display: block;
  }
`