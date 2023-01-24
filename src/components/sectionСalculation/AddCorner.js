import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllEqualAnglesCorners, fetchEqualAnglesCorners } from "../../redux/equalAngleCornerSlice";
import { selectAllUnequalAnglesCorners, fetchUnequalAnglesCorners } from "../../redux/unequalAnglesSlice";
import styled from "styled-components";

function AddCorner({ saveShape, className, children }) {
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);
  const [corner, setCorner] = useState(null); 

  const equalAnglesCorners = useSelector(selectAllEqualAnglesCorners);
  const equalAnglesCornersStatus = useSelector(state => state.equalAnglesCorners.status);

  const unequalAnglesCorners = useSelector(selectAllUnequalAnglesCorners);
  const unequalAnglesCornersStatus = useSelector(state => state.unequalAnglesCorners.status);

  const dispatch = useDispatch()

  useEffect(() => {
    if (equalAnglesCornersStatus === "idle" || unequalAnglesCornersStatus === "idle") {
      dispatch(fetchEqualAnglesCorners())
      dispatch(fetchUnequalAnglesCorners())
    }
  }, [])

  function drawCorner(corner, coordX, coordY) {
    const { b, B = b, t } = corner;
    
    return function (svg, startPointX, startPointY) {
      if (svg === undefined) {
        return { ...corner, coordX, coordY, type: "corner" }
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const currentX = startPointX + coordX;
      const currentY = startPointY + coordY;

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${currentX}, ${currentY} h ${t} v ${B - t} h ${b - t} v ${t} h ${-b} z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");

      svg.current.appendChild(path);
    }
  }

  function convertToNumber(e, setState) {
    const value = e.target.value;
    setState((value[value.length - 1] === ".") ? value : parseFloat(value))
  }

  return (
    <li className={className}>
      <p>Уголок</p>

      <label htmlFor="equalAngles">Равнополочные уголки</label>
      <select onChange={(e) => {
        const corner = equalAnglesCorners.find(elem => elem._id === e.target.value);
        setCorner(corner);
      }}>
        <option id="equalAngles">Выберите № уголка</option>
        {equalAnglesCorners.map(elem => <option value={elem._id} key={elem._id}>{elem.no}</option>)}
      </select>

      <label htmlFor="unequalAngles">Неравнополочные уголки</label>
      <select onChange={(e) => {
        const corner = unequalAnglesCorners.find(elem => elem._id === e.target.value);
        setCorner(corner);
      }}>
        <option id="unequalAngles">Выберите № уголка</option>
        {unequalAnglesCorners.map(elem => <option value={elem._id} key={elem._id}>{elem.no}</option>)}
      </select>
        
      <div>
        <p>Координаты</p>
        <label>x <input value={coordX} onChange={(e) => convertToNumber(e, setCoordX)} /></label>
        <label>y <input value={coordY} onChange={(e) => convertToNumber(e, setCoordY)} /></label>
      </div>

      <input type="button" value="Добавить" onClick={() => saveShape(drawCorner(corner, coordX, coordY))} />
    </li>
  )
}

export const StyledAddCorner = styled(AddCorner)`
  label, input {
    display: block;
  }
`