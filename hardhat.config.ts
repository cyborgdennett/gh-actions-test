import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
// import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-gas-reporter';


module.exports = {
  networks: {
      hardhat: {
          mining: {
              auto: true,
          },
      },
      private: {
          url: 'http://localhost:8545',
          accounts: [], //enter deployerPrivateKey, wholeSalerPrivateKey
          chainId: 9090,
          gas: 2100000,
          gasPrice: 8000000000,
      },
  },
  solidity: {
      version: '0.8.14',
      settings: {
          optimizer: {
              enabled: true,
              runs: 999999,
          },
      },
  },
  gasReporter: {
      outputFile: `gasReport.txt`,
      showTimeSpent: false,
      noColors: true,
  },
};
