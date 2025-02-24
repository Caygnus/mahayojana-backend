import fs from 'fs';
import path from 'path';

const FEATURE_NAME = process.argv[2];

// Get version from command line args or default to 1
const VERSION = process.argv[3] ? parseInt(process.argv[3].replace('v', '')) : 1;
const VERSION_PREFIX = `v${VERSION}`;

if (!FEATURE_NAME) {
  console.error('Please provide a feature name');
  console.log('Usage: npm run create-feature <feature-name> [version]');
  console.log('Example: npm run create-feature user v2');
  process.exit(1);
}

// Convert feature name to different cases
const featureNameKebab = FEATURE_NAME.toLowerCase().replace(/\s+/g, '-');
const featureNamePascal = FEATURE_NAME.charAt(0).toUpperCase() +
  FEATURE_NAME.slice(1).toLowerCase().replace(/[-\s](\w)/g, (_, c) => c.toUpperCase());
const featureNameCamel = featureNamePascal.charAt(0).toLowerCase() + featureNamePascal.slice(1);

const FEATURE_DIR = path.join(process.cwd(), 'src', 'features', featureNameKebab);

// Template for base repository interface
const baseRepoInterfaceTemplate = `export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  findMany(filter: Partial<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  exists(filter: Partial<T>): Promise<boolean>;
}`;

// Template for entity
const entityTemplate = `export class ${featureNamePascal} {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<${featureNamePascal}>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}`;

// Template for repository interface
const repoInterfaceTemplate = `import { IBaseRepository } from '../../../core/interfaces/base.repository.interface';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export interface I${featureNamePascal}Repository extends IBaseRepository<${featureNamePascal}> {
  // Add custom repository methods here
}`;

// Template for repository implementation
const repoImplementationTemplate = `import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';
import { ${featureNamePascal}Model, I${featureNamePascal}Document } from '../models/${featureNameKebab}.model';
import { I${featureNamePascal}Repository } from '../interfaces/i-${featureNameKebab}.repository';
import { ${featureNamePascal}Mapper } from '../mappers/${featureNameKebab}.mapper';
import { FilterQuery } from 'mongoose';

export class ${featureNamePascal}Repository implements I${featureNamePascal}Repository {
  async create(data: Partial<${featureNamePascal}>): Promise<${featureNamePascal}> {
    const modelData = ${featureNamePascal}Mapper.toModel(data);
    const created = await ${featureNamePascal}Model.create(modelData);
    return ${featureNamePascal}Mapper.toEntity(created);
  }

  async findById(id: string): Promise<${featureNamePascal} | null> {
    const found = await ${featureNamePascal}Model.findById(id);
    return found ? ${featureNamePascal}Mapper.toEntity(found) : null;
  }

  async findOne(filter: Partial<${featureNamePascal}>): Promise<${featureNamePascal} | null> {
    const modelFilter = ${featureNamePascal}Mapper.toModel(filter) as FilterQuery<I${featureNamePascal}Document>;
    const found = await ${featureNamePascal}Model.findOne(modelFilter);
    return found ? ${featureNamePascal}Mapper.toEntity(found) : null;
  }

  async findMany(filter: Partial<${featureNamePascal}>): Promise<${featureNamePascal}[]> {
    const modelFilter = ${featureNamePascal}Mapper.toModel(filter) as FilterQuery<I${featureNamePascal}Document>;
    const found = await ${featureNamePascal}Model.find(modelFilter);
    return ${featureNamePascal}Mapper.toEntities(found);
  }

  async update(id: string, data: Partial<${featureNamePascal}>): Promise<${featureNamePascal} | null> {
    const modelData = ${featureNamePascal}Mapper.toModel(data);
    const updated = await ${featureNamePascal}Model.findByIdAndUpdate(id, modelData, { new: true });
    return updated ? ${featureNamePascal}Mapper.toEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ${featureNamePascal}Model.findByIdAndDelete(id);
    return !!result;
  }

  async exists(filter: Partial<${featureNamePascal}>): Promise<boolean> {
    const modelFilter = ${featureNamePascal}Mapper.toModel(filter) as FilterQuery<I${featureNamePascal}Document>;
    const result = await ${featureNamePascal}Model.exists(modelFilter);
    return !!result;
  }
}`;

