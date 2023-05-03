import imageCompression, { Options as CompressionOptions } from "browser-image-compression";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getRecoil } from "recoil-nexus";
import { v4 as uuid } from "uuid";

import { authStore } from "../stores/auth";
import { ImageField } from "../types/recipes";

import { app } from "./firebase";

const BANNER_COMPRESSION: CompressionOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const ICON_COMPRESSION: CompressionOptions = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 50,
  useWebWorker: true,
};

function getFileRef(fileName: string) {
  const { user } = getRecoil(authStore);

  if (!user) throw "User is not logged in";

  return ref(getStorage(app), `${user.uid}/${fileName}`);
}

async function uploadImageInternal(imgFile: File, compressionOptions: CompressionOptions): Promise<ImageField> {
  const id = uuid();
  const ref = getFileRef(id);

  const compressedFile = await imageCompression(imgFile, compressionOptions);

  await uploadBytes(ref, compressedFile);

  return {
    imageId: uuid(), imageUrl: await getDownloadURL(ref)
  };
}

export function uploadBannerImage(imgFile: File): Promise<ImageField> {
  return uploadImageInternal(imgFile, BANNER_COMPRESSION);
}

export function uploadIconImage(imgFile: File): Promise<ImageField> {
  return uploadImageInternal(imgFile, ICON_COMPRESSION);
}

export function deleteImage(imageId: string) {
  const ref = getFileRef(imageId);
  return deleteObject(ref);
}