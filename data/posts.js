import { checkStringIsGood, checkForNonSpace, checkExists, checkString, checkId, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, checkPosterEmail,
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable } from "../helpers.js"
import { users, posts } from "../config/mongoCollections.js"
import { ObjectId } from 'mongodb'
import nodemailer from "nodemailer"

const createPost = async (
    postTitle,
    vehicleType,
    vehicleTags,
    vehicleCondition,
    posterUsername,
    posterName,
    maxRentalHours,
    maxRentalDays,
    hourlyCost,
    dailyCost,
    location,
    image, // expects a path string
    whenAvailable
) => {
    // I believe many of these are called incorrectly - for example, checkPosterUsername currently only has one input... unless there's some sort of 496-esque overflow mechanic in JS so that the string will apply for a string check function within chckPosterUsername? 
    //also, I think posterUsername and posterName will come from their account information, which we'll get from cookies, and since it's our internal info and not something the user submits, I don't think we need to check it? Something to ask him about. They'll still be passed into this function from the route but I don't think we need to check them.
    //I agree that they are being called wrong. Removing the second 'Vehicle Type' field from the checkType call still works, though. Strange. Leaving as is since it functions but keeping checkType changed so we know it works. -Jack
    postTitle = checkTitle(postTitle, 'Post Title')
    vehicleType = checkType(vehicleType)
    vehicleTags = checkTags(vehicleTags, 'Vehicle Tags')
    vehicleCondition = checkCondition(vehicleCondition, 'Vehicle Condition')
    posterUsername = checkPosterUsername(posterUsername, 'Poster Username') 
    posterName = checkPosterName(posterName, 'Poster Name')
    [maxRentalHours, maxRentalDays] = checkMaxRental(maxRentalHours, maxRentalDays)
    [hourlyCost, dailyCost] = checkCost(hourlyCost, dailyCost)
    location = checkString(location, 'Location')
    image = checkImage(image)
    whenAvailable = checkWhenAvailable(whenAvailable, 'When Available')

    let newPost = {
        postTitle: postTitle,
        vehicleType: vehicleType,
        vehicleTags: vehicleTags,
        vehicleCondition: vehicleCondition,
        currentlyAvailable: true,
        vehicleComments: [],
        posterUsername: posterUsername,
        posterName: posterName,
        maxRentalHours: maxRentalHours,
        maxRentalDays: maxRentalDays,
        hourlyCost: hourlyCost,
        dailyCost: dailyCost,
        location: location,
        image: image,
        whenAvailable: whenAvailable,
        requests: [], //this is an array of objects containing extraComments, startDate, endDate, and the Id of the requester
        taken: [] // this is an array of starDate, endDate, and Id of requester
    }
    
    const postCollection = await posts();
    const insertInfo = await postCollection.insertOne(newPost);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add post';
    }
    
    const newId = insertInfo.insertedId.toString();
    const thePost = await getPostById(newId);
    return thePost;
};

const getPostById = async (postId) => {
    checkId(postId);
    const postCollection = await posts();
    const thePost = await postCollection.findOne({_id: new ObjectId(postId)});
    if (thePost === null) throw 'No post with that id'; //might want to throw a 404 or 500 here depending on how we use the function
    thePost._id = thePost._id.toString()
    return thePost;
};

// gets all of the posts in the 'posts' collection
const getAllPosts = async () => {
    const postCollection = await posts();
    let postList = await postCollection.find({}).toArray();
    if (!postList) {
        throw 'getAllPosts: could not get all posts';
    }

    postList = postList.map(elem => {elem._id = elem._id.toString(); return elem;});
    return postList;
};

