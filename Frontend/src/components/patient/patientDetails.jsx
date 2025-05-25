import React from 'react';

const PatientDetails = ({ patient }) => {
  return (
    <div className="patient-details">
      <h3>Patient Details</h3>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Contact:</strong> {patient.contact}</p>
      <p><strong>Registration Date:</strong> {patient.registrationDate}</p>
      <p><strong>Medical History:</strong> {patient.medicalHistory || 'None'}</p>
    </div>
  );
};

export default PatientDetails;