import React from "react";

const AICoverLetter = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <div>AICoverLetter - {id}</div>;
};

export default AICoverLetter;
