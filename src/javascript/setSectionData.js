import uniqid from 'uniqid';
import calcRotateCoords from "./calcRotateCoords";

export default function setSectionData(centerX, centerY, degree, idCoordInArray, activeCase) {
  const sectionInstance = {
    ...this,
    centerX: parseFloat(centerX), 
    centerY: parseFloat(centerY),
    degree,
    uniqid: uniqid(),
  }

  const { h, B, b, s, t, z0, x0, y0 } = sectionInstance;

  let coords; 

  if (this.type == "beam") {
    coords = [
      {x: -b/2, y: h/2},
      {x: b/2, y: h/2},
      {x: b/2, y: -h/2},
      {x: -b/2, y: -h/2} 
    ]
  } else if (this.type == "channel") {
    coords = [
      {x: -z0*10, y: h/2},
      {x: b - z0*10, y: h/2},
      {x: b - z0*10, y: -h/2},
      {x: -z0*10, y: -h/2}
    ]
  } else if (this.type == "equalAnglesCorner") {
    coords = [
      {x: -z0*10, y: b - z0*10},
      {x: b - z0*10, y: -z0*10},
      {x: -z0*10, y: -z0*10}
    ]
  } else {
    console.log(activeCase)
    if (activeCase == 1) {
      coords = [
        {x: -x0*10, y: B - y0*10},
        {x: b - x0*10, y: -y0*10},
        {x: -x0*10, y: -y0*10}
      ]
    } else {
      coords = [
        {x: x0*10, y: B - y0*10},
        {x: x0*10, y: -y0*10},
        {x: -b + x0*10, y: -y0*10},
      ]
    }
  }

  const coordX = (idCoordInArray === null) ? centerX : centerX - calcRotateCoords(coords[idCoordInArray], 0, 0, degree).rotateX;
  const coordY = (idCoordInArray === null) ? centerY : centerY - calcRotateCoords(coords[idCoordInArray], 0, 0, degree).rotateY;

  sectionInstance.centerX = coordX;
  sectionInstance.centerY = coordY;

  return { sectionInstance, coords }
}