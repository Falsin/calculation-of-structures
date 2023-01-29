import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, selectAllChannels } from "../../redux/channelsSlice";
import styled from "styled-components";

function AddChannel({ saveShape, className, children }) {
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

  function drawChannel(channel, centerX, centerY, degree) {
    const { h, b, s, t, z0 } = channel;

    return function (svg, relativeCenterX, relativeCenterY) {
      if (svg === undefined) {
        return { ...channel, centerX, centerY, type: "channel", degree }
      }

      const xmlns = "http://www.w3.org/2000/svg";

      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", `M ${relativeCenterX - z0*10}, ${relativeCenterY - h/2} h ${b} v ${t} h -${b - s} v ${h-2*t} h ${b - s} v ${t} h -${b}  z`)
      path.setAttributeNS(null, "fill", "white");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
      path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${degree})`);

      svg.current.appendChild(path);
    }
  }

  function convertToNumber(e, setState) {
    const value = e.target.value;
    setState((value[value.length - 1] === ".") ? value : parseFloat(value))
  }

  function changeOrientation() {
    setDegree(degree == 270 ? 0 : degree + 90);
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
        <label>x <input value={centerX} onChange={(e) => convertToNumber(e, setCenterX)} /></label>
        <label>y <input value={centerY} onChange={(e) => convertToNumber(e, setCenterY)} /></label>
      </div>

      <button onClick={changeOrientation}>{degree == 0 ? "Повернуть на 90°" : "Повернуть на 90°"}</button>

      <Preview degree={degree} />

      <input type="button" value="Добавить" onClick={() => saveShape(drawChannel(channel, centerX, centerY, degree))} />
    </li>
  )
}

function Preview({degree}) {
  const svg = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const channel = useSelector(state => state.channels.channels[0]);
  const {h, b, s, t} = !channel ? {} : channel;

  useEffect(() => {
    const style = getComputedStyle(svg.current);
    setWidth(parseFloat(style.width))
    setHeight(parseFloat(style.height))
  })

  return (
    <svg ref={svg}>
      {!channel 
        ? null 
        : <path 
          d={`M ${width/2 - b/2}, ${height/2 - h/2} h ${b} v ${t} h -${b - s} v ${h-2*t} h ${b - s} v ${t} h -${b}  z`} 
          transform={`rotate(${degree}, ${width/2}, ${height/2})`}
          fill="white" 
          stroke="black"  
        />
      }
    </svg>
  )
}

export const StyledAddChannel = styled(AddChannel)`
  div input {
    width: 40px;
  }
`