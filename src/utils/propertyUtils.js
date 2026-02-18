export const calculateMonthlyIncome = (tenancies) => {
  return (tenancies || [])
    .filter((item) => item.status === 'Contracted')
    .reduce((sum, item) => sum + (parseFloat(item.monthlyCost) || 0), 0);
};

export const getUpcomingEvents = (properties) => {
  const events = [];
  (properties || []).forEach((property) => {
    (property.tenancies || []).forEach((tenancy) => {
      if (tenancy.status === 'Contracted' && tenancy.contractStartDate && tenancy.contractDuration) {
        const startDate = new Date(tenancy.contractStartDate);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + parseInt(tenancy.contractDuration, 10), startDate.getDate());
        if (!Number.isNaN(endDate.getTime())) {
          events.push({
            propertyName: property.name,
            tenancyType: tenancy.type,
            tenantName: tenancy.tenantName,
            endDate,
            endDateFormatted: endDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }),
          });
        }
      }
    });
  });

  return events.sort((left, right) => left.endDate - right.endDate);
};
