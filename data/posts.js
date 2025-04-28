import { checkStringIsGood, checkForNonSpace, checkExists, checkString, checkId, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, checkPosterEmail,
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable }
from "../helpers.js"
import {posts} from "../config/mongoCollections.js"


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

const getPostById = async (postId) => {
    checkId(postId);
    const postCollection = await posts();
    const thePost = await postCollection.findOne({_id: new ObjectId(postId)});
    if (thePost === null) throw 'No movie with that id'; //might want to throw a 404 or 500 here depending on how we use the function
    thePost._id = thePost._id.toString()
    return thePost;
}

// gets all of the posts in the 'posts' collection
const getAllPosts = async () => {
    const postCollection = await posts();
    let postList = await postCollection.find({}).toArray();
    if (!postList) {
        throw new Error('getAllPosts: could not get all posts');
    }

    postList = postList.map(elem => {elem._id = elem._id.toString(); return elem;});
    return postList;
}

// filters posts by the specified tags
// allows for search for all of the tags combined, or posts containing at least one provided tag
const filterPostsByTags = async (tags, filterType) => {
    // if no tags were provided, just return all posts
    if (!tags) {
        getAllPosts();
    } else {
        // Input validation for tags
        if (!Array.isArray(tags)) {
            throw new Error('filterPostsByTags: provided list of tags must be an array');
        }

        // validate each tag passed and make it lowercase
        tags = tags.map(tag => checkString(tag, `${tag}`).toLowerCase()); // Passing the `${tag}` as varName might not work
        // validate filterType
        if (typeof filterType !== 'string' || (filterType !== '$in' && filterType !== '$all')) {
            throw new Error('filterPostsByTags: invalid operator for querying the db');
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
    const allPosts = getAllPosts();
    // filter posts based on whether their titles start with the provided prefix
    const filteredPosts = allPosts.filter(
        post => {
            const postTitle = post.postTitle.toLowerCase();
            if (postTitle.length < prefixLength) {
                return false;
            } else {
                return postTitle.startsWith(prefix.trim().toLowerCase());
            }
        }
    );
    // return posts that have title prefix
    return filteredPosts;
}

export default (createPost, getPostById, getAllPosts, filterPostsByTags, filterPostsByTitle)