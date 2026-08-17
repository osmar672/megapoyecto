import type { Credential, Student, User } from "../../../core/types/domain";
import { createSalt, hashPassword } from "../../../core/security/password";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import { createId } from "../../../core/utils/createId";

function readUsers(): User[] {
  return localStorageService.get<User[]>(storageKeys.users, []).value;
}

function writeUsers(users: User[]): void {
  localStorageService.set(storageKeys.users, users);
}

const institutionalEmailPattern = /^[^\s@]+@colegiohorizonte\.edu\.cr$/i;

type UserIdentityInput = Pick<
  User,
  "firstName" | "lastName" | "email" | "role" | "relatedStudentId"
>;

function normalizeIdentity(values: UserIdentityInput): UserIdentityInput {
  const normalized = {
    ...values,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
  };

  if (normalized.firstName.length < 2 || normalized.lastName.length < 2) {
    throw new Error("El nombre y el apellido deben tener al menos 2 caracteres.");
  }
  if (!institutionalEmailPattern.test(normalized.email)) {
    throw new Error("El correo debe pertenecer al dominio institucional.");
  }

  return normalized;
}

function resolveRelatedStudentId(values: UserIdentityInput): string | undefined {
  if (values.role !== "STUDENT_FAMILY") return undefined;

  const relatedStudentId = values.relatedStudentId?.trim();
  const students = localStorageService.get<Student[]>(storageKeys.students, []).value;
  if (!relatedStudentId || !students.some((student) => student.id === relatedStudentId && student.isActive)) {
    throw new Error("Selecciona un estudiante activo válido para la cuenta familiar.");
  }

  return relatedStudentId;
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

  relatedStudentExists(studentId: string): boolean {
    const normalizedStudentId = studentId.trim();
    return localStorageService
      .get<Student[]>(storageKeys.students, [])
      .value.some((student) => student.id === normalizedStudentId && student.isActive);
  },

  async create(
    values: UserIdentityInput,
    temporaryPassword: string,
  ): Promise<User> {
    const normalizedValues = normalizeIdentity(values);
    if (this.emailExists(normalizedValues.email)) {
      throw new Error("Ya existe un usuario con este correo institucional.");
    }
    if (temporaryPassword.length < 8) {
      throw new Error("La contraseña temporal debe tener al menos 8 caracteres.");
    }

    const relatedStudentId = resolveRelatedStudentId(normalizedValues);
    const timestamp = new Date().toISOString();
    const user: User = {
      id: createId("usr"),
      firstName: normalizedValues.firstName,
      lastName: normalizedValues.lastName,
      email: normalizedValues.email,
      role: normalizedValues.role,
      isActive: true,
      relatedStudentId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const passwordSalt = createSalt();
    const credential: Credential = {
      userId: user.id,
      passwordSalt,
      passwordHash: await hashPassword(temporaryPassword, passwordSalt),
    };

    const usersBeforeCreate = readUsers();
    const credentialsBeforeCreate = localStorageService.get<Credential[]>(
      storageKeys.credentials,
      [],
    ).value;
    try {
      localStorageService.set(storageKeys.credentials, [...credentialsBeforeCreate, credential]);
      writeUsers([...usersBeforeCreate, user]);
    } catch (error) {
      // La creación afecta dos claves: ante cualquier fallo restauramos ambas para evitar huérfanos.
      try {
        localStorageService.set(storageKeys.credentials, credentialsBeforeCreate);
      } catch {
        // Conservamos el error original; un fallo de almacenamiento seguirá visible para la UI.
      }
      try {
        writeUsers(usersBeforeCreate);
      } catch {
        // Intentamos cada restauración de forma independiente y conservamos el error original.
      }
      throw error;
    }

    return user;
  },

  update(
    userId: string,
    values: UserIdentityInput,
  ): User {
    const normalizedValues = normalizeIdentity(values);
    if (this.emailExists(normalizedValues.email, userId)) {
      throw new Error("Ya existe un usuario con este correo institucional.");
    }
    const relatedStudentId = resolveRelatedStudentId(normalizedValues);

    let updatedUser: User | undefined;
    const users = readUsers().map((user) => {
      if (user.id !== userId) return user;
      updatedUser = {
        ...user,
        firstName: normalizedValues.firstName,
        lastName: normalizedValues.lastName,
        email: normalizedValues.email,
        role: normalizedValues.role,
        relatedStudentId,
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
