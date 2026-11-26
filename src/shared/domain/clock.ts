/** Port that provides the current time, so time-dependent logic stays testable. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
