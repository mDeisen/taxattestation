import React, { useState, useCallback } from 'react';
import SHA256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useDropzone } from 'react-dropzone';

function AttestStatement() {
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

  const callAttestStatement = async (e) => {
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
        const responseBody = await response.json();
        console.log("Response body:", responseBody);
        alert("Attestation successful! UID: " + responseBody.message); // Accessing the message property (attestationUID)
        window.open(`https://sepolia.easscan.org/attestation/view/${responseBody.message}`, '_blank'); 
      } else {
        console.error("Error in attestation: ", response.statusText);
        alert("Error in attestation: " + response.statusText);
      }
    } catch (error) {
      console.error("Network error: ", error);
      alert("Network error: " + error.message);
    }
  };

  const MyDropzone = () => {
    const onDrop = useCallback((acceptedFiles) => {
      // Only taking the first file for simplicity
      const file = acceptedFiles[0];
      setFile(file); // Update the file state in AttestStatement
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
      <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Drag or click to select a file</p>
        {/* Display the filename if a file is selected */}
        {file && <div style={{ marginTop: '10px' }}>Selected file: {file.name}</div>}
      </div>
    );
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await callAttestStatement(e); // Pass the event object here
  };

  return (
    <Container maxWidth="sm" style={{ maxWidth: '33.33%', marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <h2>Attest Statement</h2>
        <Grid container spacing={2} alignItems="center" justifycontent="center">
          <Grid item xs={12}>
            <MyDropzone />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Recipient Address"
              id="recipient-address"
              name="recipientaddress"
              value={address}
              onChange={handleAddressChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AttestStatement;