const hre = require("hardhat");

async function main() {
  console.log("Dang deploy VeriTix Smart Contract...");
  
  const VeriTix = await hre.ethers.getContractFactory("VeriTix");  
  
  const veritix = await VeriTix.deploy();
  
  await veritix.waitForDeployment();

  const address = await veritix.getAddress();
  console.log("VeriTix da duoc deploy tai dia chi:", address);  
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});