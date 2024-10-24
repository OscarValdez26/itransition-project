import { useContext, useState, useEffect } from "react";
import { Input, Toggle, SelectPicker, Button, HStack, TagInput } from "rsuite";
import QuestionsList from "../components/questionList.jsx";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider";
import { useNavigate } from "react-router-dom";
import NavbarTemplate from "../components/navbarTemplate.jsx";
import AdminTable from "../components/adminTable.jsx";
import { useTranslation } from "react-i18next";
import ImageUpload from "../components/imageUpload.jsx";

function NewTemplate() {
    const { user, page, reorder, setReorder, questions, setQuestions, setPage, availableTopics } = useContext(AppContext);
    const { t } = useTranslation();
    const [title, setTitle] = useState("Title");
    const [description, setDescription] = useState("No description");
    const [access, setAccess] = useState("public");
    const [questionType, setQuestionType] = useState();
    const [questionAccess, setQuestionAccess] = useState(true);
    const [admin,setAdmin] = useState();
    const [blocked,setBlocked] = useState();
    const [topic,setTopic] = useState();
    const [url,setUrl] = useState("");
    const [tags, setTags] = useState("");
    const navigate = useNavigate();
    const types = ['Line', 'Text', 'Checkbox', 'Number'].map(item => ({ label: item, value: item }));
    const topics = availableTopics.map(item => ({ label: item.topic, value: item.topic }));
    const createQuestion = () => {
        if (!questionType) {
            alert(t('Select_type'));
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
        if (!questions.length) return alert(t('Template_no_questions'));
        const jsonTemplate = {
            "title": title,
            "description": description,
            "autor": user.id,
            "access": access,
            "topic": topic,
            "image": url,
            "tags": tags,
            "admin":admin,
            "blocked": blocked,
            "questions": questions
        }
        console.log(jsonTemplate);
        const result = await postRequest('/newTemplate', jsonTemplate);
        if (result === "OK") {
            alert(t('Template_saved'));
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
                {url && <img src={url} alt="Uploaded" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }} />}
                <p className="text-bold">Title</p>
                <Input placeholder="Title" size="lg" onChange={(e) => { setTitle(e) }} />
                <p className="text-bold">Description</p>
                <Input placeholder="Description" size="sm" onChange={(e) => { setDescription(e) }} />
                <p className="text-bold">Access</p>
                <HStack>
                <Toggle size={'lg'} color="cyan" checkedChildren="public" unCheckedChildren="private" defaultChecked onChange={(e) => { e ? setAccess("public") : setAccess("private") }} />
                    <SelectPicker data={topics} value={topic} onChange={setTopic} searchable={false} style={{ width: 224 }} placeholder="Template topic"/>
                </HStack>
                <ImageUpload setUrl={setUrl}/>
                <p className="text-bold">{t('Tags')}</p>
                <TagInput style={{ width: 300 }} onChange={(e) => {setTags(e.join(','))}}/>
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