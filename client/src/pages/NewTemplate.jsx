import { useContext, useState, useEffect } from "react";
import { Input, Toggle, SelectPicker, Button, HStack } from "rsuite";
import QuestionsList from "../components/questionList.jsx";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/navbarTemplate.jsx";

function NewTemplate() {
    const { user, page, reorder, setReorder, questions, setQuestions, setPage } = useContext(AppContext);
    const [title, setTitle] = useState("Title");
    const [description, setDescription] = useState("No description");
    const [access, setAccess] = useState("public");
    const [questionType, setQuestionType] = useState();
    const [questionAccess, setQuestionAccess] = useState(true);
    const navigate = useNavigate();
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
            setReorder(true);
            setPage("");
        }
    }
    const editQuestion = (position, newTitle, newDescription, newQuestion, newOptions) => {
        const updatedQuestions = questions.map(question =>
            question.position === position ? { ...question, title: newTitle, description: newDescription, question: newQuestion, options: newOptions } : question
        );
        setQuestions(updatedQuestions);
        setReorder(true);
        setPage("");
    };
    const deleteQuestion = (position) => {
        const filteredQuestions = questions.filter((question) => question.position !== position);
        const updatedQuestions = filteredQuestions.map((question, index) => ({ ...question, position: index }));
        setQuestions(updatedQuestions);
        setReorder(true);
        setPage("");
    };
    const saveTemplate = async () => {
        if (!questions.length) return alert("The template have not questions");
        const jsonTemplate = {
            "title": title,
            "description": description,
            "autor": user.id,
            "access": access,
            "questions": questions
        }
        const result = await postRequest('/newTemplate', jsonTemplate);
        if (result === "OK") {
            alert("Template Saved");
            navigate('/profile');
        }
    }
    useEffect(() => {
        if (reorder) {
            setReorder(false);
            setPage("questions");
        }
    })
    return (
        <div>
            <NavigationBar updateTemplate={saveTemplate} includeForms={false} />
            {page === "configuration" && <div className="p-2 m-2 justify-center">
                <label className="text-bold">Title</label>
                <HStack>
                    <Input placeholder="Title" size="lg" onChange={(e) => { setTitle(e) }} />
                    <Toggle size={'lg'} color="cyan" checkedChildren="public" unCheckedChildren="private" defaultChecked onChange={(e) => { e ? setAccess("public") : setAccess("private") }} />
                </HStack>
                <label className="text-bold">Description</label>
                <Input placeholder="Description" size="sm" onChange={(e) => { setDescription(e) }} />
            </div>}
            {page === "questions" && <div>
                <HStack className="m-2 p-2" justifyContent="flex-end">
                    <SelectPicker data={types} value={questionType} onChange={setQuestionType} searchable={false} style={{ width: 224 }} placeholder="Question type" />
                    <Toggle size={'lg'} color="cyan" checkedChildren="visible" unCheckedChildren="not visible" defaultChecked onChange={(e) => { e ? setQuestionAccess(true) : setQuestionAccess(false) }} />
                    <Button onClick={createQuestion}>Add Question</Button>
                    <Button onClick={() => { console.log(questions) }}>See Question</Button>
                </HStack>
                <QuestionsList onEdit={editQuestion} onDelete={deleteQuestion} />
            </div>}
        </div>
    );
}

export default NewTemplate;