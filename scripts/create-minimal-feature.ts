import fs from 'fs';
import path from 'path';

const FEATURE_NAME = process.argv[2];
const VERSION = process.argv[3] ? parseInt(process.argv[3].replace('v', '')) : 1;
const VERSION_PREFIX = `v${VERSION}`;

if (!FEATURE_NAME) {
    console.error('Please provide a feature name');
    console.log('Usage: npm run create-minimal-feature <feature-name> [version]');
    process.exit(1);
}

// Convert feature name to different cases
const featureNameKebab = FEATURE_NAME.toLowerCase().replace(/\s+/g, '-');
const featureNamePascal = FEATURE_NAME.charAt(0).toUpperCase() +
    FEATURE_NAME.slice(1).toLowerCase().replace(/[-\s](\w)/g, (_, c) => c.toUpperCase());
const featureNameCamel = featureNamePascal.charAt(0).toLowerCase() + featureNamePascal.slice(1);

const FEATURE_DIR = path.join(process.cwd(), 'src', 'features', featureNameKebab);

// Template for entity
const entityTemplate = `export class ${featureNamePascal} {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<${featureNamePascal}>) {
    Object.assign(this, data);
  }
}`;

// Template for repository interface
const repoInterfaceTemplate = `import { IBaseRepository } from '../../../core/interfaces/base.repository.interface';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export interface I${featureNamePascal}Repository extends IBaseRepository<${featureNamePascal}> {}`;

// Template for service interface
const serviceInterfaceTemplate = `import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export interface I${featureNamePascal}Service {
  create(data: Partial<${featureNamePascal}>): Promise<${featureNamePascal}>;
  findById(id: string): Promise<${featureNamePascal} | null>;
  update(id: string, data: Partial<${featureNamePascal}>): Promise<${featureNamePascal} | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: Partial<${featureNamePascal}>): Promise<${featureNamePascal}[]>;
}`;

// Template for model
const modelTemplate = `import mongoose, { Schema, Document } from 'mongoose';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export interface I${featureNamePascal}Document extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const ${featureNamePascal}Schema = new Schema({
  // Add your schema fields here
}, { timestamps: true });

export const ${featureNamePascal}Model = mongoose.model<I${featureNamePascal}Document>('${featureNamePascal}', ${featureNamePascal}Schema);`;

// Template for controller (minimal)
const controllerTemplate = `import { Request, Response } from 'express';
import { ${featureNamePascal}Service } from '../services/${featureNameKebab}.service';

export class ${featureNamePascal}Controller {
  private service: ${featureNamePascal}Service;

  constructor() {
    this.service = new ${featureNamePascal}Service();
  }
}`;

// Template for service (minimal)
const serviceTemplate = `import { I${featureNamePascal}Service } from '../interfaces/i-${featureNameKebab}.service';
import { ${featureNamePascal} } from '../entities/${featureNameKebab}.entity';

export class ${featureNamePascal}Service implements I${featureNamePascal}Service {
  async create(data: Partial<${featureNamePascal}>): Promise<${featureNamePascal}> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<${featureNamePascal} | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: Partial<${featureNamePascal}>): Promise<${featureNamePascal} | null> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async list(filter?: Partial<${featureNamePascal}>): Promise<${featureNamePascal}[]> {
    throw new Error('Method not implemented.');
  }
}`;

// Template for routes (minimal)
const routesTemplate = `import { Router } from 'express';
import { ${featureNamePascal}Controller } from '../controllers/${featureNameKebab}.controller';

const router = Router();
const controller = new ${featureNamePascal}Controller();

export default router;`;

// Create directory structure
const directories = [
    'entities',
    'models',
    'services',
    'controllers',
    'routes',
    'interfaces'
];

// Create directories
directories.forEach(dir => {
    const dirPath = path.join(FEATURE_DIR, dir);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
});

// Create files with templates
const files = [
    { path: path.join(FEATURE_DIR, 'entities', `${featureNameKebab}.entity.ts`), content: entityTemplate },
    { path: path.join(FEATURE_DIR, 'interfaces', `i-${featureNameKebab}.repository.ts`), content: repoInterfaceTemplate },
    { path: path.join(FEATURE_DIR, 'interfaces', `i-${featureNameKebab}.service.ts`), content: serviceInterfaceTemplate },
    { path: path.join(FEATURE_DIR, 'models', `${featureNameKebab}.model.ts`), content: modelTemplate },
    { path: path.join(FEATURE_DIR, 'services', `${featureNameKebab}.service.ts`), content: serviceTemplate },
    { path: path.join(FEATURE_DIR, 'controllers', `${featureNameKebab}.controller.ts`), content: controllerTemplate },
    { path: path.join(FEATURE_DIR, 'routes', `${featureNameKebab}.routes.ts`), content: routesTemplate }
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

    if (!fs.existsSync(versionDir)) {
        fs.mkdirSync(versionDir, { recursive: true });
        fs.writeFileSync(versionIndexPath, `import express from 'express';

const router = express.Router();

export default router;
`);
    }

    console.log(`Created version directory: ${versionDir}`);
};

// Update the routes file
updateMainRoutes();

console.log(`\nMinimal feature '${featureNamePascal}' created successfully in version ${VERSION_PREFIX}!`);
console.log('\nNext steps:');
console.log(`1. Add entity fields in: entities/${featureNameKebab}.entity.ts`);
console.log(`2. Add schema fields in: models/${featureNameKebab}.model.ts`);
console.log(`3. Implement service methods in: services/${featureNameKebab}.service.ts`);
console.log(`4. Add routes and controller methods as needed`); 