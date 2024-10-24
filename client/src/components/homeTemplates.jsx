import { useContext, useEffect, useState } from "react";
import { getRequest, postRequest } from "../api/api";
import DataTable from 'react-data-table-component';
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import { Text, HStack } from "rsuite";
import { useTranslation } from "react-i18next";

function HomeTemplates({ group }) {
    const { t } = useTranslation();
    const getTitle = () => {
        switch (group) {
            case '/popular':
                return t('Popular_templates');
            case '/latest':
                return t('Latest_templates');
            default:
                break;
        }
    }
    const { setTemplate, setQuestions, theme } = useContext(AppContext);
    const [templates, setTemplates] = useState();
    const navigate = useNavigate();
    const [title, setTitle] = useState(getTitle);
    useEffect(() => {
        const fetchData = async () => {
            const result = await getRequest(group);
            setTemplates(result);
        }
        fetchData();
    }, []);
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
        },
        {
            name: t('Topic'),
            selector: row => row.topic,
            sortable: true,
        },
    ];
    const rowClicked = async (row) => {
        const result = await postRequest('/getTemplate', { "id": row.id });
        setTemplate(result);
        setQuestions(result.questions);
        navigate('/seeTemplate');
    }
    return (
        <div>
            <HStack className="m-2 p-2" justifyContent="center">
                <Text size={'lg'} >{title}</Text>
            </HStack>
            <div className='overflow-scroll' style={{'maxHeight':'600px'}}>
            <DataTable
                columns={columns}
                data={templates}
                onRowClicked={rowClicked}
                theme={theme}
            />
            </div>
        </div>
    );
}

export default HomeTemplates;