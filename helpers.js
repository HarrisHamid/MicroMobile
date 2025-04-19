let vehicleTypes = ['Bike', 'Scooter', 'Skateboard']
let vehicleTags = ['Electric', 'Gas', 'Hybrid', '2 Wheeler', '3 Wheeler', '4 Wheeler', 'Off Road', 'City']

const checkStringIsGood = (str, strName) => {
    if (str === undefined) throw `${strName || 'String'} is undefined`
    if (typeof str !== 'string') throw `${strName || 'String'} is not a string`
    if (str.length === 0) throw `${strName || 'String'} is empty`
}
const checkForNonSpace = (str, strName) => {
    if (str.trim().length === 0) throw `${strName || 'String'} is just empty spaces`
}
const checkExists = (vari) => {
    if (vari == undefined) throw `All fields need to have valid values`
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
    if (typeof vehicleCondition !== 'number') throw `Vehicle Condition must be a number`
    if (vehicleCondition < 1.0 || vehicleCondition > 5.0) throw `Vehicle Condition must be between 1.0 and 5.0`
    vehicleCondition = Math.round(vehicleCondition * 10) / 10
    return vehicleCondition
}
const checkAvailable = (currentlyAvailable) => {
    checkExists(currentlyAvailable)
    if (typeof currentlyAvailable !== 'boolean') throw `Currently Available must be a boolean`
    return currentlyAvailable
}
const checkPosterUsername = (posterUsername) => {
    //TODO
    return posterUsername
}
const checkPosterName = (posterName) => {
    //TODO
    return posterName
}
const checkMaxRental = (maxRentalHours, maxRentalDays) => {
    checkExists(maxRentalHours)
    checkExists(maxRentalDays)
    if (typeof maxRentalHours !== 'number') throw `Max Rental Hours must be a number`
    if (typeof maxRentalDays !== 'number') throw `Max Rental Days must be a number`
    while (maxRentalHours > 24) {
        maxRentalHours -= 24
        maxRentalDays += 1
    }
    if (maxRentalHours === 0 && maxRentalDays === 0) throw `Max Rental Hours and Max Rental Days cannot both be 0`
    return [maxRentalHours, maxRentalDays]
}
const checkCost = (hourlyCost, dailyCost) => {
    checkExists(hourlyCost)
    checkExists(dailyCost)
    if (typeof hourlyCost !== 'number') throw `Hourly Cost must be a number`
    if (typeof dailyCost !== 'number') throw `Daily Cost must be a number`
    if (hourlyCost < 0) throw `Hourly Cost cannot be negative`
    if (dailyCost < 0) throw `Daily Cost cannot be negative`
    if (hourlyCost > dailyCost) throw `Hourly Cost cannot be greater than Daily Cost`
    if (hourlyCost === 0 && dailyCost === 0) throw `Hourly Cost and Daily Cost cannot both be 0`
    return [hourlyCost, dailyCost]
}
const checkImage = (image) => {
    //TODO
    return image
}

const checkWhenAvailable= (whenAvailable) => {
    //TODO
    return whenAvailable
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export { checkStringIsGood, checkForNonSpace, checkExists, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, 
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable } //Add more here