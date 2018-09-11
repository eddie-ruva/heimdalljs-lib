import OpCodes from '../../src/shared/op-codes';
import { format, ORIGIN_TIME } from '../../src/shared/time';
import EventArray from '../../src/shared/event-array';

/*
  Creates a fake time signature from the number of milliseconds provided
  since system time began.
 */
function fT(milliseconds) {
  switch (format) {
    case 'milli':
      return milliseconds;
    case 'hrtime':
      let seconds = Math.floor(milliseconds / 1000);
      let ms = milliseconds - (seconds * 1000);
      let nanoseconds = ms * 1e6;

      return [seconds, nanoseconds];
    case 'timestamp':
      return ORIGIN_TIME + milliseconds;
    default:
      return milliseconds;
  }
}

/*
 This results in the node tree.

 A
 |_ B
 | |_C
 |_ D

 The leafy tree looks like this.

 A
 |_ AB
 |_ B
 |  |_ BC
 |  |_ C
 |  |  |_ CC
 |  |_ CB
 |_ BD
 |_ D
 |  |_ DD
 |_ DA

 */
export const NICE_OP_TREE = new EventArray(undefined,
 [
    OpCodes.OP_START, 'A', fT(0), null,
    OpCodes.OP_START, 'B', fT(1), null,
    OpCodes.OP_START, 'C', fT(2), null,
    OpCodes.OP_STOP, 8, fT(3), null,  // stop C
    OpCodes.OP_STOP, 4, fT(4), null,  // stop B
    OpCodes.OP_START, 'D', fT(5), null,
    OpCodes.OP_ANNOTATE, null, null, { foo: 'bar' },
    OpCodes.OP_STOP, 20, fT(6), null,  // stop D
    OpCodes.OP_STOP, 0, fT(7), null  // stop A
  ]);

export const BAD_OP_TREE_INACTIVE_STOPPED = new EventArray(undefined,
  [
    OpCodes.OP_START, 'A', fT(0), null,
    OpCodes.OP_STOP, 0, fT(1), null, // stop A
    OpCodes.OP_STOP, 0, fT(3), null  // stop A again
  ]);

export const BAD_OP_TREE_ACTIVE_CHILD_STOPPED = new EventArray(undefined,
  [
      OpCodes.OP_START, 'A', fT(0), null,
      OpCodes.OP_START, 'B', fT(1), null,
      OpCodes.OP_STOP, 0, fT(1), null // stop A while B is active
    ]);

export const BAD_OP_TREE_ACTIVE_RESUMED = new EventArray(undefined,
  [
    OpCodes.OP_START, 'A', fT(0), null,
    OpCodes.OP_RESUME, 0, fT(1), null // restart A
  ]);

export default {
  NICE_OP_TREE,
  BAD_OP_TREE_INACTIVE_STOPPED,
  BAD_OP_TREE_ACTIVE_CHILD_STOPPED,
  BAD_OP_TREE_ACTIVE_RESUMED
}