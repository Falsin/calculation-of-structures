import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectSpecificShape, updateShape, removeShape } from "../../redux/shapeCollectionSlice";

export default function Section({ shapeId, useSelectedId }) {
  const shape = useSelector(state => selectSpecificShape(state, shapeId));

  const [centerX, setCenterX] = useState(shape.centerX);
  const [centerY, setCenterY] = useState(shape.centerY);
  const [degree, setDegree] = useState(shape.degree);

  const dispatch = useDispatch();

  useEffect(() => {
    if (useSelectedId.getSelectedId != shapeId && shape.isActive) {
      changeShapeActiveStatus(false);
    } else if (useSelectedId.getSelectedId == shapeId && !shape.isActive) {
      changeShapeActiveStatus(true);
    }
  }, [useSelectedId.getSelectedId])

  const setActiveShape = (eventType) => {
    if (!useSelectedId.getSelectedId) {
      if (eventType == "mouseleave") {
        changeShapeActiveStatus(false);
      } else {
        changeShapeActiveStatus(true);
      }
    }
  }

  const changeShapeActiveStatus = (activeStatus) => {
    dispatch(updateShape({
      id: shapeId,
      changes: {
        isActive: activeStatus
      }
    }))
  }

  const sectionNames = {
    beam: "Двутавр",
    channel: "Швеллер",
    equalAnglesCorner: "Равнополочный уголок",
    unequalAnglesCorner: "Неравнополочный уголок",
    rectangle: "Прямоугольное сечение"
  }

  const keysObj = {
    centerX: (value) => setCenterX(value),
    centerY: (value) => setCenterY(value),
    degree: (value) => setDegree(value)
  }

  function isSameValue() {
    return centerX == shape.centerX && centerY == shape.centerY && +degree/360%1*360 == shape.degree;
  }

  function changeSectionParams() {
    dispatch(updateShape({
      id: shapeId,
      changes: {
        centerX: +centerX,
        centerY: +centerY,
        degree: +degree
      }
    }))
  }

  const increaseDegree = () => setDegree(degree + 90);

  function deleteSection() {
    dispatch(removeShape(shapeId))
  }

  const valueList = <ul>
    {Object.entries(keysObj).map(([key, func]) => (
      <li>
        <label>{key}
          {key != "degree" 
            ? <input onChange={(e) => func(e.target.value)} defaultValue={shape[key]}/>
            : <>
                <input onChange={(e) => func(e.target.value)} value={degree/360%1*360} readOnly/>
                <button type="button" onClick={() => increaseDegree()}>Повернуть на 90 градусов</button>
              </>
          } 
        </label>
      </li>
    ))}
  </ul>

  return (
    <li onMouseEnter={(e) => setActiveShape(e.type)} onMouseLeave={(e) => setActiveShape(e.type)}>
      <h3 onClick={() => useSelectedId(shapeId)} className={useSelectedId.getSelectedId == shapeId ? "active" : ""}>
        {sectionNames[shape.type]}
      </h3>

      <div>
        {valueList}
        
        <button type="button" onClick={() => deleteSection()}>Удалить</button>
        <button type="button" onClick={() => changeSectionParams()} disabled={isSameValue()}>
          Изменить
        </button>
      </div>
    </li>
  )
}

const StyledSection = styled(Section)`
  label {
    display: block;
  }
`