const slideContainer = document.getElementById('slideContainer')
const displayText = document.querySelector('aside')
const body = document.querySelector('body')
const main = document.querySelector('main')
const headerDisplay = document.querySelector('#header_display')
const btnList = document.getElementsByTagName('button')
const inputList = document.getElementsByTagName('input')
const hueDisplay = document.querySelector('.hueDisplay')

let id
let displayHSL
let toggleCssDispaly = false
let special = false
let screenWidth = window.innerWidth
let isTouch = false
let touchExit = 0

// TODO add veritcal contrils for brightness and saturation
// let screenHeight = window.innerHeight
let hueSwitcher = 0
let running = false

// Construct the variabls for different inputs
const hsl = {
  hue1: {
    min: 0,
    max: 360,
    value: Math.floor(Math.random() * 360),
    'data-type': '',
    id: 'hue1',
    label: 'Hue 1',
    className: 'col'
  },
  hue2: {
    min: 0,
    max: 360,
    value: Math.floor(Math.random() * 360),
    'data-type': '',
    id: 'hue2',
    label: 'Hue 2',
    className: 'col'
  },
  sat1: {
    min: 0,
    max: 100,
    value: 100,
    'data-type': '%',
    id: 'sat1',
    label: 'Saturation 1',
    className: 'col'
  },
  sat2: {
    min: 0,
    max: 100,
    value: 100,
    'data-type': '%',
    id: 'sat2',
    label: 'Saturation 2',
    className: 'col'
  },
  brightness1: {
    min: 0,
    max: 100,
    value: 50,
    'data-type': '%',
    id: 'brightness1',
    label: 'Brightness 1',
    className: 'col'
  },
  brightness2: {
    min: 0,
    max: 100,
    value: 50,
    'data-type': '%',
    id: 'brightness2',
    label: 'Brightness 2',
    className: 'col'
  },
  anchor1: {
    min: 0,
    max: 100,
    value: 0,
    'data-type': '%',
    id: 'anchor1',
    label: 'Anchor Point 1',
    className: 'col'
  },
  anchor2: {
    min: 0,
    max: 100,
    value: 100,
    'data-type': '%',
    id: 'anchor2',
    label: 'Anchor Point 2',
    className: 'col'
  },
  deg: {
    min: 0,
    max: 360,
    value: 90,
    'data-type': 'deg',
    id: 'deg',
    label: 'Degree',
    className: 'w-100'
  },
  speed: {
    min: 1,
    max: 250,
    value: 100,
    'data-type': 'speed',
    id: 'speed',
    label: 'Speed',
    className: 'w-100'
  }
}

const createSlider = obj => `
    <label for="${obj.id}">${obj.label} : ${obj.value} ${obj['data-type']}</label>
    <input
        type="range"
        min="${obj.min}"
        max="${obj.max}"
        value="${obj.value}"
        class="slider"
        data-type="${obj['data-type']}"
        id="${obj.id}"
    />
`

// Func for handling background styling
const updateBG = () => {
  displayHSL = `background: linear-gradient(
          ${hsl.deg.value}deg,
          hsl(${hsl.hue1.value}, ${hsl.sat1.value}%, ${hsl.brightness1.value}%) ${hsl.anchor1.value}%,
          hsl(${hsl.hue2.value}, ${hsl.sat2.value}%, ${hsl.brightness2.value}%) ${hsl.anchor2.value}%
        )`

  // set the body background
  body.setAttribute('style', displayHSL)
}

// Func for changeing bg with timeInterval
const timer = () => {
  id = window.setInterval(() => {
    hsl.hue1.value < 361 ? hsl.hue1.value++ : (hsl.hue1.value = 0)
    hsl.hue2.value < 361 ? hsl.hue2.value++ : (hsl.hue2.value = 0)
    updateBG()
    if (toggleCssDispaly) {
      displayText.textContent = displayHSL
    }
  }, hsl.speed.value)
}

const resetTimer = () => {
  clearInterval(id)
  timer()
}

const displaySliders = () => {
  slideContainer.innerHTML = ''
  Object.keys(hsl).forEach(key => {
    const divEl = document.createElement('div')
    divEl.classList.add(hsl[key].className)
    divEl.classList.add('px')
    divEl.innerHTML = createSlider(hsl[key])
    slideContainer.appendChild(divEl)
  })
}

const handleDisableEls = els =>
  Array.from(els).forEach(item =>
    item.disabled ? (item.disabled = false) : (item.disabled = true)
  )

