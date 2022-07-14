const form = document.querySelector('.form')
const input = document.querySelector('.form__input-text')
const select = document.querySelector('.form__select')
const add = document.querySelector('.form__button')
const list = document.querySelector('.content__list')
// const clearAll = document.querySelector('.clear-all')

class Task {
  constructor() {
  }

  add(e) {
    e.preventDefault();
    // find progress color of item
    let itemProgressColor = ''
    for (let i = 0; i < select.length; i++) {
      if (select[i].value === select.value) itemProgressColor = select[i].dataset.color
    }

    const item = document.createElement('li');
    item.classList.add('item');
    item.innerHTML = `
      <input type="checkbox" name="" class="item__checkbox">
      <p class="item__text">${input.value}</p>
      <div class="item__progress" style='background-color: ${itemProgressColor};'>${select.value}</div>
      <div class="item__delete">
        <span></span>
        <span></span>
      </div>
    `
    list.append(item);
    input.value = '';
  }

  newText(e) {
    if (e.key === "Enter" && e.target.closest('.item__text')) {
      e.preventDefault();
      e.target.closest('.item__text').innerHTML = e.target.value
    }
  }

  check(e) {
    if (e.target.closest('.item__checkbox')) e.target.closest('.item').querySelector('.item__text').classList.toggle('cross')
  }

  delete(e) {
    if (e.target.closest('.item__delete')) e.target.closest('.item').remove()
  }

  change(e) {
    if (e.target.closest('.item__text')) {
      const inputForChanging = e.target.closest('.item').querySelector('.item__text')
      inputForChanging.innerHTML = `
        <input type="text" class="item__new-text" value='${inputForChanging.textContent}'>
      `
      inputForChanging.querySelector('.item__new-text').focus()
    }
  }

  clearAll(e) {
    list.innerHTML = ''
  }

}

let task = new Task();
form.addEventListener('submit', (e) => task.add(e));
list.addEventListener('click', (e) => task.delete(e));
list.addEventListener('dblclick', (e) => task.change(e));
list.addEventListener('click', (e) => task.check(e));
list.addEventListener("keypress", (e) => task.newText(e))
