import React, { useState } from "react";
import changeStatus from "../../javascript/changeStatusInList";
import uniqid from 'uniqid';
import { StyledSectionLi } from "./styledComponents";
import setSectionData from "../../javascript/setSectionData";


export default function AddRectangle({ saveShape }) {
  const [h, setH] = useState(100);
  const [b, setB] = useState(50);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  function drawRectangle() {
    const rectangle = {
      h: parseFloat(h),
      b: parseFloat(b),
      centerX,
      centerY,
      type: "rectangle",
      uniqid: uniqid()
    }

    const sectionInstance = setSectionData.call(rectangle, rectangle.centerX, rectangle.centerY, 0)

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return sectionInstance;
      }
      
      const path = sectionInstance.draw(relativeCenterX, relativeCenterY);

      svg.current.appendChild(path);

      return sectionInstance;
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