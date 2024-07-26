import React, { useState } from 'react';

interface CreateTripFormProps {
  onSubmit: (trip: { title: string; startDate: string; endDate: string }) => void;
  onCancel: () => void;
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Trip</h2>
      <input
        type="text"
        placeholder="Trip Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <button type="submit">Create</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default CreateTripForm;