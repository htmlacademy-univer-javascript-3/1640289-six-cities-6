import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { store } from '../store';

type StateType = ReturnType<typeof store.getState>;
type AppDispatchType = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatchType>();
export const useAppSelector: TypedUseSelectorHook<StateType> = useSelector;
