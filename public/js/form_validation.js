(function (){




// DOM API method

// Grabbing Form
let myRegisterForm = document.getElementById("signup-form");
let myLoginForm = document.getElementById("signin-form");
let createListingForm = document.getElementById("createListingForm");
let requestVehicleForm = document.getElementById("requestVehicleForm");


// All register inputs
let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let userIdInput = document.getElementById("userId");
let passwordInput = document.getElementById("password");
let confirmPasswordInput = document.getElementById("confirmPassword");

// All login inputs
let loginUserIdInput = document.getElementById("userId");
let loginPasswordInput = document.getElementById("password");

// All createListing inputs
let postTitle = document.getElementById("postTitle");
let vehicleType = document.getElementById("vehicleType");
let vehicleTags1 = document.getElementById("vehicleTags1");
let vehicleTags2 = document.getElementById("vehicleTags2");
let vehicleTags3 = document.getElementById("vehicleTags3");
let protectionIncluded = document.getElementById("protectionIncluded");
let vehicleCondition = document.getElementById("vehicleCondition");
let maxRentalHoursInput = document.getElementById("maxRentalHours");
let maxRentalDaysInput = document.getElementById("maxRentalDays");
let hourlyCost = document.getElementById("hourlyCost");
let dailyCost = document.getElementById("dailyCost");
let imageInput = document.getElementById("image");

if(requestVehicleForm){
  $(function() {
    $('#datetimepicker1').datetimepicker();
     $('#datetimepicker2').datetimepicker();
  });
  requestVehicleForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    $(function() {
      let startDate = $('#datetimepicker1').data("DateTimePicker").date();
      let endDate = $('#datetimepicker2').data("DateTimePicker").date();
      let extraComments = $('#extraComments').val();
      let requestConfig ={
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
          extraComments: extraComments,
          startDate: startDate,
          endDate: endDate
        }),
        url: "/vehicleListings/requestVehicle"
      }
      $.ajax(requestConfig).then(function (responseMessage) {
        window.location.replace("/");//CHANGE THIS TO GO TO THE VEHICLE'S PAGE
      });
    });
  })
}

if (myRegisterForm) {
  myRegisterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const accumulatedErrors = [];

    //=======================
    // firstName validation
    //=======================
    const firstName = firstNameInput.value.trim();

    // Check if firstName is empty
    if (firstName.length === 0) {
      accumulatedErrors.push("First name cannot be empty");
    }
    // Regex check for lettters only
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      accumulatedErrors.push("First name can only contain letters");
    }
    // Check length
    if (firstName.length < 2 || firstName.length > 20) {
      accumulatedErrors.push("First name must be between 2-20 characters");
    }

    //=======================
    // lastName validation
    //=======================
    const lastName = lastNameInput.value.trim();
    // Check if lastName is empty
    if (lastName.length === 0) {
      accumulatedErrors.push("Last name cannot be empty");
    }
    // Regex check for lettters only
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      accumulatedErrors.push("Last name can only contain letters");
    }
    // Check length
    if (lastName.length < 2 || lastName.length > 20) {
      accumulatedErrors.push("Last name must be between 2-20 characters");
    }

    //=======================
    // userId validation
    //=======================
    const userId = userIdInput.value.trim();
    // Check if userId is empty
    if (userId.length === 0) {
      accumulatedErrors.push("User ID cannot be empty");
    }
    // Regex check for lettters and numbers only
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      accumulatedErrors.push("User ID can only contain letters and numbers");
    }
    // Check length
    if (userId.length < 5 || userId.length > 10) {
      accumulatedErrors.push("User ID must be between 5-10 characters");
    }

    //=======================
    // password validation
    //=======================
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Check if password is empty
    if (password.length === 0) {
      accumulatedErrors.push("Password cannot be empty");
    }
    if (confirmPassword.length === 0) {
      accumulatedErrors.push("Confirm Password cannot be empty");
    }
    // Password error checks
    if (!/[A-Z]/.test(password)) {
      accumulatedErrors.push(
        "Password must have at least one uppercase letter"
      );
    }
    if (!/[0-9]/.test(password)) {
      accumulatedErrors.push("Password must have at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      accumulatedErrors.push(
        "Password must have at least one special character"
      );
    }
    // Check length
    if (password.length < 8) {
      accumulatedErrors.push("Password must be at least 8 characters long");
    }
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      accumulatedErrors.push("Password and Confirm Password do not match");
    }
    //=========================
    // favoriteQuote validation
    //=========================
    const favoriteQuote = favoriteQuoteInput.value.trim();
    // Check if favoriteQuote is empty
    if (favoriteQuote.length === 0) {
      accumulatedErrors.push("Favorite quote cannot be empty");
    }
    // Check length
    if (favoriteQuote.length < 20 || favoriteQuote.length > 255) {
      accumulatedErrors.push(
        "Favorite quote must be between 20-255 characters"
      );
    }

    // If errors array has stuff display it
    const errorModel = document.getElementById("error-model");
    // clear old messsages
    if (errorModel) {
      errorModel.innerHTML = "";
    }
    if (accumulatedErrors.length > 0) {
      if (errorModel) {
        accumulatedErrors.forEach((error) => {
          const li = document.createElement("li");
          li.textContent = error;
          errorModel.appendChild(li);
        });
      } else {
        alert(accumulatedErrors.join("\n")); // safety net if errorModel is not found
      }
      return;
    }

    // If no errors, submit the form
    myRegisterForm.submit();
  });
}

