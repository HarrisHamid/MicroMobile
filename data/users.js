// Import helpers and users collection
import { checkStringIsGood, checkForNonSpace, checkExists, checkString, checkId, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, checkPosterEmail,
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable }
from "../helpers.js"
import users from "../config/mongoCollections.js"

// GET user by provided uid
const getUserById = async (uid) => {
    // Validate objectId
    uid = checkId(uid);
    // get collection from db
    const userCollection = await users();
    // find user with uid
    const user = await userCollection.findOne({_id: new ObjectId(uid)});
    if (user === null) {
        throw new Error('User not found') // 404?
    } 
    // convert objectId to string and return user
    user._id = user._id.toString();
    return user;
}