/**
 * @jest-environment jsdom
 */

import { act, render, screen } from "@testing-library/react";

import { createModalRoot, deleteModalRoot } from "@src/config/mock/modal";
import { IUseConnectionModalData, useConnectionModal } from "@src/ui/components/ConnectionModal/useConnectionModal";

import { Info, InfoProps } from "..";

jest.mock("@src/ui/components/ConnectionModal/useConnectionModal", (): unknown => ({
  useConnectionModal: jest.fn(),
}));

describe("ui/pages/Home/components/Info", () => {
  const defaultProps: InfoProps = {
    refreshConnectionStatus: jest.fn().mockResolvedValue(true),
  };

  const defaultConnectionModalHookData: IUseConnectionModalData = {
    url: new URL("http://localhost:3000"),
    checked: false,
    faviconUrl: "http://localhost:3000/favicon.ico",
    onSetApproval: jest.fn(),
    onRemoveHost: jest.fn(),
  };

  beforeEach(() => {
    (useConnectionModal as jest.Mock).mockReturnValue(defaultConnectionModalHookData);

    createModalRoot();
  });

  afterEach(() => {
    jest.clearAllMocks();

    deleteModalRoot();
  });

  test("should render properly", async () => {
    render(<Info {...defaultProps} />);

    const component = await screen.findByTestId("home-info");

    expect(component).toBeInTheDocument();
  });

  test("should render properly without wallet data", async () => {
    const mockRefreshConnectionStatus = jest.fn().mockRejectedValue(false);
    render(<Info {...defaultProps} refreshConnectionStatus={mockRefreshConnectionStatus} />);

    const connectedTitle = await screen.findByText("Not Connected");

    expect(connectedTitle).toBeInTheDocument();
  });

  test("should open connection modal properly", async () => {
    render(<Info {...defaultProps} />);

    const button = await screen.findByTestId("connect-button");
    await act(async () => Promise.resolve(button.click()));

    const modal = await screen.findByTestId("connection-modal");

    expect(modal).toBeInTheDocument();
  });
});
