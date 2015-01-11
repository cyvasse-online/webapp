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
	if(pushState === undefined)
		pushState = true;

	// I don't really know whether this is a good idea
	if(replaceRoot === undefined)
		replaceRoot = "#page-wrap";

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
	Module.wsClient = new CyvasseWSClient(new WebSocket("ws://" + window.location.hostname + ":2516/"), loadPage);
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
	return !!metaData.ruleSet && !!metaData.color && !!metaData.gameMode;
}

function getMatchID(url) {
	return url.substr(-4);
}

$(document).ready(function() {
	statusElement = $("#status");

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

		// TODO: Change corresponding to the changes in creating a game
		/*$("#side-pane :input").attr("disabled", true);
		$("#create-game-button").attr("disabled", true);
		$("#create-game-button").css("color", "#000");
		$("#create-game-button").html("Creating game<span class='ani-loading-dot'>.</span>");*/

		// TODO: Rewrite so this makes more sense
		initializeWSClient();

		wsClient.conn.onopen = function() {
			wsClient.createGame(metaData);
		};
	});
});
