import { Button, HStack } from 'rsuite';
import { useContext, useState } from 'react';
import { AppContext } from '../context/Provider.jsx';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../api/api.js';
import ModalDelete from './modalDelete.jsx';
import DataTable from 'react-data-table-component';

function TableTemplates() {
    const { userTemplates, setTemplate, setPage, setQuestions } = useContext(AppContext);
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            grow: 2
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            grow: 3
        },
        {
            name: 'Access',
            selector: row => row.access,
            sortable: true,
        },
    ];
    const selectTemplate = (row) => {
        setSelectedTemplate(row.selectedRows[0]);
    }
    const newTemplate = () => {
        setPage("configuration");
        navigate('/newTemplate');
    }
    const editTemplate = async () => {
        if (!selectedTemplate) return alert("Please select a template");
        const result = await postRequest('/getTemplate', { "id": selectedTemplate.id });
        setTemplate(result);
        setQuestions(result.questions);
        setPage("configuration");
        navigate('/editTemplate');
    }
    const rowClicled = async (row) => {
        setSelectedTemplate(row);
        const result = await postRequest('/getTemplate', { "id": row.id });
        setTemplate(result);
        setQuestions(result.questions);
        setPage("configuration");
        navigate('/editTemplate');
    }
    const deleteTemplate = () => {
        if (!selectedTemplate) return alert("Please select a template");
        setOpenModal(true);
    }
    return (
        <div className='m-4 p-4 rounded-md w-full'>
            <div className='flex justify-between items-center'>
                <h1>Templates</h1>
                <HStack>
                    <Button className='mx-4' appearance='primary' color='green' onClick={newTemplate}>Add</Button>
                    <Button className='mx-4' appearance='primary' color='blue' onClick={editTemplate}>Edit</Button>
                    <Button className='mx-4' appearance='primary' color='red' onClick={deleteTemplate}>Delete</Button>
                </HStack>
            </div>
            <DataTable
                selectableRows
                selectableRowsSingle
                onSelectedRowsChange={selectTemplate}
                columns={columns}
                data={userTemplates}
                onRowClicked={rowClicled}
            />
            <ModalDelete template={selectedTemplate} openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    );
}

export default TableTemplates;