import {
    AccountBalanceQuery,
    Client,
    CustomFixedFee,
    CustomRoyaltyFee,
    Hbar,
    NftId,
    PrivateKey,
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenSupplyType,
    TokenType,
} from '@hashgraph/sdk';
import Logger from 'js-logger';
import axios, {AxiosResponse} from 'axios';
import {
    Fees,
    HederaAccount,
    NftCreated,
    HederaEnvironment,
    CreateNFT,
} from 'src/models/hedera.interface';

const HEDERA_CREATE_NFT_FEES = 1;

export class HederaSdk {
    readonly hederaAccount: HederaAccount;
    private client: Client;

    constructor(hederaAccount: HederaAccount) {
        this.hederaAccount = hederaAccount;
        this.client = this.setClient({
            accountId: this.hederaAccount.accountId,
            privateKey: this.hederaAccount.privateKey,
            environment: this.hederaAccount.environment,
        });
    }

    async createNFT({
                        name,
                        symbol,
                        customFees,
                        supply,
                        cids,
                        nfts,
                        supplyKey,
                        adminKey,
                    }: CreateNFT): Promise<NftCreated> {
        try {
            const urls: string[] = [];
            /* Create a royalty fee */
            const customRoyaltyFee: any = [];
            if (customFees) {
                customFees.map((customFee) => {
                    const fee = new CustomRoyaltyFee()
                        .setNumerator(customFee.numerator) // The numerator of the fraction
                        .setDenominator(customFee.denominator); // The denominator of the fraction
                    if (customFee.fallbackFee) {
                        fee.setFallbackFee(
                            new CustomFixedFee().setHbarAmount(
                                new Hbar(customFee.fallbackFee),
                            ),
                        ); // The fallback fee
                    }
                    fee.setFeeCollectorAccountId(customFee.collectorAccountId); // The account that will receive the royalty fee
                    customRoyaltyFee.push(fee);
                });
            }
            const supplyKey = PrivateKey.generate();

            /* Create the NFT */
            const tx = new TokenCreateTransaction()
                .setTokenType(TokenType.NonFungibleUnique)
                .setTokenName(name)
                .setTokenSymbol(symbol)
                .setSupplyKey(supplyKey)
                .setSupplyType(TokenSupplyType.Finite)
                .setInitialSupply(0)
                .setMaxSupply(supply ?? nfts.length)
                .setTreasuryAccountId(this.hederaAccount.accountId)
                .setAutoRenewAccountId(this.hederaAccount.accountId)
                .setCustomFees(customRoyaltyFee);

            if (supplyKey) {
                tx.setSupplyKey(supplyKey);
            }

            if (adminKey) {
                tx.setAdminKey(adminKey);
            }

            const transaction = await tx.signWithOperator(this.client);

            /*  submit to the Hedera network */
            const response = await transaction.execute(this.client);

            /* Get the receipt of the transaction */
            const receipt = await response.getReceipt(this.client);

            /* Get the token ID from the receipt */
            const tokenId = receipt.tokenId;

            /* Mint the token */
            const nftIds = [];
            const limit_chunk = 5;
            const max = supply ?? nfts.length;
            for (let idx = 0; idx < max; idx += limit_chunk) {
                const limit = idx + limit_chunk > max ? max - idx : limit_chunk;
                const mintTransaction = new TokenMintTransaction().setTokenId(tokenId!);

                for (let i = 0; i < limit; i++) {
                    const url = (cids[i] || cids[0]);

                    mintTransaction.addMetadata(Buffer.from(url));

                    if (i === 0 || !supply) {
                        urls.push(url);
                    }
                }
                /* Sign with the supply private key of the token */
                const signTx = await mintTransaction
                    .freezeWith(this.client)
                    .sign(supplyKey);
                /* Submit the transaction to a Hedera network */
                const resp = await signTx.execute(this.client);
                const receiptMint = await resp.getReceipt(this.client);
                /* Get the Serial Number */
                const serialNumber = receiptMint.serials;

                /* Get the NftId */
                for (const nftSerial of serialNumber.values()) {
                    nftIds.push(new NftId(tokenId!, nftSerial).toString());
                }
            }

            return {
                urls,
                txId: response.transactionId.toString(),
                tokenId: tokenId!.toString(),
                nftIds,
            };
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     *  Hedera fees for NFT's creation
     */
    async getFees(): Promise<Fees> {
        const hbarPrice = await this.getHbarToCurrency();
        return {
            usd: HEDERA_CREATE_NFT_FEES,
            hbar: +parseFloat((HEDERA_CREATE_NFT_FEES / hbarPrice).toFixed(3)),
        };
    }

    /**
     * Set Hedera SDK Client
     * @param accountId
     * @param privateKey
     * @param environment
     */
    private setClient({accountId, privateKey, environment}: HederaAccount) {
        let client;
        if (environment === HederaEnvironment.MAINNET) {
            client = Client.forMainnet();
        } else {
            client = Client.forTestnet();
        }
        client.setOperator(accountId, privateKey);
        return client;
    }

    /**
     * Getting the current HBAR price in usd
     */
    private getHbarToCurrency(): Promise<number> {
        return axios
            .get(
                `https://api.coingecko.com/api/v3/coins/hedera-hashgraph?market_data=true`,
            )
            .then((res: AxiosResponse) => {
                return +res.data.market_data.current_price['usd'];
            });
    }
}
