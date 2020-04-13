var contextMenuItem = {
    "id": "getRatings",
    "title": "GetRatings",
    "documentUrlPatterns": ["https://www.netflix.com/*"],
    "contexts": ["selection", "image", "video"]
};

chrome.contextMenus.create(contextMenuItem);


var apiKey = "";
chrome.storage.sync.get("apiKey", function (result) {
    apiKey = result.apiKey;
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl", function(response) {
        var movieTitle = null;
        if (response) {
          movieTitle = response.value;
        }
        $.get("http://www.omdbapi.com/?t=" + movieTitle + "&apikey=" + apiKey, function (data, status) {

            notifMessage = "";
            notifTitle = "";

            if (data["Response"] == "True") {
                currentInfo = {};
                currentInfo["Title"] = data["Title"];
                currentInfo["Year"] = data["Year"];

                ratings = data["Ratings"];
                for (var i = 0; i < ratings.length; i++) {
                    if (ratings[i]["Source"] == "Internet Movie Database") {
                        currentInfo["imdb"] = ratings[i]["Value"];
                        notifMessage += "Imdb: " + currentInfo["imdb"] + "\n";
                    } else if (ratings[i]["Source"] == "Rotten Tomatoes") {
                        currentInfo["rt"] = ratings[i]["Value"];
                        notifMessage += "Rotten Tomatoes: " + currentInfo["rt"] + "\n";
                    } else if (ratings[i]["Source"] == "Metacritic") {
                        currentInfo["metacritic"] = ratings[i]["Value"];
                    }
                }

                notifTitle = currentInfo["Title"] + " (" + currentInfo["Year"] + ")";
            } else {
                notifTitle= "No such title found";
                notifMessage = "Could not find ratings for the selected title";
            }

            var notifOptions = {
                type: "basic",
                iconUrl: "icon48.png",
                title: notifTitle,
                message: notifMessage
            };
            chrome.notifications.create(notifOptions);
        });
    });
});
