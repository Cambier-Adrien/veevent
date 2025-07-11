import React from "react";

const OrganizerCardSkeleton = () => (
  <div className="organizer-card skeleton-bg flex flex-col justify-end p-4 mb-4">
    <div
      className="skeleton-bg rounded-full mb-2"
      style={{ aspectRatio: "1/1" }}
    />
    <h3 className="skeleton-text mb-2">Nom de l'organisateur</h3>
    <p className="skeleton-text">Description de l'organisateur</p>
  </div>
);

export default OrganizerCardSkeleton;
