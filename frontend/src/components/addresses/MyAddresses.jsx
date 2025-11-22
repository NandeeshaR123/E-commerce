import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddresses } from '../../hooks/useAddresses';
import AddressForm from './AddressForm';
import Loading from '../shared/Loading';
import Error from '../shared/Error';

const MyAddresses = () => {
  const { addresses, loading, error, fetchAddresses, createAddress, updateAddress, deleteAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
      } else {
        await createAddress(formData);
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    try {
      await deleteAddress(addressId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete address');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && error.isAuthError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error.message} isAuthError={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Add New Address
          </button>
        )}
      </div>

      {error && !error.isAuthError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error.message}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <AddressForm
            address={editingAddress}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={formLoading}
          />
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">You have no addresses yet.</p>
              <button
                onClick={handleCreate}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-primary-600 transition"
                >
                  {address.isDefault && (
                    <div className="mb-2">
                      <span className="inline-block bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                        DEFAULT
                      </span>
                    </div>
                  )}
                  <div className="space-y-2 mb-4 max-h-[150px] overflow-y-scroll">
                    <p className="font-semibold text-gray-900">{address.fullName}</p>
                    <p className="text-gray-700">{address.phone}</p>
                    <p className="text-gray-700">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-gray-700">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-700">{address.country}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyAddresses;



