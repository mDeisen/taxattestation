const { app } = require('@azure/functions');
const { EAS } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");
const { setupEas } = require('./utils/SetupEas.js');

/**
 * Azure Function for revoking an attestation.
 * It takes an attestation UID as input and revokes that attestation on the blockchain.
 * Sample call on loacalhosted functions: localhost:7071/api/revokeattestation/0xe02e3e69d932250eb3050b97d68265301ce7d93ba9a986884700368b8661c86c
 */
app.http('RevokeAttestation', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'revokeattestation/{attestationUID}',
    handler: async (request, context) => {
        // Extract attestationUID from the request
        const attestationUID = request.params.attestationUID;
        if (!attestationUID) {
            return { body: 'No attestationUID provided', status: 400 };
        }

        // Initialize Ethereum Attestation Service (EAS) and connect with the signer
        const eas = setupEas();

        const schemaValue = process.env.CONTENT_HASH_SCHEMA_UID;

        try {
            // Send revoke attestation transaction
            const tx = await eas.revoke({
                schema: schemaValue,
                data: { uid: attestationUID }
            });

            // Wait for transaction
            await tx.wait();

            context.log(`Attestation ${attestationUID} revoked successfully.`);

            return {
                body: JSON.stringify({ message: `Attestation ${attestationUID} revoked successfully.` }),
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Allows access from any origin
                }
            }

        } catch (error) {
            // Log and return error details
            context.log('Error revoking attestation:', error);
            return { body: 'Error revoking attestation', status: 500 };
        }
    }
});
