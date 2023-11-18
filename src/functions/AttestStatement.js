const { app } = require('@azure/functions');
const { EAS, SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk");
const { ethers } = require("ethers");
const fs = require('fs');
const calculateFileHash = require('./utils/CalculateFileHash.js');
const path = require('path');

app.http('AttestStatementJs', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        //Debug only - pass file by location or form directly
        const filePath = path.join(__dirname, '../../', 'test', 'dl_de_22.pdf');
        const fileStream = fs.createReadStream(filePath);

        const networkUrl = process.env.NETWORK_URL;
        const provider = new ethers.JsonRpcProvider(networkUrl);

        const easContractAddress = process.env.EAS_CONTRACT_ADDRESS;
        const contentHashSchemaUID = process.env.CONTENT_HASH_SCHEMA_UID;
        const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

        const eas = new EAS(easContractAddress);

        eas.connect(signer);


       try {
            // Calculate the file hash & convert to bytes32
            const contentHash = await calculateFileHash(fileStream);
            const contentHashBytes32 = '0x'+ contentHash;

            // Setup schema data
            const schemaEncoder = new SchemaEncoder("bytes32 contentHash");
            const encodedData = schemaEncoder.encodeData([
                { name: "contentHash", value: contentHashBytes32, type: "bytes32" }
            ]);

            const tx = await eas.attest({
                schema: contentHashSchemaUID,
                data: {
                    recipient: "0x324F3A98fC8567A147d013fC2869c33d2B373645",
                    expirationTime: 0,
                    revocable: true, // Be aware that if your schema is not revocable, this MUST be false
                    data: encodedData,
                },
            });
            const newAttestationUID = await tx.wait();
            context.log(`AttestationUID ${newAttestationUID}!`);
            return { body: `AttestationUID ${newAttestationUID}!` };

        } catch (error) {
            context.log('Error attesting statement:', error);
            return { body: 'Error processing file', status: 500 };
        }

    }
});
