

export default class addForm {
  constructor() {
    this.form = document.querySelector(".list-popup");
    this.addBtn = document.querySelector(".list-add");

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

    this.form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      // const inputName = this.form.querySelector(".popup-input-name");
      // const inputValue = this.form.querySelector(".popup-input-value");
      // this.add(inputName.value, Number(inputValue.value));
      // this.clearForm();
      // this.closeForm();

      const elements = this.form.elements
      Array.from(elements).some(el => {

        return Object.keys(ValidityState.prototype).some(key => {
          if (!el.name) return;
          if (key === 'valid') return ;
          if (el.validity[key]) {
          
            console.log(this.formErrors[el.name][key])
            //pop.showElem(this.form, this.formErrors[el.name][key])
            return true;
          }
        });
      });
    });

    this.form.querySelector(".popup-cancel").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.clearForm();
      this.closeForm();
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
  }
}
