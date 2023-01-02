import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledAddBeam } from "./AddBeam";
import { StyledAddChannel } from "./AddChannel";
import { StyledAddCorner } from "./AddCorner";
import { StyledAddRectangle } from "./AddRectangle";

function sectionСalculation({ className, children }) {
  const canvas = useRef(null);

  function draw(func) {
    let ctx = canvas.current.getContext("2d");
    ctx.strokeStyle = "white";

    let currentX = 10;
    let currentY = 10;
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
  width: 600px;
  height: 300px;
`