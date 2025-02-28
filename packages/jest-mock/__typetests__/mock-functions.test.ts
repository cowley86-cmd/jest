/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  expectAssignable,
  expectError,
  expectNotAssignable,
  expectType,
} from 'tsd-lite';
import {
  Mock,
  SpiedClass,
  SpiedFunction,
  SpiedGetter,
  SpiedSetter,
  fn,
  spyOn,
} from 'jest-mock';

// jest.fn()

expectType<Mock<() => Promise<string>>>(
  fn(async () => 'value')
    .mockClear()
    .mockReset()
    .mockImplementation(fn(async () => 'value'))
    .mockImplementationOnce(fn(async () => 'value'))
    .mockName('mock')
    .mockResolvedValue('value')
    .mockResolvedValueOnce('value')
    .mockRejectedValue('error')
    .mockRejectedValueOnce('error')
    .mockReturnThis()
    .mockReturnValue(Promise.resolve('value'))
    .mockReturnValueOnce(Promise.resolve('value')),
);

expectType<Mock<() => string>>(
  fn(() => 'value')
    .mockClear()
    .mockReset()
    .mockImplementation(() => 'value')
    .mockImplementationOnce(() => 'value')
    .mockName('mock')
    .mockReturnThis()
    .mockReturnValue('value')
    .mockReturnValueOnce('value'),
);

expectError(fn(() => 'value').mockReturnValue(Promise.resolve('value')));
expectError(fn(() => 'value').mockReturnValueOnce(Promise.resolve('value')));

expectError(fn(() => 'value').mockResolvedValue('value'));
expectError(fn(() => 'value').mockResolvedValueOnce('value'));

expectError(fn(() => 'value').mockRejectedValue('error'));
expectError(fn(() => 'value').mockRejectedValueOnce('error'));

expectAssignable<Function>(fn()); // eslint-disable-line @typescript-eslint/ban-types

expectType<Mock<(...args: Array<unknown>) => unknown>>(fn());
expectType<Mock<() => void>>(fn(() => {}));
expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  fn((a: string, b?: number) => true),
);
expectType<Mock<(e: any) => never>>(
  fn((e: any) => {
    throw new Error();
  }),
);
expectError(fn('moduleName'));

declare const mockFnImpl: (this: Date, a: string, b?: number) => boolean;
const mockFn = fn(mockFnImpl);
const mockAsyncFn = fn(async (p: boolean) => 'value');

expectType<boolean>(mockFn('one', 2));
expectType<Promise<string>>(mockAsyncFn(false));
expectError(mockFn());
expectError(mockAsyncFn());

const MockObject = fn((credentials: string) => ({
  connect() {
    return fn();
  },
  disconnect() {
    return;
  },
}));

expectType<{
  connect(): Mock<(...args: Array<unknown>) => unknown>;
  disconnect(): void;
}>(new MockObject('credentials'));
expectError(new MockObject());

expectType<((a: string, b?: number | undefined) => boolean) | undefined>(
  mockFn.getMockImplementation(),
);
expectError(mockFn.getMockImplementation('some-mock'));

expectType<string>(mockFn.getMockName());
expectError(mockFn.getMockName('some-mock'));

expectType<number>(mockFn.mock.calls.length);

expectType<string>(mockFn.mock.calls[0][0]);
expectType<number | undefined>(mockFn.mock.calls[0][1]);

expectType<string>(mockFn.mock.calls[1][0]);
expectType<number | undefined>(mockFn.mock.calls[1][1]);

expectType<[a: string, b?: number | undefined] | undefined>(
  mockFn.mock.lastCall,
);

expectType<Array<number>>(mockFn.mock.invocationCallOrder);

expectType<
  Array<{
    connect(): Mock<(...args: Array<unknown>) => unknown>;
    disconnect(): void;
  }>
>(MockObject.mock.instances);

const returnValue = mockFn.mock.results[0];

expectType<'incomplete' | 'return' | 'throw'>(returnValue.type);
expectType<unknown>(returnValue.value);

