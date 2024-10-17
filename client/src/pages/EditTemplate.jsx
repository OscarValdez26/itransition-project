import { useContext, useEffect, useState } from "react";
import { Input, Toggle, SelectPicker, Button, HStack } from "rsuite";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider.jsx";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/navbarTemplate.jsx";
import QuestionsList from "../components/questionList.jsx";
import ModalDelete from "../components/modalDelete.jsx";
import FilledForms from "../components/filledForms.jsx";

function EditTemplate() {
    const { template, user, page, questions, setQuestions, reorder, setReorder, setPage } = useContext(AppContext);
    const [title, setTitle] = useState(template.title);
    const [description, setDescription] = useState(template.description);
    const [access, setAccess] = useState(template.access);
    const [questionType, setQuestionType] = useState();
    const [questionAccess, setQuestionAccess] = useState(true);
    const [deletedQuestions, setDeletedQuestions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
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
        const update = questions.map(question => question.position === position ? { ...question, title: newTitle, description: newDescription, question: newQuestion, options: newOptions } : question);
        setQuestions(update);
        setReorder(true);
        setPage("");
    };
    const deleteQuestion = (position) => {
        const filteredQuestions = questions.filter(question => question.position !== position);
        const deleted = questions[position];
        const reorderedQuestions = filteredQuestions.map((question, index) => ({ ...question, position: index }));
        setQuestions(reorderedQuestions);
        setDeletedQuestions([...deletedQuestions, deleted]);
        setReorder(true);
        setPage("");
    };
    const updateTemplate = async () => {
        if (!questions.length) return alert("The template have not questions");
        const jsonTemplate = {
            "id": template.id,
            "title": title,
            "description": description,
            "autor": user.id,
            "access": access,
            "questions": questions,
            "deleted": deletedQuestions
        }
        const result = await postRequest('/updateTemplate', jsonTemplate);
        if (result === "OK") {
            alert("Template updated");
            navigate('/profile');
        }
        else {
            alert("Something went wrong");
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
            <NavigationBar updateTemplate={updateTemplate} setOpenModal={setOpenModal} includeForms={true} />
            {page === "configuration" && <div className="p-2 m-2 justify-center">
                <p className="text-bold">Title</p>
                <Input placeholder={template.title} size="lg" onChange={(e) => { setTitle(e) }} />
                <p className="text-bold">Description</p>
                <Input placeholder={template.description} size="sm" onChange={(e) => { setDescription(e) }} />
                <p className="text-bold">Access</p>
                <Toggle size={'lg'} color="cyan" checkedChildren="public" unCheckedChildren="private" defaultChecked={template.access === "public"} onChange={(e) => { e ? setAccess("public") : setAccess("private") }} />
            </div>}
            {page === "questions" &&
                <div>
                    <HStack className="m-2 p-2" justifyContent="flex-end">
                        <SelectPicker data={types} defaultValue={questionType} onChange={setQuestionType} searchable={false} style={{ width: 224 }} placeholder="Question type" />
                        <Toggle size={'lg'} color="cyan" checkedChildren="visible" unCheckedChildren="not visible" defaultChecked onChange={(e) => { e ? setQuestionAccess(true) : setQuestionAccess(false) }} />
                        <Button onClick={createQuestion}>Add Question</Button>
                        <Button onClick={() => console.log(questions)}>See Question</Button>
                    </HStack>
                    <QuestionsList onEdit={editQuestion} onDelete={deleteQuestion} />
                </div>
            }
            {page === "forms" && <FilledForms id={template.id}/>}
            <ModalDelete template={template} openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    );
}

export default EditTemplate;