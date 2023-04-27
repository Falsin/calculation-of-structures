import React, { useEffect, useRef, useState } from "react";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import drawShapesArray from "../../javascript/drawShapesArray";

export default function SectionComposition({ sourceGroup, arrayShapes, setArrayShapes, setFuncForSwitchActiveSection }) {
  const [selectedId, setSelectedId] = useState(null);
  const headline = useRef(null);

  const sectionNames = {
    beam: "Двутавр",
    channel: "Швеллер",
    equalAnglesCorner: "Равнополочный уголок",
    unequalAnglesCorner: "Неравнополочный уголок",
    rectangle: "Прямоугольное сечение"
  }

  useEffect(() => {
    changeActiveSection();

    if (selectedId) {
      setFuncForSwitchActiveSection(() => setSelectedId)
    }
  }, [selectedId])

  function changeActiveSection() {
    const activeSection = arrayShapes.find(elem => elem.isActive == true);

    if (activeSection) {
      activeSection.isActive = false;
    }

    const requiredSection = arrayShapes.find(elem => elem.uniqid == selectedId);

    if (requiredSection) {
      requiredSection.isActive = true;
    }

    if (activeSection || requiredSection) {
      const copyArr = arrayShapes.map(elem => elem);
      setArrayShapes(copyArr);
    }
  }

  function setActiveSection(uniqid, eventType) {
    if (!selectedId) {
      const requiredSection = arrayShapes.find(elem => elem.uniqid == uniqid);

      if (eventType == "mouseleave") {
        requiredSection.isActive = false;
      } else {
        requiredSection.isActive = true;
      }

      const copyArr = arrayShapes.map(elem => elem);
      setArrayShapes(copyArr);
    }
  }

  return (
    <ul>
      {arrayShapes.map(shape => {
        return (
          <li 
            style={{border: "solid 1px black"}} 
            onMouseEnter={(e) => setActiveSection(shape.uniqid, e.type)} 
            onMouseLeave={(e) => setActiveSection(shape.uniqid, e.type)}
            key={shape.uniqid}
          >
            <h3 ref={headline} className={selectedId == shape.uniqid ? "active" : ""} onClick={() => setSelectedId(shape.uniqid == selectedId ? null : shape.uniqid)}>
              {sectionNames[shape.type]}
            </h3>
            <Section sourceGroup={sourceGroup} arrayShapes={arrayShapes} shape={shape} setArrayShapes={setArrayShapes} />
        </li>
        )
      })}
    </ul>
  )
}

function Section({ sourceGroup, arrayShapes, shape, setArrayShapes }) {
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

      <button type="button" onClick={() => deleteSection()}>Удалить</button>
      <button onClick={() => changeSectionParams()} type="button" disabled={isSameValue()}>
        Изменить
      </button>
    </ul>
  )
}