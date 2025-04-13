import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MemberService from '../services/MemberService';
import './MemberList.css';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    setLoading(true);
    console.log('Fetching members...');
    
    MemberService.getAllMembers()
      .then(response => {
        console.log('Members response:', response.data);
        setMembers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching members:', error);
        setError('Failed to load members. Please try again later.');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      MemberService.deleteMember(id)
        .then(() => {
          fetchMembers();
        })
        .catch(error => {
          console.error('Error deleting member:', error);
          setError('Failed to delete member. Please try again later.');
        });
    }
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <div className="mt-3">
          <button className="btn btn-primary" onClick={fetchMembers}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use the provided image for all member cards
  const memberProfileImage = "https://www.shareicon.net/data/128x128/2017/06/02/886666_user_512x512.png";

  return (
    <div className="container">
      <div className="prospects-header">
        <h2>{members.length} Member(s) </h2>
      </div>
      
      {members.length === 0 ? (
        <div className="alert alert-info">
          No members found. <Link to="/add" className="alert-link">Add a new member</Link>
        </div>
      ) : (
        <div className="member-grid">
          {members.map(member => {
            return (
              <div key={member.id} className="member-card">
                <div className="member-card-inner">
                  <div className="member-avatar">
                    <img src={memberProfileImage} alt={member.name} />
                  </div>
                  
                  <div className="member-name">
                    {member.name}
                  </div>
                  
                  <div className="member-contact">
                    <div><strong>Email:</strong> {member.email}</div>
                    <div><strong>Phone:</strong> {member.phoneNumber}</div>
                  </div>
                  
                  <div className="member-actions">
                    <Link to={`/edit/${member.id}`} className="btn btn-sm btn-primary me-2">
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="add-member-button">
        <Link to="/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Member
        </Link>
      </div>
    </div>
  );
};

export default MemberList;
