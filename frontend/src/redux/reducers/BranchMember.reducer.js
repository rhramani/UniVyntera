import { CREATE_BRANCH_MEMBER, DELETE_BRANCH_MEMBER, GET_ALL_BRANCH_MEMBER, GET_ONE_BRANCH_MEMBER, UPDATE_BRANCH_MEMBER } from "../actions/BranchMember.action";

const initialState = {
    createBranchMember: '',
    updateBranchMember: '',
    getAllBranchMember: '',
    deleteBranchMember: '',
    getBranchMemberById: '',
}

export const B2BMemberReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_BRANCH_MEMBER:
            return { ...state, createBranchMember: action.payload };
        case UPDATE_BRANCH_MEMBER:
            return { ...state, updateBranchMember: action.payload };
        case GET_ALL_BRANCH_MEMBER:
            return { ...state, getAllBranchMember: action.payload };
        case DELETE_BRANCH_MEMBER:
            return { ...state, deleteBranchMember: action.payload };
        case GET_ONE_BRANCH_MEMBER:
            return { ...state, getBranchMemberById: action.payload };
        default:
            return state;
    }
}