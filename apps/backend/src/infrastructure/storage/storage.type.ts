export interface StorageProvider {
  upload(
    file: Express.Multer.File,
    path: string,
  ): Promise<{ path: string; url: string }>;

  delete(path: string): Promise<void>;
}
