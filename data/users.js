// Import helpers and users collection
import {
  checkStringIsGood,
  checkForNonSpace,
  checkExists,
  checkString,
  checkId,
  checkTitle,
  checkType,
  checkTags,
  checkCondition,
  checkAvailable,
  checkPosterUsername,
  checkPosterEmail,
  checkPosterName,
  checkMaxRental,
  checkCost,
  checkImage,
  checkWhenAvailable,
} from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

// GET user by provided uid
const getUserById = async (uid) => {
  // Validate objectId
  uid = checkId(uid);
  // get collection from db
  const userCollection = await users();
  // find user with uid
  const user = await userCollection.findOne({ _id: new ObjectId(uid) });
  if (user === null) {
    throw "User not found"; // 404?
  }
  // convert objectId to string and return user
  user._id = user._id.toString();
  return user;
};

const saltRounds = 10;
export const register = async (
  firstName,
  lastName,
  userId,
  password,
  email,
  address,
  inHoboken,
  state
) => {
  // All fields must be supplied or you will throw an error
  if (
    !firstName ||
    !lastName ||
    !userId ||
    !password ||
    !email ||
    !address ||
    !inHoboken
  ) {
    throw Error(`All fields must be supplied`);
  }

  //====================
  // firstName Validation
  //====================
  // String Type Check
  if (typeof firstName !== "string") {
    throw Error(`First name must be of type String`);
  }
  firstName = firstName.trim();
  // Empty just spaces check
  if (firstName.length === 0) {
    throw Error(`First cant be empty or just spaces`);
  }
  /// Regex Check for just letters
  if (!/^[a-zA-Z]+$/.test(firstName)) {
    throw Error(`First name must contain only letters`);
  }
  // Length Check
  if (firstName.length < 2 || firstName.length > 20) {
    throw Error(`First name must be between 2-20 characters`);
  }

  //====================
  // lastName Validation
  //====================
  // String Type Check
  if (typeof lastName !== "string") {
    throw Error(`Last name must be of type String`);
  }
  lastName = lastName.trim();
  // Empty just spaces check
  if (lastName.length === 0) {
    throw Error(`Last name must not be empty or just spaces`);
  }
  /// Regex Check for just letters
  if (!/^[a-zA-Z]+$/.test(lastName)) {
    throw Error(`Last name must contain only letters`);
  }
  // Length Check
  if (lastName.length < 2 || lastName.length > 20) {
    throw Error(`Last name must be between 2-20 characters`);
  }

  //====================
  // userId Validation
  //====================
  // String Type Check
  if (typeof userId !== "string") {
    throw Error(`userId must be of type String`);
  }
  userId = userId.trim();
  // Empty just spaces check
  if (userId.length === 0) {
    throw Error(`userId cant be empty or just spaces`);
  }
  /// Regex Check for just letters or positive whole numbers
  if (!/^[a-zA-Z0-9]+$/.test(userId)) {
    throw Error(`userId can only have letters or positive whole numbers`);
  }
  // Length Check
  if (userId.length < 5) {
    throw Error(`userId must be at least 5 characters`);
  }
  // Case-insensitive check
  const userCollection = await users();
  const existingUser = await userCollection.findOne({
    userId: { $regex: new RegExp(`^${userId}$`, "i") },
  });
  if (existingUser) {
    throw Error(`userId already exists`);
  }

  //====================
  // password Validation
  //====================
  // String Type Check
  if (typeof password !== "string") {
    throw Error(`password must be of type String`);
  }
  password = password.trim();
  // Empty just spaces check
  if (password.length === 0) {
    throw Error(`password cant be empty or just spaces`);
  }
  // Length Check
  if (password.length < 8) {
    throw Error(`password must be at least 8 characters`);
  }
  // Password Constraints:
  // 1. At least one uppercase character
  if (!/[A-Z]/.test(password)) {
    throw Error(`password must contain at least one uppercase character`);
  }
  // 2. At least one number
  if (!/[0-9]/.test(password)) {
    throw Error(`password must contain at least one number`);
  }
  // 3. At least one special character
  // (https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string)
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    throw Error(`password must contain at least one special character`);
  }

  //====================
  // Email Validation
  //====================
  // String Type Check
  if (typeof email !== "string") {
    throw Error(`email must be of type String`);
  }
  email = email.trim();
  // Empty just spaces check
  if (email.length === 0) {
    throw Error(`email cant be empty or just spaces`);
  }
  // Regex Check for valid email format
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw Error(`email is not valid`);
  }
  // Case-insensitive check
  const existingEmail = await userCollection.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });
  if (existingEmail) {
    throw Error(`email already exists`);
  }

  //====================
  // Address Validation
  //====================
  // String Type Check
  if (typeof address !== "string") {
    throw Error(`address must be of type String`);
  }
  address = address.trim();
  // Empty just spaces check
  if (address.length === 0) {
    throw Error(`address cant be empty or just spaces`);
  }
  // Length Check
  if (address.length < 10) {
    throw Error(`address must be at least 10 characters`);
  }

  //====================
  // inHoboken Validation
  //====================
  if (inHoboken !== "yes" && inHoboken !== "no") {
    throw Error(`inHoboken must be either "yes" or "no"`);
  }

  //============================================
  // State Validation (only if not in Hoboken)
  //============================================
  if (inHoboken === "no") {
    if (!state || typeof state !== "string") {
      throw Error(`State must be provided if not in Hoboken`);
    }

    state = state.trim().toUpperCase();

    // List of valid state abbreviations
    const validStates = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ];

    if (!validStates.includes(state)) {
      throw Error(`Invalid state provided`);
    }
  }

  // hash pw
  const hashPw = await bcrypt.hash(password, saltRounds);
  // If all the inputted data is valid, you will set signupDate
  // https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
  const currDate = new Date();
  const month = String(currDate.getMonth() + 1).padStart(2, "0");
  const day = String(currDate.getDate()).padStart(2, "0");
  const year = currDate.getFullYear();
  const signupDate = `${month}/${day}/${year}`;

  // get current time
  const currTime = currDate.getHours();
  const hours = currTime % 12 || 12;
  const minutes = String(currDate.getMinutes()).padStart(2, "0");
  if (currTime < 12) {
    var timeUnit = "AM";
  } else {
    var timeUnit = "PM";
  }
  const lastLogin = `${month}/${day}/${year} ${hours}:${minutes}${timeUnit}`;

  // Creating and adding user
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    userId: userId,
    password: hashPw,
    email: email,
    address: address,
    inHoboken: inHoboken,
    signupDate: signupDate,
    lastLogin: lastLogin,
    role: 'user', //middleware prints the role so I at least set it here. -Jack
    ratings: [],
    ratingAverage: 0,  
    ratingCount: 0    
  };

  // not in Hoboken check
  if (inHoboken === "no") {
    newUser.state = state;
  }
  // Add user to DB
  const usersCollection = await users(); // reference to the collection
  const insertInfo = await usersCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw Error("Could not add User");

  //If the insert was successful, your function will return: {registrationCompleted: true}.
  // If it was not successful, you will throw an error
  if (insertInfo.insertedId) {
    return { registrationCompleted: true };
  }
  throw Error(`Could not register user`);
};

