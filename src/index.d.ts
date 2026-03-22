// ─── Array ────────────────────────────────────────────────────────────────────

export declare namespace array {
  function joinUnique<T>(...args: T[][]): T[];
  function joinUniqueCustom<T>(options: { key: (item: T) => unknown; items: T[][] }): T[];
  function splitBatches<T>(items: T[], size: number): T[][];
}

// ─── Epoch ────────────────────────────────────────────────────────────────────

export declare namespace epoch {
  function days(t: number): number;
  function hours(t: number): number;
  function minutes(t: number): number;
  function months(t: number): number;
  function seconds(t: number): number;
  function msToS(v: number): number;
  function round(time: number, interval: number): number;
}

// ─── Math ─────────────────────────────────────────────────────────────────────

export declare namespace math {
  function calcMean(values: number[]): number;
  function calcMedian(values: number[]): number;
  function calcMedianAbsDev(pop: number[]): number;
  function calcStdDevPopulation(values: number[]): number;
  function calcStdDevSample(values: number[]): number;
  function calcZScore(sample: number, mean: number, stdDev: number): number;
  function roundGaussian(n: number, d?: number): number;
  function roundStandard(n: number, d?: number): number;
}

// ─── Object ───────────────────────────────────────────────────────────────────

export declare namespace object {
  function camelize<T extends Record<string, unknown> | Record<string, unknown>[]>(
    obj: T,
    options?: { keepAllCaps?: boolean }
  ): T;
  function filterProps<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    props: K[]
  ): Pick<T, K>;
  function removeEmptyArrays<T extends Record<string, unknown>>(o: T): Partial<T>;
  function snakelize<T extends Record<string, unknown> | Record<string, unknown>[]>(
    obj: T,
    options?: { keepAllCaps?: boolean }
  ): T;
}

// ─── String ───────────────────────────────────────────────────────────────────

export declare namespace string {
  function camelize(input: string, options?: { keepAllCaps?: boolean }): string;
  function capitalizeWords(input: string): string;
  function snakelize(input: string, options?: { keepAllCaps?: boolean }): string;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

export declare namespace utils {
  function sleep(t: number): Promise<void>;

  function retryOnError<T>(
    closure: () => Promise<T> | T,
    options?: {
      limit?: number;
      delay?: number;
      retryHook?: ((error: Error, attempt: number) => boolean | Promise<boolean> | void) | null;
    }
  ): Promise<T | false>;

  class Timer {
    start(): this;
    restart(): this;
    stop(): number;
    readonly elapsed: number;
    readonly running: boolean;
  }

  function untarJsonGz(raw: Buffer): object[];
}

// ─── Redis ────────────────────────────────────────────────────────────────────

export declare namespace redis {
  function createClient(options: {
    redis: unknown;
    address: string;
    protocol?: string;
    port?: number;
  }): Promise<unknown>;
}

// ─── AWS ──────────────────────────────────────────────────────────────────────

export declare namespace aws {

  // Athena

  interface AthenaQueryResult {
    items: Record<string, unknown>[];
    paginationToken?: string;
  }

  interface AthenaInstance {
    getClient(): unknown;
    query(
      nativeArgs: Record<string, unknown>,
      options?: {
        recursive?: boolean;
        paginationToken?: string;
        maxResults?: number;
      }
    ): Promise<AthenaQueryResult>;
  }

  interface AthenaService extends AthenaInstance {
    (awsConfig?: Record<string, unknown>): AthenaInstance;
  }

  const athena: AthenaService;

  // CloudWatch Logs

  interface CwLogsQueryResult {
    items: Record<string, unknown>[];
    count: number;
  }

  interface CwLogsInstance {
    getClient(): unknown;
    query(
      nativeArgs: Record<string, unknown>,
      options?: {
        range?: { from?: number; to?: number };
      }
    ): Promise<CwLogsQueryResult>;
  }

