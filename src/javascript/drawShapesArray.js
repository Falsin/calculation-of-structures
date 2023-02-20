export default function drawShapesArray(svg, arrayShapes, result) {
  const style = getComputedStyle(svg.current);

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

    shape(svg, relativeCenterX, relativeCenterY);
    drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.2, relativeCenterX, parseFloat(style.height)*0.8, `Y${id+1}`);
    drawAxis(svg, parseFloat(style.width)*0.2, relativeCenterY, parseFloat(style.width)*0.8, relativeCenterY, `X${id+1}`);

    if (result && result.auxiliaryAxes.x == arrayCentersCoordsX[id]) {
      drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.85, "Yсл");
    }

    if (result && result.auxiliaryAxes.y == arrayCentersCoordsY[id]) {
      drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.85, relativeCenterY, "Xсл");
    }
  })

  if (result) {
    drawMainAxis(leftXLimit, bottomYLimit, result, svg)
  }
}

function auxiliaryCalc(arrayShapes, style) {
  const centerXWindow = parseFloat(style.width) / 2;
  const centerYWindow = parseFloat(style.height) / 2;

  const arrayCentersCoordsX = arrayShapes.map(shapeFunc => {
    return shapeFunc().centerX;
  })

  const arrayCentersCoordsY = arrayShapes.map(shapeFunc => {
    return shapeFunc().centerY;
  })

  const xLimits = [Math.min(...arrayCentersCoordsX), Math.max(...arrayCentersCoordsX)];
  const yLimits = [Math.min(...arrayCentersCoordsY), Math.max(...arrayCentersCoordsY)];
  const leftXLimit = centerXWindow - (xLimits[1] - xLimits[0])/2;
  const bottomYLimit = centerYWindow - (yLimits[1] - yLimits[0])/2;

  return { arrayCentersCoordsX, arrayCentersCoordsY, xLimits, yLimits, leftXLimit, bottomYLimit }
}

function drawMainAxis(leftXLimit, bottomYLimit, result, svg) {
  const style = getComputedStyle(svg.current);
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

  const currentX = text.x.animVal[0].value;
  const currentY = text.y.animVal[0].value;
  let rotateX;
  let rotateY;

  if (currentY > y) {
    const rotateDegree = 90 + degree;
    rotateX = x + (currentY-y)*Math.cos(rotateDegree*Math.PI/180);
    rotateY = y + (currentY-y)*Math.sin(rotateDegree*Math.PI/180);
  } else {
    const rotateDegree = (degree > 0) ? degree : 360 + degree;
    rotateX = x + (currentX-x)*Math.cos(rotateDegree*Math.PI/180);
    rotateY = y - (currentX-x)*Math.sin(rotateDegree*Math.PI/180) - 10;
  }

  text.setAttributeNS(null, 'x', `${rotateX}`);
  text.setAttributeNS(null, 'y', `${rotateY}`);
}