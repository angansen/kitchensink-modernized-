import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemberService from '../services/MemberService';

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const initialMemberState = {
    id: null,
    name: '',
    email: '',
    phoneNumber: ''
  };
  
  const [member, setMember] = useState(initialMemberState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validation, setValidation] = useState({});

  const fetchMember = () => {
    setLoading(true);
    MemberService.getMemberById(id)
      .then(response => {
        setMember(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching member:', error);
        setError('Failed to load member. Please try again later.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const updateMember = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    MemberService.updateMember(id, member)
      .then(response => {
        setUpdateSuccess(true);
        setError(null);
        setTimeout(() => navigate('/'), 2000);
      })
      .catch(error => {
        console.error('Error updating member:', error);
        setError(
          error.response?.data?.message || 
          'Failed to update member. Please try again later.'
        );
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !updateSuccess) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <div className="mt-3">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/')}
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>Edit Member</h2>
      </div>
      <div className="card-body">
        {updateSuccess ? (
          <div className="alert alert-success">
            <h4>Member updated successfully!</h4>
            <p>Redirecting to members list...</p>
          </div>
        ) : (
          <form onSubmit={updateMember}>
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
              />
              {validation.phoneNumber && (
                <div className="invalid-feedback">{validation.phoneNumber}</div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Update
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

export default EditMember;
