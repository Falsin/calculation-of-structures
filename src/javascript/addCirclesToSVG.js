import calcRotateCoords from "./calcRotateCoords";

export default function createCirclesInSvg(shapeArr) {
  const circles = createCirclesInSvg.svg.querySelectorAll("circle");
  circles.forEach(circle => circle.remove());

  return Promise.any(shapeArr.map(elem => {
    return new Promise((res, rej) => {
      const shape = elem();

      const requireCoords = createCirclesInSvg.shapeCollectObj[shape.uniqid];
    
      requireCoords.coordPoints.forEach((item, id) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "r", `${4}`);
        circle.setAttributeNS(null, "fill", "blue");

        const calcCoords = {
          x: item.x - requireCoords.relativeCenterX,
          y: item.y - requireCoords.relativeCenterY
        }

        const { rotateX, rotateY } = calcRotateCoords(calcCoords, requireCoords.relativeCenterX, requireCoords.relativeCenterY, shape.degree)
        circle.setAttributeNS(null, "cx", `${rotateX}`);
        circle.setAttributeNS(null, "cy", `${rotateY}`);

        circle.addEventListener("click", () => {
          res({
            x: shape.centerX + (rotateX - requireCoords.relativeCenterX),
            y: shape.centerY + (rotateY - requireCoords.relativeCenterY),
          });
        })
  
        createCirclesInSvg.svg.appendChild(circle);
      })
    })
  }))
}

createCirclesInSvg.svg = null;
createCirclesInSvg.shapeCollectObj = {};