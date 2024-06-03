import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import JobPage from "@/components/JobPage";
import AdminSideBar from "./AdminSideBar";

type PageProps = {
  params: {
    slug: string;
  };
};

const page = async ({ params: { slug } }: PageProps) => {
  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
  });

  console.log(job, "see individual job");

  if (!job) {
    //will send to our 404 custom not found page
    return notFound();
  }

  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobPage job={job} />
      <AdminSideBar job={job} />
    </main>
  );
};

export default page;
