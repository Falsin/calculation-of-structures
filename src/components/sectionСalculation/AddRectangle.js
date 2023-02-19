import React, { useState } from "react";
import styled from "styled-components";
import createTextCoords from "../../javascript/addCoordText";
import uniqid from 'uniqid';

function AddRectangle({ saveShape, className, children }) {
  const [h, setH] = useState(100);
  const [b, setB] = useState(50);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [isActive, setStatus] = useState(false);

  function drawRectangle() {
    const rectangleInstance = {
      h: parseFloat(h),
      b: parseFloat(b),
      centerX,
      centerY,
      type: "rectangle",
      degree: 0,
      uniqid: uniqid()
    }

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return rectangleInstance;
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const {h, b, degree} = rectangleInstance

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - b/2}, ${relativeCenterY - h/2} h ${b} v ${h} h ${-b} z`);
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1)`);

      svg.current.appendChild(path);

      const coords = [
        {x: -b/2, y: h/2},
        {x: b/2, y: h/2},
        {x: -b/2, y: -h/2},
        {x: b/2, y: -h/2}
      ]

      createTextCoords(arguments, coords, degree);
    }
  }

  return (
    <li className={className} onClick={() => setStatus(!isActive)}>
      <p>Прямоугольное сечение</p>

      <div className={isActive ? "active" : ""}>
        <label htmlFor="rectangleHeight">Высота (h):</label>
        <input id="rectangleHeight" onChange={(e) => setH(e.target.value)} value={h} />

        <label htmlFor="rectangleWidth">Ширина (b):</label>
        <input id="rectangleWidth" onChange={(e) => setB(e.target.value)} value={b} />
          
        <div>
          <p>Координаты</p>
          <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
          <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
        </div>

        <input type="button" value="Добавить" onClick={() => saveShape(drawRectangle())} />
      </div>
    </li>
  )
}

export const StyledAddRectangle = styled(AddRectangle)`
  p {
    margin: 0;
  }

  div div input {
    width: 40px;
  }

  & > div {
    overflow: hidden;
    max-height: 0;
    padding: 0;
    transition: 0.6s;

    &.active {
      max-height: 1000px;
      margin-top: 10px;
    }
  }
`