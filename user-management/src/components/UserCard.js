import React from 'react';
import {
  Card,
  Typography,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 260,
        height: 220,
        m: 1,
        '&:hover .overlay': {
          opacity: 1,
        },
      }}
    >
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 2,
        }}
      >
        <Avatar
          src={user.avatar}
          alt={`${user.first_name} ${user.last_name}`}
          sx={{ width: 80, height: 80, mb: 1 }}
        />
        <Typography variant="h6">{`${user.first_name} ${user.last_name}`}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Card>

      {/* Hover Overlay */}
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 1,
          opacity: 0,
          transition: 'opacity 0.3s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <IconButton
          sx={{ bgcolor: '#7b61ff', color: '#fff', '&:hover': { bgcolor: '#5e47d8' } }}
          onClick={() => onEdit(user)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          sx={{ bgcolor: '#f44336', color: '#fff', '&:hover': { bgcolor: '#d32f2f' } }}
          onClick={() => onDelete(user)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default React.memo(UserCard);
