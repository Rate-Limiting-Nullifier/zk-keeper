import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Controller } from "react-hook-form";

import { getEnabledFeatures } from "@src/config/features";
import { IDENTITY_TYPES, WEB2_PROVIDER_OPTIONS } from "@src/constants";
import { SelectOption } from "@src/types";
import { Dropdown } from "@src/ui/components/Dropdown";
import { FullModalContent, FullModalFooter, FullModalHeader } from "@src/ui/components/FullModal";
import { Icon } from "@src/ui/components/Icon";
import { Input } from "@src/ui/components/Input";

import type { MultiValue, SingleValue } from "react-select";

import "./createIdentityModalStyles.scss";
import { useCreateIdentityModal } from "./useCreateIdentityModal";

type DropdownChangeHandler = (arg: SingleValue<SelectOption> | MultiValue<SelectOption>) => void;

interface ICreateIdentityModalProps {
  urlOrigin: string;
  connectIdentityCallback: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const CreateIdentityModal = ({ urlOrigin, connectIdentityCallback }: ICreateIdentityModalProps): JSX.Element => {
  const features = getEnabledFeatures();
  const {
    isLoading,
    isProviderAvailable,
    isWalletInstalled,
    isWalletConnected,
    errors,
    control,
    onCloseModal,
    onConnectWallet,
    onCreateWithCryptkeeper,
    onCreateWithEthWallet,
  } = useCreateIdentityModal({ urlOrigin, connectIdentityCallback });

  const ethWalletTitle = isWalletConnected ? "Metamask" : "Connect to Metamask";

  return (
    <Box data-testid="create-identity-page" sx={{ height: "100%" }}>
      <form className="create-identity-form">
        <FullModalHeader onClose={onCloseModal}>Create identity</FullModalHeader>

        <FullModalContent>
          {features.INTEREP_IDENTITY ? (
            <>
              <Controller
                control={control}
                defaultValue={IDENTITY_TYPES[0]}
                name="identityStrategyType"
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    className="my-2"
                    errorMessage={errors.identityStrategyType}
                    id="identityStrategyType"
                    isDisabled={!features.INTEREP_IDENTITY}
                    label="Identity type"
                    options={IDENTITY_TYPES}
                    onChange={field.onChange as DropdownChangeHandler}
                  />
                )}
                rules={{ required: "Identity strategy type is required" }}
              />

              {isProviderAvailable && (
                <>
                  <Controller
                    control={control}
                    defaultValue={WEB2_PROVIDER_OPTIONS[0]}
                    name="web2Provider"
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        className="my-2"
                        errorMessage={errors.web2Provider}
                        id="web2Provider"
                        label="Web2 Provider"
                        options={WEB2_PROVIDER_OPTIONS}
                        onChange={field.onChange as DropdownChangeHandler}
                      />
                    )}
                    rules={{ required: "Provider is required" }}
                  />

                  <Controller
                    control={control}
                    defaultValue={0}
                    name="nonce"
                    render={({ field }) => (
                      <Input {...field} className="my-2" errorMessage={errors.nonce} id="nonce" label="Nonce" />
                    )}
                    rules={{
                      required: "Nonce is required",
                      min: { value: 0, message: "Nonce must be positive number" },
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <Typography>Create your Semaphore identity</Typography>
          )}
        </FullModalContent>

        {errors.root && <div className="text-xs text-red-500 text-center pb-1">{errors.root}</div>}

        <Box sx={{ p: "1rem", display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>Choose wallet to create identity</Typography>

          <Tooltip
            followCursor
            title="Identity creation can be done with your Cryptkeeper keys or with connected Ethereum wallet."
          >
            <Icon fontAwesome="fa-info" />
          </Tooltip>
        </Box>

        <FullModalFooter>
          <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button
              disabled={isLoading || !isWalletInstalled}
              name="metamask"
              size="small"
              sx={{ textTransform: "none", flex: 1, mr: 1 }}
              type="submit"
              variant="outlined"
              onClick={isWalletConnected ? onCreateWithEthWallet : onConnectWallet}
            >
              {isWalletInstalled ? ethWalletTitle : "Install MetaMask"}
            </Button>

            <Button
              disabled={isLoading}
              name="cryptkeeper"
              size="small"
              sx={{ textTransform: "none", flex: 1, ml: 1 }}
              type="submit"
              variant="contained"
              onClick={onCreateWithCryptkeeper}
            >
              Cryptkeeper
            </Button>
          </Box>
        </FullModalFooter>
      </form>
    </Box>
  );
};
