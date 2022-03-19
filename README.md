# Medical Table App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
이 프로젝트는 CRA(Create React App)으로 만들어졌습니다.

## Available Scripts

### `npm start`

프로젝트를 개발환경으로 로컬에서 호스팅하려면 위 스크립트를 실행해주세요.

### `npm run build`

프로젝트를 build 하려면 위 스크립트를 실행해주세요.

### `npm run start:prod`

build된 프로젝트를 로컬에서 호스팅하려면 위 스크립트를 실행해주세요.  
Production build를 호스팅하려면 먼저 `npm install -g serve` 를 통해 serve 패키지를 설치해주세요.

## Project Structure

프로젝트의 디렉토리 구조는 다음과 같습니다.

```txt
root
|   .env
|   .gitignore
|   output.txt
|   package-lock.json
|   package.json
|   README.md
|   tree.txt
+---build
|   |
|   \ ...
+---node_modules
|   |
|   \ ...
+---public
|       favicon.ico
|       index.html
|       logo192.png
|       logo512.png
|       manifest.json
|       robots.txt
|
\---src
    |   App.css
    |   App.jsx
    |   App.test.js
    |   custom.css
    |   index.css
    |   index.js
    |   logo.svg
    |   reportWebVitals.js
    |   setupTests.js
    |
    +---api
    |       mediData.js
    |
    \---component
            ChartContainer.jsx
            DetailCellRenderer.jsx
            PatientTable.jsx
```

프로젝트를 실행하기 위해서는 API 서버의 주소를 `.env` 파일에 작성해야 합니다.  
위 디렉토리 구조와 동일한 위치에 `.env` 파일을 생성하고 내부에 다음과 같이 환경변수를 작성하세요.

```txt
# CRA requires REACT_APP_ prefix
REACT_APP_API_BASE_ADDR=[API_ADRESS_HERE]
```

> CRA로 생성된 프로젝트에는 `dotenv` 패키지가 이미 설치되어 있습니다. 다만, `.env` 파일 내부에 `REACT_APP_` 접미사가 붙은 환경변수 만을 정상적으로 불러 올 수 있으니 `process.env` 에서 원하는 환경변수를 불러올 수 없을 경우 이 규칙을 지켜야 합니다.

## Dependencies (libraries)

프로젝트 진행에 앞서 어떤 프론트엔드 프레임워크와 라이브러리를 선택하여 구현을 할 지 고민했습니다. 기존에 PHP 풀스택 프로젝트에서 프론트엔드를 만들 때 자주 쓰던 jQuery, 가장 최근에 새롭게 공부했던 Svelte, 그리고 회사에서 일하며 써보았던 React, 모두 나름의 장단점을 가지고 있지만 프로젝트에 가장 적합하다고 판단되는 것을 골라야 했습니다.

jQuery는 순수 자바스크립트로 DOM을 다루는 것을 파사드 패턴으로 단축시켜놓은 라이브러리 입니다. 때문에 아무런 프레임워크나 라이브러리 없이 구현을 하는 것보다 코드의 양을 다소 줄여주는 장점이 있습니다. 다만, 모듈화의 어려움과 수 많은 DOM이벤트를 관리하기에 어렵기 때문에 jQuery의 사용은 포기했습니다.

Svelte는 순수 자바스크립트를 확장시켜서 매우 단순한 문법으로 모던 프론트엔드 프레임워크들이 제공하는 다양한 기능들을 지원합니다. Context API, Redux와 같은 기술이 없어도 컴포넌트의 State를 관리할 수 있는 기능들이 내장되어 있으며 무엇보다도 보일러플레이트가 절대적으로 적기 때문에 개발 속도를 높일 수 있습니다. 하지만 이번 프로젝트에서는 차트, 필터링과 정렬이 가능한 테이블 컴포넌트를 구현해야 하기 때문에 Svelte로 만들어진 라이브러리가 없는 현재 시점에서는 부적절 했습니다.

결과적으로 React에서 스타일링을 위한 Bootstrap 5.X의 래퍼 react-bootstrap과 데이터 테이블, 차트 등의 필요한 라이브러리를 모두 찾을 수 있었고 프로젝트의 가장 큰 뼈대는 React가 되었습니다. 이번 프로젝트에 CRA에서 기본으로 제공하는 것 이외에 사용된 외부 라이브러리는 다음과 같습니다.

