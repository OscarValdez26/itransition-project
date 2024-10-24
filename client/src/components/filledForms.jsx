import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { postRequest } from "../api/api";
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function FilledForms({id}) {
    const { user, setForm, setTemplate, theme } = useContext(AppContext);
    const { t } = useTranslation();
    const [forms,setForms] = useState(); 
    const navigate = useNavigate();
    const rowClicked = async (row) => {
        setForm(row);
        const result = await postRequest('/getTemplate',{"id":row.template});
        setTemplate(result);
        user.name === row.name ? navigate('/editForm'):navigate('/seeForm');
    }
    useEffect(()=>{
        const getForms = async () => {
            const result = await postRequest('/getForms',{"id":id});
            setForms(result);
        }
        getForms();
    },[id])
    const columns = [
        {
            name: t('User'),
            selector: row => row.name,
            sortable: true,
            grow: 2
        },
        {
            name: t('Date'),
            selector: row => row.date,
            sortable: true,
            grow: 2
        },
    ];
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

export default FilledForms;