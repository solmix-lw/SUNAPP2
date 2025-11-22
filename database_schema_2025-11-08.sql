-- Gelan Terminal Maintenance - Database Schema Export
-- Generated: 11/8/2025, 11:39:30 AM
-- Database: PostgreSQL

-- Tables and Columns
-- This schema represents the current database structure


-- Table: app_customizations
CREATE TABLE IF NOT EXISTS "app_customizations" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "app_name" text NOT NULL DEFAULT 'Gelan Terminal Maintenance'::text,
  "logo_url" text,
  "primary_color" text DEFAULT '#0ea5e9'::text,
  "theme_mode" text NOT NULL DEFAULT 'light'::text,
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_by" character varying
);

-- Table: approval_stages
CREATE TABLE IF NOT EXISTS "approval_stages" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "sequence" integer NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "required_role" text NOT NULL DEFAULT 'supervisor'::text
);

-- Table: approvals
CREATE TABLE IF NOT EXISTS "approvals" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "approval_type" text NOT NULL,
  "reference_id" character varying NOT NULL,
  "reference_number" text,
  "requested_by_id" character varying NOT NULL,
  "assigned_to_id" character varying NOT NULL,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "priority" text NOT NULL DEFAULT 'medium'::text,
  "amount" numeric,
  "description" text NOT NULL,
  "request_notes" text,
  "response_notes" text,
  "responded_at" timestamp without time zone,
  "escalated_to_id" character varying,
  "escalated_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: attendance_device_settings
CREATE TABLE IF NOT EXISTS "attendance_device_settings" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "device_name" text NOT NULL,
  "device_model" text,
  "serial_number" text,
  "ip_address" text NOT NULL,
  "port" integer NOT NULL DEFAULT 4370,
  "timeout" integer DEFAULT 5000,
  "is_active" boolean DEFAULT true,
  "last_sync_at" timestamp without time zone,
  "last_import_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: d365_items_preview
CREATE TABLE IF NOT EXISTS "d365_items_preview" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "sync_id" character varying NOT NULL,
  "item_no" character varying NOT NULL,
  "description" text NOT NULL,
  "description2" text,
  "type" text,
  "base_unit_of_measure" text,
  "unit_price" numeric,
  "unit_cost" numeric,
  "inventory" numeric,
  "vendor_no" text,
  "vendor_item_no" text,
  "already_exists" boolean DEFAULT false,
  "last_date_modified" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: d365_sync_logs
CREATE TABLE IF NOT EXISTS "d365_sync_logs" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "sync_type" character varying NOT NULL,
  "status" character varying NOT NULL,
  "prefix" character varying,
  "records_imported" integer DEFAULT 0,
  "records_updated" integer DEFAULT 0,
  "records_skipped" integer DEFAULT 0,
  "total_records" integer DEFAULT 0,
  "error_message" text,
  "import_data" text,
  "created_at" timestamp without time zone DEFAULT now()
);

-- Table: damage_reports
CREATE TABLE IF NOT EXISTS "damage_reports" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "reception_id" character varying NOT NULL,
  "view_angle" text NOT NULL,
  "coordinate_x" numeric,
  "coordinate_y" numeric,
  "severity" text NOT NULL,
  "damage_type" text,
  "description" text NOT NULL,
  "photo_url" text,
  "estimated_cost" numeric,
  "marked_by_id" character varying,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: device_import_logs
CREATE TABLE IF NOT EXISTS "device_import_logs" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "device_id" character varying NOT NULL,
  "operation_type" text NOT NULL,
  "status" text NOT NULL,
  "users_imported" integer DEFAULT 0,
  "users_updated" integer DEFAULT 0,
  "users_skipped" integer DEFAULT 0,
  "error_message" text,
  "import_data" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: dynamics365_settings
CREATE TABLE IF NOT EXISTS "dynamics365_settings" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "bc_url" text NOT NULL,
  "bc_company" text NOT NULL,
  "bc_username" text NOT NULL,
  "bc_password" text NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "last_test_date" timestamp without time zone,
  "last_test_status" text,
  "last_test_message" text,
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_by" character varying,
  "item_prefix" text,
  "equipment_prefix" text,
  "sync_interval_hours" integer DEFAULT 24,
  "last_sync_date" timestamp without time zone,
  "bc_domain" text
);

-- Table: employee_page_permissions
CREATE TABLE IF NOT EXISTS "employee_page_permissions" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "employee_id" character varying NOT NULL,
  "page_path" text NOT NULL,
  "is_allowed" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: employee_performance_snapshots
CREATE TABLE IF NOT EXISTS "employee_performance_snapshots" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "employee_id" character varying NOT NULL,
  "snapshot_date" timestamp without time zone NOT NULL,
  "granularity" text NOT NULL,
  "tasks_completed" integer DEFAULT 0,
  "total_labor_minutes" integer DEFAULT 0,
  "quality_score" numeric,
  "work_orders_completed" integer DEFAULT 0,
  "item_requisitions_processed" integer DEFAULT 0,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: employee_performance_totals
