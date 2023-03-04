import createCirclesInSvg from "./addCirclesToSVG";

export default function setCoordPoints(coords, valArr) {
  const [, relativeCenterX, relativeCenterY] = valArr;

  createCirclesInSvg.shapeCollectObj = {
    ...createCirclesInSvg.shapeCollectObj,
    [this.uniqid]: {
      coordPoints: coords.map(elem => {
        return {
          x: relativeCenterX + elem.x,
          y: relativeCenterY + elem.y,
        }
      }),
      relativeCenterX,
      relativeCenterY,
    }
  }
}