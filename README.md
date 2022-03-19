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