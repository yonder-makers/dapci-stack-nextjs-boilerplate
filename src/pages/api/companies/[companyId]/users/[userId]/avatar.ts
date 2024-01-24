import { Files, IncomingForm } from 'formidable';
import { promises as fsPromises } from 'fs';

import { withApiAuth } from '@/lib/hocs';
import { NextApiRequest } from 'next';
import { CompanyUser } from '@/lib/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

type ParsedData = {
  fields: { [fieldName: string]: string | string[] | undefined };
  files: Files<string>;
};

async function parseMultipartBody(req: NextApiRequest): Promise<ParsedData> {
  return await new Promise<ParsedData>((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: './_temp-upload',
      keepExtensions: true,
      maxTotalFileSize: 4 * 1024 * 1024, // 4MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default withApiAuth<undefined, any>(
  'USER',
  async (user, body, req, res) => {
    const companyId = req.query.companyId as string;
    const userId = req.query.userId as string;

    if (user.id !== userId || (user as CompanyUser).companyId !== companyId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    if (req.method === 'DELETE') {
      // delete file
      await fsPromises.rm(`./public/avatars/${userId}.jpg`);
      res.status(200).json({ message: 'File deleted successfully' });
    } else if (req.method === 'POST') {
      const data = await parseMultipartBody(req);

      const files = data.files.file;
      if (!files) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const file = files[0];
      const oldPath = file.filepath;
      const newPath = `./public/avatars/${userId}.jpg`;

      await fsPromises.cp(oldPath, newPath);
      await fsPromises.rm(oldPath);

      res.status(200).json({ message: 'File uploaded successfully' });
    } else {
      res.status(405).send('Method Not Allowed');
    }
  },
);
