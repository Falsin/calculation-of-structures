import React from "react";
import uniqid from 'uniqid';
import { useSelector } from "react-redux";

export default function RadioFields({ drawShape, setBtnPointsStatus, useCenterX, useCenterY }) {
  let id;
  const name = uniqid();
  const isPointsModeActive = useSelector(state => state.pointsMode.value)

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