import { Modal, Button } from "rsuite";
import { postRequest } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/Provider.jsx";
import { useTranslation } from "react-i18next";

function ModalDelete({template, openModal, setOpenModal}) {
    const { user, setUserTemplates} = useContext(AppContext);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const deleteTemplate = async () => {
        setOpenModal(false);
        const result = await postRequest('/deleteTemplate', { "id": template.id });
        if (result === "OK") {
            alert(t('Template_deleted'));
            navigate('/profile');
            const result = await postRequest('/getUserTemplates',{id:user.id});
            setUserTemplates(result);
        }
    }
    return ( 
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                    <Modal.Title>{t('ALERT')}!!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{t('Deleting_template')}</p>
                    <p>{t('Are_sure')}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deleteTemplate} appearance="primary" color="red">
                        {t('Delete')}
                    </Button>
                    <Button onClick={() => setOpenModal(false)} appearance="primary">
                        {t('Cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>
     );
}

export default ModalDelete;