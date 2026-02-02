import { CREATE_INTAKE, DELETE_INTAKE, GET_ALL_INTAKE, UPDATE_INTAKE } from "../../actions/Master/Intake.action";


const initialState = {
    createIntake: "",
    updateIntake: "",
    getAllIntake: "",
    deleteIntake: "",
};

export const intakeReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_INTAKE:
            return { ...state, createIntake: action.payload };
        case UPDATE_INTAKE:
            return { ...state, updateIntake: action.payload };
        case GET_ALL_INTAKE:
            return { ...state, getAllIntake: action.payload };
        case DELETE_INTAKE:
            return { ...state, deleteIntake: action.payload };
        default:
            return state;
    }
}