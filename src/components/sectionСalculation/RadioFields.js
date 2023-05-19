import React from "react";
import uniqid from 'uniqid';
import { useDispatch, useSelector } from "react-redux";
import { selectAllShapes } from "../../redux/shapeCollectionSlice";
import { changeMode } from "../../redux/pointsModeSlice";

export default function RadioFields({ drawShape, setBtnPointsStatus, useCenterX, useCenterY }) {
  let id;
  const name = uniqid();
  const isPointsModeActive = useSelector(state => state.pointsMode.value);
  const sections = useSelector(state => selectAllShapes(state));

  const dispatch = useDispatch();

  if (sections.length && !isPointsModeActive) {
    dispatch(changeMode(true));
  } else if (!sections.length && isPointsModeActive) {
    dispatch(changeMode(false));
  }

  return (
    <>
      <div>
        <label htmlFor={id = uniqid()}>Добавить по координатам центра тяжести</label>
        <input 
          type="radio" 
          name={name} 
          id={id} 
          readOnly 
          defaultChecked={true} 
          onChange={() => setBtnPointsStatus(false)}
        />

        <div>
          <p>Координаты центра тяжести</p>
          <label>x <input value={useCenterX()} onChange={(e) => useCenterX(e.target.value)} /></label>
          <label>y <input value={useCenterY()} onChange={(e) => useCenterY(e.target.value)} /></label>
              
          <input type="button" value="Добавить" onClick={() => drawShape(useCenterX(), useCenterY())} />
        </div>
      </div>

      <div>
        <label htmlFor={id = uniqid()}>Добавить по контрольным точкам</label>
        <input 
          type="radio" 
          name={name} 
          id={id} 
          readOnly 
          disabled={!isPointsModeActive ? true : false}
          onChange={() => setBtnPointsStatus(true)}
        />
      </div>
    </>
  )
}