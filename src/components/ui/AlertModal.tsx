import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

type AlertModalProps = {
  open: boolean;
  title: string;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
};

const AlertModal: React.FC<AlertModalProps> = ({ 
  open, 
  title, 
  message, 
  severity = 'info',
  onClose 
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#2196f3';
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ color: getSeverityColor() }}>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