CREATE TABLE IF NOT EXISTS "employee_performance_totals" (
  "employee_id" character varying NOT NULL,
  "total_tasks_completed" integer DEFAULT 0,
  "total_work_orders_completed" integer DEFAULT 0,
  "total_labor_hours" numeric DEFAULT 0,
  "average_quality_score" numeric,
  "employee_of_month_count" integer DEFAULT 0,
  "employee_of_year_count" integer DEFAULT 0,
  "last_award_date" timestamp without time zone,
  "last_updated" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: employees
CREATE TABLE IF NOT EXISTS "employees" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "employee_id" text NOT NULL,
  "full_name" text NOT NULL,
  "role" text NOT NULL,
  "specialty" text,
  "phone_number" text,
  "email" text,
  "garage_id" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "hire_date" timestamp without time zone,
  "certifications" text[],
  "language" text DEFAULT 'en'::text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "profile_picture" text,
  "department" text,
  "can_approve" boolean DEFAULT false,
  "approval_limit" numeric,
  "supervisor_id" character varying,
  "device_user_id" character varying,
  "username" text,
  "password" text
);

-- Table: equipment
CREATE TABLE IF NOT EXISTS "equipment" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "equipment_type" text NOT NULL,
  "make" text NOT NULL,
  "model" text NOT NULL,
  "plate_no" text,
  "asset_no" text,
  "new_asset_no" text,
  "machine_serial" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "remarks" text,
  "category_id" character varying,
  "price" numeric,
  "plant_number" text,
  "project_area" text,
  "assigned_driver_id" character varying
);

-- Table: equipment_categories
CREATE TABLE IF NOT EXISTS "equipment_categories" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "description" text,
  "background_image" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: equipment_inspections
CREATE TABLE IF NOT EXISTS "equipment_inspections" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "inspection_number" text NOT NULL,
  "reception_id" character varying NOT NULL,
  "service_type" text NOT NULL,
  "inspector_id" character varying NOT NULL,
  "inspection_date" timestamp without time zone NOT NULL DEFAULT now(),
  "status" text NOT NULL DEFAULT 'in_progress'::text,
  "overall_condition" text,
  "findings" text,
  "recommendations" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "approver_id" character varying
);

-- Table: equipment_locations
CREATE TABLE IF NOT EXISTS "equipment_locations" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "equipment_id" character varying NOT NULL,
  "garage_id" character varying,
  "location_status" text NOT NULL DEFAULT 'in_field'::text,
  "arrived_at" timestamp without time zone NOT NULL DEFAULT now(),
  "departed_at" timestamp without time zone,
  "notes" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "workshop_id" character varying
);

-- Table: equipment_parts_compatibility
CREATE TABLE IF NOT EXISTS "equipment_parts_compatibility" (
  "equipment_id" character varying NOT NULL,
  "part_id" character varying NOT NULL,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: equipment_receptions
CREATE TABLE IF NOT EXISTS "equipment_receptions" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "reception_number" text NOT NULL,
  "equipment_id" character varying NOT NULL,
  "fuel_level" text,
  "issues_reported" text,
  "driver_signature" text,
  "mechanic_id" character varying,
  "status" text NOT NULL DEFAULT 'driver_submitted'::text,
  "work_order_id" character varying,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "plant_number" text,
  "project_area" text,
  "arrival_date" timestamp without time zone NOT NULL,
  "kilometre_riding" numeric,
  "reason_of_maintenance" text NOT NULL,
  "driver_id" character varying NOT NULL,
  "service_type" text,
  "admin_issues_reported" text,
  "inspection_officer_id" character varying
);

-- Table: garages
CREATE TABLE IF NOT EXISTS "garages" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "location" text NOT NULL,
  "type" text NOT NULL,
  "capacity" integer,
  "contact_person" text,
  "phone_number" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: inspection_checklist_items
CREATE TABLE IF NOT EXISTS "inspection_checklist_items" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "inspection_id" character varying NOT NULL,
  "item_number" integer NOT NULL,
  "item_description" text NOT NULL,
  "has_item" boolean,
  "does_not_have" boolean,
  "is_working" boolean,
  "not_working" boolean,
  "is_broken" boolean,
  "is_cracked" boolean,
  "additional_comments" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: item_requisition_lines
CREATE TABLE IF NOT EXISTS "item_requisition_lines" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "requisition_id" character varying NOT NULL,
  "line_number" integer NOT NULL,
  "spare_part_id" character varying,
  "description" text NOT NULL,
  "unit_of_measure" text,
  "quantity_requested" integer NOT NULL,
  "quantity_approved" integer,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "remarks" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "foreman_reviewer_id" character varying,
  "foreman_decision_at" timestamp without time zone,
  "foreman_decision_remarks" text,
  "foreman_approved_qty" integer,
  "foreman_status" text DEFAULT 'pending'::text
);

-- Table: item_requisitions
CREATE TABLE IF NOT EXISTS "item_requisitions" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "requisition_number" text NOT NULL,
  "work_order_id" character varying NOT NULL,
  "requester_id" character varying NOT NULL,
  "workshop_id" character varying,
  "status" text NOT NULL DEFAULT 'draft'::text,
  "foreman_approval_status" text DEFAULT 'pending'::text,
  "foreman_approved_by_id" character varying,
  "foreman_approved_at" timestamp without time zone,
  "foreman_remarks" text,
  "store_approval_status" text DEFAULT 'pending'::text,
  "store_approved_by_id" character varying,
  "store_approved_at" timestamp without time zone,
  "store_remarks" text,
  "needed_by" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: items
