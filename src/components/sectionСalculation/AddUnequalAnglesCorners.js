import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUnequalAnglesCorners, fetchUnequalAnglesCorners } from "../../redux/unequalAnglesSlice";
import styled from "styled-components";

function AddUnequalAnglesCorners({ saveShape, className, children }) {
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
      type: "equalAnglesCorner",
      activeCase
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

      svg.current.appendChild(path);
    }
  }

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }

  return (
    <li className={className}>
      <p>Неравнополочный уголок</p>
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

      <Preview degree={degree} activeCase={activeCase} />

      <input type="button" value="Добавить" onClick={() => saveShape(drawCorner())} />
    </li>
  )
}

function Preview({ degree, activeCase }) {
  const svg = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const unequalAngleCorner = useSelector(state => state.unequalAnglesCorners.unequalAnglesCorners[14]);
  const {B, b, t} = !unequalAngleCorner ? {} : unequalAngleCorner;

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width))
    setHeight(parseFloat(style.height))
  })

  return (
    <svg ref={svg} style={{display: "block"}}>
      {!unequalAngleCorner 
        ? null 
        : <path 
          d={`M ${width/2 - b/2}, ${height/2 - B/2} h ${t} v ${B - t} h ${b - t} v ${t} h ${-b} z`}
          transform-origin="50% 50%"
          transform={`scale(${(activeCase == 2) ? -1 : 1} 1) rotate(${(activeCase == 2) ? -degree : degree})`}
          fill="white" 
          stroke="black"  
        />
      }
    </svg>
  )
}

export const StyledAddUnequalAnglesCorners = styled(AddUnequalAnglesCorners)`
  div input {
    width: 40px;
  }

  .case.active {
    background: yellow;
  }
`