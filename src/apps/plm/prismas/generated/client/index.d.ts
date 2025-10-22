
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model EmployeeStatusHistory
 * 
 */
export type EmployeeStatusHistory = $Result.DefaultSelection<Prisma.$EmployeeStatusHistoryPayload>
/**
 * Model PositionHistory
 * 
 */
export type PositionHistory = $Result.DefaultSelection<Prisma.$PositionHistoryPayload>
/**
 * Model EmployeeInfo
 * 
 */
export type EmployeeInfo = $Result.DefaultSelection<Prisma.$EmployeeInfoPayload>
/**
 * Model DepartmentInfoHistory
 * 
 */
export type DepartmentInfoHistory = $Result.DefaultSelection<Prisma.$DepartmentInfoHistoryPayload>
/**
 * Model DepartmentInfo
 * 
 */
export type DepartmentInfo = $Result.DefaultSelection<Prisma.$DepartmentInfoPayload>
/**
 * Model PersonalInfoHistory
 * 
 */
export type PersonalInfoHistory = $Result.DefaultSelection<Prisma.$PersonalInfoHistoryPayload>
/**
 * Model CompanyInfo
 * 
 */
export type CompanyInfo = $Result.DefaultSelection<Prisma.$CompanyInfoPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more EmployeeStatusHistories
 * const employeeStatusHistories = await prisma.employeeStatusHistory.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more EmployeeStatusHistories
   * const employeeStatusHistories = await prisma.employeeStatusHistory.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.employeeStatusHistory`: Exposes CRUD operations for the **EmployeeStatusHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmployeeStatusHistories
    * const employeeStatusHistories = await prisma.employeeStatusHistory.findMany()
    * ```
    */
  get employeeStatusHistory(): Prisma.EmployeeStatusHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.positionHistory`: Exposes CRUD operations for the **PositionHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PositionHistories
    * const positionHistories = await prisma.positionHistory.findMany()
    * ```
    */
  get positionHistory(): Prisma.PositionHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.employeeInfo`: Exposes CRUD operations for the **EmployeeInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmployeeInfos
    * const employeeInfos = await prisma.employeeInfo.findMany()
    * ```
    */
  get employeeInfo(): Prisma.EmployeeInfoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.departmentInfoHistory`: Exposes CRUD operations for the **DepartmentInfoHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DepartmentInfoHistories
    * const departmentInfoHistories = await prisma.departmentInfoHistory.findMany()
    * ```
    */
  get departmentInfoHistory(): Prisma.DepartmentInfoHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.departmentInfo`: Exposes CRUD operations for the **DepartmentInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DepartmentInfos
    * const departmentInfos = await prisma.departmentInfo.findMany()
    * ```
    */
  get departmentInfo(): Prisma.DepartmentInfoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.personalInfoHistory`: Exposes CRUD operations for the **PersonalInfoHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PersonalInfoHistories
    * const personalInfoHistories = await prisma.personalInfoHistory.findMany()
    * ```
    */
  get personalInfoHistory(): Prisma.PersonalInfoHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.companyInfo`: Exposes CRUD operations for the **CompanyInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompanyInfos
    * const companyInfos = await prisma.companyInfo.findMany()
    * ```
    */
  get companyInfo(): Prisma.CompanyInfoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.3
   * Query Engine version: bb420e667c1820a8c05a38023385f6cc7ef8e83a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    EmployeeStatusHistory: 'EmployeeStatusHistory',
    PositionHistory: 'PositionHistory',
    EmployeeInfo: 'EmployeeInfo',
    DepartmentInfoHistory: 'DepartmentInfoHistory',
    DepartmentInfo: 'DepartmentInfo',
    PersonalInfoHistory: 'PersonalInfoHistory',
    CompanyInfo: 'CompanyInfo'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "employeeStatusHistory" | "positionHistory" | "employeeInfo" | "departmentInfoHistory" | "departmentInfo" | "personalInfoHistory" | "companyInfo"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      EmployeeStatusHistory: {
        payload: Prisma.$EmployeeStatusHistoryPayload<ExtArgs>
        fields: Prisma.EmployeeStatusHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmployeeStatusHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmployeeStatusHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>
          }
          findFirst: {
            args: Prisma.EmployeeStatusHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmployeeStatusHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>
          }
          findMany: {
            args: Prisma.EmployeeStatusHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>[]
          }
          create: {
            args: Prisma.EmployeeStatusHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>
          }
          createMany: {
            args: Prisma.EmployeeStatusHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmployeeStatusHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>[]
          }
          delete: {
            args: Prisma.EmployeeStatusHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>
          }
          update: {
            args: Prisma.EmployeeStatusHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>
          }
          deleteMany: {
            args: Prisma.EmployeeStatusHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmployeeStatusHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmployeeStatusHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>[]
          }
          upsert: {
            args: Prisma.EmployeeStatusHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeStatusHistoryPayload>
          }
          aggregate: {
            args: Prisma.EmployeeStatusHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmployeeStatusHistory>
          }
          groupBy: {
            args: Prisma.EmployeeStatusHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmployeeStatusHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmployeeStatusHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<EmployeeStatusHistoryCountAggregateOutputType> | number
          }
        }
      }
      PositionHistory: {
        payload: Prisma.$PositionHistoryPayload<ExtArgs>
        fields: Prisma.PositionHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PositionHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PositionHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>
          }
          findFirst: {
            args: Prisma.PositionHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PositionHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>
          }
          findMany: {
            args: Prisma.PositionHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>[]
          }
          create: {
            args: Prisma.PositionHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>
          }
          createMany: {
            args: Prisma.PositionHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PositionHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>[]
          }
          delete: {
            args: Prisma.PositionHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>
          }
          update: {
            args: Prisma.PositionHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PositionHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PositionHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PositionHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>[]
          }
          upsert: {
            args: Prisma.PositionHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionHistoryPayload>
          }
          aggregate: {
            args: Prisma.PositionHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePositionHistory>
          }
          groupBy: {
            args: Prisma.PositionHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PositionHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PositionHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PositionHistoryCountAggregateOutputType> | number
          }
        }
      }
      EmployeeInfo: {
        payload: Prisma.$EmployeeInfoPayload<ExtArgs>
        fields: Prisma.EmployeeInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmployeeInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmployeeInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>
          }
          findFirst: {
            args: Prisma.EmployeeInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmployeeInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>
          }
          findMany: {
            args: Prisma.EmployeeInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>[]
          }
          create: {
            args: Prisma.EmployeeInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>
          }
          createMany: {
            args: Prisma.EmployeeInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmployeeInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>[]
          }
          delete: {
            args: Prisma.EmployeeInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>
          }
          update: {
            args: Prisma.EmployeeInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>
          }
          deleteMany: {
            args: Prisma.EmployeeInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmployeeInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmployeeInfoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>[]
          }
          upsert: {
            args: Prisma.EmployeeInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeeInfoPayload>
          }
          aggregate: {
            args: Prisma.EmployeeInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmployeeInfo>
          }
          groupBy: {
            args: Prisma.EmployeeInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmployeeInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmployeeInfoCountArgs<ExtArgs>
            result: $Utils.Optional<EmployeeInfoCountAggregateOutputType> | number
          }
        }
      }
      DepartmentInfoHistory: {
        payload: Prisma.$DepartmentInfoHistoryPayload<ExtArgs>
        fields: Prisma.DepartmentInfoHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentInfoHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentInfoHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>
          }
          findFirst: {
            args: Prisma.DepartmentInfoHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentInfoHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>
          }
          findMany: {
            args: Prisma.DepartmentInfoHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>[]
          }
          create: {
            args: Prisma.DepartmentInfoHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>
          }
          createMany: {
            args: Prisma.DepartmentInfoHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentInfoHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>[]
          }
          delete: {
            args: Prisma.DepartmentInfoHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>
          }
          update: {
            args: Prisma.DepartmentInfoHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentInfoHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentInfoHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepartmentInfoHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>[]
          }
          upsert: {
            args: Prisma.DepartmentInfoHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoHistoryPayload>
          }
          aggregate: {
            args: Prisma.DepartmentInfoHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartmentInfoHistory>
          }
          groupBy: {
            args: Prisma.DepartmentInfoHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentInfoHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentInfoHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentInfoHistoryCountAggregateOutputType> | number
          }
        }
      }
      DepartmentInfo: {
        payload: Prisma.$DepartmentInfoPayload<ExtArgs>
        fields: Prisma.DepartmentInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>
          }
          findFirst: {
            args: Prisma.DepartmentInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>
          }
          findMany: {
            args: Prisma.DepartmentInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>[]
          }
          create: {
            args: Prisma.DepartmentInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>
          }
          createMany: {
            args: Prisma.DepartmentInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>[]
          }
          delete: {
            args: Prisma.DepartmentInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>
          }
          update: {
            args: Prisma.DepartmentInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepartmentInfoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>[]
          }
          upsert: {
            args: Prisma.DepartmentInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentInfoPayload>
          }
          aggregate: {
            args: Prisma.DepartmentInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartmentInfo>
          }
          groupBy: {
            args: Prisma.DepartmentInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentInfoCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentInfoCountAggregateOutputType> | number
          }
        }
      }
      PersonalInfoHistory: {
        payload: Prisma.$PersonalInfoHistoryPayload<ExtArgs>
        fields: Prisma.PersonalInfoHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PersonalInfoHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PersonalInfoHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>
          }
          findFirst: {
            args: Prisma.PersonalInfoHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PersonalInfoHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>
          }
          findMany: {
            args: Prisma.PersonalInfoHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>[]
          }
          create: {
            args: Prisma.PersonalInfoHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>
          }
          createMany: {
            args: Prisma.PersonalInfoHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PersonalInfoHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>[]
          }
          delete: {
            args: Prisma.PersonalInfoHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>
          }
          update: {
            args: Prisma.PersonalInfoHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PersonalInfoHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PersonalInfoHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PersonalInfoHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>[]
          }
          upsert: {
            args: Prisma.PersonalInfoHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalInfoHistoryPayload>
          }
          aggregate: {
            args: Prisma.PersonalInfoHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePersonalInfoHistory>
          }
          groupBy: {
            args: Prisma.PersonalInfoHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PersonalInfoHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PersonalInfoHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PersonalInfoHistoryCountAggregateOutputType> | number
          }
        }
      }
      CompanyInfo: {
        payload: Prisma.$CompanyInfoPayload<ExtArgs>
        fields: Prisma.CompanyInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>
          }
          findFirst: {
            args: Prisma.CompanyInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>
          }
          findMany: {
            args: Prisma.CompanyInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>[]
          }
          create: {
            args: Prisma.CompanyInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>
          }
          createMany: {
            args: Prisma.CompanyInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>[]
          }
          delete: {
            args: Prisma.CompanyInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>
          }
          update: {
            args: Prisma.CompanyInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>
          }
          deleteMany: {
            args: Prisma.CompanyInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompanyInfoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>[]
          }
          upsert: {
            args: Prisma.CompanyInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyInfoPayload>
          }
          aggregate: {
            args: Prisma.CompanyInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompanyInfo>
          }
          groupBy: {
            args: Prisma.CompanyInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyInfoCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyInfoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    employeeStatusHistory?: EmployeeStatusHistoryOmit
    positionHistory?: PositionHistoryOmit
    employeeInfo?: EmployeeInfoOmit
    departmentInfoHistory?: DepartmentInfoHistoryOmit
    departmentInfo?: DepartmentInfoOmit
    personalInfoHistory?: PersonalInfoHistoryOmit
    companyInfo?: CompanyInfoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type EmployeeInfoCountOutputType
   */

  export type EmployeeInfoCountOutputType = {
    positions: number
    personal_histories: number
    department_histories: number
  }

  export type EmployeeInfoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    positions?: boolean | EmployeeInfoCountOutputTypeCountPositionsArgs
    personal_histories?: boolean | EmployeeInfoCountOutputTypeCountPersonal_historiesArgs
    department_histories?: boolean | EmployeeInfoCountOutputTypeCountDepartment_historiesArgs
  }

  // Custom InputTypes
  /**
   * EmployeeInfoCountOutputType without action
   */
  export type EmployeeInfoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfoCountOutputType
     */
    select?: EmployeeInfoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EmployeeInfoCountOutputType without action
   */
  export type EmployeeInfoCountOutputTypeCountPositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PositionHistoryWhereInput
  }

  /**
   * EmployeeInfoCountOutputType without action
   */
  export type EmployeeInfoCountOutputTypeCountPersonal_historiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonalInfoHistoryWhereInput
  }

  /**
   * EmployeeInfoCountOutputType without action
   */
  export type EmployeeInfoCountOutputTypeCountDepartment_historiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentInfoHistoryWhereInput
  }


  /**
   * Count Type DepartmentInfoCountOutputType
   */

  export type DepartmentInfoCountOutputType = {
    department_histories: number
  }

  export type DepartmentInfoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department_histories?: boolean | DepartmentInfoCountOutputTypeCountDepartment_historiesArgs
  }

  // Custom InputTypes
  /**
   * DepartmentInfoCountOutputType without action
   */
  export type DepartmentInfoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoCountOutputType
     */
    select?: DepartmentInfoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentInfoCountOutputType without action
   */
  export type DepartmentInfoCountOutputTypeCountDepartment_historiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentInfoHistoryWhereInput
  }


  /**
   * Count Type CompanyInfoCountOutputType
   */

  export type CompanyInfoCountOutputType = {
    employees: number
  }

  export type CompanyInfoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | CompanyInfoCountOutputTypeCountEmployeesArgs
  }

  // Custom InputTypes
  /**
   * CompanyInfoCountOutputType without action
   */
  export type CompanyInfoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfoCountOutputType
     */
    select?: CompanyInfoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyInfoCountOutputType without action
   */
  export type CompanyInfoCountOutputTypeCountEmployeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeInfoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model EmployeeStatusHistory
   */

  export type AggregateEmployeeStatusHistory = {
    _count: EmployeeStatusHistoryCountAggregateOutputType | null
    _avg: EmployeeStatusHistoryAvgAggregateOutputType | null
    _sum: EmployeeStatusHistorySumAggregateOutputType | null
    _min: EmployeeStatusHistoryMinAggregateOutputType | null
    _max: EmployeeStatusHistoryMaxAggregateOutputType | null
  }

  export type EmployeeStatusHistoryAvgAggregateOutputType = {
    id: number | null
    employee_number: number | null
    joined_year: number | null
    retired_year: number | null
  }

  export type EmployeeStatusHistorySumAggregateOutputType = {
    id: number | null
    employee_number: number | null
    joined_year: number | null
    retired_year: number | null
  }

  export type EmployeeStatusHistoryMinAggregateOutputType = {
    id: number | null
    employee_number: number | null
    joined_year: number | null
    retired_year: number | null
    data_updated_at: Date | null
    data_added_at: Date | null
    is_visible: boolean | null
  }

  export type EmployeeStatusHistoryMaxAggregateOutputType = {
    id: number | null
    employee_number: number | null
    joined_year: number | null
    retired_year: number | null
    data_updated_at: Date | null
    data_added_at: Date | null
    is_visible: boolean | null
  }

  export type EmployeeStatusHistoryCountAggregateOutputType = {
    id: number
    employee_number: number
    joined_year: number
    retired_year: number
    data_updated_at: number
    data_added_at: number
    is_visible: number
    _all: number
  }


  export type EmployeeStatusHistoryAvgAggregateInputType = {
    id?: true
    employee_number?: true
    joined_year?: true
    retired_year?: true
  }

  export type EmployeeStatusHistorySumAggregateInputType = {
    id?: true
    employee_number?: true
    joined_year?: true
    retired_year?: true
  }

  export type EmployeeStatusHistoryMinAggregateInputType = {
    id?: true
    employee_number?: true
    joined_year?: true
    retired_year?: true
    data_updated_at?: true
    data_added_at?: true
    is_visible?: true
  }

  export type EmployeeStatusHistoryMaxAggregateInputType = {
    id?: true
    employee_number?: true
    joined_year?: true
    retired_year?: true
    data_updated_at?: true
    data_added_at?: true
    is_visible?: true
  }

  export type EmployeeStatusHistoryCountAggregateInputType = {
    id?: true
    employee_number?: true
    joined_year?: true
    retired_year?: true
    data_updated_at?: true
    data_added_at?: true
    is_visible?: true
    _all?: true
  }

  export type EmployeeStatusHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmployeeStatusHistory to aggregate.
     */
    where?: EmployeeStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeStatusHistories to fetch.
     */
    orderBy?: EmployeeStatusHistoryOrderByWithRelationInput | EmployeeStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmployeeStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmployeeStatusHistories
    **/
    _count?: true | EmployeeStatusHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmployeeStatusHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmployeeStatusHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmployeeStatusHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmployeeStatusHistoryMaxAggregateInputType
  }

  export type GetEmployeeStatusHistoryAggregateType<T extends EmployeeStatusHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateEmployeeStatusHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmployeeStatusHistory[P]>
      : GetScalarType<T[P], AggregateEmployeeStatusHistory[P]>
  }




  export type EmployeeStatusHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeStatusHistoryWhereInput
    orderBy?: EmployeeStatusHistoryOrderByWithAggregationInput | EmployeeStatusHistoryOrderByWithAggregationInput[]
    by: EmployeeStatusHistoryScalarFieldEnum[] | EmployeeStatusHistoryScalarFieldEnum
    having?: EmployeeStatusHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmployeeStatusHistoryCountAggregateInputType | true
    _avg?: EmployeeStatusHistoryAvgAggregateInputType
    _sum?: EmployeeStatusHistorySumAggregateInputType
    _min?: EmployeeStatusHistoryMinAggregateInputType
    _max?: EmployeeStatusHistoryMaxAggregateInputType
  }

  export type EmployeeStatusHistoryGroupByOutputType = {
    id: number
    employee_number: number
    joined_year: number
    retired_year: number | null
    data_updated_at: Date
    data_added_at: Date
    is_visible: boolean
    _count: EmployeeStatusHistoryCountAggregateOutputType | null
    _avg: EmployeeStatusHistoryAvgAggregateOutputType | null
    _sum: EmployeeStatusHistorySumAggregateOutputType | null
    _min: EmployeeStatusHistoryMinAggregateOutputType | null
    _max: EmployeeStatusHistoryMaxAggregateOutputType | null
  }

  type GetEmployeeStatusHistoryGroupByPayload<T extends EmployeeStatusHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmployeeStatusHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmployeeStatusHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmployeeStatusHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], EmployeeStatusHistoryGroupByOutputType[P]>
        }
      >
    >


  export type EmployeeStatusHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_number?: boolean
    joined_year?: boolean
    retired_year?: boolean
    data_updated_at?: boolean
    data_added_at?: boolean
    is_visible?: boolean
  }, ExtArgs["result"]["employeeStatusHistory"]>

  export type EmployeeStatusHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_number?: boolean
    joined_year?: boolean
    retired_year?: boolean
    data_updated_at?: boolean
    data_added_at?: boolean
    is_visible?: boolean
  }, ExtArgs["result"]["employeeStatusHistory"]>

  export type EmployeeStatusHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_number?: boolean
    joined_year?: boolean
    retired_year?: boolean
    data_updated_at?: boolean
    data_added_at?: boolean
    is_visible?: boolean
  }, ExtArgs["result"]["employeeStatusHistory"]>

  export type EmployeeStatusHistorySelectScalar = {
    id?: boolean
    employee_number?: boolean
    joined_year?: boolean
    retired_year?: boolean
    data_updated_at?: boolean
    data_added_at?: boolean
    is_visible?: boolean
  }

  export type EmployeeStatusHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employee_number" | "joined_year" | "retired_year" | "data_updated_at" | "data_added_at" | "is_visible", ExtArgs["result"]["employeeStatusHistory"]>

  export type $EmployeeStatusHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmployeeStatusHistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employee_number: number
      joined_year: number
      retired_year: number | null
      data_updated_at: Date
      data_added_at: Date
      is_visible: boolean
    }, ExtArgs["result"]["employeeStatusHistory"]>
    composites: {}
  }

  type EmployeeStatusHistoryGetPayload<S extends boolean | null | undefined | EmployeeStatusHistoryDefaultArgs> = $Result.GetResult<Prisma.$EmployeeStatusHistoryPayload, S>

  type EmployeeStatusHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmployeeStatusHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmployeeStatusHistoryCountAggregateInputType | true
    }

  export interface EmployeeStatusHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmployeeStatusHistory'], meta: { name: 'EmployeeStatusHistory' } }
    /**
     * Find zero or one EmployeeStatusHistory that matches the filter.
     * @param {EmployeeStatusHistoryFindUniqueArgs} args - Arguments to find a EmployeeStatusHistory
     * @example
     * // Get one EmployeeStatusHistory
     * const employeeStatusHistory = await prisma.employeeStatusHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmployeeStatusHistoryFindUniqueArgs>(args: SelectSubset<T, EmployeeStatusHistoryFindUniqueArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EmployeeStatusHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmployeeStatusHistoryFindUniqueOrThrowArgs} args - Arguments to find a EmployeeStatusHistory
     * @example
     * // Get one EmployeeStatusHistory
     * const employeeStatusHistory = await prisma.employeeStatusHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmployeeStatusHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, EmployeeStatusHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmployeeStatusHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeStatusHistoryFindFirstArgs} args - Arguments to find a EmployeeStatusHistory
     * @example
     * // Get one EmployeeStatusHistory
     * const employeeStatusHistory = await prisma.employeeStatusHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmployeeStatusHistoryFindFirstArgs>(args?: SelectSubset<T, EmployeeStatusHistoryFindFirstArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmployeeStatusHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeStatusHistoryFindFirstOrThrowArgs} args - Arguments to find a EmployeeStatusHistory
     * @example
     * // Get one EmployeeStatusHistory
     * const employeeStatusHistory = await prisma.employeeStatusHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmployeeStatusHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, EmployeeStatusHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EmployeeStatusHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeStatusHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmployeeStatusHistories
     * const employeeStatusHistories = await prisma.employeeStatusHistory.findMany()
     * 
     * // Get first 10 EmployeeStatusHistories
     * const employeeStatusHistories = await prisma.employeeStatusHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const employeeStatusHistoryWithIdOnly = await prisma.employeeStatusHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmployeeStatusHistoryFindManyArgs>(args?: SelectSubset<T, EmployeeStatusHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EmployeeStatusHistory.
     * @param {EmployeeStatusHistoryCreateArgs} args - Arguments to create a EmployeeStatusHistory.
     * @example
     * // Create one EmployeeStatusHistory
     * const EmployeeStatusHistory = await prisma.employeeStatusHistory.create({
     *   data: {
     *     // ... data to create a EmployeeStatusHistory
     *   }
     * })
     * 
     */
    create<T extends EmployeeStatusHistoryCreateArgs>(args: SelectSubset<T, EmployeeStatusHistoryCreateArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EmployeeStatusHistories.
     * @param {EmployeeStatusHistoryCreateManyArgs} args - Arguments to create many EmployeeStatusHistories.
     * @example
     * // Create many EmployeeStatusHistories
     * const employeeStatusHistory = await prisma.employeeStatusHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmployeeStatusHistoryCreateManyArgs>(args?: SelectSubset<T, EmployeeStatusHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmployeeStatusHistories and returns the data saved in the database.
     * @param {EmployeeStatusHistoryCreateManyAndReturnArgs} args - Arguments to create many EmployeeStatusHistories.
     * @example
     * // Create many EmployeeStatusHistories
     * const employeeStatusHistory = await prisma.employeeStatusHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmployeeStatusHistories and only return the `id`
     * const employeeStatusHistoryWithIdOnly = await prisma.employeeStatusHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmployeeStatusHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, EmployeeStatusHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EmployeeStatusHistory.
     * @param {EmployeeStatusHistoryDeleteArgs} args - Arguments to delete one EmployeeStatusHistory.
     * @example
     * // Delete one EmployeeStatusHistory
     * const EmployeeStatusHistory = await prisma.employeeStatusHistory.delete({
     *   where: {
     *     // ... filter to delete one EmployeeStatusHistory
     *   }
     * })
     * 
     */
    delete<T extends EmployeeStatusHistoryDeleteArgs>(args: SelectSubset<T, EmployeeStatusHistoryDeleteArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EmployeeStatusHistory.
     * @param {EmployeeStatusHistoryUpdateArgs} args - Arguments to update one EmployeeStatusHistory.
     * @example
     * // Update one EmployeeStatusHistory
     * const employeeStatusHistory = await prisma.employeeStatusHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmployeeStatusHistoryUpdateArgs>(args: SelectSubset<T, EmployeeStatusHistoryUpdateArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EmployeeStatusHistories.
     * @param {EmployeeStatusHistoryDeleteManyArgs} args - Arguments to filter EmployeeStatusHistories to delete.
     * @example
     * // Delete a few EmployeeStatusHistories
     * const { count } = await prisma.employeeStatusHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmployeeStatusHistoryDeleteManyArgs>(args?: SelectSubset<T, EmployeeStatusHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmployeeStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeStatusHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmployeeStatusHistories
     * const employeeStatusHistory = await prisma.employeeStatusHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmployeeStatusHistoryUpdateManyArgs>(args: SelectSubset<T, EmployeeStatusHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmployeeStatusHistories and returns the data updated in the database.
     * @param {EmployeeStatusHistoryUpdateManyAndReturnArgs} args - Arguments to update many EmployeeStatusHistories.
     * @example
     * // Update many EmployeeStatusHistories
     * const employeeStatusHistory = await prisma.employeeStatusHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EmployeeStatusHistories and only return the `id`
     * const employeeStatusHistoryWithIdOnly = await prisma.employeeStatusHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EmployeeStatusHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, EmployeeStatusHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EmployeeStatusHistory.
     * @param {EmployeeStatusHistoryUpsertArgs} args - Arguments to update or create a EmployeeStatusHistory.
     * @example
     * // Update or create a EmployeeStatusHistory
     * const employeeStatusHistory = await prisma.employeeStatusHistory.upsert({
     *   create: {
     *     // ... data to create a EmployeeStatusHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmployeeStatusHistory we want to update
     *   }
     * })
     */
    upsert<T extends EmployeeStatusHistoryUpsertArgs>(args: SelectSubset<T, EmployeeStatusHistoryUpsertArgs<ExtArgs>>): Prisma__EmployeeStatusHistoryClient<$Result.GetResult<Prisma.$EmployeeStatusHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EmployeeStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeStatusHistoryCountArgs} args - Arguments to filter EmployeeStatusHistories to count.
     * @example
     * // Count the number of EmployeeStatusHistories
     * const count = await prisma.employeeStatusHistory.count({
     *   where: {
     *     // ... the filter for the EmployeeStatusHistories we want to count
     *   }
     * })
    **/
    count<T extends EmployeeStatusHistoryCountArgs>(
      args?: Subset<T, EmployeeStatusHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmployeeStatusHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmployeeStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeStatusHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmployeeStatusHistoryAggregateArgs>(args: Subset<T, EmployeeStatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetEmployeeStatusHistoryAggregateType<T>>

    /**
     * Group by EmployeeStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeStatusHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmployeeStatusHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmployeeStatusHistoryGroupByArgs['orderBy'] }
        : { orderBy?: EmployeeStatusHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmployeeStatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmployeeStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmployeeStatusHistory model
   */
  readonly fields: EmployeeStatusHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmployeeStatusHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmployeeStatusHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmployeeStatusHistory model
   */
  interface EmployeeStatusHistoryFieldRefs {
    readonly id: FieldRef<"EmployeeStatusHistory", 'Int'>
    readonly employee_number: FieldRef<"EmployeeStatusHistory", 'Int'>
    readonly joined_year: FieldRef<"EmployeeStatusHistory", 'Int'>
    readonly retired_year: FieldRef<"EmployeeStatusHistory", 'Int'>
    readonly data_updated_at: FieldRef<"EmployeeStatusHistory", 'DateTime'>
    readonly data_added_at: FieldRef<"EmployeeStatusHistory", 'DateTime'>
    readonly is_visible: FieldRef<"EmployeeStatusHistory", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * EmployeeStatusHistory findUnique
   */
  export type EmployeeStatusHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * Filter, which EmployeeStatusHistory to fetch.
     */
    where: EmployeeStatusHistoryWhereUniqueInput
  }

  /**
   * EmployeeStatusHistory findUniqueOrThrow
   */
  export type EmployeeStatusHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * Filter, which EmployeeStatusHistory to fetch.
     */
    where: EmployeeStatusHistoryWhereUniqueInput
  }

  /**
   * EmployeeStatusHistory findFirst
   */
  export type EmployeeStatusHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * Filter, which EmployeeStatusHistory to fetch.
     */
    where?: EmployeeStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeStatusHistories to fetch.
     */
    orderBy?: EmployeeStatusHistoryOrderByWithRelationInput | EmployeeStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmployeeStatusHistories.
     */
    cursor?: EmployeeStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmployeeStatusHistories.
     */
    distinct?: EmployeeStatusHistoryScalarFieldEnum | EmployeeStatusHistoryScalarFieldEnum[]
  }

  /**
   * EmployeeStatusHistory findFirstOrThrow
   */
  export type EmployeeStatusHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * Filter, which EmployeeStatusHistory to fetch.
     */
    where?: EmployeeStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeStatusHistories to fetch.
     */
    orderBy?: EmployeeStatusHistoryOrderByWithRelationInput | EmployeeStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmployeeStatusHistories.
     */
    cursor?: EmployeeStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmployeeStatusHistories.
     */
    distinct?: EmployeeStatusHistoryScalarFieldEnum | EmployeeStatusHistoryScalarFieldEnum[]
  }

  /**
   * EmployeeStatusHistory findMany
   */
  export type EmployeeStatusHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * Filter, which EmployeeStatusHistories to fetch.
     */
    where?: EmployeeStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeStatusHistories to fetch.
     */
    orderBy?: EmployeeStatusHistoryOrderByWithRelationInput | EmployeeStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmployeeStatusHistories.
     */
    cursor?: EmployeeStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeStatusHistories.
     */
    skip?: number
    distinct?: EmployeeStatusHistoryScalarFieldEnum | EmployeeStatusHistoryScalarFieldEnum[]
  }

  /**
   * EmployeeStatusHistory create
   */
  export type EmployeeStatusHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * The data needed to create a EmployeeStatusHistory.
     */
    data: XOR<EmployeeStatusHistoryCreateInput, EmployeeStatusHistoryUncheckedCreateInput>
  }

  /**
   * EmployeeStatusHistory createMany
   */
  export type EmployeeStatusHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmployeeStatusHistories.
     */
    data: EmployeeStatusHistoryCreateManyInput | EmployeeStatusHistoryCreateManyInput[]
  }

  /**
   * EmployeeStatusHistory createManyAndReturn
   */
  export type EmployeeStatusHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many EmployeeStatusHistories.
     */
    data: EmployeeStatusHistoryCreateManyInput | EmployeeStatusHistoryCreateManyInput[]
  }

  /**
   * EmployeeStatusHistory update
   */
  export type EmployeeStatusHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * The data needed to update a EmployeeStatusHistory.
     */
    data: XOR<EmployeeStatusHistoryUpdateInput, EmployeeStatusHistoryUncheckedUpdateInput>
    /**
     * Choose, which EmployeeStatusHistory to update.
     */
    where: EmployeeStatusHistoryWhereUniqueInput
  }

  /**
   * EmployeeStatusHistory updateMany
   */
  export type EmployeeStatusHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmployeeStatusHistories.
     */
    data: XOR<EmployeeStatusHistoryUpdateManyMutationInput, EmployeeStatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which EmployeeStatusHistories to update
     */
    where?: EmployeeStatusHistoryWhereInput
    /**
     * Limit how many EmployeeStatusHistories to update.
     */
    limit?: number
  }

  /**
   * EmployeeStatusHistory updateManyAndReturn
   */
  export type EmployeeStatusHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * The data used to update EmployeeStatusHistories.
     */
    data: XOR<EmployeeStatusHistoryUpdateManyMutationInput, EmployeeStatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which EmployeeStatusHistories to update
     */
    where?: EmployeeStatusHistoryWhereInput
    /**
     * Limit how many EmployeeStatusHistories to update.
     */
    limit?: number
  }

  /**
   * EmployeeStatusHistory upsert
   */
  export type EmployeeStatusHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * The filter to search for the EmployeeStatusHistory to update in case it exists.
     */
    where: EmployeeStatusHistoryWhereUniqueInput
    /**
     * In case the EmployeeStatusHistory found by the `where` argument doesn't exist, create a new EmployeeStatusHistory with this data.
     */
    create: XOR<EmployeeStatusHistoryCreateInput, EmployeeStatusHistoryUncheckedCreateInput>
    /**
     * In case the EmployeeStatusHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmployeeStatusHistoryUpdateInput, EmployeeStatusHistoryUncheckedUpdateInput>
  }

  /**
   * EmployeeStatusHistory delete
   */
  export type EmployeeStatusHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
    /**
     * Filter which EmployeeStatusHistory to delete.
     */
    where: EmployeeStatusHistoryWhereUniqueInput
  }

  /**
   * EmployeeStatusHistory deleteMany
   */
  export type EmployeeStatusHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmployeeStatusHistories to delete
     */
    where?: EmployeeStatusHistoryWhereInput
    /**
     * Limit how many EmployeeStatusHistories to delete.
     */
    limit?: number
  }

  /**
   * EmployeeStatusHistory without action
   */
  export type EmployeeStatusHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeStatusHistory
     */
    select?: EmployeeStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeStatusHistory
     */
    omit?: EmployeeStatusHistoryOmit<ExtArgs> | null
  }


  /**
   * Model PositionHistory
   */

  export type AggregatePositionHistory = {
    _count: PositionHistoryCountAggregateOutputType | null
    _avg: PositionHistoryAvgAggregateOutputType | null
    _sum: PositionHistorySumAggregateOutputType | null
    _min: PositionHistoryMinAggregateOutputType | null
    _max: PositionHistoryMaxAggregateOutputType | null
  }

  export type PositionHistoryAvgAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
  }

  export type PositionHistorySumAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
  }

  export type PositionHistoryMinAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    position: string | null
    added_at: Date | null
    add_reason: string | null
  }

  export type PositionHistoryMaxAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    position: string | null
    added_at: Date | null
    add_reason: string | null
  }

  export type PositionHistoryCountAggregateOutputType = {
    id: number
    employee_info_id: number
    position: number
    added_at: number
    add_reason: number
    _all: number
  }


  export type PositionHistoryAvgAggregateInputType = {
    id?: true
    employee_info_id?: true
  }

  export type PositionHistorySumAggregateInputType = {
    id?: true
    employee_info_id?: true
  }

  export type PositionHistoryMinAggregateInputType = {
    id?: true
    employee_info_id?: true
    position?: true
    added_at?: true
    add_reason?: true
  }

  export type PositionHistoryMaxAggregateInputType = {
    id?: true
    employee_info_id?: true
    position?: true
    added_at?: true
    add_reason?: true
  }

  export type PositionHistoryCountAggregateInputType = {
    id?: true
    employee_info_id?: true
    position?: true
    added_at?: true
    add_reason?: true
    _all?: true
  }

  export type PositionHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PositionHistory to aggregate.
     */
    where?: PositionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PositionHistories to fetch.
     */
    orderBy?: PositionHistoryOrderByWithRelationInput | PositionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PositionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PositionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PositionHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PositionHistories
    **/
    _count?: true | PositionHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PositionHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PositionHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PositionHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PositionHistoryMaxAggregateInputType
  }

  export type GetPositionHistoryAggregateType<T extends PositionHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePositionHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePositionHistory[P]>
      : GetScalarType<T[P], AggregatePositionHistory[P]>
  }




  export type PositionHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PositionHistoryWhereInput
    orderBy?: PositionHistoryOrderByWithAggregationInput | PositionHistoryOrderByWithAggregationInput[]
    by: PositionHistoryScalarFieldEnum[] | PositionHistoryScalarFieldEnum
    having?: PositionHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PositionHistoryCountAggregateInputType | true
    _avg?: PositionHistoryAvgAggregateInputType
    _sum?: PositionHistorySumAggregateInputType
    _min?: PositionHistoryMinAggregateInputType
    _max?: PositionHistoryMaxAggregateInputType
  }

  export type PositionHistoryGroupByOutputType = {
    id: number
    employee_info_id: number
    position: string
    added_at: Date
    add_reason: string | null
    _count: PositionHistoryCountAggregateOutputType | null
    _avg: PositionHistoryAvgAggregateOutputType | null
    _sum: PositionHistorySumAggregateOutputType | null
    _min: PositionHistoryMinAggregateOutputType | null
    _max: PositionHistoryMaxAggregateOutputType | null
  }

  type GetPositionHistoryGroupByPayload<T extends PositionHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PositionHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PositionHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PositionHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PositionHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PositionHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    position?: boolean
    added_at?: boolean
    add_reason?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["positionHistory"]>

  export type PositionHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    position?: boolean
    added_at?: boolean
    add_reason?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["positionHistory"]>

  export type PositionHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    position?: boolean
    added_at?: boolean
    add_reason?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["positionHistory"]>

  export type PositionHistorySelectScalar = {
    id?: boolean
    employee_info_id?: boolean
    position?: boolean
    added_at?: boolean
    add_reason?: boolean
  }

  export type PositionHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employee_info_id" | "position" | "added_at" | "add_reason", ExtArgs["result"]["positionHistory"]>
  export type PositionHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }
  export type PositionHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }
  export type PositionHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }

  export type $PositionHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PositionHistory"
    objects: {
      employee_info: Prisma.$EmployeeInfoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employee_info_id: number
      position: string
      added_at: Date
      add_reason: string | null
    }, ExtArgs["result"]["positionHistory"]>
    composites: {}
  }

  type PositionHistoryGetPayload<S extends boolean | null | undefined | PositionHistoryDefaultArgs> = $Result.GetResult<Prisma.$PositionHistoryPayload, S>

  type PositionHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PositionHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PositionHistoryCountAggregateInputType | true
    }

  export interface PositionHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PositionHistory'], meta: { name: 'PositionHistory' } }
    /**
     * Find zero or one PositionHistory that matches the filter.
     * @param {PositionHistoryFindUniqueArgs} args - Arguments to find a PositionHistory
     * @example
     * // Get one PositionHistory
     * const positionHistory = await prisma.positionHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PositionHistoryFindUniqueArgs>(args: SelectSubset<T, PositionHistoryFindUniqueArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PositionHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PositionHistoryFindUniqueOrThrowArgs} args - Arguments to find a PositionHistory
     * @example
     * // Get one PositionHistory
     * const positionHistory = await prisma.positionHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PositionHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PositionHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PositionHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionHistoryFindFirstArgs} args - Arguments to find a PositionHistory
     * @example
     * // Get one PositionHistory
     * const positionHistory = await prisma.positionHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PositionHistoryFindFirstArgs>(args?: SelectSubset<T, PositionHistoryFindFirstArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PositionHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionHistoryFindFirstOrThrowArgs} args - Arguments to find a PositionHistory
     * @example
     * // Get one PositionHistory
     * const positionHistory = await prisma.positionHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PositionHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PositionHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PositionHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PositionHistories
     * const positionHistories = await prisma.positionHistory.findMany()
     * 
     * // Get first 10 PositionHistories
     * const positionHistories = await prisma.positionHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const positionHistoryWithIdOnly = await prisma.positionHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PositionHistoryFindManyArgs>(args?: SelectSubset<T, PositionHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PositionHistory.
     * @param {PositionHistoryCreateArgs} args - Arguments to create a PositionHistory.
     * @example
     * // Create one PositionHistory
     * const PositionHistory = await prisma.positionHistory.create({
     *   data: {
     *     // ... data to create a PositionHistory
     *   }
     * })
     * 
     */
    create<T extends PositionHistoryCreateArgs>(args: SelectSubset<T, PositionHistoryCreateArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PositionHistories.
     * @param {PositionHistoryCreateManyArgs} args - Arguments to create many PositionHistories.
     * @example
     * // Create many PositionHistories
     * const positionHistory = await prisma.positionHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PositionHistoryCreateManyArgs>(args?: SelectSubset<T, PositionHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PositionHistories and returns the data saved in the database.
     * @param {PositionHistoryCreateManyAndReturnArgs} args - Arguments to create many PositionHistories.
     * @example
     * // Create many PositionHistories
     * const positionHistory = await prisma.positionHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PositionHistories and only return the `id`
     * const positionHistoryWithIdOnly = await prisma.positionHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PositionHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PositionHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PositionHistory.
     * @param {PositionHistoryDeleteArgs} args - Arguments to delete one PositionHistory.
     * @example
     * // Delete one PositionHistory
     * const PositionHistory = await prisma.positionHistory.delete({
     *   where: {
     *     // ... filter to delete one PositionHistory
     *   }
     * })
     * 
     */
    delete<T extends PositionHistoryDeleteArgs>(args: SelectSubset<T, PositionHistoryDeleteArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PositionHistory.
     * @param {PositionHistoryUpdateArgs} args - Arguments to update one PositionHistory.
     * @example
     * // Update one PositionHistory
     * const positionHistory = await prisma.positionHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PositionHistoryUpdateArgs>(args: SelectSubset<T, PositionHistoryUpdateArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PositionHistories.
     * @param {PositionHistoryDeleteManyArgs} args - Arguments to filter PositionHistories to delete.
     * @example
     * // Delete a few PositionHistories
     * const { count } = await prisma.positionHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PositionHistoryDeleteManyArgs>(args?: SelectSubset<T, PositionHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PositionHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PositionHistories
     * const positionHistory = await prisma.positionHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PositionHistoryUpdateManyArgs>(args: SelectSubset<T, PositionHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PositionHistories and returns the data updated in the database.
     * @param {PositionHistoryUpdateManyAndReturnArgs} args - Arguments to update many PositionHistories.
     * @example
     * // Update many PositionHistories
     * const positionHistory = await prisma.positionHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PositionHistories and only return the `id`
     * const positionHistoryWithIdOnly = await prisma.positionHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PositionHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, PositionHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PositionHistory.
     * @param {PositionHistoryUpsertArgs} args - Arguments to update or create a PositionHistory.
     * @example
     * // Update or create a PositionHistory
     * const positionHistory = await prisma.positionHistory.upsert({
     *   create: {
     *     // ... data to create a PositionHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PositionHistory we want to update
     *   }
     * })
     */
    upsert<T extends PositionHistoryUpsertArgs>(args: SelectSubset<T, PositionHistoryUpsertArgs<ExtArgs>>): Prisma__PositionHistoryClient<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PositionHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionHistoryCountArgs} args - Arguments to filter PositionHistories to count.
     * @example
     * // Count the number of PositionHistories
     * const count = await prisma.positionHistory.count({
     *   where: {
     *     // ... the filter for the PositionHistories we want to count
     *   }
     * })
    **/
    count<T extends PositionHistoryCountArgs>(
      args?: Subset<T, PositionHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PositionHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PositionHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PositionHistoryAggregateArgs>(args: Subset<T, PositionHistoryAggregateArgs>): Prisma.PrismaPromise<GetPositionHistoryAggregateType<T>>

    /**
     * Group by PositionHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PositionHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PositionHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PositionHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PositionHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPositionHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PositionHistory model
   */
  readonly fields: PositionHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PositionHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PositionHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee_info<T extends EmployeeInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeInfoDefaultArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PositionHistory model
   */
  interface PositionHistoryFieldRefs {
    readonly id: FieldRef<"PositionHistory", 'Int'>
    readonly employee_info_id: FieldRef<"PositionHistory", 'Int'>
    readonly position: FieldRef<"PositionHistory", 'String'>
    readonly added_at: FieldRef<"PositionHistory", 'DateTime'>
    readonly add_reason: FieldRef<"PositionHistory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PositionHistory findUnique
   */
  export type PositionHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PositionHistory to fetch.
     */
    where: PositionHistoryWhereUniqueInput
  }

  /**
   * PositionHistory findUniqueOrThrow
   */
  export type PositionHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PositionHistory to fetch.
     */
    where: PositionHistoryWhereUniqueInput
  }

  /**
   * PositionHistory findFirst
   */
  export type PositionHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PositionHistory to fetch.
     */
    where?: PositionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PositionHistories to fetch.
     */
    orderBy?: PositionHistoryOrderByWithRelationInput | PositionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PositionHistories.
     */
    cursor?: PositionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PositionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PositionHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PositionHistories.
     */
    distinct?: PositionHistoryScalarFieldEnum | PositionHistoryScalarFieldEnum[]
  }

  /**
   * PositionHistory findFirstOrThrow
   */
  export type PositionHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PositionHistory to fetch.
     */
    where?: PositionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PositionHistories to fetch.
     */
    orderBy?: PositionHistoryOrderByWithRelationInput | PositionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PositionHistories.
     */
    cursor?: PositionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PositionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PositionHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PositionHistories.
     */
    distinct?: PositionHistoryScalarFieldEnum | PositionHistoryScalarFieldEnum[]
  }

  /**
   * PositionHistory findMany
   */
  export type PositionHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PositionHistories to fetch.
     */
    where?: PositionHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PositionHistories to fetch.
     */
    orderBy?: PositionHistoryOrderByWithRelationInput | PositionHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PositionHistories.
     */
    cursor?: PositionHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PositionHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PositionHistories.
     */
    skip?: number
    distinct?: PositionHistoryScalarFieldEnum | PositionHistoryScalarFieldEnum[]
  }

  /**
   * PositionHistory create
   */
  export type PositionHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PositionHistory.
     */
    data: XOR<PositionHistoryCreateInput, PositionHistoryUncheckedCreateInput>
  }

  /**
   * PositionHistory createMany
   */
  export type PositionHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PositionHistories.
     */
    data: PositionHistoryCreateManyInput | PositionHistoryCreateManyInput[]
  }

  /**
   * PositionHistory createManyAndReturn
   */
  export type PositionHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many PositionHistories.
     */
    data: PositionHistoryCreateManyInput | PositionHistoryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PositionHistory update
   */
  export type PositionHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PositionHistory.
     */
    data: XOR<PositionHistoryUpdateInput, PositionHistoryUncheckedUpdateInput>
    /**
     * Choose, which PositionHistory to update.
     */
    where: PositionHistoryWhereUniqueInput
  }

  /**
   * PositionHistory updateMany
   */
  export type PositionHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PositionHistories.
     */
    data: XOR<PositionHistoryUpdateManyMutationInput, PositionHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PositionHistories to update
     */
    where?: PositionHistoryWhereInput
    /**
     * Limit how many PositionHistories to update.
     */
    limit?: number
  }

  /**
   * PositionHistory updateManyAndReturn
   */
  export type PositionHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * The data used to update PositionHistories.
     */
    data: XOR<PositionHistoryUpdateManyMutationInput, PositionHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PositionHistories to update
     */
    where?: PositionHistoryWhereInput
    /**
     * Limit how many PositionHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PositionHistory upsert
   */
  export type PositionHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PositionHistory to update in case it exists.
     */
    where: PositionHistoryWhereUniqueInput
    /**
     * In case the PositionHistory found by the `where` argument doesn't exist, create a new PositionHistory with this data.
     */
    create: XOR<PositionHistoryCreateInput, PositionHistoryUncheckedCreateInput>
    /**
     * In case the PositionHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PositionHistoryUpdateInput, PositionHistoryUncheckedUpdateInput>
  }

  /**
   * PositionHistory delete
   */
  export type PositionHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    /**
     * Filter which PositionHistory to delete.
     */
    where: PositionHistoryWhereUniqueInput
  }

  /**
   * PositionHistory deleteMany
   */
  export type PositionHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PositionHistories to delete
     */
    where?: PositionHistoryWhereInput
    /**
     * Limit how many PositionHistories to delete.
     */
    limit?: number
  }

  /**
   * PositionHistory without action
   */
  export type PositionHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
  }


  /**
   * Model EmployeeInfo
   */

  export type AggregateEmployeeInfo = {
    _count: EmployeeInfoCountAggregateOutputType | null
    _avg: EmployeeInfoAvgAggregateOutputType | null
    _sum: EmployeeInfoSumAggregateOutputType | null
    _min: EmployeeInfoMinAggregateOutputType | null
    _max: EmployeeInfoMaxAggregateOutputType | null
  }

  export type EmployeeInfoAvgAggregateOutputType = {
    id: number | null
    employee_number: number | null
    department_id: number | null
    personal_info_id: number | null
    company_info_id: number | null
  }

  export type EmployeeInfoSumAggregateOutputType = {
    id: number | null
    employee_number: number | null
    department_id: number | null
    personal_info_id: number | null
    company_info_id: number | null
  }

  export type EmployeeInfoMinAggregateOutputType = {
    id: number | null
    employee_number: number | null
    department_id: number | null
    personal_info_id: number | null
    company_info_id: number | null
  }

  export type EmployeeInfoMaxAggregateOutputType = {
    id: number | null
    employee_number: number | null
    department_id: number | null
    personal_info_id: number | null
    company_info_id: number | null
  }

  export type EmployeeInfoCountAggregateOutputType = {
    id: number
    employee_number: number
    department_id: number
    personal_info_id: number
    company_info_id: number
    _all: number
  }


  export type EmployeeInfoAvgAggregateInputType = {
    id?: true
    employee_number?: true
    department_id?: true
    personal_info_id?: true
    company_info_id?: true
  }

  export type EmployeeInfoSumAggregateInputType = {
    id?: true
    employee_number?: true
    department_id?: true
    personal_info_id?: true
    company_info_id?: true
  }

  export type EmployeeInfoMinAggregateInputType = {
    id?: true
    employee_number?: true
    department_id?: true
    personal_info_id?: true
    company_info_id?: true
  }

  export type EmployeeInfoMaxAggregateInputType = {
    id?: true
    employee_number?: true
    department_id?: true
    personal_info_id?: true
    company_info_id?: true
  }

  export type EmployeeInfoCountAggregateInputType = {
    id?: true
    employee_number?: true
    department_id?: true
    personal_info_id?: true
    company_info_id?: true
    _all?: true
  }

  export type EmployeeInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmployeeInfo to aggregate.
     */
    where?: EmployeeInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeInfos to fetch.
     */
    orderBy?: EmployeeInfoOrderByWithRelationInput | EmployeeInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmployeeInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmployeeInfos
    **/
    _count?: true | EmployeeInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmployeeInfoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmployeeInfoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmployeeInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmployeeInfoMaxAggregateInputType
  }

  export type GetEmployeeInfoAggregateType<T extends EmployeeInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateEmployeeInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmployeeInfo[P]>
      : GetScalarType<T[P], AggregateEmployeeInfo[P]>
  }




  export type EmployeeInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeInfoWhereInput
    orderBy?: EmployeeInfoOrderByWithAggregationInput | EmployeeInfoOrderByWithAggregationInput[]
    by: EmployeeInfoScalarFieldEnum[] | EmployeeInfoScalarFieldEnum
    having?: EmployeeInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmployeeInfoCountAggregateInputType | true
    _avg?: EmployeeInfoAvgAggregateInputType
    _sum?: EmployeeInfoSumAggregateInputType
    _min?: EmployeeInfoMinAggregateInputType
    _max?: EmployeeInfoMaxAggregateInputType
  }

  export type EmployeeInfoGroupByOutputType = {
    id: number
    employee_number: number | null
    department_id: number | null
    personal_info_id: number | null
    company_info_id: number | null
    _count: EmployeeInfoCountAggregateOutputType | null
    _avg: EmployeeInfoAvgAggregateOutputType | null
    _sum: EmployeeInfoSumAggregateOutputType | null
    _min: EmployeeInfoMinAggregateOutputType | null
    _max: EmployeeInfoMaxAggregateOutputType | null
  }

  type GetEmployeeInfoGroupByPayload<T extends EmployeeInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmployeeInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmployeeInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmployeeInfoGroupByOutputType[P]>
            : GetScalarType<T[P], EmployeeInfoGroupByOutputType[P]>
        }
      >
    >


  export type EmployeeInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_number?: boolean
    department_id?: boolean
    personal_info_id?: boolean
    company_info_id?: boolean
    positions?: boolean | EmployeeInfo$positionsArgs<ExtArgs>
    personal_histories?: boolean | EmployeeInfo$personal_historiesArgs<ExtArgs>
    department_histories?: boolean | EmployeeInfo$department_historiesArgs<ExtArgs>
    company_info?: boolean | EmployeeInfo$company_infoArgs<ExtArgs>
    _count?: boolean | EmployeeInfoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["employeeInfo"]>

  export type EmployeeInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_number?: boolean
    department_id?: boolean
    personal_info_id?: boolean
    company_info_id?: boolean
    company_info?: boolean | EmployeeInfo$company_infoArgs<ExtArgs>
  }, ExtArgs["result"]["employeeInfo"]>

  export type EmployeeInfoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_number?: boolean
    department_id?: boolean
    personal_info_id?: boolean
    company_info_id?: boolean
    company_info?: boolean | EmployeeInfo$company_infoArgs<ExtArgs>
  }, ExtArgs["result"]["employeeInfo"]>

  export type EmployeeInfoSelectScalar = {
    id?: boolean
    employee_number?: boolean
    department_id?: boolean
    personal_info_id?: boolean
    company_info_id?: boolean
  }

  export type EmployeeInfoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employee_number" | "department_id" | "personal_info_id" | "company_info_id", ExtArgs["result"]["employeeInfo"]>
  export type EmployeeInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    positions?: boolean | EmployeeInfo$positionsArgs<ExtArgs>
    personal_histories?: boolean | EmployeeInfo$personal_historiesArgs<ExtArgs>
    department_histories?: boolean | EmployeeInfo$department_historiesArgs<ExtArgs>
    company_info?: boolean | EmployeeInfo$company_infoArgs<ExtArgs>
    _count?: boolean | EmployeeInfoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EmployeeInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company_info?: boolean | EmployeeInfo$company_infoArgs<ExtArgs>
  }
  export type EmployeeInfoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company_info?: boolean | EmployeeInfo$company_infoArgs<ExtArgs>
  }

  export type $EmployeeInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmployeeInfo"
    objects: {
      positions: Prisma.$PositionHistoryPayload<ExtArgs>[]
      personal_histories: Prisma.$PersonalInfoHistoryPayload<ExtArgs>[]
      department_histories: Prisma.$DepartmentInfoHistoryPayload<ExtArgs>[]
      company_info: Prisma.$CompanyInfoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employee_number: number | null
      department_id: number | null
      personal_info_id: number | null
      company_info_id: number | null
    }, ExtArgs["result"]["employeeInfo"]>
    composites: {}
  }

  type EmployeeInfoGetPayload<S extends boolean | null | undefined | EmployeeInfoDefaultArgs> = $Result.GetResult<Prisma.$EmployeeInfoPayload, S>

  type EmployeeInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmployeeInfoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmployeeInfoCountAggregateInputType | true
    }

  export interface EmployeeInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmployeeInfo'], meta: { name: 'EmployeeInfo' } }
    /**
     * Find zero or one EmployeeInfo that matches the filter.
     * @param {EmployeeInfoFindUniqueArgs} args - Arguments to find a EmployeeInfo
     * @example
     * // Get one EmployeeInfo
     * const employeeInfo = await prisma.employeeInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmployeeInfoFindUniqueArgs>(args: SelectSubset<T, EmployeeInfoFindUniqueArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EmployeeInfo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmployeeInfoFindUniqueOrThrowArgs} args - Arguments to find a EmployeeInfo
     * @example
     * // Get one EmployeeInfo
     * const employeeInfo = await prisma.employeeInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmployeeInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, EmployeeInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmployeeInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeInfoFindFirstArgs} args - Arguments to find a EmployeeInfo
     * @example
     * // Get one EmployeeInfo
     * const employeeInfo = await prisma.employeeInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmployeeInfoFindFirstArgs>(args?: SelectSubset<T, EmployeeInfoFindFirstArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmployeeInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeInfoFindFirstOrThrowArgs} args - Arguments to find a EmployeeInfo
     * @example
     * // Get one EmployeeInfo
     * const employeeInfo = await prisma.employeeInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmployeeInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, EmployeeInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EmployeeInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmployeeInfos
     * const employeeInfos = await prisma.employeeInfo.findMany()
     * 
     * // Get first 10 EmployeeInfos
     * const employeeInfos = await prisma.employeeInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const employeeInfoWithIdOnly = await prisma.employeeInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmployeeInfoFindManyArgs>(args?: SelectSubset<T, EmployeeInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EmployeeInfo.
     * @param {EmployeeInfoCreateArgs} args - Arguments to create a EmployeeInfo.
     * @example
     * // Create one EmployeeInfo
     * const EmployeeInfo = await prisma.employeeInfo.create({
     *   data: {
     *     // ... data to create a EmployeeInfo
     *   }
     * })
     * 
     */
    create<T extends EmployeeInfoCreateArgs>(args: SelectSubset<T, EmployeeInfoCreateArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EmployeeInfos.
     * @param {EmployeeInfoCreateManyArgs} args - Arguments to create many EmployeeInfos.
     * @example
     * // Create many EmployeeInfos
     * const employeeInfo = await prisma.employeeInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmployeeInfoCreateManyArgs>(args?: SelectSubset<T, EmployeeInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmployeeInfos and returns the data saved in the database.
     * @param {EmployeeInfoCreateManyAndReturnArgs} args - Arguments to create many EmployeeInfos.
     * @example
     * // Create many EmployeeInfos
     * const employeeInfo = await prisma.employeeInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmployeeInfos and only return the `id`
     * const employeeInfoWithIdOnly = await prisma.employeeInfo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmployeeInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, EmployeeInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EmployeeInfo.
     * @param {EmployeeInfoDeleteArgs} args - Arguments to delete one EmployeeInfo.
     * @example
     * // Delete one EmployeeInfo
     * const EmployeeInfo = await prisma.employeeInfo.delete({
     *   where: {
     *     // ... filter to delete one EmployeeInfo
     *   }
     * })
     * 
     */
    delete<T extends EmployeeInfoDeleteArgs>(args: SelectSubset<T, EmployeeInfoDeleteArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EmployeeInfo.
     * @param {EmployeeInfoUpdateArgs} args - Arguments to update one EmployeeInfo.
     * @example
     * // Update one EmployeeInfo
     * const employeeInfo = await prisma.employeeInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmployeeInfoUpdateArgs>(args: SelectSubset<T, EmployeeInfoUpdateArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EmployeeInfos.
     * @param {EmployeeInfoDeleteManyArgs} args - Arguments to filter EmployeeInfos to delete.
     * @example
     * // Delete a few EmployeeInfos
     * const { count } = await prisma.employeeInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmployeeInfoDeleteManyArgs>(args?: SelectSubset<T, EmployeeInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmployeeInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmployeeInfos
     * const employeeInfo = await prisma.employeeInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmployeeInfoUpdateManyArgs>(args: SelectSubset<T, EmployeeInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmployeeInfos and returns the data updated in the database.
     * @param {EmployeeInfoUpdateManyAndReturnArgs} args - Arguments to update many EmployeeInfos.
     * @example
     * // Update many EmployeeInfos
     * const employeeInfo = await prisma.employeeInfo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EmployeeInfos and only return the `id`
     * const employeeInfoWithIdOnly = await prisma.employeeInfo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EmployeeInfoUpdateManyAndReturnArgs>(args: SelectSubset<T, EmployeeInfoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EmployeeInfo.
     * @param {EmployeeInfoUpsertArgs} args - Arguments to update or create a EmployeeInfo.
     * @example
     * // Update or create a EmployeeInfo
     * const employeeInfo = await prisma.employeeInfo.upsert({
     *   create: {
     *     // ... data to create a EmployeeInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmployeeInfo we want to update
     *   }
     * })
     */
    upsert<T extends EmployeeInfoUpsertArgs>(args: SelectSubset<T, EmployeeInfoUpsertArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EmployeeInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeInfoCountArgs} args - Arguments to filter EmployeeInfos to count.
     * @example
     * // Count the number of EmployeeInfos
     * const count = await prisma.employeeInfo.count({
     *   where: {
     *     // ... the filter for the EmployeeInfos we want to count
     *   }
     * })
    **/
    count<T extends EmployeeInfoCountArgs>(
      args?: Subset<T, EmployeeInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmployeeInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmployeeInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmployeeInfoAggregateArgs>(args: Subset<T, EmployeeInfoAggregateArgs>): Prisma.PrismaPromise<GetEmployeeInfoAggregateType<T>>

    /**
     * Group by EmployeeInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmployeeInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmployeeInfoGroupByArgs['orderBy'] }
        : { orderBy?: EmployeeInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmployeeInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmployeeInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmployeeInfo model
   */
  readonly fields: EmployeeInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmployeeInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmployeeInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    positions<T extends EmployeeInfo$positionsArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeInfo$positionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    personal_histories<T extends EmployeeInfo$personal_historiesArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeInfo$personal_historiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    department_histories<T extends EmployeeInfo$department_historiesArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeInfo$department_historiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    company_info<T extends EmployeeInfo$company_infoArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeInfo$company_infoArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmployeeInfo model
   */
  interface EmployeeInfoFieldRefs {
    readonly id: FieldRef<"EmployeeInfo", 'Int'>
    readonly employee_number: FieldRef<"EmployeeInfo", 'Int'>
    readonly department_id: FieldRef<"EmployeeInfo", 'Int'>
    readonly personal_info_id: FieldRef<"EmployeeInfo", 'Int'>
    readonly company_info_id: FieldRef<"EmployeeInfo", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * EmployeeInfo findUnique
   */
  export type EmployeeInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * Filter, which EmployeeInfo to fetch.
     */
    where: EmployeeInfoWhereUniqueInput
  }

  /**
   * EmployeeInfo findUniqueOrThrow
   */
  export type EmployeeInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * Filter, which EmployeeInfo to fetch.
     */
    where: EmployeeInfoWhereUniqueInput
  }

  /**
   * EmployeeInfo findFirst
   */
  export type EmployeeInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * Filter, which EmployeeInfo to fetch.
     */
    where?: EmployeeInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeInfos to fetch.
     */
    orderBy?: EmployeeInfoOrderByWithRelationInput | EmployeeInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmployeeInfos.
     */
    cursor?: EmployeeInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmployeeInfos.
     */
    distinct?: EmployeeInfoScalarFieldEnum | EmployeeInfoScalarFieldEnum[]
  }

  /**
   * EmployeeInfo findFirstOrThrow
   */
  export type EmployeeInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * Filter, which EmployeeInfo to fetch.
     */
    where?: EmployeeInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeInfos to fetch.
     */
    orderBy?: EmployeeInfoOrderByWithRelationInput | EmployeeInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmployeeInfos.
     */
    cursor?: EmployeeInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmployeeInfos.
     */
    distinct?: EmployeeInfoScalarFieldEnum | EmployeeInfoScalarFieldEnum[]
  }

  /**
   * EmployeeInfo findMany
   */
  export type EmployeeInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * Filter, which EmployeeInfos to fetch.
     */
    where?: EmployeeInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmployeeInfos to fetch.
     */
    orderBy?: EmployeeInfoOrderByWithRelationInput | EmployeeInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmployeeInfos.
     */
    cursor?: EmployeeInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmployeeInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmployeeInfos.
     */
    skip?: number
    distinct?: EmployeeInfoScalarFieldEnum | EmployeeInfoScalarFieldEnum[]
  }

  /**
   * EmployeeInfo create
   */
  export type EmployeeInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a EmployeeInfo.
     */
    data?: XOR<EmployeeInfoCreateInput, EmployeeInfoUncheckedCreateInput>
  }

  /**
   * EmployeeInfo createMany
   */
  export type EmployeeInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmployeeInfos.
     */
    data: EmployeeInfoCreateManyInput | EmployeeInfoCreateManyInput[]
  }

  /**
   * EmployeeInfo createManyAndReturn
   */
  export type EmployeeInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * The data used to create many EmployeeInfos.
     */
    data: EmployeeInfoCreateManyInput | EmployeeInfoCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmployeeInfo update
   */
  export type EmployeeInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a EmployeeInfo.
     */
    data: XOR<EmployeeInfoUpdateInput, EmployeeInfoUncheckedUpdateInput>
    /**
     * Choose, which EmployeeInfo to update.
     */
    where: EmployeeInfoWhereUniqueInput
  }

  /**
   * EmployeeInfo updateMany
   */
  export type EmployeeInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmployeeInfos.
     */
    data: XOR<EmployeeInfoUpdateManyMutationInput, EmployeeInfoUncheckedUpdateManyInput>
    /**
     * Filter which EmployeeInfos to update
     */
    where?: EmployeeInfoWhereInput
    /**
     * Limit how many EmployeeInfos to update.
     */
    limit?: number
  }

  /**
   * EmployeeInfo updateManyAndReturn
   */
  export type EmployeeInfoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * The data used to update EmployeeInfos.
     */
    data: XOR<EmployeeInfoUpdateManyMutationInput, EmployeeInfoUncheckedUpdateManyInput>
    /**
     * Filter which EmployeeInfos to update
     */
    where?: EmployeeInfoWhereInput
    /**
     * Limit how many EmployeeInfos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmployeeInfo upsert
   */
  export type EmployeeInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the EmployeeInfo to update in case it exists.
     */
    where: EmployeeInfoWhereUniqueInput
    /**
     * In case the EmployeeInfo found by the `where` argument doesn't exist, create a new EmployeeInfo with this data.
     */
    create: XOR<EmployeeInfoCreateInput, EmployeeInfoUncheckedCreateInput>
    /**
     * In case the EmployeeInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmployeeInfoUpdateInput, EmployeeInfoUncheckedUpdateInput>
  }

  /**
   * EmployeeInfo delete
   */
  export type EmployeeInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    /**
     * Filter which EmployeeInfo to delete.
     */
    where: EmployeeInfoWhereUniqueInput
  }

  /**
   * EmployeeInfo deleteMany
   */
  export type EmployeeInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmployeeInfos to delete
     */
    where?: EmployeeInfoWhereInput
    /**
     * Limit how many EmployeeInfos to delete.
     */
    limit?: number
  }

  /**
   * EmployeeInfo.positions
   */
  export type EmployeeInfo$positionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionHistory
     */
    select?: PositionHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PositionHistory
     */
    omit?: PositionHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionHistoryInclude<ExtArgs> | null
    where?: PositionHistoryWhereInput
    orderBy?: PositionHistoryOrderByWithRelationInput | PositionHistoryOrderByWithRelationInput[]
    cursor?: PositionHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PositionHistoryScalarFieldEnum | PositionHistoryScalarFieldEnum[]
  }

  /**
   * EmployeeInfo.personal_histories
   */
  export type EmployeeInfo$personal_historiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    where?: PersonalInfoHistoryWhereInput
    orderBy?: PersonalInfoHistoryOrderByWithRelationInput | PersonalInfoHistoryOrderByWithRelationInput[]
    cursor?: PersonalInfoHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PersonalInfoHistoryScalarFieldEnum | PersonalInfoHistoryScalarFieldEnum[]
  }

  /**
   * EmployeeInfo.department_histories
   */
  export type EmployeeInfo$department_historiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    where?: DepartmentInfoHistoryWhereInput
    orderBy?: DepartmentInfoHistoryOrderByWithRelationInput | DepartmentInfoHistoryOrderByWithRelationInput[]
    cursor?: DepartmentInfoHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentInfoHistoryScalarFieldEnum | DepartmentInfoHistoryScalarFieldEnum[]
  }

  /**
   * EmployeeInfo.company_info
   */
  export type EmployeeInfo$company_infoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    where?: CompanyInfoWhereInput
  }

  /**
   * EmployeeInfo without action
   */
  export type EmployeeInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
  }


  /**
   * Model DepartmentInfoHistory
   */

  export type AggregateDepartmentInfoHistory = {
    _count: DepartmentInfoHistoryCountAggregateOutputType | null
    _avg: DepartmentInfoHistoryAvgAggregateOutputType | null
    _sum: DepartmentInfoHistorySumAggregateOutputType | null
    _min: DepartmentInfoHistoryMinAggregateOutputType | null
    _max: DepartmentInfoHistoryMaxAggregateOutputType | null
  }

  export type DepartmentInfoHistoryAvgAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    department_id: number | null
  }

  export type DepartmentInfoHistorySumAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    department_id: number | null
  }

  export type DepartmentInfoHistoryMinAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    department_id: number | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type DepartmentInfoHistoryMaxAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    department_id: number | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type DepartmentInfoHistoryCountAggregateOutputType = {
    id: number
    employee_info_id: number
    department_id: number
    added_at: number
    deleted_at: number
    _all: number
  }


  export type DepartmentInfoHistoryAvgAggregateInputType = {
    id?: true
    employee_info_id?: true
    department_id?: true
  }

  export type DepartmentInfoHistorySumAggregateInputType = {
    id?: true
    employee_info_id?: true
    department_id?: true
  }

  export type DepartmentInfoHistoryMinAggregateInputType = {
    id?: true
    employee_info_id?: true
    department_id?: true
    added_at?: true
    deleted_at?: true
  }

  export type DepartmentInfoHistoryMaxAggregateInputType = {
    id?: true
    employee_info_id?: true
    department_id?: true
    added_at?: true
    deleted_at?: true
  }

  export type DepartmentInfoHistoryCountAggregateInputType = {
    id?: true
    employee_info_id?: true
    department_id?: true
    added_at?: true
    deleted_at?: true
    _all?: true
  }

  export type DepartmentInfoHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentInfoHistory to aggregate.
     */
    where?: DepartmentInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfoHistories to fetch.
     */
    orderBy?: DepartmentInfoHistoryOrderByWithRelationInput | DepartmentInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfoHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DepartmentInfoHistories
    **/
    _count?: true | DepartmentInfoHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepartmentInfoHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepartmentInfoHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentInfoHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentInfoHistoryMaxAggregateInputType
  }

  export type GetDepartmentInfoHistoryAggregateType<T extends DepartmentInfoHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartmentInfoHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartmentInfoHistory[P]>
      : GetScalarType<T[P], AggregateDepartmentInfoHistory[P]>
  }




  export type DepartmentInfoHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentInfoHistoryWhereInput
    orderBy?: DepartmentInfoHistoryOrderByWithAggregationInput | DepartmentInfoHistoryOrderByWithAggregationInput[]
    by: DepartmentInfoHistoryScalarFieldEnum[] | DepartmentInfoHistoryScalarFieldEnum
    having?: DepartmentInfoHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentInfoHistoryCountAggregateInputType | true
    _avg?: DepartmentInfoHistoryAvgAggregateInputType
    _sum?: DepartmentInfoHistorySumAggregateInputType
    _min?: DepartmentInfoHistoryMinAggregateInputType
    _max?: DepartmentInfoHistoryMaxAggregateInputType
  }

  export type DepartmentInfoHistoryGroupByOutputType = {
    id: number
    employee_info_id: number
    department_id: number | null
    added_at: Date
    deleted_at: Date | null
    _count: DepartmentInfoHistoryCountAggregateOutputType | null
    _avg: DepartmentInfoHistoryAvgAggregateOutputType | null
    _sum: DepartmentInfoHistorySumAggregateOutputType | null
    _min: DepartmentInfoHistoryMinAggregateOutputType | null
    _max: DepartmentInfoHistoryMaxAggregateOutputType | null
  }

  type GetDepartmentInfoHistoryGroupByPayload<T extends DepartmentInfoHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentInfoHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentInfoHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentInfoHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentInfoHistoryGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentInfoHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    department_id?: boolean
    added_at?: boolean
    deleted_at?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
    department?: boolean | DepartmentInfoHistory$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["departmentInfoHistory"]>

  export type DepartmentInfoHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    department_id?: boolean
    added_at?: boolean
    deleted_at?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
    department?: boolean | DepartmentInfoHistory$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["departmentInfoHistory"]>

  export type DepartmentInfoHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    department_id?: boolean
    added_at?: boolean
    deleted_at?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
    department?: boolean | DepartmentInfoHistory$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["departmentInfoHistory"]>

  export type DepartmentInfoHistorySelectScalar = {
    id?: boolean
    employee_info_id?: boolean
    department_id?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }

  export type DepartmentInfoHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employee_info_id" | "department_id" | "added_at" | "deleted_at", ExtArgs["result"]["departmentInfoHistory"]>
  export type DepartmentInfoHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
    department?: boolean | DepartmentInfoHistory$departmentArgs<ExtArgs>
  }
  export type DepartmentInfoHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
    department?: boolean | DepartmentInfoHistory$departmentArgs<ExtArgs>
  }
  export type DepartmentInfoHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
    department?: boolean | DepartmentInfoHistory$departmentArgs<ExtArgs>
  }

  export type $DepartmentInfoHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DepartmentInfoHistory"
    objects: {
      employee_info: Prisma.$EmployeeInfoPayload<ExtArgs>
      department: Prisma.$DepartmentInfoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employee_info_id: number
      department_id: number | null
      added_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["departmentInfoHistory"]>
    composites: {}
  }

  type DepartmentInfoHistoryGetPayload<S extends boolean | null | undefined | DepartmentInfoHistoryDefaultArgs> = $Result.GetResult<Prisma.$DepartmentInfoHistoryPayload, S>

  type DepartmentInfoHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentInfoHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentInfoHistoryCountAggregateInputType | true
    }

  export interface DepartmentInfoHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DepartmentInfoHistory'], meta: { name: 'DepartmentInfoHistory' } }
    /**
     * Find zero or one DepartmentInfoHistory that matches the filter.
     * @param {DepartmentInfoHistoryFindUniqueArgs} args - Arguments to find a DepartmentInfoHistory
     * @example
     * // Get one DepartmentInfoHistory
     * const departmentInfoHistory = await prisma.departmentInfoHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentInfoHistoryFindUniqueArgs>(args: SelectSubset<T, DepartmentInfoHistoryFindUniqueArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DepartmentInfoHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentInfoHistoryFindUniqueOrThrowArgs} args - Arguments to find a DepartmentInfoHistory
     * @example
     * // Get one DepartmentInfoHistory
     * const departmentInfoHistory = await prisma.departmentInfoHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentInfoHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentInfoHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DepartmentInfoHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoHistoryFindFirstArgs} args - Arguments to find a DepartmentInfoHistory
     * @example
     * // Get one DepartmentInfoHistory
     * const departmentInfoHistory = await prisma.departmentInfoHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentInfoHistoryFindFirstArgs>(args?: SelectSubset<T, DepartmentInfoHistoryFindFirstArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DepartmentInfoHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoHistoryFindFirstOrThrowArgs} args - Arguments to find a DepartmentInfoHistory
     * @example
     * // Get one DepartmentInfoHistory
     * const departmentInfoHistory = await prisma.departmentInfoHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentInfoHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentInfoHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DepartmentInfoHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DepartmentInfoHistories
     * const departmentInfoHistories = await prisma.departmentInfoHistory.findMany()
     * 
     * // Get first 10 DepartmentInfoHistories
     * const departmentInfoHistories = await prisma.departmentInfoHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentInfoHistoryWithIdOnly = await prisma.departmentInfoHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentInfoHistoryFindManyArgs>(args?: SelectSubset<T, DepartmentInfoHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DepartmentInfoHistory.
     * @param {DepartmentInfoHistoryCreateArgs} args - Arguments to create a DepartmentInfoHistory.
     * @example
     * // Create one DepartmentInfoHistory
     * const DepartmentInfoHistory = await prisma.departmentInfoHistory.create({
     *   data: {
     *     // ... data to create a DepartmentInfoHistory
     *   }
     * })
     * 
     */
    create<T extends DepartmentInfoHistoryCreateArgs>(args: SelectSubset<T, DepartmentInfoHistoryCreateArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DepartmentInfoHistories.
     * @param {DepartmentInfoHistoryCreateManyArgs} args - Arguments to create many DepartmentInfoHistories.
     * @example
     * // Create many DepartmentInfoHistories
     * const departmentInfoHistory = await prisma.departmentInfoHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentInfoHistoryCreateManyArgs>(args?: SelectSubset<T, DepartmentInfoHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DepartmentInfoHistories and returns the data saved in the database.
     * @param {DepartmentInfoHistoryCreateManyAndReturnArgs} args - Arguments to create many DepartmentInfoHistories.
     * @example
     * // Create many DepartmentInfoHistories
     * const departmentInfoHistory = await prisma.departmentInfoHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DepartmentInfoHistories and only return the `id`
     * const departmentInfoHistoryWithIdOnly = await prisma.departmentInfoHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentInfoHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentInfoHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DepartmentInfoHistory.
     * @param {DepartmentInfoHistoryDeleteArgs} args - Arguments to delete one DepartmentInfoHistory.
     * @example
     * // Delete one DepartmentInfoHistory
     * const DepartmentInfoHistory = await prisma.departmentInfoHistory.delete({
     *   where: {
     *     // ... filter to delete one DepartmentInfoHistory
     *   }
     * })
     * 
     */
    delete<T extends DepartmentInfoHistoryDeleteArgs>(args: SelectSubset<T, DepartmentInfoHistoryDeleteArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DepartmentInfoHistory.
     * @param {DepartmentInfoHistoryUpdateArgs} args - Arguments to update one DepartmentInfoHistory.
     * @example
     * // Update one DepartmentInfoHistory
     * const departmentInfoHistory = await prisma.departmentInfoHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentInfoHistoryUpdateArgs>(args: SelectSubset<T, DepartmentInfoHistoryUpdateArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DepartmentInfoHistories.
     * @param {DepartmentInfoHistoryDeleteManyArgs} args - Arguments to filter DepartmentInfoHistories to delete.
     * @example
     * // Delete a few DepartmentInfoHistories
     * const { count } = await prisma.departmentInfoHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentInfoHistoryDeleteManyArgs>(args?: SelectSubset<T, DepartmentInfoHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DepartmentInfoHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DepartmentInfoHistories
     * const departmentInfoHistory = await prisma.departmentInfoHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentInfoHistoryUpdateManyArgs>(args: SelectSubset<T, DepartmentInfoHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DepartmentInfoHistories and returns the data updated in the database.
     * @param {DepartmentInfoHistoryUpdateManyAndReturnArgs} args - Arguments to update many DepartmentInfoHistories.
     * @example
     * // Update many DepartmentInfoHistories
     * const departmentInfoHistory = await prisma.departmentInfoHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DepartmentInfoHistories and only return the `id`
     * const departmentInfoHistoryWithIdOnly = await prisma.departmentInfoHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DepartmentInfoHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, DepartmentInfoHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DepartmentInfoHistory.
     * @param {DepartmentInfoHistoryUpsertArgs} args - Arguments to update or create a DepartmentInfoHistory.
     * @example
     * // Update or create a DepartmentInfoHistory
     * const departmentInfoHistory = await prisma.departmentInfoHistory.upsert({
     *   create: {
     *     // ... data to create a DepartmentInfoHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DepartmentInfoHistory we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentInfoHistoryUpsertArgs>(args: SelectSubset<T, DepartmentInfoHistoryUpsertArgs<ExtArgs>>): Prisma__DepartmentInfoHistoryClient<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DepartmentInfoHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoHistoryCountArgs} args - Arguments to filter DepartmentInfoHistories to count.
     * @example
     * // Count the number of DepartmentInfoHistories
     * const count = await prisma.departmentInfoHistory.count({
     *   where: {
     *     // ... the filter for the DepartmentInfoHistories we want to count
     *   }
     * })
    **/
    count<T extends DepartmentInfoHistoryCountArgs>(
      args?: Subset<T, DepartmentInfoHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentInfoHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DepartmentInfoHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentInfoHistoryAggregateArgs>(args: Subset<T, DepartmentInfoHistoryAggregateArgs>): Prisma.PrismaPromise<GetDepartmentInfoHistoryAggregateType<T>>

    /**
     * Group by DepartmentInfoHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentInfoHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentInfoHistoryGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentInfoHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentInfoHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentInfoHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DepartmentInfoHistory model
   */
  readonly fields: DepartmentInfoHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DepartmentInfoHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentInfoHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee_info<T extends EmployeeInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeInfoDefaultArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    department<T extends DepartmentInfoHistory$departmentArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentInfoHistory$departmentArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DepartmentInfoHistory model
   */
  interface DepartmentInfoHistoryFieldRefs {
    readonly id: FieldRef<"DepartmentInfoHistory", 'Int'>
    readonly employee_info_id: FieldRef<"DepartmentInfoHistory", 'Int'>
    readonly department_id: FieldRef<"DepartmentInfoHistory", 'Int'>
    readonly added_at: FieldRef<"DepartmentInfoHistory", 'DateTime'>
    readonly deleted_at: FieldRef<"DepartmentInfoHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DepartmentInfoHistory findUnique
   */
  export type DepartmentInfoHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfoHistory to fetch.
     */
    where: DepartmentInfoHistoryWhereUniqueInput
  }

  /**
   * DepartmentInfoHistory findUniqueOrThrow
   */
  export type DepartmentInfoHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfoHistory to fetch.
     */
    where: DepartmentInfoHistoryWhereUniqueInput
  }

  /**
   * DepartmentInfoHistory findFirst
   */
  export type DepartmentInfoHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfoHistory to fetch.
     */
    where?: DepartmentInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfoHistories to fetch.
     */
    orderBy?: DepartmentInfoHistoryOrderByWithRelationInput | DepartmentInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentInfoHistories.
     */
    cursor?: DepartmentInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfoHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentInfoHistories.
     */
    distinct?: DepartmentInfoHistoryScalarFieldEnum | DepartmentInfoHistoryScalarFieldEnum[]
  }

  /**
   * DepartmentInfoHistory findFirstOrThrow
   */
  export type DepartmentInfoHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfoHistory to fetch.
     */
    where?: DepartmentInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfoHistories to fetch.
     */
    orderBy?: DepartmentInfoHistoryOrderByWithRelationInput | DepartmentInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentInfoHistories.
     */
    cursor?: DepartmentInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfoHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentInfoHistories.
     */
    distinct?: DepartmentInfoHistoryScalarFieldEnum | DepartmentInfoHistoryScalarFieldEnum[]
  }

  /**
   * DepartmentInfoHistory findMany
   */
  export type DepartmentInfoHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfoHistories to fetch.
     */
    where?: DepartmentInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfoHistories to fetch.
     */
    orderBy?: DepartmentInfoHistoryOrderByWithRelationInput | DepartmentInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DepartmentInfoHistories.
     */
    cursor?: DepartmentInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfoHistories.
     */
    skip?: number
    distinct?: DepartmentInfoHistoryScalarFieldEnum | DepartmentInfoHistoryScalarFieldEnum[]
  }

  /**
   * DepartmentInfoHistory create
   */
  export type DepartmentInfoHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a DepartmentInfoHistory.
     */
    data: XOR<DepartmentInfoHistoryCreateInput, DepartmentInfoHistoryUncheckedCreateInput>
  }

  /**
   * DepartmentInfoHistory createMany
   */
  export type DepartmentInfoHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DepartmentInfoHistories.
     */
    data: DepartmentInfoHistoryCreateManyInput | DepartmentInfoHistoryCreateManyInput[]
  }

  /**
   * DepartmentInfoHistory createManyAndReturn
   */
  export type DepartmentInfoHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many DepartmentInfoHistories.
     */
    data: DepartmentInfoHistoryCreateManyInput | DepartmentInfoHistoryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DepartmentInfoHistory update
   */
  export type DepartmentInfoHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a DepartmentInfoHistory.
     */
    data: XOR<DepartmentInfoHistoryUpdateInput, DepartmentInfoHistoryUncheckedUpdateInput>
    /**
     * Choose, which DepartmentInfoHistory to update.
     */
    where: DepartmentInfoHistoryWhereUniqueInput
  }

  /**
   * DepartmentInfoHistory updateMany
   */
  export type DepartmentInfoHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DepartmentInfoHistories.
     */
    data: XOR<DepartmentInfoHistoryUpdateManyMutationInput, DepartmentInfoHistoryUncheckedUpdateManyInput>
    /**
     * Filter which DepartmentInfoHistories to update
     */
    where?: DepartmentInfoHistoryWhereInput
    /**
     * Limit how many DepartmentInfoHistories to update.
     */
    limit?: number
  }

  /**
   * DepartmentInfoHistory updateManyAndReturn
   */
  export type DepartmentInfoHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * The data used to update DepartmentInfoHistories.
     */
    data: XOR<DepartmentInfoHistoryUpdateManyMutationInput, DepartmentInfoHistoryUncheckedUpdateManyInput>
    /**
     * Filter which DepartmentInfoHistories to update
     */
    where?: DepartmentInfoHistoryWhereInput
    /**
     * Limit how many DepartmentInfoHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DepartmentInfoHistory upsert
   */
  export type DepartmentInfoHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the DepartmentInfoHistory to update in case it exists.
     */
    where: DepartmentInfoHistoryWhereUniqueInput
    /**
     * In case the DepartmentInfoHistory found by the `where` argument doesn't exist, create a new DepartmentInfoHistory with this data.
     */
    create: XOR<DepartmentInfoHistoryCreateInput, DepartmentInfoHistoryUncheckedCreateInput>
    /**
     * In case the DepartmentInfoHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentInfoHistoryUpdateInput, DepartmentInfoHistoryUncheckedUpdateInput>
  }

  /**
   * DepartmentInfoHistory delete
   */
  export type DepartmentInfoHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter which DepartmentInfoHistory to delete.
     */
    where: DepartmentInfoHistoryWhereUniqueInput
  }

  /**
   * DepartmentInfoHistory deleteMany
   */
  export type DepartmentInfoHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentInfoHistories to delete
     */
    where?: DepartmentInfoHistoryWhereInput
    /**
     * Limit how many DepartmentInfoHistories to delete.
     */
    limit?: number
  }

  /**
   * DepartmentInfoHistory.department
   */
  export type DepartmentInfoHistory$departmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    where?: DepartmentInfoWhereInput
  }

  /**
   * DepartmentInfoHistory without action
   */
  export type DepartmentInfoHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
  }


  /**
   * Model DepartmentInfo
   */

  export type AggregateDepartmentInfo = {
    _count: DepartmentInfoCountAggregateOutputType | null
    _avg: DepartmentInfoAvgAggregateOutputType | null
    _sum: DepartmentInfoSumAggregateOutputType | null
    _min: DepartmentInfoMinAggregateOutputType | null
    _max: DepartmentInfoMaxAggregateOutputType | null
  }

  export type DepartmentInfoAvgAggregateOutputType = {
    id: number | null
    parent_id: number | null
  }

  export type DepartmentInfoSumAggregateOutputType = {
    id: number | null
    parent_id: number | null
  }

  export type DepartmentInfoMinAggregateOutputType = {
    id: number | null
    parent_id: number | null
    name: string | null
    full_name: string | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type DepartmentInfoMaxAggregateOutputType = {
    id: number | null
    parent_id: number | null
    name: string | null
    full_name: string | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type DepartmentInfoCountAggregateOutputType = {
    id: number
    parent_id: number
    name: number
    full_name: number
    added_at: number
    deleted_at: number
    _all: number
  }


  export type DepartmentInfoAvgAggregateInputType = {
    id?: true
    parent_id?: true
  }

  export type DepartmentInfoSumAggregateInputType = {
    id?: true
    parent_id?: true
  }

  export type DepartmentInfoMinAggregateInputType = {
    id?: true
    parent_id?: true
    name?: true
    full_name?: true
    added_at?: true
    deleted_at?: true
  }

  export type DepartmentInfoMaxAggregateInputType = {
    id?: true
    parent_id?: true
    name?: true
    full_name?: true
    added_at?: true
    deleted_at?: true
  }

  export type DepartmentInfoCountAggregateInputType = {
    id?: true
    parent_id?: true
    name?: true
    full_name?: true
    added_at?: true
    deleted_at?: true
    _all?: true
  }

  export type DepartmentInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentInfo to aggregate.
     */
    where?: DepartmentInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfos to fetch.
     */
    orderBy?: DepartmentInfoOrderByWithRelationInput | DepartmentInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DepartmentInfos
    **/
    _count?: true | DepartmentInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepartmentInfoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepartmentInfoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentInfoMaxAggregateInputType
  }

  export type GetDepartmentInfoAggregateType<T extends DepartmentInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartmentInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartmentInfo[P]>
      : GetScalarType<T[P], AggregateDepartmentInfo[P]>
  }




  export type DepartmentInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentInfoWhereInput
    orderBy?: DepartmentInfoOrderByWithAggregationInput | DepartmentInfoOrderByWithAggregationInput[]
    by: DepartmentInfoScalarFieldEnum[] | DepartmentInfoScalarFieldEnum
    having?: DepartmentInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentInfoCountAggregateInputType | true
    _avg?: DepartmentInfoAvgAggregateInputType
    _sum?: DepartmentInfoSumAggregateInputType
    _min?: DepartmentInfoMinAggregateInputType
    _max?: DepartmentInfoMaxAggregateInputType
  }

  export type DepartmentInfoGroupByOutputType = {
    id: number
    parent_id: number | null
    name: string
    full_name: string | null
    added_at: Date
    deleted_at: Date | null
    _count: DepartmentInfoCountAggregateOutputType | null
    _avg: DepartmentInfoAvgAggregateOutputType | null
    _sum: DepartmentInfoSumAggregateOutputType | null
    _min: DepartmentInfoMinAggregateOutputType | null
    _max: DepartmentInfoMaxAggregateOutputType | null
  }

  type GetDepartmentInfoGroupByPayload<T extends DepartmentInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentInfoGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentInfoGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parent_id?: boolean
    name?: boolean
    full_name?: boolean
    added_at?: boolean
    deleted_at?: boolean
    department_histories?: boolean | DepartmentInfo$department_historiesArgs<ExtArgs>
    _count?: boolean | DepartmentInfoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["departmentInfo"]>

  export type DepartmentInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parent_id?: boolean
    name?: boolean
    full_name?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["departmentInfo"]>

  export type DepartmentInfoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parent_id?: boolean
    name?: boolean
    full_name?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["departmentInfo"]>

  export type DepartmentInfoSelectScalar = {
    id?: boolean
    parent_id?: boolean
    name?: boolean
    full_name?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }

  export type DepartmentInfoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "parent_id" | "name" | "full_name" | "added_at" | "deleted_at", ExtArgs["result"]["departmentInfo"]>
  export type DepartmentInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department_histories?: boolean | DepartmentInfo$department_historiesArgs<ExtArgs>
    _count?: boolean | DepartmentInfoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepartmentInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DepartmentInfoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DepartmentInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DepartmentInfo"
    objects: {
      department_histories: Prisma.$DepartmentInfoHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      parent_id: number | null
      name: string
      full_name: string | null
      added_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["departmentInfo"]>
    composites: {}
  }

  type DepartmentInfoGetPayload<S extends boolean | null | undefined | DepartmentInfoDefaultArgs> = $Result.GetResult<Prisma.$DepartmentInfoPayload, S>

  type DepartmentInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentInfoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentInfoCountAggregateInputType | true
    }

  export interface DepartmentInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DepartmentInfo'], meta: { name: 'DepartmentInfo' } }
    /**
     * Find zero or one DepartmentInfo that matches the filter.
     * @param {DepartmentInfoFindUniqueArgs} args - Arguments to find a DepartmentInfo
     * @example
     * // Get one DepartmentInfo
     * const departmentInfo = await prisma.departmentInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentInfoFindUniqueArgs>(args: SelectSubset<T, DepartmentInfoFindUniqueArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DepartmentInfo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentInfoFindUniqueOrThrowArgs} args - Arguments to find a DepartmentInfo
     * @example
     * // Get one DepartmentInfo
     * const departmentInfo = await prisma.departmentInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DepartmentInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoFindFirstArgs} args - Arguments to find a DepartmentInfo
     * @example
     * // Get one DepartmentInfo
     * const departmentInfo = await prisma.departmentInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentInfoFindFirstArgs>(args?: SelectSubset<T, DepartmentInfoFindFirstArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DepartmentInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoFindFirstOrThrowArgs} args - Arguments to find a DepartmentInfo
     * @example
     * // Get one DepartmentInfo
     * const departmentInfo = await prisma.departmentInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DepartmentInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DepartmentInfos
     * const departmentInfos = await prisma.departmentInfo.findMany()
     * 
     * // Get first 10 DepartmentInfos
     * const departmentInfos = await prisma.departmentInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentInfoWithIdOnly = await prisma.departmentInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentInfoFindManyArgs>(args?: SelectSubset<T, DepartmentInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DepartmentInfo.
     * @param {DepartmentInfoCreateArgs} args - Arguments to create a DepartmentInfo.
     * @example
     * // Create one DepartmentInfo
     * const DepartmentInfo = await prisma.departmentInfo.create({
     *   data: {
     *     // ... data to create a DepartmentInfo
     *   }
     * })
     * 
     */
    create<T extends DepartmentInfoCreateArgs>(args: SelectSubset<T, DepartmentInfoCreateArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DepartmentInfos.
     * @param {DepartmentInfoCreateManyArgs} args - Arguments to create many DepartmentInfos.
     * @example
     * // Create many DepartmentInfos
     * const departmentInfo = await prisma.departmentInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentInfoCreateManyArgs>(args?: SelectSubset<T, DepartmentInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DepartmentInfos and returns the data saved in the database.
     * @param {DepartmentInfoCreateManyAndReturnArgs} args - Arguments to create many DepartmentInfos.
     * @example
     * // Create many DepartmentInfos
     * const departmentInfo = await prisma.departmentInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DepartmentInfos and only return the `id`
     * const departmentInfoWithIdOnly = await prisma.departmentInfo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DepartmentInfo.
     * @param {DepartmentInfoDeleteArgs} args - Arguments to delete one DepartmentInfo.
     * @example
     * // Delete one DepartmentInfo
     * const DepartmentInfo = await prisma.departmentInfo.delete({
     *   where: {
     *     // ... filter to delete one DepartmentInfo
     *   }
     * })
     * 
     */
    delete<T extends DepartmentInfoDeleteArgs>(args: SelectSubset<T, DepartmentInfoDeleteArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DepartmentInfo.
     * @param {DepartmentInfoUpdateArgs} args - Arguments to update one DepartmentInfo.
     * @example
     * // Update one DepartmentInfo
     * const departmentInfo = await prisma.departmentInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentInfoUpdateArgs>(args: SelectSubset<T, DepartmentInfoUpdateArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DepartmentInfos.
     * @param {DepartmentInfoDeleteManyArgs} args - Arguments to filter DepartmentInfos to delete.
     * @example
     * // Delete a few DepartmentInfos
     * const { count } = await prisma.departmentInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentInfoDeleteManyArgs>(args?: SelectSubset<T, DepartmentInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DepartmentInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DepartmentInfos
     * const departmentInfo = await prisma.departmentInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentInfoUpdateManyArgs>(args: SelectSubset<T, DepartmentInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DepartmentInfos and returns the data updated in the database.
     * @param {DepartmentInfoUpdateManyAndReturnArgs} args - Arguments to update many DepartmentInfos.
     * @example
     * // Update many DepartmentInfos
     * const departmentInfo = await prisma.departmentInfo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DepartmentInfos and only return the `id`
     * const departmentInfoWithIdOnly = await prisma.departmentInfo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DepartmentInfoUpdateManyAndReturnArgs>(args: SelectSubset<T, DepartmentInfoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DepartmentInfo.
     * @param {DepartmentInfoUpsertArgs} args - Arguments to update or create a DepartmentInfo.
     * @example
     * // Update or create a DepartmentInfo
     * const departmentInfo = await prisma.departmentInfo.upsert({
     *   create: {
     *     // ... data to create a DepartmentInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DepartmentInfo we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentInfoUpsertArgs>(args: SelectSubset<T, DepartmentInfoUpsertArgs<ExtArgs>>): Prisma__DepartmentInfoClient<$Result.GetResult<Prisma.$DepartmentInfoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DepartmentInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoCountArgs} args - Arguments to filter DepartmentInfos to count.
     * @example
     * // Count the number of DepartmentInfos
     * const count = await prisma.departmentInfo.count({
     *   where: {
     *     // ... the filter for the DepartmentInfos we want to count
     *   }
     * })
    **/
    count<T extends DepartmentInfoCountArgs>(
      args?: Subset<T, DepartmentInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DepartmentInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentInfoAggregateArgs>(args: Subset<T, DepartmentInfoAggregateArgs>): Prisma.PrismaPromise<GetDepartmentInfoAggregateType<T>>

    /**
     * Group by DepartmentInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentInfoGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DepartmentInfo model
   */
  readonly fields: DepartmentInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DepartmentInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    department_histories<T extends DepartmentInfo$department_historiesArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentInfo$department_historiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentInfoHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DepartmentInfo model
   */
  interface DepartmentInfoFieldRefs {
    readonly id: FieldRef<"DepartmentInfo", 'Int'>
    readonly parent_id: FieldRef<"DepartmentInfo", 'Int'>
    readonly name: FieldRef<"DepartmentInfo", 'String'>
    readonly full_name: FieldRef<"DepartmentInfo", 'String'>
    readonly added_at: FieldRef<"DepartmentInfo", 'DateTime'>
    readonly deleted_at: FieldRef<"DepartmentInfo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DepartmentInfo findUnique
   */
  export type DepartmentInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfo to fetch.
     */
    where: DepartmentInfoWhereUniqueInput
  }

  /**
   * DepartmentInfo findUniqueOrThrow
   */
  export type DepartmentInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfo to fetch.
     */
    where: DepartmentInfoWhereUniqueInput
  }

  /**
   * DepartmentInfo findFirst
   */
  export type DepartmentInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfo to fetch.
     */
    where?: DepartmentInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfos to fetch.
     */
    orderBy?: DepartmentInfoOrderByWithRelationInput | DepartmentInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentInfos.
     */
    cursor?: DepartmentInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentInfos.
     */
    distinct?: DepartmentInfoScalarFieldEnum | DepartmentInfoScalarFieldEnum[]
  }

  /**
   * DepartmentInfo findFirstOrThrow
   */
  export type DepartmentInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfo to fetch.
     */
    where?: DepartmentInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfos to fetch.
     */
    orderBy?: DepartmentInfoOrderByWithRelationInput | DepartmentInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentInfos.
     */
    cursor?: DepartmentInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentInfos.
     */
    distinct?: DepartmentInfoScalarFieldEnum | DepartmentInfoScalarFieldEnum[]
  }

  /**
   * DepartmentInfo findMany
   */
  export type DepartmentInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentInfos to fetch.
     */
    where?: DepartmentInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentInfos to fetch.
     */
    orderBy?: DepartmentInfoOrderByWithRelationInput | DepartmentInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DepartmentInfos.
     */
    cursor?: DepartmentInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentInfos.
     */
    skip?: number
    distinct?: DepartmentInfoScalarFieldEnum | DepartmentInfoScalarFieldEnum[]
  }

  /**
   * DepartmentInfo create
   */
  export type DepartmentInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a DepartmentInfo.
     */
    data: XOR<DepartmentInfoCreateInput, DepartmentInfoUncheckedCreateInput>
  }

  /**
   * DepartmentInfo createMany
   */
  export type DepartmentInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DepartmentInfos.
     */
    data: DepartmentInfoCreateManyInput | DepartmentInfoCreateManyInput[]
  }

  /**
   * DepartmentInfo createManyAndReturn
   */
  export type DepartmentInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * The data used to create many DepartmentInfos.
     */
    data: DepartmentInfoCreateManyInput | DepartmentInfoCreateManyInput[]
  }

  /**
   * DepartmentInfo update
   */
  export type DepartmentInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a DepartmentInfo.
     */
    data: XOR<DepartmentInfoUpdateInput, DepartmentInfoUncheckedUpdateInput>
    /**
     * Choose, which DepartmentInfo to update.
     */
    where: DepartmentInfoWhereUniqueInput
  }

  /**
   * DepartmentInfo updateMany
   */
  export type DepartmentInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DepartmentInfos.
     */
    data: XOR<DepartmentInfoUpdateManyMutationInput, DepartmentInfoUncheckedUpdateManyInput>
    /**
     * Filter which DepartmentInfos to update
     */
    where?: DepartmentInfoWhereInput
    /**
     * Limit how many DepartmentInfos to update.
     */
    limit?: number
  }

  /**
   * DepartmentInfo updateManyAndReturn
   */
  export type DepartmentInfoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * The data used to update DepartmentInfos.
     */
    data: XOR<DepartmentInfoUpdateManyMutationInput, DepartmentInfoUncheckedUpdateManyInput>
    /**
     * Filter which DepartmentInfos to update
     */
    where?: DepartmentInfoWhereInput
    /**
     * Limit how many DepartmentInfos to update.
     */
    limit?: number
  }

  /**
   * DepartmentInfo upsert
   */
  export type DepartmentInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the DepartmentInfo to update in case it exists.
     */
    where: DepartmentInfoWhereUniqueInput
    /**
     * In case the DepartmentInfo found by the `where` argument doesn't exist, create a new DepartmentInfo with this data.
     */
    create: XOR<DepartmentInfoCreateInput, DepartmentInfoUncheckedCreateInput>
    /**
     * In case the DepartmentInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentInfoUpdateInput, DepartmentInfoUncheckedUpdateInput>
  }

  /**
   * DepartmentInfo delete
   */
  export type DepartmentInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
    /**
     * Filter which DepartmentInfo to delete.
     */
    where: DepartmentInfoWhereUniqueInput
  }

  /**
   * DepartmentInfo deleteMany
   */
  export type DepartmentInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentInfos to delete
     */
    where?: DepartmentInfoWhereInput
    /**
     * Limit how many DepartmentInfos to delete.
     */
    limit?: number
  }

  /**
   * DepartmentInfo.department_histories
   */
  export type DepartmentInfo$department_historiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfoHistory
     */
    select?: DepartmentInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfoHistory
     */
    omit?: DepartmentInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoHistoryInclude<ExtArgs> | null
    where?: DepartmentInfoHistoryWhereInput
    orderBy?: DepartmentInfoHistoryOrderByWithRelationInput | DepartmentInfoHistoryOrderByWithRelationInput[]
    cursor?: DepartmentInfoHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentInfoHistoryScalarFieldEnum | DepartmentInfoHistoryScalarFieldEnum[]
  }

  /**
   * DepartmentInfo without action
   */
  export type DepartmentInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentInfo
     */
    select?: DepartmentInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentInfo
     */
    omit?: DepartmentInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInfoInclude<ExtArgs> | null
  }


  /**
   * Model PersonalInfoHistory
   */

  export type AggregatePersonalInfoHistory = {
    _count: PersonalInfoHistoryCountAggregateOutputType | null
    _avg: PersonalInfoHistoryAvgAggregateOutputType | null
    _sum: PersonalInfoHistorySumAggregateOutputType | null
    _min: PersonalInfoHistoryMinAggregateOutputType | null
    _max: PersonalInfoHistoryMaxAggregateOutputType | null
  }

  export type PersonalInfoHistoryAvgAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
  }

  export type PersonalInfoHistorySumAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
  }

  export type PersonalInfoHistoryMinAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    last_name: string | null
    first_name: string | null
    address: string | null
    phone_number: string | null
    emergency_contact: string | null
    birthplace: string | null
    allergy: string | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type PersonalInfoHistoryMaxAggregateOutputType = {
    id: number | null
    employee_info_id: number | null
    last_name: string | null
    first_name: string | null
    address: string | null
    phone_number: string | null
    emergency_contact: string | null
    birthplace: string | null
    allergy: string | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type PersonalInfoHistoryCountAggregateOutputType = {
    id: number
    employee_info_id: number
    last_name: number
    first_name: number
    address: number
    phone_number: number
    emergency_contact: number
    birthplace: number
    allergy: number
    added_at: number
    deleted_at: number
    _all: number
  }


  export type PersonalInfoHistoryAvgAggregateInputType = {
    id?: true
    employee_info_id?: true
  }

  export type PersonalInfoHistorySumAggregateInputType = {
    id?: true
    employee_info_id?: true
  }

  export type PersonalInfoHistoryMinAggregateInputType = {
    id?: true
    employee_info_id?: true
    last_name?: true
    first_name?: true
    address?: true
    phone_number?: true
    emergency_contact?: true
    birthplace?: true
    allergy?: true
    added_at?: true
    deleted_at?: true
  }

  export type PersonalInfoHistoryMaxAggregateInputType = {
    id?: true
    employee_info_id?: true
    last_name?: true
    first_name?: true
    address?: true
    phone_number?: true
    emergency_contact?: true
    birthplace?: true
    allergy?: true
    added_at?: true
    deleted_at?: true
  }

  export type PersonalInfoHistoryCountAggregateInputType = {
    id?: true
    employee_info_id?: true
    last_name?: true
    first_name?: true
    address?: true
    phone_number?: true
    emergency_contact?: true
    birthplace?: true
    allergy?: true
    added_at?: true
    deleted_at?: true
    _all?: true
  }

  export type PersonalInfoHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PersonalInfoHistory to aggregate.
     */
    where?: PersonalInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalInfoHistories to fetch.
     */
    orderBy?: PersonalInfoHistoryOrderByWithRelationInput | PersonalInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PersonalInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalInfoHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PersonalInfoHistories
    **/
    _count?: true | PersonalInfoHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PersonalInfoHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PersonalInfoHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PersonalInfoHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PersonalInfoHistoryMaxAggregateInputType
  }

  export type GetPersonalInfoHistoryAggregateType<T extends PersonalInfoHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePersonalInfoHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePersonalInfoHistory[P]>
      : GetScalarType<T[P], AggregatePersonalInfoHistory[P]>
  }




  export type PersonalInfoHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonalInfoHistoryWhereInput
    orderBy?: PersonalInfoHistoryOrderByWithAggregationInput | PersonalInfoHistoryOrderByWithAggregationInput[]
    by: PersonalInfoHistoryScalarFieldEnum[] | PersonalInfoHistoryScalarFieldEnum
    having?: PersonalInfoHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PersonalInfoHistoryCountAggregateInputType | true
    _avg?: PersonalInfoHistoryAvgAggregateInputType
    _sum?: PersonalInfoHistorySumAggregateInputType
    _min?: PersonalInfoHistoryMinAggregateInputType
    _max?: PersonalInfoHistoryMaxAggregateInputType
  }

  export type PersonalInfoHistoryGroupByOutputType = {
    id: number
    employee_info_id: number
    last_name: string
    first_name: string
    address: string | null
    phone_number: string | null
    emergency_contact: string | null
    birthplace: string | null
    allergy: string | null
    added_at: Date
    deleted_at: Date | null
    _count: PersonalInfoHistoryCountAggregateOutputType | null
    _avg: PersonalInfoHistoryAvgAggregateOutputType | null
    _sum: PersonalInfoHistorySumAggregateOutputType | null
    _min: PersonalInfoHistoryMinAggregateOutputType | null
    _max: PersonalInfoHistoryMaxAggregateOutputType | null
  }

  type GetPersonalInfoHistoryGroupByPayload<T extends PersonalInfoHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PersonalInfoHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PersonalInfoHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PersonalInfoHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PersonalInfoHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PersonalInfoHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    last_name?: boolean
    first_name?: boolean
    address?: boolean
    phone_number?: boolean
    emergency_contact?: boolean
    birthplace?: boolean
    allergy?: boolean
    added_at?: boolean
    deleted_at?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["personalInfoHistory"]>

  export type PersonalInfoHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    last_name?: boolean
    first_name?: boolean
    address?: boolean
    phone_number?: boolean
    emergency_contact?: boolean
    birthplace?: boolean
    allergy?: boolean
    added_at?: boolean
    deleted_at?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["personalInfoHistory"]>

  export type PersonalInfoHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_info_id?: boolean
    last_name?: boolean
    first_name?: boolean
    address?: boolean
    phone_number?: boolean
    emergency_contact?: boolean
    birthplace?: boolean
    allergy?: boolean
    added_at?: boolean
    deleted_at?: boolean
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["personalInfoHistory"]>

  export type PersonalInfoHistorySelectScalar = {
    id?: boolean
    employee_info_id?: boolean
    last_name?: boolean
    first_name?: boolean
    address?: boolean
    phone_number?: boolean
    emergency_contact?: boolean
    birthplace?: boolean
    allergy?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }

  export type PersonalInfoHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employee_info_id" | "last_name" | "first_name" | "address" | "phone_number" | "emergency_contact" | "birthplace" | "allergy" | "added_at" | "deleted_at", ExtArgs["result"]["personalInfoHistory"]>
  export type PersonalInfoHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }
  export type PersonalInfoHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }
  export type PersonalInfoHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee_info?: boolean | EmployeeInfoDefaultArgs<ExtArgs>
  }

  export type $PersonalInfoHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PersonalInfoHistory"
    objects: {
      employee_info: Prisma.$EmployeeInfoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employee_info_id: number
      last_name: string
      first_name: string
      address: string | null
      phone_number: string | null
      emergency_contact: string | null
      birthplace: string | null
      allergy: string | null
      added_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["personalInfoHistory"]>
    composites: {}
  }

  type PersonalInfoHistoryGetPayload<S extends boolean | null | undefined | PersonalInfoHistoryDefaultArgs> = $Result.GetResult<Prisma.$PersonalInfoHistoryPayload, S>

  type PersonalInfoHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PersonalInfoHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PersonalInfoHistoryCountAggregateInputType | true
    }

  export interface PersonalInfoHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PersonalInfoHistory'], meta: { name: 'PersonalInfoHistory' } }
    /**
     * Find zero or one PersonalInfoHistory that matches the filter.
     * @param {PersonalInfoHistoryFindUniqueArgs} args - Arguments to find a PersonalInfoHistory
     * @example
     * // Get one PersonalInfoHistory
     * const personalInfoHistory = await prisma.personalInfoHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PersonalInfoHistoryFindUniqueArgs>(args: SelectSubset<T, PersonalInfoHistoryFindUniqueArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PersonalInfoHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PersonalInfoHistoryFindUniqueOrThrowArgs} args - Arguments to find a PersonalInfoHistory
     * @example
     * // Get one PersonalInfoHistory
     * const personalInfoHistory = await prisma.personalInfoHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PersonalInfoHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PersonalInfoHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PersonalInfoHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalInfoHistoryFindFirstArgs} args - Arguments to find a PersonalInfoHistory
     * @example
     * // Get one PersonalInfoHistory
     * const personalInfoHistory = await prisma.personalInfoHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PersonalInfoHistoryFindFirstArgs>(args?: SelectSubset<T, PersonalInfoHistoryFindFirstArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PersonalInfoHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalInfoHistoryFindFirstOrThrowArgs} args - Arguments to find a PersonalInfoHistory
     * @example
     * // Get one PersonalInfoHistory
     * const personalInfoHistory = await prisma.personalInfoHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PersonalInfoHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PersonalInfoHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PersonalInfoHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalInfoHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PersonalInfoHistories
     * const personalInfoHistories = await prisma.personalInfoHistory.findMany()
     * 
     * // Get first 10 PersonalInfoHistories
     * const personalInfoHistories = await prisma.personalInfoHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const personalInfoHistoryWithIdOnly = await prisma.personalInfoHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PersonalInfoHistoryFindManyArgs>(args?: SelectSubset<T, PersonalInfoHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PersonalInfoHistory.
     * @param {PersonalInfoHistoryCreateArgs} args - Arguments to create a PersonalInfoHistory.
     * @example
     * // Create one PersonalInfoHistory
     * const PersonalInfoHistory = await prisma.personalInfoHistory.create({
     *   data: {
     *     // ... data to create a PersonalInfoHistory
     *   }
     * })
     * 
     */
    create<T extends PersonalInfoHistoryCreateArgs>(args: SelectSubset<T, PersonalInfoHistoryCreateArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PersonalInfoHistories.
     * @param {PersonalInfoHistoryCreateManyArgs} args - Arguments to create many PersonalInfoHistories.
     * @example
     * // Create many PersonalInfoHistories
     * const personalInfoHistory = await prisma.personalInfoHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PersonalInfoHistoryCreateManyArgs>(args?: SelectSubset<T, PersonalInfoHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PersonalInfoHistories and returns the data saved in the database.
     * @param {PersonalInfoHistoryCreateManyAndReturnArgs} args - Arguments to create many PersonalInfoHistories.
     * @example
     * // Create many PersonalInfoHistories
     * const personalInfoHistory = await prisma.personalInfoHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PersonalInfoHistories and only return the `id`
     * const personalInfoHistoryWithIdOnly = await prisma.personalInfoHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PersonalInfoHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PersonalInfoHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PersonalInfoHistory.
     * @param {PersonalInfoHistoryDeleteArgs} args - Arguments to delete one PersonalInfoHistory.
     * @example
     * // Delete one PersonalInfoHistory
     * const PersonalInfoHistory = await prisma.personalInfoHistory.delete({
     *   where: {
     *     // ... filter to delete one PersonalInfoHistory
     *   }
     * })
     * 
     */
    delete<T extends PersonalInfoHistoryDeleteArgs>(args: SelectSubset<T, PersonalInfoHistoryDeleteArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PersonalInfoHistory.
     * @param {PersonalInfoHistoryUpdateArgs} args - Arguments to update one PersonalInfoHistory.
     * @example
     * // Update one PersonalInfoHistory
     * const personalInfoHistory = await prisma.personalInfoHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PersonalInfoHistoryUpdateArgs>(args: SelectSubset<T, PersonalInfoHistoryUpdateArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PersonalInfoHistories.
     * @param {PersonalInfoHistoryDeleteManyArgs} args - Arguments to filter PersonalInfoHistories to delete.
     * @example
     * // Delete a few PersonalInfoHistories
     * const { count } = await prisma.personalInfoHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PersonalInfoHistoryDeleteManyArgs>(args?: SelectSubset<T, PersonalInfoHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PersonalInfoHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalInfoHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PersonalInfoHistories
     * const personalInfoHistory = await prisma.personalInfoHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PersonalInfoHistoryUpdateManyArgs>(args: SelectSubset<T, PersonalInfoHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PersonalInfoHistories and returns the data updated in the database.
     * @param {PersonalInfoHistoryUpdateManyAndReturnArgs} args - Arguments to update many PersonalInfoHistories.
     * @example
     * // Update many PersonalInfoHistories
     * const personalInfoHistory = await prisma.personalInfoHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PersonalInfoHistories and only return the `id`
     * const personalInfoHistoryWithIdOnly = await prisma.personalInfoHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PersonalInfoHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, PersonalInfoHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PersonalInfoHistory.
     * @param {PersonalInfoHistoryUpsertArgs} args - Arguments to update or create a PersonalInfoHistory.
     * @example
     * // Update or create a PersonalInfoHistory
     * const personalInfoHistory = await prisma.personalInfoHistory.upsert({
     *   create: {
     *     // ... data to create a PersonalInfoHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PersonalInfoHistory we want to update
     *   }
     * })
     */
    upsert<T extends PersonalInfoHistoryUpsertArgs>(args: SelectSubset<T, PersonalInfoHistoryUpsertArgs<ExtArgs>>): Prisma__PersonalInfoHistoryClient<$Result.GetResult<Prisma.$PersonalInfoHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PersonalInfoHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalInfoHistoryCountArgs} args - Arguments to filter PersonalInfoHistories to count.
     * @example
     * // Count the number of PersonalInfoHistories
     * const count = await prisma.personalInfoHistory.count({
     *   where: {
     *     // ... the filter for the PersonalInfoHistories we want to count
     *   }
     * })
    **/
    count<T extends PersonalInfoHistoryCountArgs>(
      args?: Subset<T, PersonalInfoHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PersonalInfoHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PersonalInfoHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalInfoHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PersonalInfoHistoryAggregateArgs>(args: Subset<T, PersonalInfoHistoryAggregateArgs>): Prisma.PrismaPromise<GetPersonalInfoHistoryAggregateType<T>>

    /**
     * Group by PersonalInfoHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalInfoHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PersonalInfoHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PersonalInfoHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PersonalInfoHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PersonalInfoHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersonalInfoHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PersonalInfoHistory model
   */
  readonly fields: PersonalInfoHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PersonalInfoHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PersonalInfoHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee_info<T extends EmployeeInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeInfoDefaultArgs<ExtArgs>>): Prisma__EmployeeInfoClient<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PersonalInfoHistory model
   */
  interface PersonalInfoHistoryFieldRefs {
    readonly id: FieldRef<"PersonalInfoHistory", 'Int'>
    readonly employee_info_id: FieldRef<"PersonalInfoHistory", 'Int'>
    readonly last_name: FieldRef<"PersonalInfoHistory", 'String'>
    readonly first_name: FieldRef<"PersonalInfoHistory", 'String'>
    readonly address: FieldRef<"PersonalInfoHistory", 'String'>
    readonly phone_number: FieldRef<"PersonalInfoHistory", 'String'>
    readonly emergency_contact: FieldRef<"PersonalInfoHistory", 'String'>
    readonly birthplace: FieldRef<"PersonalInfoHistory", 'String'>
    readonly allergy: FieldRef<"PersonalInfoHistory", 'String'>
    readonly added_at: FieldRef<"PersonalInfoHistory", 'DateTime'>
    readonly deleted_at: FieldRef<"PersonalInfoHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PersonalInfoHistory findUnique
   */
  export type PersonalInfoHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PersonalInfoHistory to fetch.
     */
    where: PersonalInfoHistoryWhereUniqueInput
  }

  /**
   * PersonalInfoHistory findUniqueOrThrow
   */
  export type PersonalInfoHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PersonalInfoHistory to fetch.
     */
    where: PersonalInfoHistoryWhereUniqueInput
  }

  /**
   * PersonalInfoHistory findFirst
   */
  export type PersonalInfoHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PersonalInfoHistory to fetch.
     */
    where?: PersonalInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalInfoHistories to fetch.
     */
    orderBy?: PersonalInfoHistoryOrderByWithRelationInput | PersonalInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PersonalInfoHistories.
     */
    cursor?: PersonalInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalInfoHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PersonalInfoHistories.
     */
    distinct?: PersonalInfoHistoryScalarFieldEnum | PersonalInfoHistoryScalarFieldEnum[]
  }

  /**
   * PersonalInfoHistory findFirstOrThrow
   */
  export type PersonalInfoHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PersonalInfoHistory to fetch.
     */
    where?: PersonalInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalInfoHistories to fetch.
     */
    orderBy?: PersonalInfoHistoryOrderByWithRelationInput | PersonalInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PersonalInfoHistories.
     */
    cursor?: PersonalInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalInfoHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PersonalInfoHistories.
     */
    distinct?: PersonalInfoHistoryScalarFieldEnum | PersonalInfoHistoryScalarFieldEnum[]
  }

  /**
   * PersonalInfoHistory findMany
   */
  export type PersonalInfoHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PersonalInfoHistories to fetch.
     */
    where?: PersonalInfoHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalInfoHistories to fetch.
     */
    orderBy?: PersonalInfoHistoryOrderByWithRelationInput | PersonalInfoHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PersonalInfoHistories.
     */
    cursor?: PersonalInfoHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalInfoHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalInfoHistories.
     */
    skip?: number
    distinct?: PersonalInfoHistoryScalarFieldEnum | PersonalInfoHistoryScalarFieldEnum[]
  }

  /**
   * PersonalInfoHistory create
   */
  export type PersonalInfoHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PersonalInfoHistory.
     */
    data: XOR<PersonalInfoHistoryCreateInput, PersonalInfoHistoryUncheckedCreateInput>
  }

  /**
   * PersonalInfoHistory createMany
   */
  export type PersonalInfoHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PersonalInfoHistories.
     */
    data: PersonalInfoHistoryCreateManyInput | PersonalInfoHistoryCreateManyInput[]
  }

  /**
   * PersonalInfoHistory createManyAndReturn
   */
  export type PersonalInfoHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many PersonalInfoHistories.
     */
    data: PersonalInfoHistoryCreateManyInput | PersonalInfoHistoryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PersonalInfoHistory update
   */
  export type PersonalInfoHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PersonalInfoHistory.
     */
    data: XOR<PersonalInfoHistoryUpdateInput, PersonalInfoHistoryUncheckedUpdateInput>
    /**
     * Choose, which PersonalInfoHistory to update.
     */
    where: PersonalInfoHistoryWhereUniqueInput
  }

  /**
   * PersonalInfoHistory updateMany
   */
  export type PersonalInfoHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PersonalInfoHistories.
     */
    data: XOR<PersonalInfoHistoryUpdateManyMutationInput, PersonalInfoHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PersonalInfoHistories to update
     */
    where?: PersonalInfoHistoryWhereInput
    /**
     * Limit how many PersonalInfoHistories to update.
     */
    limit?: number
  }

  /**
   * PersonalInfoHistory updateManyAndReturn
   */
  export type PersonalInfoHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * The data used to update PersonalInfoHistories.
     */
    data: XOR<PersonalInfoHistoryUpdateManyMutationInput, PersonalInfoHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PersonalInfoHistories to update
     */
    where?: PersonalInfoHistoryWhereInput
    /**
     * Limit how many PersonalInfoHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PersonalInfoHistory upsert
   */
  export type PersonalInfoHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PersonalInfoHistory to update in case it exists.
     */
    where: PersonalInfoHistoryWhereUniqueInput
    /**
     * In case the PersonalInfoHistory found by the `where` argument doesn't exist, create a new PersonalInfoHistory with this data.
     */
    create: XOR<PersonalInfoHistoryCreateInput, PersonalInfoHistoryUncheckedCreateInput>
    /**
     * In case the PersonalInfoHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PersonalInfoHistoryUpdateInput, PersonalInfoHistoryUncheckedUpdateInput>
  }

  /**
   * PersonalInfoHistory delete
   */
  export type PersonalInfoHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
    /**
     * Filter which PersonalInfoHistory to delete.
     */
    where: PersonalInfoHistoryWhereUniqueInput
  }

  /**
   * PersonalInfoHistory deleteMany
   */
  export type PersonalInfoHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PersonalInfoHistories to delete
     */
    where?: PersonalInfoHistoryWhereInput
    /**
     * Limit how many PersonalInfoHistories to delete.
     */
    limit?: number
  }

  /**
   * PersonalInfoHistory without action
   */
  export type PersonalInfoHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalInfoHistory
     */
    select?: PersonalInfoHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalInfoHistory
     */
    omit?: PersonalInfoHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInfoHistoryInclude<ExtArgs> | null
  }


  /**
   * Model CompanyInfo
   */

  export type AggregateCompanyInfo = {
    _count: CompanyInfoCountAggregateOutputType | null
    _avg: CompanyInfoAvgAggregateOutputType | null
    _sum: CompanyInfoSumAggregateOutputType | null
    _min: CompanyInfoMinAggregateOutputType | null
    _max: CompanyInfoMaxAggregateOutputType | null
  }

  export type CompanyInfoAvgAggregateOutputType = {
    id: number | null
  }

  export type CompanyInfoSumAggregateOutputType = {
    id: number | null
  }

  export type CompanyInfoMinAggregateOutputType = {
    id: number | null
    employee_code: string | null
    email: string | null
    phone_ext: string | null
    office_location: string | null
    cost_center: string | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type CompanyInfoMaxAggregateOutputType = {
    id: number | null
    employee_code: string | null
    email: string | null
    phone_ext: string | null
    office_location: string | null
    cost_center: string | null
    added_at: Date | null
    deleted_at: Date | null
  }

  export type CompanyInfoCountAggregateOutputType = {
    id: number
    employee_code: number
    email: number
    phone_ext: number
    office_location: number
    cost_center: number
    added_at: number
    deleted_at: number
    _all: number
  }


  export type CompanyInfoAvgAggregateInputType = {
    id?: true
  }

  export type CompanyInfoSumAggregateInputType = {
    id?: true
  }

  export type CompanyInfoMinAggregateInputType = {
    id?: true
    employee_code?: true
    email?: true
    phone_ext?: true
    office_location?: true
    cost_center?: true
    added_at?: true
    deleted_at?: true
  }

  export type CompanyInfoMaxAggregateInputType = {
    id?: true
    employee_code?: true
    email?: true
    phone_ext?: true
    office_location?: true
    cost_center?: true
    added_at?: true
    deleted_at?: true
  }

  export type CompanyInfoCountAggregateInputType = {
    id?: true
    employee_code?: true
    email?: true
    phone_ext?: true
    office_location?: true
    cost_center?: true
    added_at?: true
    deleted_at?: true
    _all?: true
  }

  export type CompanyInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanyInfo to aggregate.
     */
    where?: CompanyInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyInfos to fetch.
     */
    orderBy?: CompanyInfoOrderByWithRelationInput | CompanyInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompanyInfos
    **/
    _count?: true | CompanyInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompanyInfoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompanyInfoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyInfoMaxAggregateInputType
  }

  export type GetCompanyInfoAggregateType<T extends CompanyInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateCompanyInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompanyInfo[P]>
      : GetScalarType<T[P], AggregateCompanyInfo[P]>
  }




  export type CompanyInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyInfoWhereInput
    orderBy?: CompanyInfoOrderByWithAggregationInput | CompanyInfoOrderByWithAggregationInput[]
    by: CompanyInfoScalarFieldEnum[] | CompanyInfoScalarFieldEnum
    having?: CompanyInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyInfoCountAggregateInputType | true
    _avg?: CompanyInfoAvgAggregateInputType
    _sum?: CompanyInfoSumAggregateInputType
    _min?: CompanyInfoMinAggregateInputType
    _max?: CompanyInfoMaxAggregateInputType
  }

  export type CompanyInfoGroupByOutputType = {
    id: number
    employee_code: string | null
    email: string | null
    phone_ext: string | null
    office_location: string | null
    cost_center: string | null
    added_at: Date
    deleted_at: Date | null
    _count: CompanyInfoCountAggregateOutputType | null
    _avg: CompanyInfoAvgAggregateOutputType | null
    _sum: CompanyInfoSumAggregateOutputType | null
    _min: CompanyInfoMinAggregateOutputType | null
    _max: CompanyInfoMaxAggregateOutputType | null
  }

  type GetCompanyInfoGroupByPayload<T extends CompanyInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyInfoGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyInfoGroupByOutputType[P]>
        }
      >
    >


  export type CompanyInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_code?: boolean
    email?: boolean
    phone_ext?: boolean
    office_location?: boolean
    cost_center?: boolean
    added_at?: boolean
    deleted_at?: boolean
    employees?: boolean | CompanyInfo$employeesArgs<ExtArgs>
    _count?: boolean | CompanyInfoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyInfo"]>

  export type CompanyInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_code?: boolean
    email?: boolean
    phone_ext?: boolean
    office_location?: boolean
    cost_center?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["companyInfo"]>

  export type CompanyInfoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employee_code?: boolean
    email?: boolean
    phone_ext?: boolean
    office_location?: boolean
    cost_center?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["companyInfo"]>

  export type CompanyInfoSelectScalar = {
    id?: boolean
    employee_code?: boolean
    email?: boolean
    phone_ext?: boolean
    office_location?: boolean
    cost_center?: boolean
    added_at?: boolean
    deleted_at?: boolean
  }

  export type CompanyInfoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employee_code" | "email" | "phone_ext" | "office_location" | "cost_center" | "added_at" | "deleted_at", ExtArgs["result"]["companyInfo"]>
  export type CompanyInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | CompanyInfo$employeesArgs<ExtArgs>
    _count?: boolean | CompanyInfoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CompanyInfoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompanyInfo"
    objects: {
      employees: Prisma.$EmployeeInfoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      employee_code: string | null
      email: string | null
      phone_ext: string | null
      office_location: string | null
      cost_center: string | null
      added_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["companyInfo"]>
    composites: {}
  }

  type CompanyInfoGetPayload<S extends boolean | null | undefined | CompanyInfoDefaultArgs> = $Result.GetResult<Prisma.$CompanyInfoPayload, S>

  type CompanyInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyInfoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyInfoCountAggregateInputType | true
    }

  export interface CompanyInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompanyInfo'], meta: { name: 'CompanyInfo' } }
    /**
     * Find zero or one CompanyInfo that matches the filter.
     * @param {CompanyInfoFindUniqueArgs} args - Arguments to find a CompanyInfo
     * @example
     * // Get one CompanyInfo
     * const companyInfo = await prisma.companyInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyInfoFindUniqueArgs>(args: SelectSubset<T, CompanyInfoFindUniqueArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CompanyInfo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyInfoFindUniqueOrThrowArgs} args - Arguments to find a CompanyInfo
     * @example
     * // Get one CompanyInfo
     * const companyInfo = await prisma.companyInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanyInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyInfoFindFirstArgs} args - Arguments to find a CompanyInfo
     * @example
     * // Get one CompanyInfo
     * const companyInfo = await prisma.companyInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyInfoFindFirstArgs>(args?: SelectSubset<T, CompanyInfoFindFirstArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanyInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyInfoFindFirstOrThrowArgs} args - Arguments to find a CompanyInfo
     * @example
     * // Get one CompanyInfo
     * const companyInfo = await prisma.companyInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CompanyInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompanyInfos
     * const companyInfos = await prisma.companyInfo.findMany()
     * 
     * // Get first 10 CompanyInfos
     * const companyInfos = await prisma.companyInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyInfoWithIdOnly = await prisma.companyInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyInfoFindManyArgs>(args?: SelectSubset<T, CompanyInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CompanyInfo.
     * @param {CompanyInfoCreateArgs} args - Arguments to create a CompanyInfo.
     * @example
     * // Create one CompanyInfo
     * const CompanyInfo = await prisma.companyInfo.create({
     *   data: {
     *     // ... data to create a CompanyInfo
     *   }
     * })
     * 
     */
    create<T extends CompanyInfoCreateArgs>(args: SelectSubset<T, CompanyInfoCreateArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CompanyInfos.
     * @param {CompanyInfoCreateManyArgs} args - Arguments to create many CompanyInfos.
     * @example
     * // Create many CompanyInfos
     * const companyInfo = await prisma.companyInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyInfoCreateManyArgs>(args?: SelectSubset<T, CompanyInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompanyInfos and returns the data saved in the database.
     * @param {CompanyInfoCreateManyAndReturnArgs} args - Arguments to create many CompanyInfos.
     * @example
     * // Create many CompanyInfos
     * const companyInfo = await prisma.companyInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompanyInfos and only return the `id`
     * const companyInfoWithIdOnly = await prisma.companyInfo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CompanyInfo.
     * @param {CompanyInfoDeleteArgs} args - Arguments to delete one CompanyInfo.
     * @example
     * // Delete one CompanyInfo
     * const CompanyInfo = await prisma.companyInfo.delete({
     *   where: {
     *     // ... filter to delete one CompanyInfo
     *   }
     * })
     * 
     */
    delete<T extends CompanyInfoDeleteArgs>(args: SelectSubset<T, CompanyInfoDeleteArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CompanyInfo.
     * @param {CompanyInfoUpdateArgs} args - Arguments to update one CompanyInfo.
     * @example
     * // Update one CompanyInfo
     * const companyInfo = await prisma.companyInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyInfoUpdateArgs>(args: SelectSubset<T, CompanyInfoUpdateArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CompanyInfos.
     * @param {CompanyInfoDeleteManyArgs} args - Arguments to filter CompanyInfos to delete.
     * @example
     * // Delete a few CompanyInfos
     * const { count } = await prisma.companyInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyInfoDeleteManyArgs>(args?: SelectSubset<T, CompanyInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanyInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompanyInfos
     * const companyInfo = await prisma.companyInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyInfoUpdateManyArgs>(args: SelectSubset<T, CompanyInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanyInfos and returns the data updated in the database.
     * @param {CompanyInfoUpdateManyAndReturnArgs} args - Arguments to update many CompanyInfos.
     * @example
     * // Update many CompanyInfos
     * const companyInfo = await prisma.companyInfo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CompanyInfos and only return the `id`
     * const companyInfoWithIdOnly = await prisma.companyInfo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CompanyInfoUpdateManyAndReturnArgs>(args: SelectSubset<T, CompanyInfoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CompanyInfo.
     * @param {CompanyInfoUpsertArgs} args - Arguments to update or create a CompanyInfo.
     * @example
     * // Update or create a CompanyInfo
     * const companyInfo = await prisma.companyInfo.upsert({
     *   create: {
     *     // ... data to create a CompanyInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompanyInfo we want to update
     *   }
     * })
     */
    upsert<T extends CompanyInfoUpsertArgs>(args: SelectSubset<T, CompanyInfoUpsertArgs<ExtArgs>>): Prisma__CompanyInfoClient<$Result.GetResult<Prisma.$CompanyInfoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CompanyInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyInfoCountArgs} args - Arguments to filter CompanyInfos to count.
     * @example
     * // Count the number of CompanyInfos
     * const count = await prisma.companyInfo.count({
     *   where: {
     *     // ... the filter for the CompanyInfos we want to count
     *   }
     * })
    **/
    count<T extends CompanyInfoCountArgs>(
      args?: Subset<T, CompanyInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompanyInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyInfoAggregateArgs>(args: Subset<T, CompanyInfoAggregateArgs>): Prisma.PrismaPromise<GetCompanyInfoAggregateType<T>>

    /**
     * Group by CompanyInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyInfoGroupByArgs['orderBy'] }
        : { orderBy?: CompanyInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompanyInfo model
   */
  readonly fields: CompanyInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompanyInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employees<T extends CompanyInfo$employeesArgs<ExtArgs> = {}>(args?: Subset<T, CompanyInfo$employeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeeInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompanyInfo model
   */
  interface CompanyInfoFieldRefs {
    readonly id: FieldRef<"CompanyInfo", 'Int'>
    readonly employee_code: FieldRef<"CompanyInfo", 'String'>
    readonly email: FieldRef<"CompanyInfo", 'String'>
    readonly phone_ext: FieldRef<"CompanyInfo", 'String'>
    readonly office_location: FieldRef<"CompanyInfo", 'String'>
    readonly cost_center: FieldRef<"CompanyInfo", 'String'>
    readonly added_at: FieldRef<"CompanyInfo", 'DateTime'>
    readonly deleted_at: FieldRef<"CompanyInfo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompanyInfo findUnique
   */
  export type CompanyInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * Filter, which CompanyInfo to fetch.
     */
    where: CompanyInfoWhereUniqueInput
  }

  /**
   * CompanyInfo findUniqueOrThrow
   */
  export type CompanyInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * Filter, which CompanyInfo to fetch.
     */
    where: CompanyInfoWhereUniqueInput
  }

  /**
   * CompanyInfo findFirst
   */
  export type CompanyInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * Filter, which CompanyInfo to fetch.
     */
    where?: CompanyInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyInfos to fetch.
     */
    orderBy?: CompanyInfoOrderByWithRelationInput | CompanyInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanyInfos.
     */
    cursor?: CompanyInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanyInfos.
     */
    distinct?: CompanyInfoScalarFieldEnum | CompanyInfoScalarFieldEnum[]
  }

  /**
   * CompanyInfo findFirstOrThrow
   */
  export type CompanyInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * Filter, which CompanyInfo to fetch.
     */
    where?: CompanyInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyInfos to fetch.
     */
    orderBy?: CompanyInfoOrderByWithRelationInput | CompanyInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanyInfos.
     */
    cursor?: CompanyInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanyInfos.
     */
    distinct?: CompanyInfoScalarFieldEnum | CompanyInfoScalarFieldEnum[]
  }

  /**
   * CompanyInfo findMany
   */
  export type CompanyInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * Filter, which CompanyInfos to fetch.
     */
    where?: CompanyInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyInfos to fetch.
     */
    orderBy?: CompanyInfoOrderByWithRelationInput | CompanyInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompanyInfos.
     */
    cursor?: CompanyInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyInfos.
     */
    skip?: number
    distinct?: CompanyInfoScalarFieldEnum | CompanyInfoScalarFieldEnum[]
  }

  /**
   * CompanyInfo create
   */
  export type CompanyInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a CompanyInfo.
     */
    data?: XOR<CompanyInfoCreateInput, CompanyInfoUncheckedCreateInput>
  }

  /**
   * CompanyInfo createMany
   */
  export type CompanyInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompanyInfos.
     */
    data: CompanyInfoCreateManyInput | CompanyInfoCreateManyInput[]
  }

  /**
   * CompanyInfo createManyAndReturn
   */
  export type CompanyInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * The data used to create many CompanyInfos.
     */
    data: CompanyInfoCreateManyInput | CompanyInfoCreateManyInput[]
  }

  /**
   * CompanyInfo update
   */
  export type CompanyInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a CompanyInfo.
     */
    data: XOR<CompanyInfoUpdateInput, CompanyInfoUncheckedUpdateInput>
    /**
     * Choose, which CompanyInfo to update.
     */
    where: CompanyInfoWhereUniqueInput
  }

  /**
   * CompanyInfo updateMany
   */
  export type CompanyInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompanyInfos.
     */
    data: XOR<CompanyInfoUpdateManyMutationInput, CompanyInfoUncheckedUpdateManyInput>
    /**
     * Filter which CompanyInfos to update
     */
    where?: CompanyInfoWhereInput
    /**
     * Limit how many CompanyInfos to update.
     */
    limit?: number
  }

  /**
   * CompanyInfo updateManyAndReturn
   */
  export type CompanyInfoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * The data used to update CompanyInfos.
     */
    data: XOR<CompanyInfoUpdateManyMutationInput, CompanyInfoUncheckedUpdateManyInput>
    /**
     * Filter which CompanyInfos to update
     */
    where?: CompanyInfoWhereInput
    /**
     * Limit how many CompanyInfos to update.
     */
    limit?: number
  }

  /**
   * CompanyInfo upsert
   */
  export type CompanyInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the CompanyInfo to update in case it exists.
     */
    where: CompanyInfoWhereUniqueInput
    /**
     * In case the CompanyInfo found by the `where` argument doesn't exist, create a new CompanyInfo with this data.
     */
    create: XOR<CompanyInfoCreateInput, CompanyInfoUncheckedCreateInput>
    /**
     * In case the CompanyInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyInfoUpdateInput, CompanyInfoUncheckedUpdateInput>
  }

  /**
   * CompanyInfo delete
   */
  export type CompanyInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
    /**
     * Filter which CompanyInfo to delete.
     */
    where: CompanyInfoWhereUniqueInput
  }

  /**
   * CompanyInfo deleteMany
   */
  export type CompanyInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanyInfos to delete
     */
    where?: CompanyInfoWhereInput
    /**
     * Limit how many CompanyInfos to delete.
     */
    limit?: number
  }

  /**
   * CompanyInfo.employees
   */
  export type CompanyInfo$employeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeInfo
     */
    select?: EmployeeInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmployeeInfo
     */
    omit?: EmployeeInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInfoInclude<ExtArgs> | null
    where?: EmployeeInfoWhereInput
    orderBy?: EmployeeInfoOrderByWithRelationInput | EmployeeInfoOrderByWithRelationInput[]
    cursor?: EmployeeInfoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmployeeInfoScalarFieldEnum | EmployeeInfoScalarFieldEnum[]
  }

  /**
   * CompanyInfo without action
   */
  export type CompanyInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyInfo
     */
    select?: CompanyInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyInfo
     */
    omit?: CompanyInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInfoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EmployeeStatusHistoryScalarFieldEnum: {
    id: 'id',
    employee_number: 'employee_number',
    joined_year: 'joined_year',
    retired_year: 'retired_year',
    data_updated_at: 'data_updated_at',
    data_added_at: 'data_added_at',
    is_visible: 'is_visible'
  };

  export type EmployeeStatusHistoryScalarFieldEnum = (typeof EmployeeStatusHistoryScalarFieldEnum)[keyof typeof EmployeeStatusHistoryScalarFieldEnum]


  export const PositionHistoryScalarFieldEnum: {
    id: 'id',
    employee_info_id: 'employee_info_id',
    position: 'position',
    added_at: 'added_at',
    add_reason: 'add_reason'
  };

  export type PositionHistoryScalarFieldEnum = (typeof PositionHistoryScalarFieldEnum)[keyof typeof PositionHistoryScalarFieldEnum]


  export const EmployeeInfoScalarFieldEnum: {
    id: 'id',
    employee_number: 'employee_number',
    department_id: 'department_id',
    personal_info_id: 'personal_info_id',
    company_info_id: 'company_info_id'
  };

  export type EmployeeInfoScalarFieldEnum = (typeof EmployeeInfoScalarFieldEnum)[keyof typeof EmployeeInfoScalarFieldEnum]


  export const DepartmentInfoHistoryScalarFieldEnum: {
    id: 'id',
    employee_info_id: 'employee_info_id',
    department_id: 'department_id',
    added_at: 'added_at',
    deleted_at: 'deleted_at'
  };

  export type DepartmentInfoHistoryScalarFieldEnum = (typeof DepartmentInfoHistoryScalarFieldEnum)[keyof typeof DepartmentInfoHistoryScalarFieldEnum]


  export const DepartmentInfoScalarFieldEnum: {
    id: 'id',
    parent_id: 'parent_id',
    name: 'name',
    full_name: 'full_name',
    added_at: 'added_at',
    deleted_at: 'deleted_at'
  };

  export type DepartmentInfoScalarFieldEnum = (typeof DepartmentInfoScalarFieldEnum)[keyof typeof DepartmentInfoScalarFieldEnum]


  export const PersonalInfoHistoryScalarFieldEnum: {
    id: 'id',
    employee_info_id: 'employee_info_id',
    last_name: 'last_name',
    first_name: 'first_name',
    address: 'address',
    phone_number: 'phone_number',
    emergency_contact: 'emergency_contact',
    birthplace: 'birthplace',
    allergy: 'allergy',
    added_at: 'added_at',
    deleted_at: 'deleted_at'
  };

  export type PersonalInfoHistoryScalarFieldEnum = (typeof PersonalInfoHistoryScalarFieldEnum)[keyof typeof PersonalInfoHistoryScalarFieldEnum]


  export const CompanyInfoScalarFieldEnum: {
    id: 'id',
    employee_code: 'employee_code',
    email: 'email',
    phone_ext: 'phone_ext',
    office_location: 'office_location',
    cost_center: 'cost_center',
    added_at: 'added_at',
    deleted_at: 'deleted_at'
  };

  export type CompanyInfoScalarFieldEnum = (typeof CompanyInfoScalarFieldEnum)[keyof typeof CompanyInfoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type EmployeeStatusHistoryWhereInput = {
    AND?: EmployeeStatusHistoryWhereInput | EmployeeStatusHistoryWhereInput[]
    OR?: EmployeeStatusHistoryWhereInput[]
    NOT?: EmployeeStatusHistoryWhereInput | EmployeeStatusHistoryWhereInput[]
    id?: IntFilter<"EmployeeStatusHistory"> | number
    employee_number?: IntFilter<"EmployeeStatusHistory"> | number
    joined_year?: IntFilter<"EmployeeStatusHistory"> | number
    retired_year?: IntNullableFilter<"EmployeeStatusHistory"> | number | null
    data_updated_at?: DateTimeFilter<"EmployeeStatusHistory"> | Date | string
    data_added_at?: DateTimeFilter<"EmployeeStatusHistory"> | Date | string
    is_visible?: BoolFilter<"EmployeeStatusHistory"> | boolean
  }

  export type EmployeeStatusHistoryOrderByWithRelationInput = {
    id?: SortOrder
    employee_number?: SortOrder
    joined_year?: SortOrder
    retired_year?: SortOrderInput | SortOrder
    data_updated_at?: SortOrder
    data_added_at?: SortOrder
    is_visible?: SortOrder
  }

  export type EmployeeStatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EmployeeStatusHistoryWhereInput | EmployeeStatusHistoryWhereInput[]
    OR?: EmployeeStatusHistoryWhereInput[]
    NOT?: EmployeeStatusHistoryWhereInput | EmployeeStatusHistoryWhereInput[]
    employee_number?: IntFilter<"EmployeeStatusHistory"> | number
    joined_year?: IntFilter<"EmployeeStatusHistory"> | number
    retired_year?: IntNullableFilter<"EmployeeStatusHistory"> | number | null
    data_updated_at?: DateTimeFilter<"EmployeeStatusHistory"> | Date | string
    data_added_at?: DateTimeFilter<"EmployeeStatusHistory"> | Date | string
    is_visible?: BoolFilter<"EmployeeStatusHistory"> | boolean
  }, "id">

  export type EmployeeStatusHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    employee_number?: SortOrder
    joined_year?: SortOrder
    retired_year?: SortOrderInput | SortOrder
    data_updated_at?: SortOrder
    data_added_at?: SortOrder
    is_visible?: SortOrder
    _count?: EmployeeStatusHistoryCountOrderByAggregateInput
    _avg?: EmployeeStatusHistoryAvgOrderByAggregateInput
    _max?: EmployeeStatusHistoryMaxOrderByAggregateInput
    _min?: EmployeeStatusHistoryMinOrderByAggregateInput
    _sum?: EmployeeStatusHistorySumOrderByAggregateInput
  }

  export type EmployeeStatusHistoryScalarWhereWithAggregatesInput = {
    AND?: EmployeeStatusHistoryScalarWhereWithAggregatesInput | EmployeeStatusHistoryScalarWhereWithAggregatesInput[]
    OR?: EmployeeStatusHistoryScalarWhereWithAggregatesInput[]
    NOT?: EmployeeStatusHistoryScalarWhereWithAggregatesInput | EmployeeStatusHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EmployeeStatusHistory"> | number
    employee_number?: IntWithAggregatesFilter<"EmployeeStatusHistory"> | number
    joined_year?: IntWithAggregatesFilter<"EmployeeStatusHistory"> | number
    retired_year?: IntNullableWithAggregatesFilter<"EmployeeStatusHistory"> | number | null
    data_updated_at?: DateTimeWithAggregatesFilter<"EmployeeStatusHistory"> | Date | string
    data_added_at?: DateTimeWithAggregatesFilter<"EmployeeStatusHistory"> | Date | string
    is_visible?: BoolWithAggregatesFilter<"EmployeeStatusHistory"> | boolean
  }

  export type PositionHistoryWhereInput = {
    AND?: PositionHistoryWhereInput | PositionHistoryWhereInput[]
    OR?: PositionHistoryWhereInput[]
    NOT?: PositionHistoryWhereInput | PositionHistoryWhereInput[]
    id?: IntFilter<"PositionHistory"> | number
    employee_info_id?: IntFilter<"PositionHistory"> | number
    position?: StringFilter<"PositionHistory"> | string
    added_at?: DateTimeFilter<"PositionHistory"> | Date | string
    add_reason?: StringNullableFilter<"PositionHistory"> | string | null
    employee_info?: XOR<EmployeeInfoScalarRelationFilter, EmployeeInfoWhereInput>
  }

  export type PositionHistoryOrderByWithRelationInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    position?: SortOrder
    added_at?: SortOrder
    add_reason?: SortOrderInput | SortOrder
    employee_info?: EmployeeInfoOrderByWithRelationInput
  }

  export type PositionHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PositionHistoryWhereInput | PositionHistoryWhereInput[]
    OR?: PositionHistoryWhereInput[]
    NOT?: PositionHistoryWhereInput | PositionHistoryWhereInput[]
    employee_info_id?: IntFilter<"PositionHistory"> | number
    position?: StringFilter<"PositionHistory"> | string
    added_at?: DateTimeFilter<"PositionHistory"> | Date | string
    add_reason?: StringNullableFilter<"PositionHistory"> | string | null
    employee_info?: XOR<EmployeeInfoScalarRelationFilter, EmployeeInfoWhereInput>
  }, "id">

  export type PositionHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    position?: SortOrder
    added_at?: SortOrder
    add_reason?: SortOrderInput | SortOrder
    _count?: PositionHistoryCountOrderByAggregateInput
    _avg?: PositionHistoryAvgOrderByAggregateInput
    _max?: PositionHistoryMaxOrderByAggregateInput
    _min?: PositionHistoryMinOrderByAggregateInput
    _sum?: PositionHistorySumOrderByAggregateInput
  }

  export type PositionHistoryScalarWhereWithAggregatesInput = {
    AND?: PositionHistoryScalarWhereWithAggregatesInput | PositionHistoryScalarWhereWithAggregatesInput[]
    OR?: PositionHistoryScalarWhereWithAggregatesInput[]
    NOT?: PositionHistoryScalarWhereWithAggregatesInput | PositionHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PositionHistory"> | number
    employee_info_id?: IntWithAggregatesFilter<"PositionHistory"> | number
    position?: StringWithAggregatesFilter<"PositionHistory"> | string
    added_at?: DateTimeWithAggregatesFilter<"PositionHistory"> | Date | string
    add_reason?: StringNullableWithAggregatesFilter<"PositionHistory"> | string | null
  }

  export type EmployeeInfoWhereInput = {
    AND?: EmployeeInfoWhereInput | EmployeeInfoWhereInput[]
    OR?: EmployeeInfoWhereInput[]
    NOT?: EmployeeInfoWhereInput | EmployeeInfoWhereInput[]
    id?: IntFilter<"EmployeeInfo"> | number
    employee_number?: IntNullableFilter<"EmployeeInfo"> | number | null
    department_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    personal_info_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    company_info_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    positions?: PositionHistoryListRelationFilter
    personal_histories?: PersonalInfoHistoryListRelationFilter
    department_histories?: DepartmentInfoHistoryListRelationFilter
    company_info?: XOR<CompanyInfoNullableScalarRelationFilter, CompanyInfoWhereInput> | null
  }

  export type EmployeeInfoOrderByWithRelationInput = {
    id?: SortOrder
    employee_number?: SortOrderInput | SortOrder
    department_id?: SortOrderInput | SortOrder
    personal_info_id?: SortOrderInput | SortOrder
    company_info_id?: SortOrderInput | SortOrder
    positions?: PositionHistoryOrderByRelationAggregateInput
    personal_histories?: PersonalInfoHistoryOrderByRelationAggregateInput
    department_histories?: DepartmentInfoHistoryOrderByRelationAggregateInput
    company_info?: CompanyInfoOrderByWithRelationInput
  }

  export type EmployeeInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EmployeeInfoWhereInput | EmployeeInfoWhereInput[]
    OR?: EmployeeInfoWhereInput[]
    NOT?: EmployeeInfoWhereInput | EmployeeInfoWhereInput[]
    employee_number?: IntNullableFilter<"EmployeeInfo"> | number | null
    department_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    personal_info_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    company_info_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    positions?: PositionHistoryListRelationFilter
    personal_histories?: PersonalInfoHistoryListRelationFilter
    department_histories?: DepartmentInfoHistoryListRelationFilter
    company_info?: XOR<CompanyInfoNullableScalarRelationFilter, CompanyInfoWhereInput> | null
  }, "id">

  export type EmployeeInfoOrderByWithAggregationInput = {
    id?: SortOrder
    employee_number?: SortOrderInput | SortOrder
    department_id?: SortOrderInput | SortOrder
    personal_info_id?: SortOrderInput | SortOrder
    company_info_id?: SortOrderInput | SortOrder
    _count?: EmployeeInfoCountOrderByAggregateInput
    _avg?: EmployeeInfoAvgOrderByAggregateInput
    _max?: EmployeeInfoMaxOrderByAggregateInput
    _min?: EmployeeInfoMinOrderByAggregateInput
    _sum?: EmployeeInfoSumOrderByAggregateInput
  }

  export type EmployeeInfoScalarWhereWithAggregatesInput = {
    AND?: EmployeeInfoScalarWhereWithAggregatesInput | EmployeeInfoScalarWhereWithAggregatesInput[]
    OR?: EmployeeInfoScalarWhereWithAggregatesInput[]
    NOT?: EmployeeInfoScalarWhereWithAggregatesInput | EmployeeInfoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EmployeeInfo"> | number
    employee_number?: IntNullableWithAggregatesFilter<"EmployeeInfo"> | number | null
    department_id?: IntNullableWithAggregatesFilter<"EmployeeInfo"> | number | null
    personal_info_id?: IntNullableWithAggregatesFilter<"EmployeeInfo"> | number | null
    company_info_id?: IntNullableWithAggregatesFilter<"EmployeeInfo"> | number | null
  }

  export type DepartmentInfoHistoryWhereInput = {
    AND?: DepartmentInfoHistoryWhereInput | DepartmentInfoHistoryWhereInput[]
    OR?: DepartmentInfoHistoryWhereInput[]
    NOT?: DepartmentInfoHistoryWhereInput | DepartmentInfoHistoryWhereInput[]
    id?: IntFilter<"DepartmentInfoHistory"> | number
    employee_info_id?: IntFilter<"DepartmentInfoHistory"> | number
    department_id?: IntNullableFilter<"DepartmentInfoHistory"> | number | null
    added_at?: DateTimeFilter<"DepartmentInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableFilter<"DepartmentInfoHistory"> | Date | string | null
    employee_info?: XOR<EmployeeInfoScalarRelationFilter, EmployeeInfoWhereInput>
    department?: XOR<DepartmentInfoNullableScalarRelationFilter, DepartmentInfoWhereInput> | null
  }

  export type DepartmentInfoHistoryOrderByWithRelationInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    department_id?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    employee_info?: EmployeeInfoOrderByWithRelationInput
    department?: DepartmentInfoOrderByWithRelationInput
  }

  export type DepartmentInfoHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DepartmentInfoHistoryWhereInput | DepartmentInfoHistoryWhereInput[]
    OR?: DepartmentInfoHistoryWhereInput[]
    NOT?: DepartmentInfoHistoryWhereInput | DepartmentInfoHistoryWhereInput[]
    employee_info_id?: IntFilter<"DepartmentInfoHistory"> | number
    department_id?: IntNullableFilter<"DepartmentInfoHistory"> | number | null
    added_at?: DateTimeFilter<"DepartmentInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableFilter<"DepartmentInfoHistory"> | Date | string | null
    employee_info?: XOR<EmployeeInfoScalarRelationFilter, EmployeeInfoWhereInput>
    department?: XOR<DepartmentInfoNullableScalarRelationFilter, DepartmentInfoWhereInput> | null
  }, "id">

  export type DepartmentInfoHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    department_id?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: DepartmentInfoHistoryCountOrderByAggregateInput
    _avg?: DepartmentInfoHistoryAvgOrderByAggregateInput
    _max?: DepartmentInfoHistoryMaxOrderByAggregateInput
    _min?: DepartmentInfoHistoryMinOrderByAggregateInput
    _sum?: DepartmentInfoHistorySumOrderByAggregateInput
  }

  export type DepartmentInfoHistoryScalarWhereWithAggregatesInput = {
    AND?: DepartmentInfoHistoryScalarWhereWithAggregatesInput | DepartmentInfoHistoryScalarWhereWithAggregatesInput[]
    OR?: DepartmentInfoHistoryScalarWhereWithAggregatesInput[]
    NOT?: DepartmentInfoHistoryScalarWhereWithAggregatesInput | DepartmentInfoHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DepartmentInfoHistory"> | number
    employee_info_id?: IntWithAggregatesFilter<"DepartmentInfoHistory"> | number
    department_id?: IntNullableWithAggregatesFilter<"DepartmentInfoHistory"> | number | null
    added_at?: DateTimeWithAggregatesFilter<"DepartmentInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"DepartmentInfoHistory"> | Date | string | null
  }

  export type DepartmentInfoWhereInput = {
    AND?: DepartmentInfoWhereInput | DepartmentInfoWhereInput[]
    OR?: DepartmentInfoWhereInput[]
    NOT?: DepartmentInfoWhereInput | DepartmentInfoWhereInput[]
    id?: IntFilter<"DepartmentInfo"> | number
    parent_id?: IntNullableFilter<"DepartmentInfo"> | number | null
    name?: StringFilter<"DepartmentInfo"> | string
    full_name?: StringNullableFilter<"DepartmentInfo"> | string | null
    added_at?: DateTimeFilter<"DepartmentInfo"> | Date | string
    deleted_at?: DateTimeNullableFilter<"DepartmentInfo"> | Date | string | null
    department_histories?: DepartmentInfoHistoryListRelationFilter
  }

  export type DepartmentInfoOrderByWithRelationInput = {
    id?: SortOrder
    parent_id?: SortOrderInput | SortOrder
    name?: SortOrder
    full_name?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    department_histories?: DepartmentInfoHistoryOrderByRelationAggregateInput
  }

  export type DepartmentInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DepartmentInfoWhereInput | DepartmentInfoWhereInput[]
    OR?: DepartmentInfoWhereInput[]
    NOT?: DepartmentInfoWhereInput | DepartmentInfoWhereInput[]
    parent_id?: IntNullableFilter<"DepartmentInfo"> | number | null
    name?: StringFilter<"DepartmentInfo"> | string
    full_name?: StringNullableFilter<"DepartmentInfo"> | string | null
    added_at?: DateTimeFilter<"DepartmentInfo"> | Date | string
    deleted_at?: DateTimeNullableFilter<"DepartmentInfo"> | Date | string | null
    department_histories?: DepartmentInfoHistoryListRelationFilter
  }, "id">

  export type DepartmentInfoOrderByWithAggregationInput = {
    id?: SortOrder
    parent_id?: SortOrderInput | SortOrder
    name?: SortOrder
    full_name?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: DepartmentInfoCountOrderByAggregateInput
    _avg?: DepartmentInfoAvgOrderByAggregateInput
    _max?: DepartmentInfoMaxOrderByAggregateInput
    _min?: DepartmentInfoMinOrderByAggregateInput
    _sum?: DepartmentInfoSumOrderByAggregateInput
  }

  export type DepartmentInfoScalarWhereWithAggregatesInput = {
    AND?: DepartmentInfoScalarWhereWithAggregatesInput | DepartmentInfoScalarWhereWithAggregatesInput[]
    OR?: DepartmentInfoScalarWhereWithAggregatesInput[]
    NOT?: DepartmentInfoScalarWhereWithAggregatesInput | DepartmentInfoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DepartmentInfo"> | number
    parent_id?: IntNullableWithAggregatesFilter<"DepartmentInfo"> | number | null
    name?: StringWithAggregatesFilter<"DepartmentInfo"> | string
    full_name?: StringNullableWithAggregatesFilter<"DepartmentInfo"> | string | null
    added_at?: DateTimeWithAggregatesFilter<"DepartmentInfo"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"DepartmentInfo"> | Date | string | null
  }

  export type PersonalInfoHistoryWhereInput = {
    AND?: PersonalInfoHistoryWhereInput | PersonalInfoHistoryWhereInput[]
    OR?: PersonalInfoHistoryWhereInput[]
    NOT?: PersonalInfoHistoryWhereInput | PersonalInfoHistoryWhereInput[]
    id?: IntFilter<"PersonalInfoHistory"> | number
    employee_info_id?: IntFilter<"PersonalInfoHistory"> | number
    last_name?: StringFilter<"PersonalInfoHistory"> | string
    first_name?: StringFilter<"PersonalInfoHistory"> | string
    address?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    phone_number?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    emergency_contact?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    birthplace?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    allergy?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    added_at?: DateTimeFilter<"PersonalInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableFilter<"PersonalInfoHistory"> | Date | string | null
    employee_info?: XOR<EmployeeInfoScalarRelationFilter, EmployeeInfoWhereInput>
  }

  export type PersonalInfoHistoryOrderByWithRelationInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    last_name?: SortOrder
    first_name?: SortOrder
    address?: SortOrderInput | SortOrder
    phone_number?: SortOrderInput | SortOrder
    emergency_contact?: SortOrderInput | SortOrder
    birthplace?: SortOrderInput | SortOrder
    allergy?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    employee_info?: EmployeeInfoOrderByWithRelationInput
  }

  export type PersonalInfoHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PersonalInfoHistoryWhereInput | PersonalInfoHistoryWhereInput[]
    OR?: PersonalInfoHistoryWhereInput[]
    NOT?: PersonalInfoHistoryWhereInput | PersonalInfoHistoryWhereInput[]
    employee_info_id?: IntFilter<"PersonalInfoHistory"> | number
    last_name?: StringFilter<"PersonalInfoHistory"> | string
    first_name?: StringFilter<"PersonalInfoHistory"> | string
    address?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    phone_number?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    emergency_contact?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    birthplace?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    allergy?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    added_at?: DateTimeFilter<"PersonalInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableFilter<"PersonalInfoHistory"> | Date | string | null
    employee_info?: XOR<EmployeeInfoScalarRelationFilter, EmployeeInfoWhereInput>
  }, "id">

  export type PersonalInfoHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    last_name?: SortOrder
    first_name?: SortOrder
    address?: SortOrderInput | SortOrder
    phone_number?: SortOrderInput | SortOrder
    emergency_contact?: SortOrderInput | SortOrder
    birthplace?: SortOrderInput | SortOrder
    allergy?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: PersonalInfoHistoryCountOrderByAggregateInput
    _avg?: PersonalInfoHistoryAvgOrderByAggregateInput
    _max?: PersonalInfoHistoryMaxOrderByAggregateInput
    _min?: PersonalInfoHistoryMinOrderByAggregateInput
    _sum?: PersonalInfoHistorySumOrderByAggregateInput
  }

  export type PersonalInfoHistoryScalarWhereWithAggregatesInput = {
    AND?: PersonalInfoHistoryScalarWhereWithAggregatesInput | PersonalInfoHistoryScalarWhereWithAggregatesInput[]
    OR?: PersonalInfoHistoryScalarWhereWithAggregatesInput[]
    NOT?: PersonalInfoHistoryScalarWhereWithAggregatesInput | PersonalInfoHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PersonalInfoHistory"> | number
    employee_info_id?: IntWithAggregatesFilter<"PersonalInfoHistory"> | number
    last_name?: StringWithAggregatesFilter<"PersonalInfoHistory"> | string
    first_name?: StringWithAggregatesFilter<"PersonalInfoHistory"> | string
    address?: StringNullableWithAggregatesFilter<"PersonalInfoHistory"> | string | null
    phone_number?: StringNullableWithAggregatesFilter<"PersonalInfoHistory"> | string | null
    emergency_contact?: StringNullableWithAggregatesFilter<"PersonalInfoHistory"> | string | null
    birthplace?: StringNullableWithAggregatesFilter<"PersonalInfoHistory"> | string | null
    allergy?: StringNullableWithAggregatesFilter<"PersonalInfoHistory"> | string | null
    added_at?: DateTimeWithAggregatesFilter<"PersonalInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"PersonalInfoHistory"> | Date | string | null
  }

  export type CompanyInfoWhereInput = {
    AND?: CompanyInfoWhereInput | CompanyInfoWhereInput[]
    OR?: CompanyInfoWhereInput[]
    NOT?: CompanyInfoWhereInput | CompanyInfoWhereInput[]
    id?: IntFilter<"CompanyInfo"> | number
    employee_code?: StringNullableFilter<"CompanyInfo"> | string | null
    email?: StringNullableFilter<"CompanyInfo"> | string | null
    phone_ext?: StringNullableFilter<"CompanyInfo"> | string | null
    office_location?: StringNullableFilter<"CompanyInfo"> | string | null
    cost_center?: StringNullableFilter<"CompanyInfo"> | string | null
    added_at?: DateTimeFilter<"CompanyInfo"> | Date | string
    deleted_at?: DateTimeNullableFilter<"CompanyInfo"> | Date | string | null
    employees?: EmployeeInfoListRelationFilter
  }

  export type CompanyInfoOrderByWithRelationInput = {
    id?: SortOrder
    employee_code?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone_ext?: SortOrderInput | SortOrder
    office_location?: SortOrderInput | SortOrder
    cost_center?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    employees?: EmployeeInfoOrderByRelationAggregateInput
  }

  export type CompanyInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CompanyInfoWhereInput | CompanyInfoWhereInput[]
    OR?: CompanyInfoWhereInput[]
    NOT?: CompanyInfoWhereInput | CompanyInfoWhereInput[]
    employee_code?: StringNullableFilter<"CompanyInfo"> | string | null
    email?: StringNullableFilter<"CompanyInfo"> | string | null
    phone_ext?: StringNullableFilter<"CompanyInfo"> | string | null
    office_location?: StringNullableFilter<"CompanyInfo"> | string | null
    cost_center?: StringNullableFilter<"CompanyInfo"> | string | null
    added_at?: DateTimeFilter<"CompanyInfo"> | Date | string
    deleted_at?: DateTimeNullableFilter<"CompanyInfo"> | Date | string | null
    employees?: EmployeeInfoListRelationFilter
  }, "id">

  export type CompanyInfoOrderByWithAggregationInput = {
    id?: SortOrder
    employee_code?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone_ext?: SortOrderInput | SortOrder
    office_location?: SortOrderInput | SortOrder
    cost_center?: SortOrderInput | SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: CompanyInfoCountOrderByAggregateInput
    _avg?: CompanyInfoAvgOrderByAggregateInput
    _max?: CompanyInfoMaxOrderByAggregateInput
    _min?: CompanyInfoMinOrderByAggregateInput
    _sum?: CompanyInfoSumOrderByAggregateInput
  }

  export type CompanyInfoScalarWhereWithAggregatesInput = {
    AND?: CompanyInfoScalarWhereWithAggregatesInput | CompanyInfoScalarWhereWithAggregatesInput[]
    OR?: CompanyInfoScalarWhereWithAggregatesInput[]
    NOT?: CompanyInfoScalarWhereWithAggregatesInput | CompanyInfoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CompanyInfo"> | number
    employee_code?: StringNullableWithAggregatesFilter<"CompanyInfo"> | string | null
    email?: StringNullableWithAggregatesFilter<"CompanyInfo"> | string | null
    phone_ext?: StringNullableWithAggregatesFilter<"CompanyInfo"> | string | null
    office_location?: StringNullableWithAggregatesFilter<"CompanyInfo"> | string | null
    cost_center?: StringNullableWithAggregatesFilter<"CompanyInfo"> | string | null
    added_at?: DateTimeWithAggregatesFilter<"CompanyInfo"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"CompanyInfo"> | Date | string | null
  }

  export type EmployeeStatusHistoryCreateInput = {
    employee_number: number
    joined_year: number
    retired_year?: number | null
    data_updated_at: Date | string
    data_added_at: Date | string
    is_visible?: boolean
  }

  export type EmployeeStatusHistoryUncheckedCreateInput = {
    id?: number
    employee_number: number
    joined_year: number
    retired_year?: number | null
    data_updated_at: Date | string
    data_added_at: Date | string
    is_visible?: boolean
  }

  export type EmployeeStatusHistoryUpdateInput = {
    employee_number?: IntFieldUpdateOperationsInput | number
    joined_year?: IntFieldUpdateOperationsInput | number
    retired_year?: NullableIntFieldUpdateOperationsInput | number | null
    data_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    data_added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_visible?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EmployeeStatusHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: IntFieldUpdateOperationsInput | number
    joined_year?: IntFieldUpdateOperationsInput | number
    retired_year?: NullableIntFieldUpdateOperationsInput | number | null
    data_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    data_added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_visible?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EmployeeStatusHistoryCreateManyInput = {
    id?: number
    employee_number: number
    joined_year: number
    retired_year?: number | null
    data_updated_at: Date | string
    data_added_at: Date | string
    is_visible?: boolean
  }

  export type EmployeeStatusHistoryUpdateManyMutationInput = {
    employee_number?: IntFieldUpdateOperationsInput | number
    joined_year?: IntFieldUpdateOperationsInput | number
    retired_year?: NullableIntFieldUpdateOperationsInput | number | null
    data_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    data_added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_visible?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EmployeeStatusHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: IntFieldUpdateOperationsInput | number
    joined_year?: IntFieldUpdateOperationsInput | number
    retired_year?: NullableIntFieldUpdateOperationsInput | number | null
    data_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    data_added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_visible?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PositionHistoryCreateInput = {
    position: string
    added_at: Date | string
    add_reason?: string | null
    employee_info: EmployeeInfoCreateNestedOneWithoutPositionsInput
  }

  export type PositionHistoryUncheckedCreateInput = {
    id?: number
    employee_info_id: number
    position: string
    added_at: Date | string
    add_reason?: string | null
  }

  export type PositionHistoryUpdateInput = {
    position?: StringFieldUpdateOperationsInput | string
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    add_reason?: NullableStringFieldUpdateOperationsInput | string | null
    employee_info?: EmployeeInfoUpdateOneRequiredWithoutPositionsNestedInput
  }

  export type PositionHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    position?: StringFieldUpdateOperationsInput | string
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    add_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PositionHistoryCreateManyInput = {
    id?: number
    employee_info_id: number
    position: string
    added_at: Date | string
    add_reason?: string | null
  }

  export type PositionHistoryUpdateManyMutationInput = {
    position?: StringFieldUpdateOperationsInput | string
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    add_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PositionHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    position?: StringFieldUpdateOperationsInput | string
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    add_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EmployeeInfoCreateInput = {
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    positions?: PositionHistoryCreateNestedManyWithoutEmployee_infoInput
    personal_histories?: PersonalInfoHistoryCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryCreateNestedManyWithoutEmployee_infoInput
    company_info?: CompanyInfoCreateNestedOneWithoutEmployeesInput
  }

  export type EmployeeInfoUncheckedCreateInput = {
    id?: number
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    company_info_id?: number | null
    positions?: PositionHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
    personal_histories?: PersonalInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
  }

  export type EmployeeInfoUpdateInput = {
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUpdateManyWithoutEmployee_infoNestedInput
    personal_histories?: PersonalInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
    company_info?: CompanyInfoUpdateOneWithoutEmployeesNestedInput
  }

  export type EmployeeInfoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    company_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
    personal_histories?: PersonalInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
  }

  export type EmployeeInfoCreateManyInput = {
    id?: number
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    company_info_id?: number | null
  }

  export type EmployeeInfoUpdateManyMutationInput = {
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type EmployeeInfoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    company_info_id?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type DepartmentInfoHistoryCreateInput = {
    added_at: Date | string
    deleted_at?: Date | string | null
    employee_info: EmployeeInfoCreateNestedOneWithoutDepartment_historiesInput
    department?: DepartmentInfoCreateNestedOneWithoutDepartment_historiesInput
  }

  export type DepartmentInfoHistoryUncheckedCreateInput = {
    id?: number
    employee_info_id: number
    department_id?: number | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoHistoryUpdateInput = {
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    employee_info?: EmployeeInfoUpdateOneRequiredWithoutDepartment_historiesNestedInput
    department?: DepartmentInfoUpdateOneWithoutDepartment_historiesNestedInput
  }

  export type DepartmentInfoHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoHistoryCreateManyInput = {
    id?: number
    employee_info_id: number
    department_id?: number | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoHistoryUpdateManyMutationInput = {
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoCreateInput = {
    parent_id?: number | null
    name: string
    full_name?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
    department_histories?: DepartmentInfoHistoryCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentInfoUncheckedCreateInput = {
    id?: number
    parent_id?: number | null
    name: string
    full_name?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
    department_histories?: DepartmentInfoHistoryUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentInfoUpdateInput = {
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department_histories?: DepartmentInfoHistoryUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentInfoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department_histories?: DepartmentInfoHistoryUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentInfoCreateManyInput = {
    id?: number
    parent_id?: number | null
    name: string
    full_name?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoUpdateManyMutationInput = {
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersonalInfoHistoryCreateInput = {
    last_name: string
    first_name: string
    address?: string | null
    phone_number?: string | null
    emergency_contact?: string | null
    birthplace?: string | null
    allergy?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
    employee_info: EmployeeInfoCreateNestedOneWithoutPersonal_historiesInput
  }

  export type PersonalInfoHistoryUncheckedCreateInput = {
    id?: number
    employee_info_id: number
    last_name: string
    first_name: string
    address?: string | null
    phone_number?: string | null
    emergency_contact?: string | null
    birthplace?: string | null
    allergy?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type PersonalInfoHistoryUpdateInput = {
    last_name?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    emergency_contact?: NullableStringFieldUpdateOperationsInput | string | null
    birthplace?: NullableStringFieldUpdateOperationsInput | string | null
    allergy?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    employee_info?: EmployeeInfoUpdateOneRequiredWithoutPersonal_historiesNestedInput
  }

  export type PersonalInfoHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    last_name?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    emergency_contact?: NullableStringFieldUpdateOperationsInput | string | null
    birthplace?: NullableStringFieldUpdateOperationsInput | string | null
    allergy?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersonalInfoHistoryCreateManyInput = {
    id?: number
    employee_info_id: number
    last_name: string
    first_name: string
    address?: string | null
    phone_number?: string | null
    emergency_contact?: string | null
    birthplace?: string | null
    allergy?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type PersonalInfoHistoryUpdateManyMutationInput = {
    last_name?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    emergency_contact?: NullableStringFieldUpdateOperationsInput | string | null
    birthplace?: NullableStringFieldUpdateOperationsInput | string | null
    allergy?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersonalInfoHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    last_name?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    emergency_contact?: NullableStringFieldUpdateOperationsInput | string | null
    birthplace?: NullableStringFieldUpdateOperationsInput | string | null
    allergy?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CompanyInfoCreateInput = {
    employee_code?: string | null
    email?: string | null
    phone_ext?: string | null
    office_location?: string | null
    cost_center?: string | null
    added_at?: Date | string
    deleted_at?: Date | string | null
    employees?: EmployeeInfoCreateNestedManyWithoutCompany_infoInput
  }

  export type CompanyInfoUncheckedCreateInput = {
    id?: number
    employee_code?: string | null
    email?: string | null
    phone_ext?: string | null
    office_location?: string | null
    cost_center?: string | null
    added_at?: Date | string
    deleted_at?: Date | string | null
    employees?: EmployeeInfoUncheckedCreateNestedManyWithoutCompany_infoInput
  }

  export type CompanyInfoUpdateInput = {
    employee_code?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone_ext?: NullableStringFieldUpdateOperationsInput | string | null
    office_location?: NullableStringFieldUpdateOperationsInput | string | null
    cost_center?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    employees?: EmployeeInfoUpdateManyWithoutCompany_infoNestedInput
  }

  export type CompanyInfoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_code?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone_ext?: NullableStringFieldUpdateOperationsInput | string | null
    office_location?: NullableStringFieldUpdateOperationsInput | string | null
    cost_center?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    employees?: EmployeeInfoUncheckedUpdateManyWithoutCompany_infoNestedInput
  }

  export type CompanyInfoCreateManyInput = {
    id?: number
    employee_code?: string | null
    email?: string | null
    phone_ext?: string | null
    office_location?: string | null
    cost_center?: string | null
    added_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type CompanyInfoUpdateManyMutationInput = {
    employee_code?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone_ext?: NullableStringFieldUpdateOperationsInput | string | null
    office_location?: NullableStringFieldUpdateOperationsInput | string | null
    cost_center?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CompanyInfoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_code?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone_ext?: NullableStringFieldUpdateOperationsInput | string | null
    office_location?: NullableStringFieldUpdateOperationsInput | string | null
    cost_center?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EmployeeStatusHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    joined_year?: SortOrder
    retired_year?: SortOrder
    data_updated_at?: SortOrder
    data_added_at?: SortOrder
    is_visible?: SortOrder
  }

  export type EmployeeStatusHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    joined_year?: SortOrder
    retired_year?: SortOrder
  }

  export type EmployeeStatusHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    joined_year?: SortOrder
    retired_year?: SortOrder
    data_updated_at?: SortOrder
    data_added_at?: SortOrder
    is_visible?: SortOrder
  }

  export type EmployeeStatusHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    joined_year?: SortOrder
    retired_year?: SortOrder
    data_updated_at?: SortOrder
    data_added_at?: SortOrder
    is_visible?: SortOrder
  }

  export type EmployeeStatusHistorySumOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    joined_year?: SortOrder
    retired_year?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EmployeeInfoScalarRelationFilter = {
    is?: EmployeeInfoWhereInput
    isNot?: EmployeeInfoWhereInput
  }

  export type PositionHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    position?: SortOrder
    added_at?: SortOrder
    add_reason?: SortOrder
  }

  export type PositionHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
  }

  export type PositionHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    position?: SortOrder
    added_at?: SortOrder
    add_reason?: SortOrder
  }

  export type PositionHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    position?: SortOrder
    added_at?: SortOrder
    add_reason?: SortOrder
  }

  export type PositionHistorySumOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type PositionHistoryListRelationFilter = {
    every?: PositionHistoryWhereInput
    some?: PositionHistoryWhereInput
    none?: PositionHistoryWhereInput
  }

  export type PersonalInfoHistoryListRelationFilter = {
    every?: PersonalInfoHistoryWhereInput
    some?: PersonalInfoHistoryWhereInput
    none?: PersonalInfoHistoryWhereInput
  }

  export type DepartmentInfoHistoryListRelationFilter = {
    every?: DepartmentInfoHistoryWhereInput
    some?: DepartmentInfoHistoryWhereInput
    none?: DepartmentInfoHistoryWhereInput
  }

  export type CompanyInfoNullableScalarRelationFilter = {
    is?: CompanyInfoWhereInput | null
    isNot?: CompanyInfoWhereInput | null
  }

  export type PositionHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PersonalInfoHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentInfoHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmployeeInfoCountOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    department_id?: SortOrder
    personal_info_id?: SortOrder
    company_info_id?: SortOrder
  }

  export type EmployeeInfoAvgOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    department_id?: SortOrder
    personal_info_id?: SortOrder
    company_info_id?: SortOrder
  }

  export type EmployeeInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    department_id?: SortOrder
    personal_info_id?: SortOrder
    company_info_id?: SortOrder
  }

  export type EmployeeInfoMinOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    department_id?: SortOrder
    personal_info_id?: SortOrder
    company_info_id?: SortOrder
  }

  export type EmployeeInfoSumOrderByAggregateInput = {
    id?: SortOrder
    employee_number?: SortOrder
    department_id?: SortOrder
    personal_info_id?: SortOrder
    company_info_id?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DepartmentInfoNullableScalarRelationFilter = {
    is?: DepartmentInfoWhereInput | null
    isNot?: DepartmentInfoWhereInput | null
  }

  export type DepartmentInfoHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    department_id?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DepartmentInfoHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    department_id?: SortOrder
  }

  export type DepartmentInfoHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    department_id?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DepartmentInfoHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    department_id?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DepartmentInfoHistorySumOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    department_id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DepartmentInfoCountOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    name?: SortOrder
    full_name?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DepartmentInfoAvgOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
  }

  export type DepartmentInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    name?: SortOrder
    full_name?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DepartmentInfoMinOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    name?: SortOrder
    full_name?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DepartmentInfoSumOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
  }

  export type PersonalInfoHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    last_name?: SortOrder
    first_name?: SortOrder
    address?: SortOrder
    phone_number?: SortOrder
    emergency_contact?: SortOrder
    birthplace?: SortOrder
    allergy?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type PersonalInfoHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
  }

  export type PersonalInfoHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    last_name?: SortOrder
    first_name?: SortOrder
    address?: SortOrder
    phone_number?: SortOrder
    emergency_contact?: SortOrder
    birthplace?: SortOrder
    allergy?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type PersonalInfoHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
    last_name?: SortOrder
    first_name?: SortOrder
    address?: SortOrder
    phone_number?: SortOrder
    emergency_contact?: SortOrder
    birthplace?: SortOrder
    allergy?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type PersonalInfoHistorySumOrderByAggregateInput = {
    id?: SortOrder
    employee_info_id?: SortOrder
  }

  export type EmployeeInfoListRelationFilter = {
    every?: EmployeeInfoWhereInput
    some?: EmployeeInfoWhereInput
    none?: EmployeeInfoWhereInput
  }

  export type EmployeeInfoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyInfoCountOrderByAggregateInput = {
    id?: SortOrder
    employee_code?: SortOrder
    email?: SortOrder
    phone_ext?: SortOrder
    office_location?: SortOrder
    cost_center?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type CompanyInfoAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CompanyInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    employee_code?: SortOrder
    email?: SortOrder
    phone_ext?: SortOrder
    office_location?: SortOrder
    cost_center?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type CompanyInfoMinOrderByAggregateInput = {
    id?: SortOrder
    employee_code?: SortOrder
    email?: SortOrder
    phone_ext?: SortOrder
    office_location?: SortOrder
    cost_center?: SortOrder
    added_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type CompanyInfoSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EmployeeInfoCreateNestedOneWithoutPositionsInput = {
    create?: XOR<EmployeeInfoCreateWithoutPositionsInput, EmployeeInfoUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutPositionsInput
    connect?: EmployeeInfoWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EmployeeInfoUpdateOneRequiredWithoutPositionsNestedInput = {
    create?: XOR<EmployeeInfoCreateWithoutPositionsInput, EmployeeInfoUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutPositionsInput
    upsert?: EmployeeInfoUpsertWithoutPositionsInput
    connect?: EmployeeInfoWhereUniqueInput
    update?: XOR<XOR<EmployeeInfoUpdateToOneWithWhereWithoutPositionsInput, EmployeeInfoUpdateWithoutPositionsInput>, EmployeeInfoUncheckedUpdateWithoutPositionsInput>
  }

  export type PositionHistoryCreateNestedManyWithoutEmployee_infoInput = {
    create?: XOR<PositionHistoryCreateWithoutEmployee_infoInput, PositionHistoryUncheckedCreateWithoutEmployee_infoInput> | PositionHistoryCreateWithoutEmployee_infoInput[] | PositionHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PositionHistoryCreateOrConnectWithoutEmployee_infoInput | PositionHistoryCreateOrConnectWithoutEmployee_infoInput[]
    createMany?: PositionHistoryCreateManyEmployee_infoInputEnvelope
    connect?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
  }

  export type PersonalInfoHistoryCreateNestedManyWithoutEmployee_infoInput = {
    create?: XOR<PersonalInfoHistoryCreateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | PersonalInfoHistoryCreateWithoutEmployee_infoInput[] | PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput | PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    createMany?: PersonalInfoHistoryCreateManyEmployee_infoInputEnvelope
    connect?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
  }

  export type DepartmentInfoHistoryCreateNestedManyWithoutEmployee_infoInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | DepartmentInfoHistoryCreateWithoutEmployee_infoInput[] | DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput | DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    createMany?: DepartmentInfoHistoryCreateManyEmployee_infoInputEnvelope
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
  }

  export type CompanyInfoCreateNestedOneWithoutEmployeesInput = {
    create?: XOR<CompanyInfoCreateWithoutEmployeesInput, CompanyInfoUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: CompanyInfoCreateOrConnectWithoutEmployeesInput
    connect?: CompanyInfoWhereUniqueInput
  }

  export type PositionHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput = {
    create?: XOR<PositionHistoryCreateWithoutEmployee_infoInput, PositionHistoryUncheckedCreateWithoutEmployee_infoInput> | PositionHistoryCreateWithoutEmployee_infoInput[] | PositionHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PositionHistoryCreateOrConnectWithoutEmployee_infoInput | PositionHistoryCreateOrConnectWithoutEmployee_infoInput[]
    createMany?: PositionHistoryCreateManyEmployee_infoInputEnvelope
    connect?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
  }

  export type PersonalInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput = {
    create?: XOR<PersonalInfoHistoryCreateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | PersonalInfoHistoryCreateWithoutEmployee_infoInput[] | PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput | PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    createMany?: PersonalInfoHistoryCreateManyEmployee_infoInputEnvelope
    connect?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
  }

  export type DepartmentInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | DepartmentInfoHistoryCreateWithoutEmployee_infoInput[] | DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput | DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    createMany?: DepartmentInfoHistoryCreateManyEmployee_infoInputEnvelope
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
  }

  export type PositionHistoryUpdateManyWithoutEmployee_infoNestedInput = {
    create?: XOR<PositionHistoryCreateWithoutEmployee_infoInput, PositionHistoryUncheckedCreateWithoutEmployee_infoInput> | PositionHistoryCreateWithoutEmployee_infoInput[] | PositionHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PositionHistoryCreateOrConnectWithoutEmployee_infoInput | PositionHistoryCreateOrConnectWithoutEmployee_infoInput[]
    upsert?: PositionHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput | PositionHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput[]
    createMany?: PositionHistoryCreateManyEmployee_infoInputEnvelope
    set?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    disconnect?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    delete?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    connect?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    update?: PositionHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput | PositionHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput[]
    updateMany?: PositionHistoryUpdateManyWithWhereWithoutEmployee_infoInput | PositionHistoryUpdateManyWithWhereWithoutEmployee_infoInput[]
    deleteMany?: PositionHistoryScalarWhereInput | PositionHistoryScalarWhereInput[]
  }

  export type PersonalInfoHistoryUpdateManyWithoutEmployee_infoNestedInput = {
    create?: XOR<PersonalInfoHistoryCreateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | PersonalInfoHistoryCreateWithoutEmployee_infoInput[] | PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput | PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    upsert?: PersonalInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput | PersonalInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput[]
    createMany?: PersonalInfoHistoryCreateManyEmployee_infoInputEnvelope
    set?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    disconnect?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    delete?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    connect?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    update?: PersonalInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput | PersonalInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput[]
    updateMany?: PersonalInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput | PersonalInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput[]
    deleteMany?: PersonalInfoHistoryScalarWhereInput | PersonalInfoHistoryScalarWhereInput[]
  }

  export type DepartmentInfoHistoryUpdateManyWithoutEmployee_infoNestedInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | DepartmentInfoHistoryCreateWithoutEmployee_infoInput[] | DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput | DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    upsert?: DepartmentInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput | DepartmentInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput[]
    createMany?: DepartmentInfoHistoryCreateManyEmployee_infoInputEnvelope
    set?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    disconnect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    delete?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    update?: DepartmentInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput | DepartmentInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput[]
    updateMany?: DepartmentInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput | DepartmentInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput[]
    deleteMany?: DepartmentInfoHistoryScalarWhereInput | DepartmentInfoHistoryScalarWhereInput[]
  }

  export type CompanyInfoUpdateOneWithoutEmployeesNestedInput = {
    create?: XOR<CompanyInfoCreateWithoutEmployeesInput, CompanyInfoUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: CompanyInfoCreateOrConnectWithoutEmployeesInput
    upsert?: CompanyInfoUpsertWithoutEmployeesInput
    disconnect?: CompanyInfoWhereInput | boolean
    delete?: CompanyInfoWhereInput | boolean
    connect?: CompanyInfoWhereUniqueInput
    update?: XOR<XOR<CompanyInfoUpdateToOneWithWhereWithoutEmployeesInput, CompanyInfoUpdateWithoutEmployeesInput>, CompanyInfoUncheckedUpdateWithoutEmployeesInput>
  }

  export type PositionHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput = {
    create?: XOR<PositionHistoryCreateWithoutEmployee_infoInput, PositionHistoryUncheckedCreateWithoutEmployee_infoInput> | PositionHistoryCreateWithoutEmployee_infoInput[] | PositionHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PositionHistoryCreateOrConnectWithoutEmployee_infoInput | PositionHistoryCreateOrConnectWithoutEmployee_infoInput[]
    upsert?: PositionHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput | PositionHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput[]
    createMany?: PositionHistoryCreateManyEmployee_infoInputEnvelope
    set?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    disconnect?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    delete?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    connect?: PositionHistoryWhereUniqueInput | PositionHistoryWhereUniqueInput[]
    update?: PositionHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput | PositionHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput[]
    updateMany?: PositionHistoryUpdateManyWithWhereWithoutEmployee_infoInput | PositionHistoryUpdateManyWithWhereWithoutEmployee_infoInput[]
    deleteMany?: PositionHistoryScalarWhereInput | PositionHistoryScalarWhereInput[]
  }

  export type PersonalInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput = {
    create?: XOR<PersonalInfoHistoryCreateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | PersonalInfoHistoryCreateWithoutEmployee_infoInput[] | PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput | PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    upsert?: PersonalInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput | PersonalInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput[]
    createMany?: PersonalInfoHistoryCreateManyEmployee_infoInputEnvelope
    set?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    disconnect?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    delete?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    connect?: PersonalInfoHistoryWhereUniqueInput | PersonalInfoHistoryWhereUniqueInput[]
    update?: PersonalInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput | PersonalInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput[]
    updateMany?: PersonalInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput | PersonalInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput[]
    deleteMany?: PersonalInfoHistoryScalarWhereInput | PersonalInfoHistoryScalarWhereInput[]
  }

  export type DepartmentInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput> | DepartmentInfoHistoryCreateWithoutEmployee_infoInput[] | DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput | DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput[]
    upsert?: DepartmentInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput | DepartmentInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput[]
    createMany?: DepartmentInfoHistoryCreateManyEmployee_infoInputEnvelope
    set?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    disconnect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    delete?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    update?: DepartmentInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput | DepartmentInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput[]
    updateMany?: DepartmentInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput | DepartmentInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput[]
    deleteMany?: DepartmentInfoHistoryScalarWhereInput | DepartmentInfoHistoryScalarWhereInput[]
  }

  export type EmployeeInfoCreateNestedOneWithoutDepartment_historiesInput = {
    create?: XOR<EmployeeInfoCreateWithoutDepartment_historiesInput, EmployeeInfoUncheckedCreateWithoutDepartment_historiesInput>
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutDepartment_historiesInput
    connect?: EmployeeInfoWhereUniqueInput
  }

  export type DepartmentInfoCreateNestedOneWithoutDepartment_historiesInput = {
    create?: XOR<DepartmentInfoCreateWithoutDepartment_historiesInput, DepartmentInfoUncheckedCreateWithoutDepartment_historiesInput>
    connectOrCreate?: DepartmentInfoCreateOrConnectWithoutDepartment_historiesInput
    connect?: DepartmentInfoWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EmployeeInfoUpdateOneRequiredWithoutDepartment_historiesNestedInput = {
    create?: XOR<EmployeeInfoCreateWithoutDepartment_historiesInput, EmployeeInfoUncheckedCreateWithoutDepartment_historiesInput>
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutDepartment_historiesInput
    upsert?: EmployeeInfoUpsertWithoutDepartment_historiesInput
    connect?: EmployeeInfoWhereUniqueInput
    update?: XOR<XOR<EmployeeInfoUpdateToOneWithWhereWithoutDepartment_historiesInput, EmployeeInfoUpdateWithoutDepartment_historiesInput>, EmployeeInfoUncheckedUpdateWithoutDepartment_historiesInput>
  }

  export type DepartmentInfoUpdateOneWithoutDepartment_historiesNestedInput = {
    create?: XOR<DepartmentInfoCreateWithoutDepartment_historiesInput, DepartmentInfoUncheckedCreateWithoutDepartment_historiesInput>
    connectOrCreate?: DepartmentInfoCreateOrConnectWithoutDepartment_historiesInput
    upsert?: DepartmentInfoUpsertWithoutDepartment_historiesInput
    disconnect?: DepartmentInfoWhereInput | boolean
    delete?: DepartmentInfoWhereInput | boolean
    connect?: DepartmentInfoWhereUniqueInput
    update?: XOR<XOR<DepartmentInfoUpdateToOneWithWhereWithoutDepartment_historiesInput, DepartmentInfoUpdateWithoutDepartment_historiesInput>, DepartmentInfoUncheckedUpdateWithoutDepartment_historiesInput>
  }

  export type DepartmentInfoHistoryCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput> | DepartmentInfoHistoryCreateWithoutDepartmentInput[] | DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput | DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput[]
    createMany?: DepartmentInfoHistoryCreateManyDepartmentInputEnvelope
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
  }

  export type DepartmentInfoHistoryUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput> | DepartmentInfoHistoryCreateWithoutDepartmentInput[] | DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput | DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput[]
    createMany?: DepartmentInfoHistoryCreateManyDepartmentInputEnvelope
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
  }

  export type DepartmentInfoHistoryUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput> | DepartmentInfoHistoryCreateWithoutDepartmentInput[] | DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput | DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput[]
    upsert?: DepartmentInfoHistoryUpsertWithWhereUniqueWithoutDepartmentInput | DepartmentInfoHistoryUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: DepartmentInfoHistoryCreateManyDepartmentInputEnvelope
    set?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    disconnect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    delete?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    update?: DepartmentInfoHistoryUpdateWithWhereUniqueWithoutDepartmentInput | DepartmentInfoHistoryUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: DepartmentInfoHistoryUpdateManyWithWhereWithoutDepartmentInput | DepartmentInfoHistoryUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: DepartmentInfoHistoryScalarWhereInput | DepartmentInfoHistoryScalarWhereInput[]
  }

  export type DepartmentInfoHistoryUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<DepartmentInfoHistoryCreateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput> | DepartmentInfoHistoryCreateWithoutDepartmentInput[] | DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput | DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput[]
    upsert?: DepartmentInfoHistoryUpsertWithWhereUniqueWithoutDepartmentInput | DepartmentInfoHistoryUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: DepartmentInfoHistoryCreateManyDepartmentInputEnvelope
    set?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    disconnect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    delete?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    connect?: DepartmentInfoHistoryWhereUniqueInput | DepartmentInfoHistoryWhereUniqueInput[]
    update?: DepartmentInfoHistoryUpdateWithWhereUniqueWithoutDepartmentInput | DepartmentInfoHistoryUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: DepartmentInfoHistoryUpdateManyWithWhereWithoutDepartmentInput | DepartmentInfoHistoryUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: DepartmentInfoHistoryScalarWhereInput | DepartmentInfoHistoryScalarWhereInput[]
  }

  export type EmployeeInfoCreateNestedOneWithoutPersonal_historiesInput = {
    create?: XOR<EmployeeInfoCreateWithoutPersonal_historiesInput, EmployeeInfoUncheckedCreateWithoutPersonal_historiesInput>
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutPersonal_historiesInput
    connect?: EmployeeInfoWhereUniqueInput
  }

  export type EmployeeInfoUpdateOneRequiredWithoutPersonal_historiesNestedInput = {
    create?: XOR<EmployeeInfoCreateWithoutPersonal_historiesInput, EmployeeInfoUncheckedCreateWithoutPersonal_historiesInput>
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutPersonal_historiesInput
    upsert?: EmployeeInfoUpsertWithoutPersonal_historiesInput
    connect?: EmployeeInfoWhereUniqueInput
    update?: XOR<XOR<EmployeeInfoUpdateToOneWithWhereWithoutPersonal_historiesInput, EmployeeInfoUpdateWithoutPersonal_historiesInput>, EmployeeInfoUncheckedUpdateWithoutPersonal_historiesInput>
  }

  export type EmployeeInfoCreateNestedManyWithoutCompany_infoInput = {
    create?: XOR<EmployeeInfoCreateWithoutCompany_infoInput, EmployeeInfoUncheckedCreateWithoutCompany_infoInput> | EmployeeInfoCreateWithoutCompany_infoInput[] | EmployeeInfoUncheckedCreateWithoutCompany_infoInput[]
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutCompany_infoInput | EmployeeInfoCreateOrConnectWithoutCompany_infoInput[]
    createMany?: EmployeeInfoCreateManyCompany_infoInputEnvelope
    connect?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
  }

  export type EmployeeInfoUncheckedCreateNestedManyWithoutCompany_infoInput = {
    create?: XOR<EmployeeInfoCreateWithoutCompany_infoInput, EmployeeInfoUncheckedCreateWithoutCompany_infoInput> | EmployeeInfoCreateWithoutCompany_infoInput[] | EmployeeInfoUncheckedCreateWithoutCompany_infoInput[]
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutCompany_infoInput | EmployeeInfoCreateOrConnectWithoutCompany_infoInput[]
    createMany?: EmployeeInfoCreateManyCompany_infoInputEnvelope
    connect?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
  }

  export type EmployeeInfoUpdateManyWithoutCompany_infoNestedInput = {
    create?: XOR<EmployeeInfoCreateWithoutCompany_infoInput, EmployeeInfoUncheckedCreateWithoutCompany_infoInput> | EmployeeInfoCreateWithoutCompany_infoInput[] | EmployeeInfoUncheckedCreateWithoutCompany_infoInput[]
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutCompany_infoInput | EmployeeInfoCreateOrConnectWithoutCompany_infoInput[]
    upsert?: EmployeeInfoUpsertWithWhereUniqueWithoutCompany_infoInput | EmployeeInfoUpsertWithWhereUniqueWithoutCompany_infoInput[]
    createMany?: EmployeeInfoCreateManyCompany_infoInputEnvelope
    set?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    disconnect?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    delete?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    connect?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    update?: EmployeeInfoUpdateWithWhereUniqueWithoutCompany_infoInput | EmployeeInfoUpdateWithWhereUniqueWithoutCompany_infoInput[]
    updateMany?: EmployeeInfoUpdateManyWithWhereWithoutCompany_infoInput | EmployeeInfoUpdateManyWithWhereWithoutCompany_infoInput[]
    deleteMany?: EmployeeInfoScalarWhereInput | EmployeeInfoScalarWhereInput[]
  }

  export type EmployeeInfoUncheckedUpdateManyWithoutCompany_infoNestedInput = {
    create?: XOR<EmployeeInfoCreateWithoutCompany_infoInput, EmployeeInfoUncheckedCreateWithoutCompany_infoInput> | EmployeeInfoCreateWithoutCompany_infoInput[] | EmployeeInfoUncheckedCreateWithoutCompany_infoInput[]
    connectOrCreate?: EmployeeInfoCreateOrConnectWithoutCompany_infoInput | EmployeeInfoCreateOrConnectWithoutCompany_infoInput[]
    upsert?: EmployeeInfoUpsertWithWhereUniqueWithoutCompany_infoInput | EmployeeInfoUpsertWithWhereUniqueWithoutCompany_infoInput[]
    createMany?: EmployeeInfoCreateManyCompany_infoInputEnvelope
    set?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    disconnect?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    delete?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    connect?: EmployeeInfoWhereUniqueInput | EmployeeInfoWhereUniqueInput[]
    update?: EmployeeInfoUpdateWithWhereUniqueWithoutCompany_infoInput | EmployeeInfoUpdateWithWhereUniqueWithoutCompany_infoInput[]
    updateMany?: EmployeeInfoUpdateManyWithWhereWithoutCompany_infoInput | EmployeeInfoUpdateManyWithWhereWithoutCompany_infoInput[]
    deleteMany?: EmployeeInfoScalarWhereInput | EmployeeInfoScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EmployeeInfoCreateWithoutPositionsInput = {
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    personal_histories?: PersonalInfoHistoryCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryCreateNestedManyWithoutEmployee_infoInput
    company_info?: CompanyInfoCreateNestedOneWithoutEmployeesInput
  }

  export type EmployeeInfoUncheckedCreateWithoutPositionsInput = {
    id?: number
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    company_info_id?: number | null
    personal_histories?: PersonalInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
  }

  export type EmployeeInfoCreateOrConnectWithoutPositionsInput = {
    where: EmployeeInfoWhereUniqueInput
    create: XOR<EmployeeInfoCreateWithoutPositionsInput, EmployeeInfoUncheckedCreateWithoutPositionsInput>
  }

  export type EmployeeInfoUpsertWithoutPositionsInput = {
    update: XOR<EmployeeInfoUpdateWithoutPositionsInput, EmployeeInfoUncheckedUpdateWithoutPositionsInput>
    create: XOR<EmployeeInfoCreateWithoutPositionsInput, EmployeeInfoUncheckedCreateWithoutPositionsInput>
    where?: EmployeeInfoWhereInput
  }

  export type EmployeeInfoUpdateToOneWithWhereWithoutPositionsInput = {
    where?: EmployeeInfoWhereInput
    data: XOR<EmployeeInfoUpdateWithoutPositionsInput, EmployeeInfoUncheckedUpdateWithoutPositionsInput>
  }

  export type EmployeeInfoUpdateWithoutPositionsInput = {
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_histories?: PersonalInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
    company_info?: CompanyInfoUpdateOneWithoutEmployeesNestedInput
  }

  export type EmployeeInfoUncheckedUpdateWithoutPositionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    company_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_histories?: PersonalInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
  }

  export type PositionHistoryCreateWithoutEmployee_infoInput = {
    position: string
    added_at: Date | string
    add_reason?: string | null
  }

  export type PositionHistoryUncheckedCreateWithoutEmployee_infoInput = {
    id?: number
    position: string
    added_at: Date | string
    add_reason?: string | null
  }

  export type PositionHistoryCreateOrConnectWithoutEmployee_infoInput = {
    where: PositionHistoryWhereUniqueInput
    create: XOR<PositionHistoryCreateWithoutEmployee_infoInput, PositionHistoryUncheckedCreateWithoutEmployee_infoInput>
  }

  export type PositionHistoryCreateManyEmployee_infoInputEnvelope = {
    data: PositionHistoryCreateManyEmployee_infoInput | PositionHistoryCreateManyEmployee_infoInput[]
  }

  export type PersonalInfoHistoryCreateWithoutEmployee_infoInput = {
    last_name: string
    first_name: string
    address?: string | null
    phone_number?: string | null
    emergency_contact?: string | null
    birthplace?: string | null
    allergy?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput = {
    id?: number
    last_name: string
    first_name: string
    address?: string | null
    phone_number?: string | null
    emergency_contact?: string | null
    birthplace?: string | null
    allergy?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type PersonalInfoHistoryCreateOrConnectWithoutEmployee_infoInput = {
    where: PersonalInfoHistoryWhereUniqueInput
    create: XOR<PersonalInfoHistoryCreateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput>
  }

  export type PersonalInfoHistoryCreateManyEmployee_infoInputEnvelope = {
    data: PersonalInfoHistoryCreateManyEmployee_infoInput | PersonalInfoHistoryCreateManyEmployee_infoInput[]
  }

  export type DepartmentInfoHistoryCreateWithoutEmployee_infoInput = {
    added_at: Date | string
    deleted_at?: Date | string | null
    department?: DepartmentInfoCreateNestedOneWithoutDepartment_historiesInput
  }

  export type DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput = {
    id?: number
    department_id?: number | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoHistoryCreateOrConnectWithoutEmployee_infoInput = {
    where: DepartmentInfoHistoryWhereUniqueInput
    create: XOR<DepartmentInfoHistoryCreateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput>
  }

  export type DepartmentInfoHistoryCreateManyEmployee_infoInputEnvelope = {
    data: DepartmentInfoHistoryCreateManyEmployee_infoInput | DepartmentInfoHistoryCreateManyEmployee_infoInput[]
  }

  export type CompanyInfoCreateWithoutEmployeesInput = {
    employee_code?: string | null
    email?: string | null
    phone_ext?: string | null
    office_location?: string | null
    cost_center?: string | null
    added_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type CompanyInfoUncheckedCreateWithoutEmployeesInput = {
    id?: number
    employee_code?: string | null
    email?: string | null
    phone_ext?: string | null
    office_location?: string | null
    cost_center?: string | null
    added_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type CompanyInfoCreateOrConnectWithoutEmployeesInput = {
    where: CompanyInfoWhereUniqueInput
    create: XOR<CompanyInfoCreateWithoutEmployeesInput, CompanyInfoUncheckedCreateWithoutEmployeesInput>
  }

  export type PositionHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput = {
    where: PositionHistoryWhereUniqueInput
    update: XOR<PositionHistoryUpdateWithoutEmployee_infoInput, PositionHistoryUncheckedUpdateWithoutEmployee_infoInput>
    create: XOR<PositionHistoryCreateWithoutEmployee_infoInput, PositionHistoryUncheckedCreateWithoutEmployee_infoInput>
  }

  export type PositionHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput = {
    where: PositionHistoryWhereUniqueInput
    data: XOR<PositionHistoryUpdateWithoutEmployee_infoInput, PositionHistoryUncheckedUpdateWithoutEmployee_infoInput>
  }

  export type PositionHistoryUpdateManyWithWhereWithoutEmployee_infoInput = {
    where: PositionHistoryScalarWhereInput
    data: XOR<PositionHistoryUpdateManyMutationInput, PositionHistoryUncheckedUpdateManyWithoutEmployee_infoInput>
  }

  export type PositionHistoryScalarWhereInput = {
    AND?: PositionHistoryScalarWhereInput | PositionHistoryScalarWhereInput[]
    OR?: PositionHistoryScalarWhereInput[]
    NOT?: PositionHistoryScalarWhereInput | PositionHistoryScalarWhereInput[]
    id?: IntFilter<"PositionHistory"> | number
    employee_info_id?: IntFilter<"PositionHistory"> | number
    position?: StringFilter<"PositionHistory"> | string
    added_at?: DateTimeFilter<"PositionHistory"> | Date | string
    add_reason?: StringNullableFilter<"PositionHistory"> | string | null
  }

  export type PersonalInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput = {
    where: PersonalInfoHistoryWhereUniqueInput
    update: XOR<PersonalInfoHistoryUpdateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedUpdateWithoutEmployee_infoInput>
    create: XOR<PersonalInfoHistoryCreateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedCreateWithoutEmployee_infoInput>
  }

  export type PersonalInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput = {
    where: PersonalInfoHistoryWhereUniqueInput
    data: XOR<PersonalInfoHistoryUpdateWithoutEmployee_infoInput, PersonalInfoHistoryUncheckedUpdateWithoutEmployee_infoInput>
  }

  export type PersonalInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput = {
    where: PersonalInfoHistoryScalarWhereInput
    data: XOR<PersonalInfoHistoryUpdateManyMutationInput, PersonalInfoHistoryUncheckedUpdateManyWithoutEmployee_infoInput>
  }

  export type PersonalInfoHistoryScalarWhereInput = {
    AND?: PersonalInfoHistoryScalarWhereInput | PersonalInfoHistoryScalarWhereInput[]
    OR?: PersonalInfoHistoryScalarWhereInput[]
    NOT?: PersonalInfoHistoryScalarWhereInput | PersonalInfoHistoryScalarWhereInput[]
    id?: IntFilter<"PersonalInfoHistory"> | number
    employee_info_id?: IntFilter<"PersonalInfoHistory"> | number
    last_name?: StringFilter<"PersonalInfoHistory"> | string
    first_name?: StringFilter<"PersonalInfoHistory"> | string
    address?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    phone_number?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    emergency_contact?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    birthplace?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    allergy?: StringNullableFilter<"PersonalInfoHistory"> | string | null
    added_at?: DateTimeFilter<"PersonalInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableFilter<"PersonalInfoHistory"> | Date | string | null
  }

  export type DepartmentInfoHistoryUpsertWithWhereUniqueWithoutEmployee_infoInput = {
    where: DepartmentInfoHistoryWhereUniqueInput
    update: XOR<DepartmentInfoHistoryUpdateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedUpdateWithoutEmployee_infoInput>
    create: XOR<DepartmentInfoHistoryCreateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedCreateWithoutEmployee_infoInput>
  }

  export type DepartmentInfoHistoryUpdateWithWhereUniqueWithoutEmployee_infoInput = {
    where: DepartmentInfoHistoryWhereUniqueInput
    data: XOR<DepartmentInfoHistoryUpdateWithoutEmployee_infoInput, DepartmentInfoHistoryUncheckedUpdateWithoutEmployee_infoInput>
  }

  export type DepartmentInfoHistoryUpdateManyWithWhereWithoutEmployee_infoInput = {
    where: DepartmentInfoHistoryScalarWhereInput
    data: XOR<DepartmentInfoHistoryUpdateManyMutationInput, DepartmentInfoHistoryUncheckedUpdateManyWithoutEmployee_infoInput>
  }

  export type DepartmentInfoHistoryScalarWhereInput = {
    AND?: DepartmentInfoHistoryScalarWhereInput | DepartmentInfoHistoryScalarWhereInput[]
    OR?: DepartmentInfoHistoryScalarWhereInput[]
    NOT?: DepartmentInfoHistoryScalarWhereInput | DepartmentInfoHistoryScalarWhereInput[]
    id?: IntFilter<"DepartmentInfoHistory"> | number
    employee_info_id?: IntFilter<"DepartmentInfoHistory"> | number
    department_id?: IntNullableFilter<"DepartmentInfoHistory"> | number | null
    added_at?: DateTimeFilter<"DepartmentInfoHistory"> | Date | string
    deleted_at?: DateTimeNullableFilter<"DepartmentInfoHistory"> | Date | string | null
  }

  export type CompanyInfoUpsertWithoutEmployeesInput = {
    update: XOR<CompanyInfoUpdateWithoutEmployeesInput, CompanyInfoUncheckedUpdateWithoutEmployeesInput>
    create: XOR<CompanyInfoCreateWithoutEmployeesInput, CompanyInfoUncheckedCreateWithoutEmployeesInput>
    where?: CompanyInfoWhereInput
  }

  export type CompanyInfoUpdateToOneWithWhereWithoutEmployeesInput = {
    where?: CompanyInfoWhereInput
    data: XOR<CompanyInfoUpdateWithoutEmployeesInput, CompanyInfoUncheckedUpdateWithoutEmployeesInput>
  }

  export type CompanyInfoUpdateWithoutEmployeesInput = {
    employee_code?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone_ext?: NullableStringFieldUpdateOperationsInput | string | null
    office_location?: NullableStringFieldUpdateOperationsInput | string | null
    cost_center?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CompanyInfoUncheckedUpdateWithoutEmployeesInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_code?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone_ext?: NullableStringFieldUpdateOperationsInput | string | null
    office_location?: NullableStringFieldUpdateOperationsInput | string | null
    cost_center?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EmployeeInfoCreateWithoutDepartment_historiesInput = {
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    positions?: PositionHistoryCreateNestedManyWithoutEmployee_infoInput
    personal_histories?: PersonalInfoHistoryCreateNestedManyWithoutEmployee_infoInput
    company_info?: CompanyInfoCreateNestedOneWithoutEmployeesInput
  }

  export type EmployeeInfoUncheckedCreateWithoutDepartment_historiesInput = {
    id?: number
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    company_info_id?: number | null
    positions?: PositionHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
    personal_histories?: PersonalInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
  }

  export type EmployeeInfoCreateOrConnectWithoutDepartment_historiesInput = {
    where: EmployeeInfoWhereUniqueInput
    create: XOR<EmployeeInfoCreateWithoutDepartment_historiesInput, EmployeeInfoUncheckedCreateWithoutDepartment_historiesInput>
  }

  export type DepartmentInfoCreateWithoutDepartment_historiesInput = {
    parent_id?: number | null
    name: string
    full_name?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoUncheckedCreateWithoutDepartment_historiesInput = {
    id?: number
    parent_id?: number | null
    name: string
    full_name?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoCreateOrConnectWithoutDepartment_historiesInput = {
    where: DepartmentInfoWhereUniqueInput
    create: XOR<DepartmentInfoCreateWithoutDepartment_historiesInput, DepartmentInfoUncheckedCreateWithoutDepartment_historiesInput>
  }

  export type EmployeeInfoUpsertWithoutDepartment_historiesInput = {
    update: XOR<EmployeeInfoUpdateWithoutDepartment_historiesInput, EmployeeInfoUncheckedUpdateWithoutDepartment_historiesInput>
    create: XOR<EmployeeInfoCreateWithoutDepartment_historiesInput, EmployeeInfoUncheckedCreateWithoutDepartment_historiesInput>
    where?: EmployeeInfoWhereInput
  }

  export type EmployeeInfoUpdateToOneWithWhereWithoutDepartment_historiesInput = {
    where?: EmployeeInfoWhereInput
    data: XOR<EmployeeInfoUpdateWithoutDepartment_historiesInput, EmployeeInfoUncheckedUpdateWithoutDepartment_historiesInput>
  }

  export type EmployeeInfoUpdateWithoutDepartment_historiesInput = {
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUpdateManyWithoutEmployee_infoNestedInput
    personal_histories?: PersonalInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
    company_info?: CompanyInfoUpdateOneWithoutEmployeesNestedInput
  }

  export type EmployeeInfoUncheckedUpdateWithoutDepartment_historiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    company_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
    personal_histories?: PersonalInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
  }

  export type DepartmentInfoUpsertWithoutDepartment_historiesInput = {
    update: XOR<DepartmentInfoUpdateWithoutDepartment_historiesInput, DepartmentInfoUncheckedUpdateWithoutDepartment_historiesInput>
    create: XOR<DepartmentInfoCreateWithoutDepartment_historiesInput, DepartmentInfoUncheckedCreateWithoutDepartment_historiesInput>
    where?: DepartmentInfoWhereInput
  }

  export type DepartmentInfoUpdateToOneWithWhereWithoutDepartment_historiesInput = {
    where?: DepartmentInfoWhereInput
    data: XOR<DepartmentInfoUpdateWithoutDepartment_historiesInput, DepartmentInfoUncheckedUpdateWithoutDepartment_historiesInput>
  }

  export type DepartmentInfoUpdateWithoutDepartment_historiesInput = {
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoUncheckedUpdateWithoutDepartment_historiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoHistoryCreateWithoutDepartmentInput = {
    added_at: Date | string
    deleted_at?: Date | string | null
    employee_info: EmployeeInfoCreateNestedOneWithoutDepartment_historiesInput
  }

  export type DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput = {
    id?: number
    employee_info_id: number
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoHistoryCreateOrConnectWithoutDepartmentInput = {
    where: DepartmentInfoHistoryWhereUniqueInput
    create: XOR<DepartmentInfoHistoryCreateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput>
  }

  export type DepartmentInfoHistoryCreateManyDepartmentInputEnvelope = {
    data: DepartmentInfoHistoryCreateManyDepartmentInput | DepartmentInfoHistoryCreateManyDepartmentInput[]
  }

  export type DepartmentInfoHistoryUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: DepartmentInfoHistoryWhereUniqueInput
    update: XOR<DepartmentInfoHistoryUpdateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedUpdateWithoutDepartmentInput>
    create: XOR<DepartmentInfoHistoryCreateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedCreateWithoutDepartmentInput>
  }

  export type DepartmentInfoHistoryUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: DepartmentInfoHistoryWhereUniqueInput
    data: XOR<DepartmentInfoHistoryUpdateWithoutDepartmentInput, DepartmentInfoHistoryUncheckedUpdateWithoutDepartmentInput>
  }

  export type DepartmentInfoHistoryUpdateManyWithWhereWithoutDepartmentInput = {
    where: DepartmentInfoHistoryScalarWhereInput
    data: XOR<DepartmentInfoHistoryUpdateManyMutationInput, DepartmentInfoHistoryUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type EmployeeInfoCreateWithoutPersonal_historiesInput = {
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    positions?: PositionHistoryCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryCreateNestedManyWithoutEmployee_infoInput
    company_info?: CompanyInfoCreateNestedOneWithoutEmployeesInput
  }

  export type EmployeeInfoUncheckedCreateWithoutPersonal_historiesInput = {
    id?: number
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    company_info_id?: number | null
    positions?: PositionHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
  }

  export type EmployeeInfoCreateOrConnectWithoutPersonal_historiesInput = {
    where: EmployeeInfoWhereUniqueInput
    create: XOR<EmployeeInfoCreateWithoutPersonal_historiesInput, EmployeeInfoUncheckedCreateWithoutPersonal_historiesInput>
  }

  export type EmployeeInfoUpsertWithoutPersonal_historiesInput = {
    update: XOR<EmployeeInfoUpdateWithoutPersonal_historiesInput, EmployeeInfoUncheckedUpdateWithoutPersonal_historiesInput>
    create: XOR<EmployeeInfoCreateWithoutPersonal_historiesInput, EmployeeInfoUncheckedCreateWithoutPersonal_historiesInput>
    where?: EmployeeInfoWhereInput
  }

  export type EmployeeInfoUpdateToOneWithWhereWithoutPersonal_historiesInput = {
    where?: EmployeeInfoWhereInput
    data: XOR<EmployeeInfoUpdateWithoutPersonal_historiesInput, EmployeeInfoUncheckedUpdateWithoutPersonal_historiesInput>
  }

  export type EmployeeInfoUpdateWithoutPersonal_historiesInput = {
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
    company_info?: CompanyInfoUpdateOneWithoutEmployeesNestedInput
  }

  export type EmployeeInfoUncheckedUpdateWithoutPersonal_historiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    company_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
  }

  export type EmployeeInfoCreateWithoutCompany_infoInput = {
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    positions?: PositionHistoryCreateNestedManyWithoutEmployee_infoInput
    personal_histories?: PersonalInfoHistoryCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryCreateNestedManyWithoutEmployee_infoInput
  }

  export type EmployeeInfoUncheckedCreateWithoutCompany_infoInput = {
    id?: number
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
    positions?: PositionHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
    personal_histories?: PersonalInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
    department_histories?: DepartmentInfoHistoryUncheckedCreateNestedManyWithoutEmployee_infoInput
  }

  export type EmployeeInfoCreateOrConnectWithoutCompany_infoInput = {
    where: EmployeeInfoWhereUniqueInput
    create: XOR<EmployeeInfoCreateWithoutCompany_infoInput, EmployeeInfoUncheckedCreateWithoutCompany_infoInput>
  }

  export type EmployeeInfoCreateManyCompany_infoInputEnvelope = {
    data: EmployeeInfoCreateManyCompany_infoInput | EmployeeInfoCreateManyCompany_infoInput[]
  }

  export type EmployeeInfoUpsertWithWhereUniqueWithoutCompany_infoInput = {
    where: EmployeeInfoWhereUniqueInput
    update: XOR<EmployeeInfoUpdateWithoutCompany_infoInput, EmployeeInfoUncheckedUpdateWithoutCompany_infoInput>
    create: XOR<EmployeeInfoCreateWithoutCompany_infoInput, EmployeeInfoUncheckedCreateWithoutCompany_infoInput>
  }

  export type EmployeeInfoUpdateWithWhereUniqueWithoutCompany_infoInput = {
    where: EmployeeInfoWhereUniqueInput
    data: XOR<EmployeeInfoUpdateWithoutCompany_infoInput, EmployeeInfoUncheckedUpdateWithoutCompany_infoInput>
  }

  export type EmployeeInfoUpdateManyWithWhereWithoutCompany_infoInput = {
    where: EmployeeInfoScalarWhereInput
    data: XOR<EmployeeInfoUpdateManyMutationInput, EmployeeInfoUncheckedUpdateManyWithoutCompany_infoInput>
  }

  export type EmployeeInfoScalarWhereInput = {
    AND?: EmployeeInfoScalarWhereInput | EmployeeInfoScalarWhereInput[]
    OR?: EmployeeInfoScalarWhereInput[]
    NOT?: EmployeeInfoScalarWhereInput | EmployeeInfoScalarWhereInput[]
    id?: IntFilter<"EmployeeInfo"> | number
    employee_number?: IntNullableFilter<"EmployeeInfo"> | number | null
    department_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    personal_info_id?: IntNullableFilter<"EmployeeInfo"> | number | null
    company_info_id?: IntNullableFilter<"EmployeeInfo"> | number | null
  }

  export type PositionHistoryCreateManyEmployee_infoInput = {
    id?: number
    position: string
    added_at: Date | string
    add_reason?: string | null
  }

  export type PersonalInfoHistoryCreateManyEmployee_infoInput = {
    id?: number
    last_name: string
    first_name: string
    address?: string | null
    phone_number?: string | null
    emergency_contact?: string | null
    birthplace?: string | null
    allergy?: string | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoHistoryCreateManyEmployee_infoInput = {
    id?: number
    department_id?: number | null
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type PositionHistoryUpdateWithoutEmployee_infoInput = {
    position?: StringFieldUpdateOperationsInput | string
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    add_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PositionHistoryUncheckedUpdateWithoutEmployee_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    position?: StringFieldUpdateOperationsInput | string
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    add_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PositionHistoryUncheckedUpdateManyWithoutEmployee_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    position?: StringFieldUpdateOperationsInput | string
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    add_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PersonalInfoHistoryUpdateWithoutEmployee_infoInput = {
    last_name?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    emergency_contact?: NullableStringFieldUpdateOperationsInput | string | null
    birthplace?: NullableStringFieldUpdateOperationsInput | string | null
    allergy?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersonalInfoHistoryUncheckedUpdateWithoutEmployee_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    last_name?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    emergency_contact?: NullableStringFieldUpdateOperationsInput | string | null
    birthplace?: NullableStringFieldUpdateOperationsInput | string | null
    allergy?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersonalInfoHistoryUncheckedUpdateManyWithoutEmployee_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    last_name?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    emergency_contact?: NullableStringFieldUpdateOperationsInput | string | null
    birthplace?: NullableStringFieldUpdateOperationsInput | string | null
    allergy?: NullableStringFieldUpdateOperationsInput | string | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoHistoryUpdateWithoutEmployee_infoInput = {
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: DepartmentInfoUpdateOneWithoutDepartment_historiesNestedInput
  }

  export type DepartmentInfoHistoryUncheckedUpdateWithoutEmployee_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoHistoryUncheckedUpdateManyWithoutEmployee_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoHistoryCreateManyDepartmentInput = {
    id?: number
    employee_info_id: number
    added_at: Date | string
    deleted_at?: Date | string | null
  }

  export type DepartmentInfoHistoryUpdateWithoutDepartmentInput = {
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    employee_info?: EmployeeInfoUpdateOneRequiredWithoutDepartment_historiesNestedInput
  }

  export type DepartmentInfoHistoryUncheckedUpdateWithoutDepartmentInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DepartmentInfoHistoryUncheckedUpdateManyWithoutDepartmentInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_info_id?: IntFieldUpdateOperationsInput | number
    added_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EmployeeInfoCreateManyCompany_infoInput = {
    id?: number
    employee_number?: number | null
    department_id?: number | null
    personal_info_id?: number | null
  }

  export type EmployeeInfoUpdateWithoutCompany_infoInput = {
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUpdateManyWithoutEmployee_infoNestedInput
    personal_histories?: PersonalInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUpdateManyWithoutEmployee_infoNestedInput
  }

  export type EmployeeInfoUncheckedUpdateWithoutCompany_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
    positions?: PositionHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
    personal_histories?: PersonalInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
    department_histories?: DepartmentInfoHistoryUncheckedUpdateManyWithoutEmployee_infoNestedInput
  }

  export type EmployeeInfoUncheckedUpdateManyWithoutCompany_infoInput = {
    id?: IntFieldUpdateOperationsInput | number
    employee_number?: NullableIntFieldUpdateOperationsInput | number | null
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_info_id?: NullableIntFieldUpdateOperationsInput | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}