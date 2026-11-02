import type { FC, ReactNode } from 'react';

import './StateScreen.css';

interface StateScreenProps {
  title: string;
  description?: string;
  action?: ReactNode;
  theme?: 'light' | 'dark';
}

export const StateScreen: FC<StateScreenProps> = ({
  title,
  description,
  action,
  theme = 'light',
}) => (
  <div className={`stateScreen stateScreen_${theme}`}>
    <div className="stateScreenTitle">{title}</div>
    {description ? <p className="stateScreenText">{description}</p> : null}
    {action ? <div className="stateScreenAction">{action}</div> : null}
  </div>
);
