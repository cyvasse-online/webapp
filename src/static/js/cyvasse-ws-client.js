var CyvasseWS_Protocol_Version = "1.0";

function loadGame(matchID) {
	if (!loadGame.alreadyLoaded) {
		loadGame.alreadyLoaded = true;

		Module.setStatus("Downloading<span class='ani-loading-dot'>.</span>");

		var initGamePage = function() {
			$.getScript("/cyvasse.js");

			// initialize logbox
			Module.logbox = new LogBox("#logbox");
		};

		// loadPage() is a global function from cyvasse-webapp.js
		// is there a way to explicitly handle this kind of dependency in JS?
		if(window.location.pathname.substr(0, 7) == "/match/")
			initGamePage();
		else
			loadPage("/match/" + matchID, initGamePage);
	} else {
		console.error("Tried to load cyvasse.js twice");
	}
}

// I don't want to repeat this all over again, but saving "console.log"
// in an object like any other function doesn't seem to work
function log(text) { console.log(text); }

function CyvasseWSClient(hostname, onopen) {
	this.websock = new WebSocket("ws://" + hostname + ":2516/");
	this.nextMessageID = 1;
	this.outMsgs = [];
	this.cachedIngameRequests = [];

	this.connWasOpen = false;

	this.debug = true;

	var self = this;

	this.websock.onopen = function() {
		self.connWasOpen = true;
		self.initComm(onopen);
	};

	this.websock.onmessage = function(msg) {
		if(self.debug === true) {
			console.log("[onmessage]");
			console.log(msg.data);
		}
		self.handleMessage(msg.data);
	};

	this.websock.onerror = function(ev) {
		if(self.connWasOpen) {
			Module.setStatus("WebSocket communication error, see JavaScript console");
			Module.setStatus = log;

			console.error("WebSocket communication error:");
			console.log(ev);
		} else {
			Module.setStatus("Couldn't establish a WebSocket connection");
		}
	};

	this.websock.onclose = function(ev) {
		if(self.connWasOpen) {
			if(ev.wasClean) {
				// Don't error if the disconnect was expected,
				// e.g. when the page is reloaded
				console.log("WebSocket connection closed:");
				console.log(ev);
			} else {
				Module.setStatus("The connection to the server was closed, see JavaScript console");
				Module.setStatus = log;

				console.error("WebSocket connection closed:");
				console.error(ev);
			}
		}
	};
}

CyvasseWSClient.prototype = {
	handleMessage: function(msgStr) {
		var msgObj = JSON.parse(msgStr);

		if(msgObj.msgType === "chatMsg") {
			Module.logbox.addChatMessage(msgObj.msgData.user, msgObj.msgData.content);
			this.sendChatMsgAck(msgObj.msgID);
		} else if(msgObj.msgType === "chatMsgAck") {
			// TODO: Show tick next to chat message or something similar
		} else if(msgObj.msgType === "gameMsg") {
			if(this.handleMessageIngame === undefined) {
				console.log("Got a message for the game before it was loaded, caching.");
				this.cachedIngameRequests.push(msgStr);
			} else {
				this.handleMessageIngame(msgStr);
			}

			Module.logbox.addGameMessage(sender, msgObj);
		} else if(msgObj.msgType === "gameMsgAck") {

		} else if(msgObj.msgType === "gameMsgErr") {

		} else if(msgObj.msgType === "notification") {

		} else if(msgObj.msgType === "serverReply") {
			var replyData = msgObj.replyData;
			var requestData = this.outMsgs[msgObj.msgID];

			if(requestData === undefined)
				throw new Error("Got a reply to an unknown server request: " + JSON.stringify(msgObj));
			if(replyData.success === false) {
				switch(replyData.error) {
					case "gameNotFound":
						Module.setStatus("");

						// assert that we're on the game page
						$("#canvas").replaceWith("<div class='content-missing-msg'>Game not found</div>");
						break;
					//case "gameEmpty"
					//case "gameFull":
					// TODO: Show meaningful error messages for other common errors
					default:
						var requestJson = JSON.stringify(requestData);

						if(!replyData.error)
							throw new Error("Server request " + requestJson + " failed without error message");

						var errMsg = "Server request " + requestJson + " failed, error: " + replyData.error;
						if(replyData.errorDetail)
							errMsg += " (errorDetail: " + replyData.errorDetail + ")";

						throw new Error(errMsg);
				}

				return;
			}

			switch(requestData.action) {
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

					if(window.location.pathname.substr(0, 7) == "/match/")
						Module.gameMetaData.matchID = getMatchID(window.location.pathname);

					loadGame(Module.gameMetaData.matchID);

					if(this.afterJoinGame)
						this.afterJoinGame();

					break;
				case "subscrGameListUpdates":
					// TODO
					break;
				//case "unsubscrGameListUpdates":
				//	break;
			}
		} else if(msgObj.msgType === "serverRequest") {
			// Do nothing, just assume this doesn't happen
		} else {
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
			"msgID": this.nextMessageID,
			"requestData": requestData
		});
		this.outMsgs[this.nextMessageID] = requestData;

		this.nextMessageID++;
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

	createGame: function(param) {
		this.sendRequest({
			"action": "createGame",
			"param": param
		});
	},

	joinGame: function(param, success) {
		this.sendRequest({
			"action": "joinGame",
			"param": param
		});

		if(typeof success === "function")
			this.afterJoinGame = success;
	},

	subscrGameListUpdates: function(ruleSet, lists) {
		this.sendRequest({
			"action": "subscrGameListUpdates",
			"param": {
				"ruleSet": ruleSet,
				"lists": lists
			}
		});
	},

	unsubscrGameListUpdates: function(ruleSet, lists) {
		this.sendRequest({
			"action": "unsubscrGameListUpdates",
			"param": {
				"ruleSet": ruleSet,
				"lists": lists
			}
		});
	},

	sendChatMsg: function(content) {
		this.send({
			"msgType": "chatMsg",
			"msgID": this.nextMessageID++,
			"msgData": {
				"content": content
			}
		});
	},

	sendChatMsgAck: function(msgID) {
		this.send({
			"msgType": "chatMsgAck",
			"msgID": msgID
		});
	}
};