// Template for mapper
const mapperTemplate = `import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';
import { I${featureNamePascal}Document } from '../models/${featureNameKebab}.model';

export class ${featureNamePascal}Mapper {
  static toEntity(doc: I${featureNamePascal}Document): ${featureNamePascal} {
    return new ${featureNamePascal}({
      id: doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // Add other fields here
    });
  }

  static toModel(entity: Partial<${featureNamePascal}>): Partial<I${featureNamePascal}Document> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: I${featureNamePascal}Document[]): ${featureNamePascal}[] {
    return docs.map(doc => this.toEntity(doc));
  }

  static toModels(entities: Partial<${featureNamePascal}>[]): Partial<I${featureNamePascal}Document>[] {
    return entities.map(entity => this.toModel(entity));
  }
}`;

// Template for validation schemas
const validationTemplate = `import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';

export class ${featureNamePascal}Validation {
  static create = Joi.object({
    // Add validation for create fields
  });

  static update = Joi.object({
    // Add validation for update fields
  });

  static id = Joi.object({
    id: JoiObjectId().required(),
  });

  static auth = Joi.object({
    authorization: JoiAuthBearer().required(),
  });

  static query = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    // Add other query params
  });
}`;

// Template for DTOs
const createDtoTemplate = `import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export class Create${featureNamePascal}DTO implements Partial<${featureNamePascal}> {
  // Add your DTO properties here

  constructor(data: Partial<Create${featureNamePascal}DTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation logic here
  }
}`;

const updateDtoTemplate = `import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export class Update${featureNamePascal}DTO implements Partial<${featureNamePascal}> {
  // Add your DTO properties here

  constructor(data: Partial<Update${featureNamePascal}DTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation logic here
  }
}`;

// Template for model
const modelTemplate = `import mongoose, { Schema, Document } from 'mongoose';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export interface I${featureNamePascal}Document extends Omit<${featureNamePascal}, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const ${featureNamePascal}Schema = new Schema({
  // Add your schema fields here
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const ${featureNamePascal}Model = mongoose.model<I${featureNamePascal}Document>('${featureNamePascal}', ${featureNamePascal}Schema);`;

// Template for service interface
const serviceInterfaceTemplate = `import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';
import { Create${featureNamePascal}DTO } from '../dtos/create-${featureNameKebab}.dto';
import { Update${featureNamePascal}DTO } from '../dtos/update-${featureNameKebab}.dto';

export interface I${featureNamePascal}Service {
  create(data: Create${featureNamePascal}DTO): Promise<${featureNamePascal}>;
  findById(id: string): Promise<${featureNamePascal} | null>;
  update(id: string, data: Update${featureNamePascal}DTO): Promise<${featureNamePascal} | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: Partial<${featureNamePascal}>): Promise<${featureNamePascal}[]>;
}`;

// Template for service
const serviceTemplate = `import { I${featureNamePascal}Service } from '../interfaces/i-${featureNameKebab}.service';
import { I${featureNamePascal}Repository } from '../interfaces/i-${featureNameKebab}.repository';
import { ${featureNamePascal}Repository } from '../repositories/${featureNameKebab}.repository';
import { Create${featureNamePascal}DTO } from '../dtos/create-${featureNameKebab}.dto';
import { Update${featureNamePascal}DTO } from '../dtos/update-${featureNameKebab}.dto';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export class ${featureNamePascal}Service implements I${featureNamePascal}Service {
  private repository: I${featureNamePascal}Repository;

  constructor() {
    this.repository = new ${featureNamePascal}Repository();
  }

  async create(data: Create${featureNamePascal}DTO): Promise<${featureNamePascal}> {
    data.validate();
    return this.repository.create(data);
  }

  async findById(id: string): Promise<${featureNamePascal} | null> {
    return this.repository.findById(id);
  }

  async update(id: string, data: Update${featureNamePascal}DTO): Promise<${featureNamePascal} | null> {
    data.validate();
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async list(filter?: Partial<${featureNamePascal}>): Promise<${featureNamePascal}[]> {
    return this.repository.findMany(filter || {});
  }
}`;