// const enableEls = els

// Event listeners
document.addEventListener('change', ({ target }) => {
  if (target.className === 'slider') {
    hsl[target.id].value = parseInt(target.value)
    if (target.attributes['data-type'].value !== 'speed') {
      updateBG()
    } else {
      resetTimer()
    }
  }
  if (toggleCssDispaly) {
    displayText.textContent = displayHSL
  }
  displaySliders()
})

//* ==================================================
// ****************** GLOABL CLICK *******************
//* ==================================================

const checkExitSpecial = () => {
  touchExit++
  if (touchExit >= 2) {
    window.setTimeout(() => {
      stopSpecial()
      touchExit = 0
    }, 300)
  }
  // Use timeout to validate double click on mobile device
  window.setTimeout(() => {
    touchExit = 0
  }, 300)
}

document.addEventListener('touchstart', ({ target }) => {
  // Set flag to detarmine if touch based env
  isTouch = true
  if (special) {
    checkExitSpecial()
  } else if (target.tagName === 'BUTTON') {
    handleClickAndTouchEvent(target)
  }
})

document.addEventListener('click', ({ target }) => {
  if (!isTouch) {
    if (special) {
      stopSpecial()
    } else if (target.tagName === 'BUTTON') {
      handleClickAndTouchEvent(target)
    }
  }
})

const handleClickAndTouchEvent = target => {
  // Use html ID's to trigger funcs from funcs Obj
  funcs[target.id]()
  if (target.id === 'toggleStartStop' || target.id === 'displayCss') {
    target.classList.value
      ? target.classList.remove('btn_active')
      : target.classList.add('btn_active')
  }
}
//* ==================================================

const handleSpecialFeature = positionX => {
  if (special) {
    screenWidth = window.innerWidth
    // TODO add veritcal contrils for brightness and saturation
    // screenHeight = window.innerHeight
    const granularX = screenWidth / 360
    const updateHue = Math.floor(positionX / granularX)
    hsl[!hueSwitcher ? 'hue1' : 'hue2'].value = updateHue
    updateBG()
    if (!toggleCssDispaly) hueDisplay.textContent = 'Hue: ' + updateHue
    else displayText.textContent = displayHSL
  }
}
document.addEventListener('mousemove', e => {
  if (!isTouch) {
    handleSpecialFeature(e.clientX)
  }
})

document.addEventListener('touchmove', ({ changedTouches }) => {
  handleSpecialFeature(changedTouches[0].clientX)
})

// Define button click funcs
// ========================================
const random = () => {
  hsl.hue1.value = Math.floor(Math.random() * 360)
  hsl.hue2.value = Math.floor(Math.random() * 360)
  updateBG()
  displaySliders()
}

const displayCss = () => {
  toggleCssDispaly = !toggleCssDispaly
  if (toggleCssDispaly) {
    displayText.textContent = displayHSL
  } else {
    displayText.textContent = ''
  }
}

const toggleStartStop = () => {
  const btn = document.getElementById('toggleStartStop')
  running = !running
  if (running) {
    btn.textContent = 'Stop'
    timer()
    displaySliders()
  } else {
    btn.textContent = 'Start'

    window.clearInterval(id)
    displaySliders()
  }
}

const startSpecial = toggle => {
  // Toggle between 1st or 2nd hue
  hueSwitcher = toggle
  special = !special
  if (special) {
    body.classList.add('curser_special')
    headerDisplay.textContent = isTouch
      ? 'Double Tab Anywhere to stop touch change'
      : 'Click anywhere to stop touch change'
    headerDisplay.classList.add('animate_header')
    main.classList.add('muted')
    handleDisableEls(btnList)
    handleDisableEls(inputList)
  }
  if (id) {
    toggleStartStop()
  }
}

const stopSpecial = () => {
  special = false
  displaySliders()
  body.classList.remove('curser_special')
  main.classList.remove('muted')
  headerDisplay.classList.remove('animate_header')
  handleDisableEls(btnList)
  handleDisableEls(inputList)
  hueDisplay.textContent = ''
  init()
}

// Store fucntions for button clicks
// User anonymous func to avoid calling on load
const funcs = {
  toggleStartStop: () => toggleStartStop(),
  random: () => random(),
  displayCss: () => displayCss(),
  special1: () => startSpecial(0),
  special2: () => startSpecial(1)
}
// ========================================

// Init funcs

const init = () => {
  headerDisplay.textContent = 'See the colors change'
  updateBG()
  displaySliders()
}

init()
