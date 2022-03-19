import { useState, useEffect, useMemo, useCallback } from "react"
import { AgGridReact } from "ag-grid-react"
import { getPatientConditionDetail, getPatientVisitDetail } from "../api/mediData"
import { Card } from "react-bootstrap"

const DetailCellRenderer = ({ data, node, api }) => {
	const [gridApi, setGridApi] = useState(null)
	const [detailData, setDetailData] = useState(null)
	const [visitCount, setVisitCount] = useState(0)

	const { personID } = data
	const rowId = node.id

	const containerStyle = useMemo(() => ({ width: "100%", height: "100%", padding: "10px" }), [])
	const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), [])
	const gridOptions = useMemo(
		() => ({
			pagination: true,
			paginationPageSize: 5,
			domLayout: "autoHeight",
		}),
		[]
	)
	const [columnDefs] = useState([
		{ headerName: "방문 ID", field: "visitID" },
		{ headerName: "진단 ID", field: "conditionConceptID" },
		{ headerName: "진단명", field: "conditionConceptName" },
		{
			headerName: "진단 시작일",
			field: "conditionStartDate",
			valueFormatter: ({ value }) => {
				return value || "-"
			},
		},
		{
			headerName: "진단 종료일",
			field: "conditionEndDate",
			valueFormatter: ({ value }) => {
				return value || "-"
			},
		},
	])
	const defaultColDef = useMemo(() => {
		return {
			flex: 1,
			sortable: true,
		}
	}, [])

	const onGridReady = useCallback(
		(params) => {
			const gridInfo = {
				id: node.id,
				api: params.api,
				columnApi: params.columnApi,
			}
			setGridApi(params.api)

			api.addDetailGridInfo(rowId, gridInfo)
		},
		[node, rowId, api]
	)

	useEffect(() => {
		return () => {
			api.removeDetailGridInfo(rowId)
		}
	}, [api, rowId])

	useEffect(() => {
		if (gridApi) {
			getPatientConditionDetail(personID)
				.then(({ conditionList }) => {
					setDetailData(conditionList)
				})
				.catch((err) => {
					console.log(err)
				})

			getPatientVisitDetail(personID)
				.then(({ visitList }) => {
					setVisitCount(visitList.length)
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [personID, gridApi])

	return (
		<div style={containerStyle}>
			<Card className="text-start mb-3">
				<Card.Body>
					<strong className="text-success">{`#${data.personID} 환자`}</strong>는 진료를 위해
					<strong className="text-warning"> {visitCount}</strong>번 방문했습니다.
				</Card.Body>
			</Card>
			<div style={gridStyle} className="full-width-grid ag-theme-alpine">
				<AgGridReact
					id={`detailGrid#${rowId}`}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					gridOptions={gridOptions}
					onGridReady={onGridReady}
					rowData={detailData}
				/>
			</div>
		</div>
	)
}

export default DetailCellRenderer
