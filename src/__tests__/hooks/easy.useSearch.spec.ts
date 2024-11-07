import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

describe('useSearch Hook - 필터링 및 검색어 테스트', () => {
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
      title: '회의 1',
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
      title: '이벤트 3',
      date: '2024-07-30',
      startTime: '13:00',
      endTime: '14:00',
      description: '설명 4',
      location: '항해 플러스 인천 캠퍼스',
      category: '컨퍼런스',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 15,
    },
  ];

  it('검색어가 비어있고 월간 뷰일 때 모든 이벤트를 반환한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));
    expect(result.current.filteredEvents).toEqual(events);
  });

  it('검색어가 비어있고 주간 뷰일 때 해당 주의 이벤트만 반환한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'week'));
    expect(result.current.filteredEvents).toEqual([events[0], events[1]]);
  });

  it('검색어가 포함된 이벤트만 필터링한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));

    act(() => {
      result.current.setSearchTerm('이벤트');
    });
    expect(result.current.filteredEvents).toEqual([events[0], events[1], events[3]]);

    act(() => {
      result.current.setSearchTerm('인천');
    });
    expect(result.current.filteredEvents).toEqual([events[3]]);

    act(() => {
      result.current.setSearchTerm('회의');
    });
    expect(result.current.filteredEvents).toEqual([events[2]]);

    act(() => {
      result.current.setSearchTerm('점심');
    });
    expect(result.current.filteredEvents).toEqual([]);
  });
});
