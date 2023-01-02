import React, { useState } from "react";
import styled from "styled-components";

function AddChannel({ draw, className, children }) {
  const [height, setHeight] = useState(50);
  const [width, setWidth] = useState(32);
  const [s, setS] = useState(4.4);
  const [t, setT] = useState(7);

  function drawChannel(ctx, currentX, currentY) {
    ctx.save();
    ctx.translate(-width/2, -height/2);

    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX += width, currentY);
    ctx.lineTo(currentX, currentY += t);
    ctx.lineTo(currentX -= width-s, currentY);
    ctx.lineTo(currentX, currentY += height-2*t);
    ctx.lineTo(currentX += width-s, currentY);
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
      <p>Швеллер</p>

      <label htmlFor="channelHeight">Высота (h):</label>
      <input id="channelHeight" onChange={(e) => convertToNumber(e, setHeight)} /* value={height} */ defaultValue={50} />

      <label htmlFor="channelWidth">Ширина полки (b):</label>
      <input id="channelWidth" onChange={(e) => convertToNumber(e, setWidth)} /* value={width} */ defaultValue={50} />

      <label htmlFor="channelS">Толщина стенки (s):</label>
      <input id="channelS" onChange={(e) => convertToNumber(e, setS)} /* value={s} */ defaultValue={50} />

      <label htmlFor="channelT">Толщина полки (t):</label>
      <input id="channelT" onChange={(e) => convertToNumber(e, setT)} /* value={t} */ defaultValue={50} />
        
      <input type="button" value="Добавить" onClick={() => draw(drawChannel)} />
    </li>
  )
}

export const StyledAddChannel = styled(AddChannel)`
  label, input {
    display: block;
  }
`