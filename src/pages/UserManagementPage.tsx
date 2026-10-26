import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { User, UserRole, CommitteeSpecialty } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { Users2, Plus, Edit2, Trash2, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('committee');
  const [specialty, setSpecialty] = useState<CommitteeSpecialty>('education');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');

  const { showSuccess, showError } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      showError('Error', 'No se pudieron cargar los usuarios.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('committee');
    setSpecialty('education');
    setInstitution('');
    setPhone('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setSpecialty(u.specialty || 'education');
    setInstitution(u.institution || '');
    setPhone(u.phone || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userApi.update(editingUser.id, {
          name: name.trim(),
          email: email.trim(),
          role,
          specialty: role === 'committee' ? specialty : undefined,
          institution: institution.trim(),
          phone: phone.trim(),
        });
        showSuccess('Usuario actualizado', `Los datos de ${name} han sido guardados.`);
      } else {
        await userApi.create({
          name: name.trim(),
          email: email.trim(),
          role,
          specialty: role === 'committee' ? specialty : undefined,
          institution: institution.trim(),
          phone: phone.trim(),
          avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?w=150`,
        });
        showSuccess('Usuario creado', `Se agregó a ${name} al sistema.`);
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      showError('Error al guardar', err.message);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await userApi.delete(userToDelete.id);
      showSuccess('Usuario eliminado', `Se retiró el usuario ${userToDelete.name}.`);
      setUserToDelete(null);
      loadUsers();
    } catch (err: any) {
      showError('Error al eliminar', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Administración' }, { label: 'Gestión de Usuarios' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-calm-600" />
            <span>Gestión de Usuarios y Comités Especialistas</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administración de credenciales, roles asignados y especialidades (Educación, Psicología, Finanzas).
          </p>
        </div>

        <Button onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Nuevo Usuario
        </Button>
      </div>

      <div className="card-calm overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Usuario</th>
                <th className="p-4">Rol en el Sistema</th>
                <th className="p-4">Especialidad de Dictamen</th>
                <th className="p-4">Institución / Dependencia</th>
                <th className="p-4">Contacto</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                        <p className="text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge role={u.role} />
                  </td>
                  <td className="p-4">
                    {u.specialty ? (
                      <Badge specialty={u.specialty} />
                    ) : (
                      <span className="text-slate-400 italic">No aplica (Admin / Viewer)</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-700 font-medium">
                    {u.institution || '—'}
                  </td>
                  <td className="p-4 text-slate-500">
                    {u.phone || '—'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-slate-400 hover:text-calm-700 hover:bg-slate-100 rounded-lg"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Lic. Sofia Morales"
            required
          />

          <Input
            label="Correo electrónico institucional"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="smorales@neuroparque.org"
            required
          />

          <Select
            label="Rol asignado"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { value: 'admin', label: 'Administrador (Control total del sistema)' },
              { value: 'committee', label: 'Comité Técnico (Dictamina su especialidad)' },
              { value: 'viewer', label: 'Observador (Solo lectura)' },
            ]}
          />

          {role === 'committee' && (
            <Select
              label="Especialidad técnica del comité"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as CommitteeSpecialty)}
              options={[
                { value: 'education', label: 'Educación (Pedagogía e inclusión formativa)' },
                { value: 'psychology', label: 'Psicología (Salud sensorial y emocional)' },
                { value: 'finance', label: 'Finanzas (Presupuesto y compras)' },
              ]}
              helperText="El integrante solo podrá validar los requisitos de esta disciplina."
            />
          )}

          <Input
            label="Institución o Dependencia"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Ej: Facultad de Psicología UABC / DIF Ensenada"
          />

          <Input
            label="Teléfono de contacto"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="646-123-4567"
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar usuario?"
        message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar definitivamente"
      />
    </div>
  );
};