```js
"dependencies": {
    "ag-grid-community": "^27.1.0", // ag-grid community license
    "ag-grid-enterprise": "^27.1.0", // ag-grid enterprise license(trial)
    "ag-grid-react": "^27.1.0", // react 데이터 테이블 라이브러리
    "apexcharts": "^3.33.2", // 다양한 차트를 제공하는 라이브러리의 react 버전
    "axios": "^0.26.1", // rest api 호출을 위한 http 클라이언트
    "bootstrap": "^5.1.3", // bootstrap의 react 래퍼
}
```

- [AG Grid](https://www.ag-grid.com/react-data-grid/)
- [ApexCharts](https://apexcharts.com/docs/react-charts/)

## Prob & Solution (Implementation)

이 프로젝트는 다음의 5항목을 구현하는 과제를 포함하고 있습니다. 각 항목을 구현하면서 제한된 시간 내에 최대한 많은 기능을 구현하는 것을 목표로 했습니다. 또한 실제 대시보드 형태의 웹앱들이 가지는 UI와 비슷한 형태로 화면을 구성하고 한 화면에 담긴 많은 정보를 편안하게 볼 수 있는 형태로 구성했습니다.

### Q0. 준비단계

본격적으로 구현을 시작하기 전에 가장 핵심이 되는 라이브러리인 `AG Grid `와 `ApexCharts `의 공식 문서를 살펴 보았습니다. `ApexCharts` 는 이전에 다른 프로젝트에서 순수 자바스크립트 버전으로 사용할 적이 있기 때문에 React 환경에서 사용할 때 어떤 Component와 Prop을 제공하는지를 찾아봤습니다.

`AG Grid` 의 경우 공식 문서상에 Enterprise 라이센스에만 적용 가능한 기능의 목록이 별도 표기되어 있는데 공식 문서에 나와있는 코드 스니펫을 그대로 사용해도 동작하지 않는 부분이 있어 단위 테스트 모듈을 만들어 실제 사용 가능한 Prop과 Option을 찾는데 상당한 시간을 소비했습니다.

화면 내부의 각 컴포넌트를 만들기 전, `react-bootstrap` 을 활용하여 간단한 네비게이션 바와 본문 영역을 만들고 높은 해상도에서도 정보를 집중해서 볼 수 있도록 `Container` 컴포넌트로 본문 영역을 좁혀 그 안에 테이블과 차트 컴포넌트를 넣기로 했습니다. 테이블 컴포넌트 위 쪽에 차트 컴포넌트가 위치해야 하고 차트 컴포넌트는 5개의 차트로 구성된 컨테이너에 적절히 배치해야 하며 하단에 테이블 컴포넌트에서 필요한 컨트롤 요소들을 고려하여 영역을 `Row` , `Col` 컴포넌트로 구분했습니다.

Swagger UI로 API의 명세가 제공되었기 때문에 각 `Endpoint` 의 파라미터, 반환 모델을 확인하고 `Axios` 요청을 보내는 유틸리티를 미리 만들어 두었습니다.

### Q1. 환자 정보를 탐색할 수 있는 테이블 Component를 만듭니다. (Solved)

첫번 째로 구현해야 되는 컴포넌트는 API에서 제공되는 환자들의 리스트 데이터를 테이블 형태로 보여주는 데이터 테이블 컴포넌트 입니다. 단순히 테이블에 데이터를 보여주는 것부터 시작했습니다. API를 요청하는 유틸리티는 이미 만들어 두었기 때문에 `AG Grid` 에 서버사이드 프로세싱 옵션을 주고 데이터를 연동하면 됩니다. 테이블에 표기되어야 할 정보는 환자 id, 성별, 생년월일, 나이, 인종, 민족, 사망 여부 총 7개의 컬럼으로 `AG Grid` 의 `columnDefs` 옵션에 출력할 데이터 필드를 매핑하고 한글로 헤더가 출력될 수 있도록 변경했습니다. 또한 성별, 생년월일, 사망 여부 컬럼의 경우 API 요청으로 획득한 정보를 가공해서 출력합니다. 그 밖에 이 후 문제에서 구현해야 되는 `pagination` , `sorting` , `filtering` 기능을 위해 관련 옵션을 찾아 부여했습니다.

테이블에 SSRM(Server-side Row Model) 옵션을 적용했기 때문에 클라이언트 측에서 데이터를 제공하는 기본 기능에서 추가로 필요한 옵션들이 많이 있었습니다. 그 중에서도 `rowModelType: "serverSide"` 옵션은 Enterprise License 에서만 사용 가능하며 `pagination: true` 옵션과 함께 사용할 경우 페이징이 제대로 동작하지 않는 경우가 있습니다. 이는 패키지 버전 `^25.0.1` 이후 변경된 것으로 ` serverSideStoreType: "partial"` 옵션으로 store 방식을 변경하지 않고 기본 값인 `full` 로 연동될 경우 모든 데이터를 한번에 가져오는 것으로 간주하여 현재 페이지를 알려주는 `endRow` 가 동작하지 않으므로 주의해야 합니다.

```js
// ag-grid options
const gridOptions = useMemo(
    () => ({
        masterDetail: true,
        pagination: true,
        rowModelType: "serverSide", // only available on Enterprise License(include trial)
        serverSideStoreType: "partial", // !important! required for SSRM pagination, sorting, filtering
        domLayout: "autoHeight",
        detailRowHeight: 400,
        )
    }),
    [setFilterModel]
)
```

공식 Github에 관련 이슈가 안내되어 있습니다. => [GitHub Issue](https://github.com/ag-grid/ag-grid/issues/4295)

페이징과 정렬을 위해서 `AG Grid` 의 `columnDefs` 에서 정렬이 가능하게 할 컬럼을 지정하고, SSRM 데이터를 준비하는 `useEffect()` 내에서 `params` 로 전달되는 prop의 `endRow` , `sortModel` 값을 읽어 현재 페이지, 전체 레코드의 수, 그리고 테이블에서 어떤 컬럼의 정렬을 하려고 하는지를 알아내고 이를 API를 호출할 때 필요한 parameter로 매핑합니다.

[ 정렬이 가능한 컬럼(API 명세를 따라) ]

- 환자 id (personID)
- 성별 (gender)
- 생년월일 (birthDatetime)
- 인종 (race)
- 민족 (ethnicity)
- 사망 여부 (isDeath)

```js
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
```

추가 기능으로 한 페이지 당 보여지는 Row의 수를 동적으로 변경할 수 있는 컨트롤이 필요했습니다. 컨트롤의 형태는 `react-ootstrap`의 `Select` 를 사용했고 해당 컨트롤의 값을 읽어 로컬 state에 저장한 뒤, `AG Grid` 의 API를 호출해 렌더링할 페이지 사이즈를 변경하도록 했습니다.

### Q2. Q1에서 작성한 테이블의 필터 기능을 만듭니다. (Solved)

이번 구현에서는 다음의 컬럼에서 필터링이 가능하도록 테이블을 수정해야 합니다.

- 성별(gender)
- 나이(age)
- 인종(race)
- 민족(ethnicity)
- 사망 여부(death)

이를 위해서 `AG Grid` 에서 제공하는 필터 컴포넌트를 활성화 하기 위해 `columnDefs` 옵션에 `filter: [filterClass]` 프로퍼티를 추가해야 합니다. 나이 컬럼을 제외한 나머지 컬럼은 모두 체크박스로 미리 지정된 항목을 선택 가능한 `agSetColumnFilter` 을 사용하고 필터링 옵션에 들어갈 항목은 각각의 리스트를 반환하는 API에 요청하여 동적으로 받을 수 있도록 구성했습니다. 나이는 환자의 리스트를 획득할 수 있는 API에서 `minAge` , `maxAge` 를 제공하므로 숫자 범위를 필터링 할 수 있는 `agNumberColumnFilter` 를 사용합니다.

각 컬럼에 정의된 필터를 실제 데이터에 반여하기 위해서 SSRM 데이터를 준비하는 `useEffect()` 내에서 `params` 로 전달되는 prop의 `filterModel` 을 읽어 사용자가 어떤 컬럼에서 어떤 값을 기준으로 필터링을 하고자 하는 지를 알아내고 API를 호출하는 부분에서 필터 값과 필터링할 컬럼의 ID를 매핑해 줍니다.

```js
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
```

이 과정에서 API의 `parameter` 가 사전에 정해져 있기 때문에 발생하는 문제가 있었는데, `AG Grid` 의 필터 기능은 한 컬럼에서 여러 개의 값을 동시에 `And` 나 `Or` 연산으로 복합 조건 검색이 가능하지만 API 엔드포인트에서 지원되지 않기 때문에 한 번에 두 개 이상의 필터를 `agSetColumnFilter` 에서 선택하거나 `minAge` , `maxAge` 값을 추출할 수 있는 조건이 아닌 항목을 `agNumberColumnFilter` 에서 선택할 때 해당하는 데이터를 반환해 줄 수 없었습니다. 클라이언트 측에서 여러번 API를 호출하여 데이터를 Merge 하는 방법도 있었지만 그렇게 되면 SSRM 사용의 목적이 무색해 지기 때문에 적절한 메시지를 사용자에게 출력하고 해당 컬럼의 `filter` 를 초기화하는 것으로 했습니다.

과제 조건에는 없었으나 여러 필터를 동시에 적용할 수 있는 테이블이기 때문에 필연적으로 정렬과 필터링 모두를 한번에 초기화하여 초기 상태의 데이터를 볼 수 있도록 리셋 컨트롤을 추가했습니다. 컴포넌트의 형태는 `react-bootstrap` 의 `Button` 을 사용하였고 테이블 상단 툴박스 우측에 배치하여 버튼을 클릭하면 `AG Grid` 의 API에서 각 컬럼에 지정된 필터의 Instance를 획득하고 `Filter Model` 을 `null` 로 초기화한 뒤, 정렬, 필터가 됬을 경우 전달되는 이벤트를 수동으로 호출하여 전체 페이지의 렌더링 없이 테이블 내의 데이터만 다시 불러올 수 있도록 했습니다.

### Q3. 목록에서 환자 클릭 시 상세 정보를 child-row에 보여줍니다. (Solved)

이번 문제는 이미 만들어진 `full-function` 데이터 테이블의 각 `row` 에 `child-row` 를 접었다 폈다 할 수 있도록 만들고 그 안에 두 가지 API로 부터 획득한 환자의 상세 정보를 표시하는게 목적이었습니다. `AG Grid` 에서 `Master Detail` 이라는 이름으로 제공되는 상세내용 옵션이 있었지만 기본적으로 1개의 데이터 소스로 단일 테이블만 출력 할 수 있었기 때문에 환자의 방문 횟수와 진단 상세정보 테이블을 동시에 출력하는 것이 불가능 했습니다. 때문에 공식문서를 좀더 자세히 파고들어 해결 방법을 얻을 수 있었습니다.

`AG Grid` 에서 `child-row` 를 그리려면 `detailCellRendererParams` 를 통해 `child-row` 에 들어갈 테이블의 옵션과 데이터를 전달해야 합니다. 다만 이렇게 하면 기본적인 테이블 하나 밖에 출력할 수 없으므로 `detailCellRenderer` prop을 통해서 커스텀 `cellRenderer` 컴포넌트를 전달해야 합니다. 이렇게 하면 일반적인 React Component 처럼 기본적인 테이블 외에 원하는 형식으로 `child-row` 내의 요소를 구성할 수 있습니다. 이렇게 만들어진 `customCellRenderer` 에는 부모 row의 `data` 와 `rowNode` , 내부에서 `AG Grid` 의 API에 접근하기 위한 API 객체가 prop으로 전달 됩니다. 때문에 부모 row로부터 `rowIndex`나 데이터 안의 `personID` 필드 값을 참조하여 상세 정보 API 호출에 필요한 parameter를 획득할 수 있습니다.

```js
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
```

다만 `AG Grid` 의 API 참조 객체는 여기저기서 복제되어 전달되기 때문에 prop으로 전달되는 것을 쓰지 않고 테이블이 `Mounted` 상태일 때 호출되는 `onGridReady()` 콜백 내에서 획득한 API 객체를 사용합니다. 이 때 획득한 객체를 `gridAPI` 로 저장해두고 API를 호출해 데이터를 불러오는 `useEffect()` 의 deps에 추가해 테이블이 `Mounted` 됬을 때만 데이터를 로드하도록 합니다.

`customCellRenderer` 내에서 그려지는 테이블에는 제공된 API에 별도로 필터링, 정렬을 위한 parameter를 받지 않고 한 번에 모든 레코드를 불러오기 때문에 SSRM이 적용되지 않았습니다. 다만 좁은 영역에 그려지는 테이블임을 고려하여 한 번에 5개의 row를 표시하도록 하고 이미 불러온 데이터를 `pageSize`로 나누어 보여줄 수 있도록 했습니다. 이렇게 완성된 환자의 진단 상세정보 테이블 위쪽에 `react-bootstrap` 의 `Card` 컴포넌트를 활용해 해당 환자가 지금까지 방문한 횟수를 표시하도록 했습니다.

```js
onRowClicked: (e) => {
    const { id: clickedRowIndex } = e.node
    e.api.forEachNode((row) => {
        if (row.id !== clickedRowIndex) {
            row.setExpanded(false)
        }
    })
    e.api.getDisplayedRowAtIndex(Number(clickedRowIndex)).setExpanded(!e.node.expanded)
},
```

추가적으로 아코디언 형태로 펼쳐졌다가 접히는 구조의 `child-row` 의 높이 때문에 페이지의 스크롤 길이가 지나치게 길어지는 점을 인지해 테이블에 제공하는 데이터가 여러 데이터를 동시에 열어두고 비교할 일이 없다는 것을 전제로하여 한 번에 한 개의 상세정보 `child-row` 만 열려있도록 했으며 열려있는 `child-row` 내의 빈 영역을 클릭하거나 부모 row를 클릭할 경우 다시 닫히도록 토글 방식으로 구현했습니다. 이 과정에서 `child-row` 또한 부모 테이블의 row로 삽입되기 때문에 `rowIndex` 가 하나씩 밀려 이미 다른 테이블이 열려 있는 상황에서 또 다른 테이블을 펼치려고 할 때 밀린 `rowIndex` 에 해당하는 row가 펼쳐지는 현상을 `onRowClicked()` 콜백에서 클릭된 row의 고유 `id` 와 비교해 수정했습니다. 또한 원래라면 `gridApi` 를 통해 한 번에 모든 row를 접을 수 있는 메서드를 제공하나 deprecated 되었기 때문에 `forEachNode()` 로 현재 페이지의 row를 순회하여 내부 prop에서 펼쳐진 상태를 읽고 닫아줄 수 있게 했습니다.

### Q4. 테이블 Component 위에 그래프 Component를 추가합니다. (Solved)

이번에는 API에서 제공하는 통계(집계) 정보를 받아 파이 형태의 차트로 출력해야 합니다. 출력해야 하는 항목은 다음의 5가지 입니다.

- 성별 환자 수
- 인종별 환자 수
- 민족별 환자 수
- (성별 + 인종)별 환자 수
- (성별 + 민족)별 환자 수

API에서 반환되는 리스트 데이터가 각 항목별로 집계된 데이터가 아닌 각 조건별로 그룹화된 데이터이기 때문에 리스트 내의 객체를 열어 그래프에서 필요한 데이터의 형태로 가공해 줄 필요가 있었습니다. `ApexCharts` 의 `Chart` 컴포넌트를 사용해 파이 형태의 차트를 그리려면 두 가지 array 데이터가 필요한데, 한 가지는 `labels` 로 각 파이별 legend(범례)에 해당하는 텍스트 이며 다른 하나는 `series` 로 실제 숫자 데이터가 제공되어야 합니다. 이 때 `labels` 와 `series` 의 각 항목은 1대1로 순서가 매칭되어야 합니다.

우선 `labels`에 제공할 범례 데이터를 먼저 얻기 위해서 제공된 API 중 3가지를 호출해서 로컬 `state` 에 저장하고 첫 3가지 차트에 각각 제공하고 뒤쪽의 복합 조건을 가진 차트에는 직접 string array로 `labels` 를 전달했습니다. `series` 에 제공될 데이터는 API를 호출하는 `useEffect()` 내에 리스트 데이터를 `reduce()` 를 통해 필요한 조건별로 집계하도록 구현했습니다.  이 때, 두번 째-네번 째, 세번 째, 다섯번 째 그래프는 각각 성별만 추가 조건으로 필터링하면 되기 때문에 한 번의 API 호출에서 각각 두 차트의 데이터를 모두 만들어 반환하도록 했습니다.

```js
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
```

이렇게 만들어진 5개의 `Chart` 컴포넌트를 `react-bootstrap` 의 `Row` , `Col`, `Card` 로 만들어진 `ChartContainer` 컴포넌트에 적절히 배치하여 테이블 컴포넌트 위쪽에 출력되도록 했습니다. 또한 정상적으로 데이터를 받지 못할 경우에는 적절한 메시지를 대신하여 보여줍니다.

### Q5. Q2에서 구현한 필터 설정에 따라 Q4의 그래프의 값을 수정합니다. (Timeout)





## 아쉬웠던 점
