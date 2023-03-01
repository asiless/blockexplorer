import { Alchemy, Network, Utils } from 'alchemy-sdk';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  
  // In this week's lessons we used ethers.js. Here we are using the
  // Alchemy SDK is an umbrella library with several different packages.
  //
  // You can read more about the packages here:
  //   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
  const alchemy = new Alchemy(settings);
  


export async function getBlock(hash) {
    console.log('HASH', hash)

    if(hash == null) {
        hash = 'latest';
    }

    let block =  await alchemy.core.getBlockWithTransactions(hash);
    console.log('BLOCK', hash, block)
    return block;
}


export async function getBalance(value) {
    console.log('VALUE =>', value);
    let b = await alchemy.core.getBalance(value, 'latest');
    console.log('BALANCE =>', b);
    let n = Utils.formatEther(b);
    console.log('ETH =>', n);
    return n;
}