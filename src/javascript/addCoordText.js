function createTextCoords(arrayProps, array, section) {
  const [svg, relativeCenterX, relativeCenterY] = arrayProps;

  const viewBox = svg.current.getBBox();
  const style = getComputedStyle(svg.current);

  const dx = parseFloat(style.width) - viewBox.width;
  const dy = parseFloat(style.height) - viewBox.height;
  const scale = dx < dy 
    ? parseFloat(style.width)/viewBox.width 
    : parseFloat(style.height)/viewBox.height

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttributeNS(null, "transform", `rotate(${-section.degree})`);
  group.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);

  array.forEach(item => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttributeNS(null, "font-size", `${(16/scale)+2}`);
    text.setAttributeNS(null, "text-anchor", "middle");

    text.setAttributeNS(null, "transform-origin", `${relativeCenterX + item.x} ${relativeCenterY + item.y}`);
    text.setAttributeNS(null, "transform", `scale(1 -1) rotate(${-section.degree})`);
    text.setAttributeNS(null, "x", `${relativeCenterX + item.x}`);
    text.setAttributeNS(null, "y", `${relativeCenterY + item.y}`);
    text.textContent = `(${(section.centerX + item.x).toFixed(1)}, ${(section.centerY + item.y).toFixed(1)})`;

    group.appendChild(text);
  })

  svg.current.appendChild(group);
}

export { createTextCoords };