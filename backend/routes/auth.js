const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails, deleteUser, updateUser, google } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/register', upload.array('images', 10), registerUser);
router.post('/login', loginUser);
// router.post("/google", google);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
// router.put('/password/reset/:token', resetPassword);
// router.get('/me', isAuthenticatedUser, getUserProfile);
// router.put('/password/update', isAuthenticatedUser, updatePassword);
// router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile);
// router.get('/admin/users', allUsers);
// router.route('/admin/user/:id').get(isAuthenticatedUser, getUserDetails).delete(isAuthenticatedUser, deleteUser).put(isAuthenticatedUser, updateUser)

module.exports = router;