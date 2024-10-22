import { useContext, useEffect, useState } from "react";
import { Input, Toggle, SelectPicker, Button, HStack } from "rsuite";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider.jsx";
import { useNavigate } from "react-router-dom";
import NavbarTemplate from "../components/navbarTemplate.jsx";
import QuestionsList from "../components/questionList.jsx";
import ModalDelete from "../components/modalDelete.jsx";
import FilledForms from "../components/filledForms.jsx";
import AdminTable from "../components/adminTable.jsx";
import { useTranslation } from "react-i18next";

function EditTemplate() {
    const { template, user, page, setPage, reorder, setReorder, questions, setQuestions, setForm, setUserTemplates, availableTopics} = useContext(AppContext);
    const { t } = useTranslation();
    const [title, setTitle] = useState(template.title);
    const [description, setDescription] = useState(template.description);
    const [access, setAccess] = useState(template.access);
    const [questionType, setQuestionType] = useState();
    const [questionAccess, setQuestionAccess] = useState(true);
    const [deletedQuestions, setDeletedQuestions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [admin, setAdmin] = useState(template.admin);
    const [blocked, setBlocked] = useState(template.blocked);
    const [topic,setTopic] = useState(template.topic);
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
        setReorder(true);
        setPage("");
        if(deleted.id > 0) setDeletedQuestions([...deletedQuestions, deleted]);
    };
    const updateTemplate = async () => {
        if (!questions.length) return alert(t('Template_no_questions'));
        const jsonTemplate = {
            "id": template.id,
            "title": title,
            "description": description,
            "autor": user.id,
            "access": access,
            "topic": topic,
            "questions": questions,
            "deleted": deletedQuestions,
            "admin": admin,
            "blocked": blocked
        }
        const result = await postRequest('/updateTemplate', jsonTemplate);
        if (result === "OK") {
            alert(t('Template_updated'));
            localStorage.removeItem("userTemplates");
            setUserTemplates([]);
            navigate('/profile');
        }
        else {
            alert(t('Something_wrong'));
        }
    }
    useEffect(() => {
        if (reorder) {
            setReorder(false);
            setPage("questions");
        }
    })
    useEffect(() => {
        if(!page) setPage("configuration");
        localStorage.removeItem("form");
        setForm();
    },[user.id])
    return (
        <div>
            <NavbarTemplate includeForms={true} />
            {page != "forms" && <HStack className="justify-end p-2 m-2">
                <Button color="green" appearance="primary" onClick={updateTemplate}>{t('Save')} {t('Template')}</Button>
                <Button color="red" appearance="primary" onClick={() => setOpenModal(true)}>{t('Delete')} {t('Template')}</Button>
            </HStack>}
            {page === "configuration" && <div className="p-2 m-2 justify-center">
                <p className="text-bold">{t('Title')}</p>
                <Input placeholder={template.title} size="lg" onChange={(e) => { setTitle(e) }} />
                <p className="text-bold">{t('Description')}</p>
                <Input placeholder={template.description} size="sm" onChange={(e) => { setDescription(e) }} />
                <p className="text-bold">{t('Access')}</p>
                <HStack>
                <Toggle size={'lg'} color="cyan" checkedChildren={t('Public')} unCheckedChildren={t('Private')} defaultChecked={template.access === "public"} onChange={(e) => { e ? setAccess("public") : setAccess("private") }} />
                <SelectPicker data={topics} value={topic} onChange={setTopic} searchable={false} style={{ width: 224 }} placeholder={t('Topic')}/>
                </HStack>
                <AdminTable setAdmin={setAdmin} setBlocked={setBlocked} admin={admin} blocked={blocked} />
            </div>}
            {page === "questions" &&
                <div>
                    <HStack className="m-2 p-2" justifyContent="flex-end">
                        <SelectPicker data={types} defaultValue={questionType} onChange={setQuestionType} searchable={false} style={{ width: 224 }} placeholder={t('Question_type')} />
                        <Toggle size={'lg'} color="cyan" checkedChildren="visible" unCheckedChildren="not visible" defaultChecked onChange={(e) => { e ? setQuestionAccess(true) : setQuestionAccess(false) }} />
                        <Button onClick={createQuestion}>{t('Add')} {t('Question')}</Button>
                    </HStack>
                    <QuestionsList onEdit={editQuestion} onDelete={deleteQuestion} />
                </div>
            }
            {page === "forms" && <FilledForms id={template.id} />}
            <ModalDelete template={template} openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    );
}

export default EditTemplate;