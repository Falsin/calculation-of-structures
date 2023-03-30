import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllEqualAnglesCorners, fetchEqualAnglesCorners } from "../../redux/equalAngleCornerSlice";
import createTextCoords from "../../javascript/addCoordText";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import setCoordPoints from "../../javascript/setCoordPoints";
import RadioFields from "./RadioFields";
import setSectionData from "../../javascript/setSectionData";

export default function AddEqualAnglesCorners({ saveShape, isPointsModeActive }) {
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
      drawShapeUsingPoints()
    }
  })

  async function drawShapeUsingPoints() {
    const shapeArr = saveShape();

    const result = await createCirclesInSvg(shapeArr);
    drawShape(result.x, result.y);
    setIdCoordInArray(null);
  }

  useEffect(() => {
    if (!isBtnPointsActive && idCoordInArray !== null) {
      setIdCoordInArray(null)
      createCirclesInSvg([]);
    }
  }, [isBtnPointsActive])

  const drawShape = (centerX, centerY) => saveShape(drawCorner(centerX, centerY))

  function drawCorner(centerX, centerY) {
    const { sectionInstance, coords } = setSectionData.call(corner, centerX, centerY, degree, idCoordInArray)
    const { b, t, z0 } = sectionInstance;

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return sectionInstance;
      }

      setCoordPoints.call(sectionInstance, coords, [...arguments])

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
      path.setAttributeNS(null, "d", `M ${relativeCenterX - z0*10}, ${relativeCenterY - b + z0*10} h ${t} v ${b - t} h ${b - t} v ${t} h ${-b} z`);
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${sectionInstance.degree})`);
      path.setAttributeNS(null, "id", `${sectionInstance.uniqid}`);

      if (sectionInstance.isActive) {
        path.classList.add("active");
      }

      svg.current.appendChild(path);

      createTextCoords(arguments, coords, sectionInstance);
    }
  }

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
          {corners.map(elem => <option value={elem._id} key={elem._id}>{elem.no}</option>)}
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