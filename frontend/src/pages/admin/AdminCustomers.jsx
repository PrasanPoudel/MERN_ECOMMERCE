import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../store/slices/adminSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { RiGroupLine } from 'react-icons/ri';
import { FaRegUser } from "react-icons/fa";

export default function AdminCustomers() {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchCustomers()); }, [dispatch]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Customers</h1>
        <p className="text-sm text-zinc-400 mt-0.5">{customers.length} registered customers</p>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                <RiGroupLine size={24} className="text-zinc-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-600">No customers yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {['Customer', 'Email', 'Addresses', 'Joined'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
                           <FaRegUser size={16} className="text-zinc-400" />
                          </div>
                          <span className="font-medium text-zinc-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-500">{c.email}</td>
                      <td className="px-5 py-4 text-zinc-500">{c.addresses?.length || 0}</td>
                      <td className="px-5 py-4 text-zinc-400 text-xs">{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
