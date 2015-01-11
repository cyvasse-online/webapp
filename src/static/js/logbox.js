function scrolledToBottom(elem) {
	return elem.scrollTop() + elem.innerHeight() >= elem.prop("scrollHeight");
}

function LogBox(selector) {
	this.selector = selector;
	this.htmlElem = $();
	this.msgArea  = $();
	this.textarea = $();
	this.scrToBtm = $();

	this.scrToBtmVisible = false;
	this.transitioning = false;
	this.unreadMessages = 0;
	this.origDocTitle = document.title;

	this.setHtmlElem();
	this.initKeyDownHandler();
	this.initScrollHandlers();

	var logbox = this;

	$(document).on("visibilitychange", function() {
		if(!document.hidden && !logbox.scrToBtmVisible)
			logbox.resetUnreadMessages();
	});
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
		}
	},

	resetUnreadMessages: function() {
		this.unreadMessages = 0;
		this.scrToBtm.find("div").html("Scroll to bottom");
		document.title = this.origDocTitle;
	},

	initKeyDownHandler: function() {
		this.setHtmlElem();

		var logbox = this;

		this.textarea.keydown(function(event) {
			if(event.keyCode == 13 && !event.shiftKey) {
				event.preventDefault();

				if($.trim(this.value).length > 0) {
					Module.wsClient.sendChatMsg(logbox.player, this.value);
					logbox.addChatMessage(this.value, true);
					this.value = "";
				}
			}
		});
	},

	initScrollHandlers: function() {
		this.setHtmlElem();

		var logbox = this;

		this.scrToBtm.click(function() {
			logbox.msgArea.animate({
				"top": 0,
				"scrollTop": logbox.msgArea.prop("scrollHeight")
			});
			logbox.scrToBtm.animate({"top": "-2em"}, function() { logbox.transitioning = false; });

			logbox.transitioning = true;
			logbox.scrToBtmVisible = false;

			logbox.resetUnreadMessages();
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

					logbox.resetUnreadMessages();
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
		if($.trim(msgHtml).length === 0)
			throw new Error("Tried to add empty message"); // just return; instead?

		this.setHtmlElem();

		$("<div class='logbox-msg'>" + msgHtml + "</div>").appendTo(this.msgArea);

		if(this.scrToBtmVisible) {
			this.unreadMessages++;
			this.scrToBtm.find("div").html("(" + this.unreadMessages + ") Scroll to bottom");
			document.title = "(" + this.unreadMessages + ") " + this.origDocTitle;
		}
		else {
			this.msgArea.scrollTop(this.msgArea.prop("scrollHeight"));
			if(document.hidden) {
				this.unreadMessages++;
				document.title = "(" + this.unreadMessages + ") " + this.origDocTitle;
			}
		}
	},

	addStatusMessage: function(msgHtml) {
		this.addMessage("<span class='status-msg'>" + msgHtml + "</span>");
	},

	addGameMessage: function(msgData) {
		var msgStr = msgData.user;

		switch(msgData.action)
		{
			case "leave setup":
				msgStr += " finished setting up.";
				break;
			case "move piece":
				msgStr += " moved his " + capitalizeEachWord(msgObj.data["piece type"]) +
					" from " + msgObj.data["old position"] +
					" to " + msgObj.data["new position"] + ".";
				break;
			case "promote piece":
				msgStr += " promoted " + capitalizeEachWord(msgObj.data.from) +
					" to " + capitalizeEachWord(msgObj.data.to) + ".";
				break;
			default:
				throw new Error("Unknown game update received.");
		}

		this.addStatusMessage(msgStr);
	},

	addChatMessage: function(msgData, doNotScroll) {
		if(doNotScroll === undefined)
			doNotScroll = false;

		// might allow basic html somewhen
		this.addMessage("<strong>" + msgData.user + ":</strong> " + htmlEncode(msgData.content));

		if(!doNotScroll && this.scrToBtmVisible) {
			this.msgArea.scrollTop(this.msgArea.prop("scrollHeight"));
			this.msgArea.animate({"top": 0});
			this.scrToBtm.animate({"top": "-2em"});

			this.scrToBtmVisible = false;

			this.resetUnreadMessages();
		}
	}
};
