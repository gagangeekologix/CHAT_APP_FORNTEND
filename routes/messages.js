const { addMessage, getMessages ,msgFromAdmin} = require("../controllers/messageController");
const router = require("express").Router();
router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/msgfromadmin/", msgFromAdmin);
module.exports = router;