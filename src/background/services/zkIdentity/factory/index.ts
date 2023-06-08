import { Identity } from "@semaphore-protocol/identity";

import { ICreateIdentityArgs, StrategiesMap } from "@src/types";

import { ZkIdentitySemaphore } from "../protocols/ZkIdentitySemaphore";

const strategies = {
  random: createRandomIdentity,
  interrep: createInterrepIdentity,
};

export function createNewIdentity(strategy: keyof StrategiesMap, config: ICreateIdentityArgs): ZkIdentitySemaphore {
  return strategies[strategy](config);
}

function createInterrepIdentity(config: ICreateIdentityArgs): ZkIdentitySemaphore {
  const { identityStrategy, web2Provider, name, messageSignature, account, groups, host } = config;

  const identity = new Identity(messageSignature);

  return new ZkIdentitySemaphore(identity, {
    account,
    name,
    identityStrategy,
    web2Provider,
    groups,
    host,
  });
}

function createRandomIdentity(config: ICreateIdentityArgs): ZkIdentitySemaphore {
  const { identityStrategy, name, account, groups, host } = config;
  const identity = new Identity();

  return new ZkIdentitySemaphore(identity, {
    account,
    name,
    identityStrategy,
    groups,
    host,
  });
}
