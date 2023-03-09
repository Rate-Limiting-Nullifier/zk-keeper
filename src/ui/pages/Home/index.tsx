import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { deleteAllIdentities, fetchIdentities } from "@src/ui/ducks/identities";
import Header from "@src/ui/components/Header";
import classNames from "classnames";
import { browser } from "webextension-polyfill-ts";
import "./home.scss";
import { sliceAddress } from "@src/util/account";
import ConnectionModal from "@src/ui/components/ConnectionModal";
import Icon from "@src/ui/components/Icon";
import Menuable from "@src/ui/components/Menuable";
import { useAppDispatch } from "@src/ui/ducks/hooks";
import { metamask } from "@src/connectors";
import { useWallet } from "@src/ui/hooks/wallet";
import { DEFAULT_ROUND } from "@src/config/const";
import { IdentityList } from "./components";
import { fetchIsApproved, useApproves } from "@src/ui/ducks";

export default function Home(): ReactElement {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fixedTabs, fixTabs] = useState(false);

  useEffect(() => {
    metamask.connectEagerly();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        dispatch(fetchIdentities());
      } catch (error) {
        throw new Error("Error in connecting to MetaMask");
      }
    })();
  }, []);

  const onScroll = useCallback(async () => {
    if (!scrollRef.current) return;

    const scrollTop = scrollRef.current?.scrollTop;

    fixTabs(scrollTop > 92);
  }, [scrollRef]);

  return (
    <div className="w-full h-full flex flex-col home">
      <Header />
      <div
        ref={scrollRef}
        className={classNames("flex flex-col flex-grow flex-shrink overflow-y-auto home__scroller", {
          "home__scroller--fixed-menu": fixedTabs,
        })}
        onScroll={onScroll}
      >
        <HomeInfo />
        <HomeList />
      </div>
    </div>
  );
}

const HomeInfo = function (): ReactElement {
  const dispatch = useAppDispatch();
  const [showingModal, showModal] = useState(false);

  const { address, chain, balance } = useWallet();

  const { noApproval } = useApproves();

  useEffect(() => {
    (async () => {
      await refreshConnectionStatus();
    })();
  }, []);

  const refreshConnectionStatus = useCallback(async () => {
    const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const [tab] = tabs || [];

    if (tab?.url) {
      const { origin } = new URL(tab.url);
      dispatch(fetchIsApproved(origin));
    }
  }, []);

  return (
    <>
      {showingModal && (
        <ConnectionModal onClose={() => showModal(false)} refreshConnectionStatus={refreshConnectionStatus} />
      )}
      <div className="home__info">
        <div
          className={classNames("home__connection-button", {
            "home__connection-button--connected": noApproval,
          })}
          onClick={noApproval ? () => showModal(true) : undefined}
        >
          <div
            className={classNames("home__connection-button__icon", {
              "home__connection-button__icon--connected": noApproval,
            })}
          />
          <div className="text-xs home__connection-button__text">{noApproval ? "Connected" : "Not Connected"}</div>
          {address && <div className="text-sm home__account-button">{sliceAddress(address)}</div>}
        </div>
        <div>
          <div className="text-3xl font-semibold">
            {chain ? `${balance?.toFormat(DEFAULT_ROUND) ?? ""} ${chain.nativeCurrency.symbol}` : "-"}
          </div>
        </div>
      </div>
    </>
  );
};

const HomeList = function (): ReactElement {
  const dispatch = useAppDispatch();
  const [selectedTab, selectTab] = useState<"identities" | "activity">("identities");

  const onDeleteAllIdentities = useCallback(() => {
    dispatch(deleteAllIdentities());
  }, [dispatch]);

  return (
    <div className="home__list">
      <div className="home__list__header">
        <div
          className={classNames("home__list__header__tab", {
            "home__list__header__tab--selected": selectedTab === "identities",
          })}
          onClick={() => selectTab("identities")}
        >
          <span>Identities</span>

          <Menuable className="flex user-menu" items={[{ label: "Delete all", onClick: onDeleteAllIdentities }]}>
            <Icon className="identity-row__menu-icon" fontAwesome="fas fa-ellipsis-h" />
          </Menuable>
        </div>
        {/* <div
          className={classNames("home__list__header__tab", {
            "home__list__header__tab--selected": selectedTab === "activity",
          })}
          onClick={() => selectTab("activity")}
        >
          Activity
        </div> */}
      </div>
      <div className="home__list__fix-header">
        <div
          className={classNames("home__list__header__tab", {
            "home__list__header__tab--selected": selectedTab === "identities",
          })}
          onClick={() => selectTab("identities")}
        >
          Identities
        </div>
        {/* <div
          className={classNames("home__list__header__tab", {
            "home__list__header__tab--selected": selectedTab === "activity",
          })}
          onClick={() => selectTab("activity")}
        >
          Activity
        </div> */}
      </div>
      <div className="home__list__content">
        {selectedTab === "identities" ? <IdentityList /> : null}
        {/* {selectedTab === "activity" ? <ActivityList /> : null} */}
      </div>
    </div>
  );
};
