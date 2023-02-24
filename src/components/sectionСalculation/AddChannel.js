import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, selectAllChannels } from "../../redux/channelsSlice";
import createTextCoords from "../../javascript/addCoordText";
import changeStatus from "../../javascript/changeStatusInList";
import uniqid from 'uniqid';
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";

export default function AddChannel({ saveShape }) {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [channel, setChannel] = useState(null);
  const [degree, setDegree] = useState(0);

  const channels = useSelector(selectAllChannels);
  const status = useSelector(state => state.channels.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchChannels())
    }
  })

  function drawChannel() {
    const channelInstance = {
      ...channel,
      centerX: parseFloat(centerX), 
      centerY: parseFloat(centerY),
      degree,
      type: "channel",
      uniqid: uniqid() 
    }

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return channelInstance;
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const { h, b, s, t, z0, degree } = channelInstance;

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - z0*10}, ${relativeCenterY - h/2} h ${b} v ${t} h -${b - s} v ${h-2*t} h ${b - s} v ${t} h -${b}  z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${degree})`);
      path.setAttributeNS(null, "id", `${channelInstance.uniqid}`);

      svg.current.appendChild(path);

      const coords = [
        {x: -z0*10, y: h/2},
        {x: b - z0*10, y: h/2},
        {x: b - z0*10, y: -h/2},
        {x: -z0*10, y: -h/2} 
      ]

      createTextCoords(arguments, coords, degree);
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
          
        <div>
          <p>Координаты</p>
          <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
          <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
        </div>

        <button type="button" onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

        <Preview sectionName={"channels"} degree={degree} />

        <input type="button" value="Добавить" onClick={() => saveShape(drawChannel())} />
      </div>
    </StyledSectionLi>
  )
}