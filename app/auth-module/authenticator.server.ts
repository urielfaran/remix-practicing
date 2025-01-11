import { Prisma, PrismaClient } from "@prisma/client";
// import { redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";
import { storage } from "./session.server";
import { redirect } from "react-router";

invariant(
  process.env.SESSION_EXPIRATION,
  "SESSION_EXPIRATION is not defined in env"
);

/**
 * Authenticator module for various authentication methods
 * @example
 * ```typescript
 * const user = await Authenticator.register(username, password);
 * ```
 */
export class Authenticator {
  private db: PrismaClient;
  private session_expiration_time: number;
  constructor(
    db: PrismaClient,
    session_expiration_time: number = Number(process.env.SESSION_EXPIRATION)
  ) {
    this.db = db;
    this.session_expiration_time = session_expiration_time;
  }
  /**
   * Calculates the session expiration date and time.
   *
   * This method determines when the current session will expire by adding the
   * session expiration duration to the current time. It returns the resulting
   * expiration date as a `Date` object.
   *
   * @returns A `Date` object representing the session expiration time.
   *
   */
  getSessionExpiration() {
    return new Date(Date.now() + this.session_expiration_time);
  }
  /**
   * Registers a new user in the system.
   *
   * This function checks if a user with the provided username already exists. If not, it creates a new user
   * with the given username and hashed password. Throws an error if the user already exists.
   *
   * @param username - The username address of the user to be registered.
   * @param password - The plaintext password of the user to be hashed and stored.
   *
   * @returns A promise that resolves to the newly created user object.
   *
   * @throws Will throw an error if a user with the provided username already exists.
   *
   * @example
   * ```typescript
   * const username = "test@example.com";
   * const password = "securePassword123";
   * const newUser = await authenticator.register(username, password);
   * console.log("User created:", newUser);
   * ```
   */
  async register(data: Prisma.UserCreateInput) {
    // const existingUser = await this.db.user.findUnique({
    //   where: { username: data.username },
    // });
    // if (existingUser) throw new Error("User already exists");
    const pepper = process.env.PASSWORD_PEPPER;
    invariant(pepper, "Password pepper is not defined");

    const pepperedPassword = data.password + pepper;
    const passwordHash = await bcrypt.hash(pepperedPassword, 10);
    const newUser = await this.db.user.upsert({
      where: { username: data.username },
      create: {
        ...data,
        password: passwordHash,
      },
      update: {
        ...data,
        password: passwordHash,
      },
    });

    return newUser;
  }
  /**
   * Changes the password of an existing user.
   *
   * This function verifies the old password, checks if the new passwords match,
   * hashes and peppers the new password, and updates the user's password in the database.
   *
   * @param oldPassword - The current password of the user.
   * @param newPassword - The new password the user wants to set.
   * @param newPasswordAgain - The confirmation of the new password.
   * @param userId - The unique identifier of the user.
   *
   * @returns A promise that resolves when the password is successfully updated.
   *
   * @throws Will throw an error if:
   * - The user is not found.
   * - The old password does not match the current password.
   * - The new password and confirmation password do not match.
   *
   * @example
   * ```typescript
   * const oldPassword = "currentPassword123";
   * const newPassword = "newSecurePassword456";
   * const newPasswordAgain = "newSecurePassword456";
   * const userId = 1;
   * await authenticator.changePassword(oldPassword, newPassword, newPasswordAgain, userId);
   * console.log("Password updated successfully");
   * ```
   */
  async changePassword(
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string,
    userId: number
  ) {
    //extract user
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("No user found");

    const pepper = process.env.PASSWORD_PEPPER;
    invariant(pepper, "Password pepper is not defined");

    const pepperedOldPassword = oldPassword + pepper;
    // check if the old password is correct
    const isValidPassword = await bcrypt.compare(
      pepperedOldPassword,
      user.password
    );
    if (!isValidPassword)
      throw new Error("Old password does not match current password");

    // check if two passwords are equal
    if (newPassword !== newPasswordAgain)
      throw new Error("New password and new password again do not match");

    const pepperedNewPassword = newPassword + pepper;
    const hashedNewPassword = await bcrypt.hash(pepperedNewPassword, 10);

    //update password
    await this.db.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }
  /**
   * Resets the password for a given user by hashing the new password and updating it in the database.
   *
   * @param newPassword - The new password that the user wants to set.
   * @param userId - The unique identifier of the user whose password is being reset.
   *
   * @returns A promise that resolves when the password has been successfully reset in the database.
   *
   * This function first hashes the new password using bcrypt with a salt rounds value of 10,
   * then updates the user's password in the database with the hashed value.
   */
  async resetPassword(newPassword: string, userId: number) {
    const pepper = process.env.PASSWORD_PEPPER;
    invariant(pepper, "Password pepper is not defined");

    const pepperedNewPassword = newPassword + pepper;
    const newPasswordHash = await bcrypt.hash(pepperedNewPassword, 10);
    await this.db.user.update({
      where: { id: userId },
      data: {
        password: newPasswordHash,
      },
    });
  }
  /**
   * Authenticates a user's credentials by checking the provided username and password against the database.
   *
   * @param username - The username address of the user.
   * @param password - The password provided by the user.
   * @returns A promise that resolves with the user object if the credentials are valid.
   * @throws An error if the credentials are invalid or the user does not exist.
   *
   * @example
   * const user = await authenticator.authenticateCredentials("user@example.com", "userPassword123");
   */
  async authenticateCredentials(username: string, password: string) {
    const user = await this.db.user.findUnique({ where: { username } });
    console.log(user);
    if (!user) {
      // For security reasons, we will want to run bcrypt compare even if the user doesn't exist.
      //  This prevents a timing based subchannel attacks, allowing attackers to determine whether a user exists without knowing the password.
      const randomPasswordString = (Math.random() + 1)
        .toString(36)
        .substring(10);
      await bcrypt.compare(password, randomPasswordString);
      throw new Error("Invalid credentials");
    }
    const pepper = process.env.PASSWORD_PEPPER;
    invariant(pepper, "Password pepper is not defined");

    const pepperedPassword = password + pepper;
    const isValidPassword = await bcrypt.compare(
      pepperedPassword,
      user.password
    );
    if (!isValidPassword) throw new Error("Invalid credentials");

    return user;
  }
  /**
   * Sets up Two-Factor Authentication (2FA) for the user by generating a secret, encrypting it, and updating
   * the user record in the database with the encrypted 2FA secret.
   *
   * @param userId - The ID of the user for whom 2FA is being set up.
   * @returns A promise that resolves with an object containing the QR code URL and the unencrypted secret.
   *
   * @example
   * const { qrCode, secret } = await authenticator.setup2FA(userId);
   */
  // async setup2FA(userId: number) {
  //   // console.log("userId ", userId)
  //   const user = await this.db.user.findUnique({ where: { id: userId } });
  //   if (!user) throw new Error('User not found');
  //   /*
  //    * Encrypts a generated secret for Two-Factor Authentication (2FA) using a predefined encryption key.
  //    * We use this as a security measure to ensure that even if the db is breached, the secret will
  //    * not be decrypted without the key from configuration.
  //    */
  //   const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  //   invariant(ENCRYPTION_KEY, 'ENCRYPTION_KEY required');

