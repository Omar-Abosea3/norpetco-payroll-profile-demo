// All data below was extracted from the actual source code of:
//   payroll-system/final-norpetco-backend-project
//   payroll-system/final-norpetco-frontend-project
// No endpoints, models, or dependencies are invented. Responses are
// simulated reproductions of real controller output shapes.

export const projectName = 'Norpetco Payroll & Accounting System'
export const projectTagline =
  'Production corporate payroll platform with LDAP/Active-Directory sign-in, Excel import pipelines, role-based permissions and an Arabic-first finance UI.'

export const apiBaseUrl = 'http://fin.norpetco.com:4000/api/v1'
export const localBaseUrl = 'http://localhost:4000/api/v1'

// ---------------------------------------------------------------- routes

export type RouteMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'

export interface RouteParam {
  name: string
  type: string
  required?: boolean
  description?: string
}

export interface ApiRoute {
  id: string
  method: RouteMethod
  path: string
  category: string
  summary: string
  auth: string
  roles: string[]
  params?: RouteParam[]
  example?: Record<string, unknown>
  response: Record<string, unknown>
  error: Record<string, unknown>
  sourceFile: string
}

export const routeCategories = [
  { id: 'auth', label: 'Authentication & Users' },
  { id: 'payroll', label: 'Monthly Payroll' },
  { id: 'bonus', label: 'Half-Month Bonus' },
  { id: 'allowances', label: 'Allowances' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'departments', label: 'Departments' },
  { id: 'profits', label: 'Yearly Profits' },
  { id: 'services', label: 'Services Details' },
  { id: 'notifications', label: 'Notifications' },
] as const

