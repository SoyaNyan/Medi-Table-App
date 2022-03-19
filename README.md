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
`.env` 파일을 생성하고 내부에 다음과 같이 환경변수를 작성하세요.

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



### Q0.  준비

본격적으로 구현을 시작하기 전에 가장 핵심이 되는 라이브러리인 `AG Grid `와 `ApexCharts `의 공식 문서를 살펴 보았습니다. `ApexCharts` 는 이전에 다른 프로젝트에서 순수 자바스크립트 버전으로 사용할 적이 있기 때문에 React 환경에서 사용할 때 어떤 Component와 Prop을 제공하는지를 찾아봤습니다.

`AG Grid` 의 경우 공식 문서상에 Enterprise 라이센스에만 적용 가능한 기능의 목록이 별도 표기되어 있는데 공식 문서에 나와있는 코드 스니펫을 그대로 사용해도 동작하지 않는 부분이 있어 단위 테스트 모듈을 만들어 실제 사용 가능한 Prop과 Option을 찾는데 상당한 시간을 소비했습니다.

화면 내부의 각 컴포넌트를 만들기 전, `react-bootstrap` 을 활용하여 간단한 네비게이션 바와 본문 영역을 만들고 높은 해상도에서도 정보를 집중해서 볼 수 있도록 `Container` 컴포넌트로 본문 영역을 좁혀 그 안에 테이블과 차트 컴포넌트를 넣기로 했습니다. 테이블 컴포넌트 위 쪽에 차트 컴포넌트가 위치해야 하고 차트 컴포넌트는 5개의 차트로 구성된 컨테이너에 적절히 배치해야 하며 하단에 테이블 컴포넌트에서 필요한 컨트롤 요소들을 고려하여 영역을 `Row` , `Col` 컴포넌트로 구분했습니다.

Swagger UI로 API의 명세가 제공되었기 때문에 각 `Endpoint` 의 파라미터, 반환 모델을 확인하고 `Axios` 요청을 보내는 유틸리티를 미리 만들어 두었습니다. 



### Q1. 환자  정보를 탐색할 수 있는 테이블 Component를 만듭니다. (Solved)

첫번 째로 구현해야 되는 컴포넌트는 API에서 제공되는 환자들의 리스트 데이터를 테이블 형태로 보여주는 데이터 테이블 컴포넌트 입니다. 단순히 테이블에 데이터를 보여주는 것부터 시작했습니다. API를 요청하는 유틸리티는 이미 만들어 두었기 때문에 `AG Grid` 에 서버사이드 프로세싱 옵션을 주고 데이터를 연동하면 됩니다. 테이블에 표기되어야 할 정보는 환자 id, 성별, 생년월일, 나이, 인종, 민족, 사망 여부 총 7개의 컬럼으로 `AG Grid` 의 `columnDefs` 옵션에 출력할 데이터 필드를 매핑하고 한글로 헤더가 출력될 수 있도록 변경했습니다. 또한 성별, 생년월일, 사망 여부 컬럼의 경우 API 요청으로 획득한 정보를 가공해서 출력합니다. 그 밖에 이 후 문제에서 구현해야 되는 `pagination` , `sorting` , `filtering` 기능을 위해 관련 옵션을 찾아 부여했습니다.

테이블에 SSRM(Server-side Row Model) 옵션을 적용했기 때문에 클라이언트 측에서 데이터를 제공하는 기본 기능에서 추가로 필요한 옵션들이 많이 있었습니다. 그 중에서도 `rowModelType: "serverSide"` 옵션은 Enterprise License 에서만 사용 가능하며 `pagination: true` 옵션과 함께 사용할 경우 페이징이 제대로 동작하지 않는 경우가 있습니다. 이는 패키지 버전 `^25.0.1` 이후 변경된 것으로 ` serverSideStoreType: "partial"` 옵션으로 store 방식을 변경하지 않고 기본 값인 `full` 로 연동될 경우 모든 데이터를 한번에 가져오는 것으로 간주하여 현재 페이지를 알려주는 `endRow` 가 동작하지 않으므로 주의해야 합니다.

공식 Github에 관련 이슈가 안내되어 있습니다. => [GitHub Issue](https://github.com/ag-grid/ag-grid/issues/4295)



### Q2. Q1에서 작성한 테이블의 필터 기능을 만듭니다. (Solved)





### Q3. 목록에서 환자 클릭 시 상세 정보를 child-row에 보여줍니다. (Solved)





### Q4. 테이블 Component 위에 그래프 Component를 추가합니다. (Solved)





### Q5. Q2에서 구현한 필터 설정에 따라 Q4의 그래프의 값을 수정합니다. (Timeout)



