// Global selections and variables
const colorDivs = document.querySelectorAll('.color')
const generateBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')

let initialColors
// Generate a color
function generateHex() {
  const letters = '0123456789ABCDEF'
  let hash = '#'
  for (let i = 0; i < 6; i++) {
    hash += letters[Math.floor(Math.random() * 15)]
  }

  return hash
}

function randomColors() {
  colorDivs.forEach((div, index) => {
    // console.log(div.children[0]); i need to get h2 attribute which is hex.
    const hexText = div.children[0]
    const randomColor = generateHex()

    // ad the color to the dom
    div.style.backgroundColor = randomColor
    hexText.textContent = randomColor
  })
}
// console.log(generateHex())

console.log(randomColors())
