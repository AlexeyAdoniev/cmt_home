/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Checkbox, Select, InputNumber, Input } from 'antd'
import './App.css';

const columns = [
	{
		id: '1',
		ordinalNo: 1,
		title: 'Name',
		type: 'string',
		width: 100
	},
	{
		id: '2',
		ordinalNo: 2,
		title: 'Birth year',
		type: 'number',
		width: 100
	},
	{
		id: '3',
		ordinalNo: 3,
		title: 'Checked',
		type: 'boolean',
		width: 100
	},
	{
		id: '4',
		ordinalNo: 4,
		title: 'Status',
		type: 'Object',
		width: 100
	}
]


const data = [
	{
		id: '1',
		'1': 'Alex Teisheira',
		'2': 1993,
		'3': false,
		'4': {
			selected: 0,
			options: ['Single', 'Married', 'Divorsed']
		},
	},
	{
		id: '2',
		'1': 'Ibragim Abema',
		'2': 1987,
		'3': true,
		'4': {
			selected: 1,
			options: ['Single', 'Married', 'Divorsed']
		}
	}
];


// const validate = (val, type) => {

// 	switch (type) {

// 		default:
// 			return true;
// 	}
// }



function TableHeader({ col }) {


	return <th
		className={`table-header`}
	>
		{col.title}
	</th>
}

function App() {

	const [table, setTable] = useState({
		columns: columns.sort((a, b) => a.ordinalNo - b.ordinalNo),
		data
	})
	const [editCell, setEditCell] = useState('');

	// useEffect(() => {

	// }, [table])



	//render idle
	const renderIdle = (value) => {

		switch (typeof value) {
			case "object": {
				return value.options[value.selected]
			}
			case 'undefined': {
				return 'N/A'
			}
			default:
				return String(value)
		}
	}

	//render ediatable
	const renderUpdate = (id, row, key, setTable) => {

		const value = row[key];

		const handleEdit = (updated) => {

			const idxToEdit = table.data.findIndex(item => item.id === id);

			setTable({
				...table,
				data: [
					...table.data.slice(0, idxToEdit),
					{
						...table.data[idxToEdit],
						[key]: updated
					},
					...table.data.slice(idxToEdit + 1),
				]
			})


		}


		switch (typeof value) {
			case "boolean":
				return <Checkbox checked={value} onChange={(e) => handleEdit(e.target.checked)} />
			case "object": {

				if (typeof value.selected === 'undefined' || !Array.isArray(value.options)) {
					return 'Wrong data format'
				}
				const options = value.options.map(value => ({
					value,
					label: value
				}))
				const seleted = options[value.selected].label;
				return <Select value={seleted} style={{ width: 100 }} options={options} onChange={(e) => {
					handleEdit({
						selected: value.options.findIndex(option => option === e),
						options: value.options
					})
				}} />
			}
			case "number": {
				return <InputNumber value={value} min={0} onChange={handleEdit} />
			}

			default:
				return <Input value={value} onChange={(e) => handleEdit(e.target.value)} />
		}

	}





	const renderHeaders = () =>

		table.columns.map((col, i) => (
			<TableHeader key={`header-${i}`} col={col} />
		));


	const renderRows = () => {
		return table.data.map((row, rowIndex) => {

			const cells = [];

			for (const column of table.columns) {
				const key = Object.keys(row).find(key => key === column.id);
				const cellId = `${rowIndex}-${key}`;
				const updated = editCell === cellId;
				cells.push(<td onClick={() => setEditCell(cellId)} key={`cell-${cellId}`}>
					{updated ? renderUpdate(row.id, row, key, setTable) : renderIdle(row[key])}

				</td>)
			}

			return <tr key={`row-${rowIndex}`}>
				{cells}
			</tr>



		})
	}

	return (
		<>
			<table>
				<thead>
					<tr>
						{renderHeaders()}
					</tr>
				</thead>
				<tbody>{renderRows()}</tbody>
			</table>
		</>
	);
}

export default App;
