import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledAddBeam } from "./AddBeam";
import { StyledAddChannel } from "./AddChannel";
import { StyledAddCorner } from "./AddCorner";
import { StyledAddRectangle } from "./AddRectangle";

function sectionСalculation({ className, children }) {
  const canvas = useRef(null);

  useEffect(() => {
    const ratio = window.devicePixelRatio;

    //здесь указывается расширение canvas 
    //т.е ширина и высота умножается на ratio (соотношение пикселей на устройстве)
    //изначально в canvas в ширине 600 содержится 600px
    //но из-за расширения устройства, теперь в ширине равно 600 могут находится, например, 1200px
    canvas.current.width = 600 * ratio;
    canvas.current.height = 300 * ratio;

    //здесь указываются размеры canvas
    canvas.current.style.width = "600px";
    canvas.current.style.height = "300px";

    canvas.current.getContext("2d").scale(ratio, ratio);
  }, [])

  function draw(func) {
    let ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.translate(canvas.current.width / 2, canvas.current.height / 2)
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";

    let currentX = 0;
    let currentY = 0;
    func(ctx, currentX, currentY)
  }

  return (
    <div className={className}>
      <Canvas ref={canvas} />
      <div>
        <ul>
          {<StyledAddBeam draw={draw} />}
          {<StyledAddChannel draw={draw} />}
          {<StyledAddCorner draw={draw} />}
          {<StyledAddRectangle draw={draw} />}
        </ul>
      </div>
    </div>
  )
}

export const StyledSectionСalculation = styled(sectionСalculation)`
  display: flex;
`

const Canvas = styled.canvas`
  border: 1px solid black;
/*   width: 600px;
  height: 300px; */
`