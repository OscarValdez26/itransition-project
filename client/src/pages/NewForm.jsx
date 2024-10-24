import { useContext, useState } from "react";
import Question from "../components/question";
import { Button, Text } from "rsuite";
import { AppContext } from "../context/Provider";
import { postRequest } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import Markdowm from "react-markdown";
import { useTranslation } from "react-i18next";
import LikeComments from '../components/likeComents.jsx'

function NewForm() {
    const { user, template } = useContext(AppContext);
    const { t } = useTranslation();
    const initialAnswers = template.questions.map((question) => ({ "id": question.id, "value": null }));
    const [answers, setAnswers] = useState(initialAnswers);
    const [url,setUrl] = useState(template.image);
    const navigate = useNavigate();
    const updateAnswers = (newAnswer, indexAnswer) => {
        const newAnswers = answers.map((answer, index) => indexAnswer === index ? { ...answer, value: newAnswer } : { ...answer });
        setAnswers(newAnswers);
    }
    const saveAnswers = async () => {
        const jsonForm = {
            "template": template.id,
            "user": user.id,
            "answers": answers
        };
        const result = await postRequest('/newForm', jsonForm);
        if (result === "OK") {
            alert("Form saved");
            navigate('/profile');
        }
        else{
            alert(result);
        }
    }
    return (
        <div className="m-2 p-2">
            {url && <img src={url} alt="Uploaded" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }} />}
            <div className="flex justify-center"><Text className="text-bold m-2 p-2 text-2xl">{template.title}</Text></div>
            <Markdowm className="m-2 text-xl">{template.description}</Markdowm>
            <ul>
                {template.questions.map((question, index) => <li key={index}><Question question={question} updateAnswers={updateAnswers} index={index} /></li>)}
            </ul>
            <div className="flex justify-center m-4"><Button onClick={saveAnswers} appearance="primary" color="green">{t('Save')} {t('Answers')}</Button></div>
            <LikeComments/>
        </div>
    );
}

export default NewForm;