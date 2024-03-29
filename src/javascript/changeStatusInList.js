export default function changeStatus(e, func) {
  const parentElem = e.target.offsetParent;
  const activeElem = parentElem.querySelector("li > .active");

  if (func) {
    func(null)
  }

  switchChildren(parentElem);
  if (activeElem == e.target) {
    return activeElem.classList.remove("active");
  } else if (activeElem) {
    activeElem.classList.remove("active");
  }
  e.currentTarget.classList.add("active");
}

function switchChildren(parentElem) {
  const activeChildren = [...parentElem.querySelectorAll(".active")];
  activeChildren.forEach(elem => elem.classList.remove("active"))
}