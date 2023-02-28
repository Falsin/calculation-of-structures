import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createTextCoords from "../../javascript/addCoordText";
import { fetchBeams, selectAllBeams } from "../../redux/beamsSlice";
import changeStatus from "../../javascript/changeStatusInList";
import uniqid from 'uniqid';
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";

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
  }, [idCoordInArray])

  async function drawShapeUsingPoints() {
    const shapeArr = saveShape();
     
    const result = await createCirclesInSvg(shapeArr);
    console.log(result)
    setCenterX(result.x);
    setCenterY(result.y);
    drawShape(result.x, result.y)
  }

  useEffect(() => {
    if (!isBtnPointsActive && idCoordInArray !== null) {
      setIdCoordInArray(null);
      createCirclesInSvg([]);
    }
  }, [isBtnPointsActive])


  const drawShape = (centerX, centerY) => saveShape(drawBeam(centerX, centerY))

  function drawBeam(centerX, centerY) {
    const beamInstance = {
      ...beam,
      centerX: parseFloat(centerX), 
      centerY: parseFloat(centerY),
      degree,
      type: "beam",
      uniqid: uniqid()
    }

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return beamInstance;
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const {h, b, s, t, degree} = beamInstance;

      const coords = [
        {x: -b/2, y: h/2},
        {x: b/2, y: h/2},
        {x: -b/2, y: -h/2},
        {x: b/2, y: -h/2} 
      ]

      createCirclesInSvg.shapeCollectObj = {
        [beamInstance.uniqid]: {
          coordPoints: coords.map(elem => {
            return {
              x: relativeCenterX + elem.x,
              y: relativeCenterY + elem.y,
            }
          }),
          relativeCenterX,
          relativeCenterY,
        }
      }

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - b/2}, ${relativeCenterY - h/2} h ${b} v ${t} h -${(b - s)/2} v ${h-2*t} h ${(b - s)/2} v ${t} h -${b} v -${t} h ${(b - s)/2} v -${h - 2*t} h -${(b - s)/2} z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${degree})`);
      path.setAttributeNS(null, "id", `${beamInstance.uniqid}`);
      
      svg.current.appendChild(path);

      createTextCoords(arguments, coords, degree);
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

function RadioFields({ drawShape, setBtnPointsStatus, isPointsModeActive, centerX, setCenterX, centerY, setCenterY }) {
  let id;

  return (
    <>
      <div>
        <label htmlFor={id = uniqid()}>Добавить по координатам центра тяжести</label>
        <input 
          type="radio" 
          name="mode" 
          id={id} 
          readOnly 
          defaultChecked={true} 
          onChange={() => setBtnPointsStatus(false)}
        />

        <div>
          <p>Координаты центра тяжести</p>
          <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
          <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
              
          <input type="button" value="Добавить" onClick={() => drawShape(centerX, centerY)} />
        </div>
      </div>

      <div>
        <label htmlFor={id = uniqid()}>Добавить по контрольным точкам</label>
        <input 
          type="radio" 
          name="mode" 
          id={id} 
          readOnly 
          disabled={!isPointsModeActive ? true : false}
          onChange={() => setBtnPointsStatus(true)}
        />
      </div>
    </>
  )
}