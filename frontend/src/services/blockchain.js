import { ethers } from "ethers";
import Marketplace from "../contracts/BlockShopMarketplace.json";

// 👉 get address from backend/config/deployment.json
const contractAddress = "YOUR_MARKETPLACE_ADDRESS";

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    contractAddress,
    Marketplace.abi, // ✅ use .abi
    signer
  );
};

// ✅ BUY PRODUCT FUNCTION (update based on your contract)
export const buyProduct = async (productId, priceEth) => {
  const contract = await getContract();

  // convert ETH → Wei
  const value = ethers.parseEther(priceEth.toString());

  // ⚠️ adjust function name if different in your contract
  return await contract.createOrder(productId, {
    value,
  });
};