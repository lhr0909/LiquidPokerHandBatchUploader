var splitHands = function(handContent) {
    lines = handContent.split("\n");
    var hands = [];
    var hand = [];
    var handOn = true;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 0) {
            if (!handOn) {
                handOn = true;
                hand = [];
            }
            hand.push(lines[i]);
            if (i >= lines.length - 1) {
                hands.push(hand);
            }
        } else {
            if (handOn) {
                hands.push(hand);
                handOn = false;
            }
        }
    }
    return hands;
};

var batchUploadHands = function(handContent) {
    var hands = splitHands(handContent);
    // have user confirm batch upload action
    var confirmBatchUpload = confirm("You are about to upload " + hands.length
        + " hands.\nIt is going to take " + hands.length + " seconds then the page will refresh."
        + "\nPress OK to continue if you want to upload now");
    if (!confirmBatchUpload) {
        return;
    }
    // fire ajax calls to submit hands one by one
    var ajax = new XMLHttpRequest();
    for (var i = 0; i < hands.length; i++) {
        setTimeout(function(hand){
            ajax.open("POST", "/mytlnet/myhand.php", true);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.send("action=submithand&handcontent=" + encodeURIComponent(hand.join("\n")));
        }, i * 1000 + 500, hands[i]);
    }
    setTimeout(function(){ location.reload(); }, hands.length * 1000 + 500);
};

var allButtons = document.getElementsByClassName("btn");
// find the submit hand button
for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i].getAttribute("value") === "Submit hand") {
        // override submit hand button action
        allButtons[i].onclick = function(event) {
            var handPostTextarea = document.getElementsByTagName("textarea");
            for (var j = 0; j < handPostTextarea.length; j++) {
                if (handPostTextarea[i].getAttribute("name") === "handcontent") {
                    batchUploadHands(handPostTextarea[i].value);
                    break;
                }
            }
            event.preventDefault();
        }
        break;
    }
}