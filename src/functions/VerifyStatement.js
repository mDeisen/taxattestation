const { app } = require('@azure/functions');
const { EAS } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
const verifyHashExists = require('./utils/QueryForFileHash');
const calculateFileHash = require('./utils/CalculateFileHash.js');
const { setupEas } = require('./utils/SetupEas.js');

/**
 * Azure Function to verify the existence of an attestation for the provided tax statement pdf document by a trusted provider
 * It calculates the hash of a provided file and checks if this hash exists in the
 * blockchain attestations using a GraphQL query.
 */
app.http('VerifyStatement', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // Debug only: Path to the test file
        const filePath = path.join(__dirname, '../../', 'test', 'dl_en_22.pdf');
        const fileStream = fs.createReadStream(filePath);

        // Environment variables for GraphQL configurations
        const contentHashSchemaUID = process.env.CONTENT_HASH_SCHEMA_UID;
        const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;
        const attesterAddress = process.env.ATTESTER_ADDRESS;

        try {
            // Calculate the file hash
            const contentHash = await calculateFileHash(fileStream);
            const contentHashBytes32 = '0x' + contentHash;

            // Verify if the hash exists in the attestations
            const hashExists = await verifyHashExists(graphqlEndpoint, attesterAddress, contentHashSchemaUID, false, contentHashBytes32);
            console.log('Hash exists:', hashExists);

            // Return the existence status of the hash
            return { body: `Hash exists: ${hashExists}` };

        } catch (error) {
            // Log and return error details
            context.log('Error verifying statement:', error);
            return { body: 'Error verifying statement', status: 500 };
        }
    }
});
