import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

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
        const responseBody = await response.json();
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
    <Container maxWidth="sm" style={{ maxWidth: '33.33%', marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <h2>Revoke Attestation</h2>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <TextField
              label="Attestation UID"
              id="attestation-uid"
              name="attestationuid"
              value={attestationUID}
              onChange={(e) => setAttestationUID(e.target.value)}
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
};

export default RevokeAttestation;
