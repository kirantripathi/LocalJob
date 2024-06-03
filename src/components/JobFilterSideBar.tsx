import React from "react";
import { redirect } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Select from "./Select";
import prisma from "@/lib/prisma";
import { jobTypes } from "@/lib/job-types";
import { Button } from "./ui/button";
import { JobFilterValues, jobFilterSchema } from "@/lib/validation";
import FormSubmitButton from "./FormSubmitButton";

type JobResultProps = {
  filterValues: JobFilterValues;
};

async function filterJobs(formData: FormData) {
  "use server";
  //changing formdata to js object
  const values = Object.fromEntries(formData.entries());

 

  const { q, type, location, remote, } = jobFilterSchema.parse(values);
  //xod compare value with validation rule

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    //the syntaxa above is something like if q is present then trim and add it otherwise dont put it in searchparam
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
    //once we do something in filter we need to reset page to 1
    ...{page:"1"}
  });

  redirect(`/?${searchParams.toString()}`);
}

const JobFilterSideBar = async ({
  filterValues
}: JobResultProps) => {
 
 

  const distinctLocation = (await prisma.job
    .findMany({
      where: {
        approved: true,
      },
      select: {
        location: true,
      },
      distinct: ["location"],
    })
    .then((location) => {
      return location.map(({ location }) => location).filter(Boolean);
    })) as string[];

  //filter boolean at last remove all the null value


 

  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(filterValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              defaultValue={filterValues?.q}
              placeholder="Title, company, etc."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue={filterValues?.type || ""}>
              <option value="">All Types</option>
              {jobTypes &&
                jobTypes.map((job, index) => (
                  <option key={index} value={job}> 
                    {job}
                  </option>
                ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select id="location" name="location" defaultValue={filterValues?.location || ""}>
              <option value="">All locaation</option>
              {distinctLocation &&
                distinctLocation.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
            </Select>
          </div>

        

          <div className="flex items-center gap-2">
            <input
              defaultChecked={filterValues?. remote}
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">
            Filter Jobs
          </FormSubmitButton>
        </div>
      </form>
    </aside>
  );
};

export default JobFilterSideBar;
