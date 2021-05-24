module.exports = function (user) {
	var random = Math.random() * 3;

    var computerActive = "";

    if (random < 1) {
        computerActive = "rock"
    } else if (random > 2) {
        computerActive = "cloth"
    } else {
        computerActive = "scissor"
    }

    if (user == computerActive) {
        return 0;
    } else if (
        (computerActive == "rock" && user == "cloth") ||
        (computerActive == "cloth" && user == "scissor") ||
        (computerActive == "scissor" && user == "rock")
    ) {
        return +1;
    } else {
        return -1;
    }
}