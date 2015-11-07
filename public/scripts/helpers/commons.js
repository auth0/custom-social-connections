$(document).ready(function () {
  $('.dropdown').on('click', function(event) {
    $(event.currentTarget).toggleClass('open');
    event.stopPropagation();
  });

  $('body').on('click', function() {
    $('.dropdown').removeClass('open');
  });
});
