const { app } = require('@azure/functions');
const { EAS, SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");
const fs = require('fs');
const calculateFileHash = require('./utils/CalculateFileHash.js');
const { setupEas } = require('./utils/SetupEas.js');
const path = require('path');

/**
 * Azure Function for creating attestations for a document.
 * It calculates the hash of a provided file and creates an attestation with this hash
 * in the blockchain.
 */
app.http('AttestStatementHash', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'atteststatementhash/{recipient}/{contenthash}',
    handler: async (request, context) => {
        // Extract recipient && hash from the request
        const recipient = request.params.recipient;
        const contentHash = request.params.contenthash;
        if (!contentHash || !recipient) {
            return { body: 'Contenthash or recipient missing', status: 400 };
        }
        // Environment variables for blockchain configurations
        const contentHashSchemaUID = process.env.CONTENT_HASH_SCHEMA_UID;

        // Initialize Ethereum Attestation Service (EAS) and connect with the signer
        const eas = setupEas();

        try {
            const contentHashBytes32 = '0x' + contentHash;

            // Setup schema data for attestation
            const schemaEncoder = new SchemaEncoder("bytes32 contentHash");
            const encodedData = schemaEncoder.encodeData([
                { name: "contentHash", value: contentHashBytes32, type: "bytes32" }
            ]);

            // Send attestation transaction
            const tx = await eas.attest({
                schema: contentHashSchemaUID,
                data: {
                    recipient: recipient,
                    expirationTime: 0,
                    revocable: true, // This must match your schema's revocability
                    data: encodedData,
                },
            });

            // Wait for the transaction to be mined
            const newAttestationUID = await tx.wait();

            context.log(`AttestationUID ${newAttestationUID}!`);

            // Return the Attestation UID in the response
            return {
                body: JSON.stringify({ message: `AttestationUID ${newAttestationUID}!` }),
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Allows access from any origin
                }
            };

        } catch (error) {
            // Log and return error details
            context.log('Error attesting statement:', error);
            return { body: 'Error processing file', status: 500 };
        }
    }
});
