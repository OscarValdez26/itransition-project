import { useContext, useState } from "react";
import { Text, Button } from "rsuite";
import { AppContext } from "../context/Provider";
import QuestionAnswered from "../components/questionAnswered.jsx";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api/api.js";
import Markdown from "react-markdown";
import { useTranslation } from "react-i18next";
import LikeComments from "../components/likeComents.jsx";

function EditForm() {
    const { user, form, template, setPage } = useContext(AppContext);
    const { t } = useTranslation();
    const [answers, setAnswers] = useState(form.answers);
    const [newAnswers,setNewAnswers] = useState([]);
    const [url,setUrl] = useState(template.image);
    const navigate = useNavigate();
    const updateAnswers = (newAnswer, idQuestion) => {
        const existQuestion = answers.find((answer) => answer.question === idQuestion);
        if(existQuestion){
            const updatedAnswers = answers.map((answer ) => idQuestion === answer.question ? { ...answer, value: newAnswer } : { ...answer });
            setAnswers(updatedAnswers);
        }
        else{
            const isNew = newAnswers.find(answer => answer.question === idQuestion);
            if(!isNew){
                const jsonNewAnswer = {
                    "question":idQuestion,
                    "value": newAnswer
                }
                setNewAnswers([...newAnswers,jsonNewAnswer]);
            }
            else{
                const updatedNewAnswers = newAnswers.map((answer) => answer.question === idQuestion ? {...answer,value:newAnswer}:{...answer});    
                setNewAnswers(updatedNewAnswers);
            }           
        }
    }
    const saveAnswers = async () => {
        const jsonForm = {
            "id": form.id,
            "updatedBy": user.id,
            "answers": answers,
            "newAnswers": newAnswers
        };
        const result = await postRequest('/updateForm', jsonForm);
        if (result === "OK") {
            alert("Form saved");
            setPage("myTemplates");
            navigate('/profile');
        }
        else { 
            alert(result);
        }
    }
    return (
        <div className="p-4 m-4">
            {url && <img src={url} alt="Uploaded" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', objectPosition: 'center' }} />}
            <div className="flex justify-center">
                <Text className="text-bold" size={'xxl'}>{template.title}</Text>
            </div>
            <Markdown className="m-2">{template.description}</Markdown>
            <ul>
                {template.questions.map((question, index) => <li key={index}><QuestionAnswered question={question} answers={answers} updateAnswers={updateAnswers} /></li>)}
            </ul>
            <div className="flex justify-center m-4"><Button onClick={saveAnswers} appearance="primary" color="green">{t('Save')} {t('Answers')}</Button></div>
            <LikeComments/>
        </div>
    );
}

export default EditForm;