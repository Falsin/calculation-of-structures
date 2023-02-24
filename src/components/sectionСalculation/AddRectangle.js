import React, { useState } from "react";
import createTextCoords from "../../javascript/addCoordText";
import changeStatus from "../../javascript/changeStatusInList";
import uniqid from 'uniqid';
import { StyledSectionLi } from "./styledComponents";

export default function AddRectangle({ saveShape }) {
  const [h, setH] = useState(100);
  const [b, setB] = useState(50);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

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
      path.setAttributeNS(null, "id", `${rectangleInstance.uniqid}`);

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
    <StyledSectionLi>
      <h3 onClick={(e) => changeStatus(e)}>Прямоугольное сечение</h3>

      <div>
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
    </StyledSectionLi>
  )
}