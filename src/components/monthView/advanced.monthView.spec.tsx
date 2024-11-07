import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Event } from '../../types';

import { MonthView } from '.';

describe('MonthView', () => {
  const mockEvents = [
    {
      id: '1',
      title: '월초 이벤트',
      date: '2024-11-01',
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
      title: '월말 이벤트',
      date: '2024-11-30',
      startTime: '11:00',
      endTime: '12:00',
      description: '설명 2',
      location: '장소 2',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];

  const mockHolidays = {
    '2024-11-08': '공휴일 1',
    '2024-11-23': '공휴일 2',
  };

  const defaultProps = {
    currentDate: new Date('2024-11-08'),
    filteredEvents: mockEvents as Event[],
    notifiedEvents: ['1'],
    weekDays: ['일', '월', '화', '수', '목', '금', '토'],
    holidays: mockHolidays,
  };

  const renderMonthView = (component: React.ReactElement) => {
    return render(<ChakraProvider>{component}</ChakraProvider>);
  };

  it('요일 헤더가 올바르게 표시되어야 합니다', () => {
    renderMonthView(<MonthView {...defaultProps} />);

    expect(screen.getByText('일')).toBeInTheDocument();
    expect(screen.getByText('월')).toBeInTheDocument();
    expect(screen.getByText('화')).toBeInTheDocument();
    expect(screen.getByText('수')).toBeInTheDocument();
    expect(screen.getByText('목')).toBeInTheDocument();
    expect(screen.getByText('금')).toBeInTheDocument();
    expect(screen.getByText('토')).toBeInTheDocument();
  });

  it('월의 날짜들이 올바르게 표시되어야 합니다', () => {
    renderMonthView(<MonthView {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('공휴일이 올바른 날짜에 표시되어야 합니다', () => {
    renderMonthView(<MonthView {...defaultProps} />);

    const novemberEighth = screen.getByText('8').closest('td');
    const novemberTwentyThird = screen.getByText('23').closest('td');

    expect(novemberEighth).toHaveTextContent('공휴일 1');
    expect(novemberTwentyThird).toHaveTextContent('공휴일 2');
  });

  it('공휴일은 빨간색으로 표시되어야 합니다', () => {
    renderMonthView(<MonthView {...defaultProps} />);

    const holiday = screen.getByText('공휴일 1');
    expect(holiday).toHaveStyle({ color: 'var(--chakra-colors-red-500)' });
  });

  it('알림이 있는 이벤트는 빨간색 배경으로 표시되어야 합니다', () => {
    renderMonthView(<MonthView {...defaultProps} />);

    const notifiedEvent = screen.getByText('월초 이벤트').closest('div');
    expect(notifiedEvent).toHaveStyle({ backgroundColor: 'var(--chakra-colors-red-100)' });
  });

  it('알림이 없는 이벤트는 회색 배경으로 표시되어야 합니다', () => {
    renderMonthView(<MonthView {...defaultProps} />);

    const normalEvent = screen.getByText('월말 이벤트').closest('div');
    expect(normalEvent).toHaveStyle({ backgroundColor: 'var(--chakra-colors-gray-100)' });
  });

  it('월 제목이 올바르게 표시되어야 합니다', () => {
    renderMonthView(<MonthView {...defaultProps} />);
    expect(screen.getByText('2024년 11월')).toBeInTheDocument();
  });
});
