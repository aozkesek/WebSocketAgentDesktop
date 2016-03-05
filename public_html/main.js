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
	RINGING: "RINGING",
	ANSWERED: "ANSWERED",
	HANGUP: "HANGUP"
};
	
NETAS.AgentDesktop = {
	
	_options: {
		Debug: false,
		HostName: "",
//		Authorization: Basic atob("username:password")
		AgentAuth: ""
		
	},

	_listeners: [],
	
	_debug: function(e) {
		if (this._options.Debug)
			console.log(e);
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
	}

};
