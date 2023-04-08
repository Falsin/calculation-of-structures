function createTextCoords(obj, argFunc, scale) {
  const [ svg ] = argFunc;

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttributeNS(null, "transform", `rotate(${-obj.sectionInstance.degree})`);
  group.setAttributeNS(null, "transform-origin", `${obj.x} ${obj.y}`);

  obj.coords.forEach(item => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttributeNS(null, "font-size", `${(16/scale)+2}`);
    text.setAttributeNS(null, "text-anchor", "middle");

    text.setAttributeNS(null, "transform-origin", `${obj.x + item.x} ${obj.y + item.y}`);
    text.setAttributeNS(null, "transform", `scale(1 -1) rotate(${-obj.sectionInstance.degree})`);
    text.setAttributeNS(null, "x", `${obj.x + item.x}`);
    text.setAttributeNS(null, "y", `${obj.y + item.y}`);
    text.textContent = `(${(obj.x + item.x).toFixed(1)}, ${(obj.y + item.y).toFixed(1)})`;

    group.appendChild(text);
  })

  svg.current.appendChild(group);
}

export { createTextCoords };