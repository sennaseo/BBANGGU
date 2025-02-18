export const PACKAGE_STEPS = {
  GUIDE: 1,
  CAMERA: 2,
  PREVIEW: 3,
  DETAILS: 4,
  PACKING: 5,
  CONFIRM: 6
} as const;

export const TOTAL_PACKAGE_STEPS = 6;

export const STEP_TITLES = {
  [PACKAGE_STEPS.GUIDE]: '촬영 가이드',
  [PACKAGE_STEPS.CAMERA]: '사진 촬영',
  [PACKAGE_STEPS.PREVIEW]: '미리보기',
  [PACKAGE_STEPS.DETAILS]: '상세 정보',
  [PACKAGE_STEPS.PACKING]: '포장 안내',
  [PACKAGE_STEPS.CONFIRM]: '최종 확인',
} as const;