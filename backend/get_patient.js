const mongoose = require('mongoose');
const User = require('./src/modules/users/user.model').default;

mongoose.connect('mongodb+srv://admin:admin123@cluster0.cf4j9.mongodb.net/clinic-appointment-system?retryWrites=true&w=majority&appName=Cluster0')
    .then(async () => {
        const p = await User.findOne({ role: 'patient' });
        console.log('PATIENT_EMAIL=' + (p ? p.email : 'not_found'));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
