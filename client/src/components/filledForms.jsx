import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { postRequest } from "../api/api";
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";

function FilledForms({id}) {
    const { user, setForm, setTemplate, theme } = useContext(AppContext);
    const [forms,setForms] = useState(); 
    const navigate = useNavigate();
    const rowClicked = async (row) => {
        setForm(row);
        console.log(row);
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
            name: 'User',
            selector: row => row.name,
            sortable: true,
            grow: 2
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            grow: 2
        },
    ];
    return ( 
        <div>
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