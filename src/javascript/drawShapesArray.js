import uniqid from 'uniqid';
import { createTextCoords } from './addCoordText';
import calcScale from './calcScale';
import Axis from './Axis';

export default function drawShapesArray(sourceGroup, group, arrayShapes, result) {
  const style = getComputedStyle(sourceGroup.current);

  const auxiliaryProps = auxiliaryCalc(arrayShapes, style);

  const dataShapes = createDataShapes(auxiliaryProps, arguments);

  createAxisAndCoords(dataShapes, auxiliaryProps, arguments);
}

function auxiliaryCalc(arrayShapes, style) {
  const centerXWindow = parseFloat(style.width) / 2;
  const centerYWindow = parseFloat(style.height) / 2;

  const arrayCentersCoordsX = arrayShapes.map(shapeFunc => shapeFunc().centerX);
  const arrayCentersCoordsY = arrayShapes.map(shapeFunc => shapeFunc().centerY);

  const xLimits = [Math.min(...arrayCentersCoordsX), Math.max(...arrayCentersCoordsX)];
  const yLimits = [Math.min(...arrayCentersCoordsY), Math.max(...arrayCentersCoordsY)];
  const leftXLimit = centerXWindow - (xLimits[1] - xLimits[0])/2;
  const bottomYLimit = centerYWindow - (yLimits[1] - yLimits[0])/2;

  return { arrayCentersCoordsX, arrayCentersCoordsY, xLimits, yLimits, leftXLimit, bottomYLimit }
}

function createDataShapes(auxiliaryProps, argFunc) {
  const { 
    leftXLimit, 
    arrayCentersCoordsX, 
    xLimits, 
    bottomYLimit, 
    arrayCentersCoordsY, 
    yLimits 
  } = auxiliaryProps;

  const [ sourceGroup, , arrayShapes ] = argFunc;

  return arrayShapes.map((shape, id) => {
    const relativeCenterX = leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]);
    const relativeCenterY = bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]);

    const { sectionInstance, coords } = shape(sourceGroup, relativeCenterX, relativeCenterY);
    return { sectionInstance, coords, x: relativeCenterX, y: relativeCenterY }
  })
}

function createAxisAndCoords(dataShapes, auxiliaryProps, argFunc) {
  const [ sourceGroup, , , result ] = argFunc
  const scale = calcScale(sourceGroup);

  dataShapes.forEach((obj) => createTextCoords(obj, argFunc, scale));

  drawCommonAxis(dataShapes, sourceGroup, scale)

  if (result) {
    drawMainAxis(argFunc, auxiliaryProps, scale);
  }
}

function drawCommonAxis(dataShapes, sourceGroup, scale) {
  const styleObj = sourceGroup.current.getBBox();

  dataShapes.forEach((obj, id) => {
    const commonAxes = [
      {x: obj.x},
      {y: obj.y} 
    ];

    const arr = createAxisArray({commonAxes, id, styleObj});

    arr.forEach(axis => {
      axis.changeLength((50/scale)+2)

      Object.values(drawAxis({...axis, scale}))
        .forEach(elem => sourceGroup.current.appendChild(elem));
    })
  })
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

function drawMainAxis(argFunc, auxiliaryProps, scale) {
  const [ sourceGroup, group, , result ] = argFunc
  const { leftXLimit, bottomYLimit } = auxiliaryProps;
  
  const styleObj = sourceGroup.current.getBBox();
  const relativeCenterX = leftXLimit + result.centerOfGravity.value.Xc;
  const relativeCenterY = bottomYLimit + result.centerOfGravity.value.Yc;

  const mainAxes = [
    {x: leftXLimit},
    {y: bottomYLimit},
    {x: relativeCenterX},
    {y: relativeCenterY}
  ]

  let arr = createAxisArray({styleObj, mainAxes, result});

  arr.map(axis => {
    axis.changeLength(60/scale+2);
    const nodeElements = drawAxis({...axis, scale});

    if (axis.axisName == "V" || axis.axisName == "U") {
      Object.values(nodeElements).forEach(elem => {
        group.current.appendChild(elem);
        const { text } = nodeElements;
        text.setAttributeNS(null, "transform", `scale(1, -1) rotate(${-result.degree.value})`);
      });
    } else {
      Object.values(nodeElements).forEach(elem => sourceGroup.current.appendChild(elem));
    }
  })
}

export { createAxisArray, drawAxis };