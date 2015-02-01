function scrolledToBottom(elem) {
	// - 5 for some tolerance for weird browser behavior, wherever that is coming from
	return elem.scrollTop() + elem.innerHeight() >= elem.prop("scrollHeight") - 5;
}

function LogBox(selector) {
	this.selector = selector;

	this.unreadMsgs = 0;
	this.origDocTitle = document.title;

	this.viewport = $(this.selector + " .message-viewport");
	this.textarea = $(this.selector + " .chat-input");
	this.scrToBtm = $(this.selector + " .scroll-to-bottom");

	this.textarea.attr("disabled", false);

	var logbox = this;

	// event handlers
	$(document).on("visibilitychange", function() {
		if(!document.hidden && logbox.unreadMsgs > 0 && scrolledToBottom($(logbox.viewport)))
			logbox.resetUnreadMsgs();
	});

	this.textarea.keydown(function(event) {
		if(event.keyCode == 13 && !event.shiftKey) {
			event.preventDefault();

			if($.trim(this.value).length > 0) {
				Module.wsClient.sendChatMsg(this.value);
				logbox.addChatMessage("You", this.value, true);
				this.value = "";
			}
		}
	});

	this.scrToBtm.click(function() {
		if(logbox.unreadMsgs > 0)
			logbox.resetUnreadMsgs();
		else
			logbox.scrollDown();
	});

	this.viewport.scroll(function() {
		if(scrolledToBottom($(this)))
		{
			logbox.hideScrToBtm();

			if(logbox.unreadMsgs > 0)
				logbox.resetUnreadMsgs();
		}
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
		this.unreadMsgs++;
		document.title = "(" + this.unreadMsgs + ") " + this.origDocTitle;
		this.scrToBtm.find("div").html("(" + this.unreadMsgs + ") Scroll to bottom");
	},

	resetUnreadMsgs: function() {
		this.unreadMsgs = 0;
		this.scrToBtm.find("div").html("Scroll to bottom");
		document.title = this.origDocTitle;

		this.scrollDown();
	},

	addMessage: function(msgHtml) {
		if($.trim(msgHtml).length === 0)
			throw new Error("Tried to add empty message"); // just return; instead?

		var atBottom = scrolledToBottom($(this.viewport));

		$("<div class='logbox-msg'>" + msgHtml + "</div>").appendTo(this.viewport);

		if(atBottom)
			this.scrollDown();

		if(!atBottom || document.hidden)
			this.incUnreadMsgs();
	},

	addStatusMessage: function(msgHtml) {
		this.addMessage("<span class='status-msg'>" + msgHtml + "</span>");
	},

	addGameMessage: function(msgData) {
		var msgStr = "The opponent ";

		switch(msgData.action) {
			case "setIsReady":
				if(msgData.param === true)
					msgStr += "finished setting up.";
				else if(msgData.param === false)
					msgStr += "???"; // TODO
				else
					throw new Error("Communication error!");
				break;
			case "move":
				msgStr += "moved his " + capitalizeEachWord(msgData.param.type) +
					" from " + msgData.param.oldPos +
					" to " + msgData.param.newPos + ".";
				break;
			case "moveCapture":
				msgStr += "moved his " + capitalizeEachWord(msgData.param.type) +
					" from " + msgData.param.atkPiece.oldPos +
					" to " + msgData.param.atkPiece.newPos + ", " +
					" taking your " + capitalizeEachWord(msgData.param.defPiece.type) + ".";
				break;
			case "promote":
				msgStr += "promoted his " + capitalizeEachWord(msgData.param.origType) +
					" to a " + capitalizeEachWord(msgData.param.newType) + ".";
				break;
			case "resign":
				msgStr += "resigned";
				break;
			case "endTurn":
			case "setOpeningArray":
				// don't log anything
				return;
			default:
				throw new Error("Unknown game update received: " + msgData.action);
		}

		this.addStatusMessage(msgStr);
	},

	addChatMessage: function(userName, msg, ownMessage) {
		if(ownMessage === undefined)
			ownMessage = false;

		// might allow basic html somewhen
		this.addMessage("<strong>" + userName + ":</strong> " + htmlEncode(msg));

		if(ownMessage)
			this.resetUnreadMsgs();
	}
};
