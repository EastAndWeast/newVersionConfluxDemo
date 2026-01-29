import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { ethers } from 'ethers';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('bitunion_token');
            if (token) {
                setUser({ address: localStorage.getItem('bitunion_address') });
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            throw new Error('No ethereum wallet found');
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            return await signer.getAddress();
        } catch (err) {
            console.error('Failed to connect wallet', err);
            throw err;
        }
    };

    const login = async (address) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Get Nonce
            const { nonce } = await authApi.getNonce(address);

            // 2. Prepare EIP-712 Signature
            let signature;

            // Check if browser has wallet
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const network = await provider.getNetwork();
                const TARGET_CHAIN_ID = 71; // BitUnion Test API expects ChainID 71

                // Check and Switch Network
                if (Number(network.chainId) !== TARGET_CHAIN_ID) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x' + TARGET_CHAIN_ID.toString(16) }],
                        });
                    } catch (switchError) {
                        // This error code indicates that the chain has not been added to MetaMask.
                        if (switchError.code === 4902) {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: '0x' + TARGET_CHAIN_ID.toString(16),
                                    chainName: 'Conflux eSpace (Testnet)',
                                    nativeCurrency: { name: 'CFX', symbol: 'CFX', decimals: 18 },
                                    rpcUrls: ['https://evmtestnet.confluxrpc.com'],
                                    blockExplorerUrls: ['https://testnet.confluxscan.net'],
                                }],
                            });
                        } else {
                            throw new Error(`Please switch your wallet to Conflux eSpace Testnet (ChainID: ${TARGET_CHAIN_ID}) to use the Test API.`);
                        }
                    }
                }

                const signer = await provider.getSigner();
                const signerAddress = await signer.getAddress();

                // Ensure the address being logged in matches the signer
                if (signerAddress.toLowerCase() !== address.toLowerCase()) {
                    throw new Error(`Signer address mismatch! Wallet is ${signerAddress.slice(0, 6)}..., but you entered ${address.slice(0, 6)}... Click 'Auto-fill' to fix.`);
                }

                const domain = {
                    name: "BitUnion-Backend",
                    version: "1.0.0",
                    chainId: TARGET_CHAIN_ID,
                };

                const types = {
                    Body: [
                        { name: "nonce", type: "string" },
                    ],
                };

                const value = { nonce };
                signature = await signer.signTypedData(domain, types, value);

                // Use the checksummed address from signer
                address = signerAddress;
            } else {
                // Mock Signature for non-wallet environments
                console.warn('No ethereum wallet found, using mock signature');
                signature = '0x' + '0'.repeat(130); // 65 bytes of zero
            }

            // 3. Authenticate
            const response = await authApi.login({
                registerAddress: address,
                signature: signature,
                isBimWallet: false
            });

            const token = response.token;
            localStorage.setItem('bitunion_token', token);
            localStorage.setItem('bitunion_address', address);
            setUser({ address });

            return response;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Login failed';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('bitunion_token');
        localStorage.removeItem('bitunion_address');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        connectWallet,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
