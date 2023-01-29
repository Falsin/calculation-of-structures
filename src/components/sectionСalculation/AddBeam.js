import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchBeams, selectAllBeams } from "../../redux/beamsSlice";

function AddBeam({ saveShape, className, children }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [beam, setBeam] = useState(null);
  const [degree, setDegree] = useState(0);

  const beams = useSelector(selectAllBeams);
  const status = useSelector(state => state.beams.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBeams());
    }
  }, [])

  function drawBeam(beam, centerX, centerY, degree) {
    const {h, b, s, t} = beam;

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return {...beam, centerX, centerY, type: "beam", degree}
      }

      const xmlns = "http://www.w3.org/2000/svg";

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - b/2}, ${relativeCenterY - h/2} h ${b} v ${t} h -${(b - s)/2} v ${h-2*t} h ${(b - s)/2} v ${t} h -${b} v -${t} h ${(b - s)/2} v -${h - 2*t} h -${(b - s)/2} z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${degree})`);

      svg.current.appendChild(path);

      let coords;

      if (degree == 90 || degree == 270) {
        coords = [
          {x: centerX - h/2, y: centerY + b/2}, 
          {x: centerX + h/2, y: centerY + b/2},
          {x: centerX - h/2, y: centerY - b/2},
          {x: centerX + h/2, y: centerY - b/2},
        ]
      } else {
        coords = [
          {x: centerX - b/2, y: centerY + h/2}, 
          {x: centerX + b/2, y: centerY + h/2},
          {x: centerX - b/2, y: centerY - h/2},
          {x: centerX + b/2, y: centerY - h/2}
        ]
      }

      coords.forEach((item, id) => {
        const text = document.createElementNS(xmlns, "text");

        text.setAttributeNS(null, "font-size", "10px");
        text.setAttributeNS(null, "text-anchor", "middle");
        text.setAttributeNS(null, "x", `${relativeCenterX + item.x}`);
        text.setAttributeNS(null, "y", `${relativeCenterY + item.y}`);
        text.setAttributeNS(null, "transform-origin", `${relativeCenterX + item.x} ${relativeCenterY + item.y}`);
        text.setAttributeNS(null, "transform", `scale(1 -1)`);

        text.textContent = `(${item.x}, ${item.y})`;

        svg.current.appendChild(text)
      })
    }
  }

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }

  return (
    <li className={className}>
      <p>Двутавр</p>

      <select onChange={(e) => {
        const beam = beams.find(beam => beam._id === e.target.value);
        setBeam(beam);
      }}>
        <option>Выберите № двутавра</option>
        {beams.map(beam => <option value={beam._id} key={beam._id}>{beam.no}</option>)}
      </select>

      <div>
        <p>Координаты центра тяжести</p>
        <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
        <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
      </div>

      <button onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

      <Preview degree={degree} />
        
      <input type="button" value="Добавить" onClick={() => saveShape(drawBeam(beam, parseFloat(centerX), parseFloat(centerY), degree))} />
    </li>
  )
}

function Preview({degree}) {
  const svg = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const beam = useSelector(state => state.beams.beams[0]);
  const {h, b, s, t} = !beam ? {} : beam;

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width))
    setHeight(parseFloat(style.height))
  })

  return (
    <svg ref={svg}>
      {!beam 
        ? null 
        : <path 
          d={`M ${width/2 - b/2}, ${height/2 - h/2} h ${b} v ${t} h -${(b - s)/2} v ${h-2*t} h ${(b - s)/2} v ${t} h -${b} v -${t} h ${(b - s)/2} v -${h - 2*t} h -${(b - s)/2} z`} 
          transform={`rotate(${degree}, ${width/2}, ${height/2})`}
          fill="white" 
          stroke="black"  
        />
      }
    </svg>
  )
}

export const StyledAddBeam = styled(AddBeam)`
  div input {
    width: 40px;
  }
`