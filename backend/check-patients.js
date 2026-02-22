const mongoose = require('mongoose');
const User = require('./src/modules/users/user.model').default;
const Patient = require('./src/modules/patient/patient.model').default;

mongoose.connect('mongodb+srv://admin:admin123@cluster0.cf4j9.mongodb.net/clinic-appointment-system?retryWrites=true&w=majority&appName=Cluster0')
    .then(async () => {
        console.log('Connected to DB');
        const patients = await User.find({ role: 'patient' });
        console.log('Patients in DB:', patients.map(p => ({ email: p.email, id: p._id })));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
