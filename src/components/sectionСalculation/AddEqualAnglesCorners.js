import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllEqualAnglesCorners, fetchEqualAnglesCorners } from "../../redux/equalAngleCornerSlice";
import styled from "styled-components";

function AddEqualAnglesCorners({ saveShape, className, children }) {
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

  function drawCorner(corner, centerX, centerY) {
    const { b, t, z0 } = corner;
    
    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return { ...corner, centerX, centerY, type: "corner" }
      }
      const xmlns = "http://www.w3.org/2000/svg";

      const path = document.createElementNS(xmlns, "path");
    
      path.setAttributeNS(null, "d", `M ${relativeCenterX - z0*10}, ${relativeCenterY - b + z0*10} h ${t} v ${b - t} h ${b - t} v ${t} h ${-b} z`);
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${degree})`);

      svg.current.appendChild(path);
    }
  }

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }

  return (
    <li className={className}>
      <p>Равнополочный уголок</p>
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

      <button onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

      <input type="button" value="Добавить" onClick={() => saveShape(drawCorner(corner, parseFloat(centerX), parseFloat(centerY), degree))} />
    </li>
  )
}

export const StyledAddEqualAnglesCorners = styled(AddEqualAnglesCorners)`
  div input {
    width: 40px;
  }
`