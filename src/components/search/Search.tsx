import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SearchModal from "./SearchModal";
import useOnClickOutside from "../../hooks/useOnClickOutside";

export default function Seach() {
  const [showModal, setShowModal] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  function handleOnClickOutside() {
    setShowModal(false);
  }

  useOnClickOutside(ref, handleOnClickOutside);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }

      if (e.key === " " && e.shiftKey) {
        console.log("LOGGER - Shift + Space detected!");
        setShowModal(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  //   if (event.key === ' ' && event.shiftKey) {
  //   console.log("Shift + Space detected!");
  //   // Optional: prevent default behavior like page scrolling
  //   event.preventDefault();
  // }
  return (
    <div ref={ref}>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal &&
        createPortal(
          <SearchModal onClose={() => setShowModal(false)} />,
          document.body,
        )}
    </div>
  );
}
