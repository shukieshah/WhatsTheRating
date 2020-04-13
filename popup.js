var apiKey = "";
$(function () {
    $(".modal-icons").hide();
    chrome.storage.sync.get("apiKey", function (result) {
        $.post("http://www.omdbapi.com/?t=blah&apikey=" + result.apiKey, function (data, status) {
            apiKey = result.apiKey;
        }).fail( function() {
            $("#input").hide();
            $("#link").text("Get Started");
        })
    });
});

$(document).ready(function(){
   $('#message').on('click', 'a', function(){
     chrome.tabs.create({url: 'quickstart.html'});
     return false;
   });
});


$(document).on("keypress", "#input", function (e) {
    if (e.which == 13) {
        $(".modal-icons").show();
        $("#imdb").text("N/A");
        $("#rt").text("N/A");
        $("#metacritic").text("N/A");
        $.get("http://www.omdbapi.com/?t=" + $("#input").val() + "&apikey=" + apiKey, function (data, status) {
            if (data["Response"] == "True") {

                $("#input").val("");
                $("#title").text(data["Title"] + " (" + data["Year"] + ")");
                $("#plot").text(data["Plot"]);

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

                $("#title").text("No such title found");
                $("#plot").text("The title does not exist within the online movie database.");
                $("#imdb").text("N/A");
                $("#rt").text("N/A");
                $("#metacritic").text("N/A");
            }
        });
    }
});
