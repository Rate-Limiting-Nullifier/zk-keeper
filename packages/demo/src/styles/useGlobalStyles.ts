import { Theme } from "@mui/material";
import grey from "@mui/material/colors/grey";
import makeStyles from "@mui/styles/makeStyles";

const basePopupStyle = {
  width: "50rem",
  height: "auto",
  border: `1px solid ${grey[700]}`,
  margin: "2rem auto",
};

export const sharedStyles = {
  sideBarWidth: 256,
  sideBarColor: "#012120",
};

export const useGlobalStyles = makeStyles((theme: Theme) => ({
  popup: {
    ...basePopupStyle,
  },

  popupProof: {
    ...basePopupStyle,
    width: "70rem",
  },

  codePreview: {
    maxHeight: 200,
    overflowY: "auto",
    border: `1px solid ${theme.palette.common.black}`,
    borderRadius: "4px",
    transition: "overflow-y 0.3s", // Add a smooth transition for overflow-y property
    "&:hover": {
      overflowY: "auto", // Show the scrollbar on hover
    },
    "&::-webkit-scrollbar": {
      width: "8px", // Set the width of the scrollbar
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888", // Set the color of the scrollbar thumb
      borderRadius: "4px", // Optional: Round the corners of the scrollbar thumb
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555", // Set the color of the scrollbar thumb on hover
    },

    "&::-webkit-scrollbar-track": {
      backgroundColor: "#1e1e1e",
    },

    scrollbarWidth: "thin", // For Firefox: Set the width of the scrollbar
  },

  leftSideBar: {
    left: 0,
    top: 0,
    bottom: 0,
    overflowY: "auto",
    flexShrink: 0,
    position: "fixed",
    backgroundColor: theme.palette.background.default,
    zIndex: 1,
  },

  rightSideBar: {
    right: 0,
    bottom: 0,
    overflowY: "auto",
    flexShrink: 0,
    position: "fixed",
    backgroundColor: theme.palette.background.default,
  },

  header: {
    position: "fixed",
    top: 0,
    height: "63px",
    width: `calc(100% - ${sharedStyles.sideBarWidth}px)`,
  },

  headerToolbar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
  },

  drawerList: {
    position: "fixed",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    width: sharedStyles.sideBarWidth,
  },

  drawerToolbar: {
    backgroundColor: theme.palette.background.default,
  },
}));