CREATE TABLE IF NOT EXISTS "items" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "item_no" text NOT NULL,
  "description" text NOT NULL,
  "description_2" text,
  "type" text,
  "base_unit_of_measure" text,
  "unit_price" numeric,
  "unit_cost" numeric,
  "inventory" numeric,
  "vendor_no" text,
  "vendor_item_no" text,
  "last_date_modified" text,
  "synced_at" timestamp without time zone NOT NULL DEFAULT now(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: maintenance_records
CREATE TABLE IF NOT EXISTS "maintenance_records" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "equipment_id" character varying NOT NULL,
  "mechanic_id" character varying,
  "maintenance_type" text NOT NULL,
  "description" text NOT NULL,
  "operating_hours" integer,
  "labor_hours" numeric,
  "cost" numeric,
  "status" text NOT NULL DEFAULT 'completed'::text,
  "maintenance_date" timestamp without time zone NOT NULL,
  "completed_date" timestamp without time zone,
  "notes" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: mechanics
CREATE TABLE IF NOT EXISTS "mechanics" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "full_name" text NOT NULL,
  "specialty" text,
  "phone_number" text,
  "email" text,
  "employee_id" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: mellatech_alerts
CREATE TABLE IF NOT EXISTS "mellatech_alerts" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "vehicle_id" character varying NOT NULL,
  "alert_type" text NOT NULL,
  "message" text NOT NULL,
  "severity" text NOT NULL DEFAULT 'info'::text,
  "latitude" numeric,
  "longitude" numeric,
  "is_read" boolean NOT NULL DEFAULT false,
  "occurred_at" timestamp without time zone NOT NULL,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: mellatech_location_history
CREATE TABLE IF NOT EXISTS "mellatech_location_history" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "vehicle_id" character varying NOT NULL,
  "trip_id" character varying,
  "latitude" numeric NOT NULL,
  "longitude" numeric NOT NULL,
  "altitude" numeric,
  "speed" numeric,
  "angle" numeric,
  "timestamp" timestamp without time zone NOT NULL,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: mellatech_trips
CREATE TABLE IF NOT EXISTS "mellatech_trips" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "vehicle_id" character varying NOT NULL,
  "start_time" timestamp without time zone NOT NULL,
  "end_time" timestamp without time zone,
  "start_latitude" numeric,
  "start_longitude" numeric,
  "end_latitude" numeric,
  "end_longitude" numeric,
  "distance" numeric,
  "duration" integer,
  "max_speed" numeric,
  "average_speed" numeric,
  "idle_time" integer,
  "fuel_consumed" numeric,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: mellatech_vehicles
CREATE TABLE IF NOT EXISTS "mellatech_vehicles" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "mellatech_id" text NOT NULL,
  "name" text NOT NULL,
  "plate_number" text,
  "equipment_id" character varying,
  "vehicle_type" text,
  "imei" text,
  "speed" numeric,
  "latitude" numeric,
  "longitude" numeric,
  "altitude" numeric,
  "angle" numeric,
  "battery_level" numeric,
  "engine_hours" numeric,
  "distance" numeric,
  "status" text,
  "last_update" timestamp without time zone,
  "synced_at" timestamp without time zone NOT NULL DEFAULT now(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: operating_behavior_reports
CREATE TABLE IF NOT EXISTS "operating_behavior_reports" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "equipment_id" character varying NOT NULL,
  "report_date" timestamp without time zone NOT NULL,
  "operating_hours" integer NOT NULL,
  "fuel_consumption" numeric,
  "productivity" text,
  "issues_reported" text,
  "operator_notes" text,
  "performance_rating" integer,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: part_compatibility
CREATE TABLE IF NOT EXISTS "part_compatibility" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "part_id" character varying NOT NULL,
  "make" text NOT NULL,
  "model" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: parts_receipts
CREATE TABLE IF NOT EXISTS "parts_receipts" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_id" character varying NOT NULL,
  "requisition_line_id" character varying NOT NULL,
  "spare_part_id" character varying,
  "quantity_issued" integer NOT NULL,
  "issued_at" timestamp without time zone NOT NULL DEFAULT now(),
  "issued_by_id" character varying NOT NULL,
  "notes" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: parts_requests
CREATE TABLE IF NOT EXISTS "parts_requests" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "request_number" text NOT NULL,
  "work_order_id" character varying,
  "reception_id" character varying,
  "requested_by_id" character varying NOT NULL,
  "parts_data" text NOT NULL,
  "total_cost" numeric,
  "urgency" text NOT NULL DEFAULT 'normal'::text,
  "justification" text,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "approval_status" text DEFAULT 'pending'::text,
  "approved_by_id" character varying,
  "approved_at" timestamp without time zone,
  "approval_notes" text,
  "fulfilled_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: parts_storage_locations
CREATE TABLE IF NOT EXISTS "parts_storage_locations" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "part_id" character varying NOT NULL,
  "garage_id" character varying,
  "location" text NOT NULL,
  "quantity" integer NOT NULL DEFAULT 0,
  "min_quantity" integer DEFAULT 0,
  "notes" text,
  "last_restocked" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: parts_usage_history
CREATE TABLE IF NOT EXISTS "parts_usage_history" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "maintenance_record_id" character varying NOT NULL,
  "part_id" character varying NOT NULL,
  "quantity" integer NOT NULL DEFAULT 1,
  "unit_cost" numeric,
  "notes" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: purchase_requests
CREATE TABLE IF NOT EXISTS "purchase_requests" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "purchase_request_number" text NOT NULL,
  "requisition_line_id" character varying NOT NULL,
  "store_manager_id" character varying NOT NULL,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "notes" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "quantity_requested" integer NOT NULL DEFAULT 0,
  "quantity_received" integer DEFAULT 0,
  "unit_price" text,
  "total_price" text,
  "currency" text DEFAULT 'ETB'::text,
  "order_date" timestamp without time zone,
  "received_date" timestamp without time zone,
  "requested_by_id" character varying,
  "foreman_approved_by_id" character varying,
  "date_requested" timestamp without time zone NOT NULL DEFAULT now(),
  "date_approved" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: reception_checklists
CREATE TABLE IF NOT EXISTS "reception_checklists" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "equipment_type" text NOT NULL,
  "role" text NOT NULL,
  "category" text NOT NULL,
  "sort_order" integer DEFAULT 0,
  "item_description" text NOT NULL,
  "default_severity" text DEFAULT 'ok'::text,
  "requires_photo" boolean DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: reception_inspection_items
CREATE TABLE IF NOT EXISTS "reception_inspection_items" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "reception_id" character varying NOT NULL,
  "checklist_item_id" character varying,
  "status" text NOT NULL,
  "severity" text NOT NULL DEFAULT 'ok'::text,
  "notes" text,
  "requires_parts" boolean DEFAULT false,
  "parts_suggested" text,
  "photo_url" text,
  "recorded_by_id" character varying,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: reorder_rules
CREATE TABLE IF NOT EXISTS "reorder_rules" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "part_id" character varying NOT NULL,
  "warehouse_id" character varying,
  "min_quantity" integer NOT NULL,
  "reorder_quantity" integer NOT NULL,
  "max_quantity" integer,
  "lead_time_days" integer DEFAULT 7,
  "supplier_name" text,
  "supplier_contact" text,
  "preferred_supplier" text,
  "last_order_date" timestamp without time zone,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: repair_estimates
CREATE TABLE IF NOT EXISTS "repair_estimates" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "reception_id" character varying NOT NULL,
  "labor_hours" numeric,
  "labor_cost" numeric,
  "parts_cost" numeric,
  "total_cost" numeric,
  "recommendation" text NOT NULL,
  "priority" text NOT NULL DEFAULT 'medium'::text,
  "estimated_completion_days" integer,
  "generated_by_id" character varying,
  "approved_by_id" character varying,
  "approved_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: spare_parts
CREATE TABLE IF NOT EXISTS "spare_parts" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "part_number" text NOT NULL,
  "part_name" text NOT NULL,
  "description" text,
  "category" text NOT NULL,
  "price" numeric,
  "stock_quantity" integer DEFAULT 0,
  "stock_status" text NOT NULL DEFAULT 'in_stock'::text,
  "model_3d_path" text,
  "specifications" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "image_urls" text[],
  "location_instructions" text,
  "tutorial_video_url" text,
  "required_tools" text[],
  "install_time_minutes" integer,
  "install_time_estimates" text,
  "manufacturing_specs" text,
  "tutorial_animation_url" text
);

-- Table: standard_operating_procedures
CREATE TABLE IF NOT EXISTS "standard_operating_procedures" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "sop_code" text NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "target_role" text NOT NULL,
  "description" text NOT NULL,
  "steps" text NOT NULL,
  "required_equipment" text[],
  "estimated_time_minutes" integer,
  "safety_requirements" text[],
  "video_url" text,
  "document_url" text,
  "language" text DEFAULT 'en'::text,
  "version" text DEFAULT '1.0'::text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: stock_ledger
CREATE TABLE IF NOT EXISTS "stock_ledger" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "transaction_type" text NOT NULL,
  "part_id" character varying NOT NULL,
  "from_warehouse_id" character varying,
  "from_zone_id" character varying,
  "to_warehouse_id" character varying,
  "to_zone_id" character varying,
  "quantity" integer NOT NULL,
  "unit_cost" numeric,
  "total_cost" numeric,
  "reference_type" text,
  "reference_id" character varying,
  "work_order_id" character varying,
  "performed_by_id" character varying,
  "notes" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: stock_reservations
CREATE TABLE IF NOT EXISTS "stock_reservations" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_id" character varying NOT NULL,
  "part_id" character varying NOT NULL,
  "warehouse_id" character varying,
  "zone_id" character varying,
  "quantity_reserved" integer NOT NULL,
  "quantity_issued" integer DEFAULT 0,
  "status" text NOT NULL DEFAULT 'reserved'::text,
  "reserved_by_id" character varying,
  "expires_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: system_settings
CREATE TABLE IF NOT EXISTS "system_settings" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "server_host" text NOT NULL DEFAULT '0.0.0.0'::text,
  "server_port" integer NOT NULL DEFAULT 3000,
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_by" character varying,
  "mellatech_username" text,
  "mellatech_password" text,
  "active_ethiopian_year" integer,
  "last_year_closure_date" timestamp without time zone,
  "planning_targets_locked" boolean NOT NULL DEFAULT true
);

