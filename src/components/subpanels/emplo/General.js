import React, { useState } from 'react';
import {
    Heading,
    Text,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    ModalBody,
    ModalCloseButton,Select,
    useToast
} from "@chakra-ui/react";

import { ImBin2 } from 'react-icons/im';
import { IconButton } from "@chakra-ui/react";

const TableRow = ({ item, handleDeleteClick }) => {
    const [currentHourlyRate, setCurrentHourlyRate] = useState(item.hourlyRate);

    return (
        <Tr key={item.id}>
            <Td>{`${item.firstName} ${item.lastName}`}</Td>
            <Td>{item.position}</Td>
            <Td>
                <Editable
                    defaultValue={currentHourlyRate.toString()}
                    onSubmit={value => setCurrentHourlyRate(parseFloat(value))}
                >
                    <EditablePreview />
                    <EditableInput w={40} px={2} borderColor="brand.200" />
                </Editable>
            </Td>
            <Td>{item.hoursWorked}</Td>
            <Td>{currentHourlyRate * item.hoursWorked}</Td>
            <Td>{item.orders}</Td>
            <Td>
                <IconButton
                    aria-label="Usuń"
                    icon={<ImBin2 />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteClick(item.id)}
                />
            </Td>
        </Tr>
    );
};
const General = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const toast = useToast();

    const [newEmployee, setNewEmployee] = useState({
        firstName: '',
        lastName: '',
        position: '',
        hourlyRate: ''
    });


    const [positions] = useState([
        'Wszystkie',
        'Kelner',
        'Kucharz',
        'Dostawca',
        'Manager',
        'Sprzątaczka',
    ]);

    const initialData = [
        {
            id: 1,
            firstName: "Jan",
            lastName: "Kowalski",
            position: "Kelner",
            hourlyRate: 20,
            hoursWorked: 125,
            orders: 10,
        },
        {
            id: 2,
            firstName: "Anna",
            lastName: "Nowak",
            position: "Kucharz",
            hourlyRate: 25,
            hoursWorked: 120,
            orders: 15,
        },

    ];

    const [data, setData] = useState(initialData);
    const [selectedPosition, setSelectedPosition] = useState('Wszystkie');

    const handlePositionSelect = (position) => {
        setSelectedPosition(position);
        if (position === 'Wszystkie') {
            setData(initialData);
        } else {
            const filteredData = initialData.filter((item) => item.position === position);
            setData(filteredData);
        }
    };

    const handleDeleteClick = (id) => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
    };
    const handleDeleteConfirm = () => {
        handleDeleteClick(toBeDeleted);
        setShowDeleteModal(false);
        toast({
            title: 'Operacja udana.',
            description: 'Pomyślnie usunięto pracownika.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const showDeleteConfirmModal = (id) => {
        setToBeDeleted(id);
        setShowDeleteModal(true);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({
            ...newEmployee,
            [name]: value
        });
    };

    const handleAddNewEmployee = () => {
        if (newEmployee.firstName === '' || newEmployee.lastName === '' || newEmployee.position === '' || newEmployee.hourlyRate === '') {
            toast({
                title: "Błąd.",
                description: "Uzupełnij pola, aby dodać pracownika!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const newId = data.length + 1;
        const updatedData = [...data, { id: newId, ...newEmployee, hoursWorked: 0, orders: 0 }];
        setData(updatedData);
        setShowAddModal(false);
        setNewEmployee({
            firstName: '',
            lastName: '',
            position: '',
            hourlyRate: ''
        });
        toast({
            title: "Operacja udana.",
            description: "Pomyślnie dodano pracownika!",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };


    return (
        <Box py={8} w="full">
            <Box
                display="flex"
                alignItems="start"
                flexDirection="column"
                w="full"
                borderBottom="1px"
                borderColor="white"
            >
                <Heading mb={20} px={16} fontSize={32} color="brand.300" letterSpacing={2.3}>
                    Pracownicy
                </Heading>
                <Box display="flex" alignItems="start" justifyContent="center" ml={9}>
                    {positions.map((position, index) => (
                        <Button
                            key={index}
                            mr={4}
                            px={8}
                            fontWeight={400}
                            backgroundColor="transparent"
                            _hover={{
                                color: "#ED8245",
                                backgroundColor: "transparent",
                                borderBottom: '2px',
                                borderColor: '#ED8245',
                                borderRadius: 'none'
                            }}
                            _focus={{
                                color: "#ED8245",
                                backgroundColor: "transparent",
                                borderBottom: '2px',
                                borderColor: '#ED8245',
                                borderRadius: 'none'
                            }}
                            onClick={() => handlePositionSelect(position)}
                        >
                            <Text>{position}</Text>
                        </Button>
                    ))}
                    <Button  px={8}
                             fontWeight={500}
                             color="brand.300"
                             background="transparent"
                             fontSize="0.8rem"
                             _hover={{ color: "#ED8245", backgroundColor: "transparent", borderBottom: '2px', borderColor: '#ED8245', borderRadius: 'none' }}
                             _focus={{ color: "#ED8245", backgroundColor: "transparent", borderBottom: '2px', borderColor: '#ED8245', borderRadius: 'none' }}
                             onClick={() => setShowAddModal(true)}>Dodaj pracownika</Button>
                </Box>
            </Box>
            <Box display="flex" mt={10} mx={10} key={selectedPosition}>
                <Table variant="simple">
                    <Thead>
                        <Tr fontSize={12}>
                            <Th>Imię i nazwisko</Th>
                            <Th>Pozycja</Th>
                            <Th>Stawka godzinowa</Th>
                            <Th>Ilość godzin</Th>
                            <Th>Wynagrodzenie</Th>
                            <Th>Ilość zamówień</Th>
                            <Th>Akcje</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((item) => (
                            <TableRow key={item.id} item={item} handleDeleteClick={() => showDeleteConfirmModal(item.id)} />
                        ))}
                    </Tbody>
                </Table>
                <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Czy na pewno chcesz usunąć pracownika?</ModalHeader>
                        <ModalCloseButton />
                        <ModalFooter>

                            <Button className="close-button" onClick={() => setShowDeleteModal(false)}>Anuluj</Button>
                            <Button className="accept-button" onClick={handleDeleteConfirm}>
                                Potwierdź
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Dodaj nowego pracownika</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Imię</FormLabel>
                                <Input name="firstName" value={newEmployee.firstName} onChange={handleInputChange} />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Nazwisko</FormLabel>
                                <Input name="lastName" value={newEmployee.lastName} onChange={handleInputChange} />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Pozycja</FormLabel>
                                <Select name="position" value={newEmployee.position} onChange={handleInputChange}>
                                    {positions.map((position, index) => (
                                        <option key={index} value={position}>{position}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Stawka godzinowa</FormLabel>
                                <Input name="hourlyRate" type="number" value={newEmployee.hourlyRate} onChange={handleInputChange} />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="close-button" onClick={() => setShowAddModal(false)}>Anuluj</Button>
                            <Button className="accept-button" onClick={handleAddNewEmployee}>Dodaj</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </Box>
    );
};

export default General;
