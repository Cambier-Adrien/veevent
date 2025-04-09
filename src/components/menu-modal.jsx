import { Xmark, NavArrowRight } from "iconoir-react";
import Link from "next/link";
import ModalBg from "./modal-bg";
import ReactFocusLock from "react-focus-lock";
export default function MenuModal({ isOpen, setIsOpen }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <ReactFocusLock
        className={`${
          isOpen ? "visible -translate-x-0" : "invisible -translate-x-full"
        } menu-modal lg:hidden`}
      >
        <div className="flex flex-col gap-8">
          <div className="h-16 w-full flex items-center gap-12">
            <Link
              href="/"
              className="logo"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  scrollToTop();
                  setIsOpen();
                }
              }}
            >
              v<span>ee</span>vent
            </Link>
            <button className="blue-rounded-btn" onClick={setIsOpen}>
              <span>Menu</span>
              <Xmark className="hamburger-menu" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            <h4>Pages</h4>
            <Link href="/activities/events" onClick={setIsOpen}>
              Evenements
            </Link>
            <Link href="/activities/organisers" onClick={setIsOpen}>
              Organisateurs
            </Link>
            <Link href="/cities" onClick={setIsOpen}>
              Villes
            </Link>
            <Link href="/saved/inscriptions" onClick={setIsOpen}>
              Mes inscriptions
            </Link>
            <Link href="/saved/marked" onClick={setIsOpen}>
              Marqués
            </Link>
            <Link href="/subscriptions" onClick={setIsOpen}>
              Abonnements
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-center gap-4 h-16 w-full">
          <button className="secondary-btn">
            <span>S'inscrire</span>
            <NavArrowRight />
          </button>
          <button className="primary-btn">
            <span>Se connecter</span>
            <NavArrowRight />
          </button>
        </div>
      </ReactFocusLock>
      <ModalBg isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