-- Table: users
CREATE TABLE IF NOT EXISTS "users" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "username" text NOT NULL,
  "password" text NOT NULL,
  "full_name" text NOT NULL,
  "role" text NOT NULL DEFAULT 'user'::text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "language" text NOT NULL DEFAULT 'en'::text
);

-- Table: warehouse_zones
CREATE TABLE IF NOT EXISTS "warehouse_zones" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "warehouse_id" character varying NOT NULL,
  "zone_code" text NOT NULL,
  "name" text NOT NULL,
  "type" text NOT NULL,
  "row" text,
  "column" text,
  "level" integer,
  "capacity" integer,
  "current_load" integer DEFAULT 0,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: warehouses
CREATE TABLE IF NOT EXISTS "warehouses" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "code" text NOT NULL,
  "name" text NOT NULL,
  "location" text NOT NULL,
  "type" text NOT NULL DEFAULT 'main'::text,
  "capacity" integer,
  "manager_id" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: work_order_approvals
CREATE TABLE IF NOT EXISTS "work_order_approvals" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_id" character varying NOT NULL,
  "stage_id" character varying NOT NULL,
  "approver_id" character varying NOT NULL,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "decided_at" timestamp without time zone,
  "remarks" text,
  "metadata" text,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "approver_role" text NOT NULL DEFAULT 'supervisor'::text
);

