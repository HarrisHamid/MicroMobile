import { all } from "axios";
import {users} from "./config/mongoCollections.js";
import {ObjectId} from 'mongodb';

let vehicleTypes = ["scooter", "skateboard", "bicycle", "other"]; //I think we should store this somewhere else for expandability. vehicleListings.js and this file both have it hardcoded in. We should have a header where we can store this information instead of having to redo every file. -Jack
let vehicleTags = ['Electric', 'Gas', 'Hybrid', '2 Wheeler', '3 Wheeler', '4 Wheeler', 'Off Road', 'City'] 

const checkStringIsGood = (str, strName) => {//can't we merge this and the function below? Why would they be separate? (implmented this as just checkString)
    if (str === undefined) throw `${strName || 'String'} is undefined`
    if (typeof str !== 'string') throw `${strName || 'String'} is not a string`
    if (str.length === 0) throw `${strName || 'String'} is empty`
}
const checkForNonSpace = (str, strName) => {//can't we merge this and the function above? Why would they be separate? (implmented this as just checkString)
    if (str.trim().length === 0) throw `${strName || 'String'} is just empty spaces`
}
const checkExists = (vari) => {
    if (vari == undefined) throw `All fields need to have valid values`
}

const checkString = (strVal, varName) => { //this does general string checking and trimming
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  }
const checkId = (id) => { //this does general mongodb _id checking
        if (!id) throw 'Error: You must provide an id to search for';
        if (typeof id !== 'string') throw 'Error: id must be a string';
        id = id.trim();
        if (id.length === 0)
          throw 'Error: id cannot be an empty string or just spaces';
        if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
        return id;
      }

// HELPERS FOR VEHICLE POSTING
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const checkTitle = (postTitle) => {
    checkExists(postTitle)
    checkStringIsGood(postTitle, 'Title')
    checkForNonSpace(postTitle, 'Title')
    if (typeof postTitle !== 'string') throw `Title must be a string`
    postTitle = postTitle.trim()
    if (postTitle.length < 2) throw `Title must be at least 2 characters`
    return postTitle
}

const checkType = (vehicleType) => {
    checkExists(vehicleType)
    checkStringIsGood(vehicleType, 'Vehicle Type')
    vehicleType = vehicleType.trim()
    let found = false
    for (let i = 0; i < vehicleTypes.length; i++) {
        if (vehicleType.toLowerCase() === vehicleTypes[i].toLowerCase()) {
            found = true
            break
        }
    }
    if (!found) throw `${vehicleType} is not a valid vehicle type.`
    return vehicleType
}

const checkTags = (vehicleTags) => {
    checkExists(vehicleTags)
    for (let i = 0; i < vehicleTags.length; i++) {
        checkStringIsGood(vehicleTags[i], 'Vehicle Tag')
        vehicleTags[i] = vehicleTags[i].trim()
        let found = false
        for (let j = 0; j < vehicleTags.length; j++) {
            if (vehicleTags[i].toLowerCase() === vehicleTags[j].toLowerCase()) {
                found = true
                break
            }
        }
        if (!found) throw `${vehicleTags[i]} is not a valid vehicle tag.`
    }
    return vehicleTags
}

