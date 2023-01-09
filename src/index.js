import React from 'react';
import { createRoot } from "react-dom/client";
import { StyledSectionСalculation } from './components/sectionСalculation/SectionСalculation';
//import SectionСalculation from './components/sectionСalculation/SectionСalculation';

import store from "./redux/store";
import { Provider } from "react-redux";

const root = createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <StyledSectionСalculation />
  </Provider>
  )