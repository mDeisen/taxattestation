import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';

const AttestStatement = () => {
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState('');

  const calculateFileHash = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result);
        const hash = SHA256(wordArray).toString(CryptoJS.enc.Hex);
        resolve(hash);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !address) {
      console.error("File and address are required");
      return;
    }

    try {
      const contentHash = await calculateFileHash(file);
      const response = await fetch(`http://localhost:7071/api/atteststatementhash/${address}/${contentHash}`, {
        method: 'GET',
      });

      if (response.ok) {
        const responseBody = await response.json(); // Assuming JSON response
        console.log("Response body:", responseBody);
        alert("Attestation successful: " + responseBody.message); // Accessing the message property
      } else {
        console.error("Error in attestation: ", response.statusText);
        alert("Error in attestation: " + response.statusText);
      }
    } catch (error) {
      console.error("Network error: ", error);
      alert("Network error: " + error.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-10 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Attest Statement</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">PDF Document</label>
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
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

export default AttestStatement;
