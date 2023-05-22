import { fetchBeams, selectAllBeams } from "../../redux/beamsSlice";
import { fetchChannels, selectAllChannels } from "../../redux/channelsSlice";
import { fetchEqualAnglesCorners, selectAllEqualAnglesCorners } from "../../redux/equalAngleCornerSlice";
import { fetchUnequalAnglesCorners, selectAllUnequalAnglesCorners } from "../../redux/unequalAnglesSlice";

import { createBeam, createChannel, createEqualAnglesCorner, createUnequalAnglesCorner } from "./Sections";

export default [
  {
    sectionName: "beams",
    fetch: fetchBeams,
    selectAllSections: selectAllBeams,
    shapeCreator: (centerX, centerY, degree, shape) => createBeam(centerX, centerY, degree, shape),
    sectionNameInRussian: "Двутавр"
  },
  {
    sectionName: "channels",
    fetch: fetchChannels,
    selectAllSections: selectAllChannels,
    shapeCreator: (centerX, centerY, degree, shape) => createChannel(centerX, centerY, degree, shape),
    sectionNameInRussian: "Швеллер"
  },
  {
    sectionName: "equalAnglesCorners",
    fetch: fetchEqualAnglesCorners,
    selectAllSections: selectAllEqualAnglesCorners,
    shapeCreator: (centerX, centerY, degree, shape) => createEqualAnglesCorner(centerX, centerY, degree, shape),
    sectionNameInRussian: "Равнополочный уголок"
  },
  {
    sectionName: "unequalAnglesCorners",
    fetch: fetchUnequalAnglesCorners,
    selectAllSections: selectAllUnequalAnglesCorners,
    shapeCreator: (centerX, centerY, degree, shape, activeCase) => createUnequalAnglesCorner(centerX, centerY, degree, shape, activeCase),
    sectionNameInRussian: "Неравнополочный уголок",
    defaultActiveCase: 1
  },
]