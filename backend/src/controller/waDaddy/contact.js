const contactService = require("../../services/waDaddy/contact");

// ========== Add Contact ==========
exports.addContact = async (req, res) => {
  const { fname, lname, phoneNumber, email, groupId } = req.body;
  const user = req.user;

  try {
    const result = await contactService.addContact(
      fname,
      lname,
      phoneNumber,
      email,
      groupId,
      user
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const search = req.query.search || "";
    const subscribed = req.query.subscribed;
    const user = req.user;
    const result = await contactService.getAllContacts(
      page,
      limit,
      search,
      subscribed,
      user
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.getAllContactsExport = async (req, res) => {
  try {
    // const user = req.user;
    const search = req.query.search || "";
    // const subscribed = req.query.subscribed;
    const result = await contactService.getAllContactsExport(
      search
      // subscribed
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.chatContacts = async (req, res) => {
  try {
    // const user = req.user;
    const search = req.query.search || "";
    const subscribed = req.query.subscribed;
    const result = await contactService.chatContacts(search, subscribed);
    return res.status(result.status).json(result);
  } catch (error) { 
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const { fname, lname, phoneNumber, email } = req.body;
    const result = await contactService.updateContact(
      id,
      fname,
      lname,
      phoneNumber,
      email,
      user
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const result = await contactService.getContactById(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};


exports.deleteContact = async (req, res) => {
  try {
    const result = await contactService.deleteContact(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};


exports.multipleDelete = async (req, res) => {
  try {
    const { contactIds } = req.body;
    const result = await contactService.multipleDelete(contactIds);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

exports.importContactsFromExcel = async (req, res) => {
  try {
    const user = req.user;
    if (!req.files) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const { groupId } = req.body;
    
    const result = await contactService.importContactsFromExcel(
      req.files?.excelFile?.[0].path,
      groupId,
      user
    );

    if (result.inserted > 0) {
      res.status(200).json({
        success: true,
        message: `${result.inserted} contacts imported successfully.`,
        inserted: result.inserted,
        duplicates: result.duplicates,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No new contacts were imported.",
        inserted: result.inserted,
        duplicates: result.duplicates,
      });
    }
  } catch (error) {
    console.error("❌ Error importing contacts:", error);
    res
      .status(500)
      .json({ message: "Failed to import contacts", error: error.message });
  }
};