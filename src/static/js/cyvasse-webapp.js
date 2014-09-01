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

		$(replaceRoot).children().fadeOut(300, function() {
			$(replaceRoot).html(reply.content);
			$(replaceRoot).children().hide();

			if(typeof(success) === "function")
				success();

			$(replaceRoot).children().fadeIn(300);
		});
	});
}

function loadRuleSetDoc(ruleSet) {
	var pageContent = $("#page-content");

	if(ruleSet) {
		$("#option-extras").show();

		pageContent.html("Loading<div class='ani-loading-dot'>.</div>");
		// TODO: replace with loadPage
		$.get("/rule_sets/" + ruleSet + ".html", function(reply) {
			pageContent.html(reply);
		});
	}
	else {
		$("#option-extras").hide();
		pageContent.html("Click a rule set to get the corresponding documentation here.");
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

function updateGameOptions()
{
	var gameOptions = $("#game-options");

	var showOptions = function() {
		switch($("input[name='create-join']:checked").val())
		{
			// TODO: remove disabled attribute stuff when filters are implemented
			case "create-game":
				$("#game-options input").prop("checked", false).attr("type", "radio").attr("disabled", false);

				// TODO
				$("#game-mode-bot, #game-mode-local").attr("disabled", true);

				$("#create-game-button").attr("disabled", true);
				$("#create-game-only").show();
				break;
			case "join-game":
				$("#game-options input").prop("checked", false).attr("type", "checkbox").attr("disabled", true);
				$("#create-game-only").hide();
				break;
			default:
				throw new Error("This function should only be called when either" +
					"'Create game' or 'Join game' was clicked.");
		}

		gameOptions.fadeIn(300);
	};

	if(gameOptions.is(":visible"))
		gameOptions.fadeOut(300, showOptions);
	else
		showOptions();
}

function setupSidePaneEventHandlers() {
	$("input[name='ruleSet']").change(function() {
		if($("input[name='create-join']:checked").val() == "create-game")
			loadRuleSetDoc($("input[name='ruleSet']:checked").val());
	});

	$("input[name='create-join']").change(function() {
		var action = $("input[name='create-join']:checked").val();

		if(document.location.pathname == "/") {
			var pageOuterWrap     = $("#page-outer-wrap");
			var oldPageContentDiv = $("#page-content");
			var newPageContentDiv = $("<div class='padded boxed' />");

			newPageContentDiv.html("<div class='page-content'>Loading<span class='ani-loading-dot'>.</span></div>");

			// dirty hack...
			oldPageContentDiv.width(oldPageContentDiv.width());
			newPageContentDiv.width(newPageContentDiv.width());

			pageOuterWrap.width("170%");
			newPageContentDiv.appendTo("#page-wrap");

			pageOuterWrap.animate({"margin-left": -oldPageContentDiv.width()}, 600, function() {
				// after animation...
				oldPageContentDiv.remove();

				pageOuterWrap.css("margin-left", "");
				pageOuterWrap.width("");
				newPageContentDiv.width("");

				newPageContentDiv.attr("id", "page-content");

				loadPage("/" + action, null, true, "#page-content", "pageContent=true");

				updateGameOptions();
			});
		}
		else if(document.location.pathname.substr(1) !== action) {
			updateGameOptions();
			loadPage("/" + action, null, true, "#page-content", "pageContent=true");
		}
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

	$("a[href^='/']").click(function(event) {
		if(event.button === 0) {
			// left mouse click
			event.preventDefault();
			loadPage(this.href);
		}
	});

	window.onpopstate = function() {
		loadPage(document.location.pathname, null, false);
	};
});
