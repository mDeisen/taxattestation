# Attestations for Swiss Tax Standard ech0196

## Table of Contents
- [Attestations for Swiss Tax Standard ech0196](#attestations-for-swiss-tax-standard-ech0196)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Functions](#functions)
    - [AttestStatement](#atteststatement)
    - [RevokeStatementAttestation](#revokestatementattestation)
    - [VerifyStatement](#verifystatement)
    - [VerifyStatementDetails](#verifystatementdetails)
  - [Schemas](#schemas)
    - [Tax Statement Public](#tax-statement-public)
  - [TBD: References](#tbd-references)
  - [Query Attestations](#query-attestations)
  - [Resolver Contract (TBD)](#resolver-contract-tbd)
  - [Known Attestation UIDs](#known-attestation-uids)

## Purpose
This project facilitates the creation and validation of information from Swiss e-tax statements, adhering to the ech-0196 standard. This standard defines a digital format for tax declarations by individuals in Switzerland. By making attestations alongside these statements, issuers enable recipients to prove the authenticity of the statements, ensuring they remain unmodified (e.g., when submitted to the tax office). Additionally, specific financial information (like total assets, dividends, earnings) can be verified through merkle trees, useful in contexts like loan applications.

## Functions
### AttestStatement
- **Input**: PDF tax statement.
- **Effect**: Creates a blockchain attestation for the PDF statement.
- **Output**: AttestationUID (Unique Identifier for the attestation).
- **Details**: Utilizes the contentHash Schema. [Sepolia Network link](https://sepolia.easscan.org/attestation/view/0x9ba9dd33414a2e34165a1bfe9d2103b1692b69cc1963c9d14d14b95d8a5c590n).

### RevokeStatementAttestation
- **Input**: AttestationUID.
- **Effect**: Revokes the specified attestation.
- **Output**: Status of the revocation operation.

Sample call on loacalhosted functions: localhost:7071/api/revokeattestation/0xe02e3e69d932250eb3050b97d68265301ce7d93ba9a986884700368b8661c86c

### VerifyStatement
- **Input**: PDF tax statement.
- **Output**: Status of the statement (Verified/Unverified/Invalid).

### VerifyStatementDetails
- **Description**: TBD (Further details to be added).

## Schemas
### Tax Statement Public
(TBD: Details about the public schema used for tax statements.)

## TBD: References
- **Usage**: Utilizes the RefUID field to link to previous attestations for the same client and institution.
- **Cases**:
  - Previous tax period statement.
  - Previous version (in case of updates or corrections within the same tax period).

## Query Attestations
To query attestations on the Sepolia Network, use the following GraphQL query template:
- [Query by issuer, schema, and non-revoked status](https://studio.apollographql.com/sandbox/explorer)

Sample Query:
```graphql
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
```

## Resolver Contract (TBD)
- **Purpose**: Could be utilized to enable tax authorities to manage and verify allowed attestation providers.
- **Details**: TBD (Further information to be provided.)

## Known Attestation UIDs
- **First AttestationUID**: `0x9ba9dd33414a2e34165a1bfe9d2103b1692b69cc1963c9d14d14b95d8a5c5909`
- **2022 Report UID**: `0x93f3b0c58b0ed702328800ac2a7f7551e14ba6195a983d669e41cdcdfddfa00dd`
