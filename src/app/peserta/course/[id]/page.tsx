import React from "react";
import LearningRoom from "@/components/peserta/LearningRoom";

interface PageProps {
  params: {
    id: string;
  };
}

export default function CourseLearningRoomPage({ params }: PageProps) {
  return (
    <div className="flex-1 flex flex-col">
      <LearningRoom courseId={params.id} />
    </div>
  );
}
