let isDropdownVisible = false;
let isSideTrayVisible = false;
let isModalVisible = false;

const showMenu = document.querySelector(`#js-triggers li:nth-child(1) a`);
const showModal = document.querySelector(`#js-triggers li:nth-child(2) a`);
const modal = document.querySelector(`.modal-panel`);

const dropdown = document.createElement(`div`);
dropdown.classList.add(`dropdown`);
dropdown.innerHTML = `
  <ul>
    <li><a href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
  </ul>`;
document.body.appendChild(dropdown);

const sideTray = document.createElement(`div`);
sideTray.classList.add(`side-tray`);
sideTray.innerHTML = `
  <ul>
    <li><a href="#">A</a></li>
    <li><a href="#">B</a></li>
    <li><a href="#">C</a></li>
  </ul>`;
document.body.appendChild(sideTray);

const resetUI = () => {
    dropdown.classList.remove(`show`);
    sideTray.classList.remove(`show`);
    modal.classList.remove(`show`);
    isDropdownVisible = false;
    isSideTrayVisible = false;
    isModalVisible = false;
};

const updateMenuDisplay = () => {
    const width = window.innerWidth;
    if (width > 736) {
        dropdown.style.display = `block`;
        sideTray.style.display = `none`;
    } else {
        dropdown.style.display = `none`;
        sideTray.style.display = `block`;
    }
    resetUI();
};

showMenu.addEventListener(`click`, (e) => {
    e.preventDefault();
    if (isModalVisible) return;
    const isWide = window.innerWidth > 736;
    if (isWide) {
        isDropdownVisible = !isDropdownVisible;
        dropdown.classList.toggle(`show`, isDropdownVisible);
        sideTray.classList.remove(`show`);
    } else {
        isSideTrayVisible = !isSideTrayVisible;
        sideTray.classList.toggle(`show`, isSideTrayVisible);
        dropdown.classList.remove(`show`);
    }
});

showModal.addEventListener(`click`, (e) => {
    e.preventDefault();
    modal.classList.add(`show`);
    isModalVisible = true;
});

modal.addEventListener(`click`, (e) => {
    if (e.target === modal) {
        modal.classList.remove(`show`);
        isModalVisible = false;
    }
});

document.addEventListener(`keydown`, (e) => {
    if (e.key === `Escape` && isModalVisible) {
        modal.classList.remove(`show`);
        isModalVisible = false;
    }
});

window.addEventListener(`resize`, () => {
    updateMenuDisplay();
});

updateMenuDisplay();
