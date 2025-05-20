import { storage as Storage } from '../storage';

describe('util:Storage', () => {
  it('Should save and restore a numeric value', async () => {
    const storage = Storage('LandingPage');
    await storage.setNumber('NUM_TEST', 99.99);
    const testNum = await storage.getNumber('NUM_TEST', 88.88);
    expect(testNum).toEqual(99.99);
  });

  it('testing setstring and getstring', async () => {
    const storage = Storage('LandingPage');
    storage.setString('name', 'Carelon');
    const testString = await storage.getString('name', '');
    expect(testString).toEqual('Carelon');
  });

  it('testing setObject and getObject', async () => {
    const storage = Storage('LandingPage');
    storage.setObject('ApplicationName', { id: 1, name: 'Carelon' });
    const testObj = await storage.getObject('ApplicationName', {});
    expect(testObj).toEqual({ id: 1, name: 'Carelon' });
  });

  it('testing setBool and getBool', async () => {
    const storage = Storage('LandingPage');
    storage.setBool('boolValue', true);
    const testBool = await storage.getBool('boolValue', false);
    expect(testBool).toEqual(true);
  });

  it('Should save and return an int value', async () => {
    const storage = Storage('LandingPage');
    storage.setInt('INT_TEST', 99);
    const testInt = await storage.getInt('INT_TEST', 88);
    expect(testInt).toEqual(99);
  });

  it('Should save a float value and return an int value', async () => {
    const storage = Storage('LandingPage');
    storage.setInt('FLOAT_TEST', 99.99);
    const testInt = await storage.getInt('FLOAT_TEST', 88);
    expect(testInt).toEqual(99);
  });

  it('testing allKeys method', async () => {
    const storage = Storage('Testingstorage');
    storage.setString('portal', 'member');
    storage.setNumber('version', 1.1);
    const myKeys = await storage.getAllKeys();
    expect(myKeys).toContain('portal');
    expect(myKeys).toContain('version');
    expect(myKeys).not.toContain('FLOAT_TEST');
  });

  it('testing remove keys method', async () => {
    const storage = Storage('LandingPage');
    let myKeys = await storage.getAllKeys();
    expect(myKeys).toContain('NUM_TEST');

    await storage.removeItem('NUM_TEST');
    myKeys = await storage.getAllKeys();
    expect(myKeys).not.toContain('NUM_TEST');
  });
});
