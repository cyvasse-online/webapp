function setupCreateMatchHandlers()
{
	$('#create-match-submit-private').click(function() {
		// is it okay security-wise to use window.location.hostname just like that?
		var conn = new WebSocket('ws://' + window.location.hostname + ':2516/');
		conn.onopen = function() {
			var createGameRequest = {
			  "action": "create game",
			  "param": {
				"ruleSet": "mikelepage"
			  }
			};
			conn.send(JSON.stringify(createGameRequest));
		};
		//conn.onclose ?
		conn.onmessage = function(msg) {
			var response = JSON.parse(msg.data);
			if(response.success === true) {
				window.location.pathname = '/match/' + response.b64ID;
			}
			// else
		};
	});
} // setupCreateMatchHandlers