-- Table: work_order_garages
CREATE TABLE IF NOT EXISTS "work_order_garages" (
  "work_order_id" character varying NOT NULL,
  "garage_id" character varying NOT NULL,
  "assigned_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: work_order_memberships
CREATE TABLE IF NOT EXISTS "work_order_memberships" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_id" character varying NOT NULL,
  "employee_id" character varying NOT NULL,
  "role" text NOT NULL,
  "assigned_by" character varying,
  "assigned_at" timestamp without time zone NOT NULL DEFAULT now(),
  "is_active" boolean NOT NULL DEFAULT true,
  "deactivated_at" timestamp without time zone
);

-- Table: work_order_required_parts
CREATE TABLE IF NOT EXISTS "work_order_required_parts" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_id" character varying NOT NULL,
  "spare_part_id" character varying,
  "part_name" text NOT NULL,
  "part_number" text NOT NULL,
  "stock_status" text,
  "quantity" integer DEFAULT 1,
  "created_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: work_order_status_history
CREATE TABLE IF NOT EXISTS "work_order_status_history" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_id" character varying NOT NULL,
  "from_status" text,
  "to_status" text NOT NULL,
  "changed_by_id" character varying NOT NULL,
  "changed_by_role" text,
  "notes" text,
  "metadata" text,
  "changed_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: work_order_time_tracking
CREATE TABLE IF NOT EXISTS "work_order_time_tracking" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_id" character varying NOT NULL,
  "event" text NOT NULL,
  "reason" text,
  "triggered_by_id" character varying,
  "timestamp" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: work_order_workshops
CREATE TABLE IF NOT EXISTS "work_order_workshops" (
  "work_order_id" character varying NOT NULL,
  "workshop_id" character varying NOT NULL,
  "foreman_id" character varying,
  "is_primary" boolean DEFAULT false,
  "assigned_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: work_orders
CREATE TABLE IF NOT EXISTS "work_orders" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "work_order_number" text NOT NULL,
  "equipment_id" character varying NOT NULL,
  "priority" text NOT NULL DEFAULT 'medium'::text,
  "work_type" text NOT NULL,
  "description" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending_allocation'::text,
  "actual_hours" numeric,
  "created_by_id" character varying,
  "started_at" timestamp without time zone,
  "completed_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "actual_cost" numeric,
  "approval_status" text DEFAULT 'not_required'::text,
  "approved_by_id" character varying,
  "approved_at" timestamp without time zone,
  "approval_notes" text,
  "completion_approval_status" text DEFAULT 'not_required'::text,
  "completion_approved_by_id" character varying,
  "completion_approved_at" timestamp without time zone,
  "completion_approval_notes" text,
  "inspection_id" character varying,
  "reception_id" character varying,
  "direct_maintenance_cost" numeric,
  "overtime_cost" numeric,
  "outsource_cost" numeric,
  "overhead_cost" numeric,
  "is_outsourced" boolean DEFAULT false
);

-- Table: work_orders_archive
CREATE TABLE IF NOT EXISTS "work_orders_archive" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "original_work_order_id" character varying NOT NULL,
  "work_order_number" text NOT NULL,
  "ethiopian_year" integer NOT NULL,
  "equipment_id" character varying,
  "equipment_model" text,
  "priority" text,
  "work_type" text,
  "description" text,
  "status" text,
  "actual_hours" numeric,
  "actual_cost" numeric,
  "direct_maintenance_cost" numeric,
  "overtime_cost" numeric,
  "outsource_cost" numeric,
  "overhead_cost" numeric,
  "is_outsourced" boolean,
  "created_by_id" character varying,
  "created_by_name" text,
  "started_at" timestamp without time zone,
  "completed_at" timestamp without time zone,
  "created_at" timestamp without time zone,
  "archived_at" timestamp without time zone NOT NULL DEFAULT now(),
  "archived_by" character varying
);

