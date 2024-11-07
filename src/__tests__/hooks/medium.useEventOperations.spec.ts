import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  resetMockEvents,
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';

const mockToast = vi.fn();
vi.mock('@chakra-ui/react', () => ({
  useToast: () => mockToast,
}));

afterEach(() => {
  mockToast.mockClear();
  resetMockEvents;
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => expect(result.current.events).toHaveLength(1));

  expect(result.current.events).toEqual([
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
  expect(mockToast).toHaveBeenCalledWith({
    title: '일정 로딩 완료!',
    status: 'info',
    duration: 1000,
  });
});

// 정의된 이벤트 정보를 기준으로 적절하게 저장이 된다
it('새로운 이벤트를 추가하고 성공 토스트가 호출된다', async () => {
  setupMockHandlerCreation();

  const newEvent: Event = {
    id: '1234',
    title: '신규 이벤트',
    date: '2024-11-06',
    startTime: '10:00',
    endTime: '11:00',
    description: '신규 이벤트 설명',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.saveEvent(newEvent);
  });

  expect(result.current.events).toContainEqual(newEvent);
  expect(mockToast).toHaveBeenCalledWith({
    title: '일정이 추가되었습니다.',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });
});

// '새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다'
it('이벤트를 업데이트하고 성공 토스트가 호출된다', async () => {
  setupMockHandlerUpdating();

  const updatedEvent: Event = {
    id: '1',
    title: '업데이트된 회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '12:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useEventOperations(true));

  await act(async () => {
    await result.current.saveEvent(updatedEvent);
  });

  waitFor(() => {
    expect(result.current.events).toContainEqual(updatedEvent);
    expect(mockToast).toHaveBeenCalledWith({
      title: '일정이 수정되었습니다.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  });
});

// 존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다
it('존재하는 이벤트를 삭제하고 성공 토스트가 호출된다', async () => {
  setupMockHandlerDeletion();

  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  waitFor(() => {
    expect(result.current.events).toEqual([]);
    expect(mockToast).toHaveBeenCalledWith({
      title: '일정이 삭제되었습니다.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ message: '이벤트 로딩 실패' }, { status: 500 });
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(result.current.events).toEqual([]);
    expect(mockToast).toHaveBeenCalledWith({
      title: '이벤트 로딩 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});

// 존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다
it("존재하지 않는 이벤트 수정 시 '일정 저장 실패' 에러 토스트가 표시된다", async () => {
  setupMockHandlerUpdating();

  const nonExistentEvent: Event = {
    id: '999',
    title: '존재하지 않는 이벤트',
    date: '2024-11-01',
    startTime: '09:00',
    endTime: '10:00',
    description: '에러 테스트용',
    location: '회의실 C',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useEventOperations(true));

  await act(async () => {
    await result.current.saveEvent(nonExistentEvent);
  });

  expect(result.current.events).not.toContainEqual(nonExistentEvent);
  expect(mockToast).toHaveBeenCalledWith({
    title: '일정 저장 실패',
    status: 'error',
    duration: 3000,
    isClosable: true,
  });
});

// 네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다
it("네트워크 오류 시 '일정 삭제 실패' 에러 토스트가 표시된다", async () => {
  server.use(
    http.delete('/api/events/:id', () => {
      return HttpResponse.error();
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  await result.current.deleteEvent('1');

  await waitFor(() => {
    expect(mockToast).toHaveBeenCalledWith({
      title: '일정 삭제 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});
