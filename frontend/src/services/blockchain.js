import { ethers } from "ethers";
import Marketplace from "../contracts/BlockShopMarketplace.json";

// 👉 get address from backend/config/deployment.json
const contractAddress = "0x88575876dA37B3ffE1c259a2Af54fE07529D3EDF";

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
export const buyProduct = async (productId, priceWei, qty = 1, shipping = 'Quick buy') => {
  const contract = await getContract();

  // convert ETH → Wei
  // const value = ethers.parseEther(priceEth.toString());
  const totalCost = BigInt(priceWei) * BigInt(qty);

  // ⚠️ adjust function name if different in your contract
  // return await contract.createOrder(productId, {
  //   value,
  // });

  const tx = await contract.placeOrder(productId, qty, shipping, { value: totalCost });
  return await tx.wait();

};