  interface CwLogsService extends CwLogsInstance {
    (awsConfig?: Record<string, unknown>): CwLogsInstance;
  }

  const cwLogs: CwLogsService;

  // DynamoDB

  interface DynamoQueryResult {
    items: Record<string, unknown>[];
    count: number;
    nextToken?: string;
  }

  interface DynamoInstance {
    getClient(): unknown;
    get(tableName: string, key: Record<string, unknown>): Promise<Record<string, unknown> | undefined>;
    get(nativeArgs: Record<string, unknown>): Promise<Record<string, unknown> | undefined>;
    put(tableName: string, item: Record<string, unknown>): Promise<Record<string, unknown>>;
    put(nativeArgs: Record<string, unknown>): Promise<Record<string, unknown>>;
    putBatch(table: string, items: Record<string, unknown>[]): Promise<true>;
    query(
      nativeArgs: Record<string, unknown>,
      options?: { recursive?: boolean; paginationToken?: string }
    ): Promise<DynamoQueryResult>;
    scan(
      nativeArgs: Record<string, unknown>,
      options?: { recursive?: boolean; paginationToken?: string }
    ): Promise<DynamoQueryResult>;
    remove(tableName: string, key: Record<string, unknown>): Promise<Record<string, unknown>>;
    removeBatch(table: string, items: Record<string, unknown>[]): Promise<true>;
    smartUpdate(
      tableName: string,
      key: Record<string, unknown>,
      keyValues: Record<string, unknown>
    ): Promise<Record<string, unknown> | null>;
    transactWrite(items: Record<string, unknown>[]): Promise<unknown>;
    update(nativeArgs: Record<string, unknown>): Promise<Record<string, unknown>>;
  }

  interface DynamoService extends DynamoInstance {
    (awsConfig?: Record<string, unknown>): DynamoInstance;
  }

  const dynamo: DynamoService;

  // Lambda

  interface LambdaInstance {
    getClient(): unknown;
    invoke(
      name: string,
      payload?: Record<string, unknown>,
      type?: 'RequestResponse' | 'Event' | 'DryRun'
    ): Promise<unknown>;
  }

  interface LambdaService extends LambdaInstance {
    (awsConfig?: Record<string, unknown>): LambdaInstance;
  }

  const lambda: LambdaService;

  // S3

  interface S3Instance {
    getClient(): unknown;
    copy(bucket: string, key: string, source: string, nativeArgs?: Record<string, unknown>): Promise<unknown>;
    download(bucket: string, key: string, nativeArgs?: Record<string, unknown>): Promise<string>;
    getSignedUrl(bucket: string, key: string, expiration: number): Promise<string>;
    head(bucket: string, key: string): Promise<unknown>;
    upload(
      bucket: string,
      key: string,
      body: string | Buffer | Record<string, unknown>,
      nativeArgs?: Record<string, unknown>
    ): Promise<unknown>;
  }

  interface S3Service extends S3Instance {
    (awsConfig?: Record<string, unknown>): S3Instance;
  }

  const s3: S3Service;

  // SES

  interface SesInstance {
    getClient(): unknown;
    sendEmail(
      options: { to: string[]; from: string; html: string; subject: string },
      args?: Record<string, unknown>
    ): Promise<unknown>;
    deleteSuppressedDestination(address: string): Promise<unknown>;
  }

  interface SesService extends SesInstance {
    (awsConfig?: Record<string, unknown>): SesInstance;
  }

  const ses: SesService;

  // SNS

  interface SnsMessage {
    body: string | Record<string, unknown>;
    id?: string;
    nativeArgs?: Record<string, unknown>;
  }

  interface SnsInstance {
    getClient(): unknown;
    publish(topic: string, message: string | Record<string, unknown>, args?: Record<string, unknown>): Promise<string>;
    publishBatch(topic: string, messages: SnsMessage[]): Promise<unknown>;
  }

