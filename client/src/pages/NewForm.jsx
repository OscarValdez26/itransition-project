import { useContext, useState, useEffect } from "react";
import Question from "../components/question";
import { Button, Text } from "rsuite";
import { AppContext } from "../context/Provider";
import { postRequest } from "../api/api.js";
import { useNavigate } from "react-router-dom";

function NewForm() {
    const { user, template } = useContext(AppContext);
    const initialAnswers = template.questions.map((question) => ({ "id": question.id, "value": null }));
    const [answers, setAnswers] = useState(initialAnswers);
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
        <div className="p-4 m-4">
            <div className="flex justify-center"><Text className="text-bold" size={'xxl'}>{template.title}</Text></div>
            <Text className="text-bold m-2" size={'lg'}>{template.description}</Text>
            <ul>
                {template.questions.map((question, index) => <li key={index}><Question question={question} updateAnswers={updateAnswers} index={index} /></li>)}
            </ul>
            <div className="flex justify-center m-4"><Button onClick={saveAnswers} appearance="primary" color="green">Save answers</Button></div>
        </div>
    );
}

export default NewForm;