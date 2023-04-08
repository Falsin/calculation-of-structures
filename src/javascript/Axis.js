export default class Axis {
  constructor(obj, id, styleObj) {
    this.x1 = obj.x || styleObj.x;
    this.x2 = obj.x || styleObj.x+styleObj.width;
    this.y1 = obj.y || styleObj.y;
    this.y2 = obj.y || styleObj.y+styleObj.height;
    this.axisName = (id == undefined) ? null : (this.x1 == this.x2) ? `Y${id+1}` : `X${id+1}`
  }

  changeLength(val) {
    if (this.x1 == this.x2) {
      this.y1 -= val;
      this.y2 += val;
    } else {
      this.x1 -= val;
      this.x2 += val;
    }
  }
}