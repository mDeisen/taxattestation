import React, { useState } from 'react';

const RevokeAttestation = () => {
  const [attestationUID, setAttestationUID] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attestationUID) {
      console.error("Attestation UID is required");
      return;
    }

    try {
      const response = await fetch(`http://localhost:7071/api/revokeattestation/${attestationUID}`, {
        method: 'GET',
      });

      if (response.ok) {
        const responseBody = await response.json(); // Assuming JSON response
        console.log("Revoke result: ", responseBody);
        alert("Attestation revoked successfully: " + responseBody.message);
      } else {
        console.error("Error in revoking attestation: ", response.statusText);
        alert("Error in revoking attestation: " + response.statusText);
      }
    } catch (error) {
      console.error("Network error: ", error);
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-10 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Revoke Attestation</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Attestation UID</label>
          <input 
            type="text" 
            value={attestationUID} 
            onChange={e => setAttestationUID(e.target.value)} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
          />
        </div>
        <button 
          type="submit" 
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RevokeAttestation;
