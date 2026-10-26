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
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
      showSuccess('Usuario eliminado', `Se retiró a ${userToDelete.name}.`);
      setUserToDelete(null);
      loadUsers();
    } catch (err: any) {
      showError('Error al eliminar', err.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando directorio de usuarios y comités..." />;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Administración' }, { label: 'Gestión de Usuarios' }]} />

      <div className="w3-padding-24" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <div className="w3-row">
          <div className="w3-col l8 m8 s12">
            <h1 className="w3-xxlarge w3-wide" style={{ margin: '4px 0', fontWeight: 'bold' }}>
              <i className="fa fa-users w3-margin-right"></i>
              GESTIÓN DE USUARIOS Y COMITÉS
            </h1>
            <p className="w3-text-grey" style={{ margin: '4px 0 0 0', lineHeight: '1.6' }}>
              Control de acceso y asignación de especialistas para dictámenes técnicos de educación, psicología y finanzas.
            </p>
          </div>

          <div className="w3-col l4 m4 s12 w3-right-align w3-margin-top">
            <Button variant="primary" onClick={openCreateModal} leftIcon={<i className="fa fa-plus"></i>}>
              Nuevo Usuario
            </Button>
          </div>
        </div>
      </div>

      <div className="w3-border w3-white w3-responsive w3-margin-bottom" style={{ borderColor: '#e5e7eb' }}>
        <table className="w3-table w3-striped w3-bordered">
          <thead>
            <tr className="w3-dark-grey">
              <th>Usuario</th>
              <th>Rol en el Sistema</th>
              <th>Especialidad de Dictamen</th>
              <th>Institución / Dependencia</th>
              <th>Contacto</th>
              <th className="w3-right-align">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ verticalAlign: 'middle' }}>
                  <b>{u.name}</b>
                  <div className="w3-tiny w3-text-grey">{u.email}</div>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <Badge role={u.role} />
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  {u.specialty ? (
                    <Badge specialty={u.specialty} />
                  ) : (
                    <span className="w3-text-grey w3-small" style={{ fontStyle: 'italic' }}>No aplica</span>
                  )}
                </td>
                <td style={{ verticalAlign: 'middle' }} className="w3-small">
                  {u.institution || '—'}
                </td>
                <td style={{ verticalAlign: 'middle' }} className="w3-small">
                  {u.phone || '—'}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(u)}
                    className="w3-button w3-light-grey w3-small"
                    title="Editar"
                    style={{ marginRight: '4px' }}
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserToDelete(u)}
                    className="w3-button w3-hover-red w3-light-grey w3-small"
                    title="Eliminar"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        maxWidth="md"
      >
        <form onSubmit={handleSave}>
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

          <div className="w3-bar w3-margin-top" style={{ textAlign: 'right' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} style={{ marginRight: '8px' }}>
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
