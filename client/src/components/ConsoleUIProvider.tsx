import { sharedAccessBundle } from 'header/AuthenticatedHeader';
import { PropsWithChildren, useEffect, useState } from 'react';

const ConsoleUIProvider = ({ children }: PropsWithChildren) => {
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    sharedAccessBundle.subscribe((parameters: any) => {
      if (parameters?.tenantId && parameters?.accessToken) {
        setIsFetched(true);
      }
    });
  }, [isFetched]);

  if (isFetched) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

export default ConsoleUIProvider;
