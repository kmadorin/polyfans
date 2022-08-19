import { Connector, ConnectorNotFoundError, Chain } from 'wagmi';
import { sequence, Wallet } from '0xsequence';

type SequenceConnectorOptions = {
    // see more info at https://docs.sequence.build/getting-started
    network?: string; // 'polygon' or 'mumbai'
    app: string;
};

const normalizeChainId = (chainId: string | number) => {
    if (typeof chainId === 'string')
        return Number.parseInt(
            chainId,
            chainId.trim().substring(0, 2) === '0x' ? 16 : 10
        );
    return chainId;
};

// https://github.com/tmm/wagmi/blob/main/packages/core/src/connectors/base.ts
export class SequenceConnector extends Connector {
    readonly id = 'sequence';
    readonly name = 'Sequence';
    readonly ready = typeof window !== 'undefined';

    wallet?: Wallet;
    connectDetails: any;
    connectOptions: any;

    constructor(config?: {
        chains?: Chain[]; // array of supported chain
        options?: SequenceConnectorOptions;
    }) {
        super({ ...config, options: config?.options });

        if (typeof window !== 'undefined') {
            this.wallet = new sequence.Wallet(config?.options?.network ?? 'polygon');
        }

        this.connectOptions = {
            app: config?.options?.app,
            authorize: false,
            settings: {
                includedPaymentProviders: ['moonpay', 'ramp'],
                defaultFundingCurrency: 'matic',
                lockFundingCurrencyToDefault: false,
            },
        };
    }

    async connect() {
        if (!this.wallet) throw new ConnectorNotFoundError();

        this.connectDetails = await this.wallet.connect(this.connectOptions);

        const provider = this.wallet.getProvider();
        if (provider && provider.on) {
            provider.on('accountsChanged', this.onAccountsChanged);
            provider.on('chainChanged', this.onChainChanged);
            if (!this.options?.shimChainChangedDisconnect)
                provider.on('disconnect', this.onDisconnect);
        }

        const account = await this.wallet?.getAddress();
        const id = await this.wallet?.getChainId();
        const unsupported = this.isChainUnsupported(id);

        return { account, chain: { id, unsupported }, provider };
    }

    async disconnect() {
        await this.wallet?.disconnect();
    }

    async getAccount() {
        if (!this.wallet) throw new ConnectorNotFoundError();
        return this.wallet?.getAddress();
    }

    async getChainId() {
        if (!this.wallet) throw new ConnectorNotFoundError();
        return this.wallet?.getChainId();
    }

    async getProvider() {
        return this.wallet?.getProvider();
    }

    async getSigner() {
        if (!this.wallet) throw new ConnectorNotFoundError();
        return this.wallet?.getSigner();
    }

    async isAuthorized() {
        if (!this.wallet) throw new ConnectorNotFoundError();
        return this.wallet?.isConnected();
    }

    protected onAccountsChanged = () => {
        // not used
    };

    protected onChainChanged = (chainId: number | string) => {
        const id = normalizeChainId(chainId);
        const unsupported = this.isChainUnsupported(id);
        this.emit('change', { chain: { id, unsupported } });
    };

    protected onDisconnect = () => {
        this.emit('disconnect');
    };
}
