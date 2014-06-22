function CyvasseGameClient(websockConn, loadNewPage) {
    if(websockConn instanceof WebSocket === false) {
        throw new TypeError("websockConn has to be a WebSocket instance");
    }
    if(typeof(loadNewPage) !== "function") {
        throw new TypeError("loadNewPage has to be a function");
    }

    this.conn = websockConn;
    this.loadNewPage = loadNewPage;
    this.nextMessageID = 1;
    this.awaitingReply = [];
    this.cachedIngameRequests = [];
    this.gameData = {};

    var self = this;

	this.conn.onmessage = function(msg) {
		self.handleMessage(msg.data);
	};

    this.conn.onclose = function() {
		console.log("The connection to the server was closed.");
	};
}

CyvasseGameClient.prototype.handleMessage = function(msgData) {
    var msgObj = JSON.parse(msgData);

    if(msgObj.messageType === "request") {
    }
    else if(msgObj.messageType === "reply") {
        var answeredRequest;

        for(var request in this.awaitingReply) {
            if(this.awaitingReply[request].messageID == msgObj.messageID) {
                // remove the request from this.awaitingReply
                // and save it to answeredRequests
                answeredRequest = this.awaitingReply.splice(request, 1)[0];
            }
        }
        if(answeredRequest === undefined) {
            throw new Error("Got a reply to an unknown server request!");
        }

        if(answeredRequest.success === false) {
            throw new Error("Got an error message from the server: " + msgObj.error + "\n" +
                "as response to:\n\n" + JSON.stringify(answeredRequest));
        }

        switch(answeredRequest.action) {
            case "create game":
                this.gameData.playerID = msgObj.data.playerID;
                this.loadNewPage("/match/" + msgObj.data.matchID, function() {
                    Module.canvas = document.getElementById("canvas");
                    $.getScript("/cyvasse.js");
                    // TODO: move this to cyvasse-webapp.js
                    $("#emscripten-header").show();
                });
                break;
            case "join game":
                this.gameData.playerID = msgObj.data.playerID;
                this.gameData.color = msgObj.data.color;
                Module.canvas = document.getElementById("canvas");
                $.getScript("/cyvasse.js");
                break;
            default:
                if(this.handleMessageIngame === undefined) {
                    console.log("Got a message for the game before it was loaded, caching.");
                    cachedIngameRequests.push(msgData);
                }
                else {
                    if(typeof(this.handleMessageIngame) !== "function") {
                        throw new TypeError("handleMessageIngame has to be a function");
                    }

                    handleMessageIngame(msgData);
                }
        }
    }
    else {
        throw new Error("Got malformed or incomplete message");
    }
};

CyvasseGameClient.prototype.send = function(msgObj) {
    this.conn.send(JSON.stringify(msgObj));
    this.awaitingReply.push(msgObj);
};

CyvasseGameClient.prototype.sendRequest = function(msgObj) {
    msgObj.messageType = "request";
    msgObj.messageID = this.nextMessageID++;

    this.send(msgObj);
};

CyvasseGameClient.prototype.createGame = function(ruleSet, color) {
    this.sendRequest({
        "action": "create game",
        "param": {
            "ruleSet": ruleSet,
            "color": color
        }
    });
};

CyvasseGameClient.prototype.joinGame = function(matchID) {
    this.sendRequest({
        "action": "join game",
        "param": {
            "matchID": matchID
        }
    });
};
