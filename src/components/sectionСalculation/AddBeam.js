import React, { useEffect, useState } from "react";

export default function AddBeam({draw}) {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [s, setS] = useState("");
  const [t, setT] = useState("");

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
    if (e.target.value[e.target.value.length - 1] === ".") {
      setState(e.target.value)
    } else {
      setState(parseFloat(e.target.value))
    }
  }

  return (
    <li>
      <p>Двутавр</p>
      <label htmlFor="beamHeight">Высота (h):</label>
      <input id="beamHeight" onChange={(e) => convertToNumber(e, setHeight)} value={height} />

      <label htmlFor="beamWidth">Ширина полки (b):</label>
      <input id="beamWidth" onChange={(e) => convertToNumber(e, setWidth)} value={width} />

      <label htmlFor="beamS">Толщина стенки (s):</label>
      <input id="beamS" onChange={(e) => convertToNumber(e, setS)} value={s} />

      <label htmlFor="beamT">Толщина полки (t):</label>
      <input id="beamT" onChange={(e) => convertToNumber(e, setT)} value={t} />
        
      <input type="button" value="Добавить" onClick={(e) => {
        e.preventDefault();
        draw(drawBeam)
      }} />
    </li>
  )
}