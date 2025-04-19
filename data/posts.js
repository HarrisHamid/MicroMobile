import { checkStringIsGood, checkForNonSpace, checkExists, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, 
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable } 
from "../helpers.js"

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
    //TODO: INSERT POST HERE
    return newPost
}