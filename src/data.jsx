/* prettier-ignore */
const columns = [
	{
		id: '1',
		ordinalNo: 1,
		title: 'Name',
		type: 'string',
		width: 100,
	},
	{
		id: '2',
		ordinalNo: 2,
		title: 'Birth year',
		type: 'number',
		width: 100,
	},
	{
		id: '3',
		ordinalNo: 3,
		title: 'Checked',
		type: 'boolean',
		width: 100,
	},
	{
		id: '4',
		ordinalNo: 4,
		title: 'Status',
		type: 'Object',
		width: 100,
	},
];

const data = [
	{
		id: '1',
		"1": 'Alex Teisheira',
		"2": 1993,
		"3": false,
		"4": {
			selected: 0,
			options: ['Single', 'Married', 'Divorsed'],
		},
	},
	{
		id: '2',
		"1": 'Ibragim Abema',
		"2": 1987,
		"3": true,
		"4": {
			selected: 1,
			options: ['Single', 'Married', 'Divorsed'],
		},
	},
	{
		id: '3',
		"1": 'Vasko de Gama',
		"2": 1987,
		"3": true,
		"4": {
			selected: 2,
			options: ['Single', 'Married', 'Divorsed'],
		},
	},
];

export default { columns, data };
