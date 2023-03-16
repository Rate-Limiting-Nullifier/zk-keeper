import log from "loglevel";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ConfirmRequestModal } from "@src/ui/components/ConfirmRequestModal";
import { fetchStatus, useAppStatus } from "@src/ui/ducks/app";
import { useAppDispatch } from "@src/ui/ducks/hooks";
import { useRequestsPending, fetchRequestPendingStatus } from "@src/ui/ducks/requests";
import { useWallet } from "@src/ui/hooks/wallet";
import { Home } from "@src/ui/pages/Home";
import Login from "@src/ui/pages/Login";
import Onboarding from "@src/ui/pages/Onboarding";

import "./popup.scss";

const Popup = (): JSX.Element | null => {
  const pendingRequests = useRequestsPending();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { initialized, unlocked } = useAppStatus();
  const { onConnectEagerly } = useWallet();

  const fetchData = useCallback(async () => {
    await Promise.all([dispatch(fetchStatus()), dispatch(fetchRequestPendingStatus())]);
  }, [dispatch]);

  useEffect(() => {
    onConnectEagerly();
  }, [onConnectEagerly]);

  useEffect(() => {
    fetchData()
      .catch((error) => log.error(error))
      .finally(() => setLoading(false));
  }, [fetchData, setLoading, unlocked]);

  if (loading) {
    return null;
  }

  let content: ReactNode;

  if (!initialized) {
    content = <Onboarding />;
  } else if (!unlocked) {
    content = <Login />;
  } else if (pendingRequests.length) {
    return <ConfirmRequestModal />;
  } else {
    content = (
      <Routes>
        <Route element={<Home />} path="/" />

        <Route element={<Navigate replace to="/" />} />
      </Routes>
    );
  }

  return <div className="popup">{content}</div>;
};

export default Popup;
