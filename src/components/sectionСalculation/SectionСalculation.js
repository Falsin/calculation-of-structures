import React, { useState } from "react";
import styled from "styled-components";
import StyledInputingData from "./InputingData";
import StyledOutputingData from "./OutputingData";

function sectionСalculation({ className, children }) {
  const [result, setResult] = useState(null);

  return (
    <div className={className}>
      <StyledInputingData setResult={setResult} result={result} />
      {!result ? null : <StyledOutputingData result={result} />}
    </div>
  )
}

export const StyledSectionСalculation = styled(sectionСalculation)`
  & > div {
    display: flex;
  }

  * {
    padding: 0;
    margin: 0;
  }
`