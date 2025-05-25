import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function PatientRegistration() {
  const { register, handleSubmit } = useForm(); // Removed unused errors
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/patients', data);
      if (response.data.status === 'success') setSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Patient Registration</h2>
      
      <div>
        <input 
          {...register('name', { required: 'Name is required' })} 
          placeholder="Full Name" 
        />
        {/* Add error message display if needed */}
      </div>

      <div>
        <input 
          {...register('contact', { 
            required: 'Contact number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Invalid phone number'
            }
          })} 
          placeholder="Phone Number" 
        />
      </div>

      <button type="submit">Register</button>
      {success && <p>Registration successful!</p>}
    </form>
  );
}

export default PatientRegistration;