import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UserContextType {
  profilePic: string;
  setProfilePic: (uri: string) => void;
}

const defaultPic = 'https://randomuser.me/api/portraits/men/3.jpg'; // fallback/default

const UserContext = createContext<UserContextType>({
  profilePic: defaultPic,
  setProfilePic: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profilePic, setProfilePic] = useState<string>(defaultPic);

  return (
    <UserContext.Provider value={{ profilePic, setProfilePic }}>
      {children}
    </UserContext.Provider>
  );
}; 