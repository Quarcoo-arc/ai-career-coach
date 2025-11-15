import { getCoverLetters } from "@/actions/coverLetter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CoverLetterList } from "./_components";

const CoverLetterPage = async () => {
  const coverLetters = await getCoverLetters();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </>
  );
};

export default CoverLetterPage;
