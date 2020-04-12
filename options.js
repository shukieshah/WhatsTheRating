$(document).on("click", "#saveKey", function(e) {
    $.post("http://www.omdbapi.com/?t=blah&apikey=" + $("#key").val(), function (data, status) {
        chrome.storage.sync.set({'apiKey': $("#key").val()}, function() {
            alert("Success! You're all set.");
            close();
        });
    }).fail( function() { 
        $("#key").val("");
        $("#message").text("You have entered an invalid key.");
    })
});