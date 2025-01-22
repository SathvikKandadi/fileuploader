import express from 'express';
import {deleteFile, downloadFile, listFiles, shareFile, uploadFile, uploadFileWithEncryption, viewFile } from '../controllers/fileController';
import multer from 'multer';
import { login, register } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage:storage});


router.post("/auth/login",login);
router.post("/auth/signup",register);


router.post("/files/upload" ,upload.single('file'),uploadFileWithEncryption);
router.post("/files/:fileId/download",downloadFile);
router.delete("/files/:fileId",deleteFile);
router.post("/files", listFiles);
router.post("/files/:fileId/share",shareFile);


router.post("/view",viewFile);
// router.post("/upload" ,upload.single('file'),uploadFile);

export default router;