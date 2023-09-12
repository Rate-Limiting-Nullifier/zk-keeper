import {
  IConnectionApprovalData,
  IConnectIdentityRequestArgs,
  ConnectedIdentityMetadata,
  IInjectedMessageData,
  IInjectedProviderRequest,
  ISemaphoreFullProof,
  ISemaphoreProofRequiredArgs,
  IRLNProofRequiredArgs,
  IRLNSNARKProof,
  ICreateIdentityRequestArgs,
} from "@cryptkeeperzk/types";

import { RPCAction } from "../constants";
import { EventEmitter, EventHandler, EventName } from "../event";

/**
 * Stores promises associated with message nonces.
 */
const promises = new Map<string, Handlers>();

const EVENTS = [
  EventName.IDENTITY_CHANGED,
  EventName.LOGIN,
  EventName.LOGOUT,
  EventName.ADD_VERIFIABLE_CREDENTIAL,
  EventName.REJECT_VERIFIABLE_CREDENTIAL,
  EventName.REVEAL_COMMITMENT,
];

interface Handlers {
  resolve: (res?: unknown) => void;
  reject: (reason?: unknown) => void;
}

/**
 * Represents the CryptKeeper provider that is injected into the application.
 * This class is responsible for handling interactions with the CryptKeeper extension.
 *
 * @class
 */
export class CryptKeeperInjectedProvider {
  /**
   * Indicates whether the provider is CryptKeeper.
   */
  readonly isCryptKeeper = true;

  /**
   * Nonce used for message communication.
   */
  private nonce: number;

  /**
   * EventEmitter for handling events.
   */
  private emitter: EventEmitter;


  /**
   * EventEmitter for handling events.
   */
  private connectedOrigin?: string;

  /**
   * Creates an instance of CryptKeeperInjectedProvider.
   *
   * @constructor
   */
  constructor(connectedOrigin?: string) {
    this.nonce = 0;
    this.emitter = new EventEmitter();
    this.connectedOrigin = connectedOrigin
  }

  /**
   * Registers an event listener for the specified event.
   *
   * @param {EventName} eventName - The name of the event to listen for.
   * @param {EventHandler} cb - The callback function to be called when the event is triggered.
   * @returns {void}
   */
  on(eventName: EventName, cb: EventHandler): void {
    this.emitter.on(eventName, cb);
  }

  /**
   * Emits an event with the specified name and optional payload.
   *
   * @param {EventName} eventName - The name of the event to emit.
   * @param {unknown} payload - The optional payload to include with the event.
   * @returns {void}
   */
  emit(eventName: EventName, payload?: unknown): void {
    this.emitter.emit(eventName, payload);
  }

  /**
   * Removes all event listeners.
   *
   * @returns {void}
   */
  cleanListeners(): void {
    this.emitter.cleanListeners();
  }

  /**
   * Connects to the CryptKeeper extension.
   *
   * @returns {Promise<CryptKeeperInjectedProvider | undefined>} A Promise that resolves to the connected CryptKeeperInjectedProvider instance, or undefined if the CryptKeeper extension is not installed.
   */
  async connect(): Promise<ConnectedIdentityMetadata | undefined> {
    if (!this.connectedOrigin) {
      return undefined;
    }
    console.log("CONNECT 1", this.connectedOrigin);

    const { isApproved, canSkipApprove } = await this.approveConnection(this.connectedOrigin);

    if (isApproved) {
      console.log("CONNECT 2", this.connectedOrigin);

      await this.addHost(this.connectedOrigin, canSkipApprove);
    }

    // console.log("CONNECT 3");
    // await this.post({ method: RPCAction.CLOSE_POPUP });
    // console.log("CONNECT 4");

    await this.connectIdentity({ host: this.connectedOrigin });

    console.log("CONNECT 5");
    const connectedIdentity = await this.getConnectedIdentity();

    return connectedIdentity;
  }

