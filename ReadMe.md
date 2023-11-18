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


### TBD: Add Resolver Contract

First:
AttestationUID: 0x9ba9dd33414a2e34165a1bfe9d2103b1692b69cc1963c9d14d14b95d8a5c5909