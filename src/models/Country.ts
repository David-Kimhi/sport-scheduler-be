import { Collection, type Document, Binary } from 'mongodb';
import { BaseModel } from './BaseModel.js';
import { type BaseDocument } from './BaseDocument.js';
import { SMALL_L } from '../config/index.js';

export interface CountryData extends BaseDocument {
  flagImage: Binary; 
  flagContentType: string;
}

export class Country extends BaseModel {
    static collection: Collection<Document>;

    static async init(dbName: string, collectionName: string, appName = 'api') {
        Country.collection = await this.initCollection(dbName, collectionName, appName);
    }


    static gameDocMap: Record<keyof CountryData, string | ((doc: any) => any)> = {
        _id: '_id',
        id: 'name',
        injestion_info: 'injestion_info',
        code: 'code',
        flagImage: 'flagImage',
        flagContentType: 'flagContentType'
    };
  
    // Default game object 
    static default(): CountryData {
        return {
            ...this.defaultFields(),
            flagImage: new Binary(),
            flagContentType: ''
        };
    }


    static async findByName(name: string, limit=SMALL_L): Promise<Country[]> {
        const regex = new RegExp(name, 'i');

        const docs = await Country.collection.find({'name': regex}).limit(limit).toArray();

    
        return docs.map(doc => ({
            _id: doc._id,
            name: doc.name,
            code: doc.code,
            flagImage: doc.flagImage,
            flagContentType: doc.flagContentType
        }));
    }
}
