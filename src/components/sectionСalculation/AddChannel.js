import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, selectAllChannels } from "../../redux/channelsSlice";
import changeStatus from "../../javascript/changeStatusInList";
import { StyledSectionLi } from "./styledComponents";
import Preview from "./Preview";
import RadioFields from "./RadioFields";
import { Channel } from "../../javascript/Section";

export default function AddChannel({ useShapeDataForCirclesMode, saveShape, isPointsModeActive }) {
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
      useShapeDataForCirclesMode({
        shape: new Channel(centerX, centerY, degree, channel),
        shapeId: idCoordInArray
      })
    }
  }, [idCoordInArray])

  useEffect(() => {
    if (!isBtnPointsActive && idCoordInArray !== null) {
      setIdCoordInArray(null)
    }
  }, [isBtnPointsActive])

  useEffect(() => {
    if (useShapeDataForCirclesMode.getShapeData() == null) {
      setIdCoordInArray(null)
    }
  }, [useShapeDataForCirclesMode.getShapeData])

  const drawShape = (centerX, centerY) => saveShape(new Channel(centerX, centerY, degree, channel));

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