import { DB_NAME, TABLE_NAME } from './config';

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

export const extractValue = {
	string: (element) => element.input.value,
	number: (element) => Number(element.value),
	boolean: (element) => Boolean(element.input.checked),
};

export const fetchTable = (data) => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 2);

		request.onupgradeneeded = (event) => {
			try {
				const db = event.target.result;

				const objectStore = db.createObjectStore(TABLE_NAME, { keyPath: 'id' });

				objectStore.transaction.oncomplete = () => {
					const customerObjectStore = db
						.transaction(TABLE_NAME, 'readwrite')
						.objectStore(TABLE_NAME);

					data.forEach((customer) => {
						console.log(customer);
						customerObjectStore.add(customer);
					});
				};
			} catch (e) {
				reject(e);
			}
		};

		request.onsuccess = function (event) {
			try {
				const db = event.target.result;

				// Create a transaction on the database
				const transaction = db.transaction([TABLE_NAME], 'readonly');
				const objectStore = transaction.objectStore(TABLE_NAME);
				const allRecords = objectStore.getAll();
				allRecords.onerror = function (err) {
					reject(err);
				};
				allRecords.onsuccess = function () {
					resolve(allRecords.result);
				};
			} catch (e) {
				reject(e);
			}
		};

		request.onerror = function (err) {
			reject(err);
		};
	});
};

export const updateRow = (id, val) => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 2);

		request.onsuccess = function (event) {
			try {
				const db = event.target.result;

				// Create a transaction on the database
				const transaction = db.transaction([TABLE_NAME], 'readwrite');
				const objectStore = transaction.objectStore(TABLE_NAME);
				const allRecords = objectStore.put(val);
				allRecords.onerror = function (err) {
					reject(err);
				};
				allRecords.onsuccess = function () {
					resolve(allRecords.result);
				};
			} catch (e) {
				reject(e);
			}
		};
	});
};
