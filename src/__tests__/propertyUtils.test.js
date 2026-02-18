import { calculateMonthlyIncome, getUpcomingEvents } from '../utils/propertyUtils';

describe('property utils', () => {
  it('calculates monthly income for contracted tenancies only', () => {
    const tenancies = [
      { status: 'Contracted', monthlyCost: '500' },
      { status: 'Available', monthlyCost: '300' },
      { status: 'Contracted', monthlyCost: '1200.50' },
    ];

    expect(calculateMonthlyIncome(tenancies)).toBe(1700.5);
  });

  it('returns upcoming events sorted by end date', () => {
    const properties = [
      {
        name: 'A',
        tenancies: [
          {
            type: 'Room 1',
            tenantName: 'One',
            status: 'Contracted',
            contractStartDate: '2026-01-01',
            contractDuration: '12',
          },
          {
            type: 'Room 2',
            tenantName: 'Two',
            status: 'Available',
            contractStartDate: '',
            contractDuration: '',
          },
        ],
      },
      {
        name: 'B',
        tenancies: [
          {
            type: 'Room 3',
            tenantName: 'Three',
            status: 'Contracted',
            contractStartDate: '2026-02-01',
            contractDuration: '6',
          },
        ],
      },
    ];

    const events = getUpcomingEvents(properties);

    expect(events).toHaveLength(2);
    expect(events[0].propertyName).toBe('B');
    expect(events[1].propertyName).toBe('A');
  });
});
