import { AsyncResource } from 'async_hooks';
import { Worker, WorkerOptions } from 'worker_threads';

interface ICustomWorker extends Worker {
  terminate(param?: number | string): Promise<number>;
}

interface ICustomerWorkerOptions extends WorkerOptions {
  max?: number;
  maxWaiting?: number;
}

export class QueuedWorkerThread extends AsyncResource {
  constructor(public pool: ThreadPool, public filename: string, public opts: ICustomerWorkerOptions, public cb: (err: Error, worker: Worker) => void) {
    super('worker-threads-pool:enqueue');
  }

  addToPool() {
    this.pool.acquire(this.filename, this.opts, (err: Error, worker: Worker) => {
      this.runInAsyncScope(this.cb, null, err, worker);
    });
  }
}

/**
 * Local typescript represntation of threadpool by https://github.com/watson/worker-threads-pool
 */
export class ThreadPool {
  private _workers: Set<ICustomWorker>;
  private _queue: QueuedWorkerThread[];
  private _max: number;
  private _maxWaiting: number;

  constructor(opts: ICustomerWorkerOptions) {
    opts = opts || {};
    this._workers = new Set();
    this._queue = [];
    this._max = opts.max || 4;
    this._maxWaiting = opts.maxWaiting || Infinity;
  }

  get size() {
    return this._workers.size;
  }

  acquire(filename: string, opts: ICustomerWorkerOptions, cb: (err: Error, worker: Worker) => void): void {
    if (typeof opts === 'function') {
      return this.acquire(filename, undefined, opts);
    }
    if (this._workers.size === this._max) {
      if (this._queue.length === this._maxWaiting) {
        process.nextTick(cb.bind(null, new Error('Pool queue is full')));
        return null;
      }
      this._queue.push(new QueuedWorkerThread(this, filename, opts, cb));
      return null;
    }

    const worker = new Worker(filename, opts);

    const done = () => {
      this._workers.delete((worker as unknown) as ICustomWorker);
      worker.removeListener('error', done);
      worker.removeListener('exit', done);
      const resource = this._queue.shift();
      if (resource) {
        resource.addToPool();
      }
    };

    worker.once('error', done);
    worker.once('exit', done);

    this._workers.add((worker as unknown) as ICustomWorker);

    process.nextTick(cb.bind(null, null, worker));
    return null;
  }

  destroy(
    cb = () => {
      //
    }
  ) {
    const next = afterAll(cb);
    for (const worker of this._workers) {
      worker.terminate(next());
    }
  }
}
