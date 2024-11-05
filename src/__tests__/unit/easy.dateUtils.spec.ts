import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  // '1월의 일수를 31일로 반환한다'
  it('1월에 대해 31일을 반환한다', () => {
    expect(getDaysInMonth(2024, 1)).toBe(31);
  });

  // '4월의 일수를 30일로 반환한다'
  it('4월에 대해 30일을 반환한다.', () => {
    expect(getDaysInMonth(2024, 4)).toBe(30);
  });

  // '윤년의 2월 일수를 29일로 반환한다'
  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
  });

  // '평년의 2월 일수를 28일로 반환한다'
  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2023, 2)).toBe(28);
  });

  /**
   * '유효하지 않은 월일 경우 연관된 월의 일수를 반환한다'
   * 유효하지 않은 월에 대한 테스트는 코드가 예외를 던지는 방식으로 수정이 필요하다면 그때 추가하는 것이 좋을 것 같습니다.
   * 현재처럼 31일을 반환하는 방식이 유지 된다면, 아래와 같은 테스트는 제거하는게 맞다고 생각합니다.
   */
  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    // getDaysInMonth(2024, 0)은 2023년 12월을 참조하여 31일을 반환합니다.
    expect(getDaysInMonth(2024, 0)).toBe(31); // 2023년 12월
    // getDaysInMonth(2024, 13)은 2025년 1월을 참조하여 31일을 반환합니다.
    expect(getDaysInMonth(2024, 13)).toBe(31); // 2025년 1월
    /**
      유효하지 않은 월에 대해 0을 반환하거나 예외를 던지는 방식으로 수정이 필요합니다.
      예를 들어, 다음과 같은 구현이 필요합니다:
      if (month < 1 || month > 12) {
        ex1) throw new Error('유효하지 않은 월입니다.');
        ex2) return 0;
      }
      이와 같은 구현이 추가되면, 아래와 같은 테스트가 가능해집니다:
      expect(() => getDaysInMonth(2024, 0)).toThrow('유효하지 않은 월입니다.');
      expect(() => getDaysInMonth(2024, 0)).toBe(0);
     */
  });
});

describe('getWeekDates', () => {
  // '수요일 날짜에 대해 해당 주의 모든 날짜를 반환한다'
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2024-10-30');
    const weeks = getWeekDates(date);
    expect(weeks).toHaveLength(7);
    expect(weeks).toEqual([
      new Date('2024-10-27'), // 일요일
      new Date('2024-10-28'),
      new Date('2024-10-29'),
      new Date('2024-10-30'),
      new Date('2024-10-31'),
      new Date('2024-11-01'),
      new Date('2024-11-02'), // 토요일
    ]);
  });

  // '월요일 날짜에 대해 해당 주의 모든 날짜를 반환한다'
  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2024-11-04');
    const weeks = getWeekDates(date);
    expect(weeks).toHaveLength(7);
    expect(weeks).toEqual([
      new Date('2024-11-03'), // 일요일
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'), // 토요일
    ]);
  });

  // '토요일 날짜에 대해 해당 주의 모든 날짜를 반환한다'
  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2024-11-02');
    const weeks = getWeekDates(date);
    expect(weeks).toHaveLength(7);
    expect(weeks).toEqual([
      new Date('2024-10-27'), // 일요일
      new Date('2024-10-28'),
      new Date('2024-10-29'),
      new Date('2024-10-30'),
      new Date('2024-10-31'),
      new Date('2024-11-01'),
      new Date('2024-11-02'), // 토요일
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const date = new Date('2024-12-31');
    const weeks = getWeekDates(date);
    expect(weeks).toHaveLength(7);
    expect(weeks).toEqual([
      new Date('2024-12-29'), // 일요일
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'), // 토요일
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const date = new Date('2025-01-01');
    const weeks = getWeekDates(date);
    expect(weeks).toHaveLength(7);
    expect(weeks).toEqual([
      new Date('2024-12-29'), // 일요일
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'), // 토요일
    ]);
  });

  // '윤년 2월 29일이 포함된 주의 날짜들을 반환한다'
  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const date = new Date('2024-02-29');
    const weeks = getWeekDates(date);
    expect(weeks).toHaveLength(7);
    expect(weeks).toEqual([
      new Date('2024-02-25'), // 일요일
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'),
      new Date('2024-03-01'),
      new Date('2024-03-02'), // 토요일
    ]);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const date = new Date('2024-03-31');
    const weeks = getWeekDates(date);
    expect(weeks).toHaveLength(7);
    expect(weeks).toEqual([
      new Date('2024-03-31'), // 일요일
      new Date('2024-04-01'),
      new Date('2024-04-02'),
      new Date('2024-04-03'),
      new Date('2024-04-04'),
      new Date('2024-04-05'),
      new Date('2024-04-06'), // 토요일
    ]);
  });
});

describe('getWeeksAtMonth', () => {
  // '2024년 7월의 주 배열을 올바르게 반환한다'
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const date = new Date('2024-07-01');
    const weeks = getWeeksAtMonth(date);
    expect(weeks).toEqual([
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ]);
  });
});

describe('getEventsForDay', () => {
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {});

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {});

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {});

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {});
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {});

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {});
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {});

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {});

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {});

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {});

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {});

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {});
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {});

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {});

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {});

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {});

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {});

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {});

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {});

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {});

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {});
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {});

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {});

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});
});
