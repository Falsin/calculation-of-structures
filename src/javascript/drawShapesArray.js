export default function drawShapesArray(svg, arrayShapes, result) {
  let style = getComputedStyle(svg.current);
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

  arrayShapes.forEach((shape, id) => {
    const relativeCenterX = leftXLimit + (arrayCentersCoordsX[id] - xLimits[0]);
    const relativeCenterY = bottomYLimit + (arrayCentersCoordsY[id] - yLimits[0]);

    shape(svg, relativeCenterX, relativeCenterY);

    if (result && result.auxiliaryAxes.x == arrayCentersCoordsX[id]) {
      drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.1, relativeCenterX, parseFloat(style.height)*0.85, "Yсл");
    }

    if (result && result.auxiliaryAxes.y == arrayCentersCoordsY[id]) {
      drawAxis(svg, parseFloat(style.width)*0.1, relativeCenterY, parseFloat(style.width)*0.85, relativeCenterY, "Xсл");
    }

    drawAxis(svg, relativeCenterX, parseFloat(style.height)*0.2, relativeCenterX, parseFloat(style.height)*0.8, `Y${id+1}`);
    drawAxis(svg, parseFloat(style.width)*0.2, relativeCenterY, parseFloat(style.width)*0.8, relativeCenterY, `X${id+1}`);
  })

  if (result) {
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

  const rad = (90 - (degree >= 0 ? degree : degree * -1)) * Math.PI / 180;
  const sinX = rad**5/120 - rad**3/6 + rad;
  const lineLength = (orientation == "vertical") ? endPoint - y : endPoint - x;

  let alphaY = sinX * lineLength;
  let alphaX = Math.sqrt(lineLength**2 - alphaY**2);

  if (orientation == "vertical") {
    text.setAttributeNS(null, 'x', `${degree > 0 ? x-alphaX : x+alphaX}`);
    text.setAttributeNS(null, 'y', `${y+alphaY-8}`);
  } else {
    text.setAttributeNS(null, 'x', `${x+alphaY}`);
    text.setAttributeNS(null, 'y', `${degree > 0 ? y-alphaX-8 : y+alphaX-8}`);
  }
}