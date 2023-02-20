import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledAddBeam } from "./AddBeam";
import { StyledAddChannel } from "./AddChannel";
import { StyledAddEqualAnglesCorners } from "./AddEqualAnglesCorners";
import { StyledAddUnequalAnglesCorners } from "./AddUnequalAnglesCorners";
import { StyledAddRectangle } from "./AddRectangle";
import { MathJax } from "better-react-mathjax";
import drawShapesArray from "../../javascript/drawShapesArray";
import uniqid from 'uniqid';

function sectionСalculation({ className, children }) {
  const [result, setResult] = useState(null);

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

    drawShapesArray(svg, arrayShapes, result)
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
    setResult(response);
  }

  function changeStatus(e) {
    if (e.currentTarget.className == "active") {
      e.currentTarget.classList.remove("active")
    } else {
      e.currentTarget.classList.add("active")
    }
  }

  function changeActiveSection(shape) {
    const path = document.getElementById(shape.uniqid);
    path.classList.toggle("active");
  }


  return (
    <div className={className}>
      <SVG ref={svg} transform="scale(1, -1)" />
      <form onSubmit={submit}>
        <ul>
          <li>
            <h2 onClick={(e) => changeStatus(e)}>Простые сечения</h2>
            
            <ul>
              {<StyledAddBeam saveShape={saveShape} />}
              {<StyledAddChannel saveShape={saveShape} />}
              {<StyledAddEqualAnglesCorners saveShape={saveShape} />}
              {<StyledAddUnequalAnglesCorners saveShape={saveShape} />}
              {<StyledAddRectangle saveShape={saveShape} />}
            </ul>
          </li>

          <li>
            <h2 onClick={(e) => changeStatus(e)}>Состав сечения ({arrayShapes.length})</h2>

            {!arrayShapes.length 
              ? <p>Вы ещё не добавили ни одного сечения</p>
              : <ul>
                  {arrayShapes.map(elem => {
                    const shape = elem();
                    const keys = ["centerX", "centerY", "degree"];
                    const sectionNames = {
                      beam: "Двутавр",
                      channel: "Швеллер",
                      equalAnglesCorner: "Равнополочный уголок",
                      unequalAnglesCorner: "Неравнополочный уголок",
                      rectangle: "Прямоугольное сечение"
                    }

                    return <li style={{border: "solid 1px black"}} 
                      onMouseEnter={() => changeActiveSection(shape)}
                      onMouseLeave={() => changeActiveSection(shape)}
                    >
                      <h3 onClick={(e) => changeStatus(e)}>{sectionNames[shape.type]}</h3>
                      <ul>
                        {keys.map(key => <li>{key}: {shape[key]}</li>)}
                      </ul>

                      <button onClick={() => {
                          const filteredArray = arrayShapes.filter(func => func().uniqid != shape.uniqid);
                          setArrayShapes(filteredArray)
                        }} type="button">Удалить</button>
                    </li>
                  })}
                </ul>
            }
          </li>
        </ul>

        <button>рассчитать</button>
      </form>
    </div>
  )
}

const StyledInputingData = styled(InputingData)`
  display: flex;

  h2 {
    margin: 0;
  }

  li > h2 ~ ul,
  li > h3 ~ ul {
    overflow: hidden;
    max-height: 0;
    padding: 0;
    transition-timing-function: linear;
    transition: 1s;
  }

  li > h2.active ~ ul,
  li > h3.active ~ ul {
    max-height: 1000px;
    margin-top: 10px;
  }
`

function OutputingData({result, className, children}) {
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

  path.active {
    stroke: red;
  }
`

const StyledOutputingData = styled(OutputingData)`
  & mjx-frac {
    font-size: 140%;
  }
`