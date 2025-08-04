$(document).ready(function () {
  checkApiStatus();

  $('#submit').click(handleClick);

  function handleClick() {
    let salary = parseInt($('#salary').val()) || 30000; // default fallback
    let days = parseInt($('#days').val());

    let url = "/api/Price?salary=" + salary + "&days=" + days;

    $.ajax({
      url: url,
      success: function (finalPrice) {
        const rounded = roundPrice(parseInt(finalPrice));
        $("#finalPrice").html("£" + rounded);
      }
    });

    return false;
  }

  function checkApiStatus() {
    $.ajax({
      url: "/api",
      success: function (response) {
        if (response.trim() === "Yes we have an API now") {
          $("#apiStatus").css("background-color", "green");
        } else {
          $("#apiStatus").css("background-color", "red");
        }
      },
      error: function () {
        $("#apiStatus").css("background-color", "red");
      }
    });
  }

  function roundPrice(price, nearest = 50) {
    return Math.round((price + nearest / 2) / nearest) * nearest;
  }
});
