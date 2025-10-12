import { body } from "express-validator";

const userRegistervalidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),

    body("fullName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Full name is required"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email is invalid"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
  body("oldPassword")
  .notEmpty()
  .withMessage("Old Password required"),
  body("newPassword")
  .notEmpty()
  .withMessage("New password is required")
  ];
  
};

const userForgotPasswordValidator = () => {
  return [
  body("email")
   .notEmpty()
   .withMessage("Email is required")
   .isEmail()
   .withMessage("Email is invalid")
  ];
};

const userResetForgotPassword = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("Password is required")
  ]
}

export { 
  userRegistervalidator, 
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPassword
};
