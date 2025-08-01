import Link from "next/link";
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-muted/50 py-12 px-4 text-center text-gray-200">
      <div className="container mx-auto">
        <p>
          © {year}{" "}
          <Link href="https://github.com/Quarcoo-arc" target="_blank">
            Michael Quarcoo
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
