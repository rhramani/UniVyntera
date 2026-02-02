const path = require("path");
const accountantServices = require("../services/accountant");

const getEligibleStudents = async (req, res) => {
    try {
        const { page, limit, search = "", startDate, endDate, institute, type, country , branch, verificationSent, sideConfirmation} = req.query;
        const result = await accountantServices.getEligibleStudents(page, limit, search, startDate, endDate, institute, type, country , req.user ,branch,verificationSent, sideConfirmation);

        return res.status(200).json({
            status: true,
            message: "Total Admission get successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }
}

const getEligibleInstitutes = async (req, res) => {
    try {
        const result = await accountantServices.getEligibleInstitutes();

        return res.status(200).json({
            status: true,
            message: "Total Admission get successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }

}


const getEligibleCountries = async (req, res) => {
    try {
        const result = await accountantServices.getEligibleCountries();

        return res.status(200).json({
            status: true,
            message: "Total Admission get successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }
}

const exportDataToExcel = async (req, res) => {
    try {
        const ids = req.query.ids?.split(",") || [];

        const result = await accountantServices.exportDataToExcel(ids);

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message,
            });
        }

        const fileName = path.basename(result.filePath);
        const fileUrl = `/public/${fileName}`;

        return res.status(200).json({
            status: true,
            code: 200,
            fileUrl
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const universityCommision = async (req, res) => {
    try {
        const { page, limit, search, startDate, endDate, institute, country, invoiceGenerate, paymentReceived } = req.query;
        const result = await accountantServices.universityCommision(page, limit, search, startDate, endDate, institute, country, req.user, invoiceGenerate, paymentReceived);
        
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const getEligibleCommissionUniversity = async (req, res) => {
    try {
        const result = await accountantServices.getEligibleCommissionUniversity();

        return res.status(200).json({
            status: true,
            message: "Total Commission University get successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }

}
const getEligibleCommissionCountry = async (req, res) => {
    try {
        const result = await accountantServices.getEligibleCommissionCountry();

        return res.status(200).json({
            status: true,
            message: "Total Commission Country get successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }

}

const getB2BCommissionList = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { page, limit, search, startDate, endDate, institute, country, type, status } = req.query;
        const result = await accountantServices.getB2BCommissionList(page, limit, search, startDate, endDate, institute, country, type, status, userId, role);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const sendCommissionQueryEmail = async (req, res) => {
    try {
        const result = await accountantServices.sendCommissionQueryEmail(req.params.id);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }
}

const editInvoiceNo = async (req, res) => {
    try {
        const { ids, edit } = req.query;
        const data = req.body;
        const result = await accountantServices.editInvoiceNo(ids, data, edit);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }
}


const getStudentsByB2b = async (req, res) => {
  try{
    const result = await accountantServices.getStudentsByB2b(req.params.id);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result
    })
  }catch (error){
     res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = {
    getEligibleStudents,
    getEligibleInstitutes,
    getEligibleCountries,
    exportDataToExcel,
    universityCommision,
    getEligibleCommissionUniversity,
    getEligibleCommissionCountry,
    getB2BCommissionList,
    sendCommissionQueryEmail,
    editInvoiceNo,
    getStudentsByB2b
};