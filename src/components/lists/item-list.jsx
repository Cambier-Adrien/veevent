"use client";
import { NavArrowRight } from "iconoir-react";
import UsersModal from "../modals/users-modal";
import { useState } from "react";

export default function ItemList({ items = [] }) {
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className={`flex flex-col`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <div key={index} className="flex items-center gap-3 w-full">
              {Icon && <Icon className="h-6 w-6 text-[var(--light-gray)]" />}
              <div
                className={`w-full py-3 flex items-center justify-between ${
                  !isLast && "border-b border-[var(--secondary-border-col)]"
                }`}
              >
                <p className="dark-text">{item.value}</p>
                {item.type === "users" && (
                  <button
                    className="secondary-btn"
                    onClick={() => setIsUsersModalOpen(true)}
                  >
                    <span>Consulter</span>
                    <NavArrowRight />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <UsersModal
        isOpen={isUsersModalOpen}
        setIsOpen={() => setIsUsersModalOpen(!isUsersModalOpen)}
      />
    </>
  );
}
