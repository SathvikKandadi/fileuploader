import { Buffer } from 'buffer';
import { deleteFile, downloadFile, getObjectURL, uploadFile } from '../utils/s3';
import { prisma } from './authService';
import { AccessType } from '@prisma/client';

export const listFilesService = async (userId: string) => {
    try {
      const files = await prisma.file.findMany({
        where: {
          OR: [
            { ownerId: userId },
            {
              sharedWith: {
                some: {
                  sharedWithId: userId
                }
              }
            }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return files;
    } catch (error) {
      throw new Error(`Failed to list files: ${(error as Error).message}`);
    }
  };

export const viewFileService = async (filename:string) => {
    try
    {
        const preSignedURL = await getObjectURL(filename);
        return preSignedURL;
    }
    catch(error)
    {
        throw new Error(`Failed to view file: : ${(error as Error).message}`);
    }
}

export const uploadFileService = async (filename: string, fileBuffer: Buffer, contentType: string)  => {
    try {
        const res = await uploadFile(fileBuffer,filename,contentType);
        return res;
    } catch (error) {
        throw new Error(`File upload failed: ${(error as Error).message}`);
    }
};

export const downloadFileService = async (filename:string) => {
    try{
        const res = await downloadFile(filename);
        return res;
    }catch (error) {
        throw new Error(`File download failed: ${(error as Error).message}`);
    }
}

export const deleteFileService = async (key: string) => {
    try {
      await deleteFile(key);
    } catch (error) {
      throw new Error(`File deletion failed: ${(error as Error).message}`);
    }
  };

  export const shareFileService = async (
    fileId: string,
    sharedById: string,
    sharedWithId: string,
    accessType: AccessType
  ) => {
    try {
      return await prisma.fileAccess.create({
        data: {
          fileId,
          sharedById,
          sharedWithId,
          accessType
        }
      });
    } catch (error) {
      throw new Error(`File sharing failed: ${(error as Error).message}`);
    }
  };