// filters posts by the specified tags
// allows for search for all of the tags combined, or posts containing at least one provided tag
const filterPostsByTags = async (tags, filterType) => {
    // if no tags were provided, just return all posts
    if (!tags) {
        getAllPosts();
    } else {
        // Input validation for tags
        if (!Array.isArray(tags)) {
            throw 'filterPostsByTags: provided list of tags must be an array';
        }

        // validate each tag passed and make it lowercase
        tags = tags.map(tag => checkString(tag, `${tag}`).toLowerCase()); // Passing the `${tag}` as varName might not work
        // validate filterType
        if (typeof filterType !== 'string' || (filterType !== '$in' && filterType !== '$all')) {
            throw 'filterPostsByTags: invalid operator for querying the db';
        }

        // build query based on provided filterType
        //     $all to get posts that contain ALL of the tags provided
        //     $in to get posts that contain AT LEAST ONE of the tags provided
        const query = {
            vehicleTags: {
                [filterType]: tags
            }
        };

        // look for posts with the specified tags
        const postCollection = await posts();
        const postsWithTags = await postCollection.find(query).toArray();

        // return posts
        return postsWithTags;
    }
};

const filterPostsBySingleTag = async (tag) => {
    if (!tag) {
        return await getAllPosts();
    }

    tag = checkString(tag, 'Tag').toLowerCase();

    const postCollection = await posts();
    const filteredPosts = await postCollection.find({
        $or: [
            { vehicleType: { $regex: tag, $options: 'i' } },
            { vehicleTags: { $regex: tag, $options: 'i' } }
        ]
    }).toArray();

    return filteredPosts;
}

// finds posts based on matching their titles to the prefix provided
const filterPostsByTitle = async (prefix) => {
    // Input validation for prefix
    if (!prefix || typeof prefix !== 'string') {
        return [];
    }
    // get length of prefix
    let prefixLength = prefix.trim().length;
    // get posts
    const allPosts = await getAllPosts();
    // filter posts based on whether their titles start with the provided prefix
    const filteredPosts = allPosts.filter(
        post => {
            const postTitle = post.postTitle.toLowerCase();
            if (postTitle.length < prefixLength) {
                return false;
            } else {
                let wordsInTitle = postTitle.split(' ');
                let check_words = wordsInTitle.some(word => word.startsWith(prefix.trim().toLowerCase()));
                let check_string = postTitle.startsWith(prefix.trim().toLowerCase());
                return check_words || check_string;
            }
        }
    );
    // return posts that have title prefix
    return filteredPosts;
};

const createComment = async (postId, posterUsername, posterFirstName, posterLastName, body) => {
    // Input validation for posterUsername, posterName, and body
    if (!postId || !posterUsername || !posterFirstName || !posterLastName || !body) {
        throw "Missing required fields for comment"
    }
    //=======================
    // userId validation
    //=======================
    const userId = posterUsername.trim();
    // Check if userId is empty
    if (userId.length === 0) {
      throw "User ID cannot be empty"
    }
    // Regex check for lettters and numbers only
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      throw "User ID can only contain letters and numbers";
    }
    //=======================
    // firstName validation
    //=======================
    const firstName = posterFirstName.trim();

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
    const lastName = posterLastName.trim();
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
    // body validation
    //=======================
    body = body.trim();
    // Check if body is empty
    if (body.length === 0) {
      throw "Body cannot be empty";
    }
    // Check length
    if (body.length < 2 || body.length > 999) {
      throw "Body must be between 2-999 characters";
    }

    const fullName = `${firstName} ${lastName}`;

    let newComment = { 
        _id: (new ObjectId()), //removed the .toString() bit because then it wouldn't be an ObjectId it'd be a string
        Username: userId,
        Name: fullName,
        commentDate: new Date().toLocaleDateString(),
        Body: body
      }
    
    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { vehicleComments: newComment } }
    );
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0) {
        throw 'Could not add comment to post';
    }

    //not too sure what to return here, this can be changed
    return await getPostById(postId);

};


