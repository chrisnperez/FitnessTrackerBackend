 
const requireUser = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "UnauthorizedError",
        message: "You must be logged in to perform this action",
        name: "Unauthorized",
      });
    }
    next();
  };
  
module.exports = {
   requireUser
};