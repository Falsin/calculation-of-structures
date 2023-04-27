import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import changeStatus from "../../javascript/changeStatusInList";
import Section from "./Section";

function SectionComposition({ sourceGroup, arrayShapes, setArrayShapes, useFuncForSwitchActiveSection, children, className }) {
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
      useFuncForSwitchActiveSection(() => setSelectedId)
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

  const sectionList = <ul>
    {arrayShapes.map(shape => (
      <li 
        onMouseEnter={(e) => setActiveSection(shape.uniqid, e.type)} 
        onMouseLeave={(e) => setActiveSection(shape.uniqid, e.type)}
        key={shape.uniqid}
      >
        <h3 ref={headline} className={selectedId == shape.uniqid ? "active" : ""} onClick={() => setSelectedId(shape.uniqid == selectedId ? null : shape.uniqid)}>
          {sectionNames[shape.type]}
        </h3>
        <Section sourceGroup={sourceGroup} arrayShapes={arrayShapes} shape={shape} setArrayShapes={setArrayShapes} />
      </li>
    ))}
  </ul>

  return (
    <li className={className}>
      <h2 onClick={(e) => changeStatus(e, useFuncForSwitchActiveSection())}>Состав сечения ({arrayShapes.length})</h2>
      {!arrayShapes.length ? <p>Не добавлено ни одного сечения</p> : <div>{sectionList}</div>}
    </li>
  )
}

const StyledSectionComposition = styled(SectionComposition)`
  & > ul > li {
    border: solid 1px black;
  }
`

export { StyledSectionComposition };