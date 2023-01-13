import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchBeams, selectAllBeams } from "../../redux/sortamentSlice";

function AddBeam({ saveShape, className, children }) {
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);
  const [beam, setBeam] = useState(null);

  const beams = useSelector(selectAllBeams);
  const status = useSelector(state => state.sortament.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBeams())
    }
  }, [])

  function drawBeam(beam, coordX, coordY) {
    const {h, b, s, t} = beam;

    return function (svg, startPointX, startPointY) {
      if (svg === undefined) {
        return {...beam, coordX, coordY, type: "beam"}
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const currentX = startPointX + coordX;
      const currentY = startPointY + coordY;

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${currentX}, ${currentY} h ${b} v ${t} h -${(b - s)/2} v ${h-2*t} h ${(b - s)/2} v ${t} h -${b} v -${t} h ${(b - s)/2} v -${h - 2*t} h -${(b - s)/2} z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform", `translate(-${b/2}, -${h/2})`);

      svg.current.appendChild(path);

      const coords = [
        {x: coordX, y: coordY}, 
        {x: coordX + b, y: coordY},
        {x: coordX + b, y: coordY + h},
        {x: coordX, y: coordY + h},
      ]

      coords.forEach(item => {
        const text = document.createElementNS(xmlns, "text");
        text.setAttributeNS(null, "x", `${startPointX + item.x - b/2}`);
        text.setAttributeNS(null, "y", `${startPointY + item.y - h/2}`);
        text.setAttributeNS(null, "font-size", "10px");
        text.textContent = `(${item.x}, ${item.y})`;
        svg.current.appendChild(text)
      })
    }
  }

  function convertToNumber(e, setState) {
    const value = e.target.value;
    setState((value[value.length - 1] === ".") ? value : parseFloat(value))
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
        <p>Координаты</p>
        <label>x <input value={coordX} onChange={(e) => convertToNumber(e, setCoordX)} /></label>
        <label>y <input value={coordY} onChange={(e) => convertToNumber(e, setCoordY)} /></label>
      </div>
        
      <input type="button" value="Добавить" onClick={() => saveShape(drawBeam(beam, coordX, coordY))} />
    </li>
  )
}

export const StyledAddBeam = styled(AddBeam)`
  & > label, & > input {
    display: block;
  }

  div input {
    width: 40px;
  }
`