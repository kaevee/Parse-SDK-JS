/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

jest.autoMockOff();

var ParseSchema = require('../ParseSchema').default;
var ParsePromise = require('../ParsePromise').default;
var CoreManager = require('../CoreManager');

var defaultController = CoreManager.getSchemaController();

describe('ParseSchema', () => {
  it('can create schema', (done) => {
    var schema = new ParseSchema('SchemaTest');
    expect(schema.className, 'SchemaTest');
    done();
  });

  it('can create schema with User Class', (done) => {
    var schema = new ParseSchema('User');
    expect(schema.className, '_User');
    done();
  });

  it('cannot use schema without class', (done) => {
    try {
      var schema = new ParseSchema();
      schema.assertClassName();
    } catch (e) {
      done();
    }
  });

  it('can create schema fields', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema
      .addField('defaultFieldString')
      .addString('stringField')
      .addNumber('numberField')
      .addBoolean('booleanField')
      .addDate('dateField')
      .addFile('fileField')
      .addGeoPoint('geoPointField')
      .addArray('arrayField')
      .addObject('objectField')
      .addPointer('pointerField', '_User')
      .addRelation('relationField', '_User');

    expect(schema._fields.defaultFieldString.type, 'String');
    expect(schema._fields.stringField.type, 'String');
    expect(schema._fields.numberField.type, 'Number');
    expect(schema._fields.booleanField.type, 'Boolean');
    expect(schema._fields.dateField.type, 'Date');
    expect(schema._fields.fileField.type, 'File');
    expect(schema._fields.geoPointField.type, 'GeoPoint');
    expect(schema._fields.arrayField.type, 'Array');
    expect(schema._fields.objectField.type, 'Object');
    expect(schema._fields.pointerField.type, 'Pointer');
    expect(schema._fields.relationField.type, 'Relation');
    expect(schema._fields.pointerField.targetClass, '_User');
    expect(schema._fields.relationField.targetClass, '_User');
    done();
  });

  it('can create schema indexes', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema.addIndex('testIndex', { name: 1 });

    expect(schema._indexes.name, 1);
    done();
  });

  it('cannot add field with null name', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addField(null, 'string');
    } catch (e) {
      done();
    }
  });

  it('cannot add field with invalid type', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addField('testField', 'unknown');
    } catch (e) {
      done();
    }
  });

  it('cannot add index with null name', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addIndex(null, {'name': 1});
    } catch (e) {
      done();
    }
  });

  it('cannot add index with null index', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addIndex('testIndex', null);
    } catch (e) {
      done();
    }
  });

  it('cannot add pointer with null name', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addPointer(null, 'targetClass');
    } catch (e) {
      done();
    }
  });

  it('cannot add pointer with null targetClass', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addPointer('pointerField', null);
    } catch (e) {
      done();
    }
  });

  it('cannot add relation with null name', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addRelation(null, 'targetClass');
    } catch (e) {
      done();
    }
  });

  it('cannot add relation with null targetClass', (done) => {
    try {
      var schema = new ParseSchema('SchemaTest');
      schema.addRelation('relationField', null);
    } catch (e) {
      done();
    }
  });

  it('can delete schema field', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema.deleteField('testField');
    expect(schema._fields.testField._op, 'Delete');
    done();
  });

  it('can delete schema index', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema.deleteIndex('testIndex');
    expect(schema._indexes.testIndex._op, 'Delete');
    done();
  });

  // CoreManager.setSchemaController({
  //   send() {},
  //   get() {},
  //   create() {},
  //   update() {},
  //   delete() {},
  // });
  it('can save schema', (done) => {
    CoreManager.setSchemaController({
      send() {},
      get() {},
      update() {},
      delete() {},
      create(className, params, options) {
        expect(className).toBe('SchemaTest');
        expect(params).toEqual({
          className: 'SchemaTest',
          fields: { name: { type: 'String'} },
          indexes: { testIndex: { name: 1 } }
        });
        expect(options).toEqual({});
        return ParsePromise.as([]);
      },
    });

    var schema = new ParseSchema('SchemaTest');
    schema.addField('name');
    schema.addIndex('testIndex', {'name': 1});
    schema.save().then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('can update schema', (done) => {
    CoreManager.setSchemaController({
      send() {},
      get() {},
      create() {},
      delete() {},
      update(className, params, options) {
        expect(className).toBe('SchemaTest');
        expect(params).toEqual({
          className: 'SchemaTest',
          fields: { name: { type: 'String'} },
          indexes: { testIndex: { name: 1 } }
        });
        expect(options).toEqual({});
        return ParsePromise.as([]);
      },
    });

    var schema = new ParseSchema('SchemaTest');
    schema.addField('name');
    schema.addIndex('testIndex', {'name': 1});
    schema.update().then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('can delete schema', (done) => {
    CoreManager.setSchemaController({
      send() {},
      create() {},
      update() {},
      get() {},
      delete(className, options) {
        expect(className).toBe('SchemaTest');
        expect(options).toEqual({});
        return ParsePromise.as([]);
      },
    });

    var schema = new ParseSchema('SchemaTest');
    schema.delete().then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('can get schema', (done) => {
    CoreManager.setSchemaController({
      send() {},
      create() {},
      update() {},
      delete() {},
      get(className, options) {
        expect(className).toBe('SchemaTest');
        expect(options).toEqual({});
        return ParsePromise.as([]);
      },
    });

    var schema = new ParseSchema('SchemaTest');
    schema.get().then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('can get schema with options', (done) => {
    CoreManager.setSchemaController({
      send() {},
      create() {},
      update() {},
      delete() {},
      get(className, options) {
        expect(className).toBe('SchemaTest');
        expect(options).toEqual({ sessionToken: 1234 });
        return ParsePromise.as([]);
      },
    });

    var schema = new ParseSchema('SchemaTest');
    schema.get({ sessionToken: 1234 }).then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('cannot get empty schema', (done) => {
    CoreManager.setSchemaController({
      send() {},
      create() {},
      update() {},
      delete() {},
      get(className, options) {
        expect(className).toBe('SchemaTest');
        expect(options).toEqual({});
        return ParsePromise.as(null);
      },
    });

    var schema = new ParseSchema('SchemaTest');
    schema.get().then(() => {
      // Should never reach
      expect(true).toBe(false);
      done();
    }, (error) => {
      expect(error.message).toBe('Schema not found.');
      done();
    });
  });

  it('can get all schema', (done) => {
    CoreManager.setSchemaController({
      send() {},
      create() {},
      update() {},
      delete() {},
      get(className, options) {
        expect(className).toBe('');
        expect(options).toEqual({});
        return ParsePromise.as({
          results: ['all']
        });
      },
    });

    ParseSchema.all().then((results) => {
      expect(results[0]).toEqual('all');
      done();
    });
  });

  it('can get all schema with options', (done) => {
    CoreManager.setSchemaController({
      send() {},
      create() {},
      update() {},
      delete() {},
      get(className, options) {
        expect(className).toBe('');
        expect(options).toEqual({ sessionToken: 1234 });
        return ParsePromise.as({
          results: ['all']
        });
      },
    });

    ParseSchema.all({ sessionToken: 1234 }).then((results) => {
      expect(results[0]).toEqual('all');
      done();
    });
  });

  it('cannot get all schema when empty', (done) => {
    CoreManager.setSchemaController({
      send() {},
      create() {},
      update() {},
      delete() {},
      get(className, options) {
        expect(className).toBe('');
        expect(options).toEqual({});
        return ParsePromise.as({
          results: []
        });
      },
    });

    ParseSchema.all().then(() => {
      // Should never reach
      expect(true).toBe(false);
      done();
    }, (error) => {
      expect(error.message).toBe('Schema not found.');
      done();
    });
  });
});

describe('SchemaController', () => {
  beforeEach(() => {
    CoreManager.setSchemaController(defaultController);
    var request = function(method, path, data, options) {
      return ParsePromise.as([]);
    };
    var ajax = function(method, path, data, headers) {
      return ParsePromise.as([]);
    };
    CoreManager.setRESTController({ request: request, ajax: ajax });
  });

  it('save schema with sessionToken', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema.save({ sessionToken: 1234 }).then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('get schema', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema.get().then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('update schema', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema.update().then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('delete schema', (done) => {
    var schema = new ParseSchema('SchemaTest');
    schema.delete().then((results) => {
      expect(results).toEqual([]);
      done();
    });
  });
});
