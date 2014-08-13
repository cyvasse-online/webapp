var SenderEnum = {
	SERVER: "Server",
	PLAYER_WHITE: "White player",
	PLAYER_BLACK: "Black player"
};

// don't allow modification of SenderEnum
Object.freeze(SenderEnum);

// this is awful, but is seems there no better method of doing this
// ... or you aren't even supposed to do it at all in JavaScript
function isSenderEnum(str) {
	if(!isString(str)) {
		throw new TypeError("str has to be a string");
	}

	for(var elem in SenderEnum) {
		if(str == SenderEnum[elem]) {
			return true;
		}
	}

	return false;
}

function LogBox(selector, player) {
	if(!isString(selector)) {
		throw new TypeError("cssId has to be a string");
	}
	if(!isSenderEnum(player)) {
		throw new TypeError("player has to be SenderEnum.PLAYER_WHITE or SenderEnum.PLAYER_BLACK");
	}

	this.selector = selector;
	this.player   = player;
	this.htmlElem = $();
	this.msgArea  = $();
	this.textarea = $();

	this.setHtmlElem();
	this.initKeyDownHandler();
}

LogBox.prototype = {
	setHtmlElem: function() {
		if(this.htmlElem.exists()) {
			return;
		}

		this.htmlElem = $(this.selector);
		if(this.htmlElem.exists()) {
			this.msgArea  = $(this.selector + " .message-area");
			this.textarea = $(this.selector + " textarea");
		}
	},

	initKeyDownHandler: function() {
		this.setHtmlElem();

		if(this.textarea.exists()) {
			var logbox = this;

			this.textarea.keydown(function(event) {
				if(event.keyCode == 13 && !event.shiftKey) {
					event.preventDefault();

					if($.trim(this.value).length > 0) {
						Module.wsClient.sendChatMsg(logbox.player, this.value);
						logbox.addChatMessage(logbox.player, this.value);
						this.value = "";
					}
				}
			});
		}
	},

	addMessage: function(msgHtml) {
		if(!isString(msgHtml)) {
			throw new TypeError("msgHtml has to be a string");
		}
		if($.trim(msgHtml).length === 0) {
			throw new Error("Tried to add empty message");
		}

		this.setHtmlElem();

		if(this.htmlElem.exists()) {
			$("<div class='logbox-msg'>" + msgHtml + "</div>").appendTo(this.msgArea);
		}
		else {
			throw new Error("Tried to add a message to a non-existent log box");
		}
	},

	addGameMessage: function(sender, msgObj) {
		if(!isSenderEnum(sender)) {
			throw new TypeError("sender has to be a member of SenderEnum: " + JSON.stringify(Object.keys(SenderEnum)));
		}
		if(sender == SenderEnum.SERVER) {
			console.error("The sender of a game message should be a player, not the server...");
		}

		// TODO: logboxAddMessage() a nicely formatted version of the information in msgObj
	},

	addChatMessage: function(sender, msg) {
		if(!isSenderEnum(sender)) {
			throw new TypeError("sender has to be a member of SenderEnum: " + JSON.stringify(Object.keys(SenderEnum)));
		}

		// might allow basic html somewhen
		this.addMessage("<strong>" + sender + ":</strong> " + htmlEncode(msg));
	}
};
