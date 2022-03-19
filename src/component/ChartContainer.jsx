import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import Chart from "react-apexcharts"
import { getRaceList, getEthnicityList, getGenderList, getPatientStats } from "../api/mediData"

const ChartContainer = ({ isFilterChanged }) => {
	// for charts' labels
	const [genderLabel, setGenderLabel] = useState([])
	const [raceLabel, setRaceLabel] = useState([])
	const [ethnicityLabel, setEthnicityLabel] = useState([])

	// for charts' data
	const [totalCount, setTotalCount] = useState(0)
	const [chartData01, setChart01Data] = useState(null)
	const [chartData02, setChart02Data] = useState(null)
	const [chartData03, setChart03Data] = useState(null)
	const [chartData04, setChart04Data] = useState(null)
	const [chartData05, setChart05Data] = useState(null)

	useEffect(() => {
		getGenderList().then(({ genderList }) => {
			setGenderLabel(genderList)
		})
		getRaceList().then(({ raceList }) => {
			setRaceLabel(raceList)
		})
		getEthnicityList().then(({ ethnicityList }) => {
			setEthnicityLabel(ethnicityList)
		})
	}, [])

	useEffect(() => {
		getPatientStats().then(({ stats }) => {
			// total count
			const total = stats.reduce((acc, curr) => acc + curr.count, 0)
			setTotalCount(total)

			// Chart_01
			const data01 = stats.reduce(
				(acc, curr) => {
					if (curr.gender === "M") {
						const maleCount = acc.M
						return { ...acc, M: maleCount + curr.count }
					} else {
						const femaleCount = acc.F
						return { ...acc, F: femaleCount + curr.count }
					}
				},
				{ M: 0, F: 0 }
			)
			setChart01Data([data01.M, data01.F])

			// Chart_02
			const data02 = stats.reduce(
				(acc, curr) => {
					let sum
					switch (curr.race) {
						case "other":
							if (curr.gender === "M") {
								const maleCount = acc.other.M
								sum = { ...acc, other: { ...acc.other, M: maleCount + curr.count } }
							} else {
								const femaleCount = acc.other.F
								sum = { ...acc, other: { ...acc.other, F: femaleCount + curr.count } }
							}
							break
						case "native":
							if (curr.gender === "M") {
								const maleCount = acc.native.M
								sum = { ...acc, native: { ...acc.native, M: maleCount + curr.count } }
							} else {
								const femaleCount = acc.native.F
								sum = { ...acc, native: { ...acc.native, F: femaleCount + curr.count } }
							}
							break
						case "black":
							if (curr.gender === "M") {
								const maleCount = acc.black.M
								sum = { ...acc, black: { ...acc.black, M: maleCount + curr.count } }
							} else {
								const femaleCount = acc.black.F
								sum = { ...acc, black: { ...acc.black, F: femaleCount + curr.count } }
							}
							break
						case "white":
							if (curr.gender === "M") {
								const maleCount = acc.white.M
								sum = { ...acc, white: { ...acc.white, M: maleCount + curr.count } }
							} else {
								const femaleCount = acc.white.F
								sum = { ...acc, white: { ...acc.white, F: femaleCount + curr.count } }
							}
							break
						case "asian":
							if (curr.gender === "M") {
								const maleCount = acc.asian.M
								sum = { ...acc, asian: { ...acc.asian, M: maleCount + curr.count } }
							} else {
								const femaleCount = acc.asian.F
								sum = { ...acc, asian: { ...acc.asian, F: femaleCount + curr.count } }
							}
							break
						default:
							sum = acc
					}
					return sum
				},
				{
					other: {
						M: 0,
						F: 0,
					},
					native: {
						M: 0,
						F: 0,
					},
					black: {
						M: 0,
						F: 0,
					},
					white: {
						M: 0,
						F: 0,
					},
					asian: {
						M: 0,
						F: 0,
					},
				}
			)
			const data02Arr = [
				data02.other.M + data02.other.F,
				data02.native.M + data02.native.F,
				data02.black.M + data02.black.F,
				data02.white.M + data02.white.F,
				data02.asian.M + data02.asian.F,
			]
			setChart02Data(data02Arr)

			// Chart_03
			const data03 = stats.reduce(
				(acc, curr) => {
					if (curr.ethnicity === "hispanic") {
						if (curr.gender === "M") {
							const maleCount = acc.hispanic.M
							return { ...acc, hispanic: { ...acc.hispanic, M: maleCount + curr.count } }
						} else {
							const femaleCount = acc.hispanic.F
							return { ...acc, hispanic: { ...acc.hispanic, F: femaleCount + curr.count } }
						}
					} else {
						if (curr.gender === "M") {
							const maleCount = acc.nonhispanic.M
							return { ...acc, nonhispanic: { ...acc.nonhispanic, M: maleCount + curr.count } }
						} else {
							const femaleCount = acc.nonhispanic.F
							return { ...acc, nonhispanic: { ...acc.nonhispanic, F: femaleCount + curr.count } }
						}
					}
				},
				{
					hispanic: {
						M: 0,
						F: 0,
					},
					nonhispanic: {
						M: 0,
						F: 0,
					},
				}
			)
			const data03Arr = [
				data03.hispanic.M + data03.hispanic.F,
				data03.nonhispanic.M + data03.nonhispanic.F,
			]
			setChart03Data(data03Arr)

			// Chart_04
			const data04Arr = [
				data02.other.M,
				data02.other.F,
				data02.native.M,
				data02.native.F,
				data02.black.M,
				data02.black.F,
				data02.white.M,
				data02.white.F,
				data02.asian.M,
				data02.asian.F,
			]
			setChart04Data(data04Arr)

			// Chart_05
			const data05Arr = [
				data03.hispanic.M,
				data03.hispanic.F,
				data03.nonhispanic.M,
				data03.nonhispanic.F,
			]
			setChart05Data(data05Arr)
		})
	}, [isFilterChanged])

	const CHART_01 = ({ data, label }) => {
		const chartOptions = {
			options: {
				chart: {
					type: "pie",
				},
				labels: ["남성(M)", "여성(F)"],
			},
			series: data,
		}

		return data ? (
			<div className="pie-chart">
				<Chart
					options={chartOptions.options}
					series={chartOptions.series}
					type="pie"
					width="100%"
				/>
			</div>
		) : (
			<div>No data.</div>
		)
	}

	const CHART_02 = ({ data, label }) => {
		const chartOptions = {
			options: {
				chart: {
					type: "pie",
				},
				labels: label,
			},
			series: data,
		}

		return data ? (
			<div className="pie-chart">
				<Chart
					options={chartOptions.options}
					series={chartOptions.series}
					type="pie"
					width="100%"
				/>
			</div>
		) : (
			<div>No data.</div>
		)
	}

	const CHART_03 = ({ data, label }) => {
		const chartOptions = {
			options: {
				chart: {
					type: "pie",
				},
				labels: label,
			},
			series: data,
		}

		return data ? (
			<div className="pie-chart">
				<Chart
					options={chartOptions.options}
					series={chartOptions.series}
					type="pie"
					width="100%"
				/>
			</div>
		) : (
			<div>No data.</div>
		)
	}

	const CHART_04 = ({ data }) => {
		const chartOptions = {
			options: {
				chart: {
					type: "pie",
				},
				labels: [
					"other(M)",
					"other(F)",
					"native(M)",
					"native(F)",
					"black(M)",
					"black(F)",
					"white(M)",
					"white(F)",
					"asian(M)",
					"asian(F)",
				],
			},
			series: data,
		}

		return data ? (
			<div className="pie-chart">
				<Chart
					options={chartOptions.options}
					series={chartOptions.series}
					type="pie"
					width="100%"
				/>
			</div>
		) : (
			<div>No data.</div>
		)
	}

	const CHART_05 = ({ data }) => {
		const chartOptions = {
			options: {
				chart: {
					type: "pie",
				},
				labels: ["hispanic(M)", "hispanic(F)", "nonhispanic(M)", "nonhispanic(F)"],
			},
			series: data,
		}

		return data ? (
			<div className="pie-chart">
				<Chart
					options={chartOptions.options}
					series={chartOptions.series}
					type="pie"
					width="100%"
				/>
			</div>
		) : (
			<div>No data.</div>
		)
	}

	return (
		<div>
			<Row className="mb-2 gx-1">
				<Col xs={12} md={4}>
					<Card className="h-100">
						<Card.Header>성별 환자 수</Card.Header>
						<Card.Body>
							<CHART_01 data={chartData01} label={genderLabel} />
						</Card.Body>
					</Card>
				</Col>
				<Col xs={12} md={4}>
					<Card className="h-100">
						<Card.Header>인종별 환자 수</Card.Header>
						<Card.Body>
							<CHART_02 data={chartData02} label={raceLabel} />
						</Card.Body>
					</Card>
				</Col>
				<Col xs={12} md={4}>
					<Card className="h-100">
						<Card.Header>민족별 환자 수</Card.Header>
						<Card.Body>
							<CHART_03 data={chartData03} label={ethnicityLabel} />
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row className="mb-3 gx-1">
				<Col xs={12} md={4}>
					<Card className="h-100">
						<Card.Header>성별 + 인종별 환자 수</Card.Header>
						<Card.Body>
							<CHART_04 data={chartData04} />
						</Card.Body>
					</Card>
				</Col>
				<Col xs={12} md={4}>
					<Card className="h-100">
						<Card.Header>성별 + 민족별 환자 수</Card.Header>
						<Card.Body>
							<CHART_05 data={chartData05} />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	)
}

export default ChartContainer
