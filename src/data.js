import { faker } from '@faker-js/faker';
import { GENERATE_ROWS } from './config';

const columns = [
	{
		id: '1',
		ordinalNo: 1,
		title: 'Name',
		type: 'string',
		width: 150,
		disableGroup: true,
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

let bigData = [];

for (let i = 0; i < GENERATE_ROWS; i++) {
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

//Optimizations:

//0. When you group by specific column use prep a set of unique values of this column. what is happening is for every set item itters over whole data set and filters it.
// Much more efficient is to prepare those data chunks by itteration one time and creatung N arrays where N is the size of set.
//1. Make 'selector' options a column property, not a data property.
//2. Optimize search be defining searching input type, and filtering only in mathcing columns
//3. If edited valude are the same as previus just do not do array cloning

//Design

// Column header should be sticky and shown at any scroll position
