import uniqid from 'uniqid';

export default function drawShapesArray(sourceGroup, group, arrayShapes, result) {
  const style = getComputedStyle(sourceGroup.current);

  const {
    arrayCentersCoordsX,
    arrayCentersCoordsY,
    xLimits,
    yLimits,
    leftXLimit,
    bottomYLimit
  } = auxiliaryCalc(arrayShapes, style);

  arrayShapes.forEach((shape, id) => {
    const relativeCenterX = leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]);
    const relativeCenterY = bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]);

    shape(sourceGroup, relativeCenterX, relativeCenterY);

    const commonAxes = [
      {x: relativeCenterX},
      {y: relativeCenterY}
    ]

    const arr = createAxisArray({style, commonAxes, id});
    console.log(arr)

    arr.forEach(axis => {
      Object.values(drawAxis(axis)).forEach(elem => sourceGroup.current.appendChild(elem));
    })
  })

  if (result) {
    drawMainAxis(leftXLimit, bottomYLimit, result, sourceGroup, group)
  }
}

function drawAxis({x1, y1, x2, y2, axisName}, color = "black") {
  const xmlns = "http://www.w3.org/2000/svg";
  const id = uniqid();

  const defs = document.createElementNS(xmlns, "defs");

  const marker = document.createElementNS(xmlns, "marker");
  marker.setAttributeNS(null, "id", id);
  marker.setAttributeNS(null, "markerWidth", "8");
  marker.setAttributeNS(null, "markerHeight", "10");
  marker.setAttributeNS(null, "refX", "4");
  marker.setAttributeNS(null, "refY", "0");
  marker.setAttributeNS(null, "stroke", color);
  marker.setAttributeNS(null, "orient", `${x1 == x2 ? '0' : '-90'}`);

  const triangle = document.createElementNS(xmlns, "path");
  triangle.setAttributeNS(null, "d", `M 0.5, 0 l 3.5 10 l 3.5 -10`);
  triangle.setAttributeNS(null, "fill", color);

  marker.appendChild(triangle);
  defs.appendChild(marker);

  const line = document.createElementNS(xmlns, "path");
  line.setAttributeNS(null, "d", `M ${x1}, ${y1} L ${x2}, ${y2}`);
  line.setAttributeNS(null, "marker-end", `url(#${id})`);
  line.setAttributeNS(null, "stroke", color);

  const text = document.createElementNS(xmlns, "text");
  text.setAttributeNS(null, "x", `${x2}`);
  text.setAttributeNS(null, "y", `${y2-10}`);
  text.setAttributeNS(null, "transform-origin", `${x2} ${y2}`);
  text.setAttributeNS(null, 'transform', `scale(1, -1)`);
  text.setAttributeNS(null, "text-anchor", `middle`);
  text.textContent = axisName;

  return { line, text, defs }
}

class Axis {
  constructor(style, obj, id) {
    this.x1 = obj.x || parseFloat(style.width)*0.15;
    this.x2 = obj.x || parseFloat(style.width)*0.85;
    this.y1 = obj.y || parseFloat(style.height)*0.2;
    this.y2 = obj.y || parseFloat(style.height)*0.8;
    this.axisName = (id == undefined) ? null : (this.x1 == this.x2) ? `Y${id+1}` : `X${id+1}`
  }

  changeLength(ratio) {
    if (this.x1 == this.x2) {
      this.y1 /= ratio;
      this.y2 *= ratio;
    } else {
      this.x1 /= ratio;
      this.x2 *= ratio;
    }
  }
}

function createAxisArray({style, commonAxes, mainAxes, id, result}) {
  if (commonAxes) {
    return commonAxes.map(obj => new Axis(style, obj, id))
  } else {
    const axesName = ['Yсл', 'Xсл','Yc', 'Xc', 'V', 'U'];
    const axes = mainAxes.map(obj => new Axis(style, obj, id));

    return axes.reduce((prev, curr, id) => {
      curr.changeLength(1.1);

      if (id < axes.length - 1) {
        return [...prev, Object.assign(curr, {axisName: axesName[id]})]
      } else {
        const [maxAxis, minAxis] = (result.moments.Ix.value > result.moments.Iy.value) 
          ? [curr, prev.find(elem => elem.axisName == "Yc")]
          : [prev.find(elem => elem.axisName == "Yc"), curr]

        return [
          ...prev,
          Object.assign(curr, {axisName: axesName[id]}),
          Object.assign({...maxAxis}, {axisName: axesName[id+1]}),
          Object.assign({...minAxis}, {axisName: axesName[id+2]}),
        ]
      }
    }, [])
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

function drawMainAxis(leftXLimit, bottomYLimit, result, svg, group) {
  const style = getComputedStyle(svg.current);
  const relativeCenterX = leftXLimit + result.centerOfGravity.value.Xc;
  const relativeCenterY = bottomYLimit + result.centerOfGravity.value.Yc;

  const mainAxes = [
    {x: leftXLimit},
    {y: bottomYLimit},
    {x: relativeCenterX},
    {y: relativeCenterY}
  ]

  let arr = createAxisArray({style, mainAxes, result});
  arr.map(axis => {
    const nodeElements = drawAxis(axis);

    if (axis.axisName == "V" || axis.axisName == "U") {
      Object.values(nodeElements).forEach(elem => {
        group.current.appendChild(elem);
        const { text } = nodeElements;
        text.setAttributeNS(null, "transform", `scale(1, -1) rotate(${-result.degree.value})`);
      });
    } else {
      Object.values(nodeElements).forEach(elem => svg.current.appendChild(elem));
    }
  })
}

export { createAxisArray, drawAxis }; 
//была 201 строчка