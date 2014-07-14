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
		if(!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: "" };
		if(text === Module.setStatus.text) return;
		var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
		var now = Date.now();
		if(m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
		if(m) {
			text = m[1];
			//progressElement.value = parseInt(m[2])*100;
			//progressElement.max = parseInt(m[4])*100;
			//progressElement.hidden = false;
			spinnerElement.show();
		} else {
			//progressElement.value = null;
			//progressElement.max = null;
			//progressElement.hidden = true;
			if(!text) emscriptenHeader.hide();
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

function loadPage(url, success, pushState) {
	if(typeof(url) !== "string" && !(url instanceof String)) {
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
	if(wsClient !== undefined) {
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

	$("#create-game-submit-private").click(function() {
		ruleSet = $("#create-game-rule-set").val();
		color   = $("input:radio[name=color]:checked").val();
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
