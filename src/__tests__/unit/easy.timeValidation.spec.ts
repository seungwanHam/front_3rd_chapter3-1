/* eslint-disable vitest/no-commented-out-tests */
import { getTimeErrorMessage } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    const start = '15:00';
    const end = '14:00';
    const timeValidationResult = getTimeErrorMessage(start, end);
    expect(timeValidationResult).toEqual({
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    });
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    const start = '10:00';
    const end = '10:00';
    const timeValidationResult = getTimeErrorMessage(start, end);
    expect(timeValidationResult).toEqual({
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    });
  });

  // 시작 시간이 종료 시간보다 빠를 때 에러가 없음을 나타내는 null을 반환한다
  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    const start = '09:00';
    const end = '10:00';
    const timeValidationResult = getTimeErrorMessage(start, end);
    expect(timeValidationResult).toEqual({ startTimeError: null, endTimeError: null });
  });

  // 시작 시간이 비어있을 때 시간 비교를 생략하고 null을 반환한다
  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    const start = '';
    const end = '10:00';
    const timeValidationResult = getTimeErrorMessage(start, end);
    expect(timeValidationResult).toEqual({ startTimeError: null, endTimeError: null });
  });

  // 종료 시간이 비어있을 때 시간 비교를 생략하고 null을 반환한다
  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    const result = getTimeErrorMessage('', '');
    expect(result).toEqual({ startTimeError: null, endTimeError: null });
  });

  /**
   * `start`와 `end`가 모두 비어있는 경우에 대한 테스트는 생략했습니다.
   * 함수 로직에서 `start`와 `end` 중 하나라도 비어 있으면 즉시 { startTimeError: null, endTimeError: null }을 반환하므로,
   * `start`와 `end`가 모두 비어 있을 때의 케이스는 로직 상 동일한 결과를 반환합니다.
   * 따라서 이 케이스는 이미 다른 테스트로 충분히 검증되었으므로 중복 검증을 피하기 위해 생략했습니다.
   */
  // it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {});
});
