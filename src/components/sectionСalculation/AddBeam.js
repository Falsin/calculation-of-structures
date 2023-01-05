import React, { useState } from "react";
import styled from "styled-components";

function AddBeam({ saveShape, className, children }) {
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(55);
  const [s, setS] = useState(4.5);
  const [t, setT] = useState(7.2);
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);

  function drawBeam(height, width, s, t, coordX, coordY) {
    const that = this;
    return function (svg, startPointX, startPointY) {
      if (svg === undefined) {
        return { height, width, s, t, coordX, coordY, type: "beam", square: 10.32, ix: 198 }
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const currentX = startPointX + coordX;
      const currentY = startPointY + coordY;

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${currentX}, ${currentY} h ${width} v ${t} h -${(width - s)/2} v ${height-2*t} h ${(width - s)/2} v ${t} h -${width} v -${t} h ${(width - s)/2} v -${height - 2*t} h -${(width - s)/2} z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform", `translate(-${width/2}, -${height/2})`);

      svg.current.appendChild(path);

      const coords = [
        {x: coordX, y: coordY}, 
        {x: coordX + width, y: coordY},
        {x: coordX + width, y: coordY + height},
        {x: coordX, y: coordY + height},
      ]

      coords.forEach(item => {
        const text = document.createElementNS(xmlns, "text");
        text.setAttributeNS(null, "x", `${startPointX + item.x - width/2}`);
        text.setAttributeNS(null, "y", `${startPointY + item.y - height/2}`);
        text.setAttributeNS(null, "font-size", "10px");
        text.textContent = `(${item.x}, ${item.y})`;
        svg.current.appendChild(text)
      })
    }
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
      <input id="beamS" onChange={(e) => convertToNumber(e, setS)} /* value={s} */ defaultValue={4.5} />

      <label htmlFor="beamT">Толщина полки (t):</label>
      <input id="beamT" onChange={(e) => convertToNumber(e, setT)} /* value={t} */ defaultValue={7.2} />

      <div>
        <p>Координаты</p>
        <label>x <input value={coordX} onChange={(e) => convertToNumber(e, setCoordX)} /></label>
        <label>y <input value={coordY} onChange={(e) => convertToNumber(e, setCoordY)} /></label>
      </div>
        
      <input type="button" value="Добавить" onClick={() => saveShape(drawBeam(height, width, s, t, coordX, coordY))} />
    </li>
  )
}

export const StyledAddBeam = styled(AddBeam)`
  & > label, & > input {
    display: block;
  }

  div input {
    width: 40px;
  }
`