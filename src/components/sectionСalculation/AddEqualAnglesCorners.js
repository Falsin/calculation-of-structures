import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllEqualAnglesCorners, fetchEqualAnglesCorners } from "../../redux/equalAngleCornerSlice";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";
import RadioFields from "./RadioFields";
import { EqualAnglesCorner } from "../../javascript/Section";

export default function AddEqualAnglesCorners({useShapeDataForCirclesMode, saveShape, isPointsModeActive }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [corner, setCorner] = useState(null);
  const [degree, setDegree] = useState(0);
  const [idCoordInArray, setIdCoordInArray] = useState(null);
  const [isBtnPointsActive, setBtnPointsStatus] = useState(false);

  const corners = useSelector(selectAllEqualAnglesCorners);
  const cornersStatus = useSelector(state => state.equalAnglesCorners.status);
  const dispatch = useDispatch()

  useEffect(() => {
    if (cornersStatus === "idle") {
      dispatch(fetchEqualAnglesCorners())
    }
  }, [])

  useEffect(() => {
    if (idCoordInArray !== null) {
      useShapeDataForCirclesMode({
        shape: new EqualAnglesCorner(centerX, centerY, degree, corner),
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

  const drawShape = (centerX, centerY) => saveShape(new EqualAnglesCorner(centerX, centerY, degree, corner));

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }

  return (
    <StyledSectionLi>
      <h3 onClick={(e) => changeStatus(e)}>Равнополочный уголок</h3>

      <div>
        <select onChange={(e) => {
          const corner = corners.find(elem => elem._id === e.target.value);
          setCorner(corner);
        }}>
          <option>Выберите № равнополочного уголка</option>
          {corners.map(elem => <option value={elem._id} key={elem._id}>{elem.no}: {elem.b}x{elem.b}x{elem.t}</option>)}
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

        <button type="button" onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

        <Preview 
          sectionName={"equalAnglesCorners"} 
          degree={degree}
          isBtnPointsActive={isBtnPointsActive}  
          setIdCoordInArray={setIdCoordInArray}
        />
      </div>
    </StyledSectionLi>
  )
}