import { CREATE_PROGRAM_LEVEL, DELETE_PROGRAM_LEVEL, GET_ALL_PROGRAM_LEVEL, UPDATE_PROGRAM_LEVEL } from "../../actions/Master/ProgramLevel.action"; 

const initialState = {
    createProgramLevel: "",
    updateProgramLevel: "",
    getAllProgramLevel: "",
    deleteProgramLevel: "",
}

export const programLevelReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PROGRAM_LEVEL:
            return { ...state, createProgramLevel: action.payload };
        case UPDATE_PROGRAM_LEVEL:
            return { ...state, updateProgramLevel: action.payload };
        case GET_ALL_PROGRAM_LEVEL:
            return { ...state, getAllProgramLevel: action.payload };
        case DELETE_PROGRAM_LEVEL:
            return { ...state, deleteProgramLevel: action.payload };
        default:
            return state;
    }
}