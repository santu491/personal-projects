import { Expose } from 'class-transformer';
import { JsonTransformer } from './jsonTransformer';

export class Xtest {
  username: string;
  phone: string;
  @Expose() address: string;
}

describe('JsonTransformer UTest', () => {
  let transformer: JsonTransformer;

  beforeEach(() => {
    transformer = new JsonTransformer();
  });

  it('should transform plain json to defined typescript class definition', () => {
    let result: any = transformer.jsonToClass('{"username":"user1", "phone":"123","email":"test@test.com"}', Xtest);
    expect(result.email).not.toBeDefined();
  });

  it('should transform typescript class to plain json', () => {
    let t = new Xtest();
    t.phone = '123';
    t.username = 'user2';
    t.address = '12 street';
    let result: any = transformer.classToJson(t);

    expect(result.address).toBe('12 street');
    expect(result.username).not.toBeDefined();
  });
});
