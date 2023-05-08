import React from 'react';
import './App.css';
import { SDK  } from '@interest-protocol/sui-sdk';
import { devnetConnection, JsonRpcProvider, SUI_TYPE_ARG, TransactionBlock } from '@mysten/sui.js';
import { Button, Layout, theme } from 'antd';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';

const { Header, Content, Footer } = Layout;

const devNetProvider = new JsonRpcProvider(devnetConnection);
const sdk = new SDK(devNetProvider, "sui:devnet");

function App() {
  const wallet = useWallet();


  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleSwap = async () => {
    // Amount Selling
    const amountToSell = 1e9;
    // Minimum amount receiving
    const minAmountOut = 0;
    // Coin you are buying
    const coinInType = SUI_TYPE_ARG;
    // Coin you are selling
    const coinOutType = '0x65765307ff14d78b166c7201e12f96b679ec455292ec9be89cb0c6265c69b364::coins::ETH';

    const txb = new TransactionBlock();
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(amountToSell.toString())]);
    // const transactionBlock = await sdk.swap({
    //   txb,
    //   coinInList: [coin],
    //   coinInAmount: amountToSell.toString(),
    //   coinOutMinimumAmount: minAmountOut.toString(),
    //   coinInType,
    //   coinOutType,
    // });
    // console.log(transactionBlock.blockData.transactions);
    txb.moveCall({
      target: "0x65765307ff14d78b166c7201e12f96b679ec455292ec9be89cb0c6265c69b364::interface::swap_x",
      typeArguments: [coinInType, coinOutType],
      arguments: [
        txb.object("0x64fe8a8f30be97889d6b6bccadfff98dfa569626c3936d4be958f1cc50d5bb10"),
        txb.object("0x00467f02ae462ae8399e24b4ec73b115dd22c64da2646e7a3882cfc93446e94b"),
        txb.makeMoveVec({
          objects: [coin],
        }),
        txb.pure(amountToSell),
        txb.pure(minAmountOut),
      ],
    });
    console.log(txb.blockData.transactions);

    const res = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      requestType: 'WaitForEffectsCert',
      options: { showEffects: true, showInput: true },
    });
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <ConnectButton />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ background: colorBgContainer }}>
          <Button type="primary" onClick={handleSwap}>Swap</Button>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>SuiDev ©2023 SuiDev</Footer>
    </Layout>
  );
}

export default App;
