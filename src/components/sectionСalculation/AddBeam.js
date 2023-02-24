import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createTextCoords from "../../javascript/addCoordText";
import { fetchBeams, selectAllBeams } from "../../redux/beamsSlice";
import changeStatus from "../../javascript/changeStatusInList";
import uniqid from 'uniqid';
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";

export default function AddBeam({ saveShape }) {
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

  function drawBeam() {
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

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - b/2}, ${relativeCenterY - h/2} h ${b} v ${t} h -${(b - s)/2} v ${h-2*t} h ${(b - s)/2} v ${t} h -${b} v -${t} h ${(b - s)/2} v -${h - 2*t} h -${(b - s)/2} z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${degree})`);
      path.setAttributeNS(null, "id", `${beamInstance.uniqid}`);

      svg.current.appendChild(path);

      let coords = [
        {x: -b/2, y: h/2},
        {x: b/2, y: h/2},
        {x: -b/2, y: -h/2},
        {x: b/2, y: -h/2} 
      ]

      createTextCoords(arguments, coords, degree)
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

        <div>
          <p>Координаты центра тяжести</p>
          <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
          <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
        </div>

        <button type="button" onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

        <Preview sectionName={"beams"} degree={degree} />
          
        <input type="button" value="Добавить" onClick={() => saveShape(drawBeam())} />
      </div>
    </StyledSectionLi>
  )
}