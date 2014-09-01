function setupRandomMatchClick() {
	$(".random-match").click(function() {
		initializeWSClient();
		var matchID = $(this).find("input").val();
		wsClient.conn.onopen = function() {
			Module.wsClient.joinGame(matchID);
		};
	});
}

function updateGameView() {
	$.get("/random-matches", function(reply) {
		$(".random-matches-wrap").html(reply);
	});
	setupRandomMatchClick();
}

setupRandomMatchClick();
$("#random-matches-reload").click(function() {
	event.preventDefault();
	if(event.button === 0)
		updateGameView();
});
