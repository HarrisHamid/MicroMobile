(function () {
  // DOM API method

  // Grabbing Form
  let myRegisterForm = document.getElementById("signup-form");
  let myLoginForm = document.getElementById("signin-form");
  let createListingForm = document.getElementById("createListingForm");

  // All register inputs
  let firstNameInput = document.getElementById("firstName");
  let lastNameInput = document.getElementById("lastName");
  let userIdInput = document.getElementById("userId");
  let passwordInput = document.getElementById("password");
  let confirmPasswordInput = document.getElementById("confirmPassword");
  let emailInput = document.getElementById("email");
  let addressInput = document.getElementById("address");

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
  let maxRentalHours = document.getElementById("maxRentalHours");
  let maxRentalDays = document.getElementById("maxRentalDays");
  let hourlyCost = document.getElementById("hourlyCost");
  let dailyCost = document.getElementById("dailyCost");
  let imageInput = document.getElementById("image");

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
      if (userId.length < 5) {
        accumulatedErrors.push("User ID must be at least 5 characters");
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
      //=======================
      // email validation
      //=======================
      const email = emailInput.value.trim();
      // Check if email is empty
      if (email.length === 0) {
        accumulatedErrors.push("Email cannot be empty");
      }
      // Regex check for valid email format
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        accumulatedErrors.push("Email is not valid");
      }

      //=======================
      // address validation
      //=======================
      const address = addressInput.value.trim();
      // Check if favoriteQuote is empty
      if (address.length === 0) {
        accumulatedErrors.push("Address cannot be empty");
      }
      // Lenght check
      if (address.length < 10) {
        accumulatedErrors.push("Address must be at least 10 characters long");
      }

      ///========================
      // inHoboken validation
      //========================
      const inHoboken = document.getElementById("inHoboken").value;
      const state = document.getElementById("state").value;

      if (inHoboken !== "yes" && inHoboken !== "no") {
        accumulatedErrors.push('Location must be "yes" or "no"');
      }

      //============================================
      // State Validation (only if not in Hoboken)
      //============================================
      if (inHoboken === "no") {
        if (!state || state === "") {
          accumulatedErrors.push(
            "You must select your state if not in Hoboken"
          );
        }
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
      if (loginUserId.length < 5) {
        accumulatedErrors.push("User ID must be at least 5 characters");
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
  //I set up the whenAvailable array functionality here.
  const idMap = { //Massive enumerator to map the id's for checkboxes to their index within the 
    m0: 0,
    m1: 1,
    m2: 2,
    m3: 3,
    m4: 4,
    m5: 5,
    m6: 6,
    m7: 7,
    m8: 8,
    m9: 9,
    m10:10,
    m11:11,
    m12:12,
    m13:13,
    m14:14,
    m15:15,
    m16:16,
    m17:17,
    m18:18,
    m19:19,
    m20:20,
    m21:21,
    m22:22,
    m23:23,

    t0: 24,
    t1: 25,
    t2: 26,
    t3: 27,
    t4: 28,
    t5: 29,
    t6: 30,
    t7: 31,
    t8: 32,
    t9: 33,
    t10:34,
    t11:35,
    t12:36,
    t13:37,
    t14:38,
    t15:39,
    t16:40,
    t17:41,
    t18:42,
    t19:43,
    t20:44,
    t21:45,
    t22:46,
    t23:47,

    w0: 48,
    w1: 49,
    w2: 50,
    w3: 51,
    w4: 52,
    w5: 53,
    w6: 54,
    w7: 55,
    w8: 56,
    w9: 57,
    w10:58,
    w11:59,
    w12:60,
    w13:61,
    w14:62,
    w15:63,
    w16:64,
    w17:65,
    w18:66,
    w19:67,
    w20:68,
    w21:69,
    w22:70,
    w23:71,

    h0: 72,
    h1: 73,
    h2: 74,
    h3: 75,
    h4: 76,
    h5: 77,
    h6: 78,
    h7: 79,
    h8: 80,
    h9: 81,
    h10:82,
    h11:83,
    h12:84,
    h13:85,
    h14:86,
    h15:87,
    h16:88,
    h17:89,
    h18:90,
    h19:91,
    h20:92,
    h21:93,
    h22:94,
    h23:95,

    f0: 96,
    f1: 97,
    f2: 98,
    f3: 99,
    f4: 100,
    f5: 101,
    f6: 102,
    f7: 103,
    f8: 104,
    f9: 105,
    f10:106,
    f11:107,
    f12:108,
    f13:109,
    f14:110,
    f15:111,
    f16:112,
    f17:113,
    f18:114,
    f19:115,
    f20:116,
    f21:117,
    f22:118,
    f23:119,

    s0: 120,
    s1: 121,
    s2: 122,
    s3: 123,
    s4: 124,
    s5: 125,
    s6: 126,
    s7: 127,
    s8: 128,
    s9: 129,
    s10:130,
    s11:131,
    s12:132,
    s13:133,
    s14:134,
    s15:135,
    s16:136,
    s17:137,
    s18:138,
    s19:139,
    s20:140,
    s21:141,
    s22:142,
    s23:143,

    u0: 144,
    u1: 145,
    u2: 146,
    u3: 147,
    u4: 148,
    u5: 149,
    u6: 150,
    u7: 151,
    u8: 152,
    u9: 153,
    u10:154,
    u11:155,
    u12:156,
    u13:157,
    u14:158,
    u15:159,
    u16:160,
    u17:161,
    u18:162,
    u19:163,
    u20:164,
    u21:165,
    u22:166,
    u23:167,
  }
  let head = -1;
  let tail = -1;
  let flip = 0;
  let headState = -1;
  let boxes = document.querySelectorAll("input[type='checkbox']");
  
  boxes.forEach(checkbox => {
    checkbox.addEventListener("change", function() {
      if(tail == -1){ //DO NOT DELETE!!! YOU NEED THIS LINE!!! When we change other boxes state we will set off their change event too you will get stuck in an infinite loop. -Jack
        if(flip == 0){ //select head
          head = idMap[this.id];
          flip = 1;
          if(this.checked){
            headState = 1;
          } else {
            headState = 0;
          }
        
        } else { //select tail
          tail = idMap[this.id];
          flip = 0;
          for(let i = head + 1; i < tail; i++){
            if(boxes[i].checked){
            } else {
            }
            boxes[i].checked = boxes[head].checked;
          }
          head = -1;
          tail = -1;
        }

      }
    })
  });

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

  // extra feature for outside of Hoboken
  // Hoboken location logic
  document.addEventListener("DOMContentLoaded", function () {
    const inHobokenSelect = document.getElementById("inHoboken");
    const stateSelectorDiv = document.getElementById("stateSelector");

    if (inHobokenSelect && stateSelectorDiv) {
      // Initial hide
      stateSelectorDiv.style.display = "none";

      // Toggle visibility on change
      inHobokenSelect.addEventListener("change", function () {
        if (this.value === "no") {
          stateSelectorDiv.style.display = "block";
        } else {
          stateSelectorDiv.style.display = "none";
        }
      });
    }
  });

  // terms and conditions
  document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("acceptTerms");
    const acceptBtn = document.getElementById("acceptButton");
    const loginBtn = document.getElementById("submit_button");

    if (checkbox && acceptBtn) {
      checkbox.addEventListener("change", () => {
        acceptBtn.disabled = !checkbox.checked;
      });

      acceptBtn.addEventListener("click", () => {
        // Enable login form
        document.getElementById("termsModal").remove();
        loginBtn.disabled = false;
      });

      // Disable login form until terms are accepted
      loginBtn.disabled = true;
    }
  });
})();
