function scrolledToBottom(elem) {
	// - 5 for some tolerance for weird browser behavior, wherever that is coming from
	return elem.scrollTop() + elem.innerHeight() >= elem.prop("scrollHeight") - 5;
}

function LogBox(selector) {
	this.selector = selector;

	this.unreadMessages = 0;
	this.origDocTitle = document.title;

	this.viewport = $(this.selector + " .message-viewport");
	this.textarea = $(this.selector + " .chat-input");
	this.scrToBtm = $(this.selector + " .scroll-to-bottom");

	this.textarea.attr("disabled", false);

	var logbox = this;

	// event handlers
	$(document).on("visibilitychange", function() {
		if(!document.hidden && scrolledToBottom($(this.viewport)))
			logbox.resetUnreadMessages();
	});

	this.textarea.keydown(function(event) {
		if(event.keyCode == 13 && !event.shiftKey) {
			event.preventDefault();

			if($.trim(this.value).length > 0) {
				Module.wsClient.sendChatMsg(this.value);
				logbox.addChatMessage("You", this.value, false);
				this.value = "";
			}
		}
	});

	this.scrToBtm.click(function() {
		logbox.resetUnreadMessages();
	});

	this.viewport.scroll(function() {
		if(scrolledToBottom($(this)))
			logbox.resetUnreadMessages();
		else
			logbox.showScrToBtm();
	});
}

LogBox.prototype = {
	scrollDown: function() {
		this.viewport.scrollTop(this.viewport.prop("scrollHeight"));
	},

	showScrToBtm: function() { this.scrToBtm.addClass("visible"); },
	hideScrToBtm: function() { this.scrToBtm.removeClass("visible"); },

	incUnreadMsgs: function() {
		this.unreadMessages++;
		document.title = "(" + this.unreadMessages + ") " + this.origDocTitle;
		this.scrToBtm.find("div").html("(" + this.unreadMessages + ") Scroll to bottom");
	},

	resetUnreadMessages: function() {
		this.unreadMessages = 0;
		this.scrToBtm.find("div").html("Scroll to bottom");
		document.title = this.origDocTitle;

		this.scrollDown();
		this.hideScrToBtm();
	},

	addMessage: function(msgHtml) {
		if($.trim(msgHtml).length === 0)
			throw new Error("Tried to add empty message"); // just return; instead?

		var atBottom = scrolledToBottom($(this.viewport));

		$("<div class='logbox-msg'>" + msgHtml + "</div>").appendTo(this.viewport);

		if(atBottom) {
			this.scrollDown();

			if(document.hidden)
				this.incUnreadMsgs();
		} else {
			this.incUnreadMsgs();
		}
	},

	addStatusMessage: function(msgHtml) {
		this.addMessage("<span class='status-msg'>" + msgHtml + "</span>");
	},

	addGameMessage: function(msgData) {
		var msgStr = msgData.user;

		switch(msgData.action) {
			case "leave setup":
				msgStr += " finished setting up.";
				break;
			case "move piece":
				msgStr += " moved his " + capitalizeEachWord(msgObj.data["piece type"]) +
					" from " + msgObj.data["old position"] +
					" to " + msgObj.data["new position"] + ".";
				break;
			case "promote piece":
				msgStr += " promoted his " + capitalizeEachWord(msgObj.data.from) +
					" to a " + capitalizeEachWord(msgObj.data.to) + ".";
				break;
			default:
				throw new Error("Unknown game update received.");
		}

		this.addStatusMessage(msgStr);
	},

	addChatMessage: function(userName, msg, doNotScroll) {
		if(doNotScroll === undefined)
			doNotScroll = true;

		// might allow basic html somewhen
		this.addMessage("<strong>" + userName + ":</strong> " + htmlEncode(msg));

		if(!doNotScroll)
			this.resetUnreadMessages();
	}
};
