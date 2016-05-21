var deobfuscate = require('./deobfuscate')
var pull = require('pull-stream/pull')
var drain = require('pull-stream/sinks/drain')
var rainbow = require('rainbow-pixels')
var toCanvas = require('pixels-canvas')
var raf = require('pull-raf')

deobfuscate()

var container = document.querySelector('.main-image')
var image = new Image()
container.appendChild(image)

var canvas = document.createElement('canvas')
canvas.height = '1'
container.appendChild(canvas)

var canvasDrain
window.addEventListener('resize', function (ev) {
  scale()
}, false)
scale()

function scale () {
  if (canvasDrain) canvasDrain.abort()
  image.style.display = 'none'
  canvas.style.display = 'none'
  container.style.width = 'unset'
  container.style.height = 'unset'

  var bounds = container.getBoundingClientRect()
  if (bounds.width > 800) {
    image.src = './images/mikey-large.jpg'
    container.style.backgroundImage = 'unset'
    canvas.style.height = container.style.height = bounds.height + 'px'
    canvas.style.width = container.style.width = bounds.width + 'px'
    image.style.display = 'unset'
    canvas.style.display = 'unset'

    canvasDrain = drain(toCanvas(canvas))
    
    pull(
      rainbow({
        inc: 2,
        shape: [64]
      }),
      raf(),
      canvasDrain
    )
  } else {
    image.src = null
    container.style.backgroundImage = 'url(./images/mikey-small.jpg)'
  }
}
