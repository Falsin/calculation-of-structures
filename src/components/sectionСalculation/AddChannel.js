import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, selectAllChannels } from "../../redux/channelsSlice";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";
import createCirclesInSvg from "../../javascript/addCirclesToSVG";
import setCoordPoints from "../../javascript/setCoordPoints";
import RadioFields from "./RadioFields";
import setSectionData from "../../javascript/setSectionData";

export default function AddChannel({ saveShape, isPointsModeActive }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [channel, setChannel] = useState(null);
  const [degree, setDegree] = useState(0);
  const [idCoordInArray, setIdCoordInArray] = useState(null);
  const [isBtnPointsActive, setBtnPointsStatus] = useState(false);

  const channels = useSelector(selectAllChannels);
  const status = useSelector(state => state.channels.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchChannels())
    }
  })

  useEffect(() => {
    if (idCoordInArray !== null) {
      drawShapeUsingPoints()
    }
  })

  async function drawShapeUsingPoints() {
    const shapeArr = saveShape();

    const result = await createCirclesInSvg(shapeArr);
    drawShape(result.x, result.y);
    setIdCoordInArray(null);
  }

  useEffect(() => {
    if (!isBtnPointsActive && idCoordInArray !== null) {
      setIdCoordInArray(null);
      createCirclesInSvg([]);
    }
  }, [isBtnPointsActive])

  const drawShape = (centerX, centerY) => saveShape(drawChannel(centerX, centerY))

  function drawChannel(centerX, centerY) {
    const { sectionInstance, coords } = setSectionData.call(channel, centerX, centerY, degree, idCoordInArray)
    const { h, b, s, t, z0 } = sectionInstance;

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return sectionInstance;
      }

      setCoordPoints.call(sectionInstance, coords, [...arguments])

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - z0*10}, ${relativeCenterY - h/2} h ${b} v ${t} h -${b - s} v ${h-2*t} h ${b - s} v ${t} h -${b}  z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${sectionInstance.degree})`);
      path.setAttributeNS(null, "id", `${sectionInstance.uniqid}`);
      path.setAttributeNS(null, "vector-effect", "non-scaling-stroke");

      if (sectionInstance.isActive) {
        path.classList.add("active");
      }

      svg.current.appendChild(path);

      return { sectionInstance, coords };
    }
  }

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
  }
  return (
    <StyledSectionLi>
      <h3 onClick={(e) => changeStatus(e)}>Швеллер</h3>

      <div>
        <select onChange={(e) => {
          const channel = channels.find(channel => channel._id === e.target.value);
          setChannel(channel);
        }}>
          <option>Выберите № швеллера</option>
          {channels.map(channel => <option value={channel._id} key={channel._id}>{channel.no}</option>)}
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
          sectionName={"channels"} 
          degree={degree}
          isBtnPointsActive={isBtnPointsActive} 
          setIdCoordInArray={setIdCoordInArray}
        />
      </div>
    </StyledSectionLi>
  )
}