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

프로젝트 진행에 앞서 어떤 프론트엔드 프레임워크와 라이브러리를 선택하여 구현을 할 지 고민했습니다.  
기존에 PHP 풀스택 프로젝트에서 프론트엔드를 만들 때 자주 쓰던 jQuery, 가장 최근에 새롭게 공부했던  
Svelte, 그리고 회사에서 일하며 써보았던 React, 모두 나름의 장단점을 가지고 있지만 프로젝트에 가장  
적합하다고 판단되는 것을 골라야 했습니다.

jQuery는 순수 자바스크립트로 DOM을 다루는 것을 파사드 패턴으로 단축시켜놓은 라이브러리 입니다.  
때문에 아무런 프레임워크나 라이브러리 없이 구현을 하는 것보다 코드의 양을 다소 줄여주는 장점이  
있습니다. 다만, 모듈화의 어려움과 수 많은 DOM이벤트를 관리하기에 어렵기 때문에 jQuery의 사용은  
포기했습니다.

Svelte는 순수 자바스크립트를 확장시켜서 매우 단순한 문법으로 모던 프론트엔드 프레임워크들이  
제공하는 다양한 기능들을 지원합니다. Context API, Redux와 같은 기술이 없어도 컴포넌트의 State를  
관리할 수 있는 기능들이 내장되어 있으며 무엇보다도 보일러플레이트가 절대적으로 적기 때문에 개발  
속도를 높일 수 있습니다. 하지만 이번 프로젝트에서는 차트, 필터링과 정렬이 가능한 테이블 컴포넌트를  
구현해야 하기 때문에 Svelte로 만들어진 라이브러리가 없는 현재 시점에서는 부적절 했습니다.

결과적으로 React에서 스타일링을 위한 Bootstrap 5.X의 래퍼 react-bootstrap과 데이터 테이블, 차트  
등의 필요한 라이브러리를 모두 찾을 수 있었고 프로젝트의 가장 큰 뼈대는 React가 되었습니다. 이번  
프로젝트에 CRA에서 기본으로 제공하는 것 이외에 사용된 외부 라이브러리는 다음과 같습니다.

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

이 프로젝트는 다음의 5항목을 구현하는 과제를 포함하고 있습니다. 각 항목을 구현하면서 제한된 시간 내에  
최대한 많은 기능을 구현하는 것을 목표로 했습니다. 또한 실제 대시보드 형태의 웹앱들이 가지는 UI와 비슷한  
형태로 화면을 구성하고 한 화면에 담긴 많은 정보를 편안하게 볼 수 있는 형태로 구성했습니다.

### Q1. 환자  정보를 탐색할 수 있는 테이블 Component를 만듭니다. (Solved)





### Q2. Q1에서 작성한 테이블의 필터 기능을 만듭니다. (Solved)





### Q3. 목록에서 환자 클릭 시 상세 정보를 child-row에 보여줍니다. (Solved)





### Q4. 테이블 Component 위에 그래프 Component를 추가합니다. (Solved)





### Q5. Q2에서 구현한 필터 설정에 따라 Q4의 그래프의 값을 수정합니다. (Timeout)



