import React from "react";
import styled from "styled-components";
import { MathJax } from "better-react-mathjax";

function OutputingData({result, className, children}) {
  const centerOfGravity = <li>
    <p>Найдем координаты центра тяжести сложного сечения:</p>
    <div>{result.centerOfGravity.mathStringX}</div>
    <div>{result.centerOfGravity.mathStringY}</div>
  </li>

  const moments = <li>
    <p>Найдем величины осевых и центробежных моментов инерции сечения относительно центральных осей Xc Yc:</p>
    {result.moments.information.map(elem => <div>{elem}</div>)}
    <div>{result.moments.Ix.mathString}</div>
    <div>{result.moments.Iy.mathString}</div>
    <div>{result.moments.Ixy.mathString}</div>
  </li>

  const degreeMainAxes = <li>
    <p>Определим угол наклона главных центральных осей V и U к осям Xc и Yc:</p>
    <div>{result.degree.tangent}</div>
    <div>{result.degree.degree}</div>
    {result.degree.value == 0
      ? <p>Так как угол α = 0, положение главных центральных осей V и U совпадает 
          с осями Xc и Yc. При этом ось максимума (V) соответствует оси Xc.</p>
      : <p>Поворачивая оси Xс и Yс {result.degree.value > 0 ? 'против' : 'по'} 
          часовой стрелки на угол α = {result.degree.value > 0 ? result.degree.value : result.degree.value * -1}, 
          получаем положение главных центральных осей</p>
    }
  </li>

  const mainMoments = result.degree.value == 0 
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

  return (
    <div className={className}>
      <MathJax>
        <ol>
          {centerOfGravity}
          {moments}
          {degreeMainAxes}
          {mainMoments}
        </ol>
      </MathJax>
    </div>
  )
}

const StyledOutputingData = styled(OutputingData)`
  & mjx-frac {
    font-size: 140%;
  }
`

export default StyledOutputingData;