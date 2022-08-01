const form = document.querySelector('.form')
const input = document.querySelector('.form__input-text')
const select = document.querySelector('.form__select')
const add = document.querySelector('.form__button')
const list = document.querySelector('.content__list')
const date = document.querySelector('.form-control')
const contentHead = document.querySelector('.content__head')

class Content {
  constructor() {
    this.tasksArray = JSON.parse(localStorage.getItem('tasks')) || []
    this.completedTasksArray = JSON.parse(localStorage.getItem('completedTasks')) || []
    this.contentHeadArray = JSON.parse(localStorage.getItem('contentHead')) || [{
      value: 'all',
      active: true,
    }]
  }

  getContentHeadArray() {
    localStorage.setItem('contentHead', JSON.stringify(this.contentHeadArray))
    if (JSON.parse(localStorage.getItem('contentHead')).length <= 1) {
      for (let item of select.children) {
        this.contentHeadArray.push({
          value: item.textContent,
          active: false,
          color: item.dataset.color,
        })
      }
    }
    localStorage.setItem('contentHead', JSON.stringify(this.contentHeadArray))
  }

  printContentHead() {
    $('#sandbox-container input').datepicker({
      format: "dd.mm.yyyy",
      language: "ru",
      autoclose: true,
      todayHighlight: true
    });

    this.getContentHeadArray()
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
        this.printTasks(this.tasksArray)
      } else {
        let newTasksArray = this.tasksArray.filter(item => e.target.textContent === item.condition.value)
        this.printTasks(newTasksArray)
      }

