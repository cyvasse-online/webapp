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

	//this.debug = true;

	var self = this;

	this.websock.onopen = function() {
		self.initComm(onopen);
	};

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
			var replyData = msgObj.replyData;
			var answeredRequestData;

			for(var reqDataIdx in this.awaitingReply) {
				if(this.awaitingReply[reqDataIdx].messageID == msgObj.messageID) {
					// remove the request from this.awaitingReply
					// and save it to answeredRequests
					answeredRequestData = this.awaitingReply.splice(reqDataIdx, 1)[0];
					break;
				}
			}

			if(answeredRequestData === undefined)
				throw new Error("Got a reply to an unknown server request: " + JSON.stringify(msgObj));
			if(replyData.success === false)
			{
				// TODO: Show meaningful error messages for all common errors
				throw new Error("Got an error message from the server: " + msgObj.error + "\n" +
					"as response to:\n\n" + JSON.stringify(answeredRequestData));
			}

			switch(answeredRequestData.action) {
				case "initComm":
					if(this.afterInitComm)
						this.afterInitComm();

					break;
				case "createGame":
					Module.gameMetaData.matchID  = replyData.matchID;
					Module.gameMetaData.playerID = replyData.playerID;
					loadGame(replyData.matchID);
					break;
				case "joinGame":
					Module.gameMetaData.color    = replyData.color;
					Module.gameMetaData.playerID = replyData.playerID;
					Module.gameMetaData.ruleSet  = replyData.ruleSet;

					if(document.location.pathname.substr(0, 7) == "/match/")
						Module.gameMetaData.matchID = getMatchID(document.location.pathname);

					loadGame(Module.gameMetaData.matchID);

					if(this.afterJoinGame)
						this.afterJoinGame();

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
		this.send({
			"msgType": "serverRequest",
			"msgID": this.nextMessageID++,
			"requestData": requestData
		});
		this.awaitingReply.push(requestData);
	},

	initComm: function(success) {
		this.sendRequest({
			"action": "initComm",
			"param": {
				"protocolVersion": CyvasseWS_Protocol_Version
			}
		});

		if(typeof success === "function")
			this.afterInitComm = success;
	},

	createGame: function(metaData) {
		this.sendRequest({
			"action": "createGame",
			"param": metaData
		});
	},

	joinGame: function(matchID, success) {
		Module.gameMetaData.matchID = matchID;

		this.sendRequest({
			"action": "joinGame",
			"param": {
				"matchID": matchID
			}
		});

		if(typeof success === "function")
			this.afterJoinGame = success;
	},

	sendChatMsg: function(content) {
		this.send({
			"msgType": "chatMsg",
			"msgID": this.nextMessageID++,
			"msgData": {
				"userInfo": {
					// TODO
				},
				"content": content
			}
		});
	}
};
