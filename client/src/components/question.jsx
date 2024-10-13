import { useState } from "react";
import { Input, Button, Panel, HStack } from "rsuite";
import CheckboxAnswer from "./checkbox.jsx";

function Question({questionData, onEdit, onDelete}) {
    const [title,setTitle] = useState(questionData.title);
    const [description,setDescription] = useState(questionData.description);
    const [question,setQuestion] = useState(questionData.question);
    const [options,setOptions] = useState(questionData.options);
    const editOptions = (newOptions) => {
        setOptions(newOptions);
    };
    const deleteQuestion = () => {
        onDelete(questionData.position);
    }
    const saveQuestion = () => {
        onEdit(questionData.position,title,description,question,options);
    }
    return ( 
        <Panel header={questionData.title} bordered collapsible>
            <Input placeholder={title} size="lg" onChange={(e) => { setTitle(e) }} />
            <Input placeholder={description} size="lg" onChange={(e) => { setDescription(e) }} />
            <Input placeholder={question} size="lg" onChange={(e) => { setQuestion(e) }} />
            {questionData.type == "Checkbox" && <CheckboxAnswer stringOptions={questionData.options} editOptions={editOptions}/>}
            <HStack>
            <Button onClick={saveQuestion}>Save Question</Button>
            <Button onClick={deleteQuestion}>Delete Question</Button>
            </HStack>            
        </Panel>     
     );
}

export default Question;