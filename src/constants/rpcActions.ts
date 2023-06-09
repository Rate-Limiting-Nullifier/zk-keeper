export enum RPCAction {
  UNLOCK = "rpc/unlock",
  LOCK = "rpc/lock",
  GET_STATUS = "rpc/getStatus",
  CONNECT = "rpc/connect",
  SETUP_PASSWORD = "rpc/lock/setupPassword",
  CREATE_IDENTITY = "rpc/identity/createIdentity",
  CREATE_IDENTITY_REQ = "rpc/identity/createIdentityRequest",
  SET_CONNECTED_IDENTITY = "rpc/identity/setConnectedIdentity",
  SET_IDENTITY_NAME = "rpc/identity/setIdentityName",
  DELETE_IDENTITY = "rpc/identity/deleteIdentity",
  DELETE_ALL_IDENTITIES = "rpc/identity/deleteAllIdentities",
  GET_CONNECTED_IDENTITY_DATA = "rpc/identity/getConnectedIdentityData",
  GET_COMMITMENTS = "rpc/identity/getIdentityCommitments",
  GET_IDENTITIES = "rpc/identity/getIdentities",
  GET_REQUEST_PENDING_STATUS = "rpc/identity/getRequestPendingStatus",
  FINALIZE_REQUEST = "rpc/requests/finalize",
  GET_PENDING_REQUESTS = "rpc/requests/get",
  PREPARE_SEMAPHORE_PROOF_REQUEST = "rpc/protocols/semaphore/prepareProofRequest",
  PREPARE_RLN_PROOF_REQUEST = "rpc/protocols/rln/prepareProofRequest",
  NRLN_PROOF = "rpc/protocols/nrln/genProof",
  DUMMY_REQUEST = "rpc/protocols/semaphore/dummyReuqest",
  APPROVE_HOST = "rpc/hosts/approve",
  IS_HOST_APPROVED = "rpc/hosts/isHostApprove",
  GET_HOST_PERMISSIONS = "rpc/hosts/getHostPermissions",
  SET_HOST_PERMISSIONS = "rpc/hosts/setHostPermissions",
  REMOVE_HOST = "rpc/hosts/remove",
  CLOSE_POPUP = "rpc/popup/close",
  GET_CONNECT_WALLET = "rpc/wallet/get/connect",
  SET_CONNECT_WALLET = "rpc/wallet/connect",
  LOAD_IDENTITY_HISTORY = "rpc/identity/loadHistory",
  GET_IDENTITY_HISTORY = "rpc/identity/getHistory",
  DELETE_HISTORY_OPERATION = "rpc/identity/deleteHistoryOperation",
  DELETE_ALL_HISTORY_OPERATIONS = "rpc/identity/deleteHistory",
  ENABLE_OPERATION_HISTORY = "rpc/identity/historyEnable",
  DOWNLOAD_BACKUP = "rpc/backup/download",
  UPLOAD_BACKUP = "rpc/backup/upload",
  SAVE_MNEMONIC = "rpc/mnemonic/save",
  GENERATE_MNEMONIC = "rpc/mnemonic/generate",
  GET_ACCOUNTS = "rpc/accounts/get",
  SELECT_ACCOUNT = "rpc/accounts/select-account",
  GET_SELECTED_ACCOUNT = "rpc/accounts/get-selected-account",
  // DEV RPCS
  CLEAR_APPROVED_HOSTS = "rpc/hosts/clear",
}
