import EventList from "@/components/event-list";

export default function InscriptionsPage() {
  return (
    <EventList
      title="Consulter mes inscriptions"
      description="Evenements"
      showFilters={true}
      showSort={true}
    />
  );
}
