import { useContext, useState, useEffect } from "react";
import { Input, Toggle, SelectPicker, Button, HStack } from "rsuite";
import QuestionsList from "../components/questionList.jsx";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import NavbarTemplate from "../components/navbarTemplate.jsx";
import AdminTable from "../components/adminTable.jsx";

function NewTemplate() {
    const { user, page, reorder, setReorder, questions, setQuestions, setPage, availableTopics } = useContext(AppContext);
    const [title, setTitle] = useState("Title");
    const [description, setDescription] = useState("No description");
    const [access, setAccess] = useState("public");
    const [questionType, setQuestionType] = useState();
    const [questionAccess, setQuestionAccess] = useState(true);
    const [admin,setAdmin] = useState();
    const [blocked,setBlocked] = useState();
    const [topic,setTopic] = useState();
    const navigate = useNavigate();
    const types = ['Line', 'Text', 'Checkbox', 'Number'].map(item => ({ label: item, value: item }));
    const topics = availableTopics.map(item => ({ label: item.topic, value: item.topic }));
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
            "topic": topic,
            "admin":admin,
            "blocked": blocked,
            "questions": questions
        }
        const result = await postRequest('/newTemplate', jsonTemplate);
        if (result === "OK") {
            alert("Template Saved");
            localStorage.removeItem("userTemplates");
            navigate('/profile');
        }
    }
    useEffect(() => {
        if (reorder) {
            setReorder(false);
            setPage("questions");
        }
    })
    useEffect(()=>{
        setPage("configuration");
    },[user.id])
    return (
        <div>
            <NavbarTemplate includeForms={false} />
            <HStack className="justify-end p-2 m-2">
                <Button color="green" appearance="primary" onClick={saveTemplate}>Save Template</Button>
            </HStack>
            {page === "configuration" && <div className="p-2 m-2 justify-center">
                <p className="text-bold">Title</p>
                <Input placeholder="Title" size="lg" onChange={(e) => { setTitle(e) }} />
                <p className="text-bold">Description</p>
                <Input placeholder="Description" size="sm" onChange={(e) => { setDescription(e) }} />
                <p className="text-bold">Access</p>
                <HStack>
                <Toggle size={'lg'} color="cyan" checkedChildren="public" unCheckedChildren="private" defaultChecked onChange={(e) => { e ? setAccess("public") : setAccess("private") }} />
                    <SelectPicker data={topics} value={topic} onChange={setTopic} searchable={false} style={{ width: 224 }} placeholder="Template topic"/>
                </HStack>
                
                <AdminTable setAdmin={setAdmin} setBlocked={setBlocked} admin={admin} blocked={blocked}/>
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