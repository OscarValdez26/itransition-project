import { useContext, useState } from "react";
import { VStack, Input, Text } from "rsuite";
import { AppContext } from "../context/Provider.jsx";
import Question from "../components/question.jsx";
import Markdown from "react-markdown";

function SeeTemplate() {
    const { template } = useContext(AppContext);
    return (
        <div className="m-2 p-2">
                <div className="flex justify-center"><Text className="text-bold m-2 p-2 text-2xl" >{template.title}</Text></div>
                <Markdown className="m-2 text-lg">{template.description}</Markdown>
                <ul>
                {template.questions.map((question, index) => <li key={index}><Question question={question} updateAnswers={()=>{}} index={index} onlyRead ={true}/></li>)}
            </ul>
        </div>
    );
}

export default SeeTemplate;