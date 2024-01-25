
/* eslint-disable react/prop-types */

import { useRef, useState } from "react";
import { Checkbox, Select, InputNumber, Input } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'
import { updateRow, extractValue } from "../utils";

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


export const Row = ({ table, setTable, row, groupKey, shownColumns }) => {


	const [updateCell, setUpdateCell] = useState('');
	let inputValue = useRef()

	const preserveTable = (rowId, columnId, type) => {
		const extracter = extractValue[type];
		if (!extracter) return;
		const value = extractValue[type](inputValue);
		const idxToEdit = table.data.findIndex(item => item.id === rowId);
		const newRow = {
			...table.data[idxToEdit],
			[columnId]: value
		};
		const updated = {
			...table,
			data: [
				...table.data.slice(0, idxToEdit),
				newRow,
				...table.data.slice(idxToEdit + 1),
			]
		}

		setTable(updated)
		updateRow(newRow)

	}

	//render updateable
	const renderUpdate = (id, row, columnId, type) => {

		const value = row[columnId];

		switch (type) {
			case "boolean":
				return <Checkbox defaultChecked={value} ref={(node) => {
					inputValue = node
				}} />
			case "object": {

				if (typeof value.selected === 'undefined' || !Array.isArray(value.options)) {
					return 'Wrong data format'
				}
				const options = value.options.map(value => ({
					value,
					label: value
				}))

				const seleted = options[value.selected].label;

				return <Select value={seleted} className='table-select' options={options} onChange={(e) => {
					const idxToEdit = table.data.findIndex(item => item.id === id);
					const updatedItem = {
						...table.data[idxToEdit],
						[columnId]: {
							...table.data[idxToEdit][columnId],
							selected: table.data[idxToEdit][columnId].options.findIndex(i => i === e)
						}
					};
					const updated = {
						...table,
						data: [
							...table.data.slice(0, idxToEdit),
							updatedItem,
							...table.data.slice(idxToEdit + 1),
						]
					}
					setTable(updated);
					updateRow(updatedItem)
				}} />
			}
			case "number": {
				return <InputNumber defaultValue={value} min={0} ref={(node) => {
					inputValue = node
				}} />
			}

			default:
				return <Input className='text-input' defaultValue={value} ref={(node) => {
					inputValue = node
				}} />
		}

	}



	const cells = table.columns.map(({ id: columnId, width, type }) => {
		const cellId = `${row.id}-${columnId}`;
		const hidden = !shownColumns.includes(columnId);
		const update = updateCell === cellId;
		return <td width={width} className={`table-cell ${hidden ? 'hidden' : ''}`} key={`cell-${cellId}`}>
			{update ? renderUpdate(row.id, row, columnId, type) : renderIdle(row[columnId])}
			{!groupKey && (update ? <SaveOutlined onClick={() => {
				setUpdateCell('')
				preserveTable(row.id, columnId, type);
			}} /> : <EditOutlined onClick={() => setUpdateCell(cellId)} />)}
		</td>
	})

	return <tr >
		{cells}
	</tr>
}
