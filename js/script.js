const form = document.querySelector('.form')
const input = document.querySelector('.form__input-text')
const select = document.querySelector('.form__select')
const add = document.querySelector('.form__button')
const list = document.querySelector('.content__list')
const contentHead = document.querySelector('.content__head')

class ContentHead {
  constructor() {
    this.tasksArray = JSON.parse(localStorage.getItem('tasks')) || []
    this.contentHeadArray = JSON.parse(localStorage.getItem('contentHead')) || [{
      value: 'all',
      active: true,
    }]
  }

  printContentHead() {
    contentHead.innerHTML = ''
    this.contentHeadArray.map(item => {
      const div = document.createElement('div');
      div.classList.add('content__head_item');
      div.innerHTML = item.value
      item.active ?
        div.classList.add('active') :
        div.classList.remove('active')
      contentHead.append(div);
    })
  }

  changeContentHead(e) {
    if (e.target.closest('.content__head_item')) {
      this.contentHeadArray.map(item => { //print animation of ghanging group
        if (e.target.textContent === item.value) {
          item.active = true
        } else {
          item.active = false
        }
      })

      if (e.target.textContent === 'all') {
        console.log(this.tasksArray);
        this.printTasks(this.tasksArray)
      } else {
        let newTasksArray = this.tasksArray.filter(item => e.target.textContent === item.condition.value)
        this.printTasks(newTasksArray)
      }

      localStorage.setItem('contentHead', JSON.stringify(this.contentHeadArray))
      this.printContentHead()
    }
  }

  getContentHeadArray() {
    localStorage.setItem('contentHead', JSON.stringify(this.contentHeadArray))
    if (JSON.parse(localStorage.getItem('contentHead')).length <= 1) {
      for (let item of select.children) {
        this.contentHeadArray.push({
          value: item.textContent,
          active: false
        })
      }
    }
    localStorage.setItem('contentHead', JSON.stringify(this.contentHeadArray))
  }

  printTasks(array) {
    list.innerHTML = ''
    let contentHeadItem = ''
    this.contentHeadArray.map(item => {
      if (item.active) contentHeadItem = item.value
    })

    array.map(item => {
      if (contentHeadItem === item.condition.value || contentHeadItem === 'all') {
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = `
          ${item.checked ?
            `<input type="checkbox" name="" class="item__checkbox" checked>
            <p class="item__text cross" data-number=${item.number}>${item.value}</p>` :
            `<input type="checkbox" name="" class="item__checkbox">
            <p class="item__text" data-number=${item.number}>${item.value}</p>`}
          <div class="item__progress" style='background-color: ${item.condition.color};'>${item.condition.value}</div>
          <div class="item__change"></div>
          <div class="item__delete">
            <span></span>
            <span></span>
          </div>
        `
        list.append(li);
      }
    })
  }
}

class Todo extends ContentHead {
  constructor() {
    super()
  }


  add(e) {
    e.preventDefault();
    if (input.value.length > 0) {
      let itemProgressColor = ''    // find progress color of item
      for (let i = 0; i < select.length; i++) {
        if (select[i].value === select.value) itemProgressColor = select[i].dataset.color;
      }

      this.tasksArray.push({
        number: Math.round(Math.random() * 10000000),
        checked: false,
        value: input.value,
        condition: {
          value: select.value,
          color: itemProgressColor,
        },
      })

      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      this.printTasks(this.tasksArray)
      console.log(this.tasksArray);
      input.value = '';
      input.placeholder = 'input task';
      input.classList.remove('wrong')
    } else {
      input.placeholder = 'ERROR. Input value';
      input.classList.add('wrong')
    }
  }

  check(e) {
    if (e.target.closest('.item__checkbox')) {
      this.tasksArray.map(item => {
        if (+e.target.closest('.item').querySelector('.item__text').dataset.number === +item.number) {
          item.checked === false ? item.checked = true : item.checked = false
        }
      })

      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      this.printTasks(this.tasksArray)
      console.log(this.tasksArray);
    }

  }

  changeItem(e) {
    if (e.type === 'keypress' && e.key === "Enter" && e.target.closest('.item__text')) {
      e.preventDefault();
      this.tasksArray.map(item => {
        if (e.target.closest('.item').querySelector('.item__text').dataset.number == item.number) {
          item.value = e.target.value
        }
      })

      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      this.printTasks(this.tasksArray)
      console.log(this.tasksArray);
    }
  }

  addInputForChanging(e) {
    if ((e.target.closest('.item__text') && e.type === 'dblclick') || (e.target.closest('.item__change') && e.type === 'click')) {
      const inputForChanging = e.target.closest('.item').querySelector('.item__text')
      inputForChanging.innerHTML = `
        <input type="text" class="item__new-text" value='${inputForChanging.textContent}'>
      `
      inputForChanging.querySelector('.item__new-text').focus()
    }
  }

  delete(e) {
    if (e.target.closest('.item__delete')) {
      let resultArray = this.tasksArray.filter(item => e.target.closest('.item').querySelector('.item__text').dataset.number != item.number)
      this.tasksArray = resultArray

      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      this.printTasks(this.tasksArray)
      console.log(this.tasksArray);
    }
  }
}

let contentHeadClass = new ContentHead();
contentHeadClass.getContentHeadArray()
contentHeadClass.printContentHead()
contentHead.addEventListener("click", (e) => contentHeadClass.changeContentHead(e))
let task = new Todo();
task.printTasks(task.tasksArray)
form.addEventListener('submit', (e) => task.add(e));
list.addEventListener('click', (e) => task.delete(e));
list.addEventListener('dblclick', (e) => task.addInputForChanging(e));
list.addEventListener('click', (e) => task.addInputForChanging(e));
list.addEventListener('click', (e) => task.check(e));
list.addEventListener("keypress", (e) => task.changeItem(e))
list.addEventListener("click", (e) => task.changeItem(e))
