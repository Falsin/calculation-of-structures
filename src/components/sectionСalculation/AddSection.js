import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import StyledPreview from "./Preview";
import RadioFields from "./RadioFields";
import { addShape } from "../../redux/shapeCollectionSlice";

export default React.memo(function AddSection({ sectionObj, useShapeDataForCirclesMode }) {
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
        shape: sectionObj.shapeCreator(centerX, centerY, degree, shape, activeCase),
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

  const drawShape = (centerX, centerY) => {
    dispatch(addShape(sectionObj.shapeCreator(centerX, centerY, degree, shape, activeCase)))
  };

  const changeOrientation = () => setDegree(degree == 270 ? 0 : degree + 90);

  const useCenterX = param => param !== undefined ? setCenterX(param) : centerX;
  const useCenterY = param => param !== undefined ? setCenterY(param) : centerY;

  const sectionList = <select onChange={(e) => setShape(sections.find(section => section.id == e.target.value))}>
    <option>Выберите № прокатной стали</option>
    {sections.map(section => <option value={section.id} key={section.id}>{section.no}</option>)}
  </select>

  const setCase = !activeCase 
    ? null
    : <>
        <button type="button" className={`case ${activeCase == 1 ? "active" : ""}`} onClick={() => setActiveCase(1)}>1 случай</button>
        <button type="button" className={`case ${activeCase == 2 ? "active" : ""}`} onClick={() => setActiveCase(2)}>2 случай</button>
      </>

  return (
    <StyledSectionLi>
      <h3 onClick={(e) => changeStatus(e)}>{sectionObj.sectionNameInRussian}</h3>

      <div>
        {sectionList}
        
        <RadioFields drawShape={drawShape} setBtnPointsStatus={setBtnPointsStatus} useCenterX={useCenterX} useCenterY={useCenterY}/>

        {setCase}

        <button type="button" onClick={changeOrientation}>Повернуть на 90°</button>

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
}, (prevProps, nextProps) => {
  return prevProps.sectionObj.sectionName == nextProps.sectionObj.sectionName;
})