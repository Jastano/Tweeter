$(document).ready(function() {
  console.log("composer-char-counter.js is ready!");

  // Listen for input on the textarea inside .new-tweet
  $('.new-tweet textarea').on('input', function() {
    const maxLength = 140;
    const textLength = $(this).val().length;
    const charsLeft = maxLength - textLength;


    const counter = $(this).closest('form').find('.counter');

    counter.text(charsLeft);

    // Red if over limit
    if (charsLeft < 0) {
      counter.addClass('over-limit');
    } else {
      counter.removeClass('over-limit');
    }
  });
});
