const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();

const { newLocation, 
    getLocations, 
    updateLocation, 
    deleteLocation, 
    getSingleLocation, 
    getAdminLocations} = require('../controllers/locationController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.post('/admin/location/new', upload.array('images', 10), isAuthenticatedUser, authorizeRoles('admin'), newLocation);
router.get('/admin/locations', isAuthenticatedUser, authorizeRoles('admin'), getAdminLocations);
// // router.route('/admin/location/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateLocation).delete(deleteLocation);
// router.route('/admin/location/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateLocation).delete(deleteLocation);
// router.route('/location/:id').put(updateLocation).delete(deleteLocation);


// Other routes
// router.get('/locations', getLocations);
// router.post('/location/new', newLocation);
// router.get('/location/:id', getSingleLocation);


module.exports = router;