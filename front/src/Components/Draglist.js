import React, { useEffect } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";
import {Container, Typography, AppBar, Toolbar, Box} from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import Done from "@mui/icons-material/Done";

const DragDropContextContainer = styled.div`
  padding: 20px;
  border-radius: 6px;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 8px;
`;

// fake data generator
const getItems = (count, list) =>
  Array.from({ length: count }, (v, k) => k).map((k) => {
    const randomId = Math.floor(Math.random() * 1000);
    return {
      id: `item-${randomId}`,
      list,
      content: `item ${randomId}`
    };
  });

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const lists = [
    {
        name: "To Do",
        color: "#fee2dc",
        icon: <PendingActionsIcon color="action"/>,
    },
    {
        name: "Doing",
        color: "#fcecc9",
        icon: <EngineeringIcon color="primary"/>,
    },
    {
        name: "Done",
        color: "#daedda",
        icon: <Done color="primary"/>
    }
];

const generateLists = () =>
  lists.reduce(
    (acc, listKey) => ({ ...acc, [listKey.name]: getItems(0, listKey.name) }),
    {}
  );

function DragList() {
    const [elements, setElements] = React.useState(generateLists());

    useEffect(() => {
        setElements(generateLists());
    }, []);

    function handleAdd(list) {
        const listCopy = { ...elements };
        const randomId = Math.floor(Math.random() * 1000);
        elements[list].push(
            {
                id: `item-${randomId}`,
                list,
                content: ``,
                editing: true
            }
        )
        setElements(listCopy)
        
    }

    function handleChangeItem(e,item){
        const elementsCopy = { ...elements };
        let elementIndex = elementsCopy[item.list].findIndex(i => i.id === item.id)
        elementsCopy[item.list][elementIndex].content = e.target.value
        setElements(elementsCopy)
    }

    function handleEdit(item, editing) {
        const elementsCopy = { ...elements };
        let elementIndex = elementsCopy[item.list].findIndex(i => i.id === item.id)
        elementsCopy[item.list][elementIndex].editing = editing
        setElements(elementsCopy)
    }

    function handleDelete(item){
        const elementsCopy = { ...elements };
        let elementIndex = elementsCopy[item.list].findIndex(i => i.id === item.id)
        elementsCopy[item.list].splice(elementIndex, 1)
        setElements(elementsCopy)
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const listCopy = { ...elements };

        const sourceList = listCopy[result.source.droppableId];
        const [removedElement, newSourceList] = removeFromList(
            sourceList,
            result.source.index
        );
        listCopy[result.source.droppableId] = newSourceList;
        const destinationList = listCopy[result.destination.droppableId];
        listCopy[result.destination.droppableId] = addToList(
            destinationList,
            result.destination.index,
            removedElement
        );

        setElements(listCopy);
    };

    return (
        
        <Container maxWidth="lg">
            <AppBar position="fixed" sx={{backgroundColor: "#aab6ab"}}>
              <Toolbar>
                <Typography variant="h6">
                  ToDo List
                </Typography>
              </Toolbar>
            </AppBar>
            <Box sx={{marginTop: 10}}>
                <DragDropContextContainer sx={{marginTop: 100}}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <ListGrid>
                    {lists.map((listKey) => (
                        <DraggableElement
                        elements={elements[listKey.name]}
                        key={listKey.name}
                        prefix={listKey}
                        handleAdd={handleAdd}
                        handleChangeItem={handleChangeItem}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        />
                    ))}
                    
                    </ListGrid>
                </DragDropContext>
            
                </DragDropContextContainer>
            </Box>
           
        </Container>
    );
}

export default DragList;