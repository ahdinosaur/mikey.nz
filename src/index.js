var $ = require('jquery')
var contain = require('contain-cover').contain
var deobfuscate = require('./deobfuscate')

deobfuscate()

/*
var container = document.querySelector('.main-image')
var image = new Image()
image.src = './images/mikey-large.jpg'
container.appendChild(image)

console.log('clientWidth', container.clientWidth)
console.log('clientHeight', container.clientHeight)
console.log('width', image.width)
console.log('height', image.height)

window.addEventListener('resize', function (ev) {
  scale()
}, false)
scale()

function scale () {
  var dimensions = contain(
    container.clientWidth,
    container.clientHeight,
    image.width,
    image.height
  )
  console.log('dimensions', dimensions)
  //container.width = dimensions.width
  //container.height = dimensions.height,
  image.width = dimensions.width
  image.height = dimensions.height
}

var canvas = document.createElement('canvas')
container.appendChild(canvas)

var context = canvas.getContext('2d')
console.log('context', context)
context.fillStyle = 'red'
//context.fillRect(0, 0, canvas.width, canvas.height)

function contain (containerWidth, containerHeight, width, height) {
  
}
*/
