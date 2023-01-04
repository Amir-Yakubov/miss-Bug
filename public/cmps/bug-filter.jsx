const { useState, useEffect } = React

import { bugService } from "../services/bug.service.js"
import { Pagination } from './pagination.jsx'
import { LabelSelector } from './label-select.jsx'

export function BugFilter({ onSetFilter, onSetSort, maxPages }) {
    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
    const [sortByToEdit, setSortByToEdit] = useState(bugService.getDefaultSort())

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        onSetSort(sortByToEdit)
    }, [sortByToEdit])


    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handleSortChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'checkbox' ? (target.checked ? -1 : 1) : value
        setSortByToEdit((prevSort) => ({ ...prevSort, [field]: value }))
    }

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value
        // value = type === 'checkbox' ? (target.checked ? -1 : 1) : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onLabelChange(selectedLabels) {
        setFilterByToEdit((prevFilter) => ({
            ...prevFilter,
            labels: selectedLabels,
        }))
    }

    function handlePageChange(number) {
        if (
            filterByToEdit.pageIdx + number < 0 ||
            filterByToEdit.pageIdx + number > maxPages - 1
        )
            return
        setFilterByToEdit((prevFilter) => ({
            ...prevFilter,
            pageIdx: prevFilter.pageIdx + number,
        }))
    }

    return <section className="bug-filter full main-layout">

        <h2>Filter bugs</h2>

        <form onSubmit={onSubmitFilter}>
            <label htmlFor="title">title:</label>
            <input type="text"
                id="title"
                name="title"
                placeholder="By title"
                value={filterByToEdit.title}
                onChange={handleChange}
            />

            <label htmlFor='minSeverity'>Min Severity:</label>
            <input
                type='number'
                id='minSeverity'
                name='minSeverity'
                placeholder='By min severity'
                value={filterByToEdit.minSeverity}
                onChange={handleChange}
            />
            <br></br>
            <select
                name='sortByCat'
                value={sortByToEdit.sortByCat}
                onChange={handleSortChange}
            >
                <option value=''>Select Sorting</option>
                <option value='title'>Title</option>
                <option value='severity'>Severity</option>
                <option value='createdAt'>CreatedAt</option>
            </select>
            <label htmlFor='desc'>Descending:</label>
            <input
                name='desc'
                id='desc'
                type='checkbox'
                value={sortByToEdit.desc}
                onChange={handleSortChange}
            />
            <LabelSelector
                labels={[
                    'critical',
                    'need-CR',
                    'dev-branch',
                    'high',
                ]}
                onLabelChange={onLabelChange}
            />

            <Pagination
                currentPage={filterByToEdit.pageIdx}
                handlePageChange={handlePageChange}
            />


        </form>
    </section>
}