import { Paths } from "@src/constants";
import { replaceUrlParams } from "@src/utils";
import { useState, type MouseEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface featureList {
  title: string;
  features: {
    label: string;
    path?: string;
  }[];
}

interface IUserDocsDrawerData { }

interface IUserDrawerListOutput {
  isShowGetStarted: boolean;
  isShowIdentityManagement: boolean;
  isShowZkpManagement: boolean;
  getStartedData: featureList;
  identityManagementData: featureList;
  zkpManagementData: featureList;
  goToPage: (path?: string) => void;
  goToConnectPage: (isChangeIdentity: string) => void;
  handleGetStartedList: (event: MouseEvent) => void;
  handleIdentityManagementList: (event: MouseEvent) => void;
  handleZkpManagementList: (event: MouseEvent) => void;
}

export const useDrawerList = (): IUserDrawerListOutput => {
  const navigate = useNavigate();

  const [isShowGetStarted, setIsShowGetStarted] = useState(false);
  const [isShowIdentityManagement, setIsShowIdentityManagement] = useState(false);
  const [isShowZkpManagement, setIsShowZkpManagement] = useState(false);

  const getStartedData: featureList = {
    title: "Get Started",
    features: [{ label: "Connect to CryptKeeper", path: Paths.CONNECT }],
  };

  const identityManagementData: featureList = {
    title: "Identity Management",
    features: [
      { label: "Get Identity Metadata" },
      { label: "Import Identity" },
      { label: "Reveal Identity Commitment" },
    ],
  };

  const zkpManagementData: featureList = {
    title: "Zero-Knowledge Proofs Management",
    features: [{ label: "Semaphore" }, { label: "Rate-Limiting Nullifier" }, { label: "Bandada" }],
  };

  const goToPage = useCallback((path?: string) => {
    if (path) {
      navigate(path);
    }
  }, [navigate]);

  const goToConnectPage = useCallback((isChangeIdentityParam: string) => {
    navigate(replaceUrlParams(Paths.CONNECT, { isChangeIdentityParam }));
  }, [navigate]);

  const handleGetStartedList = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      setIsShowGetStarted((isShow) => !isShow);
    },
    [setIsShowGetStarted],
  );

  const handleIdentityManagementList = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      setIsShowIdentityManagement((isShow) => !isShow);
    },
    [setIsShowIdentityManagement],
  );

  const handleZkpManagementList = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      setIsShowZkpManagement((isShow) => !isShow);
    },
    [setIsShowZkpManagement],
  );

  return {
    isShowGetStarted,
    isShowIdentityManagement,
    isShowZkpManagement,
    getStartedData,
    identityManagementData,
    zkpManagementData,
    goToPage,
    goToConnectPage,
    handleGetStartedList,
    handleIdentityManagementList,
    handleZkpManagementList,
  };
};