  //   const key = Uint8Array.from(Buffer.from(ENCRYPTION_KEY, 'hex'));
  //   const { secret, encryptedSecret, iv } = await generateEncryptedSecret(key);
  //   const service = process.env.TWOFA_SERVICE_NAME;
  //   invariant(service, 'TWOFA_SERVICE_NAME is not set in the configuration');
  //   const otpauth = otplib.authenticator.keyuri(user.username, service, secret);

  //   await this.db.user.update({
  //     where: { id: userId },
  //     data: { secret: encryptedSecret, iv },
  //   });

  //   const qrCode = await QRCode.toDataURL(otpauth || '');
  //   return { qrCode, secret: secret };
  // }
  /**
   * Verifies the 2FA token provided by the user to complete the authentication process.
   *
   * @param userId - The ID of the user whose 2FA token is being verified.
   * @param token - The 2FA token provided by the user.
   * @returns A promise that resolves to `true` if the token is valid.
   * @throws An error if the token is invalid or the user has not set up 2FA.
   *
   * @example
   * const isVerified = await authenticator.verify2FA(userId, "123456");
   */
  // async verify2FA(userId: number, token: string) {
  //   const user = await this.db.user.findUnique({ where: { id: userId } });
  //   if (!user || !user.secret || !user.iv) throw new Error('2FA not set up');

