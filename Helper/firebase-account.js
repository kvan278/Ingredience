const { admin } = require("../Config/firebase-admin.js")

exports.deleteFirebaseUser = async (uid) => {
    try {
        admin
        .auth()
        .deleteUser(uid)
        .then((response) => {
            console.log('Response : ', response)
            console.log(`Successfully deleted user with UID: ${uid}`);
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
        });
        return true
    } catch (err) {
        console.log('Error : ', err)
        return false
    }
}
