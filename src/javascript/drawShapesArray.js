import uniqid from 'uniqid';
import Axis from './Axis';
import createCirclesInSvg from './addCirclesToSVG';

export default function drawShapesArray(sourceGroup, arrayShapes) {
  const style = getComputedStyle(sourceGroup.current);

  const auxiliaryProps = auxiliaryCalc(arrayShapes, style);

  const sectionArr = arrayShapes.map(shape => {
    const relativeCenterX = auxiliaryProps.leftXLimit + (shape.centerX - auxiliaryProps.xLimits[0]);
    const relativeCenterY = auxiliaryProps.bottomYLimit + (shape.centerY - auxiliaryProps.yLimits[0]);

    createCirclesInSvg(shape);

    return {
      id: shape.id,
      relativeCenterX,
      relativeCenterY
    }
  })

  return { auxiliaryProps, sectionArr }
}

function auxiliaryCalc(arrayShapes, style) {
  const centerXWindow = parseFloat(style.width) / 2;
  const centerYWindow = parseFloat(style.height) / 2;

  const arrayCentersCoordsX = arrayShapes.map(obj => obj.centerX);
  const arrayCentersCoordsY = arrayShapes.map(obj => obj.centerY);

  const xLimits = [Math.min(...arrayCentersCoordsX), Math.max(...arrayCentersCoordsX)];
  const yLimits = [Math.min(...arrayCentersCoordsY), Math.max(...arrayCentersCoordsY)];
  const leftXLimit = centerXWindow - (xLimits[1] - xLimits[0])/2;
  const bottomYLimit = centerYWindow - (yLimits[1] - yLimits[0])/2;

  return { xLimits, yLimits, leftXLimit, bottomYLimit }
}

function drawCommonAxis(shape, sourceGroup, id) {
  const styleObj = sourceGroup.current.getBBox();
  let arr = [];

  if (styleObj.width * styleObj.height) {
    const commonAxes = [
      {x: shape.relativeCenterX},
      {y: shape.relativeCenterY} 
    ];
  
    arr = createAxisArray({commonAxes, id, styleObj});
    arr.forEach(axis => axis.changeLength(15));
  }
  return arr;
}

function createAxisArray({commonAxes, mainAxes, id, result, styleObj}) {
  if (commonAxes) {
    return commonAxes.map(obj => new Axis(obj, id, styleObj))
  } else {
    const axesName = ['Yсл', 'Xсл','Yc', 'Xc', 'V', 'U'];
    const axes = mainAxes.map(obj => new Axis(obj, id, styleObj));

    return axes.reduce((prev, curr, id) => {
      if (id < axes.length - 1) {
        return [...prev, Object.assign(curr, {axisName: axesName[id]})]
      } else {
        const [maxAxis, minAxis] = (result.moments.Ix.value > result.moments.Iy.value) 
          ? [curr, prev.find(elem => elem.axisName == "Yc")]
          : [prev.find(elem => elem.axisName == "Yc"), curr]

        const prototype = Object.getPrototypeOf(curr);

        return [
          ...prev,
          Object.assign(Object.create(prototype), curr, {axisName: axesName[id]}),
          Object.assign(Object.create(prototype), maxAxis, {axisName: axesName[id+1]}),
          Object.assign(Object.create(prototype), minAxis, {axisName: axesName[id+2]}),
        ]
      }
    }, [])
  }
}

function drawMainAxis(arrayShapes, sourceGroup, result) {
  const style = getComputedStyle(sourceGroup.current);
  const { xLimits, yLimits, leftXLimit, bottomYLimit } = auxiliaryCalc(arrayShapes, style);
  
  const styleObj = sourceGroup.current.getBBox();
  const relativeCenterX = leftXLimit + result.centerOfGravity.value.Xc;
  const relativeCenterY = bottomYLimit + result.centerOfGravity.value.Yc;

  const mainAxes = [
    {x: leftXLimit},
    {y: bottomYLimit},
    {x: relativeCenterX},
    {y: relativeCenterY}
  ]

  const arr = createAxisArray({styleObj, mainAxes, result});
  arr.forEach(axis => axis.changeLength(30));
  return arr;
}

export { drawMainAxis, drawCommonAxis, createAxisArray, auxiliaryCalc };