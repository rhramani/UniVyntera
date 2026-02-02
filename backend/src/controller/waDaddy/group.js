const groupServices = require('../../services/waDaddy/group');

// ========== Create Group ==========
exports.createGroup = async (req, res) => {
    const { name, contactIds, description } = req.body;
    const user = req.user;
    try {
        const result = await groupServices.createGroup(name, contactIds, description, user);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


exports.getAllGroups = async (req, res) => {
    try {
        const user = req.user;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const search = req.query.search || '';
        const result = await groupServices.getAllGroups(page, limit, search);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


exports.addContactToGroup = async (req, res) => {
    const groupId = req.params.groupId;
    const { contactIds } = req.body;
    try {
        const result = await groupServices.addContactToGroup(groupId, contactIds);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


exports.deleteContactFromGroup = async (req, res) => {
    const groupId = req.params.groupId;
    const { contactIds } = req.body;
    try {
        const result = await groupServices.deleteContactFromGroup(groupId, contactIds);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


exports.getContactsOfGroup = async (req, res) => {
    const { id } = req.params;
    const { page, limit, search } = req.query;
    try {
        const result = await groupServices.getContactsOfGroup(id, page, limit, search);
        return res.status(result.status).json(result);  
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

exports.deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await groupServices.deleteGroup(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

exports.getGroupById = async (req,res) => {
    const id = req.params.id;
    try {
        const result = await groupServices.getGroupById(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log("error",error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}
