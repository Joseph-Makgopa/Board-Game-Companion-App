import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, StreamableFile, Query } from '@nestjs/common';
import { ScriptEditorService } from '../../services/editor/script-editor.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Metadata } from '../../schemas/Metadata';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
// import { createReadStream } from 'fs';
// import { join } from 'path';
const storage = {
  storage: diskStorage({
      destination:"./uploads/scripts",
        filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`)
      }
    })
  }
@Controller('script-editor')
export class ScriptEditorController {
  constructor(private readonly scriptEditorService: ScriptEditorService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('script',storage))
  async UploadScript(@Body('author') author: string, @Body('downloads') downloads: number, @Body('ratings') ratings: number,@UploadedFile() script){
    const metadata: Metadata = {
      author: author,
      downloads: downloads,
      ratings: ratings,
      filename: script.filename
    };
    console.log(script.filename);
    return {message: await this.scriptEditorService.saveFile(metadata)};
  }

  @Get('update')
  async getFile(@Query('author') author: string) : Promise<StreamableFile>
  {
    return (await this.scriptEditorService.FileUpdate(author));
  }
}

