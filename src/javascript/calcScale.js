export default function calcScale(svg) {
  const viewBox = svg.current.getBBox();
  const style = getComputedStyle(svg.current);

  const dx = parseFloat(style.width) - viewBox.width;
  const dy = parseFloat(style.height) - viewBox.height;
  return dx < dy 
    ? parseFloat(style.width)/viewBox.width 
    : parseFloat(style.height)/viewBox.height
}