// Template for controller
const controllerTemplate = `import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { ${featureNamePascal}Service } from '../services/${featureNameKebab}.service';
import { Create${featureNamePascal}DTO } from '../dtos/create-${featureNameKebab}.dto';
import { Update${featureNamePascal}DTO } from '../dtos/update-${featureNameKebab}.dto';
import { ${featureNamePascal}Validation } from '../validations/${featureNameKebab}.validation';

export class ${featureNamePascal}Controller {
  private service: ${featureNamePascal}Service;

  constructor() {
    this.service = new ${featureNamePascal}Service();
  }

  create = [
    validator(${featureNamePascal}Validation.auth, ValidationSource.HEADER),
    validator(${featureNamePascal}Validation.create),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new Create${featureNamePascal}DTO(req.body);
      const result = await this.service.create(data);
      res.status(201).json(result);
    })
  ];

  findById = [
    validator(${featureNamePascal}Validation.auth, ValidationSource.HEADER),
    validator(${featureNamePascal}Validation.id, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.service.findById(id);
      if (!result) {
        return res.status(404).json({ error: '${featureNamePascal} not found' });
      }
      res.json(result);
    })
  ];

  update = [
    validator(${featureNamePascal}Validation.auth, ValidationSource.HEADER),
    validator(${featureNamePascal}Validation.id, ValidationSource.PARAM),
    validator(${featureNamePascal}Validation.update),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = new Update${featureNamePascal}DTO(req.body);
      const result = await this.service.update(id, data);
      if (!result) {
        return res.status(404).json({ error: '${featureNamePascal} not found' });
      }
      res.json(result);
    })
  ];

  delete = [
    validator(${featureNamePascal}Validation.auth, ValidationSource.HEADER),
    validator(${featureNamePascal}Validation.id, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await this.service.delete(id);
      if (!result) {
        return res.status(404).json({ error: '${featureNamePascal} not found' });
      }
      res.status(204).send();
    })
  ];

  list = [
    validator(${featureNamePascal}Validation.auth, ValidationSource.HEADER),
    validator(${featureNamePascal}Validation.query, ValidationSource.QUERY),
    asyncHandler(async (req: Request, res: Response) => {
      const filter = req.query;
      const results = await this.service.list(filter);
      res.json(results);
    })
  ];
}`;

// Template for routes
const routesTemplate = `import { Router } from 'express';
import { ${featureNamePascal}Controller } from '../controllers/${featureNameKebab}.controller';

const router = Router();
const controller = new ${featureNamePascal}Controller();

router.post('/', controller.create);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/', controller.list);

export default router;`;

// Create directory structure
const directories = [
  'entities',
  'dtos',
  'models',
  'services',
  'controllers',
  'routes',
  'interfaces',
  'repositories',
  'mappers',
  'validations'
];

// Create directories
directories.forEach(dir => {
  const dirPath = path.join(FEATURE_DIR, dir);
  fs.mkdirSync(dirPath, { recursive: true });
  console.log(`Created directory: ${dirPath}`);
});

// Ensure base repository interface exists
const baseRepoDir = path.join(process.cwd(), 'src', 'core', 'interfaces');
const baseRepoPath = path.join(baseRepoDir, 'base.repository.interface.ts');
if (!fs.existsSync(baseRepoPath)) {
  fs.mkdirSync(baseRepoDir, { recursive: true });
  fs.writeFileSync(baseRepoPath, baseRepoInterfaceTemplate);
  console.log('Created base repository interface');
}

// Create files with templates
const files = [
  {
    path: path.join(FEATURE_DIR, 'entities', `${featureNameKebab}.entity.ts`),
    content: entityTemplate
  },
  {
    path: path.join(FEATURE_DIR, 'interfaces', `i-${featureNameKebab}.repository.ts`),
    content: repoInterfaceTemplate
  },
  {
    path: path.join(FEATURE_DIR, 'interfaces', `i-${featureNameKebab}.service.ts`),
    content: serviceInterfaceTemplate
  },
  {
    path: path.join(FEATURE_DIR, 'repositories', `${featureNameKebab}.repository.ts`),
    content: repoImplementationTemplate
  },
  {
    path: path.join(FEATURE_DIR, 'mappers', `${featureNameKebab}.mapper.ts`),
    content: mapperTemplate
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
  },
  {
    path: path.join(FEATURE_DIR, 'validations', `${featureNameKebab}.validation.ts`),
    content: validationTemplate
  }
];

