const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();

const { newPost, 
    updateLocation, 
    deleteLocation, 
    getSingleLocation, 
    getLocation} = require('../controllers/postController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.post('/admin/post/new', upload.array('images', 10), isAuthenticatedUser, authorizeRoles('admin'), newPost);
// router.get('/admin/posts', isAuthenticatedUser, authorizeRoles('admin'), getLocation);
// // router.route('/admin/post/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateLocation).delete(deleteLocation);
// router.route('/admin/post/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateLocation).delete(deleteLocation);
// router.route('/post/:id').put(updateLocation).delete(deleteLocation);


// Other routes
// router.get('/posts', getLocations);
// router.post('/post/new', newLocation);
// router.get('/post/:id', getSingleLocation);


module.exports = router;