import { useEffect, useState, useCallback } from 'react';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Search, Trash2, Shield, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    userAPI.getAll({ search, role: roleFilter, page, limit: 10 })
      .then(r => { setUsers(r.data.users); setTotalPages(r.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, roleFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user ${name}? This cannot be undone.`)) return;
    try {
      await userAPI.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      await userAPI.updateUser(id, { role });
      toast.success('Role updated');
      setEditUser(null);
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">Manage Users</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input pl-9" placeholder="Search name or email…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input max-w-[180px]" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">All Roles</option>
          <option value="member">Members</option>
          <option value="trainer">Trainers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-850 border-b border-white/8">
                <tr>
                  {['User', 'Email', 'Role', 'Gender', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-gray-500 py-10">No users found.</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className="hover:bg-white/2">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs flex-shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-gray-400">{u.email}</td>
                    <td className="table-cell">
                      <span className={`badge capitalize ${u.role === 'admin' ? 'badge-red' : u.role === 'trainer' ? 'badge-blue' : 'badge-green'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="table-cell capitalize">{u.gender ?? '—'}</td>
                    <td className="table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditUser(u)} className="text-gray-400 hover:text-brand-400 transition-colors p-1" title="Edit role">
                          <Shield size={15} />
                        </button>
                        <button onClick={() => handleDelete(u._id, u.name)} className="text-gray-400 hover:text-red-400 transition-colors p-1" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-white/8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white bg-dark-850'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Update User Role" size="sm">
        {editUser && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Change role for <strong className="text-white">{editUser.name}</strong></p>
            <div className="space-y-2">
              {['member', 'trainer', 'admin'].map(role => (
                <button key={role} onClick={() => handleUpdateRole(editUser._id, role)}
                  className={`w-full p-3 rounded-xl border text-left capitalize font-medium text-sm transition-all ${
                    editUser.role === role
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-white/8 text-gray-300 hover:border-white/20 hover:bg-white/5'
                  }`}>
                  {role === 'admin' ? '👑' : role === 'trainer' ? '💪' : '🏃'} {role}
                  {editUser.role === role && <span className="ml-2 text-xs text-gray-500">(current)</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
