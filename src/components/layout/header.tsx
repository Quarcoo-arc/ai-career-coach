import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton>
          <Button variant="ghost" className="rounded-full">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button className="rounded-full">Sign Up</Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default Header;
