// ** Initial State
const initialState = {
    units: []
}

const units = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case 'GET':
            return { ...state, units: action.data }
        case 'GET_BY_ID':
            return { ...state, units: action.data }
        case 'UPDATE':
            return { ...state, units: action.data }
        case 'DELETE':
            return { ...state, units: action.data }
        case 'ADD':
            return { ...state, units: action.data }
        default:
            return { ...state }
    }
}

export default units