export const apiRoutes: ApiRoute[] = [
  {
    id: 'login',
    method: 'POST',
    path: '/users/login',
    category: 'auth',
    summary: 'Authenticate against Active Directory (LDAP) and issue a JWT.',
    auth: 'None',
    roles: ['public'],
    params: [
      { name: 'userName', type: 'string', required: true, description: 'AD sAMAccountName (e.g. j.doe)' },
      { name: 'password', type: 'string', required: true, description: 'AD password' },
    ],
    example: { userName: 'j.doe', password: '{AD password}' },
    response: {
      message: 'success',
      groups: ['Domain Users', 'Finance admin'],
      data: { userName: 'j.doe', adKey: '123456', role: 'admin' },
      token: '<jwt — expires in 1 day, stored in user.tokens[]>',
    },
    error: { message: 'Invalid credentials' },
    sourceFile: 'src/controllers/user.controller.ts · src/utils/authenticateUser.ts',
  },
  {
    id: 'logout',
    method: 'PATCH',
    path: '/users/logout',
    category: 'auth',
    summary: 'Invalidate the current JWT by removing it from the user tokens array.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    response: { message: 'user logged out successfully' },
    error: { message: 'Invalid session token', cause: 401 },
    sourceFile: 'src/controllers/user.controller.ts',
  },
  {
    id: 'profile',
    method: 'GET',
    path: '/users/profile',
    category: 'auth',
    summary: 'Admin: dashboard statistics for a period (uses dashboard provider).',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'type', type: 'query', description: 'monthly | half_month | yearly_profit' },
      { name: 'date', type: 'query', description: 'Month or year key to aggregate', required: false },
    ],
    response: {
      message: 'success',
      data: {
        monthlyData: [{ totalEmployees: 320, totalPayroll: 2450000, month: '2024-06' }],
        departmentData: [{ _id: 'Precast Department', totalEmployees: 64 }],
        totalEmployees: 320,
        totalPayroll: 2450000,
      },
    },
    error: { message: 'This role is not authorized', cause: 403 },
    sourceFile: 'src/controllers/user.controller.ts',
  },
  {
    id: 'dashboard-stats',
    method: 'GET',
    path: '/users/dashboard-stats',
    category: 'auth',
    summary: 'Admin: dashboard stats — total employees, payroll, monthly & department aggregation.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'type', type: 'query', description: 'monthly | half_month | yearly_profit', required: true },
    ],
    response: {
      message: 'success',
      data: {
        totalEmployees: 320,
        totalPayroll: 2450000,
        monthlyData: [
          { _id: '2024-06', totalEmployees: 310, totalPayroll: 2420000 },
        ],
        departmentData: [
          { _id: 'Precast', totalEmployees: 64, totalPayroll: 542000 },
        ],
      },
    },
    error: { message: 'This role is not authorized', cause: 403 },
    sourceFile: 'src/controllers/user.controller.ts',
  },
  {
    id: 'payroll-add',
    method: 'POST',
    path: '/monthly-payroll/add',
    category: 'payroll',
    summary: 'Upload an Excel/CVS sheet, validate every row with Joi and bulk-upsert payroll records.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Sheets must contain Arabic column headers (المرتب الاساسي, صافي الراتب …)' },
    ],
    response: {
      message: 'monthlyPayRoll added successfully',
      data: { insertedCount: 312, duplicateErrors: 3 },
    },
    error: {
      message: 'Please upload an Excel file',
      cause: 400,
    },
    sourceFile: 'src/controllers/monthelyPayRoll.controller.ts · src/middleware/excelValidationMiddleware.ts',
  },
  {
    id: 'payroll-all',
    method: 'GET',
    path: '/monthly-payroll/admin/all',
    category: 'payroll',
    summary: 'Admin: paginated payroll with search, sort and range filters (gt/gte/lt/lte).',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'page', type: 'query', description: 'Page number (default 1)' },
      { name: 'size', type: 'query', description: 'Page size (default 10)' },
      { name: 'searchKey', type: 'query', description: 'Text to search' },
      { name: 'searchFields', type: 'query', description: 'Columns to search against' },
      { name: 'sort', type: 'query', description: 'Sort order, e.g. { مرتب شهر: -1 }' },
      { name: 'مرتب شهر', type: 'query', description: 'Exact month key (YYYY-MM)' },
      { name: 'gt/gte/lt/lte', type: 'query', description: 'Numeric range filters on salary columns' },
    ],
    response: {
      message: 'success',
      data: [
        {
          pyempl: '1001',
          'المرتب الاساسي': 8500,
          'اجمالي الدخل': 10450,
          'صافي الراتب': 9780,
          'مرتب شهر': '2024-06',
        },
      ],
      totalCount: 310,
      size: 10,
      page: 1,
      totalPages: 31,
    },
    error: { message: 'This role is not authorized', cause: 403 },
    sourceFile: 'src/controllers/monthelyPayRoll.controller.ts · src/utils/apiFeatures.ts',
  },
  {
    id: 'payroll-id',
    method: 'GET',
    path: '/monthly-payroll/:id',
    category: 'payroll',
    summary: 'Employees or admins read one payroll month; rows are scoped to the caller adKey.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    params: [
      { name: 'id', type: 'path', required: true, description: 'Mongo _id of payroll record' },
      { name: 'profile', type: 'query', description: 'If "true", returns the scoped view without deducations trajectory' },
    ],
    response: {
      message: 'success',
      data: [
        {
          pyempl: '1001',
          'الرقم الوظيفي': '1001',
          'المرتب الاساسي': 8500,
          'صافي الراتب': 9780,
          'مرتب شهر': '2024-06',
          userName: 'j.doe',
          department: 'Precast Operations',
          deducations: [{ inlncd: 'SS', 'قيمة الخصم': 120.5, 'نوع الخصم': 'تأمينات' }],
          allowances: [{ code: 'TRANS', name_en: 'Transport', net: 400 }],
        },
      ],
    },
    error: { message: 'A valid month is required (YYYY-MM)', cause: 400 },
    sourceFile: 'src/controllers/monthelyPayRoll.controller.ts',
  },
  {
    id: 'bonus-add',
    method: 'POST',
    path: '/half-month-bonus/add',
    category: 'bonus',
    summary: 'Import a half-month bonus sheet; upsert keyed by {الرقم الوظيفي, month}.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Bonus sheet with Arabic headers' },
      { name: 'month', type: 'form', required: false, description: 'Month key; falls back to current month' },
    ],
    response: { message: 'half month bonus added successfully', data: { insertedCount: 300 } },
    error: { message: 'Please upload an excel sheet', cause: 400 },
    sourceFile: 'src/controllers/halfMonthBonus.controller.ts',
  },
  {
    id: 'bonus-filter',
    method: 'GET',
    path: '/half-month-bonus/filter',
    category: 'bonus',
    summary: 'Admin: paginated list of half-month bonuses with filters.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'page', type: 'query', description: 'Page number' },
      { name: 'size', type: 'query', description: 'Page size' },
      { name: 'searchKey', type: 'query', description: 'Search text' },
      { name: 'month', type: 'query', description: 'Filter by month key' },
    ],
    response: {
      message: 'success',
      data: [{ 'الرقم الوظيفي': '1001', 'قيمة العلاوة': 2000, month: '2024-06' }],
      totalCount: 300,
      size: 10,
      page: 1,
      totalPages: 30,
    },
    error: { message: 'This role is not authorized', cause: 403 },
    sourceFile: 'src/controllers/halfMonthBonus.controller.ts',
  },
  {
    id: 'bonus-id',
    method: 'GET',
    path: '/half-month-bonus/:id',
    category: 'bonus',
    summary: 'Single bonus record; employees are restricted to their own adKey.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    params: [
      { name: 'id', type: 'path', required: true, description: 'Mongo _id' },
      { name: 'profile', type: 'query', description: 'Scoped view for employees' },
    ],
    response: {
      message: 'success',
      data: [
        {
          'الرقم الوظيفي': '1001',
          'قيمة العلاوة': 2000,
          month: '2024-06',
          userName: 'j.doe',
          department: 'Precast Operations',
          deducations: [{ inlncd: 'SS', 'قيمة الخصم': 60, 'نوع الخصم': 'تأمينات' }],
        },
      ],
    },
    error: { message: 'A valid month is required (YYYY-MM)', cause: 400 },
    sourceFile: 'src/controllers/halfMonthBonus.controller.ts',
  },
  {
    id: 'bonus-delete',
    method: 'DELETE',
    path: '/half-month-bonus',
    category: 'bonus',
    summary: 'Admin: delete an entire bonus month batch.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [{ name: 'month', type: 'body', required: true, description: 'Month key to remove (YYYY-MM)' }],
    response: { message: 'Half month bonus deleted successfully', data: { deletedCount: 300 } },
    error: { message: 'A valid month is required (YYYY-MM)', cause: 400 },
    sourceFile: 'src/controllers/halfMonthBonus.controller.ts',
  },
  {
    id: 'allowances-add',
    method: 'POST',
    path: '/employee-allownces/add',
    category: 'allowances',
    summary: 'Import employee allowances with a month key; validates allowance codes exist first.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Allowances sheet' },
      { name: 'month', type: 'form', required: true, description: 'Month key (YYYY-MM)' },
    ],
    response: { message: 'Employee allowances added successfully', data: { insertedCount: 145 } },
    error: { message: 'Invalid allowance code "XYZ" found in sheet', cause: 400 },
    sourceFile: 'src/controllers/employeeAllowances.controller.ts',
  },
  {
    id: 'allowances-codes-add',
    method: 'POST',
    path: '/employee-allownces/add-codes',
    category: 'allowances',
    summary: 'Import the master list of allowance codes (uses `كود رقم` as the unique key).',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [{ name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Codes sheet' }],
    response: { message: 'Allowances codes added successfully', data: { insertedCount: 12 } },
    error: { message: 'Please upload an excel sheet', cause: 400 },
    sourceFile: 'src/controllers/employeeAllowances.controller.ts',
  },
  {
    id: 'allowances-filter',
    method: 'GET',
    path: '/employee-allownces/filter',
    category: 'allowances',
    summary: 'Paginated allowances with populated code references.',
    auth: 'None',
    roles: ['public'],
    params: [
      { name: 'page', type: 'query', description: 'Page number' },
      { name: 'size', type: 'query', description: 'Page size' },
      { name: 'searchKey', type: 'query', description: 'Search text' },
    ],
    response: {
      message: 'success',
      data: [
        {
          code: { code: 'TRANS', name_en: 'Transport', name_ar: 'بدل انتقال' },
          net: 400,
          pyrole: '1001',
          month: '2024-06',
        },
      ],
      totalCount: 145,
      size: 10,
      page: 1,
      totalPages: 15,
    },
    error: {},
    sourceFile: 'src/controllers/employeeAllowances.controller.ts',
  },
  {
    id: 'allowances-one',
    method: 'GET',
    path: '/employee-allownces/one-employee/:id',
    category: 'allowances',
    summary: 'Allowances for one employee; employees scoped to their own adKey.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    params: [
      { name: 'id', type: 'path', required: true, description: 'Employee adKey' },
      { name: 'month', type: 'query', description: 'Month filter' },
      { name: 'profile', type: 'query', description: 'Scoped view' },
    ],
    response: { message: 'success', data: [{ code: 'TRANS', net: 400, pyrole: '1001', month: '2024-06' }] },
    error: { message: 'Not authorized for this action', cause: 403 },
    sourceFile: 'src/controllers/employeeAllowances.controller.ts',
  },
  {
    id: 'allowances-codes',
    method: 'GET',
    path: '/employee-allownces/all-codes',
    category: 'allowances',
    summary: 'Master list of allowance codes.',
    auth: 'None',
    roles: ['public'],
    response: { message: 'Deduction codes retrieved successfully', data: [{ code: 'TRANS', name_en: 'Transport', name_ar: 'بدل انتقال' }] },
    error: {},
    sourceFile: 'src/controllers/employeeAllowances.controller.ts',
  },
  {
    id: 'deductions-upload',
    method: 'POST',
    path: '/deductions/upload',
    category: 'deductions',
    summary: 'Import deductions for a month/deduction type; validates deduction codes exist.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Deductions sheet' },
      { name: 'month', type: 'form', required: true, description: 'Month key (YYYY-MM)' },
      { name: 'deducationModel', type: 'form', required: true, description: 'Deduction category' },
    ],
    response: { message: 'Deductions added successfully', data: { insertedCount: 210 } },
    error: { message: 'Please upload an Excel file', cause: 400 },
    sourceFile: 'src/controllers/deducations.controller.ts',
  },
  {
    id: 'deductions-code-upload',
    method: 'POST',
    path: '/deductions/upload/ded-code',
    category: 'deductions',
    summary: 'Import the master list of deduction codes (`lncod` used as Mongo _id).',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [{ name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Codes sheet' }],
    response: { message: 'Deduction codes added successfully', data: { insertedCount: 15 } },
    error: { message: 'Please upload an Excel file', cause: 400 },
    sourceFile: 'src/controllers/deducations.controller.ts',
  },
  {
    id: 'deductions-list',
    method: 'GET',
    path: '/deductions',
    category: 'deductions',
    summary: 'Admin: paginated deductions with populated code references.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'page', type: 'query', description: 'Page number' },
      { name: 'size', type: 'query', description: 'Page size' },
    ],
    response: {
      message: 'Deductions retrieved successfully',
      data: [{ inlncd: { lncod: 'SS', ddmodel: 'Insurance' }, inempl: '1001', month: '2024-06', 'قيمة الخصم': 120.5 }],
      totalCount: 210,
      size: 10,
      page: 1,
      totalPages: 21,
    },
    error: { message: 'This role is not authorized', cause: 403 },
    sourceFile: 'src/controllers/deducations.controller.ts',
  },
  {
    id: 'deductions-id',
    method: 'GET',
    path: '/deductions/:id',
    category: 'deductions',
    summary: 'Single deduction by Mongo _id.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    params: [{ name: 'id', type: 'path', required: true, description: 'Mongo _id' }],
    response: { message: 'Deduction retrieved successfully', data: [{ inlncd: 'SS', inempl: '1001', month: '2024-06', 'قيمة الخصم': 120.5 }] },
    error: { message: 'No data found', cause: 404 },
    sourceFile: 'src/controllers/deducations.controller.ts',
  },
  {
    id: 'deductions-employee',
    method: 'GET',
    path: '/deductions/employee/:id',
    category: 'deductions',
    summary: 'Paginated deductions for an employee; employees scoped to their own adKey.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    params: [
      { name: 'id', type: 'path', required: true, description: 'Employee adKey / job number' },
      { name: 'page', type: 'query', description: 'Page number' },
      { name: 'size', type: 'query', description: 'Page size' },
    ],
    response: { message: 'success', data: [{ inlncd: 'SS', month: '2024-06', 'قيمة الخصم': 120.5 }] },
    error: { message: 'Not authorized for this action', cause: 403 },
    sourceFile: 'src/controllers/deducations.controller.ts',
  },
  {
    id: 'departments-add',
    method: 'POST',
    path: '/departments/add',
    category: 'departments',
    summary: 'Bulk-upsert department assignments keyed by employee msempl.',
    auth: 'None',
    roles: ['public'],
    params: [{ name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Departments sheet' }],
    response: { message: 'Department added successfully', data: { insertedCount: 320 } },
    error: { message: 'Please upload an Excel file', cause: 400 },
    sourceFile: 'src/controllers/department.controller.ts',
  },
  {
    id: 'notifications-unread',
    method: 'GET',
    path: '/notifications/unread',
    category: 'notifications',
    summary: 'Unread notifications for the signed-in user.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    response: {
      message: 'success',
      count: 2,
      data: [
        { _id: '…', title: 'Monthly payroll for 2024-06 was added', read: false, createdAt: '2024-08-01T09:00:00.000Z' },
      ],
    },
    error: { message: 'This role is not authorized', cause: 403 },
    sourceFile: 'src/controllers/notification.controller.ts',
  },
  {
    id: 'notifications-mark',
    method: 'PATCH',
    path: '/notifications/mark-read',
    category: 'notifications',
    summary: 'Mark one or many notification(s) as read.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    params: [
      { name: 'notificationId', type: 'body', description: 'Single notification _id' },
      { name: 'notificationIds', type: 'body', description: 'Array of notification _ids' },
    ],
    response: { message: 'Notifications marked as read', data: { modifiedCount: 2 } },
    error: { message: 'This role is not authorized', cause: 403 },
    sourceFile: 'src/controllers/notification.controller.ts',
  },
  {
    id: 'services-add',
    method: 'POST',
    path: '/services-details/add',
    category: 'services',
    summary: 'Import services/items supplied to employees; month defaults to current.',
    auth: 'None',
    roles: ['public'],
    params: [{ name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Services sheet' }],
    response: { message: 'Services details added successfully', data: { insertedCount: 88 } },
    error: { message: 'Please upload an Excel file', cause: 400 },
    sourceFile: 'src/controllers/servicesDetailes.controller.ts',
  },
  {
    id: 'profits-add',
    method: 'POST',
    path: '/total-profits/add',
    category: 'profits',
    summary: 'Import yearly profit records for a given year.',
    auth: 'Bearer token',
    roles: ['admin'],
    params: [
      { name: 'file', type: 'multipart .xlsx/.csv', required: true, description: 'Profits sheet' },
      { name: 'year', type: 'form', required: true, description: 'Year key (e.g. 2024)' },
    ],
    response: { message: 'Total profits added successfully', data: { insertedCount: 295 } },
    error: { message: 'Please upload an Excel file', cause: 400 },
    sourceFile: 'src/controllers/totalProfits.controller.ts',
  },
  {
    id: 'profits-id',
    method: 'GET',
    path: '/total-profits/:id',
    category: 'profits',
    summary: 'Yearly profit per employee; employees scoped to their own adKey.',
    auth: 'Bearer token',
    roles: ['admin', 'employee'],
    params: [
      { name: 'id', type: 'path', required: true, description: 'Mongo _id' },
      { name: 'year', type: 'query', description: 'Year key' },
      { name: 'profile', type: 'query', description: 'Scoped view' },
    ],
    response: {
      message: 'success',
      data: [
        {
          'رقم العامل': '1001',
          'نسبة الارباح': 3.5,
          year: '2024',
          userName: 'j.doe',
          department: 'Precast Operations',
          deducations: [{ inlncd: 'SS', 'قيمة الخصم': 480, year: '2024' }],
        },
      ],
    },
    error: { message: 'A valid year is required (e.g. 2024)', cause: 400 },
    sourceFile: 'src/controllers/totalProfits.controller.ts',
  },
]

// ---------------------------------------------------------------- models

export interface ModelField {
  name: string
  type: string
  note?: string
  unique?: boolean
  ref?: string
}

export interface ModelInfo {
  collection: string
  label: string
  description: string
  fromExcel: boolean
  fields: ModelField[]
}

export const dataModels: ModelInfo[] = [
  {
    collection: 'users',
    label: 'User',
    description: 'Application users created at login. Only immutable email + role + tokens are stored.',
    fromExcel: false,
    fields: [
      { name: 'userName', type: 'string', note: 'Unique; set from AD sAMAccountName at first login', unique: true },
      { name: 'email', type: 'string', note: 'Immutable — addresses never edited' },
      { name: 'role', type: 'string', note: "admin | employee (from AD group membership)" },
      { name: 'adKey', type: 'string', note: 'Employee job number mapped from AD' },
      { name: 'tokens', type: 'string[]', note: 'Active JWTs — logout removes the token' },
      { name: 'groups', type: 'string[]', note: 'AD group memberships returned by LDAP' },
      { name: 'lastLogin', type: 'Date', note: 'Tracked for audit' },
    ],
  },
  {
    collection: 'monthlypayrolls',
    label: 'Monthly Payroll',
    description: 'One document per employee per month, imported from the payroll Excel sheet (40+ Arabic columns).',
    fromExcel: true,
    fields: [
      { name: 'pyempl', type: 'string', note: 'Employee job number — unique within month', unique: true },
      { name: 'الرقم الوظيفي', type: 'string', note: 'Arabic job-number column kept as-is' },
      { name: 'المرتب الاساسي', type: 'number', note: 'Basic salary' },
      { name: 'اجمالي الدخل', type: 'number', note: 'Gross income' },
      { name: 'صافي الراتب', type: 'number', note: 'Net salary' },
      { name: 'الرصيد السابق', type: 'number', note: 'Previous balance' },
      { name: 'مرتب شهر', type: 'string', note: 'YYYY-MM — unique within month', unique: true },
      { name: '+ 35 more Arabic columns', type: '…', note: 'deductions, overtime, loans, social insurance' },
    ],
  },
  {
    collection: 'halfmonthbonuses',
    label: 'Half-Month Bonus',
    description: 'Monthly bonus records; unique per {job number, month}.',
    fromExcel: true,
    fields: [
      { name: 'الرقم الوظيفي', type: 'string', note: 'Employee job number', unique: true },
      { name: 'قيمة العلاوة', type: 'number', note: 'Bonus value' },
      { name: 'date', type: 'Date' },
      { name: 'month', type: 'string', note: 'YYYY-MM — unique within month', unique: true },
    ],
  },
  {
    collection: 'medicalitems',
    label: 'Employee Allowances',
    description: 'Allowances assigned to an employee for a month, referencing the codes list.',
    fromExcel: true,
    fields: [
      { name: 'code', type: 'ObjectId', note: 'Reference to allowancesCodes', ref: 'allowancesCodes' },
      { name: 'net', type: 'number', note: 'Net allowance value' },
      { name: 'pyrole', type: 'string', note: 'Employee job number' },
      { name: 'month', type: 'string', note: 'YYYY-MM' },
    ],
  },
  {
    collection: 'allowancescodes',
    label: 'Allowance Codes',
    description: 'Master dictionary of allowance codes.',
    fromExcel: true,
    fields: [
      { name: '_id', type: 'string', note: '`كود رقم` from the code sheet', unique: true },
      { name: 'name_en', type: 'string', note: 'English label' },
      { name: 'name_ar', type: 'string', note: 'Arabic label' },
    ],
  },
  {
    collection: 'deductions',
    label: 'Deductions',
    description: 'Deductions applied to an employee for a month and a deduction type.',
    fromExcel: true,
    fields: [
      { name: 'inlncd', type: 'ObjectId', note: 'Reference to deduction codes', ref: 'deductioncodes' },
      { name: 'inempl', type: 'string', note: 'Employee job number' },
      { name: 'قيمة الخصم', type: 'number', note: 'Deduction value' },
      { name: 'month', type: 'string', note: 'YYYY-MM' },
      { name: 'deducationModel', type: 'string', note: 'Deduction category' },
    ],
  },
  {
    collection: 'deductioncodes',
    label: 'Deduction Codes',
    description: 'Master dictionary of deduction codes; `lncod` is used as the Mongo _id.',
    fromExcel: true,
    fields: [
      { name: '_id', type: 'string', note: '`lncod` from sheet — used as _id', unique: true },
      { name: 'ddmodel', type: 'string', note: 'Deduction model/category' },
    ],
  },
  {
    collection: 'stafdepartments',
    label: 'Department',
    description: 'Employee → department mapping.',
    fromExcel: true,
    fields: [
      { name: 'msempl', type: 'string', note: 'Employee job number — unique', unique: true },
      { name: 'department', type: 'string', note: 'Department name (e.g. Precast Operations)' },
    ],
  },
  {
    collection: 'servicesdetails',
    label: 'Services Details',
    description: 'Services/items provided to employees.',
    fromExcel: true,
    fields: [
      { name: 'pyempl', type: 'string', note: 'Employee job number' },
      { name: 'code', type: 'ObjectId', note: 'Reference to allowance code used as item master', ref: 'allowancescodes' },
      { name: 'month', type: 'string', note: 'Defaults to current YYYY-MM' },
    ],
  },
  {
    collection: 'totalprofits',
    label: 'Total Profit (Yearly)',
    description: 'Yearly profit share per employee, unique per {job number, year}.',
    fromExcel: true,
    fields: [
      { name: 'رقم العامل', type: 'string', note: 'Employee job number' },
      { name: 'نسبة الارباح', type: 'number', note: 'Profit share %' },
      { name: 'date', type: 'Date' },
      { name: 'year', type: 'string', note: 'e.g. 2024' },
    ],
  },
  {
    collection: 'notifications',
    label: 'Notification',
    description: 'In-app notifications created by import pipelines for affected users.',
    fromExcel: false,
    fields: [
      { name: 'userId', type: 'ObjectId', note: 'Target user', ref: 'users' },
      { name: 'title', type: 'string' },
      { name: 'read', type: 'boolean', note: 'Marked via /notifications/mark-read' },
      { name: 'createdAt', type: 'Date' },
    ],
  },
]

export const modelRelationships = [
  'User ← Notification.userId (reference)',
  'EmployeeAllowances.code → allowancesCodes',
  'Deduction.inlncd → deductionCodes',
  'ServicesDetails.code → allowancesCodes',
]

// ---------------------------------------------------------------- stack

export const backendStack = [
  { name: 'Node.js', detail: 'Runtime (v22 detected on this machine, app is JS/TS ESM)' },
  { name: 'Express', detail: 'v5.1.0 — HTTP framework & router' },
  { name: 'TypeScript', detail: 'ESM ("type": "module"), NodeNext module resolution, target ES2022' },
  { name: 'MongoDB + Mongoose', detail: 'Mongoose ^8.19.2 — 10 schemas, bulkWrite upserts' },
  { name: 'JSON Web Token', detail: 'jsonwebtoken ^9 — 1-day sessions, token revocation via stored array' },
  { name: 'ldap-authentication', detail: 'Active Directory sign-in against DOMAIN_ACTIVE_DIRECTORY' },
  { name: 'multer', detail: '^2.0.2 — memory storage for Excel uploads (./uploads staging)' },
  { name: 'xlsx', detail: '^0.18.5 — SheetJS sheet_to_json for imports' },
  { name: 'Joi', detail: 'Per-module row validators before DB writes' },
  { name: 'bcrypt', detail: 'Password hashing (used for local fallback paths)' },
  { name: 'node-schedule', detail: '^2.1.1 — installed (scheduled jobs utility)' },
  { name: 'moment / moment-timezone', detail: 'Date helpers' },
  { name: 'cors + dotenv', detail: 'CORS allowlist + environment config' },
]

export const frontendStack = [
  { name: 'React 18', detail: 'Hooks, context-driven auth & data layer' },
  { name: 'TypeScript', detail: 'Strict typing, path alias @/' },
  { name: 'Vite', detail: 'Dev server & build tool' },
  { name: 'Tailwind CSS', detail: 'Utility-first styling' },
  { name: 'shadcn/ui + Radix', detail: '~46 accessible UI primitives (accordion, dialog, …)' },
  { name: 'React Router DOM', detail: 'Guard-protected routes (User/Admin/Guest)' },
  { name: 'Axios', detail: 'Single instance, token interceptor, 401 handler' },
  { name: 'Recharts', detail: 'Dashboard charts & KPIs' },
  { name: 'jwt-decode', detail: 'Client-side exp check for session expiry' },
  { name: 'sonner', detail: 'Toast notifications' },
  { name: 'jsPDF (print-based)', detail: 'PDF export for reports & employee details' },
  { name: 'react-hook-form', detail: 'Form state & validation' },
]

export const infrastructureNotes = [
  'Backend listens on 0.0.0.0:4000, API mounted at /api/v1',
  'Frontend default API URL: http://fin.norpetco.com:4000/api/v1 (overridable via VITE_API_BASE_URL)',
  'CORS: GET allowed from any origin; mutating methods restricted to an explicit allowlist (localhost:5173, localhost:3000, norpetco.vercel.app, …)',
]

// ---------------------------------------------------------------- architecture nodes

export interface ArchNode {
  id: string
  title: string
  subtitle: string
  detail: string
  file: string
}

export const archNodes: ArchNode[] = [
  {
    id: 'client',
    title: 'React Client',
    subtitle: 'Vite SPA · Tailwind + shadcn/ui',
    detail: 'Guarded routes, axios instance with token interceptor, dashboard charts, PDF export via print window.',
    file: 'final-norpetco-frontend-project/src',
  },
  {
    id: 'api',
    title: 'REST API · /api/v1',
    subtitle: 'Express 5',
    detail: 'All business routes are mounted under /api/v1. CORS allowlist enforced for non-GET requests.',
    file: 'final-norpetco-backend-project/src/router/index.router.ts',
  },
  {
    id: 'mw',
    title: 'Middleware Chain',
    subtitle: 'auth · multer · Joi',
    detail: 'isAuthenticated(roles) checks JWT + role; multer parses uploads; excelValidationMiddleware validates every row.',
    file: 'final-norpetco-backend-project/src/middleware',
  },
  {
    id: 'ctrl',
    title: 'Controllers',
    subtitle: '10 controllers',
    detail: 'Handle login, dashboard stats, imports, filters, and scoped employee reads.',
    file: 'final-norpetco-backend-project/src/controllers',
  },
  {
    id: 'db',
    title: 'MongoDB',
    subtitle: '10 collections via Mongoose',
    detail: 'Upserts via bulkWrite with $setOnInsert; ad-hoc filters via ApiFeatures class.',
    file: 'final-norpetco-backend-project/src/DB/models',
  },
  {
    id: 'ldap',
    title: 'Active Directory (LDAP)',
    subtitle: 'Norpetco.org domain',
    detail: 'Login validates credentials via ldap-authentication; role derived from AD group membership.',
    file: 'final-norpetco-backend-project/src/utils/authenticateUser.ts',
  },
  {
    id: 'xlsx',
    title: 'Excel / CSV Import',
    subtitle: 'SheetJS + Joi',
    detail: 'Rows are parsed with sheet_to_json, validated, normalized (Arabic dates, number parsing), then bulk-upserted.',
    file: 'final-norpetco-backend-project/src/utils/sheetHandler.ts',
  },
]

// ---------------------------------------------------------------- request lifecycle

export const lifecycleSteps = [
  {
    title: 'Client request',
    detail:
      'Succinctly, the axios instance attaches the stored JWT to the `Authorization` header (the token is sent as-is, without a `Bearer ` prefix — this matches how `authMiddleware` reads it).',
    file: 'final-norpetco-frontend-project/src/lib/axios.ts',
  },
  {
    title: 'CORS check',
    detail: 'Express `cors` middleware: GET requests allowed from any origin; non-GET requests must match the allowlist embedded in `initiateApp.ts`.',
    file: 'final-norpetco-backend-project/src/initiateApp.ts',
  },
  {
    title: 'Route + middleware',
    detail: 'The router applies `isAuthenticated(ADMIN | EMPLOYEE)` where required. The middleware verifies the JWT signature, looks the user up, ensures the token is still in `user.tokens`, and checks role membership.',
    file: 'final-norpetco-backend-project/src/middleware/authMiddleware.ts',
  },
  {
    title: 'Controller + validation', 
    detail: 'Upload routes first run multer then a Joi schema tailored to the module. Controllers apply `asyncHandeller`, normalize IDs (`parseNumber`, `parseArabicStringNumber`), and save via Mongoose.',
    file: 'final-norpetco-backend-project/src/controllers',
  },
  {
    title: 'Database operation',
    detail: 'List routes use `ApiFeatures` (search, sort, range filters, pagination). Import routes use `bulkWrite` upserts and create notifications for affected users.',
    file: 'final-norpetco-backend-project/src/utils/apiFeatures.ts',
  },
  {
    title: 'Response envelope',
    detail: 'Controllers return `{ message, data, … }`; list endpoints add `totalCount, size, page, totalPages`. Errors flow to `glopalErrorHandelling` → `{ message, stack }` with `err.cause` used as the HTTP status.',
    file: 'final-norpetco-backend-project/src/utils/errorHandlig.ts',
  },
]

// ---------------------------------------------------------------- features

export const features = [
  {
    title: 'LDAP / Active Directory sign-in',
    detail: '`POST /users/login` authenticates against the corporate AD domain via `ldap-authentication`. The role (`admin` vs `employee`) is derived from AD group membership — if the user is in the "Finance admin" group they become an admin.',
    file: 'src/utils/authenticateUser.ts',
  },
  {
    title: 'JWT sessions with revocation',
    detail: 'Issued JWTs (1-day expiry) are pushed into `user.tokens[]`. Logout removes the current token, instantly revoking it server-side on the next request.',
    file: 'src/utils/token-manager.ts',
  },
  {
    title: 'Role-based API guard',
    detail: '`isAuthenticated([ADMIN])` protects admin operations (imports, filters, deletes, dashboard stats). `[ADMIN, EMPLOYEE]` endpoints scope employee reads to their own job number using their token-derived `adKey`.',
    file: 'src/middleware/authMiddleware.ts',
  },
  {
    title: 'Excel/CSV import pipeline',
    detail: 'multer (memory) → SheetJS `sheet_to_json` → Joi row validation → key normalization (dates to YYYY-MM, Arabic strings to numbers) → Mongoose `bulkWrite` upsert → per-user notifications → temp file cleanup.',
    file: 'src/utils/sheetHandler.ts + src/middleware/excelValidationMiddleware.ts',
  },
  {
    title: 'Search / sort / range filters + pagination',
    detail: 'The `ApiFeatures` class strings together Mongoose queries from query params (`searchKey`, `searchFields`, `gt/gte/lt/lte`, `sort`) and returns the classic `{ data, totalCount, page, size, totalPages }` envelope.',
    file: 'src/utils/apiFeatures.ts',
  },
  {
    title: 'Admin dashboard analytics',
    detail: 'Aggregated KPIs (total employees, total payroll) plus monthly and per-department breakdowns using MongoDB aggregation pipelines.',
    file: 'src/controllers/user.controller.ts (getDashboardStates)',
  },
  {
    title: 'Employee self-service',
    detail: 'Employees see only their own salary, bonus, and yearly-profit data; the UI renders PDF-ready salary cards and per-period tables.',
    file: 'final-norpetco-frontend-project/src/pages/Profile.tsx',
  },
  {
    title: 'Guarded SPA routes',
    detail: '`AdminRoute`, `UserRoute` and `GuestRoute` wrappers redirect unauthenticated / unauthorized users, mirroring the backend RBAC in the UI.',
    file: 'final-norpetco-frontend-project/src/components/ProtectedRoute.tsx',
  },
  {
    title: 'Centralized HTTP client',
    detail: 'One axios instance injects the token, unwraps the `message` via interceptor (sonner toasts), and on 401 clears the session and redirects to `/signin`.',
    file: 'final-norpetco-frontend-project/src/lib/axios.ts',
  },
  {
    title: 'Notifications on import',
    detail: 'Import pipelines create Notification documents for users whose records were touched, surfaced through the bell in the layout.',
    file: 'src/controllers/notification.controller.ts',
  },
  {
    title: 'PDF salary slips',
    detail: 'Every finance page can export a printable PDF (via `window.print` + styled tables) — monthly payroll, half-month bonus, yearly profit, per-employee detail.',
    file: 'final-norpetco-frontend-project/src/utils/pdf-export.ts',
  },
]

// ---------------------------------------------------------------- codebase tree

export interface TreeNode {
  name: string
  note: string
  children?: TreeNode[]
}

export const codebaseTree: TreeNode[] = [
  {
    name: 'final-norpetco-backend-project',
    note: 'Express 5 + TypeScript API · port 4000',
    children: [
      { name: 'index.ts', note: 'Boots Express, DB connection, listen 0.0.0.0:4000' },
      {
        name: 'src/',
        note: 'Application source',
        children: [
          {
            name: 'router/',
            note: '10 routers',
            children: [
              { name: 'index.router.ts', note: 'Mounts all routers + POST /test-exel-upload' },
              { name: 'users · monthly-payroll · half-month-bonus', note: '…' },
              { name: 'employee-allownces · deductions · departments', note: '…' },
              { name: 'notifications · services-details · total-profits', note: '…' },
            ],
          },
          {
            name: 'middleware/',
            note: '3 middleware',
            children: [
              { name: 'authMiddleware.ts', note: 'isAuthenticated(roles): JWT + role + token-store check' },
              { name: 'multerMiddleware.ts', note: '.xlsx/.csv memory storage into ./uploads' },
              { name: 'excelValidationMiddleware.ts', note: 'Joi validation per module' },
            ],
          },
          {
            name: 'controllers/',
            note: '10 controllers',
            children: [
              { name: 'user.controller.ts', note: 'login, logout, profile, dashboard-stats' },
              { name: 'monthelyPayRoll.controller.ts', note: 'AddFromExcel, admin/all, :id' },
              { name: 'halfMonthBonus.controller.ts', note: 'Import, filter, :id, delete-by-month' },
              { name: 'employeeAllowances.controller.ts', note: 'Allowances + codes' },
              { name: 'deducations.controller.ts', note: 'Deductions + codes + employee scope' },
              { name: 'department · servicesDetailes · notification · totalProfits', note: '…' },
            ],
          },
          {
            name: 'DB/',
            note: 'connection + models',
            children: [
              { name: 'connection.ts', note: 'MONGO_URI / default mongodb://127.0.0.1:27017/staf-system' },
              { name: 'models/', note: '10 Mongoose schemas (users, payroll, bonus, allowances, codes, deductions, departments, services, profits, notifications)' },
            ],
          },
          {
            name: 'utils/',
            note: '9 helpers',
            children: [
              { name: 'authenticateUser.ts', note: 'LDAP/AD + role resolution' },
              { name: 'token-manager.ts', note: 'createToken / verifyToken (1d)' },
              { name: 'apiFeatures.ts', note: 'search/sort/filters/pagination' },
              { name: 'sheetHandler.ts', note: 'xlsx parse + Arabic date/number normalization' },
              { name: 'errorHandlig.ts', note: 'asyncHandeller + global handler' },
              { name: 'systemRoles.ts · pagination.js · dateUtils · convertStrNum · deducationType', note: '…' },
            ],
          },
        ],
      },
      { name: '.env', note: 'SALT · MONGO_URI · JWT_SECRET · DOMAIN_ACTIVE_DIRECTORY · ADMIN_DN · ADMIN_PASSWORD · USER_SEARCH_BASE' },
    ],
  },
  {
    name: 'final-norpetco-frontend-project',
    note: 'Vite + React + TS SPA',
    children: [
      {
        name: 'src/',
        note: 'Application source',
        children: [
          {
            name: 'pages/',
            note: 'SignIn · Profile · Dashboard + 11 module pages',
            children: [
              { name: 'modules/', note: 'MonthlySalary(+Detail) · HalfMonthBonus(+Detail) · YearlyProfits(+Detail) · StaffAllowances · TotalDeductions · DeductionCodes · AllowanceCodes · Departments' },
              { name: 'SignIn.tsx', note: 'Login → AuthContext.signIn' },
              { name: 'Profile.tsx', note: 'Employee self-service with PDF cards' },
              { name: 'Dashboard.tsx', note: 'Admin KPIs + charts (recharts)' },
            ],
          },
          {
            name: 'services/',
            note: 'api.ts exposes typed service objects',
            children: [
              { name: 'authService · monthlyPayrollService', note: '…' },
              { name: 'halfMonthBonusService · staffAllowanceService', note: '…' },
              { name: 'totalDeductionService · deductionService · deductionCodeService', note: '…' },
              { name: 'allowancesCodeService · departmentService', note: '…' },
              { name: 'dashboardService · notificationService', note: '…' },
            ],
          },
          {
            name: 'contexts/AuthContext.tsx',
            note: 'LocalStorage token + userData; jwt-decode exp check; cross-tab sync',
          },
          { name: 'lib/axios.ts', note: 'baseURL + request/response interceptors' },
          { name: 'types/index.ts', note: 'MonthlyPayroll interface — 40+ Arabic fields' },
          { name: 'utils/', note: 'pdf-export.ts · systemrules.ts' },
          {
            name: 'components/',
            note: 'Layout · ProtectedRoute · NotificationBell · FileUpload · DataTable · FieldValueTable + ~46 shadcn/ui',
          },
        ],
      },
      { name: '.env.example', note: 'VITE_API_BASE_URL · VITE_APP_NAME' },
    ],
  },
]

// ---------------------------------------------------------------- decisions

export const decisions = [
  {
    title: 'Role derived from AD groups — not a local config',
    detail: 'A user becomes `admin` only when their LDAP groups include "Finance admin". There is no public registration and no admin seeding, so security authorization inherits the authority of Active Directory.',
  },
  {
    title: 'JWT sessions stored on the user document',
    detail: 'Instead of a stateless whitelist or blacklist, every issued token is recorded in `user.tokens[]`. Logout deletes the token and the next request rejects it — session revocation works even though the HTTP layer is stateless.',
  },
  {
    title: 'Excel as the source of truth for finance data',
    detail: 'Payroll arrives as corporate Excel/CSV exports. The pipeline normalizes messy rows (Arabic numerals, Arabic date strings, commas) via `convertStrNum` + `sheetHandler` before a single `bulkWrite` upsert.',
  },
  {
    title: 'Validation both in the browser and on the server',
    detail: 'The frontend validates forms and file types; the backend re-validates every uploaded row against a per-module Joi schema, then produces notifications for affected users.',
  },
  {
    title: 'A reusable ApiFeatures query class',
    detail: 'Search, sort, numeric range filters (`gt/gte/lt/lte`) and pagination are expressed as declarative query params consumed by one utility — every list route is consistent (search fields, sizes, envelopes).',
  },
  {
    title: 'Double-checking IDs across Arabic/English sources',
    detail: 'Employee keys are normalized with `parseNumber`, so "١٠٠١" (Arabic-Indic) and "1001" resolve to the same document. This prevents silent duplicate rows between old Excel exports and the AD directory.',
  },
]

// ---------------------------------------------------------------- security

export const securityItems = [
  {
    title: 'Passwordless-password auth',
    detail: 'Credentials are verified by Active Directory over LDAP. The application stores no employee passwords; only a JWT + user fingerprint.',
  },
  {
    title: 'Signed, expiring JWTs',
    detail: 'Tokens are signed with a server secret from `.env` (`JWT_SECRET`) and expire after 1 day (`token-manager.ts`).',
  },
  {
    title: 'Server-side revocation',
    detail: 'Because tokens live in `user.tokens[]`, logout removes the token and unauthenticated requests are rejected — useful for terminated sessions.',
  },
  {
    title: 'Role-based authorization',
    detail: '`isAuthenticated([ADMIN])` / `([ADMIN, EMPLOYEE])` middleware gates every route; employee reads are additionally scoped to their own `adKey`.',
  },
  {
    title: 'Row-level input validation',
    detail: 'Every Excel/CSV row passes a module-specific Joi schema before touching the database.',
  },
  {
    title: 'CORS allowlist for mutations',
    detail: 'State-changing (non-GET) requests are limited to an explicit origin allowlist; GET endpoints are intentionally open for read-only access.',
  },
  {
    title: 'Minimal stored credentials',
    detail: 'User documents keep an immutable email, role and token array — never plain-text passwords.',
  },
]

export const securityGaps = [
  'No rate limiting detected on the login endpoint',
  'No Helmet (security headers) middleware detected `in package.json`/`src`',
  'HTTPS is left to the hosting layer (default API URL is `http://…:4000`)',
]

// ---------------------------------------------------------------- errors

export const errorFormats = [
  { label: 'Validation errors (Joi)', shape: '{ "message": "validation Errors", "Errors": { "row": "…" } }', where: 'excelValidationMiddleware / Joi schemas' },
  { label: 'Generic error', shape: '{ "message": "…", "stack": "…" }', where: 'glopalErrorHandelling — status taken from err.cause' },
  { label: 'Not found', shape: '{ "message": "Route not found" }', where: 'express 404 fallback' },
  { label: '401 Unauthorized', shape: '{ "message": "Invalid session token", "cause": 401 }', where: 'authMiddleware' },
  { label: '403 Forbidden', shape: '{ "message": "This role is not authorized", "cause": 403 }', where: 'authMiddleware role check' },
]

// ---------------------------------------------------------------- metrics

export const metrics = [
  { value: 40, label: 'API endpoints' },
  { value: 10, label: 'Routers', detail: '9 domain + index' },
  { value: 10, label: 'Controllers' },
  { value: 10, label: 'Mongoose models' },
  { value: 9, label: 'Utility modules' },
  { value: 3, label: 'Backend middleware' },
  { value: 14, label: 'Frontend pages' },
  { value: 46, label: 'shadcn/ui primitives' },
  { value: 12, label: 'Service modules' },
]

export const techBadges = [
  'Express 5', 'TypeScript ESM', 'Mongoose 8', 'JWT', 'LDAP/AD', 'multer',
  'SheetJS (xlsx)', 'Joi', 'React 18', 'Vite', 'Tailwind', 'shadcn/ui',
  'Axios', 'Recharts', 'jwt-decode', 'jsPDF',
]

// ---------------------------------------------------------------- github

export const githubPlaceholder = 'your-username/your-repo-name'

export const whatIBuilt = [
  'A production payroll suite where finance imports monthly payroll, bonuses, allowances and deductions straight from the company Excel/CSV exports.',
  'Secure LDAP/Active-Directory sign-in so employees use their existing corporate accounts — roles follow AD groups automatically.',
  'A bilingual finance UI with salary cards, printable PDF slips and an admin dashboard of payroll KPIs.',
  '40 REST endpoints with search/filter/pagination and role-based access control.',
  'A notification service that alerts users when their payroll or bonuses are updated.',
]