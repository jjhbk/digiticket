pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract DigiTicket is ERC721URIStorage, Ownable, EIP712 {
    using ECDSA for bytes32;

    // Define the type hash for the RedeemRequest struct
    bytes32 private constant REDEEM_TYPEHASH =
        keccak256(
            "RedeemRequest(address redeemer,uint256 tokenId,uint256 nonce,uint256 deadline)"
        );

    // Mapping to keep track of nonces for replay protection
    mapping(address => uint256) public nonces;
    // Mapping to store the price of each tokenId
    mapping(uint256 => uint256) public tokenPrices;
    event PriceSet(uint256 indexed tokenId, uint256 price);
    // Maximum number of tokens that can be minted
    uint256 public maxTokens;

    // Total number of tokens minted so far
    uint256 public totalMinted;
    event Redeemed(uint256 tokenId, address redeemer);
    event Mint(address indexed to, uint256 tokenId, string tokenURI);

    constructor(
        string memory name,
        string memory symbol,
        string memory version,
        uint256 maxtokens
    )
        ERC721(name, symbol)
        Ownable(msg.sender)
        EIP712(name, version) // Pass name and version to the EIP712 base constructor
    {
        maxTokens = maxtokens;
    }

    struct RedeemRequest {
        address redeemer;
        uint256 tokenId;
        uint256 nonce;
        uint256 deadline;
    }

    function _hashRedeemRequest(
        RedeemRequest memory req
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    REDEEM_TYPEHASH,
                    req.redeemer,
                    req.tokenId,
                    req.nonce,
                    req.deadline
                )
            );
    }

    function redeem(
        uint256 tokenId,
        uint256 deadline,
        bytes memory signature
    ) public {
        require(block.timestamp <= deadline, "Signature expired");

        uint256 nonce = nonces[msg.sender];
        RedeemRequest memory req = RedeemRequest({
            redeemer: msg.sender,
            tokenId: tokenId,
            nonce: nonce,
            deadline: deadline
        });

        // Use _hashTypedDataV4 from EIP712 to hash the typed data
        bytes32 digest = _hashTypedDataV4(_hashRedeemRequest(req));

        // Recover the signer's address from the digest and signature
        address signer = ECDSA.recover(digest, signature);
        require(signer == owner(), "Invalid signature");

        // Increment the nonce to prevent replay attacks
        nonces[msg.sender]++;

        // Redeem the NFT (e.g., burn or transfer)
        _redeemNFT(msg.sender, tokenId);
    }

    function _redeemNFT(address redeemer, uint256 tokenId) internal {
        // Redemption logic (e.g., burn or transfer)
        super._burn(tokenId);
        emit Redeemed(tokenId, redeemer);
    }

    // Mint a new NFT with a token URI
    function mint(
        address to,
        uint256 tokenId,
        string memory tokenURI
    ) public payable {
        //require(!super._exists(tokenId), "Token already minted");
        uint256 price = tokenPrices[tokenId];
        require(totalMinted < maxTokens, "Token limit reached");
        require(price > 0, "Token price not set");
        require(msg.value >= price, "Insufficient payment");

        // Transfer payment to the contract owner
        payable(owner()).transfer(msg.value);

        // Mint the NFT
        super._mint(to, tokenId);
        super._setTokenURI(tokenId, tokenURI);
        totalMinted++;
        emit Mint(to, tokenId, tokenURI);
    }

    // Set the price for a specific tokenId
    function setTokenPrice(uint256 tokenId, uint256 price) public onlyOwner {
        require(price > 0, "Price must be greater than zero");
        tokenPrices[tokenId] = price;
        emit PriceSet(tokenId, price);
    }

    // Optional: Helper function to get the current nonce for a specific tokenId
    function getNonce(address redeemer) external view returns (uint256) {
        return nonces[redeemer];
    }
}
