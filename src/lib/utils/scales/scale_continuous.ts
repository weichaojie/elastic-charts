import { scaleLinear, scaleLog, scaleSqrt, scaleTime } from 'd3-scale';
import { DateTime } from 'luxon';
import { ScaleContinuousType, ScaleType } from './scales';
import { Scale } from './scales';

const SCALES = {
  [ScaleType.Linear]: scaleLinear,
  [ScaleType.Log]: scaleLog,
  [ScaleType.Sqrt]: scaleSqrt,
  [ScaleType.Time]: scaleTime,
};

export class ScaleContinuous implements Scale {
  readonly bandwidth: number;
  readonly minInterval: number;
  readonly step: number;
  readonly type: ScaleType;
  readonly domain: any[];
  readonly range: number[];
  private readonly d3Scale: any;

  constructor(
    domain: any[],
    range: [number, number],
    type: ScaleContinuousType,
    clamp?: boolean,
    bandwidth?: number,
    minInterval?: number,
  ) {
    this.d3Scale = SCALES[type]();
    this.d3Scale.domain(domain);
    this.d3Scale.range(range);
    this.d3Scale.clamp(clamp);
    // this.d3Scale.nice();
    this.bandwidth = bandwidth || 0;
    this.step = 0;
    this.domain = domain;
    this.type = type;
    this.range = range;
    this.minInterval = minInterval || 0;
  }

  scale(value: any) {
    return this.d3Scale(value);
  }

  ticks() {
    if (this.minInterval > 0) {
      const intervalCount = (this.domain[1] - this.domain[0]) / this.minInterval;
      return new Array(intervalCount + 1).fill(0).map((d, i) => {
        return this.domain[0] + i * this.minInterval;
      });
    }
    return this.d3Scale.ticks();
  }
  invert(value: number) {
    if (this.type === ScaleType.Time) {
      const invertedDate = this.d3Scale.invert(value);
      return DateTime.fromJSDate(invertedDate).toISO();
    } else {
      return this.d3Scale.invert(value);
    }
  }
}
