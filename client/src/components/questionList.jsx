import { useContext, useEffect } from 'react';
import Sortable from 'sortablejs';
import Question from './question.jsx';
import { AppContext } from '../context/Provider.jsx';

const QuestionsList = ({ onEdit, onDelete, }) => {
    const { questions, setQuestions, setPage, setReorder } = useContext(AppContext);
    useEffect(() => {
        const element = document.getElementById("questionsList");
        const sortable = Sortable.create(element, {
            animation:150,        
            onEnd: (evt) => {
                console.log(questions);
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
            onStart: () => {
                console.log(questions);
            }
        });
        return () => {
            sortable.destroy();
        };
    },[]);
    return (
            <ul id="questionsList" >
            {questions.map((question, index) => (
                <li key={index}>
                    <Question questionData={question} onEdit={onEdit} onDelete={onDelete}/>
                </li>
            ))}
            </ul>
    );
};

export default QuestionsList;
