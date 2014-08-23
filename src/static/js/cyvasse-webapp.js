var statusElement;

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
			// ugly hack to prevent the status set
			// in the RenderedMatch constructor to
			// be removed by some initialization code
			if(statusElement.html() == "Setup")
				return;
		}

		statusElement.html(text);
	},
	totalDependencies: 0,
	monitorRunDependencies: function(left) {
		this.totalDependencies = Math.max(this.totalDependencies, left);
		Module.setStatus(left ? "Preparing... (" + (this.totalDependencies-left) + "/" + this.totalDependencies + ")"
			: "All downloads complete.");
	},
	filePackagePrefixURL: "/",
	doNotCaptureKeyboard: true
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
function htmlEncode(value) {
  // create a in-memory div, set it's inner text(which jQuery automatically encodes)
  // then grab the encoded contents back out. The div never exists on the page.
  return $("<div/>").text(value).html();
}

function htmlDecode(value) {
  return $("<div/>").html(value).text();
}

// own stuff again

function loadPage(url, success, pushState) {
	if(!isString(url))
		throw new TypeError("url has to be a string");

	if(pushState === undefined)
		pushState = true;

	if(typeof(pushState) !== "boolean")
		throw new TypeError("pushState has to be a bool");

	if(url.substr(-1) == "/")
		url = url + "index";

	$.getJSON(url + ".json", function(reply) {
		if(pushState) {
			document.title = reply.title;
			history.pushState(null, reply.title, url);
		}

		$("#page-wrap").html(reply.content);
		if(typeof(success) === "function")
			success();
	});
}

function loadRuleSetDoc(ruleSet) {
	if(ruleSet) {
		$("#game-settings").show();

		$("#page-content").html("Loading<div class='ani-loading-dot>.</div>'");
		$.get("/rule_sets/" + ruleSet + ".html", function(reply) {
			$("#page-content").html(reply);
		});
	}
	else {
		$("#game-settings").hide();
		$("#page-content").html("Click a rule set to get the corresponding documentation here.");
	}
}

function initializeWSClient() {
	if(wsClient) // already initialized
		throw new Error("WebSocket client already initialized!");

	wsClient = new CyvasseWSClient(new WebSocket("ws://" + window.location.hostname + ":2516/"), loadPage);
	Module.wsClient = wsClient;
	Module.gameMetaData = {};

	Module.setStatus("Downloading<span class='ani-loading-dot'>.</span>");
	window.onerror = function() {
		Module.setStatus("Exception thrown, see JavaScript console");
		Module.setStatus = function(text) {
			if(text) Module.printErr("[post-exception status] " + text);
		};
	};
}

function createGameParamValid(metaData) {
	return !!metaData.ruleSet
		&& !!metaData.color
		&& !!metaData.gameMode;
}

function setupSidePaneEventHandlers() {
	$("input[name='ruleSet']").change(function() {
		loadRuleSetDoc($("input[name='ruleSet']:checked").val());
	});

	$("#side-pane input").change(function() {
		if(document.location.pathname == "/") {
			var title = "Create a new game | Cyvasse Online";

			document.title = title;
			history.pushState(null, title, "/match/create");

			var pageContentWrap = $("#page-content-wrap");

			pageContentWrap.animate({"margin-left": "-70%"}, 800, function() {
				pageContentWrap.detach();
				pageContentWrap.css("margin-left", "");
				pageContentWrap.appendTo("#page-wrap");

				// load after animation
				loadRuleSetDoc($("input[name='ruleSet']:checked").val());
			});
		}

		$("#create-game-button").attr("disabled", !createGameParamValid({
			ruleSet:  $("input:radio[name='ruleSet']:checked").val(),
			color:    $("input:radio[name='color']:checked").val(),
			gameMode: $("input:radio[name='gameMode']:checked").val()
		}));
	});

	$("#create-game-button").click(function() {
		var metaData = {
			ruleSet:  $("input:radio[name='ruleSet']:checked").val(),
			color:    $("input:radio[name='color']:checked").val(),
			gameMode: $("input:radio[name='gameMode']:checked").val()
		};

		if(!createGameParamValid(metaData))
			throw new Error("#create-game-button should be disabled if the given parameters are not valid.");

		$("#side-pane :input").attr("disabled", true);
		$("#create-game-button").attr("disabled", true);
		$("#create-game-button").css("color", "#000");
		$("#create-game-button").html("Creating game<span class='ani-loading-dot'>.</span>");

		initializeWSClient();

		// TODO: might not be the best to overwrite conn.onopen
		wsClient.conn.onopen = function() {
			wsClient.createGame(metaData);
		};
	});
}

function getMatchID(url) {
	return url.substr(-4);
}

$(document).ready(function() {
	statusElement = $("#status");
	//progressElement = $("#progress");

	window.onpopstate = function() {
		loadPage(document.location.pathname, null, false);
	};
});
