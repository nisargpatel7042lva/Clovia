import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface StakeInfo {
  username: string;
  amount: number;
}

interface StakingContextType {
  staked: StakeInfo[];
  addStake: (stake: StakeInfo) => void;
}

const StakingContext = createContext<StakingContextType>({
  staked: [],
  addStake: () => {},
});

export const StakingProvider = ({ children }: { children: ReactNode }) => {
  const [staked, setStaked] = useState<StakeInfo[]>([]);

  const addStake = (stake: StakeInfo) => {
    setStaked(prev => [...prev, stake]);
  };

  return (
    <StakingContext.Provider value={{ staked, addStake }}>
      {children}
    </StakingContext.Provider>
  );
};

export const useStaking = () => useContext(StakingContext); 