/* eslint-disable @typescript-eslint/unbound-method */
import CryptoJS from "crypto-js";
import { browser } from "webextension-polyfill-ts";

import { LockService } from "@src/background/services/Lock";
import { SimpleStorageService } from "@src/background/services/Storage";
import { setStatus } from "@src/ui/ducks/app";
import pushMessage from "@src/util/pushMessage";

jest.mock("crypto-js", (): unknown => ({
  ...jest.requireActual("crypto-js"),
  AES: {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  },
}));

jest.mock("@src/util/pushMessage");

jest.mock("@src/background/services/Storage/SimpleStorage");

describe("background/services/Lock", () => {
  const lockService = LockService.getInstance();
  const defaultPassword = "password";
  const defaultTabs = [{ id: "1" }, { id: "2" }, { id: "3" }];
  const passwordChecker = "Password is correct";

  beforeEach(async () => {
    (browser.tabs.query as jest.Mock).mockResolvedValue(defaultTabs);

    await lockService.logout();

    (CryptoJS.AES.encrypt as jest.Mock).mockReturnValue(defaultPassword);

    (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({ toString: () => passwordChecker });

    (browser.tabs.sendMessage as jest.Mock).mockClear();
    (pushMessage as jest.Mock).mockReset();
    (browser.tabs.sendMessage as jest.Mock).mockRejectedValueOnce(false).mockResolvedValue(true);

    (SimpleStorageService as jest.Mock).mock.instances.forEach((instance: { get: jest.Mock }) => {
      instance.get.mockReturnValue(defaultPassword);
    });
  });

  describe("ensure", () => {
    test("should return false if there is no password or it's not unlocked", async () => {
      const result = await lockService.ensure();

      expect(result).toBe(false);
    });

    test("should return args from ensure call properly", async () => {
      await lockService.unlock(defaultPassword);

      const result = await lockService.ensure({ args: [1, 2, 3] });

      expect(result).toStrictEqual({ args: [1, 2, 3] });
    });
  });

  describe("encrypt / decrypt", () => {
    test("should encrypt properly", async () => {
      await lockService.unlock(defaultPassword);

      const result = lockService.encrypt(defaultPassword);

      expect(result).toStrictEqual(defaultPassword);
    });

    test("should not encrypt if there is no password", () => {
      expect(() => lockService.encrypt(defaultPassword)).toThrowError("Password is not provided");
    });

    test("should not encrypt if there is no password", () => {
      expect(() => lockService.decrypt(defaultPassword)).toThrowError("Password is not provided");
    });

    test("should decrypt properly", async () => {
      await lockService.unlock(defaultPassword);

      const result = lockService.decrypt(defaultPassword);

      expect(result).toStrictEqual(passwordChecker);
    });
  });

  describe("unlock", () => {
    test("should setup password and unlock properly", async () => {
      await lockService.setupPassword(defaultPassword);
      const status = await lockService.getStatus();

      expect(status).toStrictEqual({
        isInitialized: true,
        isUnlocked: true,
      });
    });

    test("should unlock properly", async () => {
      const isUnlocked = await lockService.unlock(defaultPassword);
      const status = await lockService.getStatus();

      expect(isUnlocked).toBe(true);
      expect(status).toStrictEqual({
        isInitialized: true,
        isUnlocked: true,
      });

      expect(pushMessage).toBeCalledTimes(1);
      expect(pushMessage).toBeCalledWith(setStatus(status));
      expect(browser.tabs.sendMessage).toBeCalledTimes(defaultTabs.length);

      for (let index = 0; index < defaultTabs.length; index += 1) {
        expect(browser.tabs.sendMessage).toHaveBeenNthCalledWith(index + 1, defaultTabs[index].id, setStatus(status));
      }
    });

    test("should await unlock properly", async () => {
      lockService.awaitUnlock();
      const isUnlocked = await lockService.unlock(defaultPassword);
      const isUnlockCompleted = lockService.onUnlocked();

      expect(isUnlocked).toBe(true);
      expect(isUnlockCompleted).toBe(true);
    });

    test("should not unlock twice", async () => {
      const isUnlockedFirst = await lockService.unlock(defaultPassword);
      const isUnlockedSecond = await lockService.unlock("wrong");

      expect(isUnlockedFirst).toBe(true);
      expect(isUnlockedSecond).toBe(true);
      expect(await lockService.awaitUnlock()).toBeUndefined();
    });

    test("should not unlock if there is no password", async () => {
      await expect(lockService.unlock("")).rejects.toThrowError("Password is not provided");
    });

    test("should not unlock if there is no cipher text", async () => {
      (SimpleStorageService as jest.Mock).mock.instances.forEach((instance: { get: jest.Mock }) => {
        instance.get.mockReturnValue(undefined);
      });

      await expect(lockService.unlock(defaultPassword)).rejects.toThrowError(
        "Something badly gone wrong (reinstallation probably required)",
      );
    });

    test("should not unlock if there is wrong password", async () => {
      (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({ toString: () => "" });

      await expect(lockService.unlock(defaultPassword)).rejects.toThrowError("Incorrect password");
    });
  });
});
