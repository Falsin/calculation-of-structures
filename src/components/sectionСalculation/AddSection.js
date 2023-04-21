import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import StyledPreview from "./Preview";
import RadioFields from "./RadioFields";

export default function AddSection({ sectionObj, useShapeDataForCirclesMode, saveShape, isPointsModeActive }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [shape, setShape] = useState(null);
  const [degree, setDegree] = useState(0);
  const [idCoordInArray, setIdCoordInArray] = useState(null);
  const [isBtnPointsActive, setBtnPointsStatus] = useState(false);

  const [activeCase, setActiveCase] = useState(sectionObj.defaultActiveCase)

  const sections = useSelector(sectionObj.selectAllSections);
  const status = useSelector(state => state[sectionObj.sectionName].status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(sectionObj.fetch());
    }
  }, [])

  useEffect(() => {
    if (idCoordInArray !== null) {
      useShapeDataForCirclesMode({
        shape: sectionObj.classShape(centerX, centerY, degree, shape, activeCase),
        shapeId: idCoordInArray
      })
    }
  }, [idCoordInArray])

  useEffect(() => {
    if (!isBtnPointsActive && idCoordInArray !== null) {
      setIdCoordInArray(null)
    }
  }, [isBtnPointsActive])

  useEffect(() => {
    if (useShapeDataForCirclesMode.getShapeData() == null) {
      setIdCoordInArray(null)
    }
  }, [useShapeDataForCirclesMode.getShapeData])

  const drawShape = (centerX, centerY) => saveShape(sectionObj.classShape(centerX, centerY, degree, shape, activeCase));

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }

  return (
    <StyledSectionLi>
      <h3 onClick={(e) => changeStatus(e)}>{sectionObj.sectionNameInRussian}</h3>

      <div>
        <select onChange={(e) => {
          const section = sections.find(section => section._id === e.target.value);
          setShape(section);
        }}>
          <option>Выберите № прокатной стали</option>
          {sections.map(section => <option value={section._id} key={section._id}>{section.no}</option>)}
        </select>
        
        <RadioFields
          saveShape={saveShape} 
          drawShape={drawShape} 
          isPointsModeActive={isPointsModeActive} 
          setBtnPointsStatus={setBtnPointsStatus} 
          centerX={centerX}
          setCenterX={setCenterX}
          centerY={centerY}
          setCenterY={setCenterY}
        />

        {!activeCase 
          ? null 
          : <>
            <button type="button" className={`case ${activeCase == 1 ? "active" : ""}`} onClick={() => setActiveCase(1)}>1 случай</button>
            <button type="button" className={`case ${activeCase == 2 ? "active" : ""}`} onClick={() => setActiveCase(2)}>2 случай</button>
            </>
        }

        <button type="button" onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

        <StyledPreview 
          sectionName={sectionObj.sectionName} 
          degree={degree}
          activeCase={activeCase} 
          isBtnPointsActive={isBtnPointsActive} 
          setIdCoordInArray={setIdCoordInArray}
        />
      </div>
    </StyledSectionLi>
  )
}