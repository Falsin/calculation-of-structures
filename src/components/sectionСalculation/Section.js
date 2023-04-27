import React, { useState } from "react";
import drawShapesArray from "../../javascript/drawShapesArray";

export default function Section({ sourceGroup, arrayShapes, shape, setArrayShapes }) {
  const [centerX, setCenterX] = useState(shape.centerX);
  const [centerY, setCenterY] = useState(shape.centerY);
  const [degree, setDegree] = useState(shape.degree);

  const keysObj = {
    centerX: (value) => setCenterX(value),
    centerY: (value) => setCenterY(value),
    degree: (value) => setDegree(value)
  }

  function isSameValue() {
    return centerX == shape.centerX && centerY == shape.centerY && +degree/360%1*360 == shape.degree;
  }

  function changeSectionParams() {
    shape.centerX = +centerX;
    shape.centerY = +centerY;
    shape.degree = +degree;

    setArrayShapes(drawShapesArray(sourceGroup, arrayShapes).sectionArr);
    setCenterX(shape.centerX);
    setCenterY(shape.centerY);
  }

  const increaseDegree = () => setDegree(degree + 90);

  function deleteSection() {
    const filteredArray = arrayShapes.filter(section => section.uniqid != shape.uniqid);
    setArrayShapes(filteredArray)
  }

  return (
    <div>
      <ul>
        {Object.entries(keysObj).map(([key, func]) => (
          <li>
            <label style={{display: "block"}} >{key}
              {key != "degree" 
                ? <input onChange={(e) => func(e.target.value)} defaultValue={shape[key]}/>
                : <>
                    <input onChange={(e) => func(e.target.value)} value={degree/360%1*360} readOnly/>
                    <button typeof="button" onClick={() => increaseDegree()} type="button">Повернуть на 90 градусов</button>
                  </>
              } 
            </label>
          </li>
        ))}
      </ul>
      
      <button type="button" onClick={() => deleteSection()}>Удалить</button>
      <button onClick={() => changeSectionParams()} type="button" disabled={isSameValue()}>
        Изменить
      </button>
    </div>
  )
}