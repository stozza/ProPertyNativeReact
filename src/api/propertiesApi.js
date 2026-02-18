const buildUrl = (baseUrl, path) => `${baseUrl.replace(/\/$/, '')}${path}`;

const normalizePropertiesData = (data) => {
  return (data || []).map((property) => ({
    ...property,
    propertyId: property.propertyId ?? property.id,
    tenancies: (property.tenancies || []).map((tenancy) => ({
      ...tenancy,
      tenancyId: tenancy.tenancyId ?? tenancy.id,
    })),
  }));
};

const request = async (baseUrl, path, options = {}) => {
  const response = await fetch(buildUrl(baseUrl, path), {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const fetchProperties = async (baseUrl) => {
  const data = await request(baseUrl, '/properties');
  return normalizePropertiesData(data);
};

export const addProperty = async (baseUrl, propertyPayload) => {
  return request(baseUrl, '/properties', {
    method: 'POST',
    body: JSON.stringify(propertyPayload),
  });
};

export const updateProperty = async (baseUrl, propertyId, propertyPayload) => {
  return request(baseUrl, `/properties/${propertyId}`, {
    method: 'PUT',
    body: JSON.stringify(propertyPayload),
  });
};

export const deleteProperty = async (baseUrl, propertyId) => {
  return request(baseUrl, `/properties/${propertyId}`, {
    method: 'DELETE',
  });
};

export const addTenancy = async (baseUrl, propertyId, tenancyPayload) => {
  return request(baseUrl, `/properties/${propertyId}/tenancies`, {
    method: 'POST',
    body: JSON.stringify(tenancyPayload),
  });
};

export const updateTenancy = async (baseUrl, propertyId, tenancyId, tenancyPayload) => {
  return request(baseUrl, `/properties/${propertyId}/tenancies/${tenancyId}`, {
    method: 'PUT',
    body: JSON.stringify(tenancyPayload),
  });
};

export const deleteTenancy = async (baseUrl, propertyId, tenancyId) => {
  return request(baseUrl, `/properties/${propertyId}/tenancies/${tenancyId}`, {
    method: 'DELETE',
  });
};
