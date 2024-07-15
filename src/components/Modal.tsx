import React from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
    // onMessageChange: (newMessage: string) => void;
    isModalOpen: boolean;
    //modalContent: ModalContent;
    onClose: () => void;
    children: React.ReactNode;
  }

const Modal: React.FC<ModalProps> = ({ isModalOpen, onClose, children }) => {
  if (!isModalOpen) {
    return null;
  }
  return (
    <section className="modal">
      <article className="modal-content p-lg-4">
        <div className="exit-icon text-end">
          <IoMdClose onClick={onClose} fill="black" />
        </div>
        <main className="modal-mainContents">
          {children}
        </main>
      </article>
    </section>
  );
};

export default Modal;
