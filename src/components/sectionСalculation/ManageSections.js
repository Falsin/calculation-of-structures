import React, { useState } from "react";
import styled from "styled-components";
import AddRectangle from "./AddRectangle";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionComposition } from "./SectionComposition";
import sectionsDataArr from "../../javascript/sections/sectionsDataArr";
import AddSection from "./AddSection";
import { useSelector } from "react-redux";
import { selectAllShapes } from "../../redux/shapeCollectionSlice";

function ManageSections({ submit, useShapeDataForCirclesMode, useSettingShowMode, sourceGroup, className }) {
  const [funcForSwitchActiveSection, setFuncForSwitchActiveSection] = useState(null);
  
  const arrayShapes = useSelector(state => selectAllShapes(state));

  const useFuncForSwitchActiveSection = (func) => (
    func ? setFuncForSwitchActiveSection(func) : funcForSwitchActiveSection
  )

  const buttons = !arrayShapes.length 
    ? null 
    : <>
        <button type="submit">рассчитать</button>
        <button type="button" onClick={() => useSettingShowMode()}>
          {useSettingShowMode.showCoords ? "Скрыть координаты" : "Показать координаты"}
        </button>
      </>

  const sectionList = <ul>
    {sectionsDataArr.map(sectionObj => (
      <AddSection sectionObj={sectionObj} useShapeDataForCirclesMode={useShapeDataForCirclesMode}/>
    ))}
    <AddRectangle/>
  </ul>

  return (
    <form className={className} onSubmit={submit}>
      <ul>
        <li>
          <h2 onClick={(e) => changeStatus(e, funcForSwitchActiveSection)}>Простые сечения</h2>
          <div>{sectionList}</div>
        </li>

        <StyledSectionComposition 
          useFuncForSwitchActiveSection={useFuncForSwitchActiveSection}
          sourceGroup={sourceGroup} 
        />
      </ul>

      {buttons}
    </form>
  )
}

const StyledManageSections = styled(ManageSections)`
  & > ul {
    position: relative;

    li:first-child ul {
      position: relative;
    }

    h2 {
      margin: 0;
    }

    li > h2 ~ div,
    li > h3 ~ div {
      overflow: hidden;
      max-height: 0;
      padding: 0;
      transition-timing-function: linear;
      transition: 1s;
    }

    li > h2.active ~ div,
    li > h3.active ~ div {
      max-height: 1000px;
      margin-top: 10px;
    }
  }

  ul {
    list-style: none;
  }
`

export default StyledManageSections;