import { useContext, useEffect, useState } from "react";
import { postRequest } from "../api/api";
import DataTable from 'react-data-table-component';
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PublicTemplates() {
    const { user, setTemplate, setQuestions, setPage, theme } = useContext(AppContext);
    const { t } = useTranslation();
    const [templates, setTemplates] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const result = await postRequest('/getAllTemplates', { "id": user.id });
            updateRole(result);
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
            name: t('Description'),
            selector: row => row.description,
            sortable: true,
            grow: 3
        },
        {
            name: t('Author'),
            selector: row => row.name,
            sortable: true,
            grow: 1
        },
        {
            name: t('Permissions'),
            selector: row => row.status,
            sortable: true,
            grow: 1
        },
        {
            name: t('Topic'),
            selector: row => row.topic,
            sortable: true,
        },
    ];
    const updateRole = (templates) => {    
        const stringId = user.id.toString();
        const setRolesTemplate = templates.map((template) => ({...template,status:"User"}));
        const setAdminTemplates = setRolesTemplate.map((template) => stringToArray(template.admin).includes(stringId) ? {...template,status:"Admin"}:{...template});
        const setBlockedTemplates = setAdminTemplates.map((template) => stringToArray(template.blocked).includes(stringId) ? {...template,status:"Blocked"}:{...template});
        setTemplates(setBlockedTemplates);
    }
        const stringToArray = (stringArray) => {
            if (!stringArray) return [];
            if (stringArray.includes(',')) {
                return stringArray.split(',');
            }
            return [stringArray];
        }
    const rowClicked = async (row) => {
        if(row.status === "Blocked") return alert(t('You_blocked'));   
        const result = await postRequest('/getTemplate', { "id": row.id });
        setTemplate(result); 
        localStorage.setItem("template",JSON.stringify(result));
        if(row.status === "Admin") {          
            setQuestions(result.questions);
            localStorage.setItem("questions",JSON.stringify(result.questions));
            setPage("configuration");
            navigate('/editTemplate');
        }
        else{
        navigate('/newForm'); 
        }
    }
    return (
        <div>
            <DataTable
                columns={columns}
                data={templates}
                onRowClicked={rowClicked}
                theme={theme}
            />
        </div>
    );
}

export default PublicTemplates;