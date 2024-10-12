import { useState } from "react";
import { HStack, Panel, Button, Input, Checkbox, CheckboxGroup } from "rsuite";

function CheckboxAnswer({editOptions}) {
    const [options, setOptions] = useState([]);
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
            <h1 className="text-center text-md">Checkbox options</h1>
            <HStack>
                <Input placeholder="Option value" value={option} onChange={(e) => { setOption(e) }} />
                <Button onClick={addOption}>Add</Button>
                <Button onClick={deleteOption}>Delete</Button>
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