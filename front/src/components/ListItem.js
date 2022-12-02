// @ts-nocheck
import { Draggable } from "react-beautiful-dnd";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { IoTrashOutline, TiPencil } from "react-icons/all";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import ActionButtons from "./ActionButtons";

const ListItem = ({
	item,
	index,
	handleChangeItemTitle,
	handleEdit,
	handleDelete,
	toggleDrawer,
}) => {
	const [hover, setHover] = useState("none");

	const handleKeyPress = (e, item) => {
		//13 -> Enter
		if (e.keyCode == 13) {
			handleEdit(item, false);
		}
	};

	const renderTitle = (item) => {
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
					<ActionButtons item={item} handleEdit={handleEdit} handleDelete={handleDelete} hover={hover}/>
				</Container>
			);
		}
	};

	return (
		<Draggable draggableId={item.id} index={index}>
			{(provided, snapshot) => {
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
							opacity: snapshot.isDragging ? 0.4 : 1,
						}}
						ref={provided.innerRef}
						snapshot={snapshot}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
						<Card
							sx={{ minWidth: 275, padding: 0 }}
							onMouseOver={() => setHover("block")}
							onMouseOut={() => setHover("none")}
						>
							<CardHeader
								sx={{
									padding: "0px !important",
									paddingBottom: 0,
									minHeight: 42,
								}}
							>
								{renderTitle(item)}
							</CardHeader>
							<Divider />
							<CardContent
								sx={{
									padding: "0px !important",
									paddingBottom: 0,
									minHeight: 82,
									backgroundColor: "#fbfbfa",
									display: item.content !== "" ? "block" : "none",
								}}
								onClick={() => toggleDrawer(true, item)}
							>
								<Typography
									variant="body2"
									color="initial"
									sx={{ padding: "8.5px 14px" }}
								>
									{item.content}
								</Typography>
							</CardContent>
						</Card>
					</Box>
				);
			}}
		</Draggable>
	);
};

export default ListItem;
