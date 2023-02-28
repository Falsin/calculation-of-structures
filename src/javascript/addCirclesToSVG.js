export default function createCirclesInSvg(shapeArr) {
  const circles = createCirclesInSvg.svg.querySelectorAll("circle");
  circles.forEach(circle => circle.remove());

  return new Promise((res, rej) => {
    shapeArr.forEach(elem => {
      const shape = elem();

      console.log(shape)
  
      //const requireCoords = createCirclesInSvg.shapeCollectObj[shape.uniqid];
      const requireCoords = createCirclesInSvg.shapeCollectObj[shape.uniqid];
  
      requireCoords.coordPoints.forEach((item, id) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "cx", `${item.x}`);
        circle.setAttributeNS(null, "cy", `${item.y}`);
        circle.setAttributeNS(null, "r", `${4}`);
        circle.setAttributeNS(null, "fill", "blue");
        circle.setAttributeNS(null, "transform", `rotate(${shape.degree}, ${shape.centerX}, ${shape.centerY})`);
  
        circle.addEventListener("click", (e) => {
          console.log(item)
          console.log(requireCoords)

          res({
            x: item.x - requireCoords.relativeCenterX,
            y: item.y - requireCoords.relativeCenterY,
          });
        })
  
        createCirclesInSvg.svg.appendChild(circle);
      })
    });
  })
}

createCirclesInSvg.svg = null;
createCirclesInSvg.shapeCollectObj = {};