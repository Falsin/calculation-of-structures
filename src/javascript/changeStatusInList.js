export default function changeStatus(e) {
  const parentElem = e.target.offsetParent;
  const activeElem = parentElem.querySelector("li > .active");

  if (activeElem == e.target) {
    return e.currentTarget.classList.remove("active");
  } else if (activeElem) {
    activeElem.classList.remove("active");
  }
  e.currentTarget.classList.add("active");
}