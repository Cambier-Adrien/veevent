"use client";
import { useParams } from "next/navigation";

export default function EventsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Event {id}</h1>
    </div>
  );
}
