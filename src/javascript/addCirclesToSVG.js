import calcRotateCoords from "./calcRotateCoords";

export default function createCirclesInSvg(shape) {
  if (!createCirclesInSvg.shapeCollectObj[shape.uniqid]) {
    const changedArrayCoords =  shape.coords.map(obj => {
      const rotateCoords = calcRotateCoords(obj, 0, 0, shape.degree);
      rotateCoords.rotateX += shape.centerX;
      rotateCoords.rotateY += shape.centerY;

      return {x: rotateCoords.rotateX, y: rotateCoords.rotateY}
    })

    createCirclesInSvg.shapeCollectObj = {
      ...createCirclesInSvg.shapeCollectObj,
      [shape.uniqid]: changedArrayCoords
    }
  }
}

createCirclesInSvg.shapeCollectObj = {};