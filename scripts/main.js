// Select UI triggers
const showMenuBtn = document.querySelector(`#js-triggers li:nth-child(1) a`);
const showModalBtn = document.querySelector(`#js-triggers li:nth-child(2) a`);
const modalPanel = document.querySelector(`.modal-panel`);

let isDropdownVisible = false;
let isSideTrayVisible = false;
let isModalVisible = false;

const createDropdownWrapper = () => {
    const dropdown = document.createElement(`div`);
    dropdown.classList.add(`dropdown-wrapper`);
    dropdown.innerHTML = `
    <ul class="menu-content">
      <li><a href="#">Menu 1</a>
        <ul>
          <li><a href="#">1.1</a></li>
          <li><a href="#">1.2</a></li>
          <li><a href="#">1.3</a></li>
        </ul>
      </li>
      <li><a href="#">Menu 2</a>
        <ul>
          <li><a href="#">2.1</a></li>
          <li><a href="#">2.2</a></li>
          <li><a href="#">2.3</a></li>
        </ul>
      </li>
    </ul>
  `;
    document.body.appendChild(dropdown);
    return dropdown;
};

const createSideTray = () => {
    const tray = document.createElement(`div`);
    tray.classList.add(`side-tray`);
    document.body.appendChild(tray);
    return tray;
};

const dropdownMenu = createDropdownWrapper();
const sideTray = createSideTray();

// Set initial display
dropdownMenu.style.display = `none`;
sideTray.style.display = `none`;

const resetState = () => {
    dropdownMenu.classList.remove(`show`);
    dropdownMenu.style.display = `none`;
    sideTray.classList.remove(`show`);
    sideTray.style.display = `none`;
    modalPanel.classList.remove(`show`);
    isDropdownVisible = false;
    isSideTrayVisible = false;
    isModalVisible = false;
};

const toggleMenu = () => {
    const isWide = window.innerWidth > 736;
    resetState();
    if (isWide) {
        dropdownMenu.style.display = `block`;
        requestAnimationFrame(() => dropdownMenu.classList.add(`show`));
        isDropdownVisible = true;
    } else {
        sideTray.style.display = `block`;
        requestAnimationFrame(() => sideTray.classList.add(`show`));
        isSideTrayVisible = true;
    }
};

// Click: Show Menu
showMenuBtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    if (isModalVisible) return;
    if (isDropdownVisible || isSideTrayVisible) {
        resetState();
    } else {
        toggleMenu();
    }
});

// Click: Show Modal
showModalBtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    resetState();
    modalPanel.classList.add(`show`);
    isModalVisible = true;
});

// Click: Close modal on background click
modalPanel.addEventListener(`click`, (e) => {
    if (e.target === modalPanel) {
        modalPanel.classList.remove(`show`);
        isModalVisible = false;
    }
});

// ESC: Close all
document.addEventListener(`keydown`, (e) => {
    if (e.key === `Escape`) {
        resetState();
    }
});

// Resize: Reset everything
window.addEventListener(`resize`, () => {
    resetState();
});
