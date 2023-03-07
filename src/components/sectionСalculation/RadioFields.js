import React from "react";
import uniqid from 'uniqid';

export default function RadioFields({ drawShape, setBtnPointsStatus, isPointsModeActive, centerX, setCenterX, centerY, setCenterY }) {
  let id;
  const name = uniqid();

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
          <label>x <input value={centerX} onChange={(e) => setCenterX(e.target.value)} /></label>
          <label>y <input value={centerY} onChange={(e) => setCenterY(e.target.value)} /></label>
              
          <input type="button" value="Добавить" onClick={() => drawShape(centerX, centerY)} />
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