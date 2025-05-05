let progressChecker = (req, res, next) => {//this is the first middleware from lab 10 - it should help out with tracking progress for development
  let temp, temp2;
  if(!req.session.user){temp = "Not Authenticated"}
  else{temp = "Authenticated "}
  if(!req.session.user){temp2 = ""}
  else{temp2 = req.session.user.role} //user or admin - we'll want admin stuff eventually
  console.log(`${new Date().toUTCString()}: ${req.method} ${req.path} ${temp}${temp2}`);
  next();
}

let loginBlock = (req, res, next) => {//this and the middleware below make sure that authenticated users won't see the login or register pages and cannot login again or create another account
  //if(req.method == "GET"){ - I commented this out so that it works on all method but kept it here in case we want to have it only work for GET
  if (req.session.user) {
    return res.redirect("/profile")
  }
  //}
  next();
}

let registerBlock = (req, res, next) => {
  //if(req.method == "GET"){
  if (req.session.user){
    return res.redirect("/profile")
  }
  //}
  next();
}

let unauthorizedRedirect = (req, res, next) => { // this makes it so that you cannot access the profile page without being authorized
    if (req.method == "GET" && !req.session.user) {
      return res.redirect("/login")
    }
    next();
}

export default {
  progressChecker, 
  loginBlock,
  registerBlock,
  unauthorizedRedirect
}