  //   const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  //   invariant(ENCRYPTION_KEY);
  //   const key = Uint8Array.from(Buffer.from(ENCRYPTION_KEY, 'hex'));

  //   const decodedDecryptedSecret = await getDecodedDecryptedSecret(
  //     user.secret,
  //     key,
  //     user.iv,
  //   );

  //   const isTotpValid = otplib.authenticator.verify({
  //     secret: decodedDecryptedSecret,
  //     token,
  //   });

  //   if (!isTotpValid) throw new Error('Invalid 2FA token');

  //   return true;
  // }
  /**
   * Creates a cookie session for an authenticated user.
   *
   * This function sets up a session for the authenticated user by storing their user ID
   * in the session and removing the `sessionId` cookie (used during the 2FA process).
   * It then redirects the user to the specified path.
   *
   * @param userId - The ID of the authenticated user.
   * @param redirectTo - The path to redirect the user after creating the session.
   *
   * @returns A redirection response with the `Set-Cookie` header to store the user session.
   *
   * @example
   * ```typescript
   * const userId = 123;
   * const redirectTo = "/dashboard";
   * return createUserSession(userId, redirectTo);
   * ```
   */
  async createUserSession(userId: number, redirectTo: string) {
    const session = await storage.getSession();
    session.set("userId", userId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  }
  /**
   * Creates a database session for 2FA authentication.
   *
   * This function generates a session in the database with an expiration date
   * and associates it with a specific user. The session ID is later used
   * during the 2FA process.
   *
   * @param userId - The ID of the user for whom the session is being created.
   *
   * @returns A promise that resolves to the newly created session object.
   *
   * @example
   * ```typescript
   * const userId = 123;
   * const session = await createSession(userId);
   * console.log("DB Session:", session);
   * ```
   */
  // async createSession(userId: number) {
  //   return this.db.session.create({
  //     data: {
  //       expirationDate: this.getSessionExpiration(),
  //       user: {
  //         connect: {
  //           id: userId,
  //         },
  //       },
  //     },
  //   });
  // }
  /**
   * Creates a cookie session for the 2FA process.
   *
   * This function sets up a cookie session containing a reference to the
   * session ID generated in the database during the 2FA process. It ensures
   * that the session is stored securely in the client’s browser while redirecting
   * the user to a specified path.
   *
   * @param sessionId - The ID of the session created in the database for 2FA.
   * @param redirectTo - The path to redirect the user after creating the session.
   *
   * @returns A redirection response with the `Set-Cookie` header to store the 2FA session.
   *
   * @example
   * ```typescript
   * const sessionId = "abc123";
   * const redirectTo = "/2fa/verify";
   * return create2faSession(sessionId, redirectTo);
   * ```
   */
  async create2faSession(sessionId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("sessionId", sessionId);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  }
  /**
   * Retrieves the user ID from the session stored in the request's cookies.
   *
   * @param request - The incoming HTTP request containing the user's session data in the cookies.
   *
   * @returns A promise that resolves to the user ID if available in the session, or `undefined` if no user ID is found.
   *
   * This function extracts the session from the request's cookies using a storage mechanism,
   * retrieves the `userId` from the session, and returns it.
   * If the session does not contain a `userId`, it returns `undefined`.
   */
  async getUserId(request: Request): Promise<string | undefined> {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    return userId;
  }
  /**
   * Ensures that a user is authenticated by checking the session for a valid user ID.
   * If the user is not authenticated, they are redirected to the login page.
   *
   * @param request - The incoming HTTP request containing the user's session data in the cookies.
   * @param loginRoute - The login page route to redirect.

   * @returns A promise that resolves to the user ID if the user is authenticated.
   *
   * @throws {Redirect} If the user is not authenticated (i.e., no user ID is found in the session),
   * it throws a redirect to the login page.
   *
   * This function checks if the `userId` is present in the session retrieved from the request.
   * If no user ID is found, the user is redirected to the `/login` route. If a valid user ID is found,
   * it returns the user ID.
   */
  async requireUser(request: Request, loginRoute: string): Promise<string> {
    const userId = await this.getUserId(request);
    // todo: add to auth config
    if (!userId) throw redirect(loginRoute);
    return userId;
  }
  /**
   * Ensures that a valid 2FA session exists and is not expired.
   * If the session is invalid or expired, the user is redirected to the login page.
   *
   * @param request - The incoming HTTP request containing the user's 2FA session data in the cookies.
   * @param loginRoute - The login page route to redirect.
   *
   * @returns A promise that resolves to the user ID associated with the valid 2FA session.
   *
   * @throws {Redirect} If the 2FA session is invalid, expired, or not found, the user is redirected to the login page.
   *
   * This function retrieves the 2FA session from the request's cookies and checks the associated session
   * in the database to ensure it is valid and has not expired. If the session is valid, it returns the user ID
   * from the session. If the session is invalid or expired, the user is redirected to the `/login` page.
   */
  // async require2faSession(request: Request, loginRoute: string) {
  //   const twofaSession = await storage.getSession(
  //     request.headers.get('Cookie'),
  //   );
  //   const sessionId = twofaSession.get('sessionId');
  //   try {
  //     const session = await this.db.session.findUnique({
  //       where: {
  //         id: sessionId,
  //         expirationDate: { gt: new Date() },
  //       },
  //     });
  //     if (!session) throw redirect(loginRoute);
  //     return session.userId;
  //   } catch (error) {
  //     throw redirect(loginRoute);
  //   }
  // }
  /**
   * Ensures that the user has the specified role. If the user does not have the required role,
   * they are redirected to the login.
   *
   * @param request - The incoming HTTP request containing the user's session data.
   * @param requestedRole - The role that the user is required to have.
   *
   * @throws {Redirect} If the user is not authenticated or does not have the required role,
   * they are redirected to the login (`/login`).
   *
   * This function checks the user session to ensure the user is authenticated and verifies that
   * the user's role matches the requested role. If either of these conditions is not met,
   * the user is redirected to the login.
   */
  // async requireRole(request: Request, requestedRole: string) {
  //   // todo fix role
  //   const user = await this.getUserId(request);
  //   if (!user) throw redirect('/login');
  //   if (user.role !== requestedRole) throw redirect('/login');
  // }
  /**
   * Ensures that the user is not authenticated. If the user is already logged in,
   * they are redirected to the homepage.
   *
   * @param request - The incoming HTTP request containing the user's session data.
   *
   * @throws {Redirect} If the user is authenticated (i.e., the `userId` is found in the session),
   * they are redirected to the homepage (`/`).
   *
   * This function checks the user session to ensure that the user is not authenticated.
   * If the user is logged in (i.e., a `userId` is found), they are redirected to the homepage.
   */
  async requireAnonymous(request: Request) {
    const userId = await this.getUserId(request);
    if (userId) throw redirect("/");
  }
  /**
   * Logs out the user by destroying the current session and redirecting them to the login page.
   *
   * @param request - The incoming HTTP request containing the user's session data in the cookies.
   * @param loginRoute - The login page route to redirect.
   *
   * @returns {Response} A response object that redirects the user to the login page, with the session destroyed.
   *
   * This function retrieves the current session from the request's cookies, destroys the session,
   * and returns a redirect response to the `/login` page. The session cookie is cleared by setting a
   * new `Set-Cookie` header with the destroyed session.
   */
  async logout(request: Request, loginRoute: string) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    return redirect(loginRoute, {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }
}
