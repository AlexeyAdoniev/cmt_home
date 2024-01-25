/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Select, Input, Flex } from 'antd'


export const Filters = ({ table, groups, shownColumns, setShownColumns, setFiltred }) => {

    const [searchInput, setSearch] = useState('');
    // Filter rows by search input
    useEffect(() => {
        if (searchInput === '') {
            return void setFiltred(undefined)
        }


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

    }, [searchInput, table.data])




    return <>

        <Flex className="select-wrapper" >
            <span>Show Columns</span>
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
                options={table.columns.map(column => ({
                    label: column.title,
                    value: column.id
                }))}
            />
        </Flex>

        <Flex className="search-wrapper" >
            <span>Search</span>
            <Input value={searchInput} onChange={e => setSearch(e.target.value)} />

        </Flex>
    </>
}