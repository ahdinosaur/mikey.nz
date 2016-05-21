module.exports = function () {
  /*
  event handler to deobfuscate obfuscated elements
  such as email addresses on mouseenter or click
  */
  var obfuscated = document.querySelectorAll('.obfuscated')

  for (var i = 0; i < obfuscated.length; i++) {
    addEvent(obfuscated.item(i))
  }
}

function addEvent (element) {
  // add event listeners
  element.addEventListener('mouseenter', handleEvent)
  element.addEventListener('click', handleEvent)

  function handleEvent (ev) {
    if (element.getAttribute('href')) {
      var pseudoElement = document.createElement('div')
      pseudoElement.innerHTML = element.getAttribute('href')
      var href = removeObfuscation(pseudoElement).innerHTML
      element.setAttribute('href', href)
    }
    // remove any obfuscation child elements
    removeObfuscation(element)

    // remove obfuscated class
    element.classList.remove('obfuscated')
  
    // remove event listeners
    element.removeEventListener('mouseenter', handleEvent)
    element.removeEventListener('click', handleEvent)
  }
}

function removeObfuscation (element) {
  var obfuscation = element.querySelectorAll('.obfuscation')
  for (var i = 0; i < obfuscation.length; i++) {
    element.removeChild(obfuscation.item(i))
  }
  return element
}
