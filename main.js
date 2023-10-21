/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/classes/popover.js
class Popover {
  constructor(form) {
    this.form = form;
    this.popupInputName = this.form.querySelector(".popup-input-name");
    this.popupInputValue = this.form.querySelector(".popup-input-value");
    this._tooltips = [];
  }
  showElem(text, elemToPop) {
    const tooltipElem = document.createElement("div");
    tooltipElem.classList.add("arrow");
    tooltipElem.textContent = text;
    const id = performance.now();
    this._tooltips.push({
      id,
      element: tooltipElem
    });
    document.body.appendChild(tooltipElem);
    const popParams = elemToPop.getBoundingClientRect();
    tooltipElem.style.left = popParams.left + popParams.width / 2 - tooltipElem.getBoundingClientRect().width / 2 + "px";
    tooltipElem.style.top = popParams.top - tooltipElem.getBoundingClientRect().bottom + "px";
    return id;
  }
  closeElem(id) {
    const elemToDel = this._tooltips.find(el => el.id === id);
    elemToDel.element.remove();
    this._tooltips = this._tooltips.filter(el => el.id !== id);
  }
}
;// CONCATENATED MODULE: ./src/js/classes/addForm.js

class AddForm {
  constructor() {
    this.form = document.querySelector(".list-popup");
    this.addBtn = document.querySelector(".list-add");
    this.popoverClass = new Popover(this.form);
    this.itemsParent = document.querySelector(".items");
    this.actual = [];
    this.formErrors = {
      name: {
        valueMissing: "Введите название товара"
      },
      value: {
        valueMissing: "Введите цену товара",
        patternMismatch: "Введите число"
      }
    };
  }
  init() {
    const addCallBack = ev => {
      ev.preventDefault();
      this.actual.forEach(id => this.popoverClass.closeElem(id));
      this.actual = [];
      if (this.checkFormValidity(this.form.elements)) {
        const inputName = this.form.querySelector(".popup-input-name");
        const inputValue = this.form.querySelector(".popup-input-value");
        const elemToAdd = this.add(inputName.value, Number(inputValue.value));
        this.itemsParent.appendChild(elemToAdd);
        this.closeForm();
        this.clearForm();
        this.form.removeEventListener("submit", addCallBack);
      }
    };
    this.addBtn.addEventListener("click", () => {
      this.showForm();
      this.clearForm();
      this.form.addEventListener("submit", addCallBack);
    });
    this.form.querySelector(".popup-cancel").addEventListener("click", ev => {
      ev.preventDefault();
      this.form.removeEventListener("submit", addCallBack);
      this.form.removeEventListener("submit", this.editCallBack);
      this.clearForm();
      if (this.popoverClass._tooltips.length > 0) {
        this.popoverClass.closeElem(this.popoverClass._tooltips[0].id);
        this.actual = [];
      }
      this.closeForm();
    });
  }
  checkFormValidity(elements) {
    return ![...elements].some(el => {
      return Object.keys(ValidityState.prototype).some(key => {
        if (!el.name) return;
        if (key === "valid") return;
        if (el.validity[key]) {
          this.actual.push(this.popoverClass.showElem(this.formErrors[el.name][key], el));
          return true;
        }
      });
    });
  }
  addInputFields(elName, elValue) {
    this.form.querySelector(".popup-input-name").value = elName;
    this.form.querySelector(".popup-input-value").value = elValue;
  }
  showForm() {
    this.form.parentElement.classList.add("active");
    this.form.classList.add("active");
  }
  closeForm() {
    this.form.parentElement.classList.remove("active");
    this.form.classList.remove("active");
  }
  clearForm() {
    const inputName = this.form.querySelector(".popup-input-name");
    const inputValue = this.form.querySelector(".popup-input-value");
    inputName.value = "";
    inputValue.value = "";
    inputName.classList.remove("valid");
    inputValue.classList.remove("valid");
    inputName.classList.remove("invalid");
    inputValue.classList.remove("invalid");
    this.form.classList.remove("was-validated");
  }
}
;// CONCATENATED MODULE: ./src/js/classes/addItem.js

class addItem extends AddForm {
  constructor() {
    super();
    this.init();
    this.itemFolder = [];
  }
  add(name, value) {
    const maket = document.createElement("tr");
    maket.classList.add("item-card");
    maket.insertAdjacentHTML("beforeend", `
    <td class="list-item item-name">${name}</td>
    <td class="list-item item-value">${value}</td>
    <td class="list-item item-actions">
      <div class="actions">
        <div class="action action-edit">&#9998;</div>
        <div class="action action-delete">&#10008;</div>
      </div>
    </td>`);
    const itemObj = {
      item: maket,
      name,
      value,
      id: this.itemFolder.length
    };
    this.itemFolder.push(itemObj);
    itemObj.item.querySelector(".action-delete").addEventListener("click", ev => {
      ev.preventDefault();
      this.updateId();
      this.deleteItem(itemObj.item, itemObj.id);
    });
    itemObj.item.querySelector(".action-edit").addEventListener("click", ev => {
      ev.preventDefault();
      this.edit(itemObj, ev.target.closest(".item-card"));
    });
    return itemObj.item;
  }
  initialAdd(name, value) {
    const elem = this.add(name, value);
    this.itemsParent.appendChild(elem);
  }
  deleteItem(elem, id) {
    elem.remove();
    this.itemFolder.splice(id, 1);
    this.updateId();
  }
  edit(elem) {
    this.clearForm();
    this.showForm();
    this.addInputFields(elem.name, elem.value);
    this.editCallBack = ev => {
      ev.preventDefault();
      this.actual.forEach(id => this.popoverClass.closeElem(id));
      this.actual = [];
      if (this.checkFormValidity(this.form.elements)) {
        const inputName = this.form.querySelector(".popup-input-name").value;
        const inputValue = this.form.querySelector(".popup-input-value").value;
        elem.name = inputName;
        elem.value = Number(inputValue);
        elem.item.querySelector(".item-name").textContent = inputName;
        elem.item.querySelector(".item-value").textContent = inputValue;
        this.clearForm();
        this.closeForm();
        this.update();
        this.form.removeEventListener("submit", this.editCallBack);
      }
    };
    this.form.addEventListener("submit", this.editCallBack);
  }
  update() {
    this.itemsParent.innerHTML = "";
    this.itemFolder.forEach(el => {
      this.itemsParent.appendChild(el.item);
    });
  }
  updateId() {
    this.itemFolder.forEach((el, ind) => {
      el.id = ind;
    });
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const b = new addItem();
b.initialAdd("iPhone XR", 80000);
b.initialAdd("Samsung Galaxy", 60000);
b.initialAdd("Huawie View", 50000);
b.initialAdd("Xiaomi", 10000);
;// CONCATENATED MODULE: ./src/index.js


// TODO: write your code in app.js
/******/ })()
;