// ** Initial State
const initialState = {
    patients: []
}

const patients = (state = initialState, action) => {
    // console.log(action)
    switch (action.type) {
        case 'GET':
            return { ...state, patients: action.data }
        case 'GET_BY_ID':
            return { ...state, patients: action.data }
        case 'GET_BY_CCCD':
            console.log(action.data)
            return { ...state, patients: action.data }
        case 'UPDATE':
            return { ...state, patients: action.data }
        case 'DELETE':
            return { ...state, patients: action.data }
        case 'ADD':
            return { ...state, patients: action.data }
        default:
            return { ...state }
    }
}

export default patients