if (myLoginForm) {
  myLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const accumulatedErrors = [];

    //=======================
    // userId validation
    //=======================
    const loginUserId = loginUserIdInput.value.trim();
    // Check if userId is empty
    if (loginUserId.length === 0) {
      accumulatedErrors.push("User ID cannot be empty");
    }
    // Regex check for lettters and numbers only
    if (!/^[a-zA-Z0-9]+$/.test(loginUserId)) {
      accumulatedErrors.push("User ID can only contain letters and numbers");
    }
    // Check length
    if (loginUserId.length < 5 || loginUserId.length > 10) {
      accumulatedErrors.push("User ID must be between 5-10 characters");
    }

    //=======================
    // password validation
    //=======================
    const loginPassword = loginPasswordInput.value.trim();

    // Check if password is empty
    if (loginPassword.length === 0) {
      accumulatedErrors.push("Password cannot be empty");
    }
    // Password error checks
    if (!/[A-Z]/.test(loginPassword)) {
      accumulatedErrors.push(
        "Password must have at least one uppercase letter"
      );
    }
    if (!/[0-9]/.test(loginPassword)) {
      accumulatedErrors.push("Password must have at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(loginPassword)) {
      accumulatedErrors.push(
        "Password must have at least one special character"
      );
    }
    // Check length
    if (loginPassword.length < 8) {
      accumulatedErrors.push("Password must be at least 8 characters long");
    }

    // If errors array has stuff display it
    const errorModel = document.getElementById("login-error-model");
    // clear old messsages
    if (errorModel) {
      errorModel.innerHTML = "";
    }
    if (accumulatedErrors.length > 0) {
      if (errorModel) {
        accumulatedErrors.forEach((error) => {
          const li = document.createElement("li");
          li.textContent = error;
          errorModel.appendChild(li);
        });
      } else {
        alert(accumulatedErrors.join("\n")); // Display errors in an alert if errorModel is not found
      }
      return;
    }
    // If no errors, submit the form
    myLoginForm.submit();
  });
}

