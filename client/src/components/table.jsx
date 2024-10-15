import { Button, Table } from 'rsuite';
import { useContext } from 'react';
import { AppContext } from '../context/Provider.jsx';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../api/api.js';

function TableTemplates() {
    const { userTemplates, setTemplate, setPage, setQuestions } = useContext(AppContext);
    const { Column, HeaderCell, Cell } = Table;
    const navigate = useNavigate();
    const selectTemplate = async (row) => {
        const result = await postRequest('/getTemplate',{"id":row.id});
        setTemplate(result);
        setQuestions(result.questions);
        setPage("configuration");
        navigate('/editTemplate');
    }
    const newTemplate = () => {
        setPage("configuration");
        navigate('/newTemplate');
    }
    return (
        <div className='m-4 p-4 rounded-md w-full'>
            <div className='flex justify-between items-center'>
                <h1>Templates</h1>
                <Button className='mx-4' onClick={newTemplate}>Add</Button>              
            </div>
            <Table hover={true} virtualized data={userTemplates} onRowClick={selectTemplate} height={600}>
                <Column flexGrow={2}>
                    <HeaderCell>Title</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column flexGrow={3}>
                    <HeaderCell>Description</HeaderCell>
                    <Cell dataKey="description" />
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>Access</HeaderCell>
                    <Cell dataKey="access" />
                </Column>

            </Table>
        </div>
    );
}

export default TableTemplates;