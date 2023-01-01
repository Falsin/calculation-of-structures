import React, { useEffect, useRef, useState } from "react";
import AddBeam from "./AddBeam";

export default function sectionСalculation() {
  const canvas = useRef(null);

  function draw(func) {
    let ctx = canvas.current.getContext("2d");
    let currentX = 10;
    let currentY = 10;
    func(ctx, currentX, currentY)
  }

  return (
    <div style={{display: "flex"}}>
      <canvas id="canvas" style={{border: "1px solid black", width: "150", height: "150"}} ref={canvas}></canvas>
      <div>
        <ul>
          {<AddBeam draw={draw} />}
          <li>Швеллер</li>
          <li>Угол</li>
          <li>Пластина</li>
        </ul>
      </div>
    </div>
  )
}