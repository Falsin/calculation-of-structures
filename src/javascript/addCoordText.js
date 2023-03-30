export default function createTextCoords(arrayProps, array, degree) {
  const [svg, relativeCenterX, relativeCenterY] = arrayProps;

  const style = getComputedStyle(svg.current);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttributeNS(null, "transform", `rotate(${-degree})`);
  group.setAttributeNS(null, "transform-origin", `${width/2} ${height/2}`);

  array.forEach(item => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttributeNS(null, "font-size", "10px");
    text.setAttributeNS(null, "text-anchor", "middle");

    text.setAttributeNS(null, "transform-origin", `${relativeCenterX + item.x} ${relativeCenterY + item.y}`);
    text.setAttributeNS(null, "transform", `scale(1 -1) rotate(${-degree})`);
    text.setAttributeNS(null, "x", `${relativeCenterX + item.x}`);
    text.setAttributeNS(null, "y", `${relativeCenterY + item.y}`);
    text.textContent = `(${(item.x).toFixed(1)}, ${(item.y).toFixed(1)})`;

    group.appendChild(text);
  })

  svg.current.appendChild(group);
}