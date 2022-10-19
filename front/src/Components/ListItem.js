import { Draggable } from "react-beautiful-dnd";
import React, { useState } from "react";
import styled from "styled-components";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

const ListItem = ({ item, index, handleChangeItem, handleEdit, handleDelete }) => {
  const [hover, setHover] = useState("none");

  const handleKeyPress = (e, item) => {
      //13 -> Enter
      if(e.keyCode == 13){
         handleEdit(item, false)
      }
  }

  const renderContent = (item) => {
    if (item.editing){
      return (
      <Container sx={{ paddingLeft:"0px !important"}}>
        <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        value={item.content}
        onChange={(e) => handleChangeItem(e, item)}
        onBlur={() => handleEdit(item, false)}
        onKeyDown={(e) => handleKeyPress(e, item)}
        size="small"
        fullWidth
        autoFocus
        variant="standard"
        InputProps={{
          disableUnderline: true,
        }}
        sx={{paddingTop:"7.5px", paddingBottom: "3.5px", paddingX: "14px"}}
      />
      </Container>
      )
    } else {
      return (
        <Container sx={{ paddingLeft:"0px !important", position: "relative"}}>
          <Typography sx={{padding:"8.5px 14px"}}>
            {item.content}
          </Typography>
          <Box>
            <ButtonGroup 
              variant="contained" 
              aria-label="outlined primary button group" 
              sx={{position: "absolute", top: 4, right: 4, display: hover }}
            
            >
              <IconButton 
                onClick={() => handleEdit(item, true)}
                size="small"
                aria-label="edit" 
                sx={{
                  color: 'rgb(136 136 136)',
                  borderRadius: 0
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(item)}
                aria-label="delete" 
                size="small"
                sx={{
                  color: 'rgb(136 136 136)',
                  borderRadius: 0
                }}
                >
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          </Box>
          
        </Container>
      )
    }
  }

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <Box
            sx={{
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
              background: "white",
              margin: "0 0 8px 0",
              display: "grid",
              gridGap: "20px",
              flexDirection: "column",
            }}
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card sx={{ minWidth: 275, padding: 0 }}  
              onMouseOver={()=> setHover('block')} 
              onMouseOut={()=> setHover('none')} 
            >
                <CardContent sx={{ padding: '0px !important', paddingBottom: 0, minHeight: 42 }}>
                  {renderContent(item)}
                </CardContent>
            </Card>
          </Box>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
