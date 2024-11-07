/* eslint-disable vitest/no-commented-out-tests */
import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const februaryDate = new Date('2024-02-01');
    const februaryHolidays = fetchHolidays(februaryDate);
    expect(februaryHolidays).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });

    const septemberDate = new Date('2024-09-01');
    const septemberHolidays = fetchHolidays(septemberDate);
    expect(septemberHolidays).toEqual({
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
    });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const date = new Date('2024-04-01');
    const result = fetchHolidays(date);
    expect(result).toEqual({});
  });

  // '주어진 월의 공휴일만 반환한다' 테스트 케이스와 동일한 테스트 케이스라고 판단하여 삭제 처리
  // it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {});

  // 추가 테스트 케이스
  it('HOLIDAY_RECORD에 정의되지 않은 월이 입력되었을 때 빈 객체를 반환한다', () => {
    const date = new Date('2025-01-01');
    const result = fetchHolidays(date);
    expect(result).toEqual({});
  });
});
