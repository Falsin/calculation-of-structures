import React, { useState } from "react";
import styled from "styled-components";
import AddRectangle from "./AddRectangle";
import changeStatus from "../../javascript/changeStatusInList";
import SectionComposition from "./SectionComposition";
import sectionsDataArr from "../../javascript/sectionsDataArr";
import AddSection from "./AddSection";

function ManageSections({ submit, saveShape, useShapeDataForCirclesMode, useSettingShowMode, sourceGroup, arrayShapes, setArrayShapes, children, className }) {
  const [funcForSwitchActiveSection, setFuncForSwitchActiveSection] = useState(null);

  function setButtons() {
    return !arrayShapes.length 
      ? null 
      : <>
          <button type="submit">рассчитать</button>
          <button type="button" onClick={() => useSettingShowMode()}>
            {useSettingShowMode.showCoords ? "Скрыть координаты" : "Показать координаты"}
          </button>
        </>
  }

  return (
    <form className={className} onSubmit={submit}>
      <ul style={{position: "relative"}}>
        <li>
          <h2 onClick={(e) => changeStatus(e, funcForSwitchActiveSection)}>Простые сечения</h2>

          <ul style={{position: "relative"}}>
            {sectionsDataArr.map(sectionObj => (
              <AddSection sectionObj={sectionObj} saveShape={saveShape} useShapeDataForCirclesMode={useShapeDataForCirclesMode} />
            ))}
            <AddRectangle saveShape={saveShape}/>
          </ul>
        </li>

        <li>
          <h2 onClick={(e) => changeStatus(e, funcForSwitchActiveSection)}>Состав сечения ({arrayShapes.length})</h2>

          {!arrayShapes.length 
            ? <p>Не добавлено ни одного сечения</p>
            : <SectionComposition 
                arrayShapes={arrayShapes}
                setArrayShapes={setArrayShapes}
                setFuncForSwitchActiveSection={setFuncForSwitchActiveSection}
                sourceGroup={sourceGroup} 
              />
          }
        </li>
      </ul>

      {setButtons()}
    </form>
  )
}

const StyledManageSections = styled(ManageSections)`
  h2 {
    margin: 0;
  }

  li > h2 ~ ul,
  li > h3 ~ ul {
    overflow: hidden;
    max-height: 0;
    padding: 0;
    transition-timing-function: linear;
    transition: 1s;
  }

  li > h2.active ~ ul,
  li > h3.active ~ ul {
    max-height: 1000px;
    margin-top: 10px;
  }
`

export default StyledManageSections;