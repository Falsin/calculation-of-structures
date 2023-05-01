export default function createDimensionalLine (coordObj, length, degree, height, orientation) {
  const { x, y } = coordObj;

  if (degree/360%1*360 == 90 || degree/360%1*360 == 270) {
    degree = (orientation == "vertical") ? degree -= 90 : degree += 90
  }

  return <g style={{transformOrigin: `${x}px ${y}px`, transform: `rotate(${(orientation == "vertical") ? "90deg" : "0"})`}}>
    <path d={`M ${x-2} ${y+height} l ${length+4} ${0}`}/>

    <path d={`M ${x} ${y+2} l ${0} ${height}`}/>
    <path d={`M ${x+length} ${y+2} l ${0} ${height}`}/>

    <path d={`M ${x} ${y+8} l ${0} ${4}`} style={{transform: `rotate(-45deg)`, transformOrigin: `${x}px ${y+height}px`}}/>
    <path d={`M ${x+length} ${y+8} l ${0} ${4}`} style={{transform: `rotate(-45deg)`, transformOrigin: `${x+length}px ${y+height}px`}}/>

    <g style={{transformOrigin: `${x+length/2}px ${y+height}px`, transform: `rotate(${degree}deg)`}}>
      <text 
        style={{fontSize: `${(16/scale)+2}px`, transform: `scale(1, -1)`, transformOrigin: `${x+length/2}px ${y+12}px`}}
        x={x+length/2} 
        y={y+12}
      >
        {length}
      </text>
    </g>
  </g>
}