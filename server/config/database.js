import mongoose from 'mongoose';

const connect = () => {
    mongoose.connect('mongodb://localhost:27017/productivityZone')
        .then(() => {
            console.log('Database connection successful');
        })
        .catch(error => {
            console.log('Database connection failed');
            console.err(error);
            process.exit(1);
        });
}

export default {
    connect: connect,
};
