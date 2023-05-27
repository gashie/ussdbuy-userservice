const express = require("express");
const router = express.Router();


//USER MANAGEMENT
const {
    UserSignup,
    UpdateUserAccount,
    ViewUsers,
    ViewDeleted,
    UndoDelete
} = require("../controllers/user");

//API MANAGEMENT
const {
  CreateApp,
} = require("../controllers/appauth");
const { userSetup } = require("../middleware/validator");
const { appauth } = require("../middleware/protect");




router.route("/create").post(userSetup,UserSignup);
router.route("/update").post(UpdateUserAccount);
router.route("/view").post(appauth,ViewUsers);
router.route("/viewdeleted").post(ViewDeleted);
router.route("/delete").post(UndoDelete);


router.route("/createapp").post(CreateApp);
module.exports = router;
