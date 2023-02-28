export default function createCirclesInSvg(shapeArr) {
  shapeArr.forEach(elem => {
    const shape = elem();

    const requireCoords = createCirclesInSvg.shapeCollectObj[shape.uniqid];

    requireCoords.forEach(item => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttributeNS(null, "cx", `${shape.centerX + item.x}`);
      circle.setAttributeNS(null, "cy", `${shape.centerY + item.y}`);
      circle.setAttributeNS(null, "r", `${4}`);
      circle.setAttributeNS(null, "fill", "blue");
      circle.setAttributeNS(null, "transform", `rotate(${shape.degree}, ${shape.centerX}, ${shape.centerY})`);

      createCirclesInSvg.svg.appendChild(circle);
    })
  });
}

createCirclesInSvg.svg = null;
createCirclesInSvg.shapeCollectObj = {};