const checkRequest = async(userId, postId, extraComments, startDate, endDate) => {
    if(typeof extraComments !== "string") throw "Extra Comments must be a string";
    startDate = checkString(startDate, "startDate");
    endDate = checkString(endDate, "endDate");

    const postCollection = await posts();
    const vehicle = await postCollection.findOne(
        { _id: new ObjectId(postId) }
    );
    let startDate2 = new Date(startDate);
    let endDate2 = new Date(endDate);
    let now = new Date();
    let cost = 0;
    let millsInDay  = 86400000;
    let millsInHour = 86400000 / 24;
    let difference = 0;
    let numHours = undefined;
    let numDays = undefined;
    if(endDate2.getTime() <= startDate2.getTime()) throw "Invalid end Time"
    if(startDate2.getTime() <= now.getTime()) throw "Invalid Start Time"
    if((difference = endDate2.getTime() - startDate2.getTime()) < millsInDay){ // if time is less than a day
        if(vehicle.hourlyCost === 0)throw "This vehicle cannot be rented for more than a day"
        numHours = Math.ceil(difference / millsInHour);
        if (numHours > vehicle.maxRentalHours) throw `This vehicle cannot be rented for more than ${vehicle.maxRentalHours} hours`
        cost = vehicle.hourlyCost * numHours;
    }
    else{
        if(vehicle.dailyCost === 0)throw "This vehicle cannot be rented for more than 24 hours"
        numDays = Math.ceil(difference / millsInDay);
        if (numDays > vehicle.maxRentalDays) throw `This vehicle cannot be rented for more than ${vehicle.maxRentalDays} days`
        cost = vehicle.dailyCost * numDays;
    };
    
    for(let x of vehicle.taken){
        let takenStart = new Date(x.startDate);
        let takenEnd = new Date(x.endDate);
        if(startDate2.getTime() > takenStart.getTime() && startDate2.getTime() < takenEnd.getTime()){
            //basically if your start time is taken, fail
           throw "Invalid start time"
        }
        if(endDate2.getTime() > takenStart.getTime() && endDate2.getTime() < takenEnd.getTime()){
            //basically if your end time is taken, fail
            throw "Invalid end time"
        }
    }

   
    if(numHours){
        return {hours: numHours, costPerHour: vehicle.hourlyCost, cost: cost}
    }
    else{
        return {days: numDays, costPerDay: vehicle.dailyCost, cost: cost}
    }
}

const createRequest = async(userId, postId, extraComments, startDate, endDate) => {
    if(typeof extraComments !== "string") throw "Extra Comments must be a string";
    startDate = checkString(startDate, "startDate");
    endDate = checkString(endDate, "endDate");
    if(typeof postId !== "string" || !ObjectId.isValid(postId)) throw "invalid postId"
    const postCollection = await posts();
    const vehicle = await postCollection.findOne(
        { _id: new ObjectId(postId) }
    );
    const userCollection = await users();
    const owner = await userCollection.findOne(
        {userId: { $regex: new RegExp(userId, 'i')}}
    );
    if(!vehicle) throw "Could not find vehicle";
    if(!owner) throw "Could not find vehicle owner";
    let newRequest = {
        extraComments: extraComments,
        startDate: startDate,
        endDate: endDate,
        requestingUser: userId,
        title: vehicle.postTitle,
        vehicleId: vehicle._id.toString()
    }
    let startDate2 = new Date(startDate);
    let endDate2 = new Date(endDate);
    if (startDate2 == "Invalid Date" || endDate2 == "Invalid Date") {
        throw "Invalid start or end date";
      }
    let now = new Date();
    let cost = 0;
    let millsInDay  = 86400000;
    let millsInHour = 86400000 / 24;
    let difference = 0;
    let numHours = undefined;
    let numDays = undefined;
    if(endDate2.getTime() <= startDate2.getTime()) throw "Invalid end Time"
    if(startDate2.getTime() <= now.getTime()) throw "Invalid Start Time"
    if((difference = endDate2.getTime() - startDate2.getTime()) < millsInDay){ // if time is less than a day
        if(vehicle.hourlyCost === 0)throw "This vehicle cannot be rented for more than a day"
        numHours = Math.ceil(difference / millsInHour);
        if (numHours > vehicle.maxRentalHours) throw `This vehicle cannot be rented for more than ${vehicle.maxRentalHours} hours`
        cost = vehicle.hourlyCost * numHours;
    }
    else{
        if(vehicle.dailyCost === 0)throw "This vehicle cannot be rented for more than 24 hours"
        numDays = Math.ceil(difference / millsInDay);
        if (numDays > vehicle.maxRentalDays) throw `This vehicle cannot be rented for more than ${vehicle.maxRentalDays} days`
        cost = vehicle.dailyCost * numDays;
    };
    
    for(let x of vehicle.taken){
        let takenStart = new Date(x.startDate);
        let takenEnd = new Date(x.endDate);
        if(startDate2.getTime() > takenStart.getTime() && startDate2.getTime() < takenEnd.getTime()){
            //basically if your start time is taken, fail
            throw "Invalid start time"
        }
        if(endDate2.getTime() > takenStart.getTime() && endDate2.getTime() < takenEnd.getTime()){
            //basically if your end time is taken, fail
            throw "Invalid end time"
        }
    }

    const updateInfo = await postCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { requests: newRequest } }
    );
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0) {
        throw 'Could not handle request. Please try again later.';
    }

    const updateInfo2 = await userCollection.updateOne(
        {userId: { $regex: new RegExp(userId, 'i')}},
        {$push: { requests: newRequest, clients: userId } }
    );
    if (!updateInfo2.acknowledged || updateInfo2.modifiedCount === 0) {
        throw 'Could not handle request. Please try again later.';
    }



    if(numHours){
        return {hours: numHours, costPerHour: vehicle.hourlyCost, cost: cost}
    }
    else{
        return {days: numDays, costPerDay: vehicle.dailyCost, cost: cost}
    }
}