-- Table: workshop_members
CREATE TABLE IF NOT EXISTS "workshop_members" (
  "workshop_id" character varying NOT NULL,
  "employee_id" character varying NOT NULL,
  "role" text,
  "assigned_at" timestamp without time zone NOT NULL DEFAULT now()
);

-- Table: workshops
CREATE TABLE IF NOT EXISTS "workshops" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "garage_id" character varying NOT NULL,
  "name" text NOT NULL,
  "foreman_id" character varying,
  "description" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "monthly_target" integer,
  "q1_target" integer,
  "q2_target" integer,
  "q3_target" integer,
  "q4_target" integer,
  "annual_target" integer
);

-- Table: year_closure_logs
CREATE TABLE IF NOT EXISTS "year_closure_logs" (
  "id" character varying NOT NULL DEFAULT gen_random_uuid(),
  "closed_ethiopian_year" integer NOT NULL,
  "new_ethiopian_year" integer NOT NULL,
  "work_orders_archived" integer NOT NULL DEFAULT 0,
  "work_orders_rolled_over" integer NOT NULL DEFAULT 0,
  "workshops_reset" integer NOT NULL DEFAULT 0,
  "closed_at" timestamp without time zone NOT NULL DEFAULT now(),
  "closed_by" character varying NOT NULL,
  "closed_by_name" text,
  "notes" text
);

