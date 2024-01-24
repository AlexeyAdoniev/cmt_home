const columns = [
	{
		id: '1',
		ordinalNo: 1,
		title: 'Name',
		type: 'string',
		width: 150,
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
		type: 'object',
		width: 100,
	},
	{
		id: '5',
		ordinalNo: 5,
		title: 'Eye Color',
		type: 'string',
		width: 100,
	},
	{
		id: '6',
		ordinalNo: 6,
		title: 'Height',
		type: 'number',
		width: 100,
	},
];

const data = [
	{
		id: '1',
		1: 'Alex Teisheira ',
		2: 1993,
		3: false,
		4: {
			selected: 0,
			options: ['Single', 'Married', 'Divorsed'],
		},
		5: 'blue',
		6: 178,
	},
	{
		id: '2',
		1: 'Ibragim Abema',
		2: 1987,
		3: true,
		4: {
			selected: 1,
			options: ['Single', 'Married', 'Divorsed'],
		},
		5: 'brown',
		6: 181,
	},
	{
		id: '3',
		1: 'Vasko de Gama',
		2: 1987,
		3: true,
		4: {
			selected: 0,
			options: ['Single', 'Married', 'Divorsed'],
		},
		5: 'blue',
		6: 175,
	},
];

export default { columns, data };
