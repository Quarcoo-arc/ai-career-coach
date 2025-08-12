import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const Cta = () => {
  return (
    <section className="w-full">
      <div className="mx-auto py-24 gradient rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-primary-foreground">
            Ready to Accelerate your Career?
          </h2>
          <p className="text-primary-foreground/80 md:text-xl max-w-[600px]">
            Join thousands of ambitious professionals fast-tracking their
            careers with our platform—your next big leap starts here.
          </p>
          <Link href={"/dashboard"} passHref>
            <Button
              size={"lg"}
              variant={"secondary"}
              className="h-12 mt-5 animate-bounce"
            >
              Start Your Journey Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
