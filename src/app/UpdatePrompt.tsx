import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { useRegisterSW } from "virtual:pwa-register/react";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <>
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          variant="filled"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </Button>
          }
          onClose={() => setNeedRefresh(false)}
        >
          A new version of Memora is available.
        </Alert>
      </Snackbar>

      <Snackbar
        open={offlineReady}
        autoHideDuration={4000}
        onClose={() => setOfflineReady(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setOfflineReady(false)}
        >
          Memora is ready to work offline.
        </Alert>
      </Snackbar>
    </>
  );
}
