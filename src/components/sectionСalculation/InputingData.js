import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AddBeam from "./AddBeam";
import AddChannel from "./AddChannel";
import AddEqualAnglesCorners from "./AddEqualAnglesCorners";
import AddUnequalAnglesCorners from "./AddUnequalAnglesCorners";
import AddRectangle from "./AddRectangle";
import drawShapesArray from "../../javascript/drawShapesArray";
import changeStatus from "../../javascript/changeStatusInList";

function InputingData({className, children, setResult, result}) {
  const svg = useRef(null);
  const [arrayShapes, setArrayShapes] = useState([]);

  const saveShape = (func) => setArrayShapes([...arrayShapes, func]);

  useEffect(() => {
    draw()
  }, [arrayShapes, result])

  function draw() {
    svg.current.replaceChildren();

    drawShapesArray(svg, arrayShapes, result)
  }
  
  async function submit(e) {
    e.preventDefault();

    const request = await fetch("http://localhost:3000/flatSection/", {
      method: "PUT",
      body: JSON.stringify(arrayShapes.map(item => item())),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    const response = await request.json();
    setResult(response);
  }

  return (
    <div className={className}>
      <SVG ref={svg} transform="scale(1, -1)" />
      <form onSubmit={submit}>
        <ul style={{position: "relative"}}>
          <li>
            <h2 onClick={(e) => changeStatus(e)}>Простые сечения</h2>
            
            <ul style={{position: "relative"}}>
              {<AddBeam saveShape={saveShape} />}
              {<AddChannel saveShape={saveShape} />}
              {<AddEqualAnglesCorners saveShape={saveShape} />}
              {<AddUnequalAnglesCorners saveShape={saveShape} />}
              {<AddRectangle saveShape={saveShape} />}
            </ul>
          </li>

          <li>
            <h2 onClick={(e) => changeStatus(e)}>Состав сечения ({arrayShapes.length})</h2>

            {!arrayShapes.length 
              ? <p>Вы ещё не добавили ни одного сечения</p>
              : <SectionComposition arrayShapes={arrayShapes} setArrayShapes={setArrayShapes} />
            }
          </li>
        </ul>

        <button>рассчитать</button>
      </form>
    </div>
  )
}

function SectionComposition({arrayShapes, setArrayShapes}) {
  const [selectedId, setSelectedId] = useState(null);
  const lastActiveId = useRef(null);

  const sectionNames = {
    beam: "Двутавр",
    channel: "Швеллер",
    equalAnglesCorner: "Равнополочный уголок",
    unequalAnglesCorner: "Неравнополочный уголок",
    rectangle: "Прямоугольное сечение"
  }

  const keys = ["centerX", "centerY", "degree"];

  useEffect(() => {
    if (lastActiveId.current) {
      const path = document.getElementById(lastActiveId.current);
      path.classList.remove("active");
    }

    if (selectedId) {
      const path = document.getElementById(selectedId);
      path.classList.add("active");
    }

    lastActiveId.current = selectedId;
  }, [selectedId])

  function changeActiveSection(uniqid, eventType) {
    if (!selectedId) {
      const path = document.getElementById(uniqid);

      if (eventType == "mouseleave") {
        path.classList.remove("active");
      } else {
        path.classList.add("active");
      }
    } 
  }


  return (
    <ul>
      {arrayShapes.map(elem => {
        const shape = elem();

        return (
          <li 
            style={{border: "solid 1px black"}} 
            onMouseEnter={(e) => changeActiveSection(shape.uniqid, e.type)} 
            onMouseLeave={(e) => changeActiveSection(shape.uniqid, e.type)}
            key={shape.uniqid}
          >
            <h3 className={selectedId == shape.uniqid ? "active" : ""} 
              onClick={() => setSelectedId(shape.uniqid == selectedId ? null : shape.uniqid)}
            >
              {sectionNames[shape.type]}
            </h3>

            <ul>{keys.map(key => <li>{key}: {shape[key]}</li>)}</ul>

            <button onClick={() => {
              const filteredArray = arrayShapes.filter(func => func().uniqid != shape.uniqid);
              setArrayShapes(filteredArray)
            }} type="button">Удалить</button>
        </li>
        )
      })}
    </ul>
  )
}

const StyledInputingData = styled(InputingData)`
  display: flex;

  h2 {
    margin: 0;
  }

  li > h2 ~ ul,
  li > h3 ~ ul {
    overflow: hidden;
    max-height: 0;
    padding: 0;
    transition-timing-function: linear;
    transition: 1s;
  }

  li > h2.active ~ ul,
  li > h3.active ~ ul {
    max-height: 1000px;
    margin-top: 10px;
  }
`

const SVG = styled.svg`
  width: 800px;
  height: 600px;
  border: 1px solid black;

  path.active {
    stroke: red;
  }
`

export default StyledInputingData;