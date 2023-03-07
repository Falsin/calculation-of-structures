import calcRotateCoords from "./calcRotateCoords";

export default function createCircles(arrayProps, array, degree) {
  const [svg, relativeCenterX, relativeCenterY] = arrayProps;
  const xmlns = "http://www.w3.org/2000/svg";

  array.forEach(item => {
    const circle = document.createElementNS(xmlns, "circle");

    const {rotateX, rotateY} = calcRotateCoords(item, relativeCenterX, relativeCenterY, degree);
    circle.setAttributeNS(null, "cx", `${rotateX}`);
    circle.setAttributeNS(null, "cy", `${rotateY}`);
    circle.setAttributeNS(null, "r", `${4}`);
    circle.setAttributeNS(null, "fill", "blue");
  
    svg.current.appendChild(circle)
  })
}