export const login = async (userId, password) => {
  // Both userId and password must be supplied
  if (!userId || !password) {
    throw Error(`Both userId and password must be supplied`);
  }

  //====================
  // userId Validation
  //====================
  // String Type Check
  if (typeof userId !== "string") {
    throw Error(`userId must be of type String`);
  }
  userId = userId.trim();
  // Empty just spaces check
  if (userId.length === 0) {
    throw Error(`userId cant be empty or just spaces`);
  }

  // Regex Check for just letters or positive whole numbers
  if (!/^[a-zA-Z0-9]+$/.test(userId)) {
    throw Error(`userId can only have letters or positive whole numbers`);
  }
  // Length Check
  if (userId.length < 5) {
    throw Error(`userId must be at least 5 characters`);
  }
  // Case-insensitive check
  const userCollection = await users(); // reference to the collection
  const existingUser = await userCollection.findOne({
    userId: { $regex: new RegExp(`^${userId}$`, "i") },
  });
  if (!existingUser) {
    throw Error(`userId does not exist`);
  }

  //====================
  // password Validation
  //====================
  // String Type Check
  if (typeof password !== "string") {
    throw Error(`password must be of type String`);
  }
  password = password.trim();
  // Empty just spaces check
  if (password.length === 0) {
    throw Error(`password cant be empty or just spaces`);
  }
  // Length Check
  if (password.length < 8) {
    throw Error(`password must be at least 8 characters`);
  }
  // Password Constraints:
  // 1. At least one uppercase character
  if (!/[A-Z]/.test(password)) {
    throw Error(`password must contain at least one uppercase character`);
  }
  // 2. At least one number
  if (!/[0-9]/.test(password)) {
    throw Error(`password must contain at least one number`);
  }
  // 3. At least one special character
  // (https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string)
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    throw Error(`password must contain at least one special character`);
  }

  //Query the db for the userId supplied, if it is not found, throw an error stating
  // "Either the userId or password is invalid".
  const usersCollection = await users(); // reference to the collection
  const user = await usersCollection.findOne({
    userId: { $regex: new RegExp(`^${userId}$`, "i") },
  });
  if (!user) {
    throw Error(`Either the userId or password is invalid`);
  }
  //If the userId supplied is found in the DB, you will then use bcrypt to compare
  //  the hashed password in the database with the password input parameter.
  const pwCompare = await bcrypt.compare(password, user.password);
  if (!pwCompare) {
    throw Error(`Either the userId or password is invalid`);
  }

  // lastlogin
  const currDate = new Date();
  const month = String(currDate.getMonth() + 1).padStart(2, "0");
  const day = String(currDate.getDate()).padStart(2, "0");
  const year = currDate.getFullYear();
  const currTime = currDate.getHours();
  const hours = String(currTime % 12 || 12).padStart(2, "0");
  const minutes = String(currDate.getMinutes()).padStart(2, "0");
  if (currTime < 12) {
    var timeUnit = "AM";
  } else {
    var timeUnit = "PM";
  }
  const lastLogin = `${month}/${day}/${year} ${hours}:${minutes}${timeUnit}`;

  await usersCollection.updateOne(
    { _id: user._id },
    { $set: { lastLogin: lastLogin } }
  );

  // return user WITHOUT PASSWORD
  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    userId: user.userId,
    email: user.email,
    address: user.address,
    inHoboken: user.inHoboken,
    signupDate: user.signupDate,
    lastLogin: lastLogin,
    role: user.role
  };
  // not in Hoboken check
  if (user.inHoboken === "no") {
    userData.state = user.state;
  }

  return userData;
};

