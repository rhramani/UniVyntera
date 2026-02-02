import { CREATE_TEMPLATE, DELETE_TEMPLATE, GET_TEMPLATES } from "../../actions/BulkMessage/Template.action"

const initialSate = {
    getTemplates: [],
    createTemplate: "",
    deleteTemplate: ""
}

const templateReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GET_TEMPLATES:
            return { ...state, getTemplates: action.payload }
        case CREATE_TEMPLATE:
            return { ...state, createTemplate: action.payload }
        case DELETE_TEMPLATE: 
            return {...state, deleteTemplate:action.payload}
        default:
            return state
    }
}

export default templateReducer

