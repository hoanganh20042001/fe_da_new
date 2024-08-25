// ** Initial State
const initialState = {
    diseases: []
}

const diseases = (state = initialState, action) => {
    // console.log(action)
    switch (action.type) {
        case 'GET':
            return { ...state, diseases: action.data }
        case 'GET_BY_ID':
            return { ...state, diseases: action.data }
        case 'UPDATE':
            return { ...state, diseases: action.data }
        case 'DELETE':
            return { ...state, diseases: action.data }
        case 'ADD':
            return { ...state, diseases: action.data }
        default:
            return { ...state }
    }
}

export default diseases