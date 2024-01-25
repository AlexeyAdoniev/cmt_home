export const isNumeric = (num) =>
	(typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
	!isNaN(num);

export function debounce(callback, delay) {
	let timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}
