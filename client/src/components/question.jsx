import { Divider, VStack, Text, Input, CheckboxGroup, Checkbox } from "rsuite";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Question({ question, updateAnswers, index, onlyRead }) {
    const { t } = useTranslation();
    const getOptions = () => {
        if (!question.options) return [];
        if (question.options.includes(',')) {
            return question.options.split(',');
        }
        return [question.options];
    }
    const getShow = () => {
        if(!onlyRead) return true;
        if(onlyRead && question.visibility) return true;
        return false; 
    }
    const [checkedOptions, setCheckedOptions] = useState([]);
    const [options, setOptions] = useState(getOptions);
    const [show, setShow] = useState(getShow);
    const changeAnswer = (e) => {
        updateAnswers(e,index);
    }
    const changeChecked = (value) => {
        setCheckedOptions(value);
        updateAnswers(value.join(","),index);
    }
    return (
        <div>
            {show && <VStack alignItems="flex-start" spacing={6}>
            <Divider />
            <Text size={'md'}>{question.title}</Text>
            <Text size={'md'}>{question.description}</Text>
            <Text size={'md'}>{question.question}</Text>
            {question.type != "Checkbox" && <Input placeholder={t("Answer")} onChange={changeAnswer} disabled={onlyRead}></Input>}
            {question.type === "Checkbox" &&
                <ul>
                    <CheckboxGroup value={checkedOptions} onChange={changeChecked} disabled={onlyRead}>
                        {options.map((option, index) => <li key={index}><Checkbox value={option}>{option}</Checkbox></li>)}
                    </CheckboxGroup>
                </ul>
            }
        </VStack>}
        </div>   
    );
}

export default Question;