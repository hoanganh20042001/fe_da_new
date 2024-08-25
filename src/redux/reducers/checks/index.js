// ** Initial State
const initialState = {
    checks: []
}

const checks = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case 'GET':
            return { ...state, checks: action.data }
        case 'GET_BY_ID':
            return { ...state, checks: action.data }
        case 'UPDATE':
            return { ...state, checks: action.data }
        case 'DELETE':
            return { ...state, checks: action.data }
        case 'ADD':
            return { ...state, checks: action.data }
        default:
            return { ...state }
    }
}

export default checks