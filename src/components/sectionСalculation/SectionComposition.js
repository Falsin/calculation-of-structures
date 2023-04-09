import React, { useEffect, useRef, useState } from "react";

export default function SectionComposition({arrayShapes, setArrayShapes}) {
  const [selectedId, setSelectedId] = useState(null);
  const healine = useRef(null);

  const sectionNames = {
    beam: "Двутавр",
    channel: "Швеллер",
    equalAnglesCorner: "Равнополочный уголок",
    unequalAnglesCorner: "Неравнополочный уголок",
    rectangle: "Прямоугольное сечение"
  }

  useEffect(() => {
    changeActiveSection()
  }, [selectedId])

  useEffect(() => {
    const config = { attributes: true };
    const callback = (mutationList) => {
      console.log("hello")
      for (const mutation of mutationList) {
        if (mutation.type == "attributes") {
          if (mutation.attributeName == "class" && !healine.current.className) {
            setSelectedId(null)
          }
        }
      }
    }

    const observer = new MutationObserver(callback);

    observer.observe(healine.current, config);
  })

  function changeActiveSection() {
    const shapes = arrayShapes.map(elem => elem());

    const activeSection = shapes.find(elem => elem.isActive == true);

    if (activeSection) {
      activeSection.isActive = false;
    }

    const requiredSection = shapes.find(elem => elem.uniqid == selectedId);

    if (requiredSection) {
      requiredSection.isActive = true;
    }

    if (activeSection || requiredSection) {
      const copyArr = arrayShapes.map(elem => elem);
      setArrayShapes(copyArr);
    }
  }

  function setActiveSection(uniqid, eventType) {
    const shapes = arrayShapes.map(elem => elem());

    if (!selectedId) {
      const requiredSection = shapes.find(elem => elem.uniqid == uniqid);

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
      {arrayShapes.map(elem => {
        const shape = elem();

        return (
          <li 
            style={{border: "solid 1px black"}} 
            onMouseEnter={(e) => setActiveSection(shape.uniqid, e.type)} 
            onMouseLeave={(e) => setActiveSection(shape.uniqid, e.type)}
            key={shape.uniqid}
          >
            <h3 ref={healine} className={selectedId == shape.uniqid ? "active" : ""} onClick={() => setSelectedId(shape.uniqid == selectedId ? null : shape.uniqid)}>
              {sectionNames[shape.type]}
            </h3>
            <Section arrayShapes={arrayShapes} shape={shape} setArrayShapes={setArrayShapes} />
        </li>
        )
      })}
    </ul>
  )
}

function Section({ arrayShapes, shape, setArrayShapes }) {
  const [centerX, setCenterX] = useState(shape.centerX);
  const [centerY, setCenterY] = useState(shape.centerY);
  const [degree, setDegree] = useState(shape.degree);

  const keysObj = {
    centerX: (value) => setCenterX(value),
    centerY: (value) => setCenterY(value),
    degree: (value) => setDegree(value)
  }

  function isSameValue() {
    return centerX == shape.centerX && centerY == shape.centerY && degree == shape.degree;
  }

  function changeSectionParams() {
    shape.centerX = +centerX;
    shape.centerY = +centerY;
    shape.degree = (degree) ? shape.degree + +degree : 0;
    const newArr = arrayShapes.map(elem => elem);
    setArrayShapes(newArr)
    setCenterX(shape.centerX)
    setCenterY(shape.centerY)
    setDegree(shape.degree)
  }

  const increaseDegree = () => setDegree((degree == 270) ? 0 : degree + 90);

  function deleteSection() {
    const filteredArray = arrayShapes.filter(func => func().uniqid != shape.uniqid);
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
                  <input onChange={(e) => func(e.target.value)} value={degree}/>
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