import QuestionsList from '../components/questionList.jsx';

function Home() {
  const questions = [
    '¿Cuál es tu color favorito?',
    '¿Cuál es tu comida favorita?',
    '¿Dónde te gustaría viajar?',
  ];

  return (
    <div>
      <h1>Lista de Preguntas</h1>
      <QuestionsList questions={questions} />
    </div>
  );
}

export default Home;