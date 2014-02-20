var $ = require('jquery');

module.exports = function () {
  /*
  event handler to deobfuscate obfuscated elements
  such as email addresses on mouseenter or click
  */
  $('.obfuscated').on('mouseenter.deobfuscate click.deobfuscate', function (e) {
    var el = $(this);

    if (el.attr('href')) {
      // http://stackoverflow.com/questions/11047670/creating-a-jquery-object-from-a-big-html-string
      $obj = $($.parseHTML('<div>' + el.attr('href') + '</div>'));
      // http://stackoverflow.com/questions/3331449/jquery-remove-element-from-string
      el.attr('href', $obj.find('.obfuscation').remove().end().text());
    }
    el.find('.obfuscation').remove();
    el.removeClass('obfuscated');
    el.off('.deobfuscate');
  });
};
