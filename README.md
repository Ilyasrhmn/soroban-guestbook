# Soroban Public Guestbook

**Soroban Public Guestbook** - Blockchain-Based Decentralized Guestbook with Likes

## Project Description

Soroban Public Guestbook is a decentralized smart contract solution built on the Stellar blockchain using Soroban SDK. It provides an open, transparent platform where anyone can leave a message and like messages from others — all stored directly on the blockchain. The contract ensures that all data is immutable and publicly accessible through predefined smart contract functions, eliminating reliance on centralized database providers.

The system allows users to post messages with their name, view all guestbook entries, like messages they enjoy, and delete their own entries. Each message is uniquely identified and stored within the contract's instance storage, ensuring data persistence and reliability.

## Project Vision

Our vision is to reimagine social interaction in the digital age by:

- **Decentralizing Communication**: Moving public messages from centralized servers to a global, distributed blockchain
- **Ensuring Ownership**: Empowering users to have complete control over their digital voice and expression
- **Guaranteeing Immutability**: Providing a permanent, tamper-proof record of messages that cannot be altered by third parties
- **Enhancing Transparency**: Making all guestbook activity visible and verifiable on the Stellar blockchain
- **Building Trustless Systems**: Creating a platform where data integrity is guaranteed by code, not by company promises

We envision a future where digital communities are truly open and sovereign, where every message is owned by its author and not by a platform.

## Key Features

### 1. **Post a Message**

- Leave a message with your name and content with a single function call
- Automated unique ID generation for each entry
- Persistent storage on the Stellar blockchain
- Instant availability to all users after submission

### 2. **Like System**

- Like any message to show appreciation
- Like count is stored on-chain alongside the message
- Transparent and tamper-proof engagement tracking
- Anyone can like any message at any time

### 3. **Efficient Data Retrieval**

- Fetch all guestbook messages in a single call
- Structured data representation for easy frontend integration
- Returns message ID, author, content, and like count
- Real-time synchronization with blockchain state

### 4. **Message Deletion**

- Remove a specific message using its unique ID
- Permanent removal from contract storage
- Clean and efficient storage management
- Immediate update of the message list after deletion

### 5. **Message Counter**

- Instantly retrieve the total number of messages stored
- Useful for UI dashboards and analytics
- Lightweight call with no iteration overhead

### 6. **Stellar Network Integration**

- Leverages the high speed and low cost of Stellar
- Built using the modern Soroban Smart Contract SDK
- Scalable architecture for growing message collections
- Interoperable with other Stellar-based services

## Contract Details

- Contract Address: `CC6VP5I7AZWCL3HXPONFRYSZBHJCNPJHOSD463TQPGX5DKIWXVHJIJYB`

## Future Scope

### Short-Term Enhancements

1. **Author Verification**: Tie messages to Stellar wallet addresses for verified authorship
2. **Reply Threads**: Support nested replies to specific messages
3. **Rich Text Support**: Extend support beyond plain text to include Markdown and formatted content
4. **Message Search**: Implement filtering by author name or keyword

### Medium-Term Development

5. **Collaborative Moderation**: Implement multi-signature requirements for community-driven content moderation
   - Flag and report system for inappropriate content
   - Community voting on message removal
   - Moderator role management via contract admin
6. **Pinned Messages**: Allow contract owner to pin important messages to the top
7. **Asset Attachment**: Capability to attach digital tokens or tipping to messages
8. **Inter-Contract Integration**: Allow other Soroban contracts to read guestbook messages

### Long-Term Vision

9. **Cross-Chain Guestbook**: Extend message storage to multiple blockchain networks
10. **Decentralized UI Hosting**: Host the frontend on IPFS or similar decentralized platforms
11. **AI-Powered Sentiment Analysis**: Optional integration with AI to analyze message tone
12. **Privacy Layers**: Implement zero-knowledge proofs for anonymous but verified authorship
13. **DAO Governance**: Community-driven protocol improvements and feature prioritization
14. **Identity Management**: Integration with decentralized identity (DID) systems for user profiles

### Enterprise Features

15. **Event Guestbooks**: Adapt the system for event-specific guestbooks with time-locked entries
16. **Immutable Logging**: Create time-locked message archives for audit purposes
17. **Automated Reporting**: Summarize guestbook activity for periodic reporting
18. **Multi-Language Support**: Expand accessibility with internationalization

---

## Technical Requirements

- Soroban SDK
- Rust programming language
- Stellar blockchain network

## Getting Started

Deploy the smart contract to Stellar's Soroban network and interact with it using the five main functions:

- `add_message()` - Post a new message with author name and content
- `get_messages()` - Retrieve all stored messages from the contract
- `like_message()` - Increment the like count on a specific message
- `delete_message()` - Remove a specific message by its ID
- `message_count()` - Get the total number of messages currently stored

---

**Soroban Public Guestbook** - Your Voice, Permanently on the Blockchain
