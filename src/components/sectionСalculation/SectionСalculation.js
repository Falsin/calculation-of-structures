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
        drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.9, "Yсл");
      }

      if (result && result.auxiliaryAxes.y == arrayCentersCoordsY[id]) {
        drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.9, relativeCenterY, "Xсл");
      }

      drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.2, relativeCenterX, parseFloat(style.height)*0.8, `Y${id+1}`);
      drawAxis(svg, parseFloat(style.width)*0.2, relativeCenterY, parseFloat(style.width)*0.8, relativeCenterY, `X${id+1}`);
    })

    if (result) {
      drawAxis(svg, leftXLimit + result.centerOfGravity.value.Xc, parseFloat(style.height)*0.1, leftXLimit + result.centerOfGravity.value.Xc, parseFloat(style.height)*0.9, `Yc`);
      drawAxis(svg, parseFloat(style.width)*0.1, bottomYLimit + result.centerOfGravity.value.Yc, parseFloat(style.width)*0.9, bottomYLimit + result.centerOfGravity.value.Yc, `Xc`);
      

      let obj;

      obj =  drawAxis(svg, leftXLimit + result.centerOfGravity.value.Xc, parseFloat(style.height)*0.1, leftXLimit + result.centerOfGravity.value.Xc, parseFloat(style.height)*0.9, `V`);
      rotate(svg, leftXLimit + result.centerOfGravity.value.Xc, bottomYLimit + result.centerOfGravity.value.Yc, obj.line, obj.text, result.degree.value, parseFloat(style.height)*0.9, "vertical")
      
      obj =  drawAxis(svg, parseFloat(style.width)*0.1, bottomYLimit + result.centerOfGravity.value.Yc, parseFloat(style.width)*0.9, bottomYLimit + result.centerOfGravity.value.Yc, `U`);
      rotate(svg, leftXLimit + result.centerOfGravity.value.Xc, bottomYLimit + result.centerOfGravity.value.Yc, obj.line, obj.text, result.degree.value, parseFloat(style.width)*0.9, "horizontal")
      /* { line, text } = rotate(svg, leftXLimit + result.centerOfGravity.value.Xc, bottomYLimit + result.centerOfGravity.value.Yc, line, text, result.degree.value, parseFloat(style.width)*0.9) */
    }

    /* arrayShapes.forEach((shape, id) => {
      const relativeCenterX = leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]);
      const relativeCenterY = bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]);

      if (result && result.auxiliaryAxes.y == arrayCentersCoordsY[id]) {
        drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.9, relativeCenterY, "Xсл", 0);
        drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY + result.centerOfGravity.value.Yc, parseFloat(style.width)*0.9, relativeCenterY  + result.centerOfGravity.value.Yc, "Xc", 0);
        const { line, triangle, text } = drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY + result.centerOfGravity.value.Yc, parseFloat(style.width)*0.9, relativeCenterY  + result.centerOfGravity.value.Yc, "V", result.degree.value, relativeCenterX + result.centerOfGravity.value.Xc);
        rotate(line, leftXLimit + result.centerOfGravity.value.Xc, bottomYLimit + result.centerOfGravity.value.Yc, result.degree.value)
      }

      if (result && result.auxiliaryAxes.x == arrayCentersCoordsX[id]) {
        drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.9, "Yсл", 0);
        drawAxis(svg, relativeCenterX + result.centerOfGravity.value.Xc, parseFloat(style.height)*0.1, relativeCenterX + result.centerOfGravity.value.Xc, parseFloat(style.height)*0.9, "Yc", 0);
        console.log(result);
      }

      shape(svg, relativeCenterX, relativeCenterY);
    
      drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.2, relativeCenterX, parseFloat(style.height)*0.8, `Y${id+1}`, 0);
      drawAxis(svg, parseFloat(style.width)*0.2, relativeCenterY, parseFloat(style.width)*0.8, relativeCenterY, `X${id+1}`, 0);
    }) */
  }

  function drawAxis(svg, x1, y1, x2, y2, axisName) {
    let style = getComputedStyle(svg.current);
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

/*     const point = document.createElementNS(xmlns, "path");
    point.setAttributeNS(null, "id", `path${axisName}`);
    point.setAttributeNS(null, "d", `M ${x2}, ${y2} h 20`);
    point.setAttributeNS(null, "stroke", "black");
    point.setAttributeNS(null, "stroke-width", "0"); */

    const text = document.createElementNS(xmlns, "text");
    text.setAttributeNS(null, "x", `${x2}`);
    text.setAttributeNS(null, "y", `${y2-5}`);
    text.setAttributeNS(null, "transform-origin", `${x2} ${y2}`);
    text.setAttributeNS(null, 'transform', `scale(1, -1)`);
    text.setAttributeNS(null, "text-anchor", `middle`);
    text.textContent = axisName;

    //const textPath = document.createElementNS(xmlns, "textPath");
    //textPath.setAttributeNS(null, "transform-origin", `${x2-5} ${y2-5}`);
    //textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#path${axisName}`);
    //textPath.setAttributeNS(null, "transform", `rotate(90, ${x2}, ${y2})`);
    //textPath.textContent = axisName;
    //text.textContent = axisName;
    //text.appendChild(textPath)


    svg.current.appendChild(line);
    svg.current.appendChild(text);

    return { line, text }
  }

  function rotate(svg, x, y, line, text, degree, endPoint, orientation) {
    let style = getComputedStyle(svg.current);
    line.setAttributeNS(null, 'transform', `rotate(${degree}, ${x}, ${y})`);
    //circle.setAttributeNS(null, 'transform', `rotate(${degree}, ${x}, ${y})`);

    console.log(getComputedStyle(svg.current))

    const rad = (90 - (degree * -1)) * Math.PI / 180;
    const sinX = rad - rad**3/6;
    const distX = endPoint - x;
    const lineLength = (orientation == "vertical") ? endPoint - y : endPoint - x;

    const alphaY = sinX * lineLength;
    const alphaX = Math.sqrt(lineLength**2 - alphaY**2);
    console.log(alphaX)

/*     text.setAttributeNS(null, 'x', `${x+alphaX}`);
    text.setAttributeNS(null, 'y', `${y+alphaY}`); */
    text.setAttributeNS(null, 'x', `${(orientation == "vertical") ? x+alphaX : x+alphaY}`);
    text.setAttributeNS(null, 'y', `${(orientation == "vertical") ? y+alphaY : y+alphaX}`);
  
  }

