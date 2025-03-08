const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../utils/bcrypt");
const { createToken } = require("../utils/jwtAuth");

const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.status(200).json({ allUsers });
};

const createUser = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  const data = { ...req.body, password: hashedPassword };
  const user = await prisma.user.create({ data: data });
  const token = createToken(user.userId);

  res.status(201).json({ ...user, token });
};

const updateUser = async (req, res) => {
  const { id: userID } = req.params;
  const user = await prisma.user.update({
    where: {
      id: Number(userID),
    },
    data: req.body,
  });
  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  const { id: userID } = req.params;
  const user = await prisma.user.delete({
    where: { id: Number(userID) },
  });

  res.status(200).json(user);
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  // Response indicating that the user has been logged out
  res.status(200).json({ message: "Logged out successfully" });
};
module.exports = { getAllUsers, createUser, updateUser, deleteUser, logout };
