var apiKey = "";
$(function () {
    chrome.storage.sync.get("apiKey", function (result) {
        $.post("http://www.omdbapi.com/?t=blah&apikey=" + result.apiKey, function (data, status) {
            apiKey = result.apiKey;
        }).fail( function() {
            $("#input").hide();
            $("#greeting").text("Welcome to What's the Rating?");
            $("#message").text("To get started, right click on the extension icon and navigate to the options menu");
        })
    });
});


$(document).on("keypress", "#input", function (e) {
    if (e.which == 13) {
        $("#imdb").text("N/A");
        $("#rt").text("N/A");
        $("#metacritic").text("N/A");
        $.get("http://www.omdbapi.com/?t=" + $("#input").val() + "&apikey=" + apiKey, function (data, status) {
            if (data["Response"] == "True") {

                $("#input").val("");
                $("#title").text(data["Title"] + " (" + data["Year"] + ")");

                ratings = data["Ratings"];
                for (var i = 0; i < ratings.length; i++) {
                    if (ratings[i]["Source"] == "Internet Movie Database") {
                        $("#imdb").text(ratings[i]["Value"]);
                    } else if (ratings[i]["Source"] == "Rotten Tomatoes") {
                        $("#rt").text(ratings[i]["Value"]);
                    } else if (ratings[i]["Source"] == "Metacritic") {
                        $("#metacritic").text(ratings[i]["Value"]);
                    }
                }
            } else {
                $("#title").text("No such movie found");
                $("#imdb").text("N/A");
                $("#rt").text("N/A");
                $("#metacritic").text("N/A");
            }
        });
    }
});
