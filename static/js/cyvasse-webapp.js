var statusElement;

var logbox;
var wsClient;
var gameMetaData = {};
var initGameStatus = {};

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

function loadPage(url, success, pushState) {
	if(pushState === undefined)
		pushState = true;

	replaceRoot = $(".page-wrap");

	var realUrl = url;
	if(realUrl.substr(-1) == "/")
		realUrl = realUrl + "index";

	$.getJSON(realUrl + ".json", function(reply) {
		if(pushState) {
			document.title = reply.title;
			history.pushState(null, reply.title, url);
		}

		replaceRoot.hide();
		replaceRoot.html(reply.content);
		replaceRoot.show();

		if(typeof(success) === "function")
			success();
	});
}

function joinGame(matchID) {
	gameMetaData = {
		"matchID": getMatchID(matchID),
		// TODO
		//"userInfo": {
		//	"username": "User"
		//}
	};

	wsClient.joinGame(gameMetaData);
}

function setupMatchClick() {
	$(".match").click(function() {
		// prevents this function from getting called on consecutive clicks
		// TODO: in the future, fade out the whole page and show a loading animation instead.
		$(".match").off("click");
		wsClient.unsubscrGameListUpdates("mikelepage", ["openRandomGames", "runningPublicGames"]);
		joinGame($(this).data("id"));
	});
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

	if(window.location.pathname == "/") {
		wsClient = new CyvasseWSClient(window.location.hostname, function() {
			wsClient.subscrGameListUpdates("mikelepage", ["openRandomGames", "runningPublicGames"]);
		});

		$("[name='play-as']").click(function() {
			$("#create-game-button").attr("disabled", false);
		});

		$("#create-game-button").click(function() {
			gameMetaData = {
				"ruleSet": "mikelepage", // hardcoded for now
				"color":   $("input:radio[name='play-as']:checked").val(),
				"random":  $("#opt-random").prop("checked"),
				"public":  $("#opt-public").prop("checked"),
				"extraRules": [ ],
				"userInfo": {
					"registered": false, // not implemented yet
					"username": "User" // TODO
				}
			};

			$("#create-game input").attr("disabled", true);
			$("#create-game button").attr("disabled", true);
			$("#create-game-button").html("Creating game<span class='ani-loading-dot'>.</span>");

			//if(wsClient.websock.readyState != 1)
			//	TODO: Error message

			wsClient.unsubscrGameListUpdates("mikelepage", ["openRandomGames", "runningPublicGames"]);
			wsClient.createGame(gameMetaData);
		});
	} else if(window.location.pathname.substr(0, 7) == "/match/") {
		wsClient = new CyvasseWSClient(window.location.hostname, function() {
			joinGame(getMatchID(window.location.href));
		});
	}

	var externalSitesCheckbox = $("#external-sites-dd");

	$(document).click(function() {
		// deactivate external sites dropdown if it's active
		externalSitesCheckbox.prop("checked", false);
	});

	$(".external-sites-icons-v").click(function(ev) {
		// without this the external-sites-dd checkbox would
		// deactive itself through the above click handler
		ev.stopPropagation();
	});
});
