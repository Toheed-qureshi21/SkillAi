// components/UserInitializer.tsx
'use client';

import { useAppDispatch } from '@/redux/hooks';
import { setUser, User } from '@/redux/userSlice';
import { ReactNode, useEffect } from 'react';


interface Props {
  initialUser: User | null;
  children: ReactNode;
}

export default function UserInitializer({ initialUser, children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialUser) dispatch(setUser(initialUser));
  }, [initialUser, dispatch]);

  return <>{children}</>;
}
