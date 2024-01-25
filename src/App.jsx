/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useLayoutEffect, memo, useMemo, cloneElement } from 'react';
import { Checkbox, Select, InputNumber, Input, Flex, Button } from 'antd'
import { EditOutlined, SaveOutlined, GroupOutlined, UngroupOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import './App.css';


import tableData from './data.js'
import { EMPTY_TABLE, COLUMN_HEIGHT, GROUP_HEADER_HEIGHT } from './config.js';

import { debounce, extractValue, fetchTable, updateRow } from './utils.js';



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



	const [table, setTable] = useState(tableData);

	const { columns, data } = table

	const [shownColumns, setShownColumns] = useState(columns.map(({ id }) => id));
	const [filtred, setFiltred] = useState(undefined);
	const [searchInput, setSearch] = useState('');
	const [groups, setGroups] = useState({})
	const [show, setShow] = useState(false);


	useEffect(() => {
		const tma = setTimeout(() => {
			// preserve(tableData.data)
			// setShow
			fetchTable(tableData.data).then(preserved => {
				setTable({ ...table, data: preserved });
				setShow(true)
			})
		}, 100)
		return () => {
			clearTimeout(tma)
		}
	}, [])




	useEffect(() => {
		if (searchInput === '') {
			return void setFiltred(undefined)
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


		setFiltred({ ...table, data: filtred })
		//setShownRows(filtred.map(({ id }) => id));

	}, [searchInput, data])





	return (
		<>
			<Flex className="select-wrapper" >
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
				<Input value={searchInput} onChange={e => setSearch(e.target.value)} />

			</Flex>

			{show && <Table tableData={filtred || table} shownColumns={shownColumns} groups={groups} setGroups={setGroups}>
				<TableHeader columns={columns} shownColumns={shownColumns} groups={groups} setGroups={setGroups} />
			</Table>}

		</>
	);
}

const Table = ({
	children,
	tableData,
	shownColumns,
	groupKey = undefined,
	groups = {},
	setGroups
}) => {


	const [table, setTable] = useState(EMPTY_TABLE);

	const [updateCell, setUpdateCell] = useState('');
	const [scrollY, setScrollY] = useState(window.scrollY);
	const { columns, data } = table


	const TABLE_BASE = useRef();


	useEffect(() => {


		const scrollHandler = () => {
			debounce(() => {
				setScrollY(window.scrollY)
			}, 50)()
		}

		window.addEventListener("scroll", scrollHandler)


		const container = document.querySelector(`.table-container${groupKey ? `-${groupKey}` : ''}`);
		container.style.height = `${tableData.data.length * COLUMN_HEIGHT + (groupKey ? GROUP_HEADER_HEIGHT : 0)}px`
		const header = container.querySelector('table > thead')?.getBoundingClientRect();

		TABLE_BASE.current = header.y + header.height + window.scrollY;

		setTable(() => {
			return tableData;
		})


		return () => {
			console.log('unmount');
			window.removeEventListener("scroll", scrollHandler)
		}
	}, [tableData.data.length])




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

	let inputValue = useRef('')



	const preserveTable = (rowId, columnId, type) => {

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
		console.log(rowId, newRow);
		updateRow(rowId, newRow)

	}

	//render updateable
	const renderUpdate = (id, row, columnId) => {

		const value = row[columnId];

		switch (typeof value) {
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

				return <Select value={seleted} style={{ width: 100 }} options={options} />
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


	const Row = ({ row }) => {

		const cells = table.columns.map(({ id: columnId, width, type }) => {
			const cellId = `${row.id}-${columnId}`;
			const hidden = !shownColumns.includes(columnId);
			const update = updateCell === cellId;
			return <td width={width} className={`table-cell ${hidden ? 'hidden' : ''}`} key={`cell-${cellId}`}>
				{update ? renderUpdate(row.id, row, columnId) : renderIdle(row[columnId])}
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



	const renderRows = () => {


		// Group mode recursive call
		if (groups.column) {
			const groupKeys = Array.from(new Set(data.map(row => row[groups.column])));

			return groupKeys.map((key, groupIndex) => {
				const childTableIndex = groupIndex + 1;
				const groupData = table.data.filter(row => row[groups.column] === key);
				const collapsed = groups.hidden === childTableIndex;

				const GroupHeader = () => {


					return <thead className='group-header'>
						<tr>

							{
								columns.map(({ id, width }, i) => <th
									key={`Table-group-header-${childTableIndex}-${i}`}

									width={width}
								>

									<div>{id === '1' ? `${groupData.length}/${data.length}` : ''}</div>
									{id === groups.column && groups.column !== '1' ? <div className='group-key-wrapper'>{key}
										{
											collapsed ? <CaretDownOutlined onClick={() => {
												setGroups({
													column: id,
													hidden: undefined
												});

											}} /> : <CaretUpOutlined onClick={() => {
												setGroups({
													column: id,
													hidden: childTableIndex
												});

											}} />


										}


									</div> : ''}

								</th>
								)
							}

						</tr>
					</thead>
				}





				return <tr key={`group-${childTableIndex}`}>
					<td colSpan={columns.length}>
						{<Table tableData={{ columns, data: collapsed ? [] : groupData }} shownColumns={shownColumns}
							groupKey={childTableIndex} setGroups={setGroups} >
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
		{children}
		{/* {cloneElement(children, { setColl, collapse })} */}
		<tbody>
			{renderRows()}
		</tbody>
	</table></div>

}

export default App;

// 1. in table tag should be just 2 components
// 2. refactor and optimize serach function