/* 
 * NETAS - TGE36 
 * 
 * 
 * WebSocket Client for NETAS-JTAPI Server
 * 
 * Developer: Ahmet OZKESEK
 * e-mail: ozkesek@netas.com.tr; aozkesek@gmail.com
 * 
 */

"use strict";

var NETAS = NETAS||{};

NETAS.Events = {
	Connected: "Connected",
	Disconnected: "Disconnected",
	Loggedin: "Loggedin",
	Loggedout: "Loggedout",
	Ringing: "Ringing",
	Answered: "Answered",
	Hangup: "Hangup",
	Error: "Error"
};

NETAS.States = {
	Unknown: "Unknown",
	Connected: "Connected",
	Disconnected: "Disconnected",
	Loggedin: "Loggedin",
	Loggedout: "Loggedout"
};


	
NETAS.AgentDesktop = {

	_J_LOGIN: {},
	_J_LOGOUT: {},
	_J_REGISTER_EVENT: {},
	
	_options: {
		Debug: false,
		Url: "",
//		Authorization: Basic atob("username:password")
		AgentAuth: "",
		AgentDN: ""
		
	},

	_listeners: [],
	_webSocket: null,
	_state: NETAS.States.Unknown,
	
	_debug: function(e) {
		if (this._options.Debug)
			console.log(e);
	},

	_assert: function(b,m) {
		if (b)
			throw "Assertion failed: " + m;  
	},
	
	_bindws: function() {
		var _this = this;
	
		this._webSocket.onclose = function(event){ _this._onClose(event); };
		this._webSocket.onerror = function(event){ _this._onError(event); };
		this._webSocket.onmessage = function(event){ _this._onMessage(event); };
		this._webSocket.onopen = function(event){ _this._onOpen(event); };
	},
	
	_fireEventCallback: function(eventName, event) {
	
		this._listeners
				  .filter(function(l){
						return l.event === eventName; 
					}).forEach(function(listener) { 
						listener.callback(event); 
					});
		
	},
	
	_onClose: function(event) {
		console.log(event);
		
	},
	
	_onError: function(event) {
		console.log(event);
	
	},
	
	_onMessage: function(event) {
		console.log(event);
		
		//
		if (event.data !== undefined) {
			var _data = JSON.parse(event.data);
			if (_data.requestType !== undefined) {
				this._fireEventCallback(_data.requestType, _data);
			}
		}
		
	},
	
	_onOpen: function(event) {
		console.log(event);
		
		this._fireEventCallback(NETAS.Events.Connected, event);
		
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
			if (!NETAS.Events.hasOwnProperty(event))
				throw "Unknown event!  Enter a valid event name or use NETAS.Events attributes.";

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

		getListener: function(event) {
			return this._listeners.filter(
					  function(e) {
						  return e.event === event;
					  }).callback;
		},

		connect: function() {
			this._assert(this._options.Url === undefined || this._options.Url === null, "Url is null.");
			this._assert(this._options.AgentAuth === undefined || this._options.AgentAuth === null, "AgentAuth is null.");

			this._webSocket = new WebSocket(this._options.Url);
			this._bindws();

		},

		disconnect: function() {

		},

		login: function() {

			this._webSocket.send(JSON.stringify({
				requestType: "LOGIN", 
				requestData: { 
					AgentAuth: this._options.AgentAuth 
				}}));

		},

		logout: function() {

			this._assert(!this._isLoggedIn, "You are not logged in.");

			this._webSocket.send(JSON.stringify({
				requestType: "LOGOUT", 
				requestData: { 
					AgentAuth: this._options.AgentAuth 
				}}));

		}
	

};
