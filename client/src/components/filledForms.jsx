import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { postRequest } from "../api/api";

function FilledForms({id}) {
    const [forms,setForms] = useState();
    const rowClicked = (row) => {
        console.log(row);
    }
    useEffect(()=>{
        const getForms = async () => {
            const result = await postRequest('/getForms',{"id":id});
            setForms(result)
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
            />
        </div>
     );
}

export default FilledForms;