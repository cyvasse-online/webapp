var CyvasseWS_Protocol_Version = "1.0";

var username;

function loadGame(matchID) {
	if (!loadGame.alreadyLoaded) {
		loadGame.alreadyLoaded = true;

		Module.setStatus("Downloading<span class='ani-loading-dot'>.</span>");

		var initGamePage = function() {
			$.getScript("/cyvasse.js");

			$(".page-header .container, .page-footer .container").addClass("full-width");

			// set start username – always 'Black player' or 'White player' because
			// we don't save usernames yet (and they can't be registered yet either)
			var usernameInput = $(".username-input");

			username = gameMetaData.color == "white" ? "White player" : "Black player";
			usernameInput.val(username);

			usernameInput.blur(function() {
				var newUsername = $(".username-input").val();

				if (newUsername == username || $.trim(newUsername).length === 0)
				{
					// restore the old username if the input was left empty
					this.value = username;
					return;
				}

				logbox.addStatusMessage("You changed your username to <strong>" + htmlEncode(newUsername) + "</strong>.");
				wsClient.setUsername(newUsername);

				username = newUsername;
			});
			usernameInput.keydown(function(event) {
				if (event.keyCode == 13) // Enter
					usernameInput.blur();
			});

			// initialize logbox
			logbox = new LogBox("#logbox");

			if (gameMetaData.opponentInfo)
			{
				var opUsername = gameMetaData.opponentInfo.username;
				if (opUsername && opUsername != "Black player" && opUsername != "White player")
					logbox.addStatusMessage("Playing against <strong>" + htmlEncode(opUsername) + "</strong>.");
			}
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
			logbox.addChatMessage(msgObj.msgData.user, msgObj.msgData.content);
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

			logbox.addGameMessage(msgObj.msgData);
		} else if(msgObj.msgType === "gameMsgAck") {

		} else if(msgObj.msgType === "gameMsgErr") {

		} else if(msgObj.msgType === "notification") {
			var data = msgObj.notificationData;

			switch(data.type) {
				case "commError":
					Module.setStatus("Server communication error! (see JavaScript console)");
					throw new Error("Server communication error: " + data.errMsg);
				case "listUpdate":
					var gameGridSelector;
					switch(data.listName) {
						case "openRandomGames":    gameGridSelector = "#random-games"; break;
						case "runningPublicGames": gameGridSelector = "#public-games"; break;
						default:                   throw new Error("Unknown list referenced!");
					}
					var gameGridElement = $(gameGridSelector);

					$(gameGridSelector + " .match").remove();

					if (data.listContent.length > 0) {
						$(gameGridSelector + " > :first-child").hide();

						for (var i = 0; i < data.listContent.length; i++) {
							var match = data.listContent[i];
							var playerStr;
							switch(match.playAs) {
								case "white": playerStr = "White player"; break;
								case "black": playerStr = "Black player"; break;
								default:      throw new Error("Unknown players color referenced!");
							}

							$(gameGridSelector + " .empty-list-notice").before(
								"<div class='match' data-id='" + match.matchID + "'>" +
									"<div class='match-title'>Match against someone</div>" +
									"<strong>Play as:</strong> " + playerStr +
								"</div>"
							);
						}

						setupMatchClick();
					} else {
						$(gameGridSelector + " > :first-child").show();
					}
					break;
				case "userJoined":
					//if(data.role == "player") {
						gameMetaData.opponentInfo = {
							//"registered": data.registered,
							"username": data.username
						};
						logbox.addStatusMessage("<strong>" + htmlEncode(data.username) + "</strong> joined.");
					//}
					// TODO: Also add a message when a spectator joins?
					break;
				case "userLeft":
					//if(data.username == gameMetaData.opponentInfo.username) {
						logbox.addStatusMessage("<strong>" + htmlEncode(data.username) + "</strong> left.");
					//}
					// TODO: Also add a message when a spectator leaves?
					break;
				case "usernameUpdate":
					var statusStrHead;
					if (data.oldUsername == "Black player" || data.oldUsername == "White player")
						statusStrHead = "Your opponent";
					else
						statusStrHead = data.oldUsername;

					logbox.addStatusMessage(statusStrHead + " changed their username to <strong>" +
						htmlEncode(data.newUsername) + "</strong>.");
					break;
			}
		} else if(msgObj.msgType === "serverReply") {
			var replyData = msgObj.replyData;
			var requestData = this.outMsgs[msgObj.msgID];

			if(requestData === undefined)
				throw new Error("Got a reply to an unknown server request: " + JSON.stringify(msgObj));
			if(replyData.success === false) {
				switch(replyData.errMsg) {
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

						if(!replyData.errMsg)
							throw new Error("Server request " + requestJson + " failed without error message");

						var errMsg = "Server request " + requestJson + " failed, error: " + replyData.errMsg;
						if(replyData.errDetail)
							errMsg += " (errorDetail: " + replyData.errDetail + ")";

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
					gameMetaData.matchID  = replyData.matchID;
					gameMetaData.playerID = replyData.playerID;
					loadGame(replyData.matchID);
					break;
				case "joinGame":
					if (replyData.gameStatus.setup === false) {
						$("#canvas").replaceWith("<div class='content-missing-msg'>Pausing / resuming games after the setup isn't supported yet.</div>");
						return;
					}

					gameMetaData.color        = replyData.color;
					gameMetaData.playerID     = replyData.playerID;
					gameMetaData.ruleSet      = replyData.ruleSet;
					gameMetaData.opponentInfo = replyData.opponent;
					initGameStatus            = replyData.gameStatus;

					if(window.location.pathname.substr(0, 7) == "/match/")
						gameMetaData.matchID = getMatchID(window.location.pathname);

					loadGame(gameMetaData.matchID);

					if(this.afterJoinGame)
						this.afterJoinGame();

					break;
				case "subscrGameListUpdates":
					// TODO
					break;
				case "unsubscrGameListUpdates":
					// TODO
					break;
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

	setUsername: function(username) {
		this.sendRequest({
			"action": "setUsername",
			"param": username
		});
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
