import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuth, ILogin } from "../interface/authInterface"


const prisma = new PrismaClient();
const SECRET = "your_secret_key"; // Change this to a secure secret key authInterface

export const registerUser = async (data: IAuth) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({ data: { ...data, password: hashedPassword } });
};

export const loginUser = async (data:ILogin) => {
  const user = await prisma.user.findUnique({ where: { email:data.email } });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  return jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
};