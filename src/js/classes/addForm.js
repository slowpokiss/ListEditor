import Popover from "./popover";

export default class AddForm {
  constructor() {
    this.form = document.querySelector(".list-popup");
    this.addBtn = document.querySelector(".list-add");
    this.popoverClass = new Popover(this.form);
    this.itemsParent = document.querySelector(".items");
    this.actual = [];
    this.formErrors = {
      name: {
        valueMissing: "Введите название товара",
      },
      value: {
        valueMissing: "Введите цену товара",
        patternMismatch: "Введите число",
      },
    };
  }

  init() {
    const addCallBack = (ev) => {
      ev.preventDefault();
      this.actual.forEach((id) => this.popoverClass.closeElem(id));
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

    this.form.querySelector(".popup-cancel").addEventListener("click", (ev) => {
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
    return ![...elements].some((el) => {
      return Object.keys(ValidityState.prototype).some((key) => {
        if (!el.name) return;
        if (key === "valid") return;
        if (el.validity[key]) {
          this.actual.push(
            this.popoverClass.showElem(this.formErrors[el.name][key], el)
          );
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
