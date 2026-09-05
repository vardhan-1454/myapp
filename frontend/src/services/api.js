const API_BASE_URL = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    return {
      status: 'offline',
      database: { status: 'disconnected', error: error.message }
    };
  }
}

export async function fetchItems() {
  try {
    const res = await fetch(`${API_BASE_URL}/items`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function createItem(itemData) {
  try {
    const res = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateItem(id, itemData) {
  try {
    const res = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteItem(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}
