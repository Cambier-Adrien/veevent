"use client";
import CustomTitle from "@/components/titles/custom-title";
import OrganiserCard from "@/components/cards/organiser-card";
import DropdownButton from "@/components/buttons/dropdown-button";
import { useState } from "react";

export default function ProfilList({ title, description }) {
  const [sortOption, setSortOption] = useState("liked");

  const sortOptions = [
    { label: "Mieux noté", value: "liked" },
    { label: "Plus d'événements", value: "events" },
    { label: "Plus d'abonnés", value: "subscribers" },
  ];

  return (
    <section className="page-grid">
      <div className="flex flex-col gap-6">
        <CustomTitle title={title} description={description} />
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Mot clé" />
          <DropdownButton
            options={sortOptions}
            selectedValue={sortOption}
            label="Trier par :"
            onSelect={(option) => setSortOption(option.value)}
          />
        </div>
      </div>
      <div className="cards-grid">
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
        <OrganiserCard
          name="Jean Claude"
          id="@JeanClaudeDu06"
          subscribers="8"
          events="12"
          note="4"
        />
      </div>
    </section>
  );
}
