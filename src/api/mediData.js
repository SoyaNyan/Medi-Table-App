import axios from "axios"

// get env variables
const { REACT_APP_API_BASE_ADDR: API_BASE_ADDR } = process.env

// 인종(민족) 리스트
const getEthnicityList = async () => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/ethnicity/list`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 성별 리스트
const getGenderList = async () => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/gender/list`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 환자 상세 정보 요약
const getPatientDetailBrief = async (personId) => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/patient/brief/${personId}`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 환자 진단 상세 전보
const getPatientConditionDetail = async (personId) => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/patient/detail/${personId}/condition`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 환자 처방 상세 정보
const getPatientDrugDetail = async (personId) => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/patient/detail/${personId}/drug`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 환자 방문 상세 정보
const getPatientVisitDetail = async (personId) => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/patient/detail/${personId}/visit`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 환자 리스트
/*
	filter {
		page: default(1) | 1~,
		length: default(0) | 1~,
		orderColumn: default(null) | 'person_id' | 'gender' | 'birth' | 'race' | 'ethnicity' | 'death',
		orderDesc: default(false) | true,
		gender: default(null) | 'F' | 'M',
		race: default(null) | 'other' | 'native' | 'black' | 'white' | 'asian',
		ethnicity: default(null) | 'nonhispanic' | 'hispanic,
		ageMin: default(null) | 0~,
		ageMax: default(null) | 0~,
		death: default(null) | false | true
	}
*/
const getPatientList = async (filter) => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/patient/list`,
			method: "GET",
			params: {
				page: filter.page,
				length: filter.length,
				order_column: filter.orderColumn,
				order_desc: filter.orderDesc,
				gender: filter.gender,
				race: filter.race,
				ethnicity: filter.ethnicity,
				age_min: filter.ageMin,
				age_max: filter.ageMax,
				death: filter.death,
			},
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 그래프를 위한 환자 통계
const getPatientStats = async () => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/patient/stats`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

// 인종 리스트
const getRaceList = async () => {
	try {
		const resp = await axios({
			url: `${API_BASE_ADDR}/api/race/list`,
			method: "GET",
		})
		return resp.data
	} catch (err) {
		console.log(`API Error: ${err}`)
	}
}

export {
	getEthnicityList,
	getGenderList,
	getPatientDetailBrief,
	getPatientConditionDetail,
	getPatientDrugDetail,
	getPatientVisitDetail,
	getPatientList,
	getPatientStats,
	getRaceList,
}
