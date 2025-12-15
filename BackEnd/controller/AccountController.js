// controller/accountController.js
const Account = require("../model/Account");

exports.getGroupMembers = async (req, res) => {
  try {
    const { user_id } = req.params;
    const members = await Account.getGroupMembers(user_id);

    res.json({
      success: true,
      members
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
