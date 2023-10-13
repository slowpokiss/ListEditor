import addForm from "./addForm";

export default class addItem extends addForm {
  constructor() {
    super();
    this.init();
    this.itemFolder = [];
  }

  add(name, value) {
    const maket = document.createElement("tr");
    maket.classList.add("item-card");
    maket.insertAdjacentHTML(
      "beforeend",
      `
    <td class="list-item item-name">${name}</td>
    <td class="list-item item-value">${value}</td>
    <td class="list-item item-actions">
      <div class="actions">
        <div class="action action-edit">&#9998;</div>
        <div class="action action-delete">&#10008;</div>
      </div>
    </td>`
    );

    const itemObj = { item: maket, name, value, id: this.itemFolder.length };
    this.itemFolder.push(itemObj);

    itemObj.item.querySelector(".action-delete").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.updateId();
      this.deleteItem(itemObj.item, itemObj.id);
    });

    itemObj.item.querySelector(".action-edit").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.edit(itemObj, ev.target.closest('.item-card'));
    });

    return itemObj.item
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
    this.addInputFields(elem.name, elem.value);
    this.showForm();

    this.editCallBack = (ev) => {
      ev.preventDefault();
      this.actual.forEach((id) => this.popoverClass.closeElem(id));
      this.actual = [];
      console.log(this.form.elements[0].value)
      if (this.checkFormValidity(this.form.elements)) {
        const inputName = this.form.querySelector(".popup-input-name").value;
        const inputValue = this.form.querySelector(".popup-input-value").value;
        elem.name = inputName;
        elem.value = Number(inputValue);
        elem.item.querySelector('.item-name').textContent = inputName;
        elem.item.querySelector('.item-value').textContent = inputValue;

        this.update();
        this.clearForm();
        this.closeForm();
        this.form.removeEventListener('submit', this.editCallBack);
      }
    }

    this.form.addEventListener("submit", this.editCallBack);
  }

  update() {
    this.itemsParent.innerHTML = "";
    this.itemFolder.forEach((el) => {
      this.itemsParent.appendChild(el.item);
    });
  }

  updateId() {
    this.itemFolder.forEach((el, ind) => {
      el.id = ind;
    });
  }
}
