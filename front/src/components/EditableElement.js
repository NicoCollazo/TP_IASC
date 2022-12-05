import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { IoTrashOutline, TiPencil } from "react-icons/all";
import Tooltip from "@mui/material/Tooltip";
import ActionButtons from "./ActionButtons";

function EditableElement({ item, handleChangeItemTitle, handleEdit, handleDelete, handleCheck, handleKeyPress, toggleDrawer, hover }) {

    const textStyle = () => {
        if (!item.done) {
            return (
                {textDecoration: "line-through"}
            )
        }
    }

    const renderEditableElement = (item) => {
        if (item.editing) {
            return (
                <Container sx={{ paddingLeft: "0px !important" }}>
                    <TextField
                        hiddenLabel
                        id="filled-hidden-label-small"
                        value={item.title}
                        onChange={(e) => handleChangeItemTitle(e, item)}
                        onBlur={() => handleEdit(item, false)}
                        onKeyDown={(e) => handleKeyPress(e, item)}
                        size="small"
                        fullWidth
                        autoFocus
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            style: { 
                                fontWeight: "bold",
                                textDecoration: item.done ? "line-through" : "",
                                color: item.done ? "grey" : "",
                            },
                        }}
                        sx={{
                            paddingTop: "7.5px",
                            paddingBottom: "3.5px",
                            paddingX: "14px",
                        }}
                    />
                </Container>
            );
        } else {
            return (
                <Container
                    sx={{
                        paddingLeft: "0px !important",
                        position: "relative",
                        "&:hover": {
                            backgroundColor: "#f9f8f9",
                            boxShadow: "none",
                        },
                    }}
                >
                    <Typography
                        sx={{ 
                            padding: "8.5px 14px",
                            fontWeight: "bold",
                            textDecoration: item.done ? "line-through" : "",
                            color: item.done ? "grey" : "",
                        }}
                        onClick={() => toggleDrawer(true, item)}
                    >
                        {item.title}
                    </Typography>
                    <Box>
                    <ActionButtons 
                        item={item}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleCheck={handleCheck}
                        hover={hover}
                    />
                    </Box>
                </Container>
            );
        }
    }

	return (
        <Box>
		    {renderEditableElement(item)}
        </Box>
	);
}

export default EditableElement;
