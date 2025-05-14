import { toast, ToastOptions } from 'react-toastify';
import { AiOutlineCheck, AiOutlineWarning, AiOutlineClose } from 'react-icons/ai';
import React from 'react';

interface CustomNotificationProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  gradientColor: string;
}

const CustomNotification = ({
  title,
  description,
  icon,
  gradientColor,
}: CustomNotificationProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      gap: '16px',
      background: `linear-gradient(to right, ${gradientColor} 55%, white)`,
      boxShadow:
        '0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.2)',
      borderRadius: '12px',
      color: '#FFFFFF',
      minWidth: '343px',
    }}
  >
    <div
      style={{
        backgroundColor: gradientColor,
        color: '#fff',
        borderRadius: '50%',
        padding: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        flexShrink: 0,
        border: '3px solid white',
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontWeight: 'bold 500px', fontSize: '15px' }}>{title}</div>
      {description && <div style={{ fontSize: '13px', marginTop: 4 }}>{description}</div>}
    </div>
  </div>
);

const baseOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  closeButton: false,
  style: { background: 'transparent', boxShadow: 'none' },
};

export const showSuccessNotification = (title: string, description?: string) =>
  toast(
    <CustomNotification
      title={title}
      description={description}
      icon={<AiOutlineCheck size={20} />}
      gradientColor="rgb(11, 225, 0)"
    />,
    baseOptions
  );

export const showWarningNotification = (title: string, description?: string) =>
  toast(
    <CustomNotification
      title={title}
      description={description}
      icon={<AiOutlineWarning size={18} />}
      gradientColor="rgb(255, 191, 0)"
    />,
    baseOptions
  );

export const showErrorNotification = (title: string, description?: string) =>
  toast(
    <CustomNotification
      title={title}
      description={description}
      icon={<AiOutlineClose size={18} />}
      gradientColor="rgb(241, 30, 37)"
    />,
    baseOptions
  );
