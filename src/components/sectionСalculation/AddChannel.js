import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, selectAllChannels } from "../../redux/channelsSlice";
import styled from "styled-components";

function AddChannel({ saveShape, className, children }) {
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);
  const [channel, setChannel] = useState(null);

  const channels = useSelector(selectAllChannels);
  const status = useSelector(state => state.channels.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchChannels())
    }
  })

  function drawChannel(channel, coordX, coordY) {
    const { h, b, s, t } = channel;

    return function (svg, startPointX, startPointY) {
      if (svg === undefined) {
        return { ...channel, coordX, coordY, type: "channel" }
      }

      const xmlns = "http://www.w3.org/2000/svg";
      const currentX = startPointX + coordX;
      const currentY = startPointY + coordY;

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${currentX}, ${currentY} h ${b} v ${t} h -${b - s} v ${h-2*t} h ${b - s} v ${t} h -${b}  z`)
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
      <p>Швеллер</p>

      <select onChange={(e) => {
        const channel = channels.find(channel => channel._id === e.target.value);
        setChannel(channel);
      }}>
        <option>Выберите № швеллера</option>
        {channels.map(channel => <option value={channel._id} key={channel._id}>{channel.no}</option>)}
      </select>
        
      <div>
        <p>Координаты</p>
        <label>x <input value={coordX} onChange={(e) => convertToNumber(e, setCoordX)} /></label>
        <label>y <input value={coordY} onChange={(e) => convertToNumber(e, setCoordY)} /></label>
      </div>

      <input type="button" value="Добавить" onClick={() => saveShape(drawChannel(channel, coordX, coordY))} />
    </li>
  )
}

export const StyledAddChannel = styled(AddChannel)`
  & > label, & > input {
    display: block;
  }

  div input {
    width: 40px;
  }
`