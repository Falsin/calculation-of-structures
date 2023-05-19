import createCirclesInSvg from "../addCirclesToSVG";
import calcRotateCoords from "../calcRotateCoords";

function calcRelativeCenter (clickedShape, idCoordObj, shapeDataForCirclesMode) {
  const rotateSelectedId = calcRotateCoords(this.coords[shapeDataForCirclesMode.shapeId], this.centerX, this.centerY, this.degree);
  const requiredCoordObj = createCirclesInSvg.shapeCollectObj[clickedShape.uniqid][idCoordObj];

  return {
    centerX: +(requiredCoordObj.x + (this.centerX - rotateSelectedId.rotateX)).toFixed(1),
    centerY: +(requiredCoordObj.y + (this.centerY - rotateSelectedId.rotateY)).toFixed(1)
  }
}

function createD() {
  if (this.type == "beam") {
    return `M ${this.relativeCenterX - this.b/2}, ${this.relativeCenterY - this.h/2} h ${this.b} v ${this.t} h -${(this.b - this.s)/2} v ${this.h-2*this.t} h ${(this.b - this.s)/2} v ${this.t} h -${this.b} v -${this.t} h ${(this.b - this.s)/2} v -${this.h - 2*this.t} h -${(this.b - this.s)/2} z`;
  } else if (this.type == "channel") {
    return `M ${this.relativeCenterX - this.z0*10}, ${this.relativeCenterY - this.h/2} h ${this.b} v ${this.t} h -${this.b - this.s} v ${this.h-2*this.t} h ${this.b - this.s} v ${this.t} h -${this.b}  z`;
  } else if (this.type == "equalAnglesCorner") {
    return `M ${this.relativeCenterX - this.z0*10}, ${this.relativeCenterY - this.b + this.z0*10} h ${this.t} v ${this.b - this.t} h ${this.b - this.t} v ${this.t} h ${-this.b} z`;
  } else if (this.type == "unequalAnglesCorner") {
    return `M ${this.relativeCenterX - this.x0*10}, ${this.relativeCenterY - this.B + this.y0*10} h ${this.t} v ${this.B - this.t} h ${this.b - this.t} v ${this.t} h ${-this.b} z`
  } 

  return `M ${this.relativeCenterX - this.b/2}, ${this.relativeCenterY - this.h/2} h ${this.b} v ${this.h} h ${-this.b} z`;
}

export { calcRelativeCenter, createD }