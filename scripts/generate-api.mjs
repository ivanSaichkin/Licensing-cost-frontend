import { resolve } from 'node:path';
import { generateApi } from 'swagger-typescript-api';

await generateApi({
  name: 'Api.ts',
  output: resolve(process.cwd(), 'src/shared/api/generated'),
  input: resolve(process.cwd(), '../Licensing-cost-backend/docs/swagger.json'),
  httpClientType: 'axios',
  typeOnlyImports: true,
  cleanOutput: true,
});
