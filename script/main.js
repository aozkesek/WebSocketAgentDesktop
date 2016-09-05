/* 
 * 
 * WebSocket Agent
 * 
 * Developer: Ahmet OZKESEK
 * e-mail: aozkesek@gmail.com
 * 
 */

"use strict";

var WSAGENT = WSAGENT||{};

WSAGENT.Events = {
	Connected: "Connected",
	Disconnected: "Disconnected",
	Loggedin: "Loggedin",
	Loggedout: "Loggedout",
	Ringing: "Ringing",
	Answered: "Answered",
	Hangup: "Hangup",
	Error: "Error"
};

WSAGENT.States = {
	Unknown: "Unknown",
	Connected: "Connected",
	Disconnected: "Disconnected",
	Loggedin: "Loggedin",
	Loggedout: "Loggedout",
	Ringing: "Ringing",
	Hangup: "Hangup",
	Answered: "Answered"
	
};


	
WSAGENT.AgentDesktop = {

	_J_LOGIN: {AgentAuth: "", AgentDN: ""},
	_J_LOGOUT: {AgentId: "", AgentDN: ""},
	_J_REGISTER_EVENTS: {AgentId: "", AgentDN: "", Events: [""]},
	
	_options: {
		Debug: false,
		Url: "",
		AgentAuth: "",//		Authorization: Basic atob("username:password")
		AgentDN: ""
		
	},

	_listeners: [],
	_webSocket: null,
	_state: WSAGENT.States.Unknown,
	
	_debug: function(e) {
		if (this._options.Debug)
			console.log(e);
	},

	_assert: function(b,m) {
		if (b)
			throw "Assertion failed: " + m;  
	},
	
	_unbindws: function() {
		this._webSocket.onclose = undefined;
		this._webSocket.onerror = undefined;
		this._webSocket.onmessage = undefined;
		this._webSocket.onopen = undefined;
	},
	
	_bindws: function() {
		var _this = this;
	
		this._webSocket.onclose = function(event){ _this._onClose(event); };
		this._webSocket.onerror = function(event){ _this._onError(event); };
		this._webSocket.onmessage = function(event){ _this._onMessage(event); };
		this._webSocket.onopen = function(event){ _this._onOpen(event); };
	},
	
	_fireEventCallback: function(eventName, event) {
	
		this._debug(event);
		
		this._listeners
				  .filter(function(l){
						return l.event === eventName; 
					}).forEach(function(listener) { 
						listener.callback(event); 
					});
		
	},
	
	_onClose: function(event) {
		this._state = WSAGENT.States.Disconnected;
		this._unbindws();
		this._fireEventCallback(WSAGENT.Events.Disconnected, event);
	},
	
	_onError: function(event) {
		this._fireEventCallback(WSAGENT.Events.Error, event);
	},
	
	_onMessage: function(event) {
		this._debug(event);
		//
		if (event.data !== undefined) {
			var _data = JSON.parse(event.data);
			//{responseType: "", responseCode: 0, responseMessage: "", responseData: { ... }}
			if (_data.responseType !== undefined) {
				
				switch(_data.responseType) {
				case WSAGENT.Events.Loggedin:
					this._state = WSAGENT.States.Loggedin;
					break;
				case WSAGENT.Events.Loggedout:
					this._state = WSAGENT.States.Loggedout;
					break;
				case WSAGENT.Events.Ringing:
					this._state = WSAGENT.States.Ringing;
					break;
				case WSAGENT.Events.Hangup:
					this._state = WSAGENT.States.Hangup;
					break;
				case WSAGENT.Events.Answered:
					this._state = WSAGENT.States.Answered;
					break;
					
					
				}
				
				this._fireEventCallback(_data.responseType, _data);
			}
		}
		
	},
	
	_onOpen: function(event) {
		this._state = WSAGENT.States.Connected;
		this._fireEventCallback(WSAGENT.Events.Connected, event);
	},
	
	/*
	 * public methods
	 */
		
		getOption: function(option) {
			if (option === undefined || option === null)
				return this._options;

			if (this._options.hasOwnProperty(option))
				return this._options[option];
		},

		setOption: function(option, value) {

			if (value === undefined) {
				this._options = option;
			}
			else if (this._options.hasOwnProperty(option)) {
				this._options[option] = value;
			}

		},

		addListener: function(event, callback) {
			if (!WSAGENT.Events.hasOwnProperty(event))
				throw "Unknown event!  Enter a valid event name or use WSAGENT.Events attributes.";

			this.removeListener(event);
			this._listeners.push({event: event, callback: callback});

			this._debug(this._listeners);

		},

		removeListener: function(event) {
			this._listeners.filter(
					  function(e) {
						  return e.event === event;
					  }).pop();

			this._debug(this._listeners);

		},

		connect: function() {
			this._assert(this._options.Url === undefined || this._options.Url === null, "Url is null.");
			this._assert(this._options.AgentAuth === undefined || this._options.AgentAuth === null, "AgentAuth is null.");

			this._webSocket = new WebSocket(this._options.Url);
			this._bindws();

		},

		disconnect: function() {
			
			this._webSocket.close();
		},

		login: function() {

			this._J_LOGIN.AgentAuth = this._options.AgentAuth;
			this._J_LOGIN.AgentDN = this._options.AgentDN;
			
			this._webSocket.send(JSON.stringify({
				requestType: "LOGIN", 
				requestData: this._J_LOGIN
			}));

		},

		logout: function() {

			this._assert(this._state, "You are not logged in.");

			this._J_LOGOUT.AgentDN = this._options.AgentDN;
			this._J_LOGOUT.AgentId = atob(this._options.AgentAuth).split(":")[0];
			
			this._webSocket.send(JSON.stringify({
				requestType: "LOGOUT", 
				requestData: this._J_LOGOUT
			}));

		},
		
		registerEvent: function(events) {
			
			
		}
	

};
