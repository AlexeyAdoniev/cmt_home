import { faker } from '@faker-js/faker';

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

let bigData = [];

for (let i = 0; i < 200; i++) {
	const item = {
		id: String(i + 1),
		1: faker.person.fullName(),
		2: faker.number.int({ min: 1985, max: 2014 }),
		3: faker.datatype.boolean(),
		4: {
			selected: faker.number.int({ min: 0, max: 2 }),
			options: ['Single', 'Married', 'Divorsed'],
		},
		5: faker.color.human(),
		6: faker.number.int({ min: 165, max: 202 }),
	};
	bigData.push(item);
}

export default { columns, data: bigData };
