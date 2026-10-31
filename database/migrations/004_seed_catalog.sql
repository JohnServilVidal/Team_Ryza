-- 004_seed_catalog.sql  (S1-DBA-05, part 1)
-- Roles, modules and the 36-right catalogue (guide section 3.8).

INSERT INTO role (role_code, role_name) VALUES
  ('superadmin', 'Superadmin'),
  ('admin',      'Admin'),
  ('user',       'User')
ON CONFLICT DO NOTHING;

INSERT INTO module (module_code, module_name, sort_order) VALUES
  ('customer', 'Customer Management', 1),
  ('product',  'Product Management',  2),
  ('hr',       'Human Resources',     3),
  ('sales',    'Sales',               4),
  ('reports',  'Reports',             5)
ON CONFLICT DO NOTHING;

INSERT INTO rights_catalog (right_code, module_code, right_name, sort_order) VALUES
  -- Customer (3)
  ('customer_add',    'customer', 'Add Customer',    1),
  ('customer_edit',   'customer', 'Edit Customer',   2),
  ('customer_delete', 'customer', 'Delete Customer', 3),
  -- Product (6)
  ('product_add',     'product',  'Add Product',     1),
  ('product_edit',    'product',  'Edit Product',    2),
  ('product_delete',  'product',  'Delete Product',  3),
  ('price_add',       'product',  'Add Price',       4),
  ('price_edit',      'product',  'Edit Price',      5),
  ('price_delete',    'product',  'Delete Price',    6),
  -- Human Resources (13)
  ('job_add',         'hr', 'Add Job',            1),
  ('job_edit',        'hr', 'Edit Job',           2),
  ('job_delete',      'hr', 'Delete Job',         3),
  ('dept_add',        'hr', 'Add Department',     4),
  ('dept_edit',       'hr', 'Edit Department',    5),
  ('dept_delete',     'hr', 'Delete Department',  6),
  ('emp_add',         'hr', 'Add Employee',       7),
  ('emp_edit',        'hr', 'Edit Employee',      8),
  ('emp_delete',      'hr', 'Delete Employee',    9),
  ('jobhist_view',    'hr', 'View Job History',  10),
  ('jobhist_add',     'hr', 'Add Job History',   11),
  ('jobhist_edit',    'hr', 'Edit Job History',  12),
  ('jobhist_delete',  'hr', 'Delete Job History',13),
  -- Sales (7)
  ('sale_add',          'sales', 'Add Sale',           1),
  ('sale_edit',         'sales', 'Edit Sale',          2),
  ('sale_delete',       'sales', 'Delete Sale',        3),
  ('saledetail_view',   'sales', 'View Sale Details',  4),
  ('saledetail_add',    'sales', 'Add Sale Detail',    5),
  ('saledetail_edit',   'sales', 'Edit Sale Detail',   6),
  ('saledetail_delete', 'sales', 'Delete Sale Detail', 7),
  -- Reports (7)
  ('rpt_top_customers',        'reports', 'Top Customers',        1),
  ('rpt_product_master',       'reports', 'Product Master List',  2),
  ('rpt_top_products',         'reports', 'Top Products',         3),
  ('rpt_active_employees',     'reports', 'Active Employees',     4),
  ('rpt_all_employees',        'reports', 'All Employees',        5),
  ('rpt_employee_job_history', 'reports', 'Employee Job History', 6),
  ('rpt_top_sales',            'reports', 'Top Sales',            7)
ON CONFLICT DO NOTHING;