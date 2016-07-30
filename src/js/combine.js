export function Combine(...constructors) {
	let combined = function() {};
	combined.prototype = constructors.reduce(function(proto, constructor) {
       	Object.getOwnPropertyNames(constructor.prototype).forEach(function(key) {
       		if(key !== 'constructor') {
       			proto[key] = constructor.prototype[key];
       		}			
		});
		return proto;
	}, {});	
	return combined;
}