var CyvasseWS_Protocol_Version = "1.0";

function loadGame(matchID) {
	if (!loadGame.alreadyLoaded) {
		loadGame.alreadyLoaded = true;

		// global function from cyvasse-webapp.js
		// is there a good way to remove this kind of dependency in JS?
		if(document.location.pathname.substr(0, 7) == "/match/") {
			$.getScript("/cyvasse.js");
		}
		else {
			loadPage("/match/" + matchID, function() {
				$.getScript("/cyvasse.js");
			});
		}
	}
	else
	{
		console.error("Tried to load cyvasse.js twice");
	}
}

// I don't want to repeat this all over again, but saving "console.log"
// like any other function object doesn't seem to work
function log(text) { console.log(text); }

function CyvasseWSClient(websockAddr, onopen) {
	this.websock = new WebSocket(websockAddr);
	this.nextMessageID = 1;
	this.awaitingReply = [];
	this.cachedIngameRequests = [];

	var self = this;

	if(typeof onopen === "function")
		this.websock.onopen = onopen;

	this.websock.onmessage = function(msg) {
		if(self.debug === true) {
			console.log("[onmessage]");
			console.log(msg.data);
		}
		self.handleMessage(msg.data);
	};

	this.websock.onerror = function() {
		Module.setStatus("WebSocket communication error, see JavaScript console");
		Module.setStatus = log;
	};

	this.websock.onclose = function() {
		Module.setStatus("The connection to the server was closed.");
		Module.setStatus = log;
	};
}

CyvasseWSClient.prototype = {
	handleMessage: function(msgStr) {
		var msgObj = JSON.parse(msgStr);

		if(msgObj.msgType === "chatMsg") {
			Module.logbox.addChatMessage(msgObj.msgData);

			// TODO: reply
		}
		else if(msgObj.msgType === "chatMsgAck") {

		}
		else if(msgObj.msgType === "gameMsg") {
			if(this.handleMessageIngame === undefined) {
				console.log("Got a message for the game before it was loaded, caching.");
				this.cachedIngameRequests.push(msgData);
			}
			else {
					this.handleMessageIngame(msgData);
			}

			var sender;
			if(playersColorToSenderEnum(Module.gameMetaData.color) == SenderEnum.PLAYER_WHITE)
				sender = SenderEnum.PLAYER_BLACK;
			else
				sender = SenderEnum.PLAYER_WHITE;

			Module.logbox.addGameMessage(sender, msgObj);
		}
		else if(msgObj.msgType === "gameMsgAck") {

		}
		else if(msgObj.msgType === "gameMsgErr") {

		}
		else if(msgObj.msgType === "notification") {

		}
		else if(msgObj.msgType === "serverReply") {
			var answeredRequest;

			for(var request in this.awaitingReply) {
				if(this.awaitingReply[request].messageID == msgObj.messageID) {
					// remove the request from this.awaitingReply
					// and save it to answeredRequests
					answeredRequest = this.awaitingReply.splice(request, 1)[0];
				}
			}

			if(answeredRequest === undefined)
				throw new Error("Got a reply to an unknown server request: " + JSON.stringify(msgObj));
			if(msgObj.success === false)
				throw new Error("Got an error message from the server: " + msgObj.error + "\n" +
					"as response to:\n\n" + JSON.stringify(answeredRequest));

			switch(answeredRequest.action) {
				case "create game":
					Module.gameMetaData.matchID  = msgObj.data.matchID;
					Module.gameMetaData.playerID = msgObj.data.playerID;
					loadGame(msgObj.data.matchID);
					break;
				case "join game":
					Module.gameMetaData.color    = msgObj.data.color;
					Module.gameMetaData.playerID = msgObj.data.playerID;
					Module.gameMetaData.ruleSet  = msgObj.data.ruleSet;

					if(document.location.pathname.substr(0, 7) == "/match/")
						Module.gameMetaData.matchID = getMatchID(document.location.pathname);

					loadGame(Module.gameMetaData.matchID);

					if(this.afterJoinGame !== undefined)
						this.afterJoinGame();

					break;
				case "chat message":
					// TODO: Add "message successfully sent" tick somewhere
					break;
			}
		}
		else if(msgObj.msgType === "serverRequest") {
			// Do nothing, just assume this doesn't happen
		}
		else {
			// Ignore the message
			// TODO: Or maybe log an error somewhere?
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
		this.websock.send(msgData);
	},

	sendRequest: function(requestData) {
		var msgObj = {
			"msgType": "serverRequest",
			"msgID": this.nextMessageID++,
			"requestData": requestData
		};

		this.send(msgObj);
		this.awaitingReply.push(msgObj);
	},

	initComm: function() {
		sendRequest({
			"action": "initComm",
			"param": {
				"protocolVersion": CyvasseWS_Protocol_Version
			}
		});
	},

	createGame: function(metaData) {
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
