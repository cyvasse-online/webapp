function setupCreateMatchHandlers()
{
	$("#create-match-submit-private").click(function() {
		ruleSet = $("#create-match-rule-set").val();
		color   = $("input:radio[name=color]:checked").val();
		if(ruleSet == null || color == null)
			return;

		// is it okay security-wise to use window.location.hostname here?
		var conn = new WebSocket("ws://" + window.location.hostname + ":2516/");
		conn.onopen = function() {
			var createGameRequest = {
			  "action": "create game",
			  "param": {
				"ruleSet": ruleSet,
				"color": color
			  }
			};
			conn.send(JSON.stringify(createGameRequest));
		};
		//conn.onclose ?
		conn.onmessage = function(msg) {
			var response = JSON.parse(msg.data);
			if(response.success === true) {
				conn.close();
				window.location.pathname = "/match/" + response.matchID;
			}
			// else
		};
	});
} // setupCreateMatchHandlers
