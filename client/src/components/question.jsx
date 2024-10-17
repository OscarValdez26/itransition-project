import { Divider, VStack, Text, Input, CheckboxGroup, Checkbox } from "rsuite";
import { useState } from "react";

function Question({ question, updateAnswers, index }) {
    const getOptions = () => {
        if (!question.options) return [];
        if (question.options.includes(',')) {
            return question.options.split(',');
        }
        return [question.options];
    }
    const [checkedOptions, setCheckedOptions] = useState([]);
    const [options, setOptions] = useState(getOptions);
    const changeAnswer = (e) => {
        updateAnswers(e,index);
    }
    const changeChecked = (value) => {
        console.log(value);
        setCheckedOptions(value);
        updateAnswers(value.join(","),index);
    }
    return (
        <VStack alignItems="flex-start" spacing={6}>
            <Divider />
            <Text size={'md'}>{question.title}</Text>
            <Text size={'md'}>{question.description}</Text>
            <Text size={'md'}>{question.question}</Text>
            {question.type != "Checkbox" && <Input placeholder="Answer" onChange={changeAnswer}></Input>}
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

export default Question;