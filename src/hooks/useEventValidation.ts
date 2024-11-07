import { useToast } from '@chakra-ui/react';

export function useEventValidation() {
  const toast = useToast();

  const validateEventForm = (
    title: string | null,
    date: string | null,
    startTime: string | null,
    endTime: string | null,
    startTimeError: string | null,
    endTimeError: string | null
  ) => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  return { validateEventForm };
}
