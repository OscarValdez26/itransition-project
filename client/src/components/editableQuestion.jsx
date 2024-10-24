import { useState } from "react";
import { Input, Button, Panel, HStack } from "rsuite";
import CheckboxAnswer from "./checkboxAnswers.jsx";
import { useTranslation } from "react-i18next";

function EditableQuestion({questionData, onEdit, onDelete, changeExpandedArray, index}) {
    const { t } = useTranslation();
    const [title,setTitle] = useState(questionData.title);
    const [description,setDescription] = useState(questionData.description);
    const [question,setQuestion] = useState(questionData.question);
    const [options,setOptions] = useState(questionData.options);
    const [expanded,setExpanded] = useState(false);
    const editOptions = (newOptions) => {
        setOptions(newOptions);
    };
    const deleteQuestion = () => {
        onDelete(questionData.position);
    } 
    const saveQuestion = () => {
        onEdit(questionData.position,title,description,question,options);
    }
    const changeExpanded = () => {
        setExpanded(!expanded);
        changeExpandedArray(!expanded,index);
    }
    return ( 
        <Panel header={questionData.title} bordered collapsible expanded={expanded} onSelect={changeExpanded}>
            <Input placeholder={title} size="lg" onChange={(e) => { setTitle(e) }} />
            <Input placeholder={description} size="lg" onChange={(e) => { setDescription(e) }} />
            <Input placeholder={question} size="lg" onChange={(e) => { setQuestion(e) }} />
            {questionData.type == "Checkbox" && <CheckboxAnswer stringOptions={questionData.options} editOptions={editOptions}/>}
            <HStack>
            <Button onClick={saveQuestion}>{t('Save')} {t('Question')}</Button>
            <Button onClick={deleteQuestion}>{t('Delete')} {t('Question')}</Button>
            </HStack>            
        </Panel>     
     );
}

export default EditableQuestion;