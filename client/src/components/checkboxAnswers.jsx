import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HStack, Panel, Button, Input, Checkbox, CheckboxGroup } from "rsuite";

function CheckboxAnswer({stringOptions, editOptions}) {
    const { t } = useTranslation();
    const getOptions = () => {
        if(!stringOptions) return [];
        if(stringOptions.includes(',')){
            return stringOptions.split(',') ;
        }
        return [stringOptions];
    }
    const [options, setOptions] = useState(getOptions);
    const [option, setOption] = useState("");
    const [checkedOptions,setCheckedOptions] = useState([]);
    const addOption = () => {
        const newOptions = [...options, option];
        setOptions(newOptions);
        setOption("");
        editOptions(newOptions.join(','));
    }
    const deleteOption = () => {
        const filteredOptions = options.filter((option,index) => !checkedOptions.includes(index));
        setOptions(filteredOptions);
        setCheckedOptions([]);
    }
    return (
        <Panel>
            <h1 className="text-center text-md">{t('Options')}</h1>
            <HStack>
                <Input placeholder="Option value" value={option} onChange={(e) => { setOption(e) }} />
                <Button onClick={addOption}>{t('Add')}</Button>
                <Button onClick={deleteOption}>{t('Delete')}</Button>
            </HStack>
            <ul>
                <CheckboxGroup value={checkedOptions} onChange={value => setCheckedOptions(value)}>
                {options.map((option,index) => <li key={index}><Checkbox value={index}>{option}</Checkbox></li>)}  
                </CheckboxGroup>                  
            </ul>
        </Panel>
    );
}

export default CheckboxAnswer;