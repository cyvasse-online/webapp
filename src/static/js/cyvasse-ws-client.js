function loadCyvasseJs() {
	$.getScript("/cyvasse.js");
}

function CyvasseWSClient(websockConn, loadNewPage) {
	if(websockConn instanceof WebSocket === false)
		throw new TypeError("websockConn has to be a WebSocket instance");
	if(typeof(loadNewPage) !== "function")
		throw new TypeError("loadNewPage has to be a function");

	this.conn = websockConn;
	this.loadNewPage = loadNewPage;
	this.nextMessageID = 1;
	this.awaitingReply = [];
	this.cachedIngameRequests = [];

	var self = this;

	this.conn.onmessage = function(msg) {
		if(self.debug === true) {
			console.log("[onmessage]");
			console.log(msg.data);
		}
		self.handleMessage(msg.data);
	};

	this.conn.onclose = function() {
		if(!Module.logbox)
			console.log("The connection to the server was closed.");
		else
			Module.logbox.addStatusMessage("The connection to the server was closed.");
	};
}

CyvasseWSClient.prototype = {
	handleMessage: function(msgData) {
		var msgObj = JSON.parse(msgData);

		if(msgObj.messageType === "request") {
			if(msgObj.action !== "chat message")
				throw new Error("Got a request from the server that's not a chat message");
			if(!msgObj.param)
				throw new Error("Got a chat message without parameters");
			if(!msgObj.param.sender)
				throw new Error("Got a chat message without sender");
			if(!msgObj.param.message)
				throw new Error("Got a chat message with sender but without message content");
			if(!Module.logbox)
				throw new Error("Can't access the log box");

			Module.logbox.addChatMessage(msgObj.param.sender, msgObj.param.message);

			// TODO: reply
		}
		else if(msgObj.messageType === "reply") {
			var answeredRequest;

			for(var request in this.awaitingReply) {
				if(this.awaitingReply[request].messageID == msgObj.messageID) {
					// remove the request from this.awaitingReply
					// and save it to answeredRequests
					answeredRequest = this.awaitingReply.splice(request, 1)[0];
				}
			}
			if(answeredRequest === undefined)
				throw new Error("Got a reply to an unknown server request");
			if(msgObj.success === false)
				throw new Error("Got an error message from the server: " + msgObj.error + "\n" +
					"as response to:\n\n" + JSON.stringify(answeredRequest));

			switch(answeredRequest.action) {
				case "create game":
					Module.gameMetaData.matchID  = msgObj.data.matchID;
					Module.gameMetaData.playerID = msgObj.data.playerID;
					this.loadNewPage("/match/" + msgObj.data.matchID, function() {
						loadCyvasseJs();
					});
					break;
				case "join game":
					Module.gameMetaData.color    = msgObj.data.color;
					Module.gameMetaData.playerID = msgObj.data.playerID;
					Module.gameMetaData.ruleSet  = msgObj.data.ruleSet;

					if(document.location.pathname.substr(0, 7) == "/match/")
						loadCyvasseJs();
					else
						this.loadNewPage("/match/" + Module.gameMetaData.matchID, function() {
							loadCyvasseJs();
						});

					if(this.afterJoinGame !== undefined)
						this.afterJoinGame();

					break;
				case "chat message":
					// TODO: Add "message successfully sent" tick somewhere
					break;
			}
		}
		else if(msgObj.messageType === "game update") {
			if(this.handleMessageIngame === undefined) {
				console.log("Got a message for the game before it was loaded, caching.");
				this.cachedIngameRequests.push(msgData);
			}
			else {
				if(typeof(this.handleMessageIngame) !== "function")
					throw new TypeError("handleMessageIngame has to be a function");

				this.handleMessageIngame(msgData);
			}

			if(!Module.logbox)
				throw new Error("logbox not initialized?!");

			var sender;
			if(playersColorToSenderEnum(Module.gameMetaData.color) == SenderEnum.PLAYER_WHITE)
				sender = SenderEnum.PLAYER_BLACK;
			else
				sender = SenderEnum.PLAYER_WHITE;

			Module.logbox.addGameMessage(sender, msgObj);
		}
		else {
			throw new Error("Got malformed or incomplete message");
		}
	},

	send: function(msgObj) {
		var msgData = msgObj;
		if(typeof msgObj === "object") {
			msgData = JSON.stringify(msgObj);
		}

		if(this.debug === true) {
			console.log("[send]");
			console.log(msgData);
		}
		this.conn.send(msgData);
	},

	sendRequest: function(msgObj) {
		msgObj.messageType = "request";
		msgObj.messageID = this.nextMessageID++;

		this.send(msgObj);
		this.awaitingReply.push(msgObj);
	},

	sendReply: function(request, msgObj) {
		msgObj.messageType = "reply";
		msgObj.messageID = request.messageID;

		this.send(msgObj);
	},

	createGame: function(metaData) {
		Module.gameMetaData = metaData;

		this.sendRequest({
			"action": "create game",
			"param": metaData
		});
	},

	joinGame: function(matchID, success) {
		Module.gameMetaData.matchID = matchID;

		this.sendRequest({
			"action": "join game",
			"param": {
				"matchID": matchID
			}
		});

		if(typeof(success) === "function")
			this.afterJoinGame = success;
	},

	sendChatMsg: function(sender, message) {
		this.sendRequest({
			"action": "chat message",
			"param": {
				"sender": sender,
				"message": message
			}
		});
	}
};
