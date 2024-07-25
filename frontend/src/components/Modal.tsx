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
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <div className="exit-icon text-end">
          <IoMdClose onClick={onClose} fill="black" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
