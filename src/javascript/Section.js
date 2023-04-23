import uniqid from 'uniqid';
import calcRotateCoords from './calcRotateCoords';
import createCirclesInSvg from './addCirclesToSVG';

class Section {
  constructor(centerX, centerY, degree, obj, activeCase) {
    this.centerX = parseFloat(centerX);
    this.centerY = parseFloat(centerY);
    this.degree = degree;
    this.uniqid = uniqid();
    this.isActive = false;
    
    Object.assign(this, obj, (activeCase) ? {activeCase} : {});
  }

  calcRelativeCenter(clickedShape, idCoordObj, shapeDataForCirclesMode) {
    const rotateSelectedId = calcRotateCoords(this.coords[shapeDataForCirclesMode.shapeId], this.centerX, this.centerY, this.degree);
    const requiredCoordObj = createCirclesInSvg.shapeCollectObj[clickedShape.uniqid][idCoordObj];

    this.centerX = +(requiredCoordObj.x + (this.centerX - rotateSelectedId.rotateX)).toFixed(1);
    this.centerY = +(requiredCoordObj.y + (this.centerY - rotateSelectedId.rotateY)).toFixed(1);
  }
}

class Beam extends Section {
  constructor(centerX, centerY, degree, obj, activeCase) {
    super(centerX, centerY, degree, obj, activeCase);
    this.coords = [
      {x: -this.b/2, y: this.h/2},
      {x: this.b/2, y: this.h/2},
      {x: this.b/2, y: -this.h/2},
      {x: -this.b/2, y: -this.h/2} 
    ]
  }

  createD() {
    this.d = `M ${this.relativeCenterX - this.b/2}, ${this.relativeCenterY - this.h/2} h ${this.b} v ${this.t} h -${(this.b - this.s)/2} v ${this.h-2*this.t} h ${(this.b - this.s)/2} v ${this.t} h -${this.b} v -${this.t} h ${(this.b - this.s)/2} v -${this.h - 2*this.t} h -${(this.b - this.s)/2} z`
  }
}

class Channel extends Section {
  constructor(centerX, centerY, degree, obj, activeCase) {
    super(centerX, centerY, degree, obj, activeCase);
    this.coords = [
      {x: -this.z0*10, y: this.h/2},
      {x: this.b - this.z0*10, y: this.h/2},
      {x: this.b - this.z0*10, y: -this.h/2},
      {x: -this.z0*10, y: -this.h/2}
    ]
  }

  createD() {
    this.d = `M ${this.relativeCenterX - this.z0*10}, ${this.relativeCenterY - this.h/2} h ${this.b} v ${this.t} h -${this.b - this.s} v ${this.h-2*this.t} h ${this.b - this.s} v ${this.t} h -${this.b}  z`
  }
}

class EqualAnglesCorner extends Section {
  constructor(centerX, centerY, degree, obj, activeCase) {
    super(centerX, centerY, degree, obj, activeCase);
    this.coords = [
      {x: -this.z0*10, y: this.b - this.z0*10},
      {x: this.b - this.z0*10, y: -this.z0*10},
      {x: -this.z0*10, y: -this.z0*10}
    ]
  }

  createD() {
    this.d = `M ${this.relativeCenterX - this.z0*10}, ${this.relativeCenterY - this.b + this.z0*10} h ${this.t} v ${this.b - this.t} h ${this.b - this.t} v ${this.t} h ${-this.b} z`
  }
}

class UnequalAnglesCorner extends Section {
  constructor(centerX, centerY, degree, obj, activeCase) {
    super(centerX, centerY, degree, obj, activeCase);
    this.coords = (activeCase == 1) 
      ? [
          {x: -this.x0*10, y: this.B - this.y0*10},
          {x: this.b - this.x0*10, y: -this.y0*10},
          {x: -this.x0*10, y: -this.y0*10}
        ]
      : [
          {x: this.x0*10, y: this.B - this.y0*10},
          {x: -this.b + this.x0*10, y: -this.y0*10},
          {x: this.x0*10, y: -this.y0*10},
        ]
  }

  createD() {
    this.d = `M ${this.relativeCenterX - this.x0*10}, ${this.relativeCenterY - this.B + this.y0*10} h ${this.t} v ${this.B - this.t} h ${this.b - this.t} v ${this.t} h ${-this.b} z`
  }
}

class Rectangle extends Section {
  constructor(centerX, centerY, degree, obj, activeCase) {
    super(centerX, centerY, degree, obj, activeCase);
    this.coords = [
      {x: -this.b/2, y: this.h/2},
      {x: this.b/2, y: this.h/2},
      {x: this.b/2, y: -this.h/2},
      {x: -this.b/2, y: -this.h/2}
    ]
    this.type = "rectangle";
  }

  createD() {
    this.d = `M ${this.relativeCenterX - this.b/2}, ${this.relativeCenterY - this.h/2} h ${this.b} v ${this.h} h ${-this.b} z`
  }
}

export { Beam, Channel, EqualAnglesCorner, UnequalAnglesCorner, Rectangle }