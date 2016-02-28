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

NETAS.Events = [
	"Ringing",
	"Answered",
	"Hangup"
	];
	
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
	
	option: function(option, value) {
		
		if (value === undefined) {
			if (option === undefined || option === null)
				return this._options;

			return this._options.filter(
					  function(o){
						  return o
					  });
			
			
		}
		
		if (option.HostName !== undefined && option.HostName !== null) {
			this._options = option;
			
		}
	},
	
	addListener: function(event, callback) {
		if (!NETAS.Events.includes(event))
			throw "Unknown event name!  Enter a valid event name.";

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
