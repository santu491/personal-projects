import { Readable } from 'stream';
import * as util from 'util';

export function BufferStream(source: Buffer): void {
  if (!Buffer.isBuffer(source)) {
    throw new Error('Source must be a buffer.');
  }

  // Super constructor.
  Readable.call(this);

  (this)._source = source;

  // I keep track of which portion of the source buffer is currently being pushed
  // onto the internal stream buffer during read actions.
  this._offset = 0;
  this._length = source.length;

  // When the stream has ended, try to clean up the memory references.
  this.on('end', this._destroy);
}

util.inherits(BufferStream, Readable);

// I attempt to clean up variable references once the stream has been ended.
// --
// NOTE: I am not sure this is necessary. But, I'm trying to be more cognizant of memory
// usage since my Node.js apps will (eventually) never restart.
// eslint-disable-next-line no-underscore-dangle
BufferStream.prototype._destroy = function() {
  this._source = null;
  this._offset = null;
  this._length = null;
};

// I read chunks from the source buffer into the underlying stream buffer.
// --
// NOTE: We can assume the size value will always be available since we are not
// altering the readable state options when initializing the Readable stream.
// eslint-disable-next-line no-underscore-dangle
BufferStream.prototype._read = function(size: number) {
  // If we haven't reached the end of the source buffer, push the next chunk onto
  // the internal stream buffer.
  if (this._offset < this._length) {
    this.push(this._source.slice(this._offset, this._offset + size));

    this._offset += size;
  }

  // If we've consumed the entire source buffer, close the readable stream.
  if (this._offset >= this._length) {
    this.push(null);
  }
};
