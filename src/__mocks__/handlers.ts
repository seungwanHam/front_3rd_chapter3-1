import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { events as initialEvents } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.

// 기본 events 배열을 초기 데이터로 설정
export let events = [...initialEvents] as Event[];

// GET 요청 핸들러
export const getEventsHandler = http.get('/api/events', () => {
  return HttpResponse.json({ events });
});

// POST 요청 핸들러 - 새로운 이벤트 생성
export const postEventHandler = http.post('/api/events', async ({ request }) => {
  const newEvent = (await request.json()) as Event;
  newEvent.id = newEvent.id || String(events.length + 1);
  events.push(newEvent);
  return HttpResponse.json(newEvent, { status: 201 });
});

// PUT 요청 핸들러 - 기존 이벤트 업데이트
export const putEventHandler = http.put('/api/events/:id', async ({ request, params }) => {
  const { id } = params;
  const updatedEvent = (await request.json()) as Event;
  const index = events.findIndex((event) => event.id === id);

  if (index === -1) {
    return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
  }

  events[index] = { ...events[index], ...updatedEvent };
  return HttpResponse.json(events[index]);
});

// DELETE 요청 핸들러 - 기존 이벤트 삭제
export const deleteEventHandler = http.delete('/api/events/:id', ({ params }) => {
  const { id } = params;
  events = events.filter((event) => event.id !== id);
  return HttpResponse.json(null, { status: 204 });
});

// 기본 핸들러 배열
export const handlers = [getEventsHandler, postEventHandler, putEventHandler, deleteEventHandler];
