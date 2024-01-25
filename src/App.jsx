/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import './App.css';


import tableData from './data.js'
import { EMPTY_TABLE, COLUMN_HEIGHT, GROUP_HEADER_HEIGHT } from './config.js';

import { fetchTable, getGroupData, getGroupKey } from './utils.js';

import { TableHeader } from './components/Header.jsx'
import { Filters } from './components/Filters.jsx';
import { Row } from './components/Row.jsx';

import Virtualizer from './virtualizer.js';

function App() {

	const [table, setTable] = useState(tableData);
	const [shownColumns, setShownColumns] = useState(table.columns.map(({ id }) => id));
	const [filtred, setFiltred] = useState(undefined);
	const [groups, setGroups] = useState({

	})
	const [show, setShow] = useState(false);



	// Fetch data from indexedDB or insert random data
	useEffect(() => {
		const tma = setTimeout(() => {
			fetchTable(tableData.data).then(preserved => {
				setTable({ ...table, data: preserved });
				setShow(true)
			})
		})
		return () => {
			clearTimeout(tma)
		}
	}, [])




	return (
		<>
			<Filters table={table} groups={groups} shownColumns={shownColumns} setShownColumns={setShownColumns} setFiltred={setFiltred} />
			{show && <Table tableData={filtred || table} shownColumns={shownColumns} groups={groups} setGroups={setGroups}>
				<TableHeader columns={table.columns} shownColumns={shownColumns} groups={groups} setGroups={setGroups} />
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
	const [scrollY, setScrollY] = useState(window.scrollY);
	const { columns, data } = table


	const TABLE_BASE = useRef();



	useEffect(() => {

		const virtualizer = Virtualizer.create(tableData.data.length, COLUMN_HEIGHT, groupKey, GROUP_HEADER_HEIGHT)

		const listener = virtualizer.virtalize(TABLE_BASE, setScrollY)

		window.addEventListener("scroll", listener)


		setTable(() => {
			return tableData;
		})


		return () => {

			window.removeEventListener("scroll", listener)
		}

	}, [tableData.data.length])



	const renderRows = () => {

		// Group mode recursive call
		if (groups.column) {
			const groupKeys = getGroupKey(data, groups)

			return groupKeys.map((key, groupIndex) => {
				const childTableIndex = groupIndex + 1;
				const groupData = getGroupData(data, groups, key)
				const collapsed = groups.hidden?.find(item => item.index === childTableIndex);


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
													hidden: [

													]
												});

											}} /> : <CaretUpOutlined onClick={() => {
												setGroups({
													column: id,

													hidden: [...groups.hidden, {
														index: childTableIndex,
														rows: groupData.length
													}]
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
						{<Table tableData={{ columns, data: collapsed ? [] : groupData }} shownColumns={shownColumns} groups={groups.hidden}
							groupKey={childTableIndex} setGroups={setGroups} >
							<GroupHeader />
						</Table>}
					</td>
				</tr>
			})
		}

		return table.data.map((row, rowIndex) => {

			const { outOfBounds, topOutOfBounds } = Virtualizer.outOfBounds(rowIndex, scrollY, COLUMN_HEIGHT, TABLE_BASE, groupKey ? groups : undefined)

			if (!outOfBounds) return <Row key={`row-${row.id}`} table={table} setTable={setTable} row={row} groupKey={groupKey} shownColumns={shownColumns} />;
			if (topOutOfBounds) {
				return <tr key={`row-${row.id}`}><td></td></tr>
			} else {
				return ''
			}

		})
	}




	return <div className={`table-container${groupKey ? `-${groupKey}` : ''}`}><table >
		{children}

		<tbody>
			{renderRows()}
		</tbody>
	</table></div>

}

export default App;

// 1. in table tag should be just 2 components
// 2. refactor and optimize serach function