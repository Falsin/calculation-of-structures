import uniqid from 'uniqid';
import Axis from './Axis';
import createCirclesInSvg from './addCirclesToSVG';

export default function drawShapesArray(sourceGroup, arrayShapes) {
  const style = getComputedStyle(sourceGroup.current);

  const auxiliaryProps = auxiliaryCalc(arrayShapes, style);

  return arrayShapes.map(shape => {
    const relativeCenterX = auxiliaryProps.leftXLimit + (shape.centerX - auxiliaryProps.xLimits[0]);
    const relativeCenterY = auxiliaryProps.bottomYLimit + (shape.centerY - auxiliaryProps.yLimits[0]);

    shape.relativeCenterX = relativeCenterX;
    shape.relativeCenterY = relativeCenterY;
    shape.createD();
    createCirclesInSvg(shape);

    return shape;
  })
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

function drawCommonAxis(shape, sourceGroup, scale, id) {
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

function drawAxis({x1, y1, x2, y2, axisName, color, scale}) {
  const xmlns = "http://www.w3.org/2000/svg";
  const id = uniqid();
  const scaleVal = scale ? scale : 1;

  const defs = document.createElementNS(xmlns, "defs");

  const marker = document.createElementNS(xmlns, "marker");
  marker.setAttributeNS(null, "id", id);
  marker.setAttributeNS(null, "markerWidth", "8");
  marker.setAttributeNS(null, "markerHeight", "10");
  marker.setAttributeNS(null, "refX", "4");
  marker.setAttributeNS(null, "refY", "10");
  marker.setAttributeNS(null, "stroke", color ? color : "black");
  marker.setAttributeNS(null, "orient", `${x1 == x2 ? '0' : '-90'}`);

  const triangle = document.createElementNS(xmlns, "path");
  triangle.setAttributeNS(null, "d", `M 0.5, 0 l 3.5 10 l 3.5 -10`);
  triangle.setAttributeNS(null, "fill", color ? color : "black");
  triangle.setAttributeNS(null, "vector-effect", "non-scaling-stroke");

  marker.appendChild(triangle);
  defs.appendChild(marker);

  const line = document.createElementNS(xmlns, "path");
  line.setAttributeNS(null, "d", `M ${x1}, ${y1} L ${x2}, ${y2}`);
  line.setAttributeNS(null, "marker-end", `url(#${id})`);
  line.setAttributeNS(null, "stroke", color ? color : "black");
  line.setAttributeNS(null, "vector-effect", "non-scaling-stroke");

  const text = document.createElementNS(xmlns, "text");
  text.setAttributeNS(null, "x", `${x2}`);
  text.setAttributeNS(null, "y", `${y2-(10/scaleVal)-2}`);
  text.setAttributeNS(null, "transform-origin", `${x2} ${y2}`);
  text.setAttributeNS(null, 'transform', `scale(1, -1)`);
  text.setAttributeNS(null, "text-anchor", `middle`);
  text.setAttributeNS(null, "font-size", `${(16/scaleVal)+2}`);

  text.textContent = axisName;

  return { line, text, defs }
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

export { drawMainAxis, drawCommonAxis, createAxisArray, drawAxis, auxiliaryCalc };