function setupRandomMatchClick() {
	$(".random-match").click(function() {
		// this prevents multiple consequent clicks from raising an
		// exception because of multiple calls to initializeWSClient()
		// TODO: in the future, fade out the whole page and show a
		// loading animation instead.
		$(".random-match").off("click");

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
		setupRandomMatchClick();
	});
}

setupRandomMatchClick();
$("#random-matches-reload").click(function() {
	event.preventDefault();
	if(event.button === 0)
		updateGameView();
});
