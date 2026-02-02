const path = require("path");
const partnerCommissionReportServices = require("../../services/reports/partnerCommissionReports");

const partnerCommissionSummary = async (req, res) => {
    try {
        const { page, limit, search, institute,
            country,
            type, status, startDate,
            endDate, b2bId,branchId, paymentProcess } = req.query;
        const result = await partnerCommissionReportServices.partnerCommissionSummary(page, limit, search, institute,
            country,
            type, status, startDate,
            endDate, b2bId,branchId, paymentProcess , req.user);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const uniqueB2BAndBranchList = async (req, res) => {
    try {
        const result = await partnerCommissionReportServices.uniqueB2BAndBranchList();
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const pendingB2BInvoice = async (req, res) => {
    try {
        const { page, limit, search, startDate, endDate, country, type ,b2bId, branchId, showAll} = req.query;
        const result = await partnerCommissionReportServices.pendingB2BInvoice(page, limit, search , startDate, endDate, country, type, b2bId, branchId, showAll);
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const partnerConversionReport = async (req, res) => {
    try {
        const { type, page, limit, search } = req.query;
        const result = await partnerCommissionReportServices.partnerConversionReport(type, page, limit, search);
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const exportPartnerConversionReport = async (req, res) => {
    try{
        const type = req.query.type;
        const result = await partnerCommissionReportServices.exportPartnerConversionReport(type);

        if(!result.success) {
            return res.status(404).json({
                status: false ,
                message: result.message
            })
        }

        const fileName = path.basename(result.filePath);
        const fileUrl = `/public/${fileName}`;

        return res.status(200).json({
            status: true,
            code: 200,
            fileUrl
        })

    }catch (error){
         res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const pendingB2BCountry = async (req, res) => {
    try {
        const result = await partnerCommissionReportServices.pendingB2BCountry();
        return res.status(200).json({
            status: true,
            message: "Total Pending B2B Country get successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const downloadPendingB2BInvoice = async (req, res) => {
     try {

        const {
            searchText ,
    startDate,
    endDate,
    country,
    type,
    b2bId,
    branchId,
    showAll
        } = req.query;
    const result = await partnerCommissionReportServices.downloadPendingB2BInvoice(
     searchText ,
         startDate,
         endDate,
         country,
         type,
         b2bId,
         branchId,
         showAll
    );

    if (!result.success) {
      return res.status(404).json({
        status: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      status: true,
      fileUrl: `/public/${result.fileName}`,
    });
  } catch (error) {
    console.log("error" , error);
    return res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = {
    partnerCommissionSummary,
    pendingB2BInvoice,
    uniqueB2BAndBranchList,
    partnerConversionReport,
    exportPartnerConversionReport,
    pendingB2BCountry,
    downloadPendingB2BInvoice
}