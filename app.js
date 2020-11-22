// Global selections and variables
const colorDivs = document.querySelectorAll('.color')
const generateBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')

let initialColors
// Generate a color
function generateHex() {
  const hexColor = chroma.random()
  return hexColor
}

function randomColors() {
  colorDivs.forEach((div, index) => {
    // console.log(div.children[0]); i need to get h2 attribute which is hex.
    const hexText = div.children[0]
    const randomColor = generateHex()

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
  })
}
// console.log(generateHex())

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

  const midBright = color.set('hsl.s', 0.5)
  // no need to select 0 or 1 bc we know these are the color of black and white
  const scaleBright = chroma.scale(["black", midBright, "white"])

  // update input colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(
    0
  )}, ${scaleSaturation(1)})`

  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`

  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`
}

console.log(randomColors())
