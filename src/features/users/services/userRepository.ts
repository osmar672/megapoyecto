import type { Credential, User } from "../../../core/types/domain";
import { createSalt, hashPassword } from "../../../core/security/password";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";

function readUsers(): User[] {
  return localStorageService.get<User[]>(storageKeys.users, []).value;
}

function writeUsers(users: User[]): void {
  localStorageService.set(storageKeys.users, users);
}

export const userRepository = {
  list(): User[] {
    return readUsers().sort((first, second) =>
      `${first.lastName}${first.firstName}`.localeCompare(`${second.lastName}${second.firstName}`),
    );
  },

  findById(userId: string): User | undefined {
    return readUsers().find((user) => user.id === userId);
  },

  emailExists(email: string, excludedUserId?: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    return readUsers().some(
      (user) => user.id !== excludedUserId && user.email.toLowerCase() === normalizedEmail,
    );
  },

  async create(
    values: Pick<User, "firstName" | "lastName" | "email" | "role" | "relatedStudentId">,
    temporaryPassword: string,
  ): Promise<User> {
    const timestamp = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      role: values.role,
      isActive: true,
      relatedStudentId: values.role === "STUDENT_FAMILY" ? values.relatedStudentId?.trim() : undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    writeUsers([...readUsers(), user]);

    const passwordSalt = createSalt();
    const credential: Credential = {
      userId: user.id,
      passwordSalt,
      passwordHash: await hashPassword(temporaryPassword, passwordSalt),
    };
    const credentials = localStorageService.get<Credential[]>(storageKeys.credentials, []).value;
    localStorageService.set(storageKeys.credentials, [...credentials, credential]);
    return user;
  },

  update(
    userId: string,
    values: Pick<User, "firstName" | "lastName" | "email" | "role" | "relatedStudentId">,
  ): User {
    let updatedUser: User | undefined;
    const users = readUsers().map((user) => {
      if (user.id !== userId) return user;
      updatedUser = {
        ...user,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        role: values.role,
        relatedStudentId: values.role === "STUDENT_FAMILY" ? values.relatedStudentId?.trim() : undefined,
        updatedAt: new Date().toISOString(),
      };
      return updatedUser;
    });
    if (!updatedUser) throw new Error("El usuario solicitado ya no existe.");
    writeUsers(users);
    return updatedUser;
  },

  deactivate(userId: string, currentUserId: string): User {
    if (userId === currentUserId) {
      throw new Error("No puedes desactivar la cuenta con la que tienes la sesión activa.");
    }
    const user = this.findById(userId);
    if (!user) throw new Error("El usuario solicitado ya no existe.");
    const updatedUser = { ...user, isActive: false, updatedAt: new Date().toISOString() };
    writeUsers(readUsers().map((candidate) => (candidate.id === userId ? updatedUser : candidate)));
    return updatedUser;
  },

  reactivate(userId: string): User {
    const user = this.findById(userId);
    if (!user) throw new Error("El usuario solicitado ya no existe.");
    const updatedUser = { ...user, isActive: true, updatedAt: new Date().toISOString() };
    writeUsers(readUsers().map((candidate) => (candidate.id === userId ? updatedUser : candidate)));
    return updatedUser;
  },
};
