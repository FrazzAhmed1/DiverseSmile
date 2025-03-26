import jwt from "jsonwebtoken"; // run this command to use this library: npm install jsonwebtoken

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;