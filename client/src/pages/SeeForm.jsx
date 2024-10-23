import { useContext, useState } from "react";
import { Text } from "rsuite";
import { AppContext } from "../context/Provider";
import QuestionAnswered from "../components/questionAnswered.jsx";
import Markdown from "react-markdown";

function SeeForm() {
    const { form, template } = useContext(AppContext);
    const [answers, setAnswers] = useState(form.answers);
    const [url,setUrl] = useState(template.image);
    return (
        <div className="m-2 p-2">
            {url && <img src={url} alt="Uploaded" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }} />}
            <div className="flex justify-center"><Text className="text-bold m-2 p-2 text-2xl">{template.title}</Text></div>
            <Markdown className="m-2 text-lg">{template.description}</Markdown>
            <ul>
                {template.questions.map((question, index) => <li key={index}>
                    <QuestionAnswered question={question} answers={answers} readOnly={true}/>                 
                    </li>)}
            </ul>
        </div>
    );
}

export default SeeForm;