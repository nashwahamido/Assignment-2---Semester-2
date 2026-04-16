const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
};


// --------------------- validation and sanitisation ---------------------------

module.exports = errorMiddleware;

// validation rules for registration
// we create a validation variable that contains all rules we want to apply to the data from a specific post request parameter:
let validationRegisterRules = [
check("username")
  .exists({ checkFalsy: true }).withMessage("Username is required")
  .isString().withMessage("Username must be a string")
  .trim()
  .isLength({ min: 3, max: 20 }).withMessage("Username must be 3–20 characters")
  .escape(),

check("useremail")
  .exists({ checkFalsy: true }).withMessage("Email is required")
  .isEmail().withMessage("Invalid email format")
  .normalizeEmail(),

check("userphone")
  .isMobilePhone().withMessage("Invalid phone number"),

check("gender")
  .optional(),

check("psw")
  .exists({ checkFalsy: true }).withMessage("Password is required")
  .isLength({ min: 6, max: 12}).withMessage("Password must be at least 6 characters or a maximum of 12")
];


// validation rules for verifying the registration code
// we create a validation variable that contains all rules we want to apply to the data from a specific post request parameter:
let validationVerifyRules = [
check(["code1", "code2", "code3", "code4", "code5", "code6"])
  .exists({ checkFalsy: true }).withMessage("All code fields are required")
  .isInt().withMessage("Each code must be a number")
  .isLength({ min: 1, max: 1 }).withMessage("Each code must be a single number")
  .trim(),
]

// validation rules for login
// we create a validation variable that contains all rules we want to apply to the data from a specific post request parameter:
let validationLoginRules = [
check("loginemail")
  .exists({ checkFalsy: true }).withMessage("Email is required")
  .isEmail().withMessage("Invalid email format")
  .normalizeEmail(),

check("loginpsw")
  .exists({ checkFalsy: true }).withMessage("Password is required")
  .isLength({ min: 6, max: 12}).withMessage("Password must be at least 6 characters or a maximum of 12")
];



