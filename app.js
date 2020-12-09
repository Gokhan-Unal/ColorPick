// Global selections and variables
const colorDivs = document.querySelectorAll('.color')
const generateBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')
const hexSpans = document.querySelectorAll('.sliders span')
const popUp = document.querySelector('.copy-container')
const adjustBtn = document.querySelectorAll('.adjust')
const closeAdjustments = document.querySelectorAll('.close-adjustment')
const sliderContainers = document.querySelectorAll('.sliders')
const lockButton = document.querySelectorAll('.lock')

// console.log(adjustBtn);
console.log(hexSpans)

let initialColors

// add our event listeners
generateBtn.addEventListener('click', randomColors)

sliders.forEach((slider) => {
  slider.addEventListener('input', hslControls)
})

colorDivs.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateTextUI(index)
  })
})

currentHexes.forEach((hex) => {
  hex.addEventListener('click', () => {
    copyToClipboard(hex)
  })
})

popUp.addEventListener('transitionend', () => {
  const popupBox = popUp.children[0]
  popUp.classList.remove('active')
  popupBox.classList.remove('active')
})

adjustBtn.forEach((button, index) => {
  button.addEventListener('click', () => {
    openAdjustmentPanel(index)
  })
})

closeAdjustments.forEach((button, index) => {
  button.addEventListener('click', () => {
    closeAdjustmentPanel(index)
  })
})

// Generate a color
function generateHex() {
  const hexColor = chroma.random()
  return hexColor
}

function randomColors() {
  initialColors = []
  colorDivs.forEach((div, index) => {
    // console.log(div.children[0]); i need to get h2 attribute which is hex.
    const hexText = div.children[0]
    const randomColor = generateHex()

    if (div.classList.contains('locked')) {
      initialColors.push(hexText.innerText)
      return
    } else {
      // get the hex values and store it in initialColors
      initialColors.push(chroma(randomColor).hex())
    }

    // ad the color to the dom
    div.style.backgroundColor = randomColor
    hexText.textContent = randomColor
    // Check contrast
    checkTextContrast(randomColor, hexText)
    // init colorize sliders
    const color = chroma(randomColor)
    const sliders = div.querySelectorAll('.sliders input')
    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]

    colorizeSliders(color, hue, brightness, saturation)

    hexSpans.forEach((span) => {
      checkTextContrast(randomColor, span)
    })
  })
  resetInputs()

  adjustBtn.forEach((button, index) => {
    checkTextContrast(initialColors[index], button)
    checkTextContrast(initialColors[index], lockButton[index])
  })
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance() // how dark or light is the text
  if (luminance > 0.5) {
    text.style.color = 'black'
  } else {
    text.style.color = 'white'
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  // Scale saturation
  const noSaturation = color.set('hsl.s', 0)
  const fullSaturation = color.set('hsl.s', 1)
  const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation])

  const midBright = color.set('hsl.l', 0.5)
  // no need to select 0 or 1 bc we know these are the color of black and white
  const scaleBright = chroma.scale(['black', midBright, 'white'])

  // update input colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(
    0
  )}, ${scaleSaturation(1)})`

  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(
    0.5
  )}, ${scaleBright(1)})`

  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`
}

function hslControls(e) {
  const index =
    e.target.getAttribute('data-bright') ||
    e.target.getAttribute('data-sat') ||
    e.target.getAttribute('data-hue')
  // console.log(index);

  // select the .sliders
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')
  // console.log(sliders)
  const hue = sliders[0]
  const brightness = sliders[1]
  const saturation = sliders[2]

  // give me the hex value
  const bgColor = initialColors[index]
  // console.log(bgColor)

  let color = chroma(bgColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value)

  colorDivs[index].style.backgroundColor = color
  colorizeSliders(color, hue, brightness, saturation)
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index]
  const color = chroma(activeDiv.style.backgroundColor)
  const textHex = activeDiv.querySelector('h2')
  const icons = activeDiv.querySelectorAll('.controls button')
  textHex.textContent = color.hex()

  // Check Contrast
  checkTextContrast(color, textHex)
  for (icon of icons) {
    checkTextContrast(color, icon)
  }

  for (span of hexSpans) {
    checkTextContrast(color, span)
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll('.sliders input')
  sliders.forEach((slider) => {
    if (slider.name === 'hue') {
      const hueColor = initialColors[slider.getAttribute('data-hue')]
      const hueValue = chroma(hueColor).hsl()[0] // hue
      slider.value = Math.floor(hueValue)
    }
    if (slider.name === 'brightness') {
      const brightColor = initialColors[slider.getAttribute('data-bright')]
      const brightValue = chroma(brightColor).hsl()[2] // bright
      slider.value = Math.floor(brightValue * 100) / 100
    }
    if (slider.name === 'saturation') {
      const satColor = initialColors[slider.getAttribute('data-sat')]
      const satValue = chroma(satColor).hsl()[1] // sat
      slider.value = Math.floor(satValue * 100) / 100
    }
    // hsl -> h: hue, s: saturation l: bright
  })
}

function copyToClipboard(hex) {
  const el = document.createElement('textarea')
  el.value = hex.innerText
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)

  const popupBox = popUp.children[0]
  popupBox.classList.add('active')
  popUp.classList.add('active')
}

function openAdjustmentPanel(index) {
  sliderContainers[index].classList.toggle('active')
}

function closeAdjustmentPanel(index) {
  sliderContainers[index].classList.remove('active')
}

randomColors()
