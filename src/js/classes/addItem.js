import addForm from "./addForm";


export default class addItem extends addForm {
  constructor() {
    super();
    this.itemFolder = [];
    this.itemsParent = document.querySelector(".items");
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
    this.show(itemObj);
  }

  deleteItem(elem, id) {
    elem.remove();
    this.itemFolder.splice(id, 1);
    this.updateId();
  }

  show(elem) {
    elem.item
      .querySelector(".action-delete")
      .addEventListener("click", (ev) => {
        ev.preventDefault();
        this.updateId();
        this.deleteItem(elem.item, elem.id);
      });

    elem.item.querySelector(".action-edit").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.edit(elem);
      this.form.onsubmit = () => {
        let newElem = this.itemFolder[this.itemFolder.length - 1];
        newElem.id = elem.id;
        this.itemFolder[elem.id] = newElem;
        this.itemFolder.splice(this.itemFolder.length - 1, 1);
        this.update();
      };
    });
    this.itemsParent.appendChild(elem.item);
  }

  edit(elem) {
    this.addInputFields(elem.name, elem.value);
    this.showForm();
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
