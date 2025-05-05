import React, { useState } from 'react';
import '../styles/ProfilePage.css';

const ProfilePage = ({ userId }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('profilePic', e.target.files[0]);

    try {
      const res = await fetch(`http://localhost:5000/api/profile/upload/${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfilePic(data.user.profilePic);
        setMessage('✅ Profile picture uploaded');
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Upload failed');
    }
  };

  const handleRemove = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/remove/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setProfilePic(null);
        setMessage('✅ Profile picture removed');
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Remove failed');
    }
  };

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      {profilePic ? (
        <div className="pic-preview">
          <img src={`http://localhost:5000${profilePic}`} alt="Profile" />
          <button onClick={handleRemove}>Remove Picture</button>
        </div>
      ) : (
        <div className="upload-section">
          <input type="file" onChange={handleUpload} />
        </div>
      )}
      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default ProfilePage;