const checkCondition = (vehicleCondition) => {
    checkExists(vehicleCondition)
    if (typeof vehicleCondition !== 'number') {
        if(typeof vehicleCondition === 'string'){//this addition allows for string input too if there's a number within the string
            vehicleCondition = Number(vehicleCondition.trim())
        }
        else{
            throw `Vehicle Condition must be a number`
        }
    }
    if(isNaN(vehicleCondition)){throw "Vehicle Condition must be a number"}
    if (vehicleCondition < 1.0 || vehicleCondition > 5.0) throw `Vehicle Condition must be between 1.0 and 5.0`
    vehicleCondition = Math.round(vehicleCondition * 10) / 10
    return vehicleCondition
}
const checkAvailable = (currentlyAvailable) => {
    checkExists(currentlyAvailable)
    if (typeof currentlyAvailable !== 'boolean') throw `Currently Available must be a boolean`
    return currentlyAvailable
}
const checkPosterUsername = async (posterUsername) => { //checks if the username is available for account creation - no duplicates allowed
    posterUsername = checkString(posterUsername);
    const userCollection = await users();
    const isTaken = await userCollection.findOne({username: `/^${posterUsername}$/i`});//This will hopefully do a case-insensitive search.
    if(isTaken !== null){
        throw "Username is already taken. Please choose another."
    }
    return posterUsername
}
const checkPosterEmail = async (posterEmail) => { //checks if the email is available for account creation - no duplicates allowed - if it is a duplicate, we should ask them to enter another and give them a link to go to the login page to login with that email if they so choose
    posterEmail = checkString(posterEmail);
    const userCollection = await users();
    const isTaken = await userCollection.findOne({email: `/^${posterEmail}$/i`});//This will hopefully do a case-insensitive search.
    if(isTaken !== null){
        throw "This email already has an account associated with it. Please enter another or login with this email and it's appropriate password."
    }
    return posterEmail
}
const checkPosterName = async (posterName) => { //checks if the name is available for account creation - it only has to be a non-trivial string so this functions is simple
    posterName = checkString(posterName);
    return posterName
}
const checkMaxRental = (maxRentalHours, maxRentalDays) => {
    checkExists(maxRentalHours)
    checkExists(maxRentalDays)
    if (typeof maxRentalHours !== 'number') {
        if(typeof maxRentalHours === 'string'){
            maxRentalHours = Number(maxRentalHours.trim())
        }
        else{
            throw `Max Rental Hours must be a number`
        
        }
    }
    if (typeof maxRentalDays !== 'number')  {
        if(typeof maxRentalDays === 'string'){
            maxRentalDays = Number(maxRentalDays.trim())
        }
        else{
            throw `Max Rental Days must be a number`
        
        }
    }
    if(maxRentalHours > 24 || maxRentalHours < 0) throw "Max Rental Hours must be between 0 and 24"
    if(maxRentalDays > 365 || maxRentalDays < 0) throw "Max Rental Days must be between 0 and 365"
    if (maxRentalHours === 0 && maxRentalDays === 0) throw `Max Rental Hours and Max Rental Days cannot both be 0`
    return [maxRentalHours, maxRentalDays]
}
const checkCost = (hourlyCost, dailyCost) => {
    checkExists(hourlyCost)
    checkExists(dailyCost)
    if (typeof hourlyCost !== 'number') {
        if(typeof hourlyCost === 'string'){
            hourlyCost = Number(hourlyCost.trim())
        }
        else{
            throw `Hourly Cost must be a number`
        
        }
    }
    if (typeof dailyCost !== 'number') {
        if(typeof dailyCost === 'string'){
            dailyCost = Number(dailyCost.trim())
        }
        else{
            throw `Daily Cost must be a number`
        
        }
    }
    if (hourlyCost < 0) throw `Hourly Cost cannot be negative`
    if (dailyCost < 0) throw `Daily Cost cannot be negative`
    //if (hourlyCost > dailyCost) throw `Hourly Cost cannot be greater than Daily Cost`
    //^I decided to comment that out since what the user does isn't really our concern. If they don't want to rent it hourly but still will for a large amount of money, they might set the hourly cost to be more than the daily cost.
    if (hourlyCost === 0 && dailyCost === 0) throw `Hourly Cost and Daily Cost cannot both be 0`
    return [hourlyCost, dailyCost]
}
const checkImage = (image) => {
    // since image is a path string
    if (!image || typeof image !== 'string' || image.trim().length === 0) {
        throw 'Image path is required';
    }
    return image;
}

const checkWhenAvailable= (whenAvailable) => {
    //TODO
    return whenAvailable
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export  { checkStringIsGood, checkForNonSpace, checkExists, checkString, checkId, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, checkPosterEmail,
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable } //Add more here
    export default { checkStringIsGood, checkForNonSpace, checkExists, checkString, checkId, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, checkPosterEmail,
        checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable } //Add more here