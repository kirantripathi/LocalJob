import React from "react";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import PaginationComponent from "./PaginationComponent";

type JobResultProps = {
  filterValues: JobFilterValues;
};
const pageSize = 5;

const JobResult = async ({
  filterValues: { q, type, location, remote, page },
}: JobResultProps) => {
  const currentPage = page || "1";

  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & "); //making sure we dont have any empty string or spaces

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          {
            title: { search: searchString },
            type: { search: searchString },
            locationType: { search: searchString },
            location: { search: searchString },
            companyName: { search: searchString },
          },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };

  const [data, totalCount] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      skip: currentPage ? (parseInt(currentPage) - 1) * pageSize : 0,
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.job.count({
      where,
    }),
  ]);



  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="grow space-y-4">
      {data.map((job) => {
        return (
          <Link href={`jobs/${job?.slug}`} key={job.id} className="block">
            <JobListItem job={job} />
          </Link>
        );
      })}
      {data?.length && <PaginationComponent totalPage={totalPages} />}
      {data.length == 0 && (
        <p className="m-auto text-center">
          No Jobs Found.Try Adjusting your search filters
        </p>
      )}
    </div>
  );
};

export default JobResult;
