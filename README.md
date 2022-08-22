## Project description

Polyfans is a decentralized version of Patreon for web2 and web3 creators and their fans.

Polyfans is built on **Polygon** on top of **Lens Protocol**. Powered by **Fluence**, **Sequence**, **Lit Protocol** and **IPFS**.

## Key features
- Decentralized -> can't be blocked, users own their content
- Extendable -> additional logic can be added via custom Lens protocol modules
- Pluggable -> can be used inside apps like Discord and Telegram

## How it works

- All entities are NFTs: creators' profiles, posts, comments.
- All content and metadata are stored on IPFS. Polyfans used Infura provider for now. But we've started migration to **Fluence** nodes IPFS service to make our dapp more decentrilized
- To get access to exclusive content from creators a user has to get followNFT or collect post's NFT or fits any other on-chain conditions specified by the creator. **Lit protocol** is used to encrypt and decrypt hidden posts
- Social/email login and free transactions are available for web2 users via **Sequence wallet** and Lens API

## Installation

Clone the repository

```bash
$ git clone https://github.com/kmadorin/polyfans.git
$ cd solaris-ui
```

Edit environment variables in `.env` file 
```bash
cp .env.example .env
```

And after that use these commands:
```bash
$ npm install
$ npm run dev
```

## Quick Links

#### [Live Demo on Mumbai testnet](https://polyfans.vercel.app/)
#### [Figma prototype](https://www.figma.com/proto/WjEGfFw7as0bo7itxYlX8t/Polyfans?page-id=226%3A905&node-id=486%3A1326&viewport=648%2C549%2C0.1&scaling=scale-down-width&starting-point-node-id=486%3A1326&hide-ui=1)

#### [Deck from Polygon Buidl It Summer 2022 hackathon](https://drive.google.com/file/d/1DYxaYR7y3repYAEFvLU7M8IYhNyqeEI6/view?usp=sharing)


## Next steps

We are looking for funding or grant support to continue the development and add new features such as:

- Reach web3-worthy editor for posts and comments
- Messages and notifications for followers using XMTP
- Live streams for followers using Livepeer. Using POAP tokens as a gateway to the recordings
- More complex follow modules logic. For example, depositing all fees to lending/borrowing protocols, etc.
- Decentralized API and indexer using Fluence, as well as Fluence-based IPFS gateways
