import { Authenticator as ModuleAuthenticator } from "~/auth-module/authenticator.server";
import { prisma } from "~/db.server";
// import { prisma } from '~/utils/prisma.server';

class Authenticator extends ModuleAuthenticator {
  // async authenticateCredentialsWithIp(
  //   username: string,
  //   password: string,
  //   ip: string | null,
  // ): Promise<User> {
  //   const user = await this.authenticateCredentials(username, password);
  //   if (!user.ip) {
  //     await prisma.user.update({ where: { id: user.id }, data: { ip } });
  //     return user;
  //   }
  //   if (user.ip !== ip) {
  //     throw new Error('Connenct from the authorized ip address');
  //   }
  //   return user;
  // }
  // async getUserRoleHomeRoute(userId: number): Promise<string> {
  //   const user = await prisma.user.findUnique({ where: { id: userId } });
  //   if (!user) throw new Error('User not found');
  //   switch (user.role) {
  //     case Role.ADMIN:
  //       return '/admin/home/all';
  //     case Role.USER:
  //       return '/home/all';
  //     case Role.SYSTEM_ADMIN:
  //       return '/system-admin/create-user';
  //     default:
  //       throw new Error('Invalid user role');
  //   }
  // }
  // async requireAnonymous(request: Request) {
  //   const userId = await this.getUserId(request);
  //   if (userId) {
  //     const getUserRoleHomeRoute = await this.getUserRoleHomeRoute(
  //       Number(userId),
  //     );
  //     throw redirect(getUserRoleHomeRoute);
  //   }
  // }
}
export const authenticator = new Authenticator(prisma);

authenticator.requireAnonymous;
