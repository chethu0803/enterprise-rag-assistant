const AdminOnlyNotice = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border border-red-300 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
        <p className="text-slate-700">This page is accessible to admins only.</p>
      </div>
    </div>
  );
};

export default AdminOnlyNotice;
