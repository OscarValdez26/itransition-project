import { useContext, useState } from "react";
import { Input, Toggle, SelectPicker, Button, HStack } from "rsuite";
import Question from "../components/question.jsx";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";

function Template() {
    const { template, user } = useContext(AppContext);
    const [questions, setQuestions ] = useState(template.questions);
    const [title, setTitle] = useState(template.title);
    const [description, setDescription] = useState(template.description);
    const [access, setAccess] = useState(template.access);
    const [questionType, setQuestionType] = useState();
    const [questionAccess, setQuestionAccess] = useState(true);
    const types = ['Line', 'Text', 'Checkbox', 'Number'].map(
        item => ({ label: item, value: item })
    );
    const createQuestion = () => {
        if (!questionType) {
            alert("Please select question type")
        } else {
            const jsonQuestion = {
                "title": "Title",
                "description": "Description",
                "question": "Question",
                "type": questionType,
                "position": questions.length,
                "visibility": questionAccess,
                "options": null
            }
            setQuestions([...questions, jsonQuestion]);
        }
    }
    const editQuestion = (position, newTitle, newDescription, newQuestion, newOptions) => {
        const updatedQuestions = questions.map(question =>
            question.position === position ? { ...question, title: newTitle, description: newDescription, question: newQuestion, options: newOptions } : question
        );
        setQuestions(updatedQuestions);
    };
    const deleteQuestion = (position) => {
        const filteredQuestions = questions.filter((question) => question.position !== position);
        const updatedQuestions = filteredQuestions.map((question,index) => ({ ...question, position:index }));
        setQuestions(updatedQuestions);
    };
    const saveTemplate = async () => {
        if(!questions.length) return alert("The template have not questions");
        const jsonTemplate = {
            "title": title,
            "description": description,
            "autor": user.id,
            "access": access,
            "questions":questions
        }
        // const result = await postRequest('/newTemplate',jsonTemplate);
        // if(result === "OK"){
        //     alert("Template Saved");
        //     navigate('/profile');
        // }
    }
    return ( 
        <div>
        <div className="p-2 m-2 justify-center">
            <h1 className="text-bold text-center text-xl p-2 m-2">Create Template</h1>
            <HStack>
                <Input placeholder="Title" size="lg" onChange={(e) => { setTitle(e) }} />
                <Toggle size={'lg'} color="cyan" checkedChildren="public" unCheckedChildren="private" defaultChecked onChange={(e) => { e ? setAccess("public") : setAccess("private") }} />
            </HStack>
            <Input placeholder="Description" size="sm" onChange={(e) => { setDescription(e) }} />
            <HStack>
                <SelectPicker data={types} value={questionType} onChange={setQuestionType} searchable={false} style={{ width: 224 }} placeholder="Question type" />
                <Toggle size={'lg'} color="cyan" checkedChildren="visible" unCheckedChildren="not visible" defaultChecked onChange={(e) => { e ? setQuestionAccess(true) : setQuestionAccess(false) }} />
                <Button onClick={createQuestion}>Add Question</Button>
                <Button onClick={saveTemplate}>Save Template</Button>
                <Button onClick={() => { console.log(questions) }}>See Questions</Button>
            </HStack>
        </div>
        <ul>
            {questions.map(question => <li key={question.position}><Question questionData={question} onEdit={editQuestion} onDelete={deleteQuestion} /></li>)}
        </ul>
    </div>
     );
}

export default Template;