/*   function drawAxis(svg, x1, y1, x2, y2, nameAxis) {
    const xmlns = "http://www.w3.org/2000/svg";

    const line = document.createElementNS(xmlns, "path");
    line.setAttributeNS(null, "d", `M ${x1}, ${y1} L ${x2} ${y2}`);
    line.setAttributeNS(null, "stroke", "black");

    const triangle = document.createElementNS(xmlns, "path");
    triangle.setAttributeNS(null, "d", `M ${x2}, ${y2} h -3.5 l 3.5, 10 l 3.5, -10 h -3.5`);

    if (x1 != x2) {
      triangle.setAttributeNS(null, "transform", `rotate(-90, ${x2}, ${y2})`);
    }

    const text = document.createElementNS(xmlns, "text");

    text.setAttributeNS(null, "x", `${x2}`);
    text.setAttributeNS(null, "y", `${y2}`);
    text.setAttributeNS(null, "transform-origin", `${x2-5} ${y2+5}`);
    text.setAttributeNS(null, "transform", `scale(1, -1)`);
    text.setAttributeNS(null, "text-anchor", `middle`);
    text.textContent = nameAxis;

    svg.current.appendChild(line);
    svg.current.appendChild(triangle);
    svg.current.appendChild(text);

    return { line, triangle, text }
  } */

/*   function rotate(elem, x, y, degree) {
    elem.setAttributeNS(null, "transform", `rotate(${degree}, ${x}, ${y})`);
  } */

/*   function drawAxis(svg, relativeCenterX, relativeCenterY, nameAxis, degree, X) {
    const xmlns = "http://www.w3.org/2000/svg";

    const defs = document.createElementNS(xmlns, "defs");

    const marker = document.createElementNS(xmlns, "marker");
    marker.setAttributeNS(null, "id", "arrowhead");
    marker.setAttributeNS(null, "markerWidth", "7");
    marker.setAttributeNS(null, "markerHeight", "10");
    marker.setAttributeNS(null, "refX", "-3.5");
    marker.setAttributeNS(null, "refY", "0");
    marker.setAttributeNS(null, "orient", "auto");

    defs.appendChild(marker);

    const line = document.createElementNS(xmlns, "path");

  } */

  /* function drawAxis(svg, x1, y1, x2, y2, nameAxis, degree, X) {
    const xmlns = "http://www.w3.org/2000/svg";

    const line = document.createElementNS(xmlns, "path");
    line.setAttributeNS(null, "d", `M ${x1}, ${y1} L ${x2} ${y2}`);
    line.setAttributeNS(null, "stroke", "black");

    const triangle = document.createElementNS(xmlns, "path");
    triangle.setAttributeNS(null, "d", `M ${x2}, ${y2} h -3.5 l 3.5, 10 l 3.5, -10 h -3.5`);

    if (x1 != x2) {
      triangle.setAttributeNS(null, "transform", `rotate(-90, ${x2}, ${y2})`);
    }

    const text = document.createElementNS(xmlns, "text");

    text.setAttributeNS(null, "x", `${x2}`);
    text.setAttributeNS(null, "y", `${y2}`);
    text.setAttributeNS(null, "transform-origin", `${x2-5} ${y2+5}`);
    text.setAttributeNS(null, "transform", `scale(1, -1)`);
    text.setAttributeNS(null, "text-anchor", `middle`);
    text.textContent = nameAxis;

    svg.current.appendChild(line);
    svg.current.appendChild(triangle);
    svg.current.appendChild(text);

    if (X) {
      line.setAttributeNS(null, "transform", `rotate(${degree}, ${X}, ${y1})`);
      triangle.setAttributeNS(null, "transform", `rotate(${degree}, ${X}, ${y1}) rotate(${-90}, ${x2}, ${y2})`);
      //text.setAttributeNS(null, "transform-origin", `${X} ${y1}`);
      //text.setAttributeNS(null, "transform", `rotate(${-degree}, ${X}, ${y1})`);
    }
  } */
  
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