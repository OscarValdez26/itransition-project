import { Divider, VStack, Text, Input, CheckboxGroup, Checkbox } from "rsuite";
import { useEffect, useState } from "react";

function QuestionAnswered({ question, updateAnswers, answers }) {
    const stringToArray = (stringArray) => {
            if (!stringArray) return [];
            if (stringArray.includes(',')) {
                return stringArray.split(',');
            }
            return [stringArray];
        }
        useEffect(()=>{
            // const getAnswer = () => {
                const filteredAnswer = answers.find(answer => answer.question === question.id);
                if(filteredAnswer){
                    console.log(filteredAnswer);
                    setAnswer(filteredAnswer);
                    setPlaceholder(filteredAnswer.value);
                    if(question.type === "Checkbox"){
                        const splitedAnswer = stringToArray(filteredAnswer.value);
                        setOptions(splitedAnswer);
                    } 
                }    
            // }
        },[answers]);
    const [checkedOptions, setCheckedOptions] = useState();
    const [answer,setAnswer] = useState();
    const [placeholder,setPlaceholder] = useState();
    const [options, setOptions] = useState(stringToArray(question.options));
    const changeAnswer = (e) => {
        updateAnswers(e,question.id);
    }
    const changeChecked = (value) => {
        console.log(value);
        setCheckedOptions(value);
        updateAnswers(value.join(","),question.id);
    }
    return ( 
        <VStack alignItems="flex-start" spacing={6}>
            <Divider />
            <Text size={'md'}>{question.title}</Text>
            <Text size={'md'}>{question.description}</Text>
            <Text size={'md'}>{question.question}</Text>
            {question.type != "Checkbox" && <Input value={placeholder} onChange={changeAnswer}></Input>}
            {question.type === "Checkbox" &&
                <ul>
                    <CheckboxGroup value={checkedOptions} onChange={changeChecked}>
                        {options.map((option, index) => <li key={index}><Checkbox value={option}>{option}</Checkbox></li>)}
                    </CheckboxGroup>
                </ul>
            }
        </VStack>
     );
}

export default QuestionAnswered;