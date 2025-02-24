import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuth, IDraSignUp, ILogin, ISettlorSignUp, ISignUpAdmin, ISignUpNUPRC, IUserView } from "../interface/authInterface"
import { Console } from "console";


const prisma = new PrismaClient();
const SECRET = "your_secret_key"; // Change this to a secure secret key authInterface
// hash password
// const hashedPassword = await bcrypt.hash(data.password, 10);


export const registerUser = async (data: any) => {
  const roles = await prisma.role.findFirst({ where: { roleName: "ADMIN" } });
  console.log(roles, "roles")
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  // console.log(existingUser, "fromexistingUserService")
  if (existingUser) throw new Error("User with this email already exists");

  // hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      email: data.email,
      address: data.address || null,
      phoneNumber: data.phoneNumber || null,
      community: data.community || null,
      state: data.state || null,
      status: 1,
      localGovernmentArea: data.localGovernmentArea || null,
      role: roles?.roleId ? { connect: { roleId: roles?.roleId } } : undefined,
      password: hashedPassword
    } as Prisma.UserCreateInput
  });

};

export const registerAdmin = async (data: ISignUpAdmin, isCreate: boolean) => {
  if (isCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("User with this email already exists");
    // hash password
    const hashedPassword = await bcrypt.hash("12345", 10);
    return prisma.user.create({
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        role: data.roleId ? { connect: { roleId: data.roleId } } : undefined,
        trust: data.trustId ? { connect: { trustId: data.trustId } } : undefined,
        status: 0,
        password: hashedPassword
      } as Prisma.UserCreateInput
    });
  } else {
    return prisma.user.update({
      where: { email: data.email },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        role: data.roleId ? { connect: { roleId: data.roleId } } : undefined,
        trust: data.trustId ? { connect: { trustId: data.trustId } } : undefined,
        status: 0
      },
    });
  }
};

export const registerNuprc = async (data: ISignUpNUPRC, isCreate: boolean) => {

  const roles = await prisma.role.findFirst({ where: { roleName: "NUPRC-ADR" } });

  if (isCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("User with this email already exists");
    // hash password
    const hashedPassword = await bcrypt.hash("12345", 10);
    return prisma.user.create({
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        role: roles?.roleId ? { connect: { roleId: roles?.roleId } } : undefined,
        password: hashedPassword
      } as Prisma.UserCreateInput
    });
  } else {
    return prisma.user.update({
      where: { email: data.email },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phoneNumber: data.phoneNumber || null,
      }
    });
  }
};
export const registerDRA = async (data: IDraSignUp, isCreate: boolean) => {

  const roles = await prisma.role.findFirst({ where: { roleName: "DRA" } });

  if (isCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("User with this email already exists");
    // hash password
    const hashedPassword = await bcrypt.hash("12345", 10);
    return prisma.user.create({
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        role: roles?.roleId ? { connect: { roleId: roles?.roleId } } : undefined,
        password: hashedPassword
      } as Prisma.UserCreateInput
    });
  } else {
    return prisma.user.update({
      where: { email: data.email },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phoneNumber: data.phoneNumber || null,
      }
    });
  }
};
export const registerSettlor = async (data: ISettlorSignUp, isCreate: boolean) => {
  if (isCreate) {
    const existingSettlor = await prisma.settlor.findUnique({ where: { omlCode: data.omlCode } });
    if (existingSettlor) throw new Error("Settlor with this OmlCode already exists");

    return prisma.settlor.create({
      data: {
        settlorName: data.settlorName || null,
        omlCode: data.omlCode,
        contactName: data.contactName || null,
        contactEmail: data.contactEmail || null,
        contactPhoneNumber: data.contactPhoneNumber,
      }
    });
  } else {
    return prisma.settlor.update({
      where: { omlCode: data.omlCode },
      data: {
        settlorName: data.settlorName || null,
        contactName: data.contactName || null,
        contactEmail: data.contactEmail || null,
        contactPhoneNumber: data.contactPhoneNumber,
      }
    });
  }
};


export const loginUser = async (data: ILogin) => {

  const user: IUserView[] = await prisma.$queryRaw`
  SELECT * FROM user_view WHERE email = ${data.email}
`;

  if (user.length < 1) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(data.password, user[0].password as string);

  if (!isPasswordValid) throw new Error("Invalid credentials");


  return jwt.sign(user[0], SECRET, { expiresIn: "1h" });
};