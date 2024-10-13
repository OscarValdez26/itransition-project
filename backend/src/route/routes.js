import { Router } from "express";
import { registerUser,loginUser, logoutUser,getPopularTemplates, newTemplate, getAllTemplates, getTemplate, getUserTemplates, updateTemplate, deleteTemplate } from "../controller/controller.js";
import { authRequired, loginSchema, registerSchema, validateSchema } from '../middlewares/validator.js'

const router = Router();

router.get('/',getPopularTemplates);
router.get('/logout',logoutUser);
router.get('/getAllTemplates',authRequired,getAllTemplates);
router.post('/register',validateSchema(registerSchema),registerUser);
router.post('/login',validateSchema(loginSchema),loginUser);
router.post('/newTemplate',authRequired,newTemplate);
router.post('/getTemplate',authRequired,getTemplate);
router.post('/updateTemplate',authRequired,updateTemplate);
router.post('/deleteTemplate',authRequired,deleteTemplate);
router.post('/getUserTemplates',authRequired,getUserTemplates);

export default router;