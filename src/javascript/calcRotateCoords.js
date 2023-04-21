export default function calcRotateCoords(item, relativeCenterX, relativeCenterY, degree) {
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
  const rotateX = +(relativeCenterX + triangleHypotenuse*Math.cos(rotateDegree*Math.PI/180)).toFixed(1);
  const rotateY = +(relativeCenterY + triangleHypotenuse*Math.sin(rotateDegree*Math.PI/180)).toFixed(1);

  return {rotateX , rotateY}
}