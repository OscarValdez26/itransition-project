import { Router } from "express";
import multer from "multer";
import path from "path";
import { registerUser,loginUser, logoutUser,getPopularTemplates, newTemplate, getAllTemplates, getTemplate, getUserTemplates, updateTemplate, deleteTemplate, newForm, getForms, getAllUsers, updateForm, getLatestTemplates, getTopics, getUserForms, getTags, uploadImage } from "../controller/controller.js";
import { authRequired, loginSchema, registerSchema, validateSchema } from '../middlewares/validator.js'

const router = Router();

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/popular',getPopularTemplates);
router.get('/latest',getLatestTemplates);
router.get('/logout',logoutUser);
router.get('/topics',getTopics);
router.get('/tags',getTags);
router.post('/getAllUsers',authRequired,getAllUsers); 
router.post('/getAllTemplates',authRequired,getAllTemplates);
router.post('/register',validateSchema(registerSchema),registerUser);
router.post('/login',validateSchema(loginSchema),loginUser);
router.post('/getUserTemplates',authRequired,getUserTemplates);
router.post('/newTemplate',authRequired,newTemplate);
router.post('/getTemplate',getTemplate);
router.post('/updateTemplate',authRequired,updateTemplate);
router.post('/deleteTemplate',authRequired,deleteTemplate);
router.post('/newForm',authRequired,newForm);
router.post('/getForms',authRequired,getForms);
router.post('/getUserForms',authRequired,getUserForms);
router.post('/updateForm',authRequired,updateForm);
router.post('/upload',authRequired, upload.single('image'), uploadImage);

export default router;