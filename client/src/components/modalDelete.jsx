import { Modal, Button } from "rsuite";
import { postRequest } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/Provider.jsx";

function ModalDelete({template, openModal, setOpenModal}) {
    const { user, setUserTemplates} = useContext(AppContext);
    const navigate = useNavigate();

    const deleteTemplate = async () => {
        setOpenModal(false);
        const result = await postRequest('/deleteTemplate', { "id": template.id });
        if (result === "OK") {
            alert("Template deleted");
            navigate('/profile');
            const result = await postRequest('/getUserTemplates',{id:user.id});
            setUserTemplates(result);
        }
    }
    return ( 
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                    <Modal.Title>ALERT!!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You are deleting the current template</p>
                    <p>Are you sure?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deleteTemplate} appearance="primary" color="red">
                        Delete
                    </Button>
                    <Button onClick={() => setOpenModal(false)} appearance="primary">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
     );
}

export default ModalDelete;