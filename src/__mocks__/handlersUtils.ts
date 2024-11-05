import { server } from '../setupTests';
import {
  getEventsHandler,
  postEventHandler,
  putEventHandler,
  deleteEventHandler,
  events as baseEvents,
} from './handlers';
import { Event } from '../types';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.

// 초기 상태로 이벤트 목록을 리셋하는 함수
export const resetMockEvents = (initEvents = [...baseEvents] as Event[]) => {
  baseEvents.length = 0;
  baseEvents.push(...initEvents);
};

// 테스트에 필요한 특정 CRUD 동작만 모킹하도록 설정하는 함수들
export const setupMockHandlerCreation = () => {
  resetMockEvents();
  server.use(getEventsHandler, postEventHandler);
};

export const setupMockHandlerUpdating = () => {
  resetMockEvents();
  server.use(getEventsHandler, putEventHandler);
};

export const setupMockHandlerDeletion = () => {
  resetMockEvents();
  server.use(getEventsHandler, deleteEventHandler);
};
