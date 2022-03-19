import { useState } from "react"
import "./App.css"
import logo from "./logo.svg"
import { Navbar, Container } from "react-bootstrap"
import PatientTable from "./component/PatientTable"
import ChartContainer from "./component/ChartContainer"

function App() {
	const [filterModel, setFilterModel] = useState(null)

	return (
		<div className="App">
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="/">
						<img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />{" "}
						Patient Table App
					</Navbar.Brand>
				</Container>
			</Navbar>
			<Container className="mt-3 h-50">
				<ChartContainer filterModel={filterModel} />
				<PatientTable setFilterModel={setFilterModel} />
			</Container>
		</div>
	)
}

export default App
