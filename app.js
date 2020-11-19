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

console.log(randomColors())
