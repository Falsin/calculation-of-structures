import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUnequalAnglesCorners, fetchUnequalAnglesCorners } from "../../redux/unequalAnglesSlice";
import createTextCoords from "../../javascript/addCoordText";
import changeStatus from "../../javascript/changeStatusInList";
import uniqid from 'uniqid';
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";

export default function AddUnequalAnglesCorners({ saveShape }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [corner, setCorner] = useState(null);
  const [degree, setDegree] = useState(0);
  
  const [activeCase, setActiveCase] = useState(1)

  const corners = useSelector(selectAllUnequalAnglesCorners);
  const cornersStatus = useSelector(state => state.unequalAnglesCorners.status);

  const dispatch = useDispatch()

  useEffect(() => {
    if (cornersStatus === "idle") {
      dispatch(fetchUnequalAnglesCorners())
    }
  }, [])

  function drawCorner() {
    const unequalAnglesCornerInstance = {
      ...corner,
      centerX: parseFloat(centerX), 
      centerY: parseFloat(centerY),
      degree, 
      type: "unequalAnglesCorner",
      activeCase,
      uniqid: uniqid()
    }
    
    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return unequalAnglesCornerInstance;
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const { B, b, t, x0, y0, degree, activeCase } = unequalAnglesCornerInstance;

      const path = document.createElementNS(xmlns, "path");
    
      path.setAttributeNS(null, "d", `M ${relativeCenterX - x0*10}, ${relativeCenterY - B + y0*10} h ${t} v ${B - t} h ${b - t} v ${t} h ${-b} z`);
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(${activeCase == 2 ? -1 : 1} -1) rotate(${activeCase == 2 ? -degree : degree})`);
      path.setAttributeNS(null, "id", `${unequalAnglesCornerInstance.uniqid}`);

      svg.current.appendChild(path);

      let coords;

      if (activeCase == 1) {
        coords = [
          {x: -x0*10, y: B - y0*10},
          {x: -x0*10, y: -y0*10},
          {x: b - x0*10, y: -y0*10},
        ]
      } else {
        coords = [
          {x: x0*10, y: B - y0*10},
          {x: x0*10, y: -y0*10},
          {x: -b + x0*10, y: -y0*10},
        ]
      }

      createTextCoords(arguments, coords, degree);
    }
  }

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
          {corners.map(elem => <option value={elem._id} key={elem._id}>{elem.no}</option>)}
        </select>
          
        <div>
          <p>Координаты</p>
          <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
          <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
        </div>

        <button type="button" className={`case ${activeCase == 1 ? "active" : ""}`} onClick={() => setActiveCase(1)}>1 случай</button>
        <button type="button" className={`case ${activeCase == 2 ? "active" : ""}`} onClick={() => setActiveCase(2)} >2 случай</button>

        <button type="button" onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

        <Preview sectionName={"unequalAnglesCorners"} degree={degree} activeCase={activeCase} />

        <input type="button" value="Добавить" onClick={() => saveShape(drawCorner())} />
      </div>
    </StyledSectionLi>
  )
}