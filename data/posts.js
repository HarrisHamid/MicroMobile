import { checkStringIsGood, checkForNonSpace, checkExists, checkString, checkId, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, checkPosterEmail,
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable }
from "../helpers.js"
import posts from "../config/mongoCollections.js"


//TODO: import {posts} from '../config/mongoCollections.js'
import {ObjectId} from 'mongodb'

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
    image,
    whenAvailable
) => {
    // I believe many of these are called incorrectly - for example, checkPosterUsername currently only has one input... unless there's some sort of 496-esque overflow mechanic in JS so that the string will apply for a string check function within chckPosterUsername? 
    //also, I think posterUsername and posterName will come from their account information, which we'll get from cookies, and since it's our internal info and not something the user submits, I don't think we need to check it? Something to ask him about. They'll still be passed into this function from the route but I don't think we need to check them.
    postTitle = checkTitle(postTitle, 'Post Title')
    vehicleType = checkType(vehicleType, 'Vehicle Type')
    vehicleTags = checkTags(vehicleTags, 'Vehicle Tags')
    vehicleCondition = checkCondition(vehicleCondition, 'Vehicle Condition')
    posterUsername = checkPosterUsername(posterUsername, 'Poster Username') 
    posterName = checkPosterName(posterName, 'Poster Name')
    [maxRentalHours, maxRentalDays] = checkMaxRental(maxRentalHours, maxRentalDays)
    [hourlyCost, dailyCost] = checkCost(hourlyCost, dailyCost)
    image = checkImage(image, 'Image')
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
        image: image,
        whenAvailable: whenAvailable
    }
    const postCollection = await posts();
    const insertInfo = await postCollection.insertOne(newPost);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add post';
    
    const newId = insertInfo.insertedId.toString();
    const thePost = await getPostById(newId);
    return thePost;
}

const getPostById = async (postId) =>{
    checkId(postId);
    const postCollection = await posts();
    const thePost = await postCollection.findOne({_id: new ObjectId(postId)});
    if (thePost === null) throw 'No movie with that id'; //might want to throw a 404 or 500 here depending on how we use the function
    thePost._id = thePost._id.toString()
    return thePost;
}