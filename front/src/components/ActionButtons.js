import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { IoTrashOutline, TiPencil } from "react-icons/all";
import Tooltip from "@mui/material/Tooltip";

function ActionButtons({ item, handleEdit, handleDelete, hover }) {
	return (
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
	);
}

export default ActionButtons;
