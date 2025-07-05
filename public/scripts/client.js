$(document).ready(function () {
  console.log("Client.js is loaded");

  // Escape function for security
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Build a tweet 
  const createTweetElement = function (tweet) {
    const $tweet = $(`
      <article class="tweet">
        <header>
          <div class="left">
            <img src="${tweet.user.avatars}" alt="User Avatar">
            <span class="name">${tweet.user.name}</span>
          </div>
          <span class="handle">${tweet.user.handle}</span>
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
    $container.empty(); // Clear old tweets
    for (const tweet of tweets) {
      const $tweetElement = createTweetElement(tweet);
      $container.prepend($tweetElement); 
    }
  };

  // Load tweets from server
  const loadTweets = function () {
    $.ajax("/api/tweets", { method: "GET" })
      .then((tweets) => {
        renderTweets(tweets);
      });
  };

  // Initial test tweets
  const data = [
    {
      user: {
        name: "Newton",
        avatars: "https://i.imgur.com/73hZDYK.png",
        handle: "@SirIsaac"
      },
      content: {
        text: "If I have seen further it is by standing on the shoulders of giants"
      },
      created_at: 1461116232227
    },
    {
      user: {
        name: "Descartes",
        avatars: "https://i.imgur.com/nlhLi3I.png",
        handle: "@rd"
      },
      content: {
        text: "Je pense , donc je suis"
      },
      created_at: 1461113959088
    }
  ];

  // Render test tweets
  renderTweets(data);

  // Initial load (if connected to server)
  loadTweets();

  // Submit handler
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
