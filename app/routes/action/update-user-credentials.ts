import { data } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import {
  userCredentialsResolver,
  userCredentialsSchemaType,
} from "~/components/forms/UserCredentialsForm";
import { updateUserCredentials } from "~/utils/user.server";
import { Route } from "./+types/update-user-credentials";

// export async function action({ request }: Route.ActionArgs) {
//   const userId = await authenticator.requireUser(request, "/login");
//   invariant(userId, "user is not logged in");

//   const {
//     errors,
//     data: payload,
//     receivedValues: defaultValues,
//   } = await getValidatedFormData<userCredentialsSchemaType>(
//     request,
//     userCredentialsResolver
//   );

//   if (errors) {
//     return data({ errors, defaultValues, payload }, { status: 400 });
//   }
//   try {
//     await updateUserCredentials({
//       ...payload,
//       userId: Number(userId),
//     });
//   } catch (err) {
//     return data(
//       {
//         err,
//         payload,
//         toastTitle: "User Updation Has Been Failed",
//         toastContent: "Could not update user!",
//       },
//       { status: 400 }
//     );
//   }
//   return data({
//     toastTitle: "User Has Been Updated",
//     toastContent: "User has been updated successfully!",
//   });
// }


import { promises as fs } from "fs";
import path from "path";
import { prisma } from "~/db.server";

export async function action({ request }: Route.ActionArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  invariant(userId, "user is not logged in");

  console.log(userId)

  try {
    // 1. First handle the file upload
    const clonedRequest = request.clone()
    const formData = await clonedRequest.formData();
    const avatarFile = formData.get("avatar") as File | null;
    let avatarUrl = undefined;

    if (avatarFile && avatarFile.size > 0) {
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      // Create unique filename
      const uniqueFilename = `${Date.now()}-${avatarFile.name}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Write the file
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      avatarUrl = `/uploads/${uniqueFilename}`;

      // Delete old avatar if exists
      const oldUser = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { avatar: true }
      });

      if (oldUser?.avatar) {
        try {
          const oldFilePath = path.join(process.cwd(), "public", oldUser.avatar);
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error("Failed to delete old avatar:", error);
        }
      }
    }

    // 2. Then handle the rest of the form data
    const {
      errors,
      data: payload,
      receivedValues: defaultValues,
    } = await getValidatedFormData<userCredentialsSchemaType>(
      request,
      userCredentialsResolver
    );

    if (errors) {
      return data({ errors, defaultValues, payload }, { status: 400 });
    }

    await updateUserCredentials({
      ...payload,
      userId: Number(userId),
      avatar: avatarUrl || payload.avatar, // Keep existing avatar if no new file
    });

    return data({
      toastTitle: "User Has Been Updated",
      toastContent: "User has been updated successfully!",
    });

  } catch (err) {
    return data(
      {
        err,
        toastTitle: "User Update Failed",
        toastContent: "Could not update user!",
      },
      { status: 400 }
    );
  }
}