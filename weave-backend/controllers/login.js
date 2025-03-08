const { verifyPassword } = require("../utils/bcrypt");
const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");
const { createToken } = require("../utils/jwtAuth");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const login = async (req, res, next) => {
  //deconstruct email and password from the body

  const { email, password } = req.body;

  //first check: for no email or password
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email and password" });
  }
  //get the user from the database
  const user = await prisma.user.findUnique({ where: { email: email } });

  //check for the user in database
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: `No user with the email: ${email}}` });
  }

  //verify the password with the hashed password
  const isVerified = await verifyPassword(password, user.password);
  console.log(isVerified);
  if (!isVerified) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Please Check your Password" });
  }

  //create the JWT token for the user and send the response including the token
  const token = createToken({ id: user.userId });
  res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
  res.status(StatusCodes.OK).json({ user: user.email, token });
};

//checks for token
const checktoken = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.status(400).send({
            status: false,
            error: "Session has expired",
          });
        } else {
          const user = await prisma.user.findUnique({
            where: {
              userId: decodedToken.userId,
            },
            select: {
              pinnedProjects: true,
              userId: true,
              email: true,
              name: true,
              accountType: true,
            },
          });
          res.status(200).send({
            success: true,
            data: user,
          });
        }
      }
    );
  } else {
    res.status(400).send({
      status: false,
      error: "Need to Login to access",
    });
  }
};

module.exports = {
  login,
  checktoken,
};
