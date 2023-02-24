import styled from "styled-components";

const StyledSectionLi = styled.li`
  h3 {
    margin: 0;

    & ~ div {
      overflow: hidden;
      max-height: 0;
      padding: 0;
      transition: 1s;
    }

    &.active ~ div {
        max-height: 1000px;
        margin-top: 10px;
      }
  }

  div div input {
    width: 40px;
  }
`

export { StyledSectionLi };