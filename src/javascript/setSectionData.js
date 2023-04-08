import calcRotateCoords from "./calcRotateCoords";
import Section from './Section';

export default function setSectionData(centerX, centerY, degree, idCoordInArray, activeCase) {
  const sectionInstance = new Section(centerX, centerY, degree, this, activeCase);

  sectionInstance.setCoords();

  const { rotateX = 0, rotateY = 0 } = (idCoordInArray !== null && idCoordInArray !== undefined)
    ? calcRotateCoords(sectionInstance.coords[idCoordInArray], 0, 0, degree) 
    : {}

  sectionInstance.centerX = centerX - rotateX;
  sectionInstance.centerY = centerY - rotateY;

  return sectionInstance;
}