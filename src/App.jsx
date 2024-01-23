/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Checkbox, Select, InputNumber, Input } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'
import './App.css';

import { isNumeric } from './utils';


function TableHeader({ col, shownColumns }) {


	const hidden = !shownColumns.includes(col.id);

	return <th
		className={`table-header ${hidden ? 'hidden' : ''}`}

	>
		{col.title}
	</th>
}

function App({ tableData }) {

	const { columns, data } = tableData

	const sorted = columns.sort((a, b) => a.ordinalNo - b.ordinalNo);

	const [table, setTable] = useState({
		columns: sorted,
		data
	})


	const [updateCell, setUpdateCell] = useState('');
	const [shownColumns, setShownColumns] = useState(table.columns.map(({ id }) => id));
	const DEFAULT_SHOWN_ROWS = table.data.map(({ id }) => id);
	const [shownRows, setShownRows] = useState(DEFAULT_SHOWN_ROWS);
	const [searchInput, setSearch] = useState('');


	const renderHeaders = () =>

		table.columns.map((col, i) => (
			<TableHeader key={`header-${i}`}
				col={col}
				shownColumns={shownColumns} />
		));

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

	//render updateable
	const renderUpdate = (id, row, columnId, setTable) => {

		const value = row[columnId];

		const handleEdit = (updated) => {

			const idxToEdit = table.data.findIndex(item => item.id === id);

			setTable({
				...table,
				data: [
					...table.data.slice(0, idxToEdit),
					{
						...table.data[idxToEdit],
						[columnId]: updated
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


	const renderRows = () => {
		return table.data.map((row, rowIndex) => {

			const cells = table.columns.map(({ id: columnId }) => {
				const cellId = `${rowIndex}-${columnId}`;
				const hidden = !shownColumns.includes(columnId);
				const update = updateCell === cellId;
				return <td className={`${hidden ? 'hidden' : ''}`} key={`cell-${cellId}`}>
					{update ? renderUpdate(row.id, row, columnId, setTable) : renderIdle(row[columnId])}
					{update ? <SaveOutlined onClick={() => setUpdateCell('')} /> : <EditOutlined onClick={() => setUpdateCell(cellId)} />}
				</td>
			})



			return <tr key={`row-${rowIndex}`}>
				{shownRows.includes(row.id) ? cells : []}
			</tr>



		})
	}


	useEffect(() => {
		if (searchInput === '') {
			return void setShownRows(DEFAULT_SHOWN_ROWS);
		}

		//const numeric = isNumeric(searchInput);

		const filtred = table.data.filter(row => {
			let found = false;
			Object.entries(row).forEach(([key, value]) => {
				if (key !== 'id' && typeof value === 'string') {
					const reg = new RegExp(searchInput, 'gi')
					if (value.match(reg)) {
						found = true;
					}
				}
			})

			return found
		})

		setShownRows(filtred.map(({ id }) => id));

	}, [searchInput, table])


	return (
		<>
			<Select
				mode="multiple"
				allowClear
				style={{ width: '100%' }}
				placeholder="Please select shown fields"
				value={shownColumns}
				onChange={(e) => {
					setShownColumns(e)
				}}
				options={table.columns.map(column => ({
					label: column.title,
					value: column.id
				}))}
			/>
			<Input value={searchInput} onChange={e => setSearch(e.target.value)} />
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

// 1. in table tag should be just 2 components
// 2. refactor and optimize serach function