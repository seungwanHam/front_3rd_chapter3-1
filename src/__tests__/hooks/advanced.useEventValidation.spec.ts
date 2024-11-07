import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

const mockToast = vi.fn();
vi.mock('@chakra-ui/react', () => ({
  useToast: () => mockToast,
}));

import { useEventValidation } from '../../hooks/useEventValidation';

describe('useEventValidation', () => {
  beforeEach(() => {
    mockToast.mockClear();
  });

  it('모든 필수 필드가 있고 에러가 없을 때 true를 반환해야 합니다', () => {
    const { result } = renderHook(() => useEventValidation());

    const isValid = result.current.validateEventForm(
      '테스트 제목',
      '2024-11-08',
      '09:00',
      '10:00',
      null,
      null
    );

    expect(isValid).toBe(true);
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('필수 정보가 없을 때 false를 반환하고 에러 토스트를 표시해야 합니다', () => {
    const { result } = renderHook(() => useEventValidation());

    const isValid = result.current.validateEventForm(
      null,
      '2024-11-08',
      '09:00',
      '10:00',
      null,
      null
    );

    expect(isValid).toBe(false);
    expect(mockToast).toHaveBeenCalledWith({
      title: '필수 정보를 모두 입력해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });

  it('시간 에러가 있을 때 false를 반환하고 에러 토스트를 표시해야 합니다', () => {
    const { result } = renderHook(() => useEventValidation());

    const isValid = result.current.validateEventForm(
      '테스트 제목',
      '2024-11-08',
      '09:00',
      '10:00',
      '시간 에러',
      null
    );

    expect(isValid).toBe(false);
    expect(mockToast).toHaveBeenCalledWith({
      title: '시간 설정을 확인해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});
