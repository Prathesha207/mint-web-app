/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: aimodels
 * Interface for AIModels
 */
export interface AIModels {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  modelName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  version?: string;
  /** @wixFieldType text */
  supportedTasks?: string;
  /** @wixFieldType datetime */
  creationDate?: Date | string;
  /** @wixFieldType boolean */
  isActive?: boolean;
}


/**
 * Collection ID: platformfeatures
 * Interface for PlatformFeatures
 */
export interface PlatformFeatures {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  featureTitle?: string;
  /** @wixFieldType text */
  featureDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  featureIcon?: string;
  /** @wixFieldType text */
  callToActionText?: string;
  /** @wixFieldType url */
  callToActionUrl?: string;
}


/**
 * Collection ID: trainingtypes
 * Interface for TrainingTypes
 */
export interface TrainingTypes {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  trainingTypeName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  defaultParameters?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType number */
  estimatedDurationMinutes?: number;
  /** @wixFieldType text */
  supportedDataTypes?: string;
}
