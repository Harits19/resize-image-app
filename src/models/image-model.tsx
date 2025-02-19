export class ImageModel {
  url: string;
  file: File;

  constructor(file: File) {

    this.file = file;
    this.url = URL.createObjectURL(file);
  }
}