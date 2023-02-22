import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MathJax } from "better-react-mathjax";
import StyledInputingData from "./InputingData";

function sectionСalculation({ className, children }) {
  const [result, setResult] = useState(null);

  return (
    <div>
      <StyledInputingData setResult={setResult} result={result} />
      {!result ? null : <StyledOutputingData result={result} />}
    </div>
  )
}

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
const StyledOutputingData = styled(OutputingData)`
  & mjx-frac {
    font-size: 140%;
  }
`