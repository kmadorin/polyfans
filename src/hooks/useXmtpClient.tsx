import { Client, CompositeCodec } from '@xmtp/xmtp-js';
import { APP_NAME, APP_VERSION, XMTP_ENV } from '../constants';
import { useCallback, useEffect, useState, useContext } from 'react';
import { useSigner } from 'wagmi';
import { useMessengerStore } from '../store/messenger';
import AppContext from '../components/utils/AppContext';

const ENCODING = 'binary';

const buildLocalStorageKey = (walletAddress: string) => `xmtp:${XMTP_ENV}:keys:${walletAddress}`;

const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

/**
 * Anyone copying this code will want to be careful about leakage of sensitive keys.
 * Make sure that there are no third party services, such as bug reporting SDKs or ad networks, exporting the contents
 * of your LocalStorage before implementing something like this.
 */
const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(buildLocalStorageKey(walletAddress), Buffer.from(keys).toString(ENCODING));
};

const wipeKeys = (walletAddress: string) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

const useXmtpClient = (cacheOnly = false) => {
  const currentUser = useContext(AppContext);
  const client = useMessengerStore((state) => state.client);
  const setClient = useMessengerStore((state) => state.setClient);
  const [awaitingXmtpAuth, setAwaitingXmtpAuth] = useState<boolean>();
  const { data: signer, isLoading } = useSigner();

  useEffect(() => {
  	const initXmtpClient = async () => {
      setAwaitingXmtpAuth(true);
      if (signer && signer.getAddress && !client && currentUser) {
        let keys = loadKeys(await signer.getAddress());
        if (!keys) {
          if (cacheOnly) {
            return;
          }
          keys = await Client.getKeys(signer, {
            env: XMTP_ENV,
            appVersion: APP_NAME + '/' + APP_VERSION
          });
          storeKeys(await signer.getAddress(), keys);
        }

        const xmtp = await Client.create(null, {
          codecs: [new CompositeCodec()],
          env: XMTP_ENV,
          appVersion: APP_NAME + '/' + APP_VERSION,
          privateKeyOverride: keys
        });
        setClient(xmtp);
        setAwaitingXmtpAuth(false);
      } else {
        setAwaitingXmtpAuth(false);
      }
    };
    if ( !awaitingXmtpAuth ) {
    	initXmtpClient();
    }
    if (!signer || !currentUser) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, currentUser]);

  return {
    client: client,
    loading: isLoading || awaitingXmtpAuth
  };
};

export const useDisconnectXmtp = () => {
  const { data: signer } = useSigner();
  const client = useMessengerStore((state) => state.client);
  const setClient = useMessengerStore((state) => state.setClient);
  const disconnect = useCallback(async () => {
    if (signer) {
      wipeKeys(await signer.getAddress());
    }
    if (client) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    localStorage.removeItem(LS_KEYS.MESSAGE_STORE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, client]);

  return disconnect;
};

export default useXmtpClient;