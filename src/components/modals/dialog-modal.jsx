import ReactFocusLock from "react-focus-lock";
import ModalBg from "./modal-bg";
import ReactDOM from "react-dom";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DialogModal({
  isOpen,
  setIsOpen,
  action,
  isDangerous,
  title,
  description,
  icon: Icon,
  onClick,
  href,
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen();
    if (onClick) onClick();

    if (href && mounted) {
      router.push(href);
    }
  };

  return ReactDOM.createPortal(
    <>
      <ReactFocusLock
        className={`${isOpen ? "visible" : "invisible"} modal-container`}
      >
        <div
          className={`${isOpen ? "opacity-100" : "opacity-0"} modal-content`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="img-gradient-red">{Icon && <Icon />}</div>
            <h3 className="text-center">{title}</h3>
          </div>
          <p className="text-center">{description}</p>
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            <button
              className={`${
                isDangerous &&
                "!border-[var(--primary-red)] !text-[var(--primary-red)]"
              } secondary-form-btn`}
              onClick={setIsOpen}
            >
              Annuler
            </button>
            <button
              className={`${
                isDangerous && "!bg-[var(--primary-red)]"
              } primary-form-btn`}
              onClick={handleSubmit}
            >
              {action}
            </button>
          </div>
        </div>
      </ReactFocusLock>
      <ModalBg className="!z-40" isOpen={isOpen} setIsOpen={setIsOpen} />
    </>,
    document.querySelector("body")
  );
}
