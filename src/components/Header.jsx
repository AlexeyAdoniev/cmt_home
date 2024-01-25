/* eslint-disable react/prop-types */

import { GroupOutlined, UngroupOutlined } from '@ant-design/icons'

export const TableHeader = ({ columns, shownColumns, groups, setGroups }) => <thead>
    <tr>
        {
            columns.map(({ id, title, width, disableGroup }, i) => {

                const hidden = !shownColumns.includes(id);

                const groupHandler = () => setGroups({ column: id, hidden: [] })
                const ungroupHandler = () => setGroups({})



                return <th
                    key={`Table-header-${i}`}
                    width={width}
                    className={`table-header ${hidden ? 'hidden' : ''}`}

                >
                    {title}
                    {disableGroup ? '' : groups.column === id ?

                        <UngroupOutlined onClick={ungroupHandler} />
                        : <GroupOutlined onClick={groupHandler} />}

                </th>
            })
        }
    </tr>
</thead>