      localStorage.setItem('contentHead', JSON.stringify(this.contentHeadArray))
      this.printContentHead()
    }
  }

  printTasks(array) {
    this.printContentHead()
    this.sortPerDate()
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
          <div class="item__date">${item.date}</div>
          <div class="item__condition" style='background-color: ${item.condition.color};'>${item.condition.value}</div>
          <div class="item__change"></div>
          <div class="item__delete">
            <span></span>
            <span></span>
          </div>
        `
        list.append(li);
        item.heightLocation = li.getBoundingClientRect().top
      }
    })
  }

  sortPerDate() {
    // this.tasksArray.sort((firstItem, secondItem) => {
    //   let firstItemCode = +firstItem.date.match(/[0-9]+/gm)[0] + +firstItem.date.match(/[0-9]+/gm)[1] * 100 + +firstItem.date.match(/[0-9]+/gm)[2] * 1000
    //   let secondItemCode = +secondItem.date.match(/[0-9]+/gm)[0] + +secondItem.date.match(/[0-9]+/gm)[1] * 100 + +secondItem.date.match(/[0-9]+/gm)[2] * 1000
    //   if (firstItem.condition.value === 'completed' || firstItem.checked == true) firstItemCode += 10000000
    //   if (secondItem.condition.value === 'completed' || secondItem.checked == true) secondItemCode += 10000000
    //   return firstItemCode - secondItemCode
    // })
    // localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
    this.tasksArray.sort((firstItem, secondItem) => {
      return firstItem.heightLocation - secondItem.heightLocation
    })
  }
}

class List extends Content {
  constructor() {
    super()
    this.counter = JSON.parse(localStorage.getItem('counter')) || 0
  }

  add(e) {
    e.preventDefault();
    if (input.value.length > 0) {
      let itemProgressColor = ''    // find progress color of item
      for (let i = 0; i < select.length; i++) {
        if (select[i].value === select.value) itemProgressColor = select[i].dataset.color;
      }

      this.tasksArray.push({
        number: this.counter,
        checked: false,
        value: input.value,
        date: date.value,
        condition: {
          value: select.value,
          color: itemProgressColor,
        },
      })

      this.counter++
      this.printTasks(this.tasksArray)
      localStorage.setItem('counter', JSON.stringify(this.counter))
      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      console.log(this.tasksArray);
      input.value = '';
      date.value = '';
      input.placeholder = 'task';
      input.classList.remove('wrong')
    } else {
      input.placeholder = 'ERROR. Input task';
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

      this.printTasks(this.tasksArray)
      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
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

      this.printTasks(this.tasksArray)
      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      console.log(this.tasksArray);
    }
  }

  printItemConditions(e) {
    if (e.target.classList.contains('item__condition')) {
      if (!e.target.contains(list.querySelector('.item__condition_rests'))) {
        let targetTextContent = e.target.textContent
        const additionalConditions = document.createElement('div');
        additionalConditions.classList.add('item__condition_rests');

        this.contentHeadArray.map(item => {
          e.target.closest('.item__condition').append(additionalConditions)
          if (item.value !== 'all' && item.value !== targetTextContent) {
            const additionalCondition = document.createElement('div');
            additionalCondition.classList.add('item__condition_rest');
            additionalCondition.innerHTML = item.value
            additionalCondition.style.backgroundColor = item.color
            additionalConditions.append(additionalCondition)
          }
        })
      } else {
        e.target.querySelector('.item__condition_rests').remove()
      }
    }
  }

  changeItemCondition(e) {
    if (e.target.closest('.item__condition_rest')) {
      this.tasksArray.map(item => {
        if (e.target.closest('.item').querySelector('.item__text').dataset.number == item.number) {
          item.condition.color = e.target.style.backgroundColor
          item.condition.value = e.target.textContent
        }
      })

      this.printTasks(this.tasksArray)
      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      console.log(this.tasksArray);
    }
  }

  addInputForChanging(e) {
    if ((e.target.closest('.item__text') && e.type === 'dblclick') || (e.target.closest('.item__change') && e.type === 'click')) {
      const inputForChanging = e.target.closest('.item').querySelector('.item__text')
      inputForChanging.innerHTML = `
          <input type = "text" class="item__new-text" value = '${inputForChanging.textContent}'>
        `
      inputForChanging.querySelector('.item__new-text').focus()
    }
  }

  delete(e) {
    if (e.target.closest('.item__delete')) {
      let resultArray = this.tasksArray.filter(item => e.target.closest('.item').querySelector('.item__text').dataset.number != item.number)
      this.tasksArray = resultArray

      this.printTasks(this.tasksArray)
      localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      console.log(this.tasksArray);
    }
  }

  catchItem(e) {
    if (e.target.closest('.item')) {
      let item = e.target.closest('.item')
      let background = document.createElement('div')
      let shiftY = e.clientY - item.getBoundingClientRect().top;

      function onMouseMove(event) {
        background.style.height = item.clientHeight + 'px'
        background.style.width = item.clientWidth + 'px'
        background.style.borderRadius = '5px'
        background.style.backgroundColor = '#bfbfbf'
        item.insertAdjacentElement('afterend', background)

        item.style.position = 'absolute';
        item.style.zIndex = 1000;
        item.style.width = list.clientWidth + 'px'
        item.style.top = event.pageY - shiftY + 'px';
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', (event) => {
        document.removeEventListener('mousemove', onMouseMove);
        console.dir(background);
        if (background.clientHeight > 0) {
          background.remove()
          item.style.position = 'relative';
          item.style.top = 'auto'
          item.style.zIndex = 'auto';
          this.tasksArray.map(task => {
            if (item.querySelector('.item__text').dataset.number == task.number) {
              task.heightLocation = event.pageY - shiftY
            }
          })
          this.sortPerDate()
          this.printTasks(this.tasksArray)
          localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
        }
      })
      // document.onmouseup = function (event) {
      //   document.removeEventListener('mousemove', onMouseMove);
      //   console.dir(background);
      //   if (background.clientHeight > 0) {
      //     background.remove()
      //     item.style.position = 'relative';
      //     item.style.top = 'auto'
      //     item.style.zIndex = 'auto';
      //     this.tasksArray.map(task => {
      //       if (item.querySelector('.item__text').dataset.number == task.number) {
      //         task.heightLocation = event.pageY - shiftY
      //       }
      //     })
      //     this.sortPerDate()
      //     this.printTasks(this.tasksArray)
      //     localStorage.setItem('tasks', JSON.stringify(this.tasksArray))
      //   }
      //   document.onmouseup = null
      // }
    }
  }
}

let task = new List();
task.printTasks(task.tasksArray)
contentHead.addEventListener("click", (e) => task.changeContentHead(e))
form.addEventListener('submit', (e) => task.add(e));
date.addEventListener('submit', (e) => task.add(e));
list.addEventListener('click', (e) => {
  task.delete(e)
  task.addInputForChanging(e)
  task.check(e)
  task.changeItem(e)
  task.printItemConditions(e)
  task.changeItemCondition(e)
});
list.addEventListener('mousedown', (e) => task.catchItem(e));
list.addEventListener('dblclick', (e) => task.addInputForChanging(e));
list.addEventListener("keypress", (e) => task.changeItem(e))


