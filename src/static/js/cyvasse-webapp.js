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
	memoryInitializerPrefixURL: "/",
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

// another thingy from teh internetz, which is quite ugly...
// but it works, and I'm not particularily intersted in doing it better
function htmlEncode(value) {
  // create a in-memory div, set it's inner text (which jQuery automatically encodes)
  // then grab the encoded contents back out. The div never exists on the page.
  return $("<div/>").text(value).html();
}

function htmlDecode(value) {
  return $("<div/>").html(value).text();
}

function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

// own stuff again

function loadPage(url, success, pushState, replaceRoot, getData) {
	if(!isString(url))
		throw new TypeError("url has to be a string");

	if(pushState === undefined)
		pushState = true;
	else if(typeof(pushState) !== "boolean")
		throw new TypeError("pushState has to be a bool");

	if(replaceRoot === undefined)
		replaceRoot = "#page-wrap";
	else if(!isString(replaceRoot))
		throw new TypeError("replaceRoot has to be a string");

	var realUrl = url;
	if(realUrl.substr(-1) == "/")
		realUrl = realUrl + "index";

	$.getJSON(realUrl + ".json", getData, function(reply) {
		if(pushState) {
			document.title = reply.title;
			history.pushState(null, reply.title, url);
		}

		$(replaceRoot).fadeOut(300, function() {
			$(replaceRoot).html(reply.content);

			if(typeof(success) === "function")
				success();

			$(replaceRoot).fadeIn(300);
		});
	});
}

function loadRuleSetDoc(ruleSet) {
	var pageContent = $("#page-content");

	if(ruleSet) {
		$("#option-extras").show();

		pageContent.html("Loading<div class='ani-loading-dot'>.</div>");
		// TODO: replace with loadPage
		$.ajax("/rule_sets/" + ruleSet + ".html", {
			cache: false,
			success: function(reply) {
				pageContent.html(reply);
			}
		});

		$(".rule-set-new-tab-box").show();
		$(".rule-set-new-tab").attr("href", "/rule_sets/" + ruleSet);
	}
	else {
		$("#option-extras").hide();
		pageContent.html("Click a rule set to get the corresponding documentation here.");

		$(".rule-set-new-tab-box").show();
		$(".rule-set-new-tab").attr("href", "#");
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

// TODO: Rename
function setupSidePaneEventHandlers() {
	$("input[name='ruleSet']").change(function() {
		if($("input[name='create-join']:checked").val() == "create-game")
			loadRuleSetDoc($("input[name='ruleSet']:checked").val());
	});

	$("#game-options input").change(function() {
		switch($("input[name='create-join']:checked").val())
		{
			case "create-game":
				$("#create-game-button").attr("disabled", !createGameParamValid({
					ruleSet:  $("input:radio[name='ruleSet']:checked").val(),
					color:    $("input:radio[name='color']:checked").val(),
					gameMode: $("input:radio[name='gameMode']:checked").val()
				}));
				break;
			case "join-game":
				// TODO
				break;
			default:
				throw new Error("Congratiulations! You found a bug. What you just clicked should not be visible...");
		}
	});
}

function getMatchID(url) {
	return url.substr(-4);
}

$(document).ready(function() {
	statusElement = $("#status");
	//progressElement = $("#progress");

	/*$("a[href^='/']").click(function(event) {
		if(event.button === 0) {
			// left mouse click
			event.preventDefault();
			loadPage(this.href);
		}
	});*/

	window.onpopstate = function() {
		loadPage(document.location.pathname, null, false);
	};

	$("#create-game-button").click(function() {
		var metaData = {
			ruleSet:  "mikelepage", // hardcoded for now
			color:    $("#select-play-as").val(),
			gameMode: $("#select-game-mode").val()
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
});
