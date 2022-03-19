import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AgGridReact } from "ag-grid-react"
import { getGenderList, getEthnicityList, getRaceList, getPatientList } from "../api/mediData"
import { Button } from "react-bootstrap"
import DetailCellRenderer from "./DetailCellRenderer"

import "ag-grid-enterprise"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

const PatientTable = ({ setFilterModel }) => {
	// responsive table
	const gridRef = useRef()
	const [gridApi, setGridApi] = useState(null)
	const [columnApi, setColumnApi] = useState(null)

	// ag-grid options
	const gridOptions = useMemo(
		() => ({
			masterDetail: true,
			pagination: true,
			rowModelType: "serverSide",
			serverSideStoreType: "partial",
			domLayout: "autoHeight",
			detailRowHeight: 400,
			onFilterChanged: (e) => {
				const filterModel = e.api.getFilterModel()
				setFilterModel(filterModel)
			},
			onRowClicked: (e) => {
				const { id: clickedRowIndex } = e.node
				e.api.forEachNode((row) => {
					if (row.id !== clickedRowIndex) {
						row.setExpanded(false)
					}
				})

				e.api.getDisplayedRowAtIndex(Number(clickedRowIndex)).setExpanded(!e.node.expanded)
			},
		}),
		[setFilterModel]
	)
	const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), [])
	const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), [])
	const [pageSize, setPageSize] = useState(10)
	const [columnDefs] = useState([
		{
			headerName: "환자 id",
			field: "personID",
			sortable: true,
		},
		{
			headerName: "성별",
			field: "gender",
			sortable: true,
			filter: "agSetColumnFilter",
			filterParams: {
				values: (params) => {
					getGenderList().then(({ genderList }) => {
						params.success(genderList)
					})
				},
			},
			valueFormatter: ({ value }) => {
				return value === "M" ? "남" : "여"
			},
		},
		{
			headerName: "생년월일",
			field: "birthDatetime",
			sortable: true,
			valueFormatter: ({ value }) => {
				return value.split(" ")[0]
			},
		},
		{
			headerName: "나이",
			field: "age",
			sortable: false,
			filter: "agNumberColumnFilter",
		},
		{
			headerName: "인종",
			field: "race",
			sortable: true,
			filter: "agSetColumnFilter",
			filterParams: {
				values: (params) => {
					getRaceList().then(({ raceList }) => {
						params.success(raceList)
					})
				},
			},
		},
		{
			headerName: "민족",
			field: "ethnicity",
			sortable: true,
			filter: "agSetColumnFilter",
			filterParams: {
				values: (params) => {
					getEthnicityList().then(({ ethnicityList }) => {
						params.success(ethnicityList)
					})
				},
			},
		},
		{
			headerName: "사망 여부",
			field: "isDeath",
			sortable: true,
			filter: "agSetColumnFilter",
			filterParams: {
				values: ["true", ""],
			},
			valueFormatter: ({ value }) => {
				return value ? "사망" : "해당없음"
			},
		},
	])
	const defaultColDef = useMemo(() => {
		return {
			flex: 1,
			floatingFilter: true,
		}
	}, [])

	// child-row renderer
	const detailCellRenderer = useMemo(() => {
		return DetailCellRenderer
	}, [])

	// ag-grid ready
	const onGridReady = useCallback((params) => {
		setGridApi(params.api)
		setColumnApi(params.columnApi)
	}, [])

	// prepare data source (SSRM)
	useEffect(() => {
		if (gridApi) {
			const dataSource = {
				getRows: (params) => {
					// console.log(JSON.stringify(params.request, null, 1))
					const { endRow, filterModel, sortModel } = params.request

					// pagination
					const page = endRow / pageSize

					// sorting
					const sortOptions = {
						orderColumn: null,
						orderDesc: false,
					}
					if (sortModel.length) {
						const { colId, sort } = sortModel[0]
						const columnInfo = {
							personID: "person_id",
							gender: "gender",
							birthDatetime: "birth",
							race: "race",
							ethnicity: "ethnicity",
							isDeath: "death",
						}
						sortOptions.orderColumn = columnInfo[colId]
						sortOptions.orderDesc = sort === "desc"
					}

					// filtering
					const filterOptions = {
						gender: null,
						race: null,
						ethnicity: null,
						ageMin: null,
						ageMax: null,
						death: null,
					}
					if (Object.keys(filterModel).length > 0) {
						// gender filter
						if ("gender" in filterModel) {
							const {
								gender: { values },
							} = filterModel
							filterOptions.gender = values[0]
						}

						// race filter
						if ("race" in filterModel) {
							const {
								race: { values },
							} = filterModel
							if (values.length > 1) {
								alert("필터는 한 번에 한 항목만 선택할 수 있습니다.")

								const raceFilter = gridApi.getFilterInstance("race")
								raceFilter.setModel(null)
								gridApi.onFilterChanged()
							}
							filterOptions.race = values[0]
						}

						// ethnicity filter
						if ("ethnicity" in filterModel) {
							const {
								ethnicity: { values },
							} = filterModel
							if (values.length > 1) {
								alert("필터는 한 번에 한 항목만 선택할 수 있습니다.")

								const ethnicityFilter = gridApi.getFilterInstance("ethnicity")
								ethnicityFilter.setModel(null)
								gridApi.onFilterChanged()
							}
							filterOptions.ethnicity = values[0]
						}

						// age in-range filter
						if ("age" in filterModel) {
							const {
								age: { type, filter },
							} = filterModel
							const filterTypeWhitelist = ["inRange", "lessThanOrEqual", "greaterThanOrEqual"]

							if ("operator" in filterModel.age) {
								alert("복합 조건은 사용할 수 없습니다.")

								const ageFilter = gridApi.getFilterInstance("age")
								ageFilter.setModel(null)
								gridApi.onFilterChanged()
							}

							if (!filterTypeWhitelist.includes(type)) {
								alert(
									"사용할 수 없는 조건입니다.\n inRange, lessThanOrEqual, greaterThanOrEqual 중 선택해 주세요."
								)

								const ageFilter = gridApi.getFilterInstance("age")
								ageFilter.setModel(null)
								gridApi.onFilterChanged()
							}

							switch (type) {
								case "inRange":
									const {
										age: { filterTo },
									} = filterModel
									filterOptions.ageMin = filter
									filterOptions.ageMax = filterTo
									break
								case "lessThanOrEqual":
									filterOptions.ageMin = filter
									break
								case "greaterThanOrEqual":
									filterOptions.ageMax = filter
									break
								default:
							}
						}

						// death filter
						if ("isDeath" in filterModel) {
							const {
								isDeath: { values },
							} = filterModel
							filterOptions.death = values[0] === "true" ? true : false
						}
					}

					// call api
					getPatientList({
						page,
						length: pageSize,
						orderColumn: sortOptions.orderColumn,
						orderDesc: sortOptions.orderDesc,
						gender: filterOptions.gender,
						race: filterOptions.race,
						ethnicity: filterOptions.ethnicity,
						ageMin: filterOptions.ageMin,
						ageMax: filterOptions.ageMax,
						death: filterOptions.death,
					})
						.then((data) => {
							params.success({
								rowData: data.patient.list,
								rowCount: data.patient.totalLength,
							})
						})
						.catch((err) => {
							console.log(err)
							params.fail()
						})
				},
			}

			gridApi.setServerSideDatasource(dataSource)
		}
	}, [gridApi, pageSize])

	// pre-opend child-row func
	const onFirstDataRendered = useCallback((params) => {
		// arbitrarily expand a row for presentational purposes
		setTimeout(function () {
			gridRef.current.api.getDisplayedRowAtIndex(0).setExpanded(true)
		}, 0)
	}, [])

	// dynamic page length control event
	const onPageSizeChanged = useCallback(
		(e) => {
			setPageSize(e.target.value)
			gridApi.paginationSetPageSize(Number(e.target.value))
		},
		[gridApi]
	)

	// filter & sort reset button
	const resetFilter = useCallback(() => {
		// reset filtering model
		const genderFilter = gridApi.getFilterInstance("gender")
		genderFilter.setModel(null)

		const ageFilter = gridApi.getFilterInstance("age")
		ageFilter.setModel(null)

		const raceFilter = gridApi.getFilterInstance("race")
		raceFilter.setModel(null)

		const ethnicityFilter = gridApi.getFilterInstance("ethnicity")
		ethnicityFilter.setModel(null)

		const deathFilter = gridApi.getFilterInstance("isDeath")
		deathFilter.setModel(null)

		// trigger filter changed event
		gridApi.onFilterChanged()

		// reset sorting model
		columnApi.resetColumnState()

		// trigger sort changed event
		gridApi.onSortChanged()
	}, [gridApi, columnApi])

	return (
		<div style={containerStyle}>
			<div className="text-start mb-3">
				<select
					onChange={onPageSizeChanged}
					id="page-size"
					value={pageSize}
					style={{ fontSize: "1.2rem" }}
				>
					<option value="5">5 rows</option>
					<option value="10">10 rows</option>
					<option value="20">20 rows</option>
					<option value="50">50 rows</option>
				</select>
				<Button variant="outline-danger" className="float-end" onClick={resetFilter}>
					Reset Filter
				</Button>
			</div>
			<div style={gridStyle} className="ag-theme-alpine">
				<AgGridReact
					ref={gridRef}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					gridOptions={gridOptions}
					cacheBlockSize={pageSize}
					paginationPageSize={pageSize}
					detailCellRenderer={detailCellRenderer}
					onGridReady={onGridReady}
					onFirstDataRendered={onFirstDataRendered}
				></AgGridReact>
			</div>
		</div>
	)
}

export default PatientTable
