let store: { [x: string]: string | null } = {
  role: 'scadmin',
  rolePermissions:
    '{"view":["Story","Posts","AppVersion","Users","AdminUsers","ScheduledJobs","Community","AdminActivity","Content","Matrix"],"edit":["Story","Posts","Users","AdminUsers","ScheduledJobs","AdminActivity"],"delete":["Story","Posts","Users","AdminUsers","ScheduledJobs"]}'
};

export const mockLocalStorage = {
  getItem: (key: string): string | null => {
    return key in store ? store[key] : null;
  },
  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  }
};
