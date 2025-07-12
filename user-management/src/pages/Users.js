import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  AppBar,
  Toolbar,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import TableViewIcon from '@mui/icons-material/TableView';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import UserTable from '../components/UserTable';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { logout } from '../redux/slices/authSlice';
import {
  fetchUsers,
  addUser,
  editUser,
  removeUser,
  toggleViewMode,
  setSearchQuery,
  selectFilteredUsers,
} from '../redux/slices/userSlice';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    loading,
    error,
    viewMode,
    currentPage,
    totalPages,
  } = useSelector((state) => state.users);
  
  const filteredUsers = useSelector(selectFilteredUsers);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, currentPage]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handlePageChange = (_, page) => {
    dispatch(fetchUsers(page));
  };



  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOpenForm = (user = null) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedUser(null);
    setFormOpen(false);
  };

  const handleSubmitForm = async (userData) => {
    if (selectedUser) {
      await dispatch(editUser({ id: selectedUser.id, userData }));
    } else {
      await dispatch(addUser(userData));
    }
    handleCloseForm();
  };

  const handleOpenDeleteConfirm = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await dispatch(removeUser(userToDelete.id));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      dispatch(toggleViewMode());
    }
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Typography sx={{ color: 'white', mr: 2 }}>
            John Doe
          </Typography>
          <IconButton
            onClick={handleLogout}
            sx={{ color: 'white' }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 0, fontWeight: 600 }}>
            Users
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <TextField
            size="small"
            placeholder="Search..."
            onChange={(e) => handleSearch(e)}
            sx={{
              borderRadius: 1,
              width: '300px',
              mr: 2
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained"
            onClick={() => handleOpenForm()}
          >
            Create User
          </Button>
        </Box>
      </Box>
      <Container maxWidth= "false" sx={{ pb: 5 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="View mode"
          size="small"
          color="primary"
        >
          <ToggleButton value="table" aria-label="Table View"  sx={{ textTransform: 'none' }}  >
            <TableViewIcon sx={{ marginRight: 1 }} />
            Table
          </ToggleButton>
          <ToggleButton value="card" aria-label="Card View"  sx={{ textTransform: 'none' }}  >
            <ViewListIcon sx={{ marginRight: 1 }} />
            Card
          </ToggleButton>
        </ToggleButtonGroup>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ my: 2 }}>
            {error}
          </Typography>
        ) : viewMode === 'table' ? (
          <UserTable
            users={filteredUsers}
            onEdit={handleOpenForm}
            onDelete={handleOpenDeleteConfirm}
          />
        ) : (
          <Grid container spacing={2}>
            {filteredUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <UserCard
                  user={user}
                  onEdit={handleOpenForm}
                  onDelete={handleOpenDeleteConfirm}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <UserForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          initialData={selectedUser}
        />

        <ConfirmDialog
          open={deleteConfirmOpen}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete?.first_name} ${userToDelete?.last_name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmOpen(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </Container>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          bgcolor: 'background.paper',
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          boxShadow: 3,
          zIndex: 1201,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Users;
