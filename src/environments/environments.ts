export const environment = {
    // URL backend của bạn
    baseUrl: 'http://localhost:8080',
  
    // Gom tất cả endpoint để tái sử dụng
    endpoints: {
      auth: {
        login: '/auth/login',
        me: '/auth/me',
      },
      users: '/api/users',
      employees: '/api/employees',
      languages: '/api/languages',
      certificates: '/api/certificates',
    },
  
    debug: false,
  };
  export type Environment = typeof environment;