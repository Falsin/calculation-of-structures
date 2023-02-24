import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllEqualAnglesCorners, fetchEqualAnglesCorners } from "../../redux/equalAngleCornerSlice";
import createTextCoords from "../../javascript/addCoordText";
import changeStatus from "../../javascript/changeStatusInList";
import uniqid from 'uniqid';
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";

export default function AddEqualAnglesCorners({ saveShape }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [corner, setCorner] = useState(null);
  const [degree, setDegree] = useState(0);

  const corners = useSelector(selectAllEqualAnglesCorners);
  const cornersStatus = useSelector(state => state.equalAnglesCorners.status);

  const dispatch = useDispatch()

  useEffect(() => {
    if (cornersStatus === "idle") {
      dispatch(fetchEqualAnglesCorners())
    }
  }, [])

  function drawCorner() {
    const equalAnglesCornerInstance = {
      ...corner,
      centerX: parseFloat(centerX), 
      centerY: parseFloat(centerY),
      degree, 
      type: "equalAnglesCorner",
      Iy: corner.Ix,
      uniqid: uniqid()
    }
    
    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return equalAnglesCornerInstance;
      }
      const xmlns = "http://www.w3.org/2000/svg";
      const { b, t, z0, degree } = equalAnglesCornerInstance;

      const path = document.createElementNS(xmlns, "path");
    
      path.setAttributeNS(null, "d", `M ${relativeCenterX - z0*10}, ${relativeCenterY - b + z0*10} h ${t} v ${b - t} h ${b - t} v ${t} h ${-b} z`);
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${degree})`);
      path.setAttributeNS(null, "id", `${equalAnglesCornerInstance.uniqid}`);

      svg.current.appendChild(path);

      const coords = [
        {x: -z0*10, y: b - z0*10},
        {x: -z0*10, y: -z0*10},
        {x: b - z0*10, y: -z0*10}
      ]

      createTextCoords(arguments, coords, degree);
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
          
        <div>
          <p>Координаты</p>
          <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
          <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
        </div>

        <button type="button" onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

        <Preview sectionName={"equalAnglesCorners"} degree={degree} />

        <input type="button" value="Добавить" onClick={() => saveShape(drawCorner())} />
      </div>
    </StyledSectionLi>
  )
}