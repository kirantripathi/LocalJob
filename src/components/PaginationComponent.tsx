"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type pageSize = {
  totalPage: number;
};

const PaginationComponent = ({ totalPage }: pageSize) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const urlSearchPage = searchParams.get("page") || ("1" as string);
  const [page, setPage] = useState(parseInt(urlSearchPage));

  console.log(urlSearchPage, "See in pagination page");

  const pageClick = (type: string) => {
    let params;
    switch (type) {
      case "Prev":
        params = new URLSearchParams(searchParams);
        params.set("page", (page - 1).toString());
        setPage((prevPage) => prevPage - 1);
        replace(`${pathname}?${params.toString()}`);
        break;

      case "Next":
        params = new URLSearchParams(searchParams);
        params.set("page", (page + 1).toString());
        setPage((prevPage) => prevPage + 1);
        replace(`${pathname}?${params.toString()}`);
        break;
    }
  };

  return (
    <footer className="flex justify-center">
      <div className="flex space-x-5">
        <Button disabled={page == 1} onClick={() => pageClick("Prev")}>
          Previous
        </Button>
        <Button disabled={page >= totalPage} onClick={() => pageClick("Next")}>
          Next
        </Button>
      </div>
    </footer>
  );
};

export default PaginationComponent;
