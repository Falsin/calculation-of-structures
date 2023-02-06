import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledAddBeam } from "./AddBeam";
import { StyledAddChannel } from "./AddChannel";
import { StyledAddEqualAnglesCorners } from "./AddEqualAnglesCorners";
import { StyledAddUnequalAnglesCorners } from "./AddUnequalAnglesCorners";
import { StyledAddRectangle } from "./AddRectangle";
import { MathJax } from "better-react-mathjax";

function sectionСalculation({ className, children }) {
  const [result, setResult] = useState(null)

  return (
    <div>
      <StyledInputingData setResult={setResult} />
      {!result ? null : <StyledOutputingData result={result} />}
    </div>
  )
}

function InputingData({className, children, setResult}) {
  const svg = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);

  const saveShape = (func) => setArrayShapes([...arrayShapes, func]);

  useEffect(() => {
    draw()
  }, [arrayShapes])

  function draw() {
    svg.current.replaceChildren();

    let style = getComputedStyle(svg.current);
    const centerXWindow = parseFloat(style.width) / 2;
    const centerYWindow = parseFloat(style.height) / 2;

    const arrayCentersCoordsX = arrayShapes.map(shapeFunc => {
      const shapeObj = shapeFunc();

      return shapeObj.centerX;
    })

    const arrayCentersCoordsY = arrayShapes.map(shapeFunc => {
      const shapeObj = shapeFunc();

      return shapeObj.centerY;
    })

    const xLimits = [Math.min(...arrayCentersCoordsX), Math.max(...arrayCentersCoordsX)];
    const yLimits = [Math.min(...arrayCentersCoordsY), Math.max(...arrayCentersCoordsY)];
    const leftXLimit = centerXWindow - (xLimits[1] - xLimits[0])/2;
    const bottomYLimit = centerYWindow - (yLimits[1] - yLimits[0])/2;

    arrayShapes.forEach((shape, id) => {
      shape(svg, leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]), bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]));
      
      drawAxes(svg, id, leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]), bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]));
    })
  }

  function drawAxes(svg, id, centerX, centerY) {
    let style = getComputedStyle(svg.current);
    const xmlns = "http://www.w3.org/2000/svg";

    const defs = document.createElementNS(xmlns, "defs");

    const marker = document.createElementNS(xmlns, "marker");
    marker.setAttributeNS(null, "id", `arrow`);
    marker.setAttributeNS(null, "markerWidth", `7`);
    marker.setAttributeNS(null, "markerHeight", `10`);
    marker.setAttributeNS(null, "refX", `3.5`);
    marker.setAttributeNS(null, "refY", `0`);

    const triangle = document.createElementNS(xmlns, "path");
    triangle.setAttributeNS(null, "d", `M 0, 0 l 3.5, 10 l 3.5, -10 z`);

    const verticalAxis = document.createElementNS(xmlns, "path");
    verticalAxis.setAttributeNS(null, "d", `M ${centerX}, 50 v ${parseFloat(style.height)-100}`);
    verticalAxis.setAttributeNS(null, "marker-end", "url(#arrow)");
    verticalAxis.setAttributeNS(null, "stroke", "black");

    const text = document.createElementNS(xmlns, "text");
    text.setAttributeNS(null, "x", `${centerX-15}`);
    text.setAttributeNS(null, "y", `${50+parseFloat(style.height)-100}`);
    text.setAttributeNS(null, "transform-origin", `${centerX} ${50+parseFloat(style.height)-100}`);
    text.setAttributeNS(null, "transform", `scale(1, -1)`);
    text.setAttributeNS(null, "text-anchor", `middle`);
    text.textContent = `Y${id+1}`

    const horisontalAxis =  document.createElementNS(xmlns, "path");
    horisontalAxis.setAttributeNS(null, "id", "horisontalAxis");
    horisontalAxis.setAttributeNS(null, "d", `M ${centerX}, 50 v ${parseFloat(style.height)-100}`);
    horisontalAxis.setAttributeNS(null, "marker-end", "url(#arrow)");
    horisontalAxis.setAttributeNS(null, "stroke", "black");
    horisontalAxis.setAttributeNS(null, "transform", `rotate(-90, ${centerX}, ${centerY})`);
    const text1 = document.createElementNS(xmlns, "text");
    text1.setAttributeNS(null, "text-anchor", `middle`);
    text1.setAttributeNS(null, "x", `${centerX}`);
    text1.setAttributeNS(null, "y", `${centerY}`);
    text1.setAttributeNS(null, "transform-origin", `${centerX} ${centerY}`);
    text1.setAttributeNS(null, "transform", `scale(1 -1) translate(${(50+parseFloat(style.height)-100-centerY)} -5)`);
  
    text1.textContent = `X${id+1}`;

    svg.current.appendChild(defs);
    defs.appendChild(marker);
    marker.appendChild(triangle);
    svg.current.appendChild(verticalAxis);
    svg.current.appendChild(text);
    svg.current.appendChild(horisontalAxis);
    svg.current.appendChild(text1)
  }
  


  async function submit(e) {
    e.preventDefault();

    const request = await fetch("http://localhost:3000/flatSection/", {
      method: "PUT",
      body: JSON.stringify(arrayShapes.map(item => item())),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    const response = await request.json();
    setResult(response)
  }

  return (
    <div className={className}>
      <SVG ref={svg} transform="scale(1, -1)" />
      <form onSubmit={submit}>
        <ul>
          {<StyledAddBeam saveShape={saveShape} />}
          {<StyledAddChannel saveShape={saveShape} />}
          {<StyledAddEqualAnglesCorners saveShape={saveShape} />}
          {<StyledAddUnequalAnglesCorners saveShape={saveShape} />}
          {<StyledAddRectangle saveShape={saveShape} />}
        </ul>

        <button>рассчитать</button>
      </form>
    </div>
  )
}

const StyledInputingData = styled(InputingData)`
  display: flex;
`

function OutputingData({result, className, children}) {
  console.log(result)
  return (
    <div className={className}>
      <MathJax>
        <ol>
          <li>
            <p>Найдем координаты центра тяжести сложного сечения:</p>
            <div>{result.centerOfGravity.mathStringX}</div>
            <div>{result.centerOfGravity.mathStringY}</div>
          </li>

          <li>
            <p>Найдем величины осевых и центробежных моментов инерции сечения относительно центральных осей Xc Yc:</p>
            <div>{result.Ix.mathString}</div>
            <div>{result.Iy.mathString}</div>
            <div>{result.Ixy.mathString}</div>
          </li>

          <li>
            <p>Определим угол наклона главных центральных осей V и U к осям Xc и Yc:</p>
            <div>{result.degree.tangent}</div>
            <div>{result.degree.degree}</div>
            {result.degree.value == 0
              ? <p>Так как угол α = 0, положение главных центральных осей V и U совпадает 
                  с осями Xc и Yc. При этом ось максимума (V) соответствует оси Xc.</p>
              : <p>Поворачивая оси Xс и Yс {result.degree.value > 0 ? 'против' : 'по'} часовой стрелки на угол α = {result.degree.value > 0 ? result.degree.value : result.degree.value * -1}, получаем положение главных центральных осей</p>
            }
          </li>

          {result.degree.value == 0 
            ? null 
            : <li>
                <p>Найдем величины моментов инерции относительно главных центральных осей:</p>
                <div>{result.commonFormulaString}</div>
                <p>Подставив числовые значения, получим:</p>
                <div>{result.Imax.mathString}</div>
                <div>{result.Imin.mathString}</div>
                <p>Ось максимума (V) наклонена под меньшим углом к той из центральных осей, 
                  относительно которой центральный момент инерции сечения больше.</p>
                <p>Выполним проверку по равенству:</p>
                <div>{`\\(I_{max}+I_{min}=I_x + I_y\\)`}</div>
                <div>{`\\(${result.Imax.value}+${result.Imin.value}=${result.Ix.value} + ${result.Iy.value}\\)`}</div>
                <p>Следовательно, задача решена верно.</p>
              </li>
          }
        </ol>
      </MathJax>
    </div>
  )
}

export const StyledSectionСalculation = styled(sectionСalculation)`
  & > div {
    display: flex;
  }
`

const SVG = styled.svg`
  width: 600px;
  height: 300px;
  border: 1px solid black;
`

const StyledOutputingData = styled(OutputingData)`
  & mjx-frac {
    font-size: 140%;
  }
`