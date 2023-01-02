import React, { useState } from "react";
import styled from "styled-components";

function AddBeam({ draw, className, children }) {
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(55);
  const [s, setS] = useState(4.1);
  const [t, setT] = useState(5.7);

  function drawBeam(ctx, currentX, currentY) {
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX += width, currentY);
    ctx.lineTo(currentX, currentY += t);
    ctx.lineTo(currentX -= (width - s)/2, currentY);
    ctx.lineTo(currentX, currentY += (height - 2*t));
    ctx.lineTo(currentX += (width - s)/2, currentY);
    ctx.lineTo(currentX, currentY += t);
    ctx.lineTo(currentX -= width, currentY);
    ctx.lineTo(currentX, currentY -= t);
    ctx.lineTo(currentX += (width - s)/2, currentY);
    ctx.lineTo(currentX, currentY -= (height - 2*t));
    ctx.lineTo(currentX -= (width - s)/2, currentY);
    ctx.closePath();
    ctx.stroke();
  }

  function convertToNumber(e, setState) {
    const value = e.target.value;
    setState((value[value.length - 1] === ".") ? value : parseFloat(value))
  }

  return (
    <li className={className}>
      <p>Двутавр</p>

      <label htmlFor="beamHeight">Высота (h):</label>
      <input id="beamHeight" onChange={(e) => convertToNumber(e, setHeight)} /* value={height} */ defaultValue={100} />

      <label htmlFor="beamWidth">Ширина полки (b):</label>
      <input id="beamWidth" onChange={(e) => convertToNumber(e, setWidth)} /* value={width} */ defaultValue={55} />

      <label htmlFor="beamS">Толщина стенки (s):</label>
      <input id="beamS" onChange={(e) => convertToNumber(e, setS)} /* value={s} */ defaultValue={4.1} />

      <label htmlFor="beamT">Толщина полки (t):</label>
      <input id="beamT" onChange={(e) => convertToNumber(e, setT)} /* value={t} */ defaultValue={5.7} />
        
      <input type="button" value="Добавить" onClick={() => draw(drawBeam)} />
    </li>
  )
}

export const StyledAddBeam = styled(AddBeam)`
  label, input {
    display: block;
  }
`