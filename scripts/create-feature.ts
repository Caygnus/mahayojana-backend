import fs from 'fs';
import path from 'path';

const FEATURE_NAME = process.argv[2];

if (!FEATURE_NAME) {
    console.error('Please provide a feature name');
    console.log('Usage: npm run create-feature <feature-name>');
    process.exit(1);
}

// Convert feature name to different cases
const featureNameKebab = FEATURE_NAME.toLowerCase().replace(/\s+/g, '-');
const featureNamePascal = FEATURE_NAME.charAt(0).toUpperCase() +
    FEATURE_NAME.slice(1).toLowerCase().replace(/[-\s](\w)/g, (_, c) => c.toUpperCase());

const FEATURE_DIR = path.join(process.cwd(), 'src', 'features', featureNameKebab);

// Template for entity
const entityTemplate = `export class ${featureNamePascal} {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<${featureNamePascal}>) {
    Object.assign(this, data);
  }
}
`;

// Template for DTOs
const createDtoTemplate = `export class Create${featureNamePascal}DTO {
  constructor(data: Partial<Create${featureNamePascal}DTO>) {
    Object.assign(this, data);
  }
}
`;

const updateDtoTemplate = `export class Update${featureNamePascal}DTO {
  constructor(data: Partial<Update${featureNamePascal}DTO>) {
    Object.assign(this, data);
  }
}
`;

// Template for model
const modelTemplate = `import mongoose, { Schema } from 'mongoose';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

const ${featureNamePascal}Schema = new Schema({
  // Add your schema fields here
}, {
  timestamps: true
});

export const ${featureNamePascal}Model = mongoose.model<${featureNamePascal}>('${featureNamePascal}', ${featureNamePascal}Schema);
`;

// Template for service
const serviceTemplate = `import { ${featureNamePascal}Model } from '../models/${featureNameKebab}.model';
import { Create${featureNamePascal}DTO } from '../dtos/create-${featureNameKebab}.dto';
import { Update${featureNamePascal}DTO } from '../dtos/update-${featureNameKebab}.dto';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export class ${featureNamePascal}Service {
  async create(data: Create${featureNamePascal}DTO): Promise<${featureNamePascal}> {
    return ${featureNamePascal}Model.create(data);
  }

  async findById(id: string): Promise<${featureNamePascal} | null> {
    return ${featureNamePascal}Model.findById(id);
  }

  async update(id: string, data: Update${featureNamePascal}DTO): Promise<${featureNamePascal} | null> {
    return ${featureNamePascal}Model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await ${featureNamePascal}Model.findByIdAndDelete(id);
    return !!result;
  }

  async list(): Promise<${featureNamePascal}[]> {
    return ${featureNamePascal}Model.find();
  }
}
`;

// Template for controller
const controllerTemplate = `import { Request, Response } from 'express';
import { ${featureNamePascal}Service } from '../services/${featureNameKebab}.service';
import { Create${featureNamePascal}DTO } from '../dtos/create-${featureNameKebab}.dto';
import { Update${featureNamePascal}DTO } from '../dtos/update-${featureNameKebab}.dto';

export class ${featureNamePascal}Controller {
  private ${featureNameKebab}Service: ${featureNamePascal}Service;

  constructor() {
    this.${featureNameKebab}Service = new ${featureNamePascal}Service();
  }

  async create(req: Request, res: Response) {
    try {
      const data = new Create${featureNamePascal}DTO(req.body);
      const result = await this.${featureNameKebab}Service.create(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.${featureNameKebab}Service.findById(id);
      if (!result) {
        return res.status(404).json({ error: '${featureNamePascal} not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = new Update${featureNamePascal}DTO(req.body);
      const result = await this.${featureNameKebab}Service.update(id, data);
      if (!result) {
        return res.status(404).json({ error: '${featureNamePascal} not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.${featureNameKebab}Service.delete(id);
      if (!result) {
        return res.status(404).json({ error: '${featureNamePascal} not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const results = await this.${featureNameKebab}Service.list();
      res.json(results);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
`;

// Template for routes
const routesTemplate = `import { Router } from 'express';
import { ${featureNamePascal}Controller } from '../controllers/${featureNameKebab}.controller';

const router = Router();
const ${featureNameKebab}Controller = new ${featureNamePascal}Controller();

router.post('/', (req, res) => ${featureNameKebab}Controller.create(req, res));
router.get('/:id', (req, res) => ${featureNameKebab}Controller.findById(req, res));
router.put('/:id', (req, res) => ${featureNameKebab}Controller.update(req, res));
router.delete('/:id', (req, res) => ${featureNameKebab}Controller.delete(req, res));
router.get('/', (req, res) => ${featureNameKebab}Controller.list(req, res));

export default router;
`;

// Create directory structure
const directories = [
    'entities',
    'dtos',
    'models',
    'services',
    'controllers',
    'routes'
];

// Create directories
directories.forEach(dir => {
    const dirPath = path.join(FEATURE_DIR, dir);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
});

// Create files with templates
const files = [
    {
        path: path.join(FEATURE_DIR, 'entities', `${featureNameKebab}.entity.ts`),
        content: entityTemplate
    },
    {
        path: path.join(FEATURE_DIR, 'dtos', `create-${featureNameKebab}.dto.ts`),
        content: createDtoTemplate
    },
    {
        path: path.join(FEATURE_DIR, 'dtos', `update-${featureNameKebab}.dto.ts`),
        content: updateDtoTemplate
    },
    {
        path: path.join(FEATURE_DIR, 'models', `${featureNameKebab}.model.ts`),
        content: modelTemplate
    },
    {
        path: path.join(FEATURE_DIR, 'services', `${featureNameKebab}.service.ts`),
        content: serviceTemplate
    },
    {
        path: path.join(FEATURE_DIR, 'controllers', `${featureNameKebab}.controller.ts`),
        content: controllerTemplate
    },
    {
        path: path.join(FEATURE_DIR, 'routes', `${featureNameKebab}.routes.ts`),
        content: routesTemplate
    }
];

// Create files
files.forEach(file => {
    fs.writeFileSync(file.path, file.content);
    console.log(`Created file: ${file.path}`);
});

console.log(`\nFeature '${featureNamePascal}' created successfully!`);
console.log(`\nTo use this feature:`);
console.log(`1. Add your schema fields in: models/${featureNameKebab}.model.ts`);
console.log(`2. Add your DTO fields in: dtos/create-${featureNameKebab}.dto.ts and update-${featureNameKebab}.dto.ts`);
console.log(`3. Register routes in app.ts:`);
console.log(`   import ${featureNameKebab}Routes from './features/${featureNameKebab}/routes/${featureNameKebab}.routes';`);
console.log(`   app.use('/api/${featureNameKebab}', ${featureNameKebab}Routes);`); 