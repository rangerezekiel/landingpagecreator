import { useAuthStore } from "@/stores/auth";

export const useAcl = () => {
  const roles = useAuthStore(state => state.roles);
  const permissions = useAuthStore(state => state.permissions);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const isLoading = isAuthenticated === null || roles.length === 0 || permissions.length === 0;

  const hasRole = (requiredRoles: string[]): boolean => {
    if (!isAuthenticated) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.some(role => roles.includes(role));
  };

  const hasPermission = (requiredPermissions: string[]): boolean => {
    if (!isAuthenticated) return false;
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const canAccess = ({
    requiredRoles = [],
    requiredPermissions = [],
  }: {
    requiredRoles?: string[];
    requiredPermissions?: string[];
  }): boolean => {
    if (!isAuthenticated) return false;

    const hasAnyRequiredRole = requiredRoles.length === 0 || hasRole(requiredRoles);
    const hasAnyRequiredPermission = requiredPermissions.length === 0 || hasPermission(requiredPermissions);

    return hasAnyRequiredRole && hasAnyRequiredPermission;
  };

  return {
    isAuthenticated,
    roles,
    permissions,
    hasRole,
    hasPermission,
    canAccess,
    isLoading,
  };
};


// EXAMPLE

// const { hasRole, hasPermission, canAccess } = useAcl();
//  return (
//     <div>
//       <h1>Selamat Datang di Dashboard Admin</h1>

//       {hasRole(['superdev', 'admin']) && (
//         <button className="bg-blue-500 text-white p-2 rounded">
//           Kelola Pengaturan Sistem
//         </button>
//       )}

//       {hasPermission(['user-store']) && (
//         <button className="bg-green-500 text-white p-2 rounded ml-2">
//           Tambah Pengguna Baru
//         </button>
//       )}

//       {hasPermission(['user-delete-permanently']) && (
//         <button className="bg-red-500 text-white p-2 rounded ml-2">
//           Hapus Pengguna Permanen
//         </button>
//       )}

//       {canAccess({ requiredRoles: ['editor'], requiredPermissions: ['post-create', 'post-edit'] }) && (
//         <div className="mt-4 p-4 border rounded">
//           <h3>Area Editor Konten</h3>
//           <p>Anda bisa membuat atau mengedit postingan.</p>
//         </div>
//       )}

//       {canAccess({ requiredPermissions: ['user-index-with-trash'] }) && (
//         <div className="mt-4 p-4 border rounded">
//           <h3>Lihat Pengguna (dengan sampah)</h3>
//           <p>Dapat melihat semua pengguna termasuk yang dihapus sementara.</p>
//         </div>
//       )}

//       {canAccess({ requiredRoles: ['guest'] }) && (
//         <p className="mt-4">Ini adalah konten yang bisa dilihat oleh peran 'guest'.</p>
//       )}

//       {!canAccess({ requiredRoles: ['admin'] }) && (
//         <p className="mt-4 text-gray-500">Anda tidak memiliki akses sebagai administrator.</p>
//       )}
//     </div>
//   );