import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { IoTrashOutline, TiPencil } from "react-icons/all";
import Tooltip from "@mui/material/Tooltip";

function EditableElement({ item, handleChangeItemTitle, handleEdit, handleDelete, handleKeyPress, toggleDrawer, hover }) {

    const renderEditableElement = (item) => {
        console.log(item)
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
                            style: { fontWeight: "bold" },
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
                        sx={{ padding: "8.5px 14px", fontWeight: "bold" }}
                        onClick={() => toggleDrawer(true, item)}
                    >
                        {item.title}
                    </Typography>
                    <Box>
                        <ButtonGroup
                            variant="contained"
                            aria-label="outlined primary button group"
                            sx={{
                                position: "absolute",
                                top: "20%",
                                right: 8,
                                display: hover,
                            }}
                        >
                            <Tooltip
                                title="Edit"
                                placement="top"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            p: 1,
                                            bgcolor: "common.black",
                                            "& .MuiTooltip-arrow": {
                                                color: "common.black",
                                            },
                                        },
                                    },
                                }}
                            >
                                <IconButton
                                    onClick={() => handleEdit(item, true)}
                                    size="small"
                                    aria-label="edit"
                                    key="editButton"
                                    sx={{
                                        color: "rgb(136 136 136)",
                                        borderRadius: 0,
                                    }}
                                >
                                    <TiPencil />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Delete"
                                placement="top"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            p: 1,
                                            bgcolor: "common.black",
                                            "& .MuiTooltip-arrow": {
                                                color: "common.black",
                                            },
                                        },
                                    },
                                }}
                            >
                                <IconButton
                                    onClick={() => handleDelete(item)}
                                    aria-label="delete"
                                    size="small"
                                    key="trashButton"
                                    sx={{
                                        color: "rgb(136 136 136)",
                                        borderRadius: 0,
                                    }}
                                >
                                    <IoTrashOutline />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>
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
