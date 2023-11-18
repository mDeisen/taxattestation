import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';

const VerifyStatement = () => {
  const [file, setFile] = useState(null);

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

    if (!file) {
      console.error("File is required");
      return;
    }

    try {
      const contentHash = await calculateFileHash(file);
      console.log("Content Hash: ", contentHash);

      const response = await fetch(`http://localhost:7071/api/verifystatementhash/${contentHash}`, {
        method: 'GET',
      });

      if (response.ok) {
        const responseBody = await response.json(); // Assuming JSON response
        console.log("Verification result: ", responseBody);
        alert("Verification successful: " + responseBody.message);
      } else {
        console.error("Error in verification: ", response.statusText);
        alert("Error in verification: " + response.statusText);
      }
    } catch (error) {
      console.error("Network error: ", error);
      alert("Network error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Verify Statement</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">PDF Document</label>
        <input 
          type="file" 
          onChange={e => setFile(e.target.files[0])} 
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
        />
      </div>
      <button 
        type="submit" 
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700"
      >
        Initiate Verification
      </button>
    </form>
  );
};

export default VerifyStatement;
