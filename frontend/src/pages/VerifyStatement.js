import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useDropzone } from 'react-dropzone';

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
        alert(responseBody.message);
      } else {
        console.error("Error in verification: ", response.statusText);
        alert("Error in verification: " + response.statusText);
      }
    } catch (error) {
      console.error("Network error: ", error);
      alert("Network error: " + error.message);
    }
  };

  const MyDropzone = () => {
    const onDrop = (acceptedFiles) => {
      // Only taking the first file for simplicity
      const file = acceptedFiles[0];
      setFile(file); // Update the file state in VerifyStatement
    };

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

  return (
    <Container maxWidth="sm" style={{ maxWidth: '33.33%', marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <h2>Verify Statement</h2>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <MyDropzone />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Verify Statement 
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default VerifyStatement;
