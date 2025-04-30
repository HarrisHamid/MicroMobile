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
        throw 'User not found' // 404?
    } 
    // convert objectId to string and return user
    user._id = user._id.toString();
    return user;
}

export const register = async ( 
    firstName,
    lastName,
    userId, 
    password,
    email,
    inHoboken,
    address
) => {
    if (!firstName || !lastName || !userId || !password || !email || !inHoboken) {
        throw "Missing at least one field"
    }
    if (inHoboken === true && address === undefined) {
        throw "Address is required if inHoboken is true"
    }

    //=======================
    // firstName validation
    //=======================
    firstName = firstName.trim();

    // Check if firstName is empty
    if (firstName.length === 0) {
      throw "First name cannot be empty";
    }
    // Regex check for lettters only
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      throw "First name can only contain letters";
    }
    // Check length
    if (firstName.length < 2 || firstName.length > 20) {
      throw "First name must be between 2-20 characters";
    }

    //=======================
    // lastName validation
    //=======================
    lastName = lastName.trim();
    // Check if lastName is empty
    if (lastName.length === 0) {
      throw "Last name cannot be empty";
    }
    // Regex check for lettters only
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      throw "Last name can only contain letters";
    }
    // Check length
    if (lastName.length < 2 || lastName.length > 20) {
      throw "Last name must be between 2-20 characters";
    }

    //=======================
    // userId validation
    //=======================
    userId = userId.trim();
    // Check if userId is empty
    if (userId.length === 0) {
      throw "User ID cannot be empty";
    }
    // Regex check for lettters and numbers only
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      throw "User ID can only contain letters and numbers";
    }
    // Check length
    if (userId.length < 5 || userId.length > 10) {
      throw "User ID must be between 5-10 characters";
    }

    //=======================
    // password validation
    //=======================
    password = password.trim();

    // Check if password is empty
    if (password.length === 0) {
      throw "Password cannot be empty";
    }
    // Password error checks
    if (!/[A-Z]/.test(password)) {
      throw "Password must have at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      throw "Password must have at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw "Password must have at least one special character";
    }
    // Check length
    if (password.length < 8) {
      throw "Password must be at least 8 characters long";
    }
    //=======================
    // DO MORE VALIDATION HERE WHEN IT IS READY FROM THE FORM VALIDATION FILE
    //=======================

    //=======================
    // Create user
    //=======================
    let hashedPassword = await bcrypt.hash(password, 10)
      const newUser = {
        username: userId,
        name: `${firstName} ${lastName}`,
        hashedPassword: hashedPassword,
        Email: email,
        Address: address,
        inHoboken: inHoboken,
        rating: 0
      }
      const insertInfo = await userCollection.insertOne(newUser)
      if (insertInfo.acknowledged === false) {
        throw "Could not add user"
      }
      else {
        return { registrationCompleted: true }
      }
}

export const login = async (
    userId,
    password
) => {
    //=======================
    // userId validation
    //=======================
    const loginUserId = userId.trim();
    // Check if userId is empty
    if (loginUserId.length === 0) {
      throw "User ID cannot be empty";
    }
    // Regex check for lettters and numbers only
    if (!/^[a-zA-Z0-9]+$/.test(loginUserId)) {
      throw "User ID can only contain letters and numbers";
    }
    // Check length
    if (loginUserId.length < 5 || loginUserId.length > 10) {
      throw "User ID must be between 5-10 characters";
    }

    //=======================
    // password validation
    //=======================
    const loginPassword = password.trim();

    // Check if password is empty
    if (loginPassword.length === 0) {
      throw "Password cannot be empty";
    }
    // Password error checks
    if (!/[A-Z]/.test(loginPassword)) {
      throw "Password must have at least one uppercase letter"
    }
    if (!/[0-9]/.test(loginPassword)) {
      throw "Password must have at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(loginPassword)) {
      throw "Password must have at least one special character"
    }
    // Check length
    if (loginPassword.length < 8) {
     throw "Password must be at least 8 characters long";
    }

    //=======================
    // Check if user exists
    //=======================
    const userCollection = await users()
    const user = await userCollection.findOne({ userId: userId })
    if (!user) {
        throw "Either userId or password is invalid"
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw "Either userId or password is invalid"
    }

    return user
}