import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";

import { Icon } from "@src/ui/components/Icon";
import { useAppDispatch } from "@src/ui/ducks/hooks";
import { createIdentityRequest, deleteIdentity, setIdentityName } from "@src/ui/ducks/identities";

import type { IdentityData } from "@src/types";

import { IdentityItem } from "./Item";

export interface IdentityListProps {
  isShowAddNew: boolean;
  isShowMenu: boolean;
  identities: IdentityData[];
  className?: string;
  selectedCommitment?: string;
  onSelect?: (identityCommitment: string) => void;
}

export const IdentityList = ({
  isShowAddNew,
  isShowMenu,
  identities,
  className = "",
  selectedCommitment = undefined,
  onSelect = undefined,
}: IdentityListProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const onUpdateIdentityName = useCallback(
    async (identityCommitment: string, name: string) => {
      await dispatch(setIdentityName(identityCommitment, name));
    },
    [dispatch],
  );

  const onDeleteIdentity = useCallback(
    async (identityCommitment: string) => {
      await dispatch(deleteIdentity(identityCommitment));
    },
    [dispatch],
  );

  const onCreateIdentityRequest = useCallback(() => {
    dispatch(createIdentityRequest({ host: "" }));
  }, [dispatch]);

  return (
    <>
      <Box
        className={className}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          top: 56,
          bottom: 56,
          position: "absolute",
          width: "100%",
          scrollbarWidth: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {identities.map(({ commitment, metadata }) => (
          <IdentityItem
            key={commitment}
            commitment={commitment}
            isShowMenu={isShowMenu}
            metadata={metadata}
            selected={selectedCommitment}
            onDeleteIdentity={onDeleteIdentity}
            onSelectIdentity={onSelect}
            onUpdateIdentityName={onUpdateIdentityName}
          />
        ))}

        {identities.length === 0 && (
          <Typography sx={{ my: 2, textAlign: "center" }}>No identities available</Typography>
        )}
      </Box>

      {isShowAddNew && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            bottom: 0,
            position: "absolute",
            height: 56,
            width: "100%",
          }}
        >
          <Button
            data-testid="create-new-identity"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "text.500",
              width: "100%",
            }}
            type="button"
            onClick={onCreateIdentityRequest}
          >
            <Icon fontAwesome="fas fa-plus" size={1} />

            <Typography sx={{ ml: 1 }}>Add Identity</Typography>
          </Button>
        </Box>
      )}
    </>
  );
};
