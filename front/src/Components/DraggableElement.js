import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React from "react";
import styled from "styled-components";
import Chip from '@mui/material/Chip';
import {Button, Container} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

const DraggableElement = ({ prefix, elements, handleAdd, handleChangeItem, handleEdit, handleDelete }) => (
  <React.Fragment>
    <Container sx={{ padding: '10px', borderRadius: '6px'}}>
      <Chip 
        size="small" 
        label={prefix.name}
        icon={prefix.icon}
        sx={{ 
          mb: 2,
          borderRadius: 1,
          backgroundColor: prefix.color,
          fontWeight: "bold",
          fontSize: 16,
          '& .MuiChip-icon': {
            color: 'black',
          },
        }} 
      />    
      <Droppable droppableId={`${prefix.name}`}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {elements.map((item, index) => (
                <ListItem 
                  key={item.id}
                  item={item}
                  index={index} 
                  handleChangeItem={handleChangeItem} 
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  />
              ))}
              {provided.placeholder}
            </div>
          )
        }
        
      </Droppable>
      <Button onClick={() => handleAdd(prefix.name)} 
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        sx={{justifyContent: "left !important",
          color: 'rgb(136 136 136)',
          backgroundColor:"transparent !important",
          boxShadow: 'none'
        }}
      >
        New
      </Button>
    </Container>
  </React.Fragment>
  
);

export default DraggableElement;
