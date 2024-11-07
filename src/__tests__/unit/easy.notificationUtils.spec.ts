import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
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

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-07-01T09:50');
    const result = getUpcomingEvents(events, now, []);
    expect(result).toEqual([events[0]]);
  });

  // 이미 알림이 간 이벤트는 반환하지 않는다.
  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-07-01T09:50');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T08:00');
    const result = getUpcomingEvents(events, now, []);
    expect(result).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T10:30');
    const result = getUpcomingEvents(events, now, []);
    expect(result).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
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
    };
    const message = createNotificationMessage(event);
    expect(message).toBe('10분 후 이벤트 1 일정이 시작됩니다.');
  });
});
