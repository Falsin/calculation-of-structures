import uniqid from 'uniqid';

export default class Section {
  constructor(centerX, centerY, degree, obj, activeCase) {
    this.centerX = parseFloat(centerX);
    this.centerY = parseFloat(centerY);
    this.degree = degree;
    this.uniqid = uniqid();
    this.isActive = false;
    this.coords = [];
    
    Object.assign(this, obj, (activeCase) ? {activeCase} : {});
  }

  setCoords() {
    if (this.type == "beam") {
      this.coords = [
        {x: -this.b/2, y: this.h/2},
        {x: this.b/2, y: this.h/2},
        {x: this.b/2, y: -this.h/2},
        {x: -this.b/2, y: -this.h/2} 
      ]
    } else if (this.type == "channel") {
      this.coords = [
        {x: -this.z0*10, y: this.h/2},
        {x: this.b - this.z0*10, y: this.h/2},
        {x: this.b - this.z0*10, y: -this.h/2},
        {x: -this.z0*10, y: -this.h/2}
      ]
    } else if (this.type == "equalAnglesCorner") {
      this.coords = [
        {x: -this.z0*10, y: this.b - this.z0*10},
        {x: this.b - this.z0*10, y: -this.z0*10},
        {x: -this.z0*10, y: -this.z0*10}
      ]
    } else if (this.type == "unequalAnglesCorner") {
      if (this.activeCase == 1) {
        this.coords = [
          {x: -this.x0*10, y: this.B - this.y0*10},
          {x: this.b - this.x0*10, y: -this.y0*10},
          {x: -this.x0*10, y: -this.y0*10}
        ]
      } else {
        this.coords = [
          {x: this.x0*10, y: this.B - this.y0*10},
          {x: this.x0*10, y: -this.y0*10},
          {x: -this.b + this.x0*10, y: -this.y0*10},
        ]
      }
    } else {
      this.coords = [
        {x: -this.b/2, y: this.h/2},
        {x: this.b/2, y: this.h/2},
        {x: this.b/2, y: -this.h/2},
        {x: -this.b/2, y: -this.h/2}
      ]
    }
  }

  draw(relativeCenterX, relativeCenterY) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "fill", "white");
    path.setAttributeNS(null, "stroke", "black");
    path.setAttributeNS(null, "transform-origin", `${relativeCenterX} ${relativeCenterY}`);
    path.setAttributeNS(null, "transform", `scale(1 -1) rotate(${this.degree})`);
    path.setAttributeNS(null, "id", `${this.uniqid}`);
    path.setAttributeNS(null, "vector-effect", "non-scaling-stroke");
    path.setAttributeNS(null, "stroke-width", "1");

    if (this.type == "beam") {
      path.setAttributeNS(null, 
        "d", 
        `M ${relativeCenterX - this.b/2}, ${relativeCenterY - this.h/2} 
          h ${this.b} v ${this.t} h -${(this.b - this.s)/2} v ${this.h-2*this.t} 
          h ${(this.b - this.s)/2} v ${this.t} h -${this.b} v -${this.t} 
          h ${(this.b - this.s)/2} v -${this.h - 2*this.t} h -${(this.b - this.s)/2} z`)
    } else if (this.type == "channel") {
      path.setAttributeNS(null, 
        "d", 
        `M ${relativeCenterX - this.z0*10}, ${relativeCenterY - this.h/2} 
          h ${this.b} v ${this.t} h -${this.b - this.s} v ${this.h-2*this.t} 
          h ${this.b - this.s} v ${this.t} h -${this.b}  z`)
    } else if (this.type == "equalAnglesCorner") {
      path.setAttributeNS(null, 
        "d", 
        `M ${relativeCenterX - this.z0*10}, ${relativeCenterY - this.b + this.z0*10} 
          h ${this.t} v ${this.b - this.t} h ${this.b - this.t} v ${this.t} h ${-this.b} z`);
    } else if (this.type == "unequalAnglesCorner") {
      path.setAttributeNS(null, 
        "d", 
        `M ${relativeCenterX - this.x0*10}, ${relativeCenterY - this.B + this.y0*10} 
          h ${this.t} v ${this.B - this.t} h ${this.b - this.t} v ${this.t} h ${-this.b} z`);
      path.setAttributeNS(null, "transform", `scale(${this.activeCase == 2 ? -1 : 1} -1) rotate(${this.activeCase == 2 ? -this.degree : this.degree})`);
    } else {
      path.setAttributeNS(null, 
        "d",
         `M ${relativeCenterX - this.b/2}, ${relativeCenterY - this.h/2} h ${this.b} v ${this.h} h ${-this.b} z`);
      path.setAttributeNS(null, "fill", "white");
    }

    return path;
  }
}