/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useLayoutEffect, memo, useMemo, cloneElement } from 'react';
import { Checkbox, Select, InputNumber, Input, Flex } from 'antd'
import { EditOutlined, SaveOutlined, GroupOutlined, UngroupOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import './App.css';


import tableData from './data.js'
import { EMPTY_TABLE, COLUMN_HEIGHT, GROUP_HEADER_HEIGHT } from './config.js';

import { debounce } from './utils.js';
import { tr } from '@faker-js/faker';


//import { isNumeric } from './utils';




const TableHeader = ({ columns, shownColumns, groups, setGroups }) => <thead>
	<tr>
		{
			columns.map(({ id, title, width }, i) => {

				const hidden = !shownColumns.includes(id);

				const groupHandler = () => setGroups({ column: id })
				const ungroupHandler = () => setGroups({})

				return <th
					key={`Table-header-${i}`}
					width={width}
					className={`table-header ${hidden ? 'hidden' : ''}`}

				>
					{title}
					{groups.column === id ?

						<UngroupOutlined onClick={ungroupHandler} />
						: <GroupOutlined onClick={groupHandler} />}

				</th>
			})
		}
	</tr>
</thead>



function App() {

	tableData.columns = tableData.columns.sort((a, b) => a.ordinalNo - b.ordinalNo);
	const { columns, data } = tableData

	const [shownColumns, setShownColumns] = useState(columns.map(({ id }) => id));
	const DEFAULT_SHOWN_ROWS = data.map(({ id }) => id);
	const [shownRows, setShownRows] = useState(DEFAULT_SHOWN_ROWS);
	const [searchInput, setSearch] = useState('');
	const [groups, setGroups] = useState({})
	//const [container, setContainer] = useState(false)






	useEffect(() => {
		if (searchInput === '') {
			return void setShownRows(DEFAULT_SHOWN_ROWS);
		}

		//const numeric = isNumeric(searchInput);

		const filtred = data.filter(row => {
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

	}, [searchInput, data])


	return (
		<>
			{/* <Flex className="select-wrapper" >
				<span>Show fields</span>
				<Select
					mode="multiple"
					allowClear
					disabled={Boolean(groups.column)}
					style={{ minWidth: '200px' }}
					placeholder="Please select shown fields"
					value={shownColumns}
					onChange={(e) => {
						setShownColumns(e)
					}}
					options={columns.map(column => ({
						label: column.title,
						value: column.id
					}))}
				/>
			</Flex>
			<Flex className="search-wrapper" >
				<span>Search</span>
				<Input value={searchInput} onChange={e => setSearch(e.target.value)} />
			</Flex> */}

			<Table tableData={tableData} shownColumns={shownColumns} shownRows={shownRows} groups={groups}>
				<TableHeader columns={columns} shownColumns={shownColumns} groups={groups} setGroups={setGroups} />
			</Table>

		</>
	);
}

const Table = ({
	children,
	tableData,
	shownColumns,
	shownRows,
	groupKey = undefined,
	groups = {},
}) => {


	const [table, setTable] = useState(EMPTY_TABLE);
	const [updateCell, setUpdateCell] = useState('');
	const [scrollY, setScrollY] = useState(window.scrollY);
	const [collapse, setColl] = useState(false);

	const { columns, data } = table


	const TABLE_BASE = useRef();



	//const collapsedGroup = typeof collapse !== 'undefined' && collapse === groupKey;

	useEffect(() => {

		const scrollHandler = () => {
			debounce(() => {
				setScrollY(window.scrollY)
			}, 50)()
		}
		window.addEventListener("scroll", scrollHandler)


		setTable(() => {
			let data = tableData.data;
			if (collapse) {
				data = [];
			}
			const container = document.querySelector(`.table-container${groupKey ? `-${groupKey}` : ''}`);
			container.style.height = `${data.length * COLUMN_HEIGHT + (groupKey ? GROUP_HEADER_HEIGHT : 0)}px`
			const header = container.querySelector('table > thead')?.getBoundingClientRect();
			TABLE_BASE.current = header.y + header.height;
			return { ...tableData, data };
		})

		return () => {
			console.log('unmount');
			window.removeEventListener("scroll", scrollHandler)
		}
	}, [collapse])



	// const toggleGroupShow = (group) => {

	// }

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
	const renderUpdate = (id, row, columnId) => {

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
				return <Input className='text-input' value={value} onChange={(e) => handleEdit(e.target.value)} />
		}

	}


	const Row = ({ row }) => {

		const cells = table.columns.map(({ id: columnId, width }) => {
			const cellId = `${row.id}-${columnId}`;
			const hidden = !shownColumns.includes(columnId);
			const update = updateCell === cellId;
			return <td width={width} className={`table-cell ${hidden ? 'hidden' : ''}`} key={`cell-${cellId}`}>
				{update ? renderUpdate(row.id, row, columnId) : renderIdle(row[columnId])}
				{!groupKey && (update ? <SaveOutlined onClick={() => setUpdateCell('')} /> : <EditOutlined onClick={() => setUpdateCell(cellId)} />)}
			</td>
		})
		//ref={el => rowRefs.current[rowIndex] = el}
		return <tr >
			{shownRows.includes(row.id) ? cells : []}
		</tr>
	}


	//console.log(table.data[0], table.data.at(-1));
	const renderRows = () => {

		// Group mode recursive call
		if (groups.column) {
			const groupKeys = Array.from(new Set(data.map(row => row[groups.column])));

			return groupKeys.map((key, groupIndex) => {

				const groupData = table.data.filter(row => row[groups.column] === key);

				const GroupHeader = ({ collapse, setColl }) => {


					return <thead className='group-header'>
						<tr>

							{
								columns.map(({ id, width }, i) => <th
									key={`Table-group-header-${groupIndex}-${i}`}

									width={width}
								>

									<div>{id === '1' ? `${groupData.length}/${data.length}` : ''}</div>
									{id === groups.column && groups.column !== '1' ? <div className='group-key-wrapper'>{key}
										{collapse ? <CaretDownOutlined onClick={() => {
											setColl(false);
										}} /> : <CaretUpOutlined onClick={() => {
											setColl(true);

										}} />}
									</div> : ''}

								</th>
								)
							}

						</tr>
					</thead>
				}





				return <tr key={`group-${groupIndex}`}>
					<td colSpan={columns.length}>
						{<Table tableData={{ columns, data: groupData }} shownColumns={shownColumns} shownRows={shownRows} groupKey={groupIndex + 1} >
							<GroupHeader />
						</Table>}
					</td>
				</tr>
			})
		}



		return table.data.map((row, rowIndex) => {


			const rowYOffset = rowIndex * COLUMN_HEIGHT + TABLE_BASE.current;
			const topOutOfBonds = rowYOffset < scrollY;
			const botOutOfBodnds = rowYOffset > scrollY + window.innerHeight + 10;
			const outOfBounds = botOutOfBodnds || topOutOfBonds;
			if (!outOfBounds) return <Row key={`row-${row.id}`} row={row} />;
			if (topOutOfBonds) {
				return <tr key={`row-${row.id}`}><td></td></tr>
			} else {
				return ''
			}



		})
	}




	return <div className={`table-container${groupKey ? `-${groupKey}` : ''}`}><table >
		{cloneElement(children, { setColl, collapse })}
		<tbody>
			{table.data.length > 0 && renderRows()}
		</tbody>
	</table></div>

}

export default App;

// 1. in table tag should be just 2 components
// 2. refactor and optimize serach function