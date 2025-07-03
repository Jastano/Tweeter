/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  console.log("Client.js is loaded");


  // Build a tweet 
  const createTweetElement = function (tweet) {
    const $tweet = $(`
      <article class="tweet">
        <header>
          <div>
            <img src="${tweet.user.avatars}" alt="User avatar">
            <span>${tweet.user.name}</span>
          </div>
          <span>${tweet.user.handle}</span>
        </header>
        <p>${escape(tweet.content.text)}</p>
        <footer>
          <span>${timeago.format(tweet.created_at)}</span>
          <div>
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
    `);
    return $tweet;
  };

  // Render all tweets
  const renderTweets = function (tweets) {
    const $container = $(".tweets-container");
    $container.empty(); // Clear old
    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $container.prepend($tweet); // Newest on top
    }
  };

  // Load tweets from server
  const loadTweets = function () {
    $.ajax("/api/tweets", { method: "GET" })
      .then((tweets) => {
        renderTweets(tweets);
      });
  };

  // Initial load
  loadTweets();

  // Submit new tweet
  $("form").on("submit", function (event) {
    event.preventDefault();

    const $textarea = $("#tweet-text");
    const tweetText = $textarea.val();

    if (!tweetText.trim()) {
      alert("Tweet cannot be empty!");
      return;
    }
    if (tweetText.length > 140) {
      alert("Tweet is too long!");
      return;
    }

    const serializedData = $(this).serialize();

    $.post("/api/tweets", serializedData)
      .then(() => {
        $textarea.val("");
        $(".counter").text("140");
        loadTweets();
      });
  });
});
