export function Combine(target, fns = []) {

	// copy super class prototype
	let protoCopy = Object.assign(target.prototype);

	// copy additional, non-present properties onto super class prototype
	let extendedProto = (Array.isArray(fns) ? fns : [fns]).reduce((proto, fn) => {
		Object.getOwnPropertyNames(fn.prototype).forEach(prop => {
			if(!(protoCopy.hasOwnProperty(prop))) {
				proto[prop] = fn.prototype[prop];
			}
		});
		return proto; 
	}, protoCopy);

	// assign extended prototype to superclass
	target.prototype = Object.assign(extendedProto);
	return target;

}