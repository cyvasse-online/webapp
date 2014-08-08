var emscriptenHeader;
var statusElement;
var progressElement;
var spinnerElement;

var wsClient;

var Module = {
	preRun: [function() {
		Module.canvas = document.getElementById("canvas");
	}],
	postRun: [],
	print: function(text) {
		console.log(text);
	},
	printErr: function(text) {
		console.error(text);
	},
	setStatus: function(text) {
		if(!text) {
			spinnerElement.hide();

			// ugly hack to prevent the status set
			// in the RenderedMatch constructor to
			// be removed by some initialization code
			if(statusElement.html() == "Setup") {
				return;
			}
		}

		statusElement.html(text);
	},
	totalDependencies: 0,
	monitorRunDependencies: function(left) {
		this.totalDependencies = Math.max(this.totalDependencies, left);
		Module.setStatus(left ? "Preparing... (" + (this.totalDependencies-left) + "/" + this.totalDependencies + ")"
			: "All downloads complete.");
	},
	filePackagePrefixURL: "/"
};

// for type checks
function isString(object) {
	return typeof(object) === "string" || object instanceof String;
}

// tiny jQuery extension from somewhere off the net
$.fn.exists = function () {
	// int-to-bool conversion through twice applying the ! operator
    return !!this.length;
};

// another thingy from teh internetz, this time really ugly...
// but it works, and I'm not particularily intersted in doing it better
function htmlEncode(value){
  // create a in-memory div, set it's inner text(which jQuery automatically encodes)
  // then grab the encoded contents back out. The div never exists on the page.
  return $("<div/>").text(value).html();
}

function htmlDecode(value){
  return $("<div/>").html(value).text();
}

// own stuff again

function loadPage(url, success, pushState) {
	if(!isString(url)) {
		throw new TypeError("url has to be a string");
	}
	if(pushState === undefined) {
		pushState = true;
	}
	if(typeof(pushState) !== "boolean") {
		throw new TypeError("pushState has to be a bool");
	}

	if(url.substr(-1) == "/") {
		url = url + "index";
	}
	else if(url.substr(-11, 7) == "/match/") {
		wsClient = null;
		emscriptenHeader.hide();
	}

	$.getJSON(url + ".json", function(reply) {
		if(pushState) {
			History.pushState(null, reply.title, url);
		}

		$("#page-wrap").html(reply.content);
		if(typeof(success) === "function") {
			success();
		}
	});
}

function initializeWSClient()
{
	if(wsClient !== undefined && wsClient !== null) {
		// already initialized
		throw new Error("WebSocket client already initialized!");
	}
	wsClient = new CyvasseWSClient(new WebSocket("ws://" + window.location.hostname + ":2516/"), loadPage);
	Module.wsClient = wsClient;
	Module.gameMetaData = {};

	Module.setStatus("Downloading...");
	window.onerror = function() {
		Module.setStatus("Exception thrown, see JavaScript console");
		spinnerElement.hide();
		Module.setStatus = function(text) {
			if(text) Module.printErr("[post-exception status] " + text);
		};
	};
}

function getMatchID(url)
{
	return url.substr(-4);
}

$(document).ready(function() {
	emscriptenHeader = $("#emscripten-header");
	statusElement = $("#status");
	progressElement = $("#progress");
	spinnerElement = $("#spinner");

	$("input[name='ruleSet']").change(function() {
		if(document.location.pathname == "/") {
			// TODO: load /match/create
		}

		// TODO: show ruleset documentation / tutorial
	});

	$("#create-game-submit-private").click(function() {
		ruleSet = $("input:radio[name='ruleSet']:checked").val();
		color   = $("input:radio[name='color']:checked").val();
		if(ruleSet === null || color === null) {
			return;
		}

		// TODO:
		// * disable inputs
		// * show loading animation

		initializeWSClient();

		// TODO: might not be the best to overwrite conn.onopen
		wsClient.conn.onopen = function() {
			wsClient.createGame(ruleSet, color);
		};
	});

	$(window).on("statechange", function() {
		loadPage(History.getState().url, null, false);
	});
});

// chat + game log stuff

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

var logbox = $("#logbox");

function logboxAddMessage(msgHtml) {
	if(!isString(msgHtml)) {
		throw new TypeError("msgHtml has to be a string");
	}
	if(!logbox.exists()) {
		logbox = $("#logbox");
		if(!logbox.exists()) {
			throw new Error("Couldn't find #logbox");
		}
	}

	// TODO
}

function logboxAddGameMessage(sender, msgObj) {
	if(!isSenderEnum(sender)) {
		throw new TypeError("sender has to be a member of SenderEnum: " + JSON.stringify(Object.keys(SenderEnum)));
	}
	if(sender == SenderEnum.SERVER) {
		console.error("The sender of a game message should be a player, not the server...");
	}

	// logboxAddMessage() a nicely formatted version of the information in msgObj
}

function logboxAddChatMessage(sender, msg) {
	if(!isSenderEnum(sender)) {
		throw new TypeError("sender has to be a member of SenderEnum: " + JSON.stringify(Object.keys(SenderEnum)));
	}

	// might allow basic html somewhen
	logboxAddMessage("<b>" + sender + "</b>: " + htmlEncode(msg));
}
