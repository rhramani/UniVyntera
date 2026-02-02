const dashboardServices = require("../services/dashboard");

const getDashboard  = async(req, res) => {
    try{
        const {startDate, endDate , branchId} = req.query;
        const headOffice = req.query.headOffice === "true";
        const currentUser = req.user;   
        const result = await dashboardServices.getDashboard(startDate, endDate, branchId, headOffice, currentUser);
        res.status(200).json({
            status: true,
            code: 200,
            data: result
        }) 
    }catch(error){
        console.log("error" , error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}


module.exports = {
    getDashboard
}