if (returnValue.type === 'incomplete') {
  expectType<undefined>(returnValue.value);
}

if (returnValue.type === 'return') {
  expectType<boolean>(returnValue.value);
}

if (returnValue.type === 'throw') {
  expectType<unknown>(returnValue.value);
}

expectType<Array<Date>>(mockFn.mock.contexts);

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockClear(),
);
expectError(mockFn.mockClear('some-mock'));

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockReset(),
);
expectError(mockFn.mockClear('some-mock'));

expectType<void>(mockFn.mockRestore());
expectError(mockFn.mockClear('some-mock'));

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockImplementation((a, b) => {
    expectType<string>(a);
    expectType<number | undefined>(b);
    return false;
  }),
);
expectError(mockFn.mockImplementation((a: number) => false));
expectError(mockFn.mockImplementation(a => 'false'));
expectError(mockFn.mockImplementation());

expectType<Mock<(p: boolean) => Promise<string>>>(
  mockAsyncFn.mockImplementation(async a => {
    expectType<boolean>(a);
    return 'mock value';
  }),
);
expectError(mockAsyncFn.mockImplementation(a => 'mock value'));

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockImplementationOnce((a, b) => {
    expectType<string>(a);
    expectType<number | undefined>(b);
    return false;
  }),
);
expectError(mockFn.mockImplementationOnce((a: number) => false));
expectError(mockFn.mockImplementationOnce(a => 'false'));
expectError(mockFn.mockImplementationOnce());

expectType<Mock<(p: boolean) => Promise<string>>>(
  mockAsyncFn.mockImplementationOnce(async a => {
    expectType<boolean>(a);
    return 'mock value';
  }),
);
expectError(mockAsyncFn.mockImplementationOnce(a => 'mock value'));

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockName('mockedFunction'),
);
expectError(mockFn.mockName(123));
expectError(mockFn.mockName());

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockReturnThis(),
);
expectError(mockFn.mockReturnThis('this'));

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockReturnValue(false),
);
expectError(mockFn.mockReturnValue('true'));
expectError(mockFn.mockReturnValue());

expectType<Mock<(p: boolean) => Promise<string>>>(
  mockAsyncFn.mockReturnValue(Promise.resolve('mock value')),
);
expectError(mockAsyncFn.mockReturnValue(Promise.resolve(true)));

expectType<Mock<(a: string, b?: number | undefined) => boolean>>(
  mockFn.mockReturnValueOnce(false),
);
expectError(mockFn.mockReturnValueOnce('true'));
expectError(mockFn.mockReturnValueOnce());

expectType<Mock<(p: boolean) => Promise<string>>>(
  mockAsyncFn.mockReturnValueOnce(Promise.resolve('mock value')),
);
expectError(mockAsyncFn.mockReturnValueOnce(Promise.resolve(true)));

expectType<Mock<() => Promise<string>>>(
  fn(() => Promise.resolve('')).mockResolvedValue('Mock value'),
);
expectError(fn(() => Promise.resolve('')).mockResolvedValue(123));
expectError(fn(() => Promise.resolve('')).mockResolvedValue());

expectType<Mock<() => Promise<string>>>(
  fn(() => Promise.resolve('')).mockResolvedValueOnce('Mock value'),
);
expectError(fn(() => Promise.resolve('')).mockResolvedValueOnce(123));
expectError(fn(() => Promise.resolve('')).mockResolvedValueOnce());

expectType<Mock<() => Promise<string>>>(
  fn(() => Promise.resolve('')).mockRejectedValue(new Error('Mock error')),
);
expectType<Mock<() => Promise<string>>>(
  fn(() => Promise.resolve('')).mockRejectedValue('Mock error'),
);
expectError(fn(() => Promise.resolve('')).mockRejectedValue());

