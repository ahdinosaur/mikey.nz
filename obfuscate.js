const munge = require('munge')
const rndstr = require('randomstring')

function obfuscate (s) {
  return s.match(/.{1,3}/g)
    .map((m) => `
      ${munge(m)}
      <span class='obfuscation'>
        ${rndstr.generate(2)}
      </span>
    `)
    .join('')
}

if (!module.parent) {
  var s = process.argv[2]
  console.log(obfuscate(s))
}
