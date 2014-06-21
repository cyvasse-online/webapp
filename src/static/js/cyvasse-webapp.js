var statusElement = $("#status");
var progressElement = $("#progress");
var spinnerElement = $("#spinner");

var Module = {
	preRun: [],
	postRun: [],
	print: function(text) {
		console.log(text);
	},
	printErr: function(text) {
		console.error(text);
	},
	canvas: document.getElementById("canvas"),
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
			if(!text) $("#emscripten-header").hide();
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

function loadPage(url, success) {
	if(typeof(url) !== "string" && url instanceof String === false) {
		throw new TypeError("url has to be a string");
	}

	$.getJSON(url + ".json", function(reply) {
		History.pushState(null, reply.title, url);
		$("#page-wrap").html(reply.content);
		if(typeof(success) === "function") {
			success();
		}
	});
}

var gameClient;

function initializeGameClient()
{
	gameClient = new CyvasseGameClient(new WebSocket("ws://" + window.location.hostname + ":2516/"), loadPage);
	Module.gameClient = gameClient;

	Module.setStatus('Downloading...');
	window.onerror = function() {
		Module.setStatus('Exception thrown, see JavaScript console');
		spinnerElement.hide();
		Module.setStatus = function(text) {
			if(text) Module.printErr('[post-exception status] ' + text);
		};
	};
}

function getMatchID(url)
{
	return url.substr(-4);
}

function setupCreateGameHandlers()
{
	$("#create-game-submit-private").click(function() {
		ruleSet = $("#create-game-rule-set").val();
		color   = $("input:radio[name=color]:checked").val();
		if(ruleSet === null || color === null) {
			return;
		}

		// TODO:
		// * disable inputs
		// * show loading animation

		initializeGameClient();

		// TODO: might not be the best to overwrite conn.onopen
		gameClient.conn.onopen = function() {
			gameClient.createGame(ruleSet, color);
		};
	});
} // setupCreateGameHandlers
