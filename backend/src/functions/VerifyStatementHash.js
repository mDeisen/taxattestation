const { app } = require('@azure/functions');
const { EAS } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
const verifyHashExists = require('./utils/QueryForFileHash.js');
const calculateFileHash = require('./utils/CalculateFileHash.js');
const { setupEas } = require('./utils/SetupEas.js');

/**
 * Azure Function to verify the existence of an attestation for the provided tax statement pdf document by a trusted provider
 * It calculates the hash of a provided file and checks if this hash exists in the
 * blockchain attestations using a GraphQL query.
 */
app.http('VerifyStatementHash', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'verifystatementhash/{contenthash}',
    handler: async (request, context) => {
        // Extract hash from the request
       const contentHash = request.params.contenthash;
        if (!contentHash) {
            return { body: 'Contenthash or recipient missing', status: 400 };
        }

        // Environment variables for GraphQL configurations
        const contentHashSchemaUID = process.env.CONTENT_HASH_SCHEMA_UID;
        const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;
        const attesterAddress = process.env.ATTESTER_ADDRESS;

        try {
            // Calculate the file hash
            const contentHashBytes32 = '0x' + contentHash;

            // Verify if the hash exists in the attestations
            const hashExists = await verifyHashExists(graphqlEndpoint, attesterAddress, contentHashSchemaUID, false, contentHashBytes32);
            var revokedHashExists;
            if (!hashExists) {
                revokedHashExists = await verifyHashExists(graphqlEndpoint, attesterAddress, contentHashSchemaUID, true, contentHashBytes32);
            }

            console.log('Hash exists:', hashExists);
            console.log('Revoked Hash exists:', revokedHashExists);

            // Return the existence status of the hash
            if(hashExists){
                return {
                    body: JSON.stringify({ message: `Successfully verified statement!` }),

                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*', // Allows access from any origin
                    }
                }
            } else if (revokedHashExists) {
                return {
                    body: JSON.stringify({ message: `Statement has been revoked!` }),
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*', // Allows access from any origin
                    }
                }
            } else {
                return {
                    body: JSON.stringify({ message: `Statement has not been attested!` }),
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*', // Allows access from any origin
                    }
                }
            }
        
        } catch (error) {
            // Log and return error details
            context.log('Error verifying statement:', error);
            return { body: 'Error verifying statement', status: 500 };
        }
    }
});
