import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUnequalAnglesCorners, fetchUnequalAnglesCorners } from "../../redux/unequalAnglesSlice";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import RadioFields from "./RadioFields";
import { UnequalAnglesCorner } from "../../javascript/Section";

export default function AddUnequalAnglesCorners({ saveShape, isPointsModeActive }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [corner, setCorner] = useState(null);
  const [degree, setDegree] = useState(0);
  const [idCoordInArray, setIdCoordInArray] = useState(null);
  const [isBtnPointsActive, setBtnPointsStatus] = useState(false);
  
  const [activeCase, setActiveCase] = useState(1)

  const corners = useSelector(selectAllUnequalAnglesCorners);
  const cornersStatus = useSelector(state => state.unequalAnglesCorners.status);

  const dispatch = useDispatch()

  useEffect(() => {
    if (cornersStatus === "idle") {
      dispatch(fetchUnequalAnglesCorners())
    }
  }, [])

  useEffect(() => {
    if (idCoordInArray !== null) {
      drawShapeUsingPoints()
    }
  })

  useEffect(() => {
    if (!isBtnPointsActive && idCoordInArray !== null) {
      setIdCoordInArray(null)
      createCirclesInSvg([]);
    }
  }, [isBtnPointsActive])

  async function drawShapeUsingPoints() {
    const shapeArr = saveShape();

    const result = await createCirclesInSvg(shapeArr);
    drawShape(result.x, result.y);
    setIdCoordInArray(null);
  }

  const drawShape = (centerX, centerY) => {
    const section = new UnequalAnglesCorner(centerX, centerY, degree, corner, activeCase);

    if (Number.isInteger(idCoordInArray)) {
      section.calcSectionCenter(idCoordInArray);
    }

    saveShape(section)
  };

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }

  return (
    <StyledSectionLi>
      <h3 onClick={(e) => changeStatus(e)}>Неравнополочный уголок</h3>

      <div>
        <select onChange={(e) => {
          const corner = corners.find(elem => elem._id === e.target.value);
          setCorner(corner);
        }}>
          <option>Выберите № неравнополочного уголка</option>
          {corners.map(elem => <option value={elem._id} key={elem._id}>{elem.no}: {elem.B}x{elem.b}x{elem.t}</option>)}
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

        <button type="button" className={`case ${activeCase == 1 ? "active" : ""}`} onClick={() => setActiveCase(1)}>1 случай</button>
        <button type="button" className={`case ${activeCase == 2 ? "active" : ""}`} onClick={() => setActiveCase(2)} >2 случай</button>

        <button type="button" onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

        <Preview 
          sectionName={"unequalAnglesCorners"} 
          degree={degree} 
          activeCase={activeCase}
          isBtnPointsActive={isBtnPointsActive}  
          setIdCoordInArray={setIdCoordInArray}
        />
      </div>
    </StyledSectionLi>
  )
}