export default function createTextCoords(arrayProps, array, degree) {
  const [svg, relativeCenterX, relativeCenterY] = arrayProps;
  const xmlns = "http://www.w3.org/2000/svg";

  array.forEach(item => {
    const text = document.createElementNS(xmlns, "text");
    text.setAttributeNS(null, "font-size", "10px");
    text.setAttributeNS(null, "text-anchor", "middle");

    const {rotateX, rotateY} = calcRotateCoords(item, relativeCenterX, relativeCenterY, degree)

    text.setAttributeNS(null, "transform-origin", `${rotateX} ${rotateY}`);
    text.setAttributeNS(null, "transform", `scale(1 -1)`);

    text.setAttributeNS(null, "x", `${rotateX}`);
    text.setAttributeNS(null, "y", `${(rotateY.toFixed(1) > relativeCenterY) ? rotateY - 5 : rotateY+10}`);
    text.textContent = `(${(rotateX-relativeCenterX).toFixed(1)}, ${(rotateY - relativeCenterY).toFixed(1)})`;

    svg.current.appendChild(text)
  })
}

function calcRotateCoords(item, relativeCenterX, relativeCenterY, degree) {
  const triangleHypotenuse = Math.sqrt(item.y**2 + item.x**2);
    const tgx = (item.y < 0 ? -item.y : item.y) / (item.x < 0 ? -item.x : item.x);
    const arctg = Math.atan(tgx)*180/Math.PI;

    let degreeFromStartPoint

    if (relativeCenterX + item.x < relativeCenterX && relativeCenterY + item.y > relativeCenterY) {
      degreeFromStartPoint = 180 - arctg;
    } else if (relativeCenterX + item.x > relativeCenterX && relativeCenterY + item.y > relativeCenterY) {
      degreeFromStartPoint = arctg;
    } else if (relativeCenterX + item.x < relativeCenterX && relativeCenterY + item.y < relativeCenterY) {
      degreeFromStartPoint = 180 + arctg;
    } else if (relativeCenterX + item.x > relativeCenterX && relativeCenterY + item.y < relativeCenterY) {
      degreeFromStartPoint = 360 - arctg;
    }
    const rotateDegree = degreeFromStartPoint - degree;
    const rotateX = relativeCenterX + triangleHypotenuse*Math.cos(rotateDegree*Math.PI/180);
    const rotateY = relativeCenterY + triangleHypotenuse*Math.sin(rotateDegree*Math.PI/180);

    return {rotateX , rotateY}
}