-- Constraints
-- FOREIGN KEY: app_customizations(updated_by) → employees(id)
-- PRIMARY KEY on app_customizations(id)
-- PRIMARY KEY on approval_stages(id)
-- UNIQUE constraint on approval_stages(code)
-- FOREIGN KEY: approvals(escalated_to_id) → employees(id)
-- FOREIGN KEY: approvals(requested_by_id) → employees(id)
-- FOREIGN KEY: approvals(assigned_to_id) → employees(id)
-- PRIMARY KEY on approvals(id)
-- PRIMARY KEY on attendance_device_settings(id)
-- PRIMARY KEY on d365_items_preview(id)
-- PRIMARY KEY on d365_sync_logs(id)
-- FOREIGN KEY: damage_reports(reception_id) → equipment_receptions(id)
-- FOREIGN KEY: damage_reports(marked_by_id) → employees(id)
-- PRIMARY KEY on damage_reports(id)
-- FOREIGN KEY: device_import_logs(device_id) → attendance_device_settings(id)
-- PRIMARY KEY on device_import_logs(id)
-- FOREIGN KEY: dynamics365_settings(updated_by) → users(id)
-- FOREIGN KEY: dynamics365_settings(updated_by) → users(id)
-- PRIMARY KEY on dynamics365_settings(id)
-- FOREIGN KEY: employee_page_permissions(employee_id) → employees(id)
-- PRIMARY KEY on employee_page_permissions(id)
-- FOREIGN KEY: employee_performance_snapshots(employee_id) → employees(id)
-- PRIMARY KEY on employee_performance_snapshots(id)
-- UNIQUE constraint on employee_performance_snapshots(granularity)
-- FOREIGN KEY: employee_performance_totals(employee_id) → employees(id)
-- PRIMARY KEY on employee_performance_totals(employee_id)
-- FOREIGN KEY: employees(supervisor_id) → employees(id)
-- FOREIGN KEY: employees(garage_id) → garages(id)
-- PRIMARY KEY on employees(id)
-- UNIQUE constraint on employees(employee_id)
-- UNIQUE constraint on employees(device_user_id)
-- UNIQUE constraint on employees(username)
-- FOREIGN KEY: equipment(assigned_driver_id) → employees(id)
-- FOREIGN KEY: equipment(category_id) → equipment_categories(id)
-- PRIMARY KEY on equipment(id)
-- PRIMARY KEY on equipment_categories(id)
-- UNIQUE constraint on equipment_categories(name)
-- FOREIGN KEY: equipment_inspections(inspector_id) → employees(id)
-- FOREIGN KEY: equipment_inspections(reception_id) → equipment_receptions(id)
-- FOREIGN KEY: equipment_inspections(approver_id) → employees(id)
-- PRIMARY KEY on equipment_inspections(id)
-- UNIQUE constraint on equipment_inspections(inspection_number)
-- FOREIGN KEY: equipment_locations(equipment_id) → equipment(id)
-- FOREIGN KEY: equipment_locations(workshop_id) → workshops(id)
-- FOREIGN KEY: equipment_locations(garage_id) → garages(id)
-- PRIMARY KEY on equipment_locations(id)
-- FOREIGN KEY: equipment_parts_compatibility(part_id) → spare_parts(id)
-- FOREIGN KEY: equipment_parts_compatibility(equipment_id) → equipment(id)
-- PRIMARY KEY on equipment_parts_compatibility(part_id)
-- FOREIGN KEY: equipment_receptions(work_order_id) → work_orders(id)
-- FOREIGN KEY: equipment_receptions(inspection_officer_id) → employees(id)
-- FOREIGN KEY: equipment_receptions(driver_id) → employees(id)
-- FOREIGN KEY: equipment_receptions(equipment_id) → equipment(id)
-- FOREIGN KEY: equipment_receptions(mechanic_id) → employees(id)
-- PRIMARY KEY on equipment_receptions(id)
-- UNIQUE constraint on equipment_receptions(reception_number)
-- PRIMARY KEY on garages(id)
-- FOREIGN KEY: inspection_checklist_items(inspection_id) → equipment_inspections(id)
-- PRIMARY KEY on inspection_checklist_items(id)
-- FOREIGN KEY: item_requisition_lines(spare_part_id) → spare_parts(id)
-- FOREIGN KEY: item_requisition_lines(foreman_reviewer_id) → employees(id)
-- FOREIGN KEY: item_requisition_lines(requisition_id) → item_requisitions(id)
-- PRIMARY KEY on item_requisition_lines(id)
-- UNIQUE constraint on item_requisition_lines(requisition_id)
-- FOREIGN KEY: item_requisitions(work_order_id) → work_orders(id)
-- FOREIGN KEY: item_requisitions(foreman_approved_by_id) → employees(id)
-- FOREIGN KEY: item_requisitions(workshop_id) → workshops(id)
-- FOREIGN KEY: item_requisitions(requester_id) → employees(id)
-- FOREIGN KEY: item_requisitions(store_approved_by_id) → employees(id)
-- PRIMARY KEY on item_requisitions(id)
-- UNIQUE constraint on item_requisitions(requisition_number)
-- PRIMARY KEY on items(id)
-- UNIQUE constraint on items(item_no)
-- FOREIGN KEY: maintenance_records(equipment_id) → equipment(id)
-- FOREIGN KEY: maintenance_records(mechanic_id) → mechanics(id)
-- PRIMARY KEY on maintenance_records(id)
-- PRIMARY KEY on mechanics(id)
-- FOREIGN KEY: mellatech_alerts(vehicle_id) → mellatech_vehicles(id)
-- PRIMARY KEY on mellatech_alerts(id)
-- FOREIGN KEY: mellatech_location_history(trip_id) → mellatech_trips(id)
-- FOREIGN KEY: mellatech_location_history(vehicle_id) → mellatech_vehicles(id)
-- PRIMARY KEY on mellatech_location_history(id)
-- FOREIGN KEY: mellatech_trips(vehicle_id) → mellatech_vehicles(id)
-- PRIMARY KEY on mellatech_trips(id)
-- FOREIGN KEY: mellatech_vehicles(equipment_id) → equipment(id)
-- PRIMARY KEY on mellatech_vehicles(id)
-- UNIQUE constraint on mellatech_vehicles(mellatech_id)
-- FOREIGN KEY: operating_behavior_reports(equipment_id) → equipment(id)
-- PRIMARY KEY on operating_behavior_reports(id)
-- FOREIGN KEY: part_compatibility(part_id) → spare_parts(id)
-- PRIMARY KEY on part_compatibility(id)
-- FOREIGN KEY: parts_receipts(issued_by_id) → employees(id)
-- FOREIGN KEY: parts_receipts(spare_part_id) → spare_parts(id)
-- FOREIGN KEY: parts_receipts(requisition_line_id) → item_requisition_lines(id)
-- PRIMARY KEY on parts_receipts(id)
-- FOREIGN KEY: parts_requests(approved_by_id) → employees(id)
-- FOREIGN KEY: parts_requests(reception_id) → equipment_receptions(id)
-- FOREIGN KEY: parts_requests(work_order_id) → work_orders(id)
-- FOREIGN KEY: parts_requests(requested_by_id) → employees(id)
-- PRIMARY KEY on parts_requests(id)
-- UNIQUE constraint on parts_requests(request_number)
-- FOREIGN KEY: parts_storage_locations(part_id) → spare_parts(id)
-- FOREIGN KEY: parts_storage_locations(garage_id) → garages(id)
-- PRIMARY KEY on parts_storage_locations(id)
-- FOREIGN KEY: parts_usage_history(maintenance_record_id) → maintenance_records(id)
-- FOREIGN KEY: parts_usage_history(part_id) → spare_parts(id)
-- PRIMARY KEY on parts_usage_history(id)
-- FOREIGN KEY: purchase_requests(requested_by_id) → employees(id)
-- FOREIGN KEY: purchase_requests(requisition_line_id) → item_requisition_lines(id)
-- FOREIGN KEY: purchase_requests(store_manager_id) → employees(id)
-- FOREIGN KEY: purchase_requests(foreman_approved_by_id) → employees(id)
-- PRIMARY KEY on purchase_requests(id)
-- UNIQUE constraint on purchase_requests(purchase_request_number)
-- PRIMARY KEY on reception_checklists(id)
-- FOREIGN KEY: reception_inspection_items(recorded_by_id) → employees(id)
-- FOREIGN KEY: reception_inspection_items(checklist_item_id) → reception_checklists(id)
-- FOREIGN KEY: reception_inspection_items(reception_id) → equipment_receptions(id)
-- PRIMARY KEY on reception_inspection_items(id)
-- FOREIGN KEY: reorder_rules(part_id) → spare_parts(id)
-- FOREIGN KEY: reorder_rules(warehouse_id) → warehouses(id)
-- PRIMARY KEY on reorder_rules(id)
-- FOREIGN KEY: repair_estimates(approved_by_id) → employees(id)
-- FOREIGN KEY: repair_estimates(reception_id) → equipment_receptions(id)
-- FOREIGN KEY: repair_estimates(generated_by_id) → employees(id)
-- PRIMARY KEY on repair_estimates(id)
-- PRIMARY KEY on spare_parts(id)
-- UNIQUE constraint on spare_parts(part_number)
-- PRIMARY KEY on standard_operating_procedures(id)
-- UNIQUE constraint on standard_operating_procedures(sop_code)
-- FOREIGN KEY: stock_ledger(from_warehouse_id) → warehouses(id)
-- FOREIGN KEY: stock_ledger(to_warehouse_id) → warehouses(id)
-- FOREIGN KEY: stock_ledger(from_zone_id) → warehouse_zones(id)
-- FOREIGN KEY: stock_ledger(performed_by_id) → employees(id)
-- FOREIGN KEY: stock_ledger(work_order_id) → work_orders(id)
-- FOREIGN KEY: stock_ledger(to_zone_id) → warehouse_zones(id)
-- FOREIGN KEY: stock_ledger(part_id) → spare_parts(id)
-- PRIMARY KEY on stock_ledger(id)
-- FOREIGN KEY: stock_reservations(work_order_id) → work_orders(id)
-- FOREIGN KEY: stock_reservations(part_id) → spare_parts(id)
-- FOREIGN KEY: stock_reservations(warehouse_id) → warehouses(id)
-- FOREIGN KEY: stock_reservations(zone_id) → warehouse_zones(id)
-- FOREIGN KEY: stock_reservations(reserved_by_id) → employees(id)
-- PRIMARY KEY on stock_reservations(id)
-- FOREIGN KEY: system_settings(updated_by) → employees(id)
-- PRIMARY KEY on system_settings(id)
-- PRIMARY KEY on users(id)
-- UNIQUE constraint on users(username)
-- FOREIGN KEY: warehouse_zones(warehouse_id) → warehouses(id)
-- PRIMARY KEY on warehouse_zones(id)
-- FOREIGN KEY: warehouses(manager_id) → employees(id)
-- PRIMARY KEY on warehouses(id)
-- UNIQUE constraint on warehouses(code)
-- FOREIGN KEY: work_order_approvals(work_order_id) → work_orders(id)
-- FOREIGN KEY: work_order_approvals(approver_id) → employees(id)
-- FOREIGN KEY: work_order_approvals(stage_id) → approval_stages(id)
-- PRIMARY KEY on work_order_approvals(id)
-- UNIQUE constraint on work_order_approvals(stage_id)
-- FOREIGN KEY: work_order_garages(garage_id) → garages(id)
-- FOREIGN KEY: work_order_garages(work_order_id) → work_orders(id)
-- PRIMARY KEY on work_order_garages(work_order_id)
-- FOREIGN KEY: work_order_memberships(employee_id) → employees(id)
-- FOREIGN KEY: work_order_memberships(work_order_id) → work_orders(id)
-- FOREIGN KEY: work_order_memberships(assigned_by) → employees(id)
-- PRIMARY KEY on work_order_memberships(id)
-- FOREIGN KEY: work_order_required_parts(spare_part_id) → spare_parts(id)
-- FOREIGN KEY: work_order_required_parts(work_order_id) → work_orders(id)
-- PRIMARY KEY on work_order_required_parts(id)
-- FOREIGN KEY: work_order_status_history(changed_by_id) → employees(id)
-- FOREIGN KEY: work_order_status_history(work_order_id) → work_orders(id)
-- PRIMARY KEY on work_order_status_history(id)
-- FOREIGN KEY: work_order_time_tracking(work_order_id) → work_orders(id)
-- FOREIGN KEY: work_order_time_tracking(triggered_by_id) → employees(id)
-- PRIMARY KEY on work_order_time_tracking(id)
-- FOREIGN KEY: work_order_workshops(work_order_id) → work_orders(id)
-- FOREIGN KEY: work_order_workshops(workshop_id) → workshops(id)
-- FOREIGN KEY: work_order_workshops(foreman_id) → employees(id)
-- PRIMARY KEY on work_order_workshops(workshop_id)
-- FOREIGN KEY: work_orders(approved_by_id) → employees(id)
-- FOREIGN KEY: work_orders(equipment_id) → equipment(id)
-- FOREIGN KEY: work_orders(created_by_id) → employees(id)
-- FOREIGN KEY: work_orders(completion_approved_by_id) → employees(id)
-- PRIMARY KEY on work_orders(id)
-- UNIQUE constraint on work_orders(work_order_number)
-- FOREIGN KEY: work_orders_archive(archived_by) → employees(id)
-- PRIMARY KEY on work_orders_archive(id)
-- FOREIGN KEY: workshop_members(workshop_id) → workshops(id)
-- FOREIGN KEY: workshop_members(employee_id) → employees(id)
-- PRIMARY KEY on workshop_members(employee_id)
-- FOREIGN KEY: workshops(foreman_id) → employees(id)
-- FOREIGN KEY: workshops(garage_id) → garages(id)
-- PRIMARY KEY on workshops(id)
-- FOREIGN KEY: year_closure_logs(closed_by) → employees(id)
-- PRIMARY KEY on year_closure_logs(id)