const emailFunc = async(userEmail, ownerEmail, isAccepted, startTime, endTime, postTitle) =>{ //we use this to send the reply to the client after

    var transporter = nodemailer.createTransport({ //general format gotten from w3 schools
      service: 'gmail',
      auth: {
        user: 'noreplymicromobile@gmail.com',
        pass: 'lohh vczi eyyk bmux'
      }
    });
    let subject = "Accepted Vehicle Request"
    let text = `Your request for ${postTitle} from ${startTime} to ${endTime} was accepted. The owner's email is ${ownerEmail}. You may contact them for further arrangement if necessary.`
    
    if(!isAccepted){subject = "Denied Vehicle Requests"; text = `Your request for ${postTitle} from ${startTime} to ${endTime} was denied.`}
    
    var mailOptions = {
      from: 'noreplymicromobile@gmail.com',
      to: userEmail,
      subject: subject,
      text: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

const requestAccept = async(requestingUser, startDate, endDate, vehicleId) =>{
    startDate = checkString(startDate, "startDate");
    endDate = checkString(endDate, "endDate");
    let startDate2 = new Date(startDate);
    let endDate2 = new Date(endDate);
    if (startDate2 == "Invalid Date" || endDate2 == "Invalid Date") {
        throw "Invalid start or end date";
    }
    console.log(vehicleId)
   if(typeof vehicleId !== "string" || !ObjectId.isValid(vehicleId)) throw "bad vehicleId";

    const postCollection = await posts();
    const vehicle = await postCollection.findOne(
        { _id: new ObjectId(vehicleId) }
    );
    let userId = vehicle.posterUsername;
    const userCollection = await users();
    console.log(userId)
    const owner = await userCollection.findOne(
        {userId: { $regex: new RegExp(userId, 'i')}}
    );
    if(!vehicle) throw "Could not find vehicle";
    if(!owner) throw "Could not find vehicle owner";

    let y, z;
    for(let x of owner.requests){
        let requestStart = new Date(x.startDate);
        let requestEnd = new Date(x.endDate);
        if(startDate2.getTime() === requestStart.getTime() && endDate2.getTime() === requestEnd.getTime() && x.vehicleId === vehicleId){
            y = x;
        }
    }
    for(let x of vehicle.requests){
        let requestStart = new Date(x.startDate);
        let requestEnd = new Date(x.endDate);
        if(startDate2.getTime() === requestStart.getTime() && endDate2.getTime() === requestEnd.getTime() && x.vehicleId === vehicleId){
            z = x;
        }
    }
    if(y === undefined || z === undefined) throw "Either the vehicle does not exist or the start and end dates are incorrect"
    let newReqPerson = owner.requests.filter(x => x !== y);
    let newReqVehicle = vehicle.requests.filter(x => x !== z);

    let isUser = 0;
    for(let x of owner.clients){
        if (x === requestingUser){
            isUser = 1;
        }
    }
    let newClients = owner.clients;
    console.log(owner.clients);
    if(isUser === 0){
        newClients.push(requestingUser);
    }
    console.log(vehicle.taken)
    let newTaken = vehicle.taken;
    newTaken.push(y);
    console.log(newTaken);

    const updateInfo = await postCollection.updateOne(
        { _id: new ObjectId(vehicleId) },
        { $set: { requests: newReqVehicle, taken: newTaken } }
    );
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0) {
        throw 'Could not handle request. Please try again later.';
    }

    const updateInfo2 = await userCollection.updateOne(
        {userId: { $regex: new RegExp(userId, 'i')}},
        {$set: { requests: newReqPerson, clients: newClients} }
    );
    if (!updateInfo2.acknowledged || updateInfo2.modifiedCount === 0) {
        throw 'Could not handle request. Please try again later.';
    }

    const returnValue = await userCollection.findOne({userId: { $regex: new RegExp(requestingUser, 'i')}})
    return returnValue.email

}
const requestDeny = async(requestingUser, startDate, endDate, vehicleId) =>{
    startDate = checkString(startDate, "startDate");
    endDate = checkString(endDate, "endDate");
    let startDate2 = new Date(startDate);
    let endDate2 = new Date(endDate);
    if (startDate2 == "Invalid Date" || endDate2 == "Invalid Date") {
        throw "Invalid start or end date";
      }
    if(typeof vehicleId !== "string" || !ObjectId.isValid(vehicleId)) throw "bad vehicleId";

    const postCollection = await posts();
    const vehicle = await postCollection.findOne(
        { _id: new ObjectId(vehicleId) }
    );
    let userId = vehicle.posterUsername
    const userCollection = await users();
    const owner = await userCollection.findOne(
        {userId: { $regex: new RegExp(userId, 'i')}}
    );
    if(!vehicle) throw "Could not find vehicle";
    if(!owner) throw "Could not find vehicle owner";

    let y, z;
    for(let x of owner.requests){
        let requestStart = new Date(x.startDate);
        let requestEnd = new Date(x.endDate);
        if(startDate2.getTime() === requestStart.getTime() && endDate2.getTime() === requestEnd.getTime() && x.vehicleId === vehicleId){
            y = x;
        }
    }
    for(let x of vehicle.requests){
        let requestStart = new Date(x.startDate);
        let requestEnd = new Date(x.endDate);
        if(startDate2.getTime() === requestStart.getTime() && endDate2.getTime() === requestEnd.getTime() && x.vehicleId === vehicleId){
            z = x;
        }
    }
    if(y === undefined || z === undefined) throw "Either the vehicle does not exist or the start and end dates are incorrect"
    let newReqPerson = owner.requests.filter(x => x !== y);
    let newReqVehicle = vehicle.requests.filter(x => x !== z);
 
    
    console.log(vehicleId)
    const updateInfo = await postCollection.updateOne(
        { _id: new ObjectId(vehicleId) },
        { $set: { requests: newReqVehicle } }
    );
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0) {
        throw 'Could not handle request. Please try again later. 1';
    }
    
    const updateInfo2 = await userCollection.updateOne(
        {userId: { $regex: new RegExp(userId, 'i')}},
        {$set: { requests: newReqPerson} }
    );
    if (!updateInfo2.acknowledged || updateInfo2.modifiedCount === 0) {
        throw 'Could not handle request. Please try again later. 2';
    }
    const returnValue = await userCollection.findOne({userId: { $regex: new RegExp(requestingUser, 'i')}})
    return returnValue.email
}

export default {
    createPost,
    getPostById,
    getAllPosts,
    filterPostsByTags,
    filterPostsBySingleTag,
    filterPostsByTitle,
    createComment,
    checkRequest,
    createRequest,
    emailFunc,
    requestAccept,
    requestDeny
 }