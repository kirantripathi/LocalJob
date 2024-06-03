import { Metadata } from "next";
import NewJobForm from "./NewJobForm";


//we can only use metadata in server component
export const metadata: Metadata = {
  title: "Post a new job",
};

export default function Page() {
  return <NewJobForm />;
}