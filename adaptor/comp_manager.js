/**
 * Module dependencies
 */
module.exports = (function(){
	return new comp_manager();
})();

function comp_manager(){
	this.comps = {};
}

comp_manager.prototype.init = function(opts){
	component_lego = opts["components"];

	for(var key in component_lego){
		this.set(key, require(".." + component_lego[key]));
	}
}

comp_manager.prototype.get = function(key){
	return this.comps[key];
}

comp_manager.prototype.set = function(key, comp){
	this.comps[key] = comp;
}
