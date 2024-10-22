import { Divider, VStack, Text, Input, CheckboxGroup, Checkbox } from "rsuite";
import { useEffect, useState } from "react";

function QuestionAnswered({ question, updateAnswers, answers, readOnly }) {
    const stringToArray = (stringArray) => {
            if (!stringArray) return [];
            if (stringArray.includes(',')) {
                return stringArray.split(',');
            }
            return [stringArray];
        }
        useEffect(()=>{
                const filteredAnswer = answers.find(answer => answer.question === question.id);
                console.log(question);
                console.log(filteredAnswer);
                if(filteredAnswer){
                    setAnswer(filteredAnswer.value);
                    if(question.type === "Checkbox"){
                        const splitedAnswers = stringToArray(filteredAnswer.value);
                        setCheckedOptions(splitedAnswers);
                    } 
                }    
        },[answers]);
    const [checkedOptions, setCheckedOptions] = useState();
    const [answer,setAnswer] = useState("");
    const [options, setOptions] = useState(stringToArray(question.options));
    const changeAnswer = (e) => {
        updateAnswers(e,question.id);
    }
    const changeChecked = (value) => {
        setCheckedOptions(value);
        updateAnswers(value.join(","),question.id);
    }
    return ( 
        <VStack alignItems="flex-start" spacing={6}>
            <Divider />
            <Text size={'md'}>{question.title}</Text>
            <Text size={'md'}>{question.description}</Text>
            <Text size={'md'}>{question.question}</Text>
            {question.type != "Checkbox" && <Input placeholder={answer} defaultValue={""} onChange={changeAnswer} disabled={readOnly}></Input>}
            {question.type === "Checkbox" &&
                <ul>
                    <CheckboxGroup value={checkedOptions} onChange={changeChecked} disabled={readOnly}>
                        {options.map((option, index) => <li key={index}><Checkbox value={option}>{option}</Checkbox></li>)}
                    </CheckboxGroup>
                </ul>
            }
        </VStack>
     );
}

export default QuestionAnswered;