export const addRating = async (toUserId, fromUserId, score) => {
  toUserId = checkId(toUserId);
  fromUserId = checkId(fromUserId);

  if (toUserId === fromUserId) throw "Cannot rate yourself";
  if (typeof score !== 'number' || score < 1 || score > 5) throw "Score must be 1-5";

  const userCol = await users();
  const user = await userCol.findOne({ _id: new ObjectId(toUserId) });
  if (!user) throw "Target user not found";

  const existingRating = user.ratings.find(r => r.userId === fromUserId);

  if (existingRating) {
    const newCount = user.ratingCount;                                    
    const totalMinusOld = user.ratingAverage * user.ratingCount          
                          - existingRating.score;                         
    const newAvg = (totalMinusOld + score) / newCount;                   

    await userCol.updateOne(
      { _id: new ObjectId(toUserId), "ratings.userId": fromUserId },
      {
        $set: {
          "ratings.$.score": score,
          ratingAverage: newAvg,
          ratingCount: newCount
        }
      }
    );
    return { updated: true };
  } 
  else {
    const newCount = user.ratingCount + 1;
    const total = user.ratingAverage * user.ratingCount + score;
    const newAvg = total / newCount;

    await userCol.updateOne(
      { _id: new ObjectId(toUserId) },
      {
        $push: { ratings: { userId: fromUserId, score } },
        $set: { ratingAverage: newAvg, ratingCount: newCount }
      }
    );
    return { updated: false };
  }
};


export const getUserByUserId = async (userId) => {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw "Invalid userId";
  }
  const userCollection = await users();
  const user = await userCollection.findOne(
    { userId: userId.trim() }
  );
  if (!user) throw "User not found";
  return user;
};