import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { app } from './firebaseConfig';
import emailjs from '@emailjs/browser';

const Register = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Doctor',
    department: '',
    employeeId: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendWelcomeEmail = async () => {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const templateParams = {
      user_name: fullName,
      user_email: formData.email,
      message: `Welcome to SADQ! Your role is ${formData.role}.`,
    };

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
    } catch (err) {
      console.error('EmailJS error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      await sendWelcomeEmail();

      navigate('/login', { state: { email: formData.email, success: true } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-2 border rounded" />
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option>Doctor</option>
            <option>Admin</option>
          </select>
          <input name="department" placeholder="Department/Specialty" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="employeeId" placeholder="NPI / Employee ID" value={formData.employeeId} onChange={handleChange} className="w-full p-2 border rounded" />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
