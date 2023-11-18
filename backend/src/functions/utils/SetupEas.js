const { ethers } = require("ethers");
const { EAS } = require("@ethereum-attestation-service/eas-sdk");

const setupEas = () => {
    const networkUrl = process.env.NETWORK_URL;
    const easContractAddress = process.env.EAS_CONTRACT_ADDRESS;

    const provider = new ethers.JsonRpcProvider(networkUrl);
    const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

    const eas = new EAS(easContractAddress);
    eas.connect(signer);

    return eas;
};

module.exports = { setupEas };