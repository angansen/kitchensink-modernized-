import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberService from '../services/MemberService';

const AddMember = () => {
  const initialMemberState = {
    name: '',
    email: '',
    phoneNumber: ''
  };
  
  const [member, setMember] = useState(initialMemberState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMember({ ...member, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!member.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!member.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(member.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!member.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(member.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Phone number is invalid (must be 10 digits)';
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const saveMember = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    MemberService.createMember(member)
      .then(response => {
        setMember(initialMemberState);
        setSubmitted(true);
        setError(null);
        setTimeout(() => navigate('/'), 2000);
      })
      .catch(error => {
        console.error('Error creating member:', error);
        setError(
          error.response?.data?.message || 
          'Failed to create member. Please try again later.'
        );
        setSubmitted(false);
      });
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>Add New Member</h2>
      </div>
      <div className="card-body">
        {submitted ? (
          <div className="alert alert-success">
            <h4>Member created successfully!</h4>
            <p>Redirecting to members list...</p>
          </div>
        ) : (
          <form onSubmit={saveMember}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${validation.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={member.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
              {validation.name && (
                <div className="invalid-feedback">{validation.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${validation.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={member.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
              {validation.email && (
                <div className="invalid-feedback">{validation.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="text"
                className={`form-control ${validation.phoneNumber ? 'is-invalid' : ''}`}
                id="phoneNumber"
                name="phoneNumber"
                value={member.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
              {validation.phoneNumber && (
                <div className="invalid-feedback">{validation.phoneNumber}</div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMember;
