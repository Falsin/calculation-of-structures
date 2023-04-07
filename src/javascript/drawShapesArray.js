import uniqid from 'uniqid';
import { createTextCoords } from './addCoordText';
import calcScale from './calcScale';

export default function drawShapesArray(sourceGroup, group, arrayShapes, result) {
  const style = getComputedStyle(sourceGroup.current);

  const {
    arrayCentersCoordsX,
    arrayCentersCoordsY,
    xLimits,
    yLimits,
    leftXLimit,
    bottomYLimit,
  } = auxiliaryCalc(arrayShapes, style);

  const commonAxesArr = [];
  const textSetArr = [];

  arrayShapes.forEach((shape, id) => {
    const relativeCenterX = leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]);
    const relativeCenterY = bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]);

    const { sectionInstance, coords, path } = shape(sourceGroup, relativeCenterX, relativeCenterY);
    
    textSetArr.push({
      sectionInstance, 
      coords,
      relativeCenterX,
      relativeCenterY
    })
    commonAxesArr.push([{x: relativeCenterX}, {y: relativeCenterY}]);
  })

  createAxisAndText(textSetArr, sourceGroup, commonAxesArr, leftXLimit, bottomYLimit, result, group)
}

function createAxisAndText(textSetArr, sourceGroup, commonAxesArr, leftXLimit, bottomYLimit, result, group) {
  const scale = calcScale(sourceGroup);
  
  textSetArr.forEach((obj) => {
    createTextCoords([sourceGroup, obj.relativeCenterX, obj.relativeCenterY], obj.coords, obj.sectionInstance, scale)
  })

  drawAxisCollection(sourceGroup, commonAxesArr, scale);

  if (result) {
    drawMainAxis(leftXLimit, bottomYLimit, result, group, sourceGroup, scale);
  }
}

function drawAxisCollection(sourceGroup, commonAxesArr, scale) {
  const styleObj = sourceGroup.current.getBBox();

  commonAxesArr.forEach((commonAxes, id) => {
    const arr = createAxisArray({commonAxes, id, styleObj});

    arr.forEach(axis => {
      axis.changeLength((50/scale)+2)
      Object.values(drawAxis(axis, "black", scale)).forEach(elem => sourceGroup.current.appendChild(elem));
    })
  })
}

function drawAxis({x1, y1, x2, y2, axisName}, color = "black", scale = 1) {
  const xmlns = "http://www.w3.org/2000/svg";
  const id = uniqid();

  const defs = document.createElementNS(xmlns, "defs");

  const marker = document.createElementNS(xmlns, "marker");
  marker.setAttributeNS(null, "id", id);
  marker.setAttributeNS(null, "markerWidth", "8");
  marker.setAttributeNS(null, "markerHeight", "10");
  marker.setAttributeNS(null, "refX", "4");
  marker.setAttributeNS(null, "refY", "10");
  marker.setAttributeNS(null, "stroke", color);
  marker.setAttributeNS(null, "orient", `${x1 == x2 ? '0' : '-90'}`);

  const triangle = document.createElementNS(xmlns, "path");
  triangle.setAttributeNS(null, "d", `M 0.5, 0 l 3.5 10 l 3.5 -10`);
  triangle.setAttributeNS(null, "fill", color);
  triangle.setAttributeNS(null, "vector-effect", "non-scaling-stroke");

  marker.appendChild(triangle);
  defs.appendChild(marker);

  const line = document.createElementNS(xmlns, "path");
  line.setAttributeNS(null, "d", `M ${x1}, ${y1} L ${x2}, ${y2}`);
  line.setAttributeNS(null, "marker-end", `url(#${id})`);
  line.setAttributeNS(null, "stroke", color);
  line.setAttributeNS(null, "vector-effect", "non-scaling-stroke");

  const text = document.createElementNS(xmlns, "text");
  text.setAttributeNS(null, "x", `${x2}`);
  text.setAttributeNS(null, "y", `${y2-(10/scale)-2}`);
  text.setAttributeNS(null, "transform-origin", `${x2} ${y2}`);
  text.setAttributeNS(null, 'transform', `scale(1, -1)`);
  text.setAttributeNS(null, "text-anchor", `middle`);
  text.setAttributeNS(null, "font-size", `${(16/scale)+2}`);

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

class Axis {
  constructor(obj, id, styleObj) {
    this.x1 = obj.x || styleObj.x;
    this.x2 = obj.x || styleObj.x+styleObj.width;
    this.y1 = obj.y || styleObj.y;
    this.y2 = obj.y || styleObj.y+styleObj.height;
    this.axisName = (id == undefined) ? null : (this.x1 == this.x2) ? `Y${id+1}` : `X${id+1}`
  }

  changeLength(val) {
    if (this.x1 == this.x2) {
      this.y1 -= val;
      this.y2 += val;
    } else {
      this.x1 -= val;
      this.x2 += val;
    }
  }
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

function drawMainAxis(leftXLimit, bottomYLimit, result, group, sourceGroup, scale) {
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
    const nodeElements = drawAxis(axis, "black", scale);

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