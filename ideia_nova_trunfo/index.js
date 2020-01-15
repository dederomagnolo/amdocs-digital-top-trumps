window.onload = function() {
  // Constructor Function for a single card
  function createCard(name, image_src, data, id, description) {
    this.name = name;
    this.img = image_src;
    this.data = data;
    this.id = id;
    this.description = description;
  }

  // Constructor Function for an empty pack
  function createPack(name) {
    this.name = name;
    this.cards = [];

    // Method to add a new card to the pack
    this.add_new_card = function(name, image_src, data, description) {
      var num_cards = this.cards.length;
      var new_card = new createCard(name, image_src, data, num_cards + 1, description);
      this.cards.push(new_card);
    };

    // method to shuffle the pack of cards
    // Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
    this.shuffle = function() {
      var m = this.cards.length;
      var temp, index;
      // While there remain elements to shuffle…
      while (m > 0) {
        // decrease m by 1
        m--;
        // Pick a remaining element…
        index = Math.floor(Math.random() * m);

        // And swap it with the current element.
        temp = this.cards[m];
        this.cards[m] = this.cards[index];
        this.cards[index] = temp;
      }
    };

    // Method to put the top card to the bottom
    this.top_to_bottom = function() {
      this.cards.push(this.cards[0]);
      // remove the first card
      this.cards.splice(0, 1);
    };
  }

  // Create the Game Object which contains properties and methods for the state of the overall game
  function createGame() {
    this.startTimer = () => {
      setInterval(function() {
        if (game.timer > 0) {
          game.timer -= 1000;
          var min = parseInt(game.timer / 60000);
          var sec = parseInt((game.timer % 60000) / 1000);

          if (sec < 10) {
            $("#timer").text("Time: " + min + ":0" + sec);
            console.log("Time: " + min + ":0" + sec);
          } else {
            $("#timer").text("Time: " + min + ":" + sec);
            console.log("Time: " + min + ":0" + sec);
          }
        } else {
          game.finishGame();
        }
      }, 1000);
    };

    this.finishGame = () => {
      $(".gameover").css("visibility", "visible");
      if (game.timer > 0 && game.player_pack[0].cards.length > 0) {
        game.score += game.timer / 1000;
      }

      if (game.player_pack[0].cards.length > game.player_pack[1].cards.length) {
        $("#winner").text("You win!");
      } else if (
        game.player_pack[0].cards.length < game.player_pack[1].cards.length
      ) {
        $("#winner").text("You lose!");
      } else {
        $("#winner").text("Draw game!");
      }

      game.timer = 0;
      $("#finish_score").text("Score: " + game.score);
    };

    this.score = 0;
    this.timer = 180000;
    //this.timer = 800;
    this.startTimer();
    this.player_pack = [];
    this.player_pack[0] = new createPack("player1_cards");
    this.player_pack[1] = new createPack("player2_cards");
    this.current_player = 0;

    // method to random deal a pack of cards into two piles
    this.deal_pack = function(pack) {
      // shuffle the input pack
      pack.shuffle();
      // empty the cards from each pack
      this.player_pack[0].cards.length = 0;
      this.player_pack[1].cards.length = 0;

      var num_cards = pack.cards.length;
      var num_each = Math.ceil(num_cards / 2);

      // add first half of the cards to the first player and the second half of the cards to the second player
      this.player_pack[0].cards = pack.cards.slice(0, num_each); //slice the pack starting with 0 and ending with num_each
      this.player_pack[1].cards = pack.cards.slice(num_each); //slice the pack from num_each to end

      // set the current player to be the first player
      this.current_player = 0;
    };
    // method gives top cards to the winning player
    this.win = function(win_player) {
      var lose_player = 1 - win_player;
      var lost_card = this.player_pack[lose_player].cards[0];

      this.player_pack[win_player].top_to_bottom(); // winning player's top card goes to the bottom
      this.player_pack[win_player].cards.push(lost_card); // add losing card to that of the winning player
      this.player_pack[lose_player].cards.splice(0, 1); // delete the losing card from the losing player

      if (this.player_pack[lose_player].cards.length === 0) {
        game.finishGame();
      }

      if (win_player == 0) {
        this.score += 30;
      } else if (win_player == 1) {
        this.score -= 30;
      }

      $("#score").text("Score: " + this.score);

      //this.current_player = win_player; // change the current_player to be the winning player
    };
    // method shows the current state of the game
    this.show_game = function() {
      // find the elements for the cards
      var $card_areas = $(".card_style");

      // Add the class "selected" to current player"s and flipped to the non-player's card.
      $card_areas.removeClass("selected flipped"); //remove classes from both cards first
      $card_areas.eq(this.current_player).addClass("selected");
      $card_areas.eq(1 - this.current_player).addClass("flipped");

      // loop through the player packs
      for (var player = 0; player < this.player_pack.length; player++) {
        var $player_card_area = $card_areas.eq(player); // DOM element for this player"s cards

        if (this.player_pack[player].cards.length > 0) {
          var top_card = this.player_pack[player].cards[0]; //top card of this player"s deck
          var i = 0; // index number
          var $data_area = $player_card_area.find("td.data");

          // Assign the relevant details of the cards to their place on the DOM
          $player_card_area.find(".card_name").text(top_card.name); // name of card
          $player_card_area.find("img.card_picture").attr("src", top_card.img); // attribute the image source
          $player_card_area.find("#description-text").text(top_card.description)
          $player_card_area
            .find(".num_cards")
            .text(this.player_pack[player].cards.length); // nuber of cards in this player pback
          //loop through each of the data area elements
          $data_area.each(function() {
            $(this).text(top_card.data[i]);
            i++;
          });

          $player_card_area.css("visibility", "visible"); // if the player has cards make the cards visible
        } else {
          $player_card_area.css("visibility", "hidden"); // if the player has no cards hide the cards
        }
      }
    };
    // method compares two data values for a particular index and returns the winning player
    this.compare_data = function(i) {
      var win_player;
      if (
        this.player_pack[0].cards[0].data[i] >
        this.player_pack[1].cards[0].data[i]
      ) {
        win_player = 0; // First player wins
      } else {
        win_player = 1; // Second player wins
      }
      return win_player;
    };
    // method for the transition animation putting cards to the bottom of the winning hand
    this.transition_animation = function() {
      var shift_direction = "200px";
      if (this.current_player === 0) {
        shift_direction = "-200px";
      }
      var $winner_card = $(".card_style").eq(this.current_player);
      var $loser_card = $(".card_style").eq(1 - this.current_player);

      var pos_winner = $winner_card.position();
      var pos_loser = $loser_card.position();
      var left_shift = pos_winner.left - pos_loser.left;

      // adds the CSS class "flipped" which causes the cards to transition to their flipped side.
      $(".card_style").addClass("flipped");

      $(".front, .back")
        .animate({ left: shift_direction }, "slow") // moves
        .animate({ zIndex: "-5" }, "fast")
        .animate({ left: "0px" }, "fast")
        .animate({ zIndex: "2" }, "fast", function() {
          $(".front, .back").clearQueue(); // clear any queued animations
          $("tr").removeClass("winner loser");
          game.show_game();
        });
    };
    // method for the animation comparing the two cards
    this.compare_animation = function(i) {
      var winner = this.current_player;
      var loser = 1 - this.current_player;
      var $winner_card = $(".card_style").eq(winner);
      var $loser_card = $(".card_style").eq(loser);
      $winner_card
        .find("tr")
        .eq(i)
        .addClass("winner");
      $loser_card
        .find("tr")
        .eq(i)
        .addClass("loser");
      $(".card_style").removeClass("flipped selected");
      $winner_card.addClass("selected");
      $(".front").one("transitionend", function() {
        game.transition_animation();
      });
    };
  }

  // Create a new pack
  var FullPack = new createPack("Programming Languages");
  var game = new createGame();

  var pyDesc = "Interpred high-level programming language. Python's design philosophy emphasizes code readability with its notable use of significant whitespace.";
  var reactDesc = "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.";
  var perlDesc = "Perl is a family of two high-level, general-purpose, interpreted, dynamic programming languages.";
  var plsqlDesc = "PL/SQL is Oracle Corporation's procedural extension for SQL and the Oracle relational database. ";
  var htmlDesc = "HTML is the standard markup language for documents designed to be displayed in a web browser.";
  var nodeDesc = "Node js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser.";
  var reduxDesc = "Redux is an open-source JavaScript library for managing application state. It is most commonly used with libraries such as React to build UI";
  var cDesc = "C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion";
  var cplusDesc = "C ++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or 'C with Classes'.";
  var sparkDesc = "Apache Spark is an open-source distributed general-purpose cluster-computing framework";
  var cssDesc = "Style sheet language used for describing the presentation of a document written in a markup language like HTML";
  var awsDesc = "AWS provides on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered pay-as-you-go basis"; 
  var vbDesc = "Visual Basic is a third-generation event-driven programming language from Microsoft for its Component Object Model (COM) programming";
  var jsDesc = "High-level, just-in-time compiled, multi-paradigm programming language that conforms to the ECMAScript specification.";
  var groovyDesc = "Apache Groovy is a Java-syntax-compatible object-oriented. It can be used as both a programming and a scripting language.";
  var springDesc = "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can 'just run'.";
  var junitDesc = "JUnit is a unit testing framework for the Java programming language. Has been important in the development of test-driven development.";
  var javaDesc = "Java is a programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible.";

  // Add cards to the pack
  FullPack.add_new_card("Python", "./assets/python.png", [9, 352, 3, 2], pyDesc);
  FullPack.add_new_card("React", "./assets/react.png", [5, 45, 4, 2], reactDesc);
  FullPack.add_new_card("Perl", "./assets/perl.png", [4, 7, 3, 1], perlDesc);
  FullPack.add_new_card("PL/SQL", "./assets/plsql.png", [4, 38, 4, 1]), plsqlDesc;
  FullPack.add_new_card("HTML5", "./assets/html5.png", [3, 19, 3, 1], htmlDesc);
  FullPack.add_new_card("Node Js", "./assets/nodejs.png", [3, 16, 3, 2], nodeDesc);
  FullPack.add_new_card("Redux", "./assets/redux.png", [2, 8, 4, 2], reduxDesc);
  FullPack.add_new_card("C", "./assets/c.png", [2, 18, 4, 1], cDesc);
  FullPack.add_new_card("C++", "./assets/cplus.png", [2, 20, 1, 1], cplusDesc);
  FullPack.add_new_card("Spark", "./assets/spark.png", [2,2,4,2]  , sparkDesc);
  FullPack.add_new_card("CSS3", "./assets/css3.png", [1,12,4,1]  , cssDesc);
  FullPack.add_new_card("AWS", "./assets/aws.png", [1,14,3,1] , awsDesc);
  FullPack.add_new_card("VB", "./assets/vb.png", [1,6,4,2] , vbDesc);
  FullPack.add_new_card("Javascript", "./assets/javascript.png", [1,29,3,1] , jsDesc);
  FullPack.add_new_card("Groovy", "./assets/groovy.png", [6,24,2,1] , groovyDesc);
  FullPack.add_new_card("Spring Boot", "./assets/springboot.png", [6,68,4,2] , springDesc);
  FullPack.add_new_card("JUnit", "./assets/junit.png", [9,17,2,1]  , junitDesc);
  FullPack.add_new_card("Java", "./assets/java.png", [12, 104, 4, 2], javaDesc);




  // Shuffle and deal the cards to two players
  game.deal_pack(FullPack);
  // Show the game - display the top cards in the DOM
  game.show_game();

  // Callback function for the "next" button
  // Moves the top card to the bottow and shows the new top card.
  $("#button_next").on("click", function() {
    game.player_pack[0].top_to_bottom();
    game.player_pack[1].top_to_bottom();
    game.show_game();
  });

  // Callback function for the "shuffle" button
  // Shuffles (randomly permutes) the order of the card.
  $("#button_shuffle").on("click", function() {
    game.score = 0;
    $("#score").text("Score: " + game.score);
    game.deal_pack(FullPack);
    game.show_game();
    $(".gameover").css("visibility", "hidden");
  });

  // Triggers the event that the clicked player wins.
  $(".button_win").on("click", function() {
    var player = $(this).data("player"); // determine the player
    game.win(player);
    game.compare_animation(player);
    game.transition_animation(2);
  });

  // Callback for selecting a answer
  $(".card_style").on("click", "tr", function() {
    if ($(this).parents(".selected").length === 0) {
      return;
    } // KLUDGE quit the function if the ancestor card was not selected
    var win_player = game.compare_data($(this).index());
    game.win(win_player);
    game.compare_animation($(this).index());
    //  game.transition_animation();
    //  game.show_game();
  });

  // Callback for transition
  $(".button_transition").on("click", function() {
    game.compare_animation(2);
  });

  /* var colors = new Array(
    [24, 76, 90],
    [247, 114, 65],
    [238, 21, 126],
    [241, 55, 104],
    [252, 179, 22]
  );

  var step = 0;
  //color table indices for:
  // current color left
  // next color left
  // current color right
  // next color right
  var colorIndices = [0, 1, 2, 3];

  //transition speed
  var gradientSpeed = 0.002;

  function updateGradient() {
    if ($ === undefined) return;

    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];

    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

    $("#gradient")
      .css({
        background:
          "-webkit-gradient(linear, left top, right top, from(" +
          color1 +
          "), to(" +
          color2 +
          "))"
      })
      .css({
        background:
          "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
      });

    step += gradientSpeed;
    if (step >= 1) {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];

      //pick two new target color indices
      //do not pick the same as the current one
      colorIndices[1] =
        (colorIndices[1] +
          Math.floor(1 + Math.random() * (colors.length - 1))) %
        colors.length;
      colorIndices[3] =
        (colorIndices[3] +
          Math.floor(1 + Math.random() * (colors.length - 1))) %
        colors.length;
    }
  }

  setInterval(updateGradient, 10); */
};