// Create files
files.forEach(file => {
  fs.writeFileSync(file.path, file.content);
  console.log(`Created file: ${file.path}`);
});

// Update main routes file with versioning
const updateMainRoutes = () => {
  const routesDir = path.join(process.cwd(), 'src', 'routes');
  const versionDir = path.join(routesDir, VERSION_PREFIX);
  const versionIndexPath = path.join(versionDir, 'index.ts');

  // Create version directory if it doesn't exist
  if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true });

    // Create initial version index file
    const initialVersionContent = `import express from 'express';

const router = express.Router();

export default router;
`;
    fs.writeFileSync(versionIndexPath, initialVersionContent);
  }

  // Update version index file
  let versionContent = fs.readFileSync(versionIndexPath, 'utf-8');

  // Add import statement if not exists
  const importStatement = `import ${featureNameKebab}Routes from '../../features/${featureNameKebab}/routes/${featureNameKebab}.routes';`;
  if (!versionContent.includes(importStatement)) {
    const lastImportIndex = versionContent.lastIndexOf('import');
    const insertPosition = lastImportIndex === -1 ? 0 : versionContent.indexOf(';', lastImportIndex) + 1;
    const beforeImport = versionContent.substring(0, insertPosition);
    const afterImport = versionContent.substring(insertPosition);

    versionContent = beforeImport + (insertPosition ? '\n' : '') + importStatement + afterImport;
  }

  // Add route registration if not exists
  const routeRegistration = `router.use('/${featureNameKebab}', ${featureNameKebab}Routes);`;
  if (!versionContent.includes(routeRegistration)) {
    const exportIndex = versionContent.lastIndexOf('export');
    const beforeExport = versionContent.substring(0, exportIndex);
    const afterExport = versionContent.substring(exportIndex);

    versionContent = beforeExport + routeRegistration + '\n\n' + afterExport;
  }

  // Write updated version content
  fs.writeFileSync(versionIndexPath, versionContent);

  // Update main routes index file
  const mainIndexPath = path.join(routesDir, 'index.ts');
  let mainContent = fs.existsSync(mainIndexPath)
    ? fs.readFileSync(mainIndexPath, 'utf-8')
    : `import express from 'express';

const router = express.Router();

export default router;
`;

  // Add version import if not exists
  const versionImport = `import ${VERSION_PREFIX}Routes from './${VERSION_PREFIX}';`;
  if (!mainContent.includes(versionImport)) {
    const lastImportIndex = mainContent.lastIndexOf('import');
    const insertPosition = lastImportIndex === -1 ? 0 : mainContent.indexOf(';', lastImportIndex) + 1;
    const beforeImport = mainContent.substring(0, insertPosition);
    const afterImport = mainContent.substring(insertPosition);

    mainContent = beforeImport + (insertPosition ? '\n' : '') + versionImport + afterImport;
  }

  // Add version route registration if not exists
  const versionRegistration = `router.use('/${VERSION_PREFIX}', ${VERSION_PREFIX}Routes);`;
  if (!mainContent.includes(versionRegistration)) {
    const exportIndex = mainContent.lastIndexOf('export');
    const beforeExport = mainContent.substring(0, exportIndex);
    const afterExport = mainContent.substring(exportIndex);

    mainContent = beforeExport + versionRegistration + '\n\n' + afterExport;
  }

  // Write updated main content
  fs.writeFileSync(mainIndexPath, mainContent);

  console.log(`Updated routes file: ${versionIndexPath}`);
  console.log(`Updated main routes file: ${mainIndexPath}`);
};

// Update the routes file
updateMainRoutes();

console.log(`\nFeature '${featureNamePascal}' created successfully in version ${VERSION_PREFIX}!`);
console.log('\nNext steps:');
console.log(`1. Add entity fields in: entities/${featureNameKebab}.entity.ts`);
console.log(`2. Update mapper in: mappers/${featureNameKebab}.mapper.ts`);
console.log(`3. Add schema fields in: models/${featureNameKebab}.model.ts`);
console.log(`4. Add validation in DTOs`); 