  /**
   * Attempts to connect to the extension.
   *
   * @param {string} urlOrigin - The host origin to connect to.
   * @returns {Promise<Approvals>} A Promise that resolves to an object containing approval information.
   */
  private async approveConnection(urlOrigin: string): Promise<IConnectionApprovalData> {
    return this.post({
      method: RPCAction.APPROVE_CONNECTION,
      payload: { urlOrigin },
    }) as Promise<IConnectionApprovalData>;
  }

  /**
   * Sends a message to the extension.
   *
   * @param {IInjectedProviderRequest} message - The message to send.
   * @returns {Promise<unknown>} A Promise that resolves to the response from the extension.
   */
  private async post(message: IInjectedProviderRequest): Promise<unknown> {
    // TODO: (#75) enhance by moving towards long-lived connections #75
    return new Promise((resolve, reject) => {
      const messageNonce = this.nonce;
      this.nonce += 1;

      window.postMessage(
        {
          target: "injected-contentscript",
          message: {
            ...message,
            meta: {
              ...message.meta,
              urlOrigin: window.location.origin,
            },
            type: message.method,
          },
          nonce: messageNonce,
        },
        "*",
      );

      promises.set(messageNonce.toString(), { resolve, reject });
    });
  }

  /**
   * Adds a host to the approved list.
   *
   * @param {string} host - The host to add.
   * @param {boolean} canSkipApprove - Specifies whether the approval can be skipped.
   * @returns {Promise<unknown>} A Promise that resolves to the result of adding the host.
   */
  private async addHost(host: string, canSkipApprove: boolean): Promise<unknown> {
    return this.post({
      method: RPCAction.APPROVE_HOST,
      payload: { host, canSkipApprove },
    });
  }

  /**
   * Retrieves the connected identity.
   *
   * @returns {Promise<IConnectedIdentity>} A Promise that resolves to the connected identity.
   */
  async getConnectedIdentity(): Promise<ConnectedIdentityMetadata | undefined> {
    return this.post({
      method: RPCAction.GET_CONNECTED_IDENTITY_DATA,
    }) as Promise<ConnectedIdentityMetadata>;
  }

  /**
   * Connects to an existing identity for the specified host.
   *
   * @param {IConnectIdentityRequestArgs} urlOrigin - The host for which to connect to an identity.
   * @returns {Promise<void>} A Promise that resolves when the connection is complete.
   */
  private async connectIdentity({ host }: IConnectIdentityRequestArgs): Promise<void> {
    await this.post({
      method: RPCAction.CONNECT_IDENTITY_REQUEST,
      payload: {
        host,
      },
    });
  }

  /**
   * Creates an identity for the specified host.
   *
   * @param {ICreateIdentityRequestArgs} host - The host for which to create an identity.
   * @returns {Promise<void>} A Promise that resolves when the identity creation is complete.
   */
  async createIdentity({ host }: ICreateIdentityRequestArgs): Promise<void> {
    await this.post({
      method: RPCAction.CREATE_IDENTITY_REQUEST,
      payload: {
        host,
      },
    });
  }

  /**
   * Handles incoming messages from the extension.
   *
   * @param {IInjectedMessageData} event - The message event.
   * @returns {unknown} The result of handling the event.
   */
  eventResponser = (event: MessageEvent<IInjectedMessageData>): unknown => {
    const { data } = event;

    if (data.target === "injected-injectedscript") {
      if (EVENTS.includes(data.nonce as EventName)) {
        const [, res] = data.payload;
        this.emit(data.nonce as EventName, res);
        return;
      }

      if (!promises.has(data.nonce.toString())) {
        return;
      }

      const [err, res] = data.payload;
      const { reject, resolve } = promises.get(data.nonce.toString())!;

      if (err) {
        reject(new Error(err));
        return;
      }

      resolve(res);

      promises.delete(data.nonce.toString());
    }
  };

