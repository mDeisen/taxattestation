const { app } = require('@azure/functions');
const { EAS } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
const verifyHashExists = require('./utils/QueryForFileHash');
const calculateFileHash = require('./utils/CalculateFileHash.js');

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
        const filePath = path.join(__dirname, '../../', 'test', 'dl_de_22.pdf');
        const fileStream = fs.createReadStream(filePath);

        // Environment variables for blockchain and GraphQL configurations
        const networkUrl = process.env.NETWORK_URL;
        const easContractAddress = process.env.EAS_CONTRACT_ADDRESS;
        const contentHashSchemaUID = process.env.CONTENT_HASH_SCHEMA_UID;
        const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;

        // Setting up Ethereum provider and signer
        const provider = new ethers.JsonRpcProvider(networkUrl);
        const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

        // Initialize Ethereum Attestation Service (EAS) and connect with the signer
        const eas = new EAS(easContractAddress);
        eas.connect(signer);

        try {
            // Calculate the file hash
            const contentHash = await calculateFileHash(fileStream);
            const contentHashBytes32 = '0x' + contentHash;

            // Verify if the hash exists in the attestations
            const hashExists = await verifyHashExists(graphqlEndpoint, signer.address, contentHashSchemaUID, false, contentHashBytes32);
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
