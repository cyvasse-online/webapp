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
	if(!isString(str))
		throw new TypeError("str has to be a string");

	for(var elem in SenderEnum)
		if(str == SenderEnum[elem])
			return true;

	return false;
}

function scrolledToBottom(elem) {
	return elem.scrollTop() + elem.innerHeight() >= elem.prop("scrollHeight");
}

function LogBox(selector, player) {
	if(!isString(selector))
		throw new TypeError("cssId has to be a string");
	if(!isSenderEnum(player))
		throw new TypeError("player has to be SenderEnum.PLAYER_WHITE or SenderEnum.PLAYER_BLACK");

	this.selector = selector;
	this.player   = player;
	this.htmlElem = $();
	this.msgArea  = $();
	this.textarea = $();
	this.scrToBtm = $();

	this.scrToBtmVisible = false;
	this.transitioning = false;
	this.unreadMessages = 0;

	this.setHtmlElem();
	this.initKeyDownHandler();
	this.initScrollHandlers();
}

LogBox.prototype = {
	setHtmlElem: function() {
		if(this.htmlElem.exists())
			return;

		this.htmlElem = $(this.selector);
		if(this.htmlElem.exists()) {
			this.msgArea  = $(this.selector + " .message-area");
			this.textarea = $(this.selector + " .chat-input");
			this.scrToBtm = $(this.selector + " .scroll-to-bottom");

			if(this.msgArea.size() != 1)
				throw new Error("There has to be exactly one message area in the logbox.");
			if(this.textarea.size() != 1)
				throw new Error("There has to be exactly one textarea in the logbox.");
		}
	},

	initKeyDownHandler: function() {
		this.setHtmlElem();

		if(!this.textarea.exists())
			throw new Error("The logbox lacks a textarea");

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
	},

	initScrollHandlers: function() {
		this.setHtmlElem();

		if(!this.scrToBtm.exists())
			throw new Error("The logbox lacks a scroll to bottom element");
		if(!this.msgArea.exists())
			throw new Error("The logbox lacks a message area");

		var logbox = this;

		this.scrToBtm.click(function() {
			logbox.msgArea.animate({
				"top": 0,
				"scrollTop": logbox.msgArea.prop("scrollHeight")
			});
			logbox.scrToBtm.animate({"top": "-2em"}, function() { logbox.transitioning = false; });

			logbox.transitioning = true;
			logbox.scrToBtmVisible = false;

			logbox.unreadMessages = 0;
			logbox.scrToBtm.find("div").html("Scroll to bottom");
		});

		this.msgArea.scroll(function() {
			if(logbox.transitioning)
				return;

			if(scrolledToBottom($(this))) {
				if(logbox.scrToBtmVisible) {
					logbox.msgArea.animate({"top": 0});
					logbox.scrToBtm.animate({"top": "-2em"}, function() { logbox.transitioning = false; });

					logbox.transitioning = true;
					logbox.scrToBtmVisible = false;

					logbox.unreadMessages = 0;
					logbox.scrToBtm.find("div").html("Scroll to bottom");
				}
			}
			else if(!logbox.scrToBtmVisible) {
				logbox.msgArea.animate({"top": "2em"});
				logbox.scrToBtm.animate({"top": 0}, function() { logbox.transitioning = false; });

				logbox.transitioning = true;
				logbox.scrToBtmVisible = true;
			}
		});
	},

	addMessage: function(msgHtml) {
		if(!isString(msgHtml))
			throw new TypeError("msgHtml has to be a string");
		if($.trim(msgHtml).length === 0)
			throw new Error("Tried to add empty message");

		this.setHtmlElem();

		if(!this.htmlElem.exists())
			throw new Error("Tried to add a message to a non-existent log box");

		$("<div class='logbox-msg'>" + msgHtml + "</div>").appendTo(this.msgArea);

		if(!this.scrToBtmVisible)
			this.msgArea.scrollTop(this.msgArea.prop("scrollHeight"));
	},

	addGameMessage: function(sender, msgObj) {
		if(!isSenderEnum(sender))
			throw new TypeError("sender has to be a member of SenderEnum: " + JSON.stringify(Object.keys(SenderEnum)));
		if(sender == SenderEnum.SERVER)
			console.error("The sender of a game message should be a player, not the server...");

		// TODO: logboxAddMessage() a nicely formatted version of the information in msgObj
	},

	addChatMessage: function(sender, msg) {
		if(!isSenderEnum(sender))
			throw new TypeError("sender has to be a member of SenderEnum: " + JSON.stringify(Object.keys(SenderEnum)));

		// might allow basic html somewhen
		this.addMessage("<strong>" + sender + ":</strong> " + htmlEncode(msg));

		if(this.scrToBtmVisible) {
			if(sender == this.player) {
				this.msgArea.scrollTop(this.msgArea.prop("scrollHeight"));
				this.msgArea.animate({"top": 0});
				this.scrToBtm.animate({"top": "-2em"});

				this.scrToBtmVisible = false;

				this.unreadMessages = 0;
				this.scrToBtm.find("div").html("Scroll to bottom");
			}
			else {
				this.unreadMessages++;
				this.scrToBtm.find("div").html("(" + this.unreadMessages + ") Scroll to bottom");
			}
		}
	}
};