expectType<Mock<() => Promise<string>>>(
  fn(() => Promise.resolve('')).mockRejectedValueOnce(new Error('Mock error')),
);
expectType<Mock<() => Promise<string>>>(
  fn(() => Promise.resolve('')).mockRejectedValueOnce('Mock error'),
);
expectError(fn(() => Promise.resolve('')).mockRejectedValueOnce());

expectType<void>(mockFn.withImplementation(mockFnImpl, () => {}));
expectType<Promise<void>>(
  mockFn.withImplementation(mockFnImpl, async () => {}),
);

expectError(mockFn.withImplementation(mockFnImpl));

// jest.spyOn()

const spiedArray = ['a', 'b'];

const spiedFunction = () => {};

const spiedObject = {
  _propertyB: false,

  methodA() {
    return true;
  },
  methodB(a: string, b: number) {
    return;
  },
  methodC(e: any) {
    throw new Error();
  },

  propertyA: 'abc',

  set propertyB(value) {
    this._propertyB = value;
  },
  get propertyB() {
    return this._propertyB;
  },
};

type IndexSpiedObject = {
  [key: string]: Record<string, any>;

  methodA(): boolean;
  methodB(a: string, b: number): void;
  methodC: (c: number) => boolean;
  methodE: (e: any) => never;

  propertyA: {a: string};
};

const indexSpiedObject: IndexSpiedObject = {
  methodA() {
    return true;
  },
  methodB(a: string, b: number) {
    return;
  },
  methodC(c: number) {
    return true;
  },
  methodE(e: any) {
    throw new Error();
  },

  propertyA: {a: 'abc'},
};

const spy = spyOn(spiedObject, 'methodA');

expectNotAssignable<Function>(spy); // eslint-disable-line @typescript-eslint/ban-types
expectError(spy());
expectError(new spy());

expectType<SpiedFunction<typeof spiedObject.methodA>>(
  spyOn(spiedObject, 'methodA'),
);
expectType<SpiedFunction<typeof spiedObject.methodB>>(
  spyOn(spiedObject, 'methodB'),
);
expectType<SpiedFunction<typeof spiedObject.methodC>>(
  spyOn(spiedObject, 'methodC'),
);

expectType<SpiedGetter<typeof spiedObject.propertyB>>(
  spyOn(spiedObject, 'propertyB', 'get'),
);
expectType<SpiedSetter<typeof spiedObject.propertyB>>(
  spyOn(spiedObject, 'propertyB', 'set'),
);
expectError(spyOn(spiedObject, 'propertyB'));
expectError(spyOn(spiedObject, 'methodB', 'get'));
expectError(spyOn(spiedObject, 'methodB', 'set'));

expectType<SpiedGetter<typeof spiedObject.propertyA>>(
  spyOn(spiedObject, 'propertyA', 'get'),
);
expectType<SpiedSetter<typeof spiedObject.propertyA>>(
  spyOn(spiedObject, 'propertyA', 'set'),
);
expectError(spyOn(spiedObject, 'propertyA'));

expectError(spyOn(spiedObject, 'notThere'));
expectError(spyOn('abc', 'methodA'));
expectError(spyOn(123, 'methodA'));
expectError(spyOn(true, 'methodA'));
expectError(spyOn(spiedObject));
expectError(spyOn());

expectType<SpiedFunction<typeof Array.isArray>>(
  spyOn(spiedArray as unknown as ArrayConstructor, 'isArray'),
);
expectError(spyOn(spiedArray, 'isArray'));

expectType<SpiedFunction<typeof spiedFunction.toString>>(
  spyOn(spiedFunction as unknown as Function, 'toString'), // eslint-disable-line @typescript-eslint/ban-types
);
expectError(spyOn(spiedFunction, 'toString'));

expectType<SpiedClass<typeof Date>>(spyOn(globalThis, 'Date'));
expectType<SpiedFunction<typeof Date.now>>(spyOn(Date, 'now'));

// object with index signatures

