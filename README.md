## Project description

Polyfans Messenger is a decentralized messenger for creators and their ~fans~ frens.

Polyfans Messenger is built on **Polygon** on top of **XMTP** and **Lens Protocol**. Media content is stored on ** IPFS **. **Livepeer** is used for video messages and live-streams

## Key features
- Decentralized chat
- Custom messages types (video, audio, images, donations(TBD)) 
- Livestreams (TBD)
- Public channels with token-gated content (TBD)
- User profiles additional info (ENS name, avatar, TBD: sismo badges, etc...)
- Notes (TBD) - messages to your address

## How it works

	The underlying messaging protocol is XMTP. Custom messages types implemented via XMTP Content types (composite type for now)
	User profiles - Lens Protocol
	Decentralized storage - IPFS
	Livestreams, video playback - Livepeer.js


## Installation

Clone the repository

```bash
$ git clone https://github.com/kmadorin/polyfans.git
$ cd polyfans
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

#### [Live Demo on Mumbai testnet](https://polyfans-messenger.vercel.app/)
#### [Figma prototype](https://www.figma.com/proto/s5FaHr7HYaCUvBhdcGUD2F/Polyfans-Messenger?node-id=0%3A1&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=157%3A53)
