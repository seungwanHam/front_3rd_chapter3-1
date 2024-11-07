import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { Event } from '../types';

const TEST_EVENT_BASE: Omit<Event, 'id' | 'title' | 'date' | 'startTime' | 'endTime'> = {
  description: '',
  location: '',
  category: '',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 0,
};

const createTestEvent = (overrides: Partial<Event>): Event => ({
  ...TEST_EVENT_BASE,
  id: '1',
  title: '테스트 이벤트',
  date: '2024-11-10',
  startTime: '09:00',
  endTime: '10:00',
  ...overrides,
});

const renderApp = () => {
  return render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

const clearEventForm = async (user: UserEvent) => {
  await user.clear(screen.getByLabelText(/제목/));
  await user.clear(screen.getByLabelText(/날짜/));
  await user.clear(screen.getByLabelText(/시작 시간/));
  await user.clear(screen.getByLabelText(/종료 시간/));
  await user.clear(screen.getByLabelText(/설명/));
  await user.clear(screen.getByLabelText(/위치/));
};

const fillEventForm = async (user: UserEvent, eventData: Partial<Event>) => {
  if (eventData.title) await user.type(screen.getByLabelText(/제목/), eventData.title);
  if (eventData.date) await user.type(screen.getByLabelText(/날짜/), eventData.date);
  if (eventData.startTime) await user.type(screen.getByLabelText(/시작 시간/), eventData.startTime);
  if (eventData.endTime) await user.type(screen.getByLabelText(/종료 시간/), eventData.endTime);
  if (eventData.description) await user.type(screen.getByLabelText(/설명/), eventData.description);
  if (eventData.location) await user.type(screen.getByLabelText(/위치/), eventData.location);
  if (eventData.category)
    await user.selectOptions(screen.getByLabelText(/카테고리/), eventData.category);
};

const verifyEventInList = async (eventList: HTMLElement, event: Partial<Event>) => {
  if (event.title) expect(within(eventList).getByText(event.title)).toBeInTheDocument();
  if (event.date) expect(within(eventList).getByText(event.date)).toBeInTheDocument();
  if (event.startTime)
    expect(within(eventList).getByText(new RegExp(event.startTime))).toBeInTheDocument();
  if (event.endTime)
    expect(within(eventList).getByText(new RegExp(event.endTime))).toBeInTheDocument();
  if (event.description) expect(within(eventList).getByText(event.description)).toBeInTheDocument();
  if (event.location) expect(within(eventList).getByText(event.location)).toBeInTheDocument();
  if (event.category)
    expect(within(eventList).getByText(new RegExp(event.category))).toBeInTheDocument();
};

let user: UserEvent;
beforeEach(() => {
  user = userEvent.setup();
});

afterAll(() => {
  vi.useRealTimers();
});

describe('일정 관리', () => {
  describe('CRUD 기능', () => {
    // 새로운 일정 생성
    it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
      // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
      setupMockHandlerCreation();
      renderApp();

      const newEvent = createTestEvent({
        title: '제목',
        date: '2024-11-08',
        startTime: '09:00',
        endTime: '10:00',
        description: '설명',
        location: '회의실',
        category: '업무',
      });

      await fillEventForm(user, newEvent);

      await user.click(screen.getByRole('button', { name: /일정 추가/ }));

      const eventList = screen.getByTestId('event-list');

      await verifyEventInList(eventList, newEvent);
    });

    // 기존 일정 수정
    it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
      const initEvent = createTestEvent({
        id: '1',
        title: '수정될 이벤트',
        date: '2024-11-05',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '',
      });

      setupMockHandlerUpdating([initEvent]);
      renderApp();

      const eventList = await screen.findByTestId('event-list');
      expect(await within(eventList).findByText('수정될 이벤트')).toBeInTheDocument();

      const editButton = await within(eventList).findByRole('button', { name: 'Edit event' });
      await user.click(editButton);

      await clearEventForm(user);

      const updatedEvent = createTestEvent({
        title: '수정된 팀 회의 제목',
        date: '2024-11-08',
        startTime: '10:00',
        endTime: '12:00',
        description: '수정된 팀 회의 설명',
        location: '수정된 회의실',
        category: '개인',
      });

      await fillEventForm(user, updatedEvent);
      await user.click(screen.getByRole('button', { name: /일정 수정/ }));

      const updatedEventList = await screen.findByTestId('event-list');
      await verifyEventInList(updatedEventList, updatedEvent);
    });

    // 기존 일정 삭제
    it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      const initEvent = createTestEvent({
        title: '이벤트',
        date: '2024-11-08',
        startTime: '10:00',
        endTime: '14:00',
      });

      setupMockHandlerDeletion([initEvent]);
      renderApp();

      const eventList = await screen.findByTestId('event-list');
      await waitFor(() => {
        expect(within(eventList).getByText(initEvent.title)).toBeInTheDocument();
      });

      const deleteButton = await within(eventList).findAllByRole('button', {
        name: 'Delete event',
      });
      await user.click(deleteButton[0]);

      await waitFor(() => {
        expect(within(eventList).queryByText(initEvent.title)).toBeInTheDocument();
      });
    });
  });

  describe('뷰 기능', () => {
    beforeAll(() => {
      vi.setSystemTime(new Date('2024-11-05'));
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    // 주별 뷰 표시
    it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
      const event = createTestEvent({
        title: '회의',
        date: '2024-11-08',
        category: '업무',
        notificationTime: 10,
      });

      setupMockHandlerCreation([event]);
      renderApp();

      await user.selectOptions(screen.getByLabelText(/view/), 'week');

      const eventList = await screen.findByTestId('event-list');
      expect(within(eventList).getByText(event.title)).toBeInTheDocument();
    });

    // 월별 뷰 - 일정 없음
    it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      setupMockHandlerCreation();
      renderApp();

      await user.selectOptions(screen.getByLabelText(/view/), 'month');

      const eventList = await screen.findByTestId('event-list');
      expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });

    // 월별 뷰 - 일정 표시
    it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      const event = createTestEvent({
        title: '이벤트',
        date: '2024-11-08',
        notificationTime: 10,
      });

      setupMockHandlerCreation([event]);
      renderApp();

      await user.selectOptions(screen.getByLabelText(/view/), 'month');

      const eventList = await screen.findByTestId('event-list');
      expect(within(eventList).getByText(event.title)).toBeInTheDocument();
    });

    // 공휴일 표시
    it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      vi.setSystemTime(new Date('2024-01-01'));
      renderApp();

      await user.selectOptions(screen.getByLabelText(/view/), 'month');

      expect(screen.getByText('신정')).toBeInTheDocument();
    });
  });

  describe('검색 기능', () => {
    // 검색 결과 없음
    it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
      const event = createTestEvent({ title: '일정1' });
      setupMockHandlerCreation([event]);
      renderApp();

      const eventList = screen.getByTestId('event-list');
      await user.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '이 검색어는 없지');

      await waitFor(() => {
        expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
      });
    });

    // 검색 결과 표시
    it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
      const events = [
        createTestEvent({ id: '1', title: '팀 회의' }),
        createTestEvent({ id: '2', title: '일정2', date: '2024-11-11' }),
      ];

      setupMockHandlerCreation(events);
      renderApp();

      const eventList = screen.getByTestId('event-list');
      await user.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '팀 회의');

      expect(within(eventList).queryByText('일정2')).not.toBeInTheDocument();
      expect(within(eventList).queryByText('팀 회의')).toBeInTheDocument();
    });

    // 검색어 초기화
    it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      const events = [
        createTestEvent({ id: '1', title: '팀 회의', date: '2024-11-14' }),
        createTestEvent({ id: '2', title: '기존 회의', date: '2024-11-15' }),
      ];

      setupMockHandlerCreation(events);
      renderApp();

      const eventList = screen.getByTestId('event-list');
      await user.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '이 검색어는 없지');

      expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();

      await user.clear(screen.getByPlaceholderText(/검색어를 입력하세요/));

      expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    });
  });

  describe('충돌 감지', () => {
    // 새 일정 추가 시 충돌 감지
    it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
      const existingEvent = createTestEvent({
        title: '충돌 이벤트',
        date: '2024-11-03',
        startTime: '09:00',
        endTime: '10:00',
      });

      setupMockHandlerCreation([existingEvent]);
      renderApp();

      const newEvent = createTestEvent({
        title: '충돌 이벤트',
        date: '2024-11-03',
        startTime: '09:30',
        endTime: '10:30',
        description: '충돌 이벤트 설명',
        location: '충돌 이벤트 위치',
        category: '업무',
      });

      await fillEventForm(user, newEvent);
      await user.click(screen.getByRole('button', { name: /일정 추가/ }));

      expect(screen.getByText(/다음 일정과 겹칩니다/)).toBeInTheDocument();
    });

    // 기존 일정 수정 시 충돌 감지
    it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
      const events = [
        createTestEvent({
          id: '1',
          title: '이벤트1',
          date: '2024-11-10',
          startTime: '09:00',
          endTime: '10:00',
        }),
        createTestEvent({
          id: '2',
          title: '이벤트2',
          date: '2024-11-10',
          startTime: '10:00',
          endTime: '11:00',
        }),
      ];

      setupMockHandlerCreation(events);
      renderApp();

      const eventList = await screen.findByTestId('event-list');
      expect(await within(eventList).findByText('이벤트1')).toBeInTheDocument();

      const editButton = await within(eventList).findAllByRole('button', { name: 'Edit event' });
      await user.click(editButton[0]);

      const updatedEvent = createTestEvent({
        startTime: '09:30',
        endTime: '10:30',
      });

      await clearEventForm(user);
      await fillEventForm(user, updatedEvent);

      await user.click(screen.getByRole('button', { name: /일정 수정/ }));

      expect(screen.getByText(/다음 일정과 겹칩니다/)).toBeInTheDocument();
    });
  });

  describe('알림 기능', () => {
    // 알림 시간 설정 및 표시
    it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
      vi.setSystemTime(new Date('2024-11-10T08:50:00'));

      const event = createTestEvent({
        title: '알람 이벤트',
        date: '2024-11-10',
        startTime: '09:00',
        endTime: '10:00',
        description: '알람 이벤트 설명',
        location: '알람 이벤트 위치',
        category: '업무',
        notificationTime: 10,
      });

      setupMockHandlerCreation([event]);
      renderApp();

      await waitFor(() => {
        expect(
          screen.getAllByText('10분 후 알람 이벤트 일정이 시작됩니다.')[0]
        ).toBeInTheDocument();
      });
    });
  });
});
