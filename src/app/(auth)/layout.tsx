import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IProps) => {
  return (
    <div className="flex flex-1 self-center justify-center">{children}</div>
  );
};

export default AuthLayout;
