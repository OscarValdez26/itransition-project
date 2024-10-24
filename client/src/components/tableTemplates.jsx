import { Button, HStack } from 'rsuite';
import { useContext, useState } from 'react';
import { AppContext } from '../context/Provider.jsx';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../api/api.js';
import ModalDelete from './modalDelete.jsx';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

function TableTemplates() {
    const { userTemplates, setTemplate, setPage, setQuestions, theme } = useContext(AppContext);
    const { t } = useTranslation();
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const columns = [
        {
            name: t('Title'),
            selector: row => row.title,
            sortable: true,
            grow: 2,
        },
        {
            name: t('Description'),
            selector: row => row.description,
            sortable: true,
            grow: 3,
        },
        {
            name: t('Access'),
            selector: row => row.access,
            sortable: true,
        },
        {
            name: t('Topic'),
            selector: row => row.topic,
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
        if (!selectedTemplate) return alert(t('Select_template'));
        const result = await postRequest('/getTemplate', { "id": selectedTemplate.id });
        setTemplate(result);
        setQuestions(result.questions);
        localStorage.setItem("template",JSON.stringify(result));
        localStorage.setItem("questions",JSON.stringify(result.questions));
        setPage("configuration");
        navigate('/editTemplate');
    }
    const rowClicked = async (row) => {
        setSelectedTemplate(row);
        const result = await postRequest('/getTemplate', { "id": row.id });
        setTemplate(result);
        setQuestions(result.questions);
        localStorage.setItem("template",JSON.stringify(result));
        localStorage.setItem("questions",JSON.stringify(result.questions));
        setPage("configuration");
        navigate('/editTemplate');
    }
    const deleteTemplate = () => {
        if (!selectedTemplate) return alert(t('Select_template'));
        setOpenModal(true);
    }
    return (
        <div className='m-4 p-4 rounded-md w-full'>
            <div className='flex justify-between items-center'>
                <h1>{t('Templates')}</h1>
                <HStack>
                    <Button className='mx-4' appearance='primary' color='green' onClick={newTemplate}>{t('Add')}</Button>
                    <Button className='mx-4' appearance='primary' color='blue' onClick={editTemplate}>{t('Edit')}</Button>
                    <Button className='mx-4' appearance='primary' color='red' onClick={deleteTemplate}>{t('Delete')}</Button>
                </HStack>
            </div>
            <div className='overflow-scroll' style={{'maxHeight':'600px'}}>
            <DataTable
                selectableRows
                selectableRowsSingle
                onSelectedRowsChange={selectTemplate}
                columns={columns}
                data={userTemplates}
                onRowClicked={rowClicked}
                theme={theme}
            />
            </div>
            <ModalDelete template={selectedTemplate} openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    );
}

export default TableTemplates;