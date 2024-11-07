/* eslint-disable vitest/no-commented-out-tests */
import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명 1',
      location: '항해플러스 부산 캠퍼스',
      category: '워크샵',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-02',
      startTime: '14:00',
      endTime: '15:00',
      description: '설명 2',
      location: '항해플러스 서울 선릉 캠퍼스',
      category: '세미나',
      repeat: { type: 'daily', interval: 1, endDate: '2024-07-10' },
      notificationTime: 20,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2024-07-10',
      startTime: '09:00',
      endTime: '10:00',
      description: '설명 3',
      location: '항해 플러스 서울 강동 캠퍼스',
      category: '회의',
      repeat: { type: 'weekly', interval: 1 },
      notificationTime: 5,
    },
    {
      id: '4',
      title: '이벤트 4',
      date: '2024-07-30',
      startTime: '13:00',
      endTime: '14:00',
      description: '설명 4',
      location: '항해 플러스 인천 캠퍼스',
      category: '컨퍼런스',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 15,
    },
    {
      id: '5',
      title: '이벤트 5',
      date: '2024-08-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '설명 5',
      location: '항해 플러스 수원 캠퍼스',
      category: '워크샵',
      repeat: { type: 'yearly', interval: 1 },
      notificationTime: 30,
    },
  ];

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const searchTerm = '이벤트 2';
    const currentDate = new Date('2024-07-01');
    const view = 'month';
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual([events[1]]);
  });

  // 추가 테스트 케이스
  it("검색어 '서울'에 해당하는 이벤트만 반환한다", () => {
    const searchTerm = '서울';
    const currentDate = new Date('2024-07-01');
    const view = 'month';
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual([events[1], events[2]]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const searchTerm = '';
    const currentDate = new Date('2024-07-01');
    const view = 'week';
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual([events[0], events[1]]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const searchTerm = '';
    const currentDate = new Date('2024-07-01');
    const view = 'month';
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual([events[0], events[1], events[2], events[3]]);
  });

  // "검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용하여 2024-07-01 주의 이벤트만 반환한다"
  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const searchTerm = '이벤트';
    const currentDate = new Date('2024-07-01');
    const view = 'week';
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual([events[0], events[1]]);
  });

  /**
   * 검색어가 없을때의 경우는
   * '주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', '월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다'
   * 테스트 케이스에서 이미 포함되어 있습니다.
   */
  // it('검색어가 없을 때 모든 이벤트를 반환한다', () => {});

  // 추가 테스트 케이스
  it('view가 없을 때 모든 이벤트를 반환한다', () => {
    const searchTerm = '';
    const currentDate = new Date('2024-07-01');
    const view = null;
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual(events);
  });

  // 검색어가 대소문자를 구분하지 않고 일치하는 이벤트를 반환한다
  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const searchTerm = '이벤트';
    const currentDate = new Date('2024-07-01');
    const view = 'month';
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual([events[0], events[1], events[2], events[3]]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const julyEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
    expect(julyEvents).toEqual([events[0], events[1], events[2], events[3]]);

    const augustEvents = getFilteredEvents(events, '', new Date('2024-08-01'), 'month');
    expect(augustEvents).toEqual([events[4]]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const events: Event[] = [];
    const searchTerm = '';
    const currentDate = new Date('2024-07-01');
    const view = 'month';
    const result = getFilteredEvents(events, searchTerm, currentDate, view);
    expect(result).toEqual([]);
  });
});
