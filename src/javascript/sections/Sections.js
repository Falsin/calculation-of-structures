function createBeam(centerX, centerY, degree, section) {
  const coords = [
    {x: -section.b/2, y: section.h/2},
    {x: section.b/2, y: section.h/2},
    {x: section.b/2, y: -section.h/2},
    {x: -section.b/2, y: -section.h/2} 
  ]

  return {
    ...section,
    centerX, 
    centerY, 
    degree, 
    isActive: false,
    coords,
  }
}

function createChannel(centerX, centerY, degree, section) {
  const coords = [
    {x: -section.z0*10, y: section.h/2},
    {x: section.b - section.z0*10, y: section.h/2},
    {x: section.b - section.z0*10, y: -section.h/2},
    {x: -section.z0*10, y: -section.h/2}
  ]

  return {
    ...section,
    centerX, 
    centerY, 
    degree, 
    isActive: false,
    coords,
  }
}

function createEqualAnglesCorner(centerX, centerY, degree, section) {
  const coords = [
    {x: -section.z0*10, y: section.b - section.z0*10},
    {x: section.b - section.z0*10, y: -section.z0*10},
    {x: -section.z0*10, y: -section.z0*10} 
  ]

  return {
    ...section,
    centerX, 
    centerY, 
    degree, 
    isActive: false, 
    coords,
  }
}

function createUnequalAnglesCorner(centerX, centerY, degree, section, activeCase) {
  const coords = (activeCase == 1) 
    ? [
        {x: -section.x0*10, y: section.B - section.y0*10},
        {x: section.b - section.x0*10, y: -section.y0*10},
        {x: -section.x0*10, y: -section.y0*10}
      ]
    : [
        {x: section.x0*10, y: section.B - section.y0*10},
        {x: -section.b + section.x0*10, y: -section.y0*10},
        {x: section.x0*10, y: -section.y0*10},
      ]

  return {
    ...section,
    centerX, 
    centerY, 
    degree,
    activeCase, 
    isActive: false, 
    coords,
  }
}

function createRectangle(centerX, centerY, degree, section) {
  const coords = [
    {x: -section.b/2, y: section.h/2},
    {x: section.b/2, y: section.h/2},
    {x: section.b/2, y: -section.h/2},
    {x: -section.b/2, y: -section.h/2}
  ]

  return {
    ...section,
    centerX, 
    centerY, 
    degree, 
    isActive: false,
    coords,
    type: "rectangle",
  }
}

export { createBeam, createChannel, createEqualAnglesCorner, createUnequalAnglesCorner, createRectangle }