import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ToastProps {
  kind?: 'error' | 'success' | 'info';
  onClose?: () => void;
}

export const Toast = ({
  kind = 'info',
  onClose,
  children,
}: React.PropsWithChildren<ToastProps>) => {
  const kindToClassMap = {
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    info: 'bg-sky-300 text-gray-500',
  };

  return (
    <div
      id="toast-default"
      className={`flex items-center p-4 w-full fixed top-6 max-w-xs ${kindToClassMap[kind]} rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`}
      role="alert"
    >
      <div className="ml-3 text-sm font-normal">{children}</div>
      {onClose && (
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 ${kindToClassMap[kind]} hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 pt-2 pl-2.5 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
          data-dismiss-target="#toast-default"
          aria-label="Close"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      )}
    </div>
  );
};
