'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { useOrganization } from '~/app/_components/OrganizationContext';

export default function CategoriesPage() {
  const { organization } = useOrganization();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; description: string | null } | null>(null);

  const { data: categories, refetch: refetchCategories } = api.category.list.useQuery(
    { organizationId: organization.id },
    { enabled: !!organization.id },
  );

  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      setCategoryName('');
      setCategoryDescription('');
      void refetchCategories();
    },
  });

  const updateCategory = api.category.update.useMutation({
    onSuccess: () => {
      setEditingCategory(null);
      setCategoryName('');
      setCategoryDescription('');
      void refetchCategories();
    },
  });

  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      void refetchCategories();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory.id,
        name: categoryName,
        description: categoryDescription,
        organizationId: organization.id,
      });
    } else {
      createCategory.mutate({
        name: categoryName,
        description: categoryDescription,
        organizationId: organization.id,
      });
    }
  };

  const handleEdit = (category: { id: string; name: string; description: string | null }) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description ?? '');
  };

  const handleDelete = (categoryId: string) => {
    deleteCategory.mutate({ id: categoryId, organizationId: organization.id });
  };

  if (!organization.id) {
    return <div>Loading organization...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Categories for {organization.name}</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{editingCategory ? 'Edit Category' : 'Create New Category'}</h2>
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="categoryName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            id="categoryDescription"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingCategory ? 'Update Category' : 'Create Category'}
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setCategoryName('');
              setCategoryDescription('');
            }}
            className="ml-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
      {categories?.length === 0 ? (
        <p>No categories found. Create one above!</p>
      ) : (
        <ul className="space-y-4">
          {categories?.map((category) => (
            <li key={category.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">{category.name}</p>
                {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(category)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
