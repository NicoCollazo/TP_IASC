import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import Box from "@mui/material/Box";
import ActionButtons from "./ActionButtons";
import { Card, CardContent } from "@mui/material";

function WorkspaceButton({ item, handleDelete, redirectToWorkspace }) {
    const [hover, setHover] = useState("none");

	return (
        <Box
            sx={{
                borderRadius: "6px",
                boxShadow:
                    "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
                background: "white",
                margin: "0 0 8px 0",
                display: "grid",
                gridGap: "20px",
                flexDirection: "column",
                cursor: "pointer !important",
            }}
            
        >
            <Card
                sx={{ minWidth: 120 , padding: 0 }}
                onMouseOver={() => setHover("block")}
                onMouseOut={() => setHover("none")}
            >
                <CardContent
                    sx={{
                        padding: "0px !important",
                        paddingBottom: 0,
                        minHeight: 42,
                    }}
                >
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
                            onClick={() => redirectToWorkspace(item.name)}
                        >
                            {item.name}
                        </Typography>
                        <ActionButtons 
                            item={item} 
                            handleDelete={handleDelete} 
                            hover={hover}
                        />
                    </Container>
                </CardContent>
            </Card>
        </Box>
	);
}

export default WorkspaceButton;
