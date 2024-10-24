import { useContext, useEffect, useState } from "react";
import { postRequest } from "../api/api";
import DataTable from 'react-data-table-component';
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function TableForms() {
    const { user, theme, setTemplate, setForm } = useContext(AppContext);
    const { t } = useTranslation();
    const [forms, setForms] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const result = await postRequest('/getUserForms', { "id": user.id });
            setForms(result);
        }
        fetchData();
    }, [user.id])
    const columns = [
        {
            name: t('Title'),
            selector: row => row.title,
            sortable: true,
            grow: 2
        },
        {
            name: t('Date'),
            selector: row => row.date,
            sortable: true,
            grow: 3
        },
        {
            name: t('Topic'),
            selector: row => row.topic,
            sortable: true,
        },
    ];
    const rowClicked = async (row) => {
        setForm(row);
        const result = await postRequest('/getTemplate', { "id": row.template });
        setTemplate(result);
        navigate('/editForm');
    }
    return (
        <div className='overflow-scroll' style={{'maxHeight': '600px'}}>
            <DataTable
                columns={columns}
                data={forms}
                onRowClicked={rowClicked}
                theme={theme}
            />
        </div>
    );
}

export default TableForms;