  /**
   * Generates a semaphore proof.
   *
   * @param {string} externalNullifier - The external nullifier.
   * @param {string} signal - The signal.
   * @param {MerkleProof} merkleProof - The merkle proof (optional).
   * @param {string | MerkleProofArtifacts} merkleProofArtifactsOrStorageAddress - The merkle proof artifacts or storage address.
   *
   * @returns {Promise<SemaphoreFullProof>} A Promise that resolves to the semaphore proof.
   */
  async generateSemaphoreProof({
    externalNullifier,
    signal,
    merkleProofProvided,
    merkleProofArtifactsOrStorageAddress,
  }: ISemaphoreProofRequiredArgs): Promise<ISemaphoreFullProof> {
    const merkleProofArtifacts =
      typeof merkleProofArtifactsOrStorageAddress === "string" ? undefined : merkleProofArtifactsOrStorageAddress;
    const merkleStorageAddress =
      typeof merkleProofArtifactsOrStorageAddress === "string" ? merkleProofArtifactsOrStorageAddress : undefined;

    return this.post({
      method: RPCAction.GENERATE_SEMAPHORE_PROOF,
      payload: {
        externalNullifier,
        signal,
        merkleStorageAddress,
        merkleProofArtifacts,
        merkleProofProvided,
      },
    }) as Promise<ISemaphoreFullProof>;
  }

  /**
   * Generates an RLN (Reputation Linked-Note) proof based on the provided RLN proof request.
   *
   * @param {string} rlnIdentifier - The RLN identifier as a string.
   * @param {string} message - The message content as a string.
   * @param {bigint | number} [messageLimit=1] - The message limit as a bigint or number. Defaults to 1 if not provided.
   * @param {bigint | number} [messageId=0] - The ID of the message as a bigint or number. Defaults to 0 if not provided.
   * @param {bigint | string} epoch - The epoch value as a bigint or string.
   * @param {MerkleProof} merkleProof - The merkle proof (optional).
   * @param {string | MerkleProofArtifacts} merkleProofArtifactsOrStorageAddress - Either the merkle proof artifacts or the merkle storage address as a string or MerkleProofArtifacts.
   *
   * @returns {Promise<RLNSNARKProof>} A Promise that resolves to the generated RLN proof.
   */
  async rlnProof({
    rlnIdentifier,
    message,
    messageLimit,
    messageId,
    epoch,
    merkleProofProvided,
    merkleProofArtifactsOrStorageAddress,
  }: IRLNProofRequiredArgs): Promise<IRLNSNARKProof> {
    const merkleProofArtifacts =
      typeof merkleProofArtifactsOrStorageAddress === "string" ? undefined : merkleProofArtifactsOrStorageAddress;
    const merkleStorageAddress =
      typeof merkleProofArtifactsOrStorageAddress === "string" ? merkleProofArtifactsOrStorageAddress : undefined;

    return this.post({
      method: RPCAction.GENERATE_RLN_PROOF,
      payload: {
        rlnIdentifier,
        message,
        messageId,
        messageLimit,
        epoch,
        merkleProofProvided,
        merkleProofArtifacts,
        merkleStorageAddress,
      },
    }) as Promise<IRLNSNARKProof>;
  }

  /**
   * Requests user to add a verifiable credential.
   *
   * @param {string} serializedVerifiableCredential - The json string representation of the verifiable credential to add.
   * @returns {void}
   */
  async addVerifiableCredentialRequest(serializedVerifiableCredential: string): Promise<void> {
    await this.post({
      method: RPCAction.ADD_VERIFIABLE_CREDENTIAL_REQUEST,
      payload: serializedVerifiableCredential,
    });
  }

  /**
   * Requests user to reveal a connected identity commitment.
   *
   * @returns {Promise<void>}
   */
  async revealConnectedIdentityRequest(): Promise<void> {
    await this.post({
      method: RPCAction.REVEAL_CONNECTED_IDENTITY_COMMITMENT_REQUEST,
    });
  }
}
