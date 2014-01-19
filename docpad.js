// DocPad Configuration File
// http://docpad.org/docs/config

module.exports = {
  templateData: {
    site: {
      title: "dinosaur is",
      description: "a hippie hacker",
      email: "dinosaur@riseup.net",
    },
    helpers: {
      obfuscate: function (s) {
        var munge = require('munge');
        var rndstr = require('randomstring');
        return s.match(/.{1,3}/g).map(function(m) { return munge(m)+"<span class='obfuscation'>"+rndstr.generate(2)+'</span>'; }).join('');
      },
    },
  },
  plugins: {
    browserifybundler: {
      inFiles: "/scripts/index.js",
      outFile: "/scripts/bundle.js",
    },
    raw: {
      'font-awesome': {
        command: ['rsync', '-r', 'node_modules/font-awesome/fonts/', 'out/fonts'],
      },
      semantic: {
        command: ['rsync', '-r', 'node_modules/semantic/src/fonts/', 'out/fonts'],
      },
    },
    ghpages: {
      deployRemote: 'target',
      deployBranch: 'master',
    },
  },
  environments: {
    development: {
      port: 5000,
    },
  },
};