if (createListingForm) {
  createListingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const accumulatedErrors = [];
    
    // Image validation
    if (imageInput.files.length === 0) {
      accumulatedErrors.push("Please select an image");
    } else {
      const file = imageInput.files[0];
      const validTypes = ['image/png', 'image/jpeg'];
      
      if (!validTypes.includes(file.type)) {
        accumulatedErrors.push("Only PNG and JPEG images are allowed");
      }
      
      if (file.size > 5 * 1024 * 1024) {
        accumulatedErrors.push("Image size must be less than 5MB");
      }
    }

    // Post title validation
    const title = postTitle.value.trim();
    if (title.length === 0) {
      accumulatedErrors.push("Post title cannot be empty");
    }
    if (title.length < 2) {
      accumulatedErrors.push("Post title must be at least 2 characters");
    }

    //good type
    const type = vehicleType.value.trim();
    let vehicleList = ["scooter", "skateboard", "bicycle", "other"]
    if(!vehicleList.includes(type)){
      accumulatedErrors.push("Please use the form submission on /createlisting instead of submitting your own.");
    }

    //good tags
    const tag1 = vehicleTags1.value.trim(),
          tag2 = vehicleTags2.value.trim(),
          tag3 = vehicleTags3.value.trim();
    let validTagList = ["none", "offroad", "electric", "2wheel", "4wheel", "new", "modded"]
    if(!validTagList.includes(tag1) || !validTagList.includes(tag2) || !validTagList.includes(tag3)){
      accumulatedErrors.push("Please use the form submission on /createlisting instead of submitting your own.");
    }

    //good protectionIncluded
    const protInclude = protectionIncluded.value.trim()
    if(protInclude !== "yes" && protInclude !== "no"){
      accumulatedErrors.push("protectionIncluded must be yes or no");
    }

    maxRentalDays = maxRentalDaysInput.value.trim()
    maxRentalHours = maxRentalHoursInput.value.trim()
        if (typeof maxRentalHours !== 'number') {
            if(typeof maxRentalHours === 'string'){
                maxRentalHours = Number(maxRentalHours.trim())
            }
            else{
                accumulatedErrors.push(`Max Rental Hours must be a number`)
            
            }
        }
        if (typeof maxRentalDays !== 'number')  {
            if(typeof maxRentalDays === 'string'){
                maxRentalDays = Number(maxRentalDays.trim())
            }
            else{
               accumulatedErrors.push(`Max Rental Days must be a number`)
            
            }
        }
        if(maxRentalHours > 24 || maxRentalHours < 0) accumulatedErrors.push("Max Rental Hours must be between 0 and 24")
        if(maxRentalDays > 365 || maxRentalDays < 0) accumulatedErrors.push("Max Rental Days must be between 0 and 365")
        if (maxRentalHours === 0 && maxRentalDays === 0) accumulatedErrors.push(`Max Rental Hours and Max Rental Days cannot both be 0`)

    

    // Vehicle condition validation
    const condition = vehicleCondition.value.trim();
    if (condition.length === 0) {
      accumulatedErrors.push("Vehicle condition cannot be empty");
    }
    if (isNaN(condition) || condition < 1 || condition > 5) {
      accumulatedErrors.push("Vehicle condition must be between 1.0 and 5.0");
    }

    // Cost validation
    const hourly = hourlyCost.value.trim();
    const daily = dailyCost.value.trim();
    if (hourly.length === 0 || daily.length === 0) {
      accumulatedErrors.push("Cost fields cannot be empty");
    }
    if (isNaN(hourly) || isNaN(daily)) {
      accumulatedErrors.push("Cost must be a valid number");
    }

    // Display errors if any
    const errorModel = document.getElementById("error-model");
    if (errorModel) {
      errorModel.innerHTML = "";
    }
    
    if (accumulatedErrors.length > 0) {
      if (errorModel) {
        accumulatedErrors.forEach((error) => {
          const li = document.createElement("li");
          li.textContent = error;
          errorModel.appendChild(li);
        });
      } else {
        alert(accumulatedErrors.join("\n"));
      }
      return;
    }

    // If no errors, submit the form
    createListingForm.submit();
  });
}
})();