  interface SnsService extends SnsInstance {
    (awsConfig?: Record<string, unknown>): SnsInstance;
  }

  const sns: SnsService;

  // SQS

  interface SqsMessage {
    body: string | Record<string, unknown>;
    id?: string;
    nativeArgs?: Record<string, unknown>;
  }

  interface SqsInstance {
    getClient(): unknown;
    sendMessage(queue: string, body: string | Record<string, unknown>, args?: Record<string, unknown>): Promise<string>;
    sendMessageBatch(queue: string, messages: SqsMessage[]): Promise<unknown>;
    deleteMessage(queue: string, receiptHandle: string): Promise<unknown>;
  }

  interface SqsService extends SqsInstance {
    (awsConfig?: Record<string, unknown>): SqsInstance;
  }

  const sqs: SqsService;

  // SSM

  interface SsmInstance {
    getClient(): unknown;
    get(name: string): Promise<string | null>;
  }

  interface SsmService extends SsmInstance {
    (awsConfig?: Record<string, unknown>): SsmInstance;
  }

  const ssm: SsmService;

  // Timestream Query

  interface TimestreamQueryResult {
    nextToken?: string;
    count: number;
    items: Record<string, unknown>[];
    queryStatus: Record<string, unknown>;
  }

  interface TimestreamQueryInstance {
    getClient(): unknown;
    query(
      queryString: string,
      options?: {
        recursive?: boolean;
        paginationToken?: string;
        maxRows?: number;
        rawResponse?: boolean;
      }
    ): Promise<TimestreamQueryResult | unknown>;
  }

  interface TimestreamQueryService extends TimestreamQueryInstance {
    (awsConfig?: Record<string, unknown>): TimestreamQueryInstance;
  }

  const timestreamQuery: TimestreamQueryService;

  // Timestream Write

  interface TimestreamWriteResult {
    recordsIngested?: unknown;
    rejectedRecords?: unknown;
  }

  interface TimestreamWriteInstance {
    getClient(): unknown;
    writeRecords(options: {
      database: string;
      table: string;
      records: unknown[];
      ignoreRejections?: boolean;
    }): Promise<TimestreamWriteResult>;
  }

  interface TimestreamWriteService extends TimestreamWriteInstance {
    (awsConfig?: Record<string, unknown>): TimestreamWriteInstance;
  }

  const timestreamWrite: TimestreamWriteService;
}

// ─── LambdaApi ────────────────────────────────────────────────────────────────

type HttpMethod = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT';
type TransformMode = 'camelcase' | 'snakecase' | false | null;

type HandlerReturnValue =
  | undefined
  | string
  | number
  | [number, unknown?, Record<string, string>?, boolean?]
  | { statusCode: number; body?: unknown; headers?: Record<string, string>; isBase64Encoded?: boolean };

type ApiGatewayResponse = {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
  isBase64Encoded: boolean;
};

export declare class LambdaApi {
  constructor(options?: {
    headers?: Record<string, string>;
    transformRequest?: TransformMode;
    transformResponse?: TransformMode;
  });

  addBeforeHook(options: {
    fn: (event: unknown, context: unknown) => Promise<void> | void;
  }): void;

  addAfterHook(options: {
    fn: (event: unknown, context: unknown, response: ApiGatewayResponse) => Promise<void> | void;
  }): void;

  addHandler(options: {
    method: HttpMethod;
    fn: (event: unknown, context: unknown) => HandlerReturnValue | Promise<HandlerReturnValue>;
    route?: string;
    routeIncludes?: string;
    routeNotIncludes?: string;
    routeMatches?: RegExp;
    path?: string;
    pathIncludes?: string;
    pathNotIncludes?: string;
    pathMatches?: RegExp;
  }): void;

  addErrorHandler(options: {
    errorType: new (...args: unknown[]) => Error;
    code: number;
    message?: string;
  }): void;

  process(awsEvent: unknown): Promise<ApiGatewayResponse>;
}
