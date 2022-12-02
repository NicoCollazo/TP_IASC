import { Alert, Snackbar } from "@mui/material";

/* notificationState:
	{
		message: string,
		open: boolean
	}
*/
const Notification = ({ notificationState, onClose, severity = "error" }) => {
	return (
		<Snackbar
			open={notificationState.open}
			onClose={onClose}
			autoHideDuration={3000}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
		>
			<Alert onClose={onClose} severity={severity}>
				{notificationState.message}
			</Alert>
		</Snackbar>
	);
};

export default Notification;
