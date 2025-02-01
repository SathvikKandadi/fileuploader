import { Request, Response } from "express";
import { deleteFileService, downloadFileService, listFilesService, shareFileService, uploadFileService,  viewFileService } from '../services/fileService';
import { DNAEncryption } from "../services/encryptionService";
import dotenv from 'dotenv';
import { prisma } from "../services/authService";


dotenv.config();

const secretKey = process.env.ENCRYPTION_KEY as string;
const dnaService = new DNAEncryption(secretKey);

// interface FileUploadRequest extends Request {
//     file: Express.Multer.File;
//     user: { id: string }; // Assuming you have user data from auth middleware
//   }
  
//   interface AuthenticatedRequest extends Request {
//     user: { id: string };
//   }

export const listFiles = async (req: Request, res: Response) => {
    try {
    //   const userId = req.user.id;
      const userId = req.body.userId;
      const files = await listFilesService(userId);
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };


  export const viewFile = async (req: Request, res: Response) : Promise<any> => {
    const fileId = req.params.fileId;
    try {
      const file = await prisma.file.findUnique({
        where: { id: fileId, ownerId: req.body.userId }
      });
      
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      const preSignedURL = await viewFileService(file.key);
      res.status(200).json({ preSignedURL });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

export const uploadFile = async (req: Request, res: Response) => {
    console.log(req.file);
    const filename = req.file.originalname;
    const contentType = req.file.mimetype;
    const fileBuffer = req.file.buffer;
    console.log(fileBuffer);

    try {
        const preSignedURL = await uploadFileService(filename, fileBuffer, contentType);
        res.status(200).json({ preSignedURL });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const uploadFileWithEncryption = async (req: Request, res: Response) : Promise<any> => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const { originalname: filename, mimetype: contentType, buffer: fileBuffer, size } = req.file;
    try {
      // Upload to S3 and get the key
    //   const key = `${req.body.userId}/${Date.now()}-${filename}`;
      const key = `${req.body.userId}/${Date.now()}`;
      const encryptedData = (await dnaService.encrypt(fileBuffer)).encryptedData;
      
    //   await uploadFileService(key, fileBuffer, contentType);
      await uploadFileService(key, encryptedData, contentType);
  
      // Create database record
      const file = await prisma.file.create({
        data: {
          name: filename,
          type: contentType,
          size: size,
          key: key,
          ownerId: req.body.userId, // req.user.id before 
          encryptionIV: (await dnaService.encrypt(fileBuffer)).iv // Store IV for later decryption
        }
      });
    //   return res.status(200).json({});
      res.status(200).json(file);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };


  export const downloadFile = async (req: Request, res: Response) : Promise<any> => {
    const fileId = req.params.fileId;
    console.log("fieldId: " , fileId);
    try {
      // Check file access
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
          OR: [
            { ownerId: req.body.userId },
            {
              sharedWith: {
                some: {
                  sharedWithId: req.body.userId // req.user.id
                }
              }
            }
          ]
        }
      });
  
      if (!file) {
        return res.status(404).json({ message: 'File not found or access denied' });
      }
    //   const key = `${req.body.userId}/${file.key}`;
      const encryptedData = await downloadFileService(file.key);
      const decryptedData = await dnaService.decrypt(encryptedData);
    //   const decryptedData = await dnaService.decrypt(encryptedData, file.encryptionIV);
      
      // Set appropriate headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.setHeader('Content-Type', file.type);
      res.send(decryptedData);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  export const deleteFile = async (req: Request, res: Response) : Promise<any> => {
    const fileId = req.params.fileId;
    const userId = req.body.userId;

    try {
      // First check if the file exists and get owner information
      const file = await prisma.file.findUnique({
        where: { id: fileId },
        include: { 
          owner: true,
          sharedWith: true // Include shared access records
        }
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Check if the user is the owner
      if (file.ownerId !== userId) {
        return res.status(403).json({ message: 'You do not have permission to delete this file' });
      }

      // First delete all FileAccess records
      await prisma.fileAccess.deleteMany({
        where: { fileId: file.id }
      });

      // Delete from S3
      await deleteFileService(file.key);

      // Finally delete the file record
      await prisma.file.delete({
        where: { id: fileId }
      });

      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: (error as Error).message });
    }
  };

  export const shareFile = async (req: Request, res: Response) : Promise<any> => {
    const fileId = req.params.fileId;
    const { email, accessType } = req.body;
  
    try {
      // Find the user to share with
      const shareWithUser = await prisma.user.findUnique({
        where: { email }
      });
  
      if (!shareWithUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if file exists and user owns it
      const file = await prisma.file.findUnique({
        where: { id: fileId, ownerId: req.body.userId }
      });
  
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      // Create file access record
      await shareFileService(fileId, req.body.userId, shareWithUser.id, accessType);
  
      res.status(200).json({ message: 'File shared successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
// export const uploadFileWithEncryption = async (req: Request, res: Response) => {
//     const filename = req.file.originalname;
//     const contentType = req.file.mimetype;
//     const fileBuffer = req.file.buffer;
//     const encryptedData = (await dnaService.encrypt(fileBuffer)).encryptedData;
//     try {
//         await uploadFileService(filename, encryptedData, contentType);
//         res.status(200).json({ message : "File uploaded successfully" });
//     } catch (error) {
//         res.status(500).json({ message: (error as Error).message });
//     }
// };

// export const downloadFile = async (req: Request, res: Response) => {
//     const {filename} = req.body;
//     try{
//         const encryptedData = await downloadFileService(filename);
//         const decryptedData = await dnaService.decrypt(encryptedData)
//         // console.log(`File: ${file}`);
        
//         res.json({});
//         // res.status(200).json({preSignedURL});
//     }
//     catch (error) {
//         res.status(500).json({ message: (error as Error).message });
//     }
// }


