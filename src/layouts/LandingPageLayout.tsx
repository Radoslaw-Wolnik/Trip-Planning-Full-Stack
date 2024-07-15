import React from 'react';
import { Outlet } from 'react-router'

import Footer from '../components/Footer'
import Header from '../components/Header'

import Modal from '../components/Modal'
import { useModal } from '../hooks/useModal';

const LandingPageLayout: React.FC = () => {
  const { isModalOpen, modalContent, closeModal } = useModal();

    return (
      <div className="landing-page-layout">
        <Header />
        <main className="content">
          <Outlet />
        </main>
        <Footer />
        <section>
          <Modal isModalOpen={isModalOpen} onClose={closeModal}>
            {modalContent}
          </Modal>
        </section>;
      </div>
    )
  }

export default LandingPageLayout
