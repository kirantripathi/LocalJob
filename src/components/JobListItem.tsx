import { Job } from "@prisma/client";
import React from "react";
import companyLogo from "../assets/companyLogo.png";
import Image from "next/image";
import { Banknote, Briefcase, Globe2, MapPin, Clock } from "lucide-react";
import { formatMoney, relativeDate } from "@/lib/utils";
import Badge from "./Badge";

type JobListItemProps = {
  job: Job;
};

const JobListItem = ({
  job: {
    title,
    companyLogoUrl,
    companyName,
    createdAt,
    location,
    salary,
    locationType,
    type,
  },
}: JobListItemProps) => {
  return (
    <article className=" flex gap-3 rounded-lg border p-5 hover:bg-muted/30">
      <Image
        src={ companyLogoUrl || companyLogo}
        alt={`${companyName} Logo`}
        width={100}
        height={100}
        className="self-center rounded-lg"
      />
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-muted-foreground ">{companyName}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5 sm:hidden">
            <Briefcase size={16} className="shrink-0 " />
            {type}
          </p>
          <p className="flex items-center gap-1.5 ">
            <MapPin size={16} className="shrink-0 " />
            {locationType}
          </p>
          <p className="flex items-center gap-1.5 ">
            <Globe2 size={16} className="shrink-0 " />
            {location || "WorldWide"}
          </p>
          <p className="flex items-center gap-1.5 ">
            <Banknote size={16} className="shrink-0 " />
            {formatMoney(salary)}
          </p>
          <p className="flex items-center gap-1.5 sm:hidden">
            <Clock size={16} className="shrink-0 " />
            {relativeDate(createdAt)}
          </p>
        </div>
      </div>

      <div className="hidden shrink-0 flex-col items-end justify-between sm:flex">
        <Badge>{type}</Badge>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={16} />
          {relativeDate(createdAt)}
        </span>
      </div>
    </article>
  );
};

export default JobListItem;
