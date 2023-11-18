# Attestations for Tax Standard ech0196

## Purpose
Create and validate information from the swiss e-tax statement data.
The ech-0196 standard defines a format for digital tax declaration for natural persons in switzerland.
Issuers of swiss e-tax statements can make attestations along with the statements to enable the recipients/owners of the statement to prove that they did not modify the statements (e.g. when sending the statements to the tax office).
In addition specific information from the statement (e.g. totalAssets, total dividends, totalEarnings) can be proven through merkle trees e.g. when applying for a loan.

## Functions
### AttestStatement
In: pdf statement
Effect: creates attestations for pfd statement
Out: AttestationUID

Using the contentHash Schema: 
On Sepolia: https://sepolia.easscan.org/attestation/view/0x9ba9dd33414a2e34165a1bfe9d2103b1692b69cc1963c9d14d14b95d8a5c5909

### RevokeStatementAttestation
In: attestationUID
Effect: revokes input attestation
Out: status

### VerifyStatement
In: pdf statement
Out: statement status

### VerifyStatementDetails

## Data fields

## Schemas

### Tax Statement Public


### References
use array with UIDS
- Previous year statement
- Previous version

###
Public

## Features
### Revoking
In case that a e-tax statement is superseeded by an updated version (e.g. in case of re-issuance due to a rebooking.)


## Query attestations
Sepolio:

Query by issuer, schema and non-revoked status: https://studio.apollographql.com/sandbox/explorer

query {
    attestations(where: { 
      AND: [
        { attester: { equals: "0xBBB1105f01604382001393Fe1DCFE0C227c571FD" } },
        { schema: { is: { id: { equals: "0xdf4c41ea0f6263c72aa385580124f41f2898d3613e86c50519fc3cfd7ff13ad4" } } } },
        { revoked: { not: {equals: true } } },
        { data: { equals: "0x3fcfc938faf4b8077a60e7ef5ef43dad4490ea9b1f17b36f3981d0f13c137ccc"}}
      ] 
    }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      schema {
        id
        schema
      }
    }
  }
  

### TBD: Add Resolver Contract?
Could be used to enable the tax authority to manage the allowed attestation providers


First:
AttestationUID: 0x9ba9dd33414a2e34165a1bfe9d2103b1692b69cc1963c9d14d14b95d8a5c5909
2022_report: 0x93f3b0c58b0ed702328800ac2a7f7551e14ba6195a983d669e41cdcdfddfa00d
