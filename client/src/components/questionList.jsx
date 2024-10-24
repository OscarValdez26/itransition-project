import { useContext, useEffect, useState } from 'react';
import Sortable from 'sortablejs';
import { AppContext } from '../context/Provider.jsx';
import EditableQuestion from './editableQuestion.jsx';

const QuestionsList = ({ onEdit, onDelete, }) => {
    const { questions, setQuestions, setPage, setReorder } = useContext(AppContext);
    const [questionExpanded,setQuestionExpanded] = useState(false);
    const [expandedArray,setExpandedArray] = useState(Array(questions.length).fill(false));
    const changeExpandedArray = (expanded,indexQuestion) => {
        const newExpandedArray = expandedArray.map((question,index) => index === indexQuestion ? expanded:question);
        setExpandedArray(newExpandedArray);
        setQuestionExpanded(newExpandedArray.some(value => value === true));
    }
    useEffect(() => {
        const element = document.getElementById("questionsList");
        const sortable = Sortable.create(element, {
            animation:150,
            disabled:questionExpanded,
            onEnd: (evt) => {
                const changeQuestions = [...questions];
                const [movedItem] = changeQuestions.splice(evt.oldIndex, 1);
                changeQuestions.splice(evt.newIndex, 0, movedItem);
                const sortedQuestions = changeQuestions.map((question, index) => ({
                    ...question,
                    position: index,
                }));
                setQuestions(sortedQuestions);
                setReorder(true);
                setPage("");
            },
        });
        return () => {
            sortable.destroy();
        };
    });
    return (
            <ul id="questionsList" >
            {questions.map((question, index) => (
                <li key={index}>
                    <EditableQuestion questionData={question} onEdit={onEdit} onDelete={onDelete} changeExpandedArray={changeExpandedArray} index={index}/>
                </li>
            ))}
            </ul>
    );
};

export default QuestionsList;
