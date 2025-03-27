import { Prisma, PrismaClient, Role, Settlor, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuth, IDraSignUp, ILogin, ISettlorSignUp, ISignUpAdmin, ISignUpNUPRC, IUserClient, IUserView } from "../interface/authInterface"
import { Console } from "console";
import { JWT_SECRET } from "../secrets";
import { bufferToHex, hexToBuffer } from "../utils/hexBufaBufaHex";
import { sendAdminRegistrationEmail } from "../utils/mail";
import { deleteFile, getFileName, removeFileExtension, uploadFile } from "../utils/upload";

const prisma = new PrismaClient();

const SECRET = "hcdtSecretKey";


export const registerUser = async (data: any) => {
  const roles = await prisma.role.findFirst({ where: { roleName: "SUPER ADMIN" } });

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

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

export const removeUser = async (userId: string): Promise<User> => {
  // console.log(userId, "remove")
  let user = await prisma.user.delete({ where: { userId } })
  return user
}



export const registerAdmin = async (data: ISignUpAdmin, isCreate: boolean) => {
  if (isCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("User with this email already exists");

    await sendAdminRegistrationEmail(data.email, data.lastName as string, "Admin")
    // hash password
    const hashedPassword = await bcrypt.hash("12345", 10);

    return prisma.user.create({
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        roleId: data.roleId || null,
        trusts: data.trusts,
        status: 0,
        password: hashedPassword
      } as Prisma.UserCreateInput
    });
  } else {
    return prisma.user.update({
      where: { userId: data.userId },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email || null,
        roleId: data.roleId || null,
        trusts: data.trusts,
        status: 0
      },
    });
  }
};

export const getUserById = async (userId: string): Promise<Array<IUserView>> => {
  // Fetch user data from the database
  const users: IUserView[] = await prisma.$queryRaw`
    SELECT * FROM user_view WHERE userId = ${userId}
  `;

  return users;
};

export const getAllAdmin = async (): Promise<Array<IUserView>> => {
  const users: IUserView[] = await prisma.$queryRaw`
    SELECT * FROM user_view WHERE role IN(${"SUPER ADMIN"},${"ADMIN"})
  `;
  return users;
}



export const registerNuprc = async (data: ISignUpNUPRC, isCreate: boolean) => {

  const roles = await prisma.role.findFirst({ where: { roleName: "NUPRC-ADR" } });

  if (isCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("User with this email already exists");

    await sendAdminRegistrationEmail(data.email, data.lastName as string, "NUPRC-ADR")

    // hash password
    const hashedPassword = await bcrypt.hash("12345", 10);
    return prisma.user.create({
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        roleId: roles?.roleId || null,
        password: hashedPassword
      } as Prisma.UserCreateInput
    });
  } else {
    return prisma.user.update({
      where: { userId: data.userId },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
      }
    });
  }
};

export const getAllNUPRC = async (): Promise<Array<IUserClient>> => {
  const users: IUserView[] = await prisma.$queryRaw`
   SELECT * FROM user_view WHERE role IN(${"NUPRC-ADR"})
 `;
  return users;
}


export const registerDRA = async (data: IDraSignUp, isCreate: boolean) => {

  const roles = await prisma.role.findFirst({ where: { roleName: "DRA" } });

  if (isCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("User with this email already exists");

    await sendAdminRegistrationEmail(data.email, data.lastName as string, "DRA")

    // hash password
    const hashedPassword = await bcrypt.hash("12345", 10);
    return prisma.user.create({
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        role: roles?.roleId ? { connect: { roleId: roles?.roleId } } : undefined,
        password: hashedPassword,
        trusts: data.trust
      } as Prisma.UserCreateInput
    });
  } else {
    return prisma.user.update({
      where: { userId: data.userId },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
        trusts: data.trust || null
      }
    })
  }
};

export const getAllDRA = async (): Promise<Array<IUserClient>> => {
  const users: IUserView[] = await prisma.$queryRaw`
   SELECT * FROM user_view WHERE role IN(${"DRA"})
 `;
  return users;
}

export const registerSettlor = async (data: Settlor, isCreate: boolean) => {
  const settlorData = {
    settlorName: data.settlorName ?? null,
    omlCode: data.omlCode ?? null,
    contactName: data.contactName ?? null,
    contactEmail: data.contactEmail ?? null,
    contactPhoneNumber: data.contactPhoneNumber ?? null,
  };

  if (isCreate) {
    const existingSettlor = await prisma.settlor.findUnique({
      where: { omlCode: data.omlCode as string },
    });
    if (existingSettlor) throw new Error("Settlor with this OmlCode already exists");

    return prisma.settlor.create({ data: settlorData });
  }

  return prisma.settlor.update({
    where: { settlorId: data.settlorId },
    data: settlorData,
  });
};
export const getAllSettlor = async (): Promise<Array<Settlor>> => {
  const user: Settlor[] = await prisma.$queryRaw`
  SELECT * FROM settlor
`;
  return user
}
export const getSettlor = async (settlorId: string): Promise<Settlor | null> => {

  const settlor: Settlor[] = await prisma.$queryRaw`
  SELECT * FROM settlor WHERE settlorId = ${settlorId}
`;

  return settlor == null ? null : settlor[0]
}

export const removeSettlor = async (settlorId: string): Promise<Settlor> => {
  const settlor = prisma.settlor.delete({ where: { settlorId } })
  return settlor
}

export const getAllRole = async (): Promise<Array<Role>> => {
  const role: Role[] = await prisma.$queryRaw`
  SELECT * FROM role
`;
  return role
}


export const loginUser = async (data: ILogin) => {

  const user: IUserView[] = await prisma.$queryRaw`
  SELECT * FROM user_view WHERE email = ${data.email}
`;

  if (user.length < 1) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(data.password, user[0].password as string);


  if (!isPasswordValid) throw new Error("Invalid credentials");

  return jwt.sign(user[0], JWT_SECRET as string, { expiresIn: "1h" });
};

export const changePassword = async (userId: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
  // Fetch user by ID
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  // Check if old password matches
  const passwordMatch = await bcrypt.compare(oldPassword, user.password as string);
  if (!passwordMatch) {
    throw new Error("Old password is incorrect.");
  }

  // Validate new password
  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirm password do not match.");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await prisma.user.update({
    where: { userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully." };
};

export const updateProfilePicture = async (userId: string, base64String: string, mimeType: string) => {
  if (!base64String || !mimeType) {
    throw new Error("Profile picture and MIME type are required.");
  }

  const user = await prisma.user.findUnique({ where: { userId } })

  if (user?.profilePic) {
    await deleteFile(removeFileExtension(user.profilePic))
  }

  let uploadUrl = await uploadFile(base64String, mimeType)

  const filePath = getFileName(uploadUrl)
  // Update user profile picture
  const updatedUser = await prisma.user.update({
    where: { userId },
    data: {
      profilePic: filePath,
      profilePicMimeType: mimeType,
    },
    select: { userId: true, profilePicMimeType: true, profilePic: true },
  });

  return { message: "Profile picture updated successfully.", data: updatedUser };
};