require('dotenv').config();
const { forgotPassword } = require('./src/services/forgotpassword.service');

async function test() {
    console.log('Sending forgot password email for ragnarxop@gmail.com...');
    try {
        await forgotPassword('ragnarxop@gmail.com');
        console.log('Forgot password function completed. Waiting 10 seconds to see if async email logs any errors...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log('Done waiting.');
    } catch (err) {
        console.error('Error during execution:', err);
    }
}

test();
