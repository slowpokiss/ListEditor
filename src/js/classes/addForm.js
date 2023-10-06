import Popover from "./popover";

export default class AddForm {
  constructor() {
    this.form = document.querySelector(".list-popup");
    this.addBtn = document.querySelector(".list-add");
    this.popoverClass = new Popover(this.form)

    this.addBtn.addEventListener("click", () => {
      this.showForm();
    });

    this.formErrors = {
      name: {
        valueMissing: 'Введите название товара',
      },
      value: {
        valueMissing: 'Введите цену товара',
        patternMismatch: 'Введите число',
      }
    }

    this.actual = [];
    this.form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      this.actual.forEach(id => this.popoverClass.closeElem(id));
      this.actual = [];
      const elements = this.form.elements;

      if (![...elements].some(this.checkFormValidity())) {
        const inputName = this.form.querySelector(".popup-input-name");
        const inputValue = this.form.querySelector(".popup-input-value");
        this.add(inputName.value, Number(inputValue.value));
        this.clearForm();
        this.closeForm();
      }
    });

    this.form.querySelector(".popup-cancel").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.clearForm();
      if (this.popoverClass._tooltips[0]) {
        this.popoverClass.closeElem(this.popoverClass._tooltips[0].id)
        this.actual = [];
      }
      this.closeForm();
    });
  }

  checkFormValidity() {
    return (el) => {
      return Object.keys(ValidityState.prototype).some(key => {
        if (!el.name) return;
        if (key === 'valid') return;
        if (el.validity[key]) {
          this.actual.push(this.popoverClass.showElem(this.formErrors[el.name][key], el))
          return true;
        }
      });
    }
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
  }
}
