import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBeams, selectAllBeams } from "../../redux/beamsSlice";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import setCoordPoints from "../../javascript/setCoordPoints";
import RadioFields from "./RadioFields";
import setSectionData from "../../javascript/setSectionData";

export default function AddBeam({saveShape, isPointsModeActive }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [beam, setBeam] = useState(null);
  const [degree, setDegree] = useState(0);
  const [idCoordInArray, setIdCoordInArray] = useState(null);
  const [isBtnPointsActive, setBtnPointsStatus] = useState(false);

  const beams = useSelector(selectAllBeams);
  const status = useSelector(state => state.beams.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBeams());
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

  const drawShape = (centerX, centerY) => saveShape(drawBeam(centerX, centerY));

  function drawBeam(centerX, centerY) {
    const sectionInstance = setSectionData.call(beam, centerX, centerY, degree, idCoordInArray)
    
    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return sectionInstance;
      }

      setCoordPoints.call(sectionInstance, [...arguments]);

      const path = sectionInstance.draw(relativeCenterX, relativeCenterY);

      if (sectionInstance.isActive) {
        path.classList.add("active");
      }
      
      svg.current.appendChild(path);

      return sectionInstance;
    }
  }

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }

  return (
    <StyledSectionLi>
      <h3 onClick={(e) => changeStatus(e)}>Двутавр</h3>

      <div>
        <select onChange={(e) => {
          const beam = beams.find(beam => beam._id === e.target.value);
          setBeam(beam);
        }}>
          <option>Выберите № двутавра</option>
          {beams.map(beam => <option value={beam._id} key={beam._id}>{beam.no}</option>)}
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
          sectionName={"beams"} 
          degree={degree} 
          isBtnPointsActive={isBtnPointsActive} 
          setIdCoordInArray={setIdCoordInArray}
        />
      </div>
    </StyledSectionLi>
  )
}