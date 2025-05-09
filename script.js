
  // Global function to restart the game
  function restartGame() {
    localStorage.removeItem('easyLevelCompleted');
    localStorage.removeItem('mediumLevelCompleted');
    localStorage.removeItem('hardLevelCompleted');
    window.location.href = 'easy-level.html';
  }

  // Typed.js & AOS setup
  document.addEventListener("DOMContentLoaded", function () {
    const typedElement = document.querySelector("#typedText");

    if (typedElement) {
      new Typed("#typedText", {
        strings: ["Welcome to BlockyCode!", "Solve, Code, Win!"],
        typeSpeed: 50,
        backSpeed: 25,
        loop: true,
      });
    }

    AOS.init();
  });

  // Main jQuery Logic
  $(document).ready(function () {
    // Unlock levels based on localStorage
    const levelCards = document.querySelectorAll(".levels-card");
    if (levelCards.length >= 3) {
      if (localStorage.getItem("easyLevelCompleted") === "true") {
        const mediumBtn = levelCards[1].querySelector("button");
        const mediumTxt = levelCards[1].querySelector(".locked-text");
        levelCards[1].classList.remove("locked");
        mediumBtn.disabled = false;
        mediumBtn.innerHTML = "START";
        mediumBtn.className = "btn-glow";
        mediumBtn.onclick = () => window.location.href = "levels/medium-level.html";
        if (mediumTxt) mediumTxt.style.display = "none";
      }

      if (localStorage.getItem("mediumLevelCompleted") === "true") {
        const hardBtn = levelCards[2].querySelector("button");
        const hardTxt = levelCards[2].querySelector(".locked-text");
        levelCards[2].classList.remove("locked");
        hardBtn.disabled = false;
        hardBtn.innerHTML = "START";
        hardBtn.className = "btn-glow";
        hardBtn.onclick = () => window.location.href = "levels/hard-level.html";
        if (hardTxt) hardTxt.style.display = "none";
      }
    }

    // Dialog: Try Again
    $("#tryAgainDialog").dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        "OK": function () {
          $(this).dialog("close");
        }
      },
      open: function () {
        $(this).parent().find(".ui-dialog-titlebar-close").hide();
      }
    });

    // Dialog: Level Complete
    $("#levelCompleteDialog").dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        "Next Level": function () {
          $(this).dialog("close");
          $("#next-btn")[0].click();
        },
        Cancel: function () {
          $(this).dialog("close");
        }
      }
    });

    // Stars rating - congrats page
    const stars = document.querySelectorAll(".stars");
    stars.forEach((star, index) => {
      star.style.color = "gray";
      star.addEventListener("mouseover", () => {
        stars.forEach((s, i) => {
          s.style.color = i <= index ? "gold" : "gray";
        });
      });
      star.addEventListener("click", () => {
        stars.forEach((s, i) => {
          s.style.color = i <= index ? "gold" : "gray";
        });
        alert(`Thanks for rating us ${index + 1} stars!`);
      });
    });

    // Drag & Drop
    $(".code-draggable").draggable({ helper: "clone" });
    $(".drop-slot").droppable({
      accept: ".code-draggable",
      drop: function (event, ui) {
        $(this).html(ui.draggable.clone().addClass("dropped"));
      },
    });

    // Level Checking
    $("#check-btn").click(function () {
      const dropped = $(".drop-slot .dropped");
      const slot1 = $(".drop-slot[data-slot='1'] .dropped").data("code");
      const slot2 = $(".drop-slot[data-slot='2'] .dropped").data("code");
      const slot3 = $(".drop-slot[data-slot='3'] .dropped").data("code");
      const slot4 = $(".drop-slot[data-slot='4'] .dropped").data("code");

      if (
        dropped.length === 2 &&
        slot1 === "let name = 'John';" &&
        slot2 === "console.log(name);"
      ) {
        $("#levelCompleteDialog").dialog("open");
        localStorage.setItem("easyLevelCompleted", "true");
        return;
      }

      if (
        dropped.length === 3 &&
        slot1 === "let num = 10;" &&
        slot2 === "if(num > 0) {"&&
        slot3 === "console.log('Positive');}" 
      ) {
        $("#levelCompleteDialog").dialog("open");
        localStorage.setItem("mediumLevelCompleted", "true");
        return;
      }

      if (
        dropped.length === 4 &&
        slot1 === "let arr = ['a', 'b', 'c'];" &&
        slot2 === "for(let i = 0; i < arr.length; i++) {" &&
        slot3 === "console.log(arr[i]);" &&
        slot4 === "}"
      ) {
        localStorage.setItem("hardLevelCompleted", "true");
        $("#levelCompleteDialog").dialog("option", "buttons", {
          "See Results": function () {
            $(this).dialog("close");
            $("#finish-btn")[0].click();
          },
          Cancel: function () {
            $(this).dialog("close");
          }
        });
        $("#levelCompleteDialog").dialog("open");
        return;
      }

      // Incorrect case
      $(".drop-slot").empty();
      $("#tryAgainDialog").dialog("open");
    });

    // Accordion - FAQ section - help page
    if ($("#accordion").length) {
      $("#accordion").accordion({
        collapsible: true,
        animate: 200,
        heightStyle: "content",
        icons: {
          header: "ui-icon-circle-arrow-e",
          activeHeader: "ui-icon-circle-arrow-s"
        }
      });
    }

    // Tabs - tutorial page
    if ($("#tabs").length) {
      $("#tabs").tabs();
    }

    // Contact form
    $(function () {
      $("#contact-form").on("submit", function (e) {
        let hasError = false;
    
        $(this).find("input, textarea").each(function () {
          const $field = $(this);
          const $error = $field.siblings(".error-message");
    
          if ($error.length) $error.remove();
    
          if (!this.checkValidity()) {
            $field.addClass("invalid");
            $field.after(`<div class="error-message">${this.validationMessage}</div>`);
            hasError = true;
          } else {
            $field.removeClass("invalid");
          }
        });
    
        if (hasError) {
          e.preventDefault();
        } else {
          alert("✅ Message sent successfully!");
        }
      });
    });
    

  });
  //about us slider
  $(document).ready(function () {
    $('.about-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      infinite: false

    });

  });
  //Ajax hint button
  $(document).ready(function () {
    $("#show-hint-btn").on("click", function () {
      const level = $("body").data("level"); // Get current level from body tag

      $("#hint-box").text("Loading hint...");

      $.getJSON("../hints.json", function (data) {
        const hint = data[level];
        $("#hint-box").html("<strong>💡 Hint:</strong> " + hint);
      }).fail(function () {
        $("#hint-box").html("⚠ Failed to load hint.");
      });
    });
  });
  //Ajax external quote
  $(document).ready(function () {
      $("#loadQuote").click(function () {
          var url = "https://quotes-api-self.vercel.app/quote";
          
          $.ajax({
              url: url,
              method: 'GET',
              success: function (data) {
                  var html = "";
                  html += "<p>\"" + data.quote + "\"</p>";
                  html += "<p><em>- " + data.author + "</em></p>";
                  $("#quoteResult").html(html);
              },
              error: function () {
                  $("#quoteResult").html("<p>Could not fetch a quote at this time.</p>");
              }
          });
      });
  });
