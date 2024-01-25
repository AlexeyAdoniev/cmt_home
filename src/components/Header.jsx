/* eslint-disable react/prop-types */

import { GroupOutlined, UngroupOutlined } from '@ant-design/icons'

export const TableHeader = ({ columns, shownColumns, groups, setGroups }) => <thead>
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
