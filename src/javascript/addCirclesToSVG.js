import calcRotateCoords from "./calcRotateCoords";

export default function createCirclesInSvg(shape) {
  const changedArrayCoords =  shape.coords.map(obj => {
    const rotateCoords = calcRotateCoords(obj, 0, 0, shape.degree);
    rotateCoords.rotateX += +shape.centerX;
    rotateCoords.rotateY += +shape.centerY;

    return {x: +(rotateCoords.rotateX).toFixed(1), y: +(rotateCoords.rotateY).toFixed(1)}
  })

  createCirclesInSvg.shapeCollectObj = {
    ...createCirclesInSvg.shapeCollectObj,
    [shape.id]: changedArrayCoords
  }
}

createCirclesInSvg.shapeCollectObj = {};