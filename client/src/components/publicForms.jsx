import { useContext, useEffect, useState } from "react";
import { postRequest } from "../api/api";
import DataTable from 'react-data-table-component';
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";

function PublicForms() {
    const { user, setTemplate } = useContext(AppContext);
    const [templates, setTemplates] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const result = await postRequest('/getAllTemplates', { "id": user.id });
            setTemplates(result);
        }
        fetchData();
    }, [user.id])
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
            name: 'Autor',
            selector: row => row.name,
            sortable: true,
            grow: 1
        },
    ];
    const rowClicked = async (row) => {
        const result = await postRequest('/getTemplate', { "id": row.id });
        setTemplate(result);
        navigate('/newForm');
    }
    return (
        <div>
            <DataTable
                columns={columns}
                data={templates}
                onRowClicked={rowClicked}
            />
        </div>
    );
}

export default PublicForms;