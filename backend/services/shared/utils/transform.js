/**
 * Transform MongoDB document to include 'id' field from '_id'
 * This ensures frontend compatibility
 */
const transformDocument = (doc) => {
  if (!doc) return doc;
  
  // Convert Mongoose document to plain object with proper options
  let obj;
  if (doc.toObject) {
    obj = doc.toObject({
      transform: (doc, ret) => {
        // Convert _id to id
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        return ret;
      }
    });
  } else {
    obj = JSON.parse(JSON.stringify(doc));
    // If _id exists, add id field
    if (obj._id) {
      obj.id = obj._id.toString();
      delete obj._id;
    }
  }
  
  return obj;
};

/**
 * Transform array of documents
 */
const transformDocuments = (docs) => {
  if (!Array.isArray(docs)) return docs;
  return docs.map(doc => transformDocument(doc));
};

/**
 * Transform nested objects (for populated fields)
 */
const transformNested = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  try {
    const mongoose = require('mongoose');
    
    // Helper to safely convert ObjectId to string
    const safeToString = (value) => {
      if (!value) return value;
      if (typeof value === 'string') return value;
      if (value.toString && typeof value.toString === 'function') {
        try {
          return value.toString();
        } catch (e) {
          return String(value);
        }
      }
      return String(value);
    };
    
    // Convert Mongoose document to plain object if needed
    let plainObj;
    if (obj.toObject && typeof obj.toObject === 'function') {
      plainObj = obj.toObject({ virtuals: false, getters: true });
    } else {
      plainObj = obj;
    }
    
    // Recursively process the object
    const processObject = (item) => {
      if (!item || typeof item !== 'object') return item;
      
      if (Array.isArray(item)) {
        return item.map(processObject);
      }
      
      // Handle Date objects
      if (item instanceof Date) {
        return item.toISOString();
      }
      
      // Handle ObjectId - check if it's an ObjectId instance
      if (item.constructor) {
        const constructorName = item.constructor.name;
        if (constructorName === 'ObjectId' || (mongoose.Types && mongoose.Types.ObjectId && item instanceof mongoose.Types.ObjectId)) {
          return safeToString(item);
        }
      }
      
      const result = {};
      Object.keys(item).forEach(key => {
        const value = item[key];
        
        // Convert _id to id
        if (key === '_id') {
          result.id = safeToString(value);
        } else {
          // Recursively process nested objects
          if (value && typeof value === 'object') {
            // Check if it's an ObjectId
            if (value.constructor && (value.constructor.name === 'ObjectId' || (mongoose.Types && mongoose.Types.ObjectId && value instanceof mongoose.Types.ObjectId))) {
              result[key] = safeToString(value);
            } else if (value instanceof Date) {
              result[key] = value.toISOString();
            } else {
              result[key] = processObject(value);
            }
          } else {
            result[key] = value;
          }
        }
      });
      
      return result;
    };
    
    return processObject(plainObj);
  } catch (error) {
    console.error('Transform nested error:', error.message);
    
    // Fallback: simple conversion
    try {
      // Use JSON serialization as fallback (handles ObjectIds automatically in Mongoose)
      const jsonString = JSON.stringify(obj);
      const parsed = JSON.parse(jsonString);
      
      // Convert _id to id recursively
      const convertId = (item) => {
        if (!item || typeof item !== 'object') return item;
        if (Array.isArray(item)) return item.map(convertId);
        
        const result = {};
        Object.keys(item).forEach(key => {
          if (key === '_id') {
            result.id = item[key];
          } else if (item[key] && typeof item[key] === 'object') {
            result[key] = convertId(item[key]);
          } else {
            result[key] = item[key];
          }
        });
        return result;
      };
      
      return convertId(parsed);
    } catch (fallbackError) {
      // Last resort: minimal transformation
      const minimal = { ...obj };
      if (minimal._id) {
        minimal.id = String(minimal._id);
        delete minimal._id;
      }
      return minimal;
    }
  }
};

module.exports = {
  transformDocument,
  transformDocuments,
  transformNested
};

