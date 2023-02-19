import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllEqualAnglesCorners, fetchEqualAnglesCorners } from "../../redux/equalAngleCornerSlice";
import styled from "styled-components";
import createTextCoords from "../../javascript/addCoordText";
import uniqid from 'uniqid';

function AddEqualAnglesCorners({ saveShape, className, children }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [corner, setCorner] = useState(null);
  const [degree, setDegree] = useState(0);
  const [isActive, setStatus] = useState(false); 

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
    <li className={className}>
      <h3 onClick={() => setStatus(!isActive)}>Равнополочный уголок</h3>

      <div className={isActive ? "active" : ""}>
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

        <Preview degree={degree} />

        <input type="button" value="Добавить" onClick={() => saveShape(drawCorner())} />
      </div>
    </li>
  )
}

function Preview({degree}) {
  const svg = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const equalAngleCorner = useSelector(state => state.equalAnglesCorners.equalAnglesCorners[10]);
  const {b, t} = !equalAngleCorner ? {} : equalAngleCorner;

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width))
    setHeight(parseFloat(style.height))
  })

  return (
    <svg ref={svg} style={{display: "block"}}>
      {!equalAngleCorner 
        ? null 
        : <path 
          d={`M ${width/2 - b/2}, ${height/2 - b/2} h ${t} v ${b - t} h ${b - t} v ${t} h ${-b} z`} 
          transform={`rotate(${degree}, ${width/2}, ${height/2})`}
          fill="white" 
          stroke="black"  
        />
      }
    </svg>
  )
}

export const StyledAddEqualAnglesCorners = styled(AddEqualAnglesCorners)`
  h3 {
    margin: 0;
  }

  div div input {
    width: 40px;
  }

  & > div {
    overflow: hidden;
    max-height: 0;
    padding: 0;
    transition: 0.6s;

    &.active {
      max-height: 1000px;
      margin-top: 10px;
    }
  }
`