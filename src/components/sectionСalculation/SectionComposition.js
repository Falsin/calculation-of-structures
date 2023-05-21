import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import changeStatus from "../../javascript/changeStatusInList";
import Section from "./Section";
import { useSelector } from "react-redux";

function SectionComposition({ useFuncForSwitchActiveSection, className }) {
  const arrayShapeIds = useSelector(state => state.shapeCollection.ids);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (selectedId) {
      useFuncForSwitchActiveSection(() => setSelectedId)
    }
  }, [selectedId])

  const useSelectedId = (id) => setSelectedId(id == selectedId ? null : id)
  useSelectedId.getSelectedId = selectedId;

  const sectionList = <ul>
    {arrayShapeIds.map(id => 
      <Section key={id} shapeId={id} useSelectedId={useSelectedId} />
    )}
  </ul>

  return (
    <li className={className}>
      <h2 onClick={(e) => changeStatus(e, useFuncForSwitchActiveSection())}>Состав сечения ({arrayShapeIds.length})</h2>
      {!arrayShapeIds.length ? <p>Не добавлено ни одного сечения</p> : <div>{sectionList}</div>}
    </li>
  )
}

const StyledSectionComposition = styled(SectionComposition)`
  & > div > ul > li {
    border: solid 1px black;
  }
`

export { StyledSectionComposition };