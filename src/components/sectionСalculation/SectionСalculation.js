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
      <StyledInputingData setResult={setResult} result={result} />
      {!result ? null : <StyledOutputingData result={result} />}
    </div>
  )
}

function InputingData({className, children, setResult, result}) {
  const svg = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);

  const saveShape = (func) => setArrayShapes([...arrayShapes, func]);

  useEffect(() => {
    draw()
  }, [arrayShapes, result])

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
      const relativeCenterX = leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]);
      const relativeCenterY = bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]);

      shape(svg, relativeCenterX, relativeCenterY);

      if (result && result.auxiliaryAxes.x == arrayCentersCoordsX[id]) {
        drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.85, "Yсл");
      }

      if (result && result.auxiliaryAxes.y == arrayCentersCoordsY[id]) {
        drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.85, relativeCenterY, "Xсл");
      }

      drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.2, relativeCenterX, parseFloat(style.height)*0.8, `Y${id+1}`);
      drawAxis(svg, parseFloat(style.width)*0.2, relativeCenterY, parseFloat(style.width)*0.8, relativeCenterY, `X${id+1}`);
    })

    if (result) {
      const relativeCenterX = leftXLimit + result.centerOfGravity.value.Xc;
      const relativeCenterY = bottomYLimit + result.centerOfGravity.value.Yc;

      drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.9, `Yc`);
      drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.9, relativeCenterY, `Xc`);
      
      let obj;

      if (result.degree.value <= 45 && result.degree.value >= -45) {
        obj =  drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.9, `${result.moments.Ix.value > result.moments.Iy.value ? 'U' : 'V'}`);
        rotate(relativeCenterX, relativeCenterY, obj.line, obj.text, result.degree.value, parseFloat(style.height)*0.9, "vertical")
      
        obj =  drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.9, relativeCenterY, `${result.moments.Ix.value > result.moments.Iy.value ? 'V' : 'U'}`);
        rotate(relativeCenterX, relativeCenterY, obj.line, obj.text, result.degree.value, parseFloat(style.width)*0.9, "horizontal")
      } else {
        obj =  drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.9, `${result.moments.Ix.value > result.moments.Iy.value ? 'V' : 'U'}`);
        rotate(relativeCenterX, relativeCenterY, obj.line, obj.text, result.degree.value, parseFloat(style.height)*0.9, "vertical")
      
        obj =  drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.9, relativeCenterY, `${result.moments.Ix.value > result.moments.Iy.value ? 'U' : 'V'}`);
        rotate(relativeCenterX, relativeCenterY, obj.line, obj.text, result.degree.value, parseFloat(style.width)*0.9, "horizontal")
      }
    }
  }

  function drawAxis(svg, x1, y1, x2, y2, axisName) {
    const xmlns = "http://www.w3.org/2000/svg";

    const defs = document.createElementNS(xmlns, "defs");

    const marker = document.createElementNS(xmlns, "marker");
    marker.setAttributeNS(null, "id", `arrowhead${axisName}`);
    marker.setAttributeNS(null, "markerWidth", "8");
    marker.setAttributeNS(null, "markerHeight", "10");
    marker.setAttributeNS(null, "refX", "4");
    marker.setAttributeNS(null, "refY", "0");
    marker.setAttributeNS(null, "stroke", "black");
    marker.setAttributeNS(null, "orient", `${x1 == x2 ? '0' : '-90'}`);

    const triangle = document.createElementNS(xmlns, "path");
    triangle.setAttributeNS(null, "d", `M 0.5, 0 l 3.5 10 l 3.5 -10`);
    triangle.setAttributeNS(null, "stroke", "black");

    marker.appendChild(triangle);
    defs.appendChild(marker);
    svg.current.appendChild(defs)

    const line = document.createElementNS(xmlns, "path");
    line.setAttributeNS(null, "d", `M ${x1}, ${y1} L ${x2}, ${y2}`);
    line.setAttributeNS(null, "marker-end", `url(#arrowhead${axisName}`);
    line.setAttributeNS(null, "stroke", "black");

    const text = document.createElementNS(xmlns, "text");
    text.setAttributeNS(null, "x", `${x2}`);
    text.setAttributeNS(null, "y", `${y2-10}`);
    text.setAttributeNS(null, "transform-origin", `${x2} ${y2}`);
    text.setAttributeNS(null, 'transform', `scale(1, -1)`);
    text.setAttributeNS(null, "text-anchor", `middle`);
    text.textContent = axisName;

    svg.current.appendChild(line);
    svg.current.appendChild(text);

    return { line, text }
  }

  function rotate(x, y, line, text, degree, endPoint, orientation) {
    line.setAttributeNS(null, 'transform', `rotate(${degree}, ${x}, ${y})`);

    const rad = (90 - (degree >= 0 ? degree : degree * -1)) * Math.PI / 180;
    const sinX = rad**5/120 - rad**3/6 + rad;
    const lineLength = (orientation == "vertical") ? endPoint - y : endPoint - x;

    let alphaY = sinX * lineLength;
    let alphaX = Math.sqrt(lineLength**2 - alphaY**2);

    if (orientation == "vertical") {
      text.setAttributeNS(null, 'x', `${degree > 0 ? x-alphaX : x+alphaX}`);
      text.setAttributeNS(null, 'y', `${y+alphaY}`);
    } else {
      text.setAttributeNS(null, 'x', `${x+alphaY}`);
      text.setAttributeNS(null, 'y', `${degree > 0 ? y-alphaX-8 : y+alphaX-8}`);
    }
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
    console.log(response)
    setResult(response);
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
            {result.moments.information.map(elem => <div>{elem}</div>)}
            <div>{result.moments.Ix.mathString}</div>
            <div>{result.moments.Iy.mathString}</div>
            <div>{result.moments.Ixy.mathString}</div>
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
                <div>{`\\(${result.Imax.value}+${result.Imin.value}=${result.moments.Ix.value} + ${result.moments.Iy.value}\\)`}</div>
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
  width: 800px;
  height: 600px;
  border: 1px solid black;
`

const StyledOutputingData = styled(OutputingData)`
  & mjx-frac {
    font-size: 140%;
  }
`