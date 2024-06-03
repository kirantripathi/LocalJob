"use server";

import { isAdmin } from "@/lib/utils";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { redirect } from "next/navigation";

type FormState = { error?: string } | undefined;

export async function approveSubmission(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const user = await currentUser();

    const jobId = parseInt(formData.get("jobId") as string);

    if (!user) {
      throw new Error("Not Authorized");
    }

    let test = await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "Admin",
      },
    });

    await prisma.job.update({
      where: { id: jobId },
      data: { approved: true },
    });

    revalidatePath("/");
  } catch (error) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

export async function deleteSubmission(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const user = await currentUser();

    const jobId = parseInt(formData.get("jobId") as string);

    // if (!user || !isAdmin(user)) {
    //   throw new Error("Not Authorized");
    // }

    if (!user) {
      throw new Error("Not Authorized");
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (job?.companyLogoUrl) {
      await del(job.companyLogoUrl);
    }

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    revalidatePath("/");
  } catch (error) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  // internally redirect throws and error so it need to be outside try catd block
  redirect("/admin");
}