expectType<SpiedFunction<typeof indexSpiedObject.methodA>>(
  spyOn(indexSpiedObject, 'methodA'),
);
expectType<SpiedFunction<typeof indexSpiedObject.methodB>>(
  spyOn(indexSpiedObject, 'methodB'),
);
expectType<SpiedFunction<typeof indexSpiedObject.methodC>>(
  spyOn(indexSpiedObject, 'methodC'),
);
expectType<SpiedFunction<typeof indexSpiedObject.methodE>>(
  spyOn(indexSpiedObject, 'methodE'),
);

expectType<SpiedGetter<typeof indexSpiedObject.propertyA>>(
  spyOn(indexSpiedObject, 'propertyA', 'get'),
);
expectType<SpiedSetter<typeof indexSpiedObject.propertyA>>(
  spyOn(indexSpiedObject, 'propertyA', 'set'),
);
expectError(spyOn(indexSpiedObject, 'propertyA'));

expectError(spyOn(indexSpiedObject, 'notThere'));

// interface with optional properties

class SomeClass {
  constructor(one: string, two?: boolean) {}

  methodA() {
    return true;
  }
  methodB(a: string, b?: number) {
    return;
  }
}

interface OptionalInterface {
  constructorA?: (new (one: string) => SomeClass) | undefined;
  constructorB: new (one: string, two: boolean) => SomeClass;

  propertyA?: number | undefined;
  propertyB?: number;
  propertyC: number | undefined;
  propertyD: string;

  methodA?: ((a: boolean) => void) | undefined;
  methodB: (b: string) => boolean;
}

const optionalSpiedObject = {} as OptionalInterface;

expectType<SpiedClass<NonNullable<typeof optionalSpiedObject.constructorA>>>(
  spyOn(optionalSpiedObject, 'constructorA'),
);
expectType<SpiedClass<typeof optionalSpiedObject.constructorB>>(
  spyOn(optionalSpiedObject, 'constructorB'),
);

expectError(spyOn(optionalSpiedObject, 'constructorA', 'get'));
expectError(spyOn(optionalSpiedObject, 'constructorA', 'set'));

expectType<SpiedFunction<NonNullable<typeof optionalSpiedObject.methodA>>>(
  spyOn(optionalSpiedObject, 'methodA'),
);
expectType<SpiedFunction<typeof optionalSpiedObject.methodB>>(
  spyOn(optionalSpiedObject, 'methodB'),
);

expectError(spyOn(optionalSpiedObject, 'methodA', 'get'));
expectError(spyOn(optionalSpiedObject, 'methodA', 'set'));

expectType<SpiedGetter<NonNullable<typeof optionalSpiedObject.propertyA>>>(
  spyOn(optionalSpiedObject, 'propertyA', 'get'),
);
expectType<SpiedSetter<NonNullable<typeof optionalSpiedObject.propertyA>>>(
  spyOn(optionalSpiedObject, 'propertyA', 'set'),
);
expectType<SpiedGetter<NonNullable<typeof optionalSpiedObject.propertyB>>>(
  spyOn(optionalSpiedObject, 'propertyB', 'get'),
);
expectType<SpiedSetter<NonNullable<typeof optionalSpiedObject.propertyB>>>(
  spyOn(optionalSpiedObject, 'propertyB', 'set'),
);
expectType<SpiedGetter<typeof optionalSpiedObject.propertyC>>(
  spyOn(optionalSpiedObject, 'propertyC', 'get'),
);
expectType<SpiedSetter<typeof optionalSpiedObject.propertyC>>(
  spyOn(optionalSpiedObject, 'propertyC', 'set'),
);
expectType<SpiedGetter<typeof optionalSpiedObject.propertyD>>(
  spyOn(optionalSpiedObject, 'propertyD', 'get'),
);
expectType<SpiedSetter<typeof optionalSpiedObject.propertyD>>(
  spyOn(optionalSpiedObject, 'propertyD', 'set'),
);

expectError(spyOn(optionalSpiedObject, 'propertyA'));
expectError(spyOn(optionalSpiedObject, 'propertyB'));
