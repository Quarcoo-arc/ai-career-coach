"use client";
import MDEditor from "@uiw/react-md-editor";
import React from "react";

export const CoverLetterPreview = ({ content }: { content: string }) => {
  return (
    <div className="py-4">
      <MDEditor value={content} preview="preview" height={700} />
    </div>
  );
};
