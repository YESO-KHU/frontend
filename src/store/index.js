import { configureStore } from '@reduxjs/toolkit';

const dummyReducer = (state = {}, action) => {
  return state;
};

 
export const store = configureStore({
  reducer: {
    // 여기에 리듀서들을 추가하세요
    dummy: dummyReducer,
  },
});   