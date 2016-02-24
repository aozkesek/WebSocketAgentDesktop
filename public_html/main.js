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

var NETASAD = NETASAD||{};

NETASAD.Events = [
	"Ringing",
	"Answered",
	"Hangup"
];

NETASAD.options = {
	HostName: "",
	AgentLoginId: "",
	AgentAlternateDN: "",
	Debug: false
};

NETASAD.listeners = {
	
	_listener: [],
	
	_debug: function(e) {
		if (NETASAD.options.Debug)
			console.log(e);
	},
	
	addListener: function(event, callback) {
		if (!NETASAD.Events.includes(event))
			throw "Unknown event name!  Enter a valid event name.";
		
		this.removeListener(event);
		this._listener.push({event: event, callback: callback});
		
		this._debug(this._listener);
		
	},
	
	removeListener: function(event) {
		this._listener.filter(
				  function(e) {
					  return e.event === event;
				  }).pop();
		
		this._debug(this._listener);
		
	},
	
	getListener: function(event) {
		return this._listener.filter(
				  function(e) {
					  return e.event === event;
				  }).callback;
	}
};

