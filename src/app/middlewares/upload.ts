import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { TCloudinaryResponse, TFile } from "../types";
import fs from "fs";
import { local_config } from "../config";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: local_config.cloudinary_cloud_name,
  api_key: local_config.cloudinary_api_key,
  api_secret: local_config.cloudinary_api_secret,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

export const multer_up = multer({ storage: storage });

export const cloudinary_uploader = async (
  file: TFile | undefined
): Promise<TCloudinaryResponse | undefined> => {
  if (file === undefined) return;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error: Error, result: TCloudinaryResponse) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
