import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { WeekView } from './WeekView';
import { Event } from '../../types';

describe('WeekView', () => {
  const mockEvents = [
    {
      id: '1',
      title: '주간 회의',
      date: '2024-11-08',
      startTime: '09:00',
      endTime: '10:00',
      description: '설명 1',
      location: '장소 1',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '주말 이벤트',
      date: '2024-11-10',
      startTime: '11:00',
      endTime: '12:00',
      description: '설명 2',
      location: '장소 2',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];

  const defaultProps = {
    currentDate: new Date('2024-11-08'),
    filteredEvents: mockEvents as Event[],
    notifiedEvents: ['1'],
    weekDays: ['일', '월', '화', '수', '목', '금', '토'],
  };

  const renderWeekView = (component: React.ReactElement) => {
    return render(<ChakraProvider>{component}</ChakraProvider>);
  };

  it('현재 주의 모든 날짜가 표시되어야 합니다', () => {
    renderWeekView(<WeekView {...defaultProps} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('요일 헤더가 올바르게 표시되어야 합니다', () => {
    renderWeekView(<WeekView {...defaultProps} />);

    expect(screen.getByText('일')).toBeInTheDocument();
    expect(screen.getByText('월')).toBeInTheDocument();
    expect(screen.getByText('화')).toBeInTheDocument();
    expect(screen.getByText('수')).toBeInTheDocument();
    expect(screen.getByText('목')).toBeInTheDocument();
    expect(screen.getByText('금')).toBeInTheDocument();
    expect(screen.getByText('토')).toBeInTheDocument();
  });

  it('주중/주말에 해당하는 이벤트가 올바른 날짜 칸에 표시되어야 합니다', () => {
    renderWeekView(<WeekView {...defaultProps} />);

    const fridayCell = screen.getByText('8').closest('td');
    expect(fridayCell).toHaveTextContent('주간 회의');
  });

  it('알림이 있는 이벤트는 빨간색 배경으로 표시되어야 합니다', () => {
    renderWeekView(<WeekView {...defaultProps} />);

    const notifiedEvent = screen.getByText('주간 회의').closest('div');
    expect(notifiedEvent).toHaveStyle({ backgroundColor: 'var(--chakra-colors-red-100)' });
  });

  it('현재 주가 아닌 날짜의 이벤트는 표시되지 않아야 합니다', () => {
    const eventOutsideWeek = {
      id: '3',
      title: '다음주 이벤트',
      date: '2024-11-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '설명 3',
      location: '장소 3',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };

    renderWeekView(
      <WeekView {...defaultProps} filteredEvents={[...mockEvents, eventOutsideWeek] as Event[]} />
    );

    expect(screen.queryByText('다음주 이벤트')).not.toBeInTheDocument();
  });
});
