import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import StyledSourceGroup from "./SourceGroup";
import StyledResultGroup from "./ResultGroup";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../../redux/pointsModeSlice";
import StyledManageSections from "./ManageSections";
import { SVG } from "./styledComponents";
import { selectAllShapes } from "../../redux/shapeCollectionSlice";

function InputingData({className, setResult, result}) {
  const svg = useRef(null);
  const sourceGroup = useRef(null);
  const [viewBox, setViewBox] = useState(`0 0 800 600`);
  const [showCoords, setShowMode] = useState(true);
  const [shapeDataForCirclesMode, setShapeDataForCirclesMode] = useState(null);

  const arrayShapes = useSelector(state => selectAllShapes(state))

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeMode(arrayShapes.length ? true : false))
  }, [arrayShapes.length])

  async function submit(e) {
    e.preventDefault();

    const request = await fetch("http://localhost:3000/flatSection/", {
      method: "PUT",
      body: JSON.stringify(arrayShapes),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    const response = await request.json();
    setResult(response);
  }

  function setViewBoxSize(box) {
    const style = box.getBBox();

    if (!sourceGroup.current) {
      sourceGroup.current = box;
    }

    setViewBox(`${style.x-50} ${style.y-50} ${Math.round(style.width)+100} ${Math.round(style.height)+100}`);
  }

  function useShapeDataForCirclesMode(obj) {
    if (obj) {
      setShapeDataForCirclesMode(obj);
    }
  }

  useShapeDataForCirclesMode.getShapeData = () => shapeDataForCirclesMode;
  useShapeDataForCirclesMode.changeShapeData = () => setShapeDataForCirclesMode(null);

  const useSettingShowMode = () => setShowMode(!showCoords);
  useSettingShowMode.showCoords = () => showCoords;

  const resultGroup = !result 
    ? null 
    : <StyledResultGroup 
        arrayShapes={arrayShapes} 
        sourceGroup={sourceGroup} 
        result={result} 
      />

  return (
    <div className={className}>
      <SVG ref={svg} viewBox={viewBox}>
        <StyledSourceGroup 
          setViewBoxSize={setViewBoxSize} 
          useShapeDataForCirclesMode={useShapeDataForCirclesMode} 
          showCoords={showCoords} 
        />
        
        {resultGroup}
      </SVG>
      
      <StyledManageSections 
        submit={submit} 
        useShapeDataForCirclesMode={useShapeDataForCirclesMode} 
        useSettingShowMode={useSettingShowMode}
        sourceGroup={sourceGroup}
      />
    </div>
  )
}

const StyledInputingData = styled(InputingData)`
  display: flex;
`

export default StyledInputingData;