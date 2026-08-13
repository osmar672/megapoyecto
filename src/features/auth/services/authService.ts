import type { AuthSession, Credential, User } from "../../../core/types/domain";
import { hashPassword } from "../../../core/security/password";
import { localStorageService, sessionStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";

const sessionDurationMs = 8 * 60 * 60 * 1000;

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

function readUsers(): User[] {
  return localStorageService.get<User[]>(storageKeys.users, []).value;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = readUsers().find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail,
    );

    if (!user || !user.isActive) {
      throw new AuthenticationError("El correo o la contraseña no son correctos.");
    }

    const credentials = localStorageService.get<Credential[]>(storageKeys.credentials, []).value;
    const credential = credentials.find((candidate) => candidate.userId === user.id);
    if (!credential) {
      throw new AuthenticationError("La cuenta no tiene acceso habilitado.");
    }

    const passwordHash = await hashPassword(password, credential.passwordSalt);
    if (passwordHash !== credential.passwordHash) {
      throw new AuthenticationError("El correo o la contraseña no son correctos.");
    }

    const issuedAt = new Date();
    const session: AuthSession = {
      userId: user.id,
      role: user.role,
      issuedAt: issuedAt.toISOString(),
      expiresAt: new Date(issuedAt.getTime() + sessionDurationMs).toISOString(),
    };
    sessionStorageService.set(storageKeys.session, session);
    return user;
  },

  logout(): void {
    sessionStorageService.remove(storageKeys.session);
  },

  getSession(): AuthSession | null {
    const result = sessionStorageService.get<AuthSession | null>(storageKeys.session, null);
    const session = result.value;
    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
      this.logout();
      return null;
    }

    const user = readUsers().find((candidate) => candidate.id === session.userId);
    if (!user || !user.isActive || user.role !== session.role) {
      this.logout();
      return null;
    }
    return session;
  },

  getCurrentUser(): User | null {
    const session = this.getSession();
    if (!session) {
      return null;
    }
    return readUsers().find((candidate) => candidate.id === session.userId) ?? null;
  },
};
