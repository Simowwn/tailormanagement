TailorSwift - MVP Plan

Overview

TailorSwift is a web-based customer and order management system for tailoring shops. It helps tailors track customer measurements, orders, payments, and due dates in a centralized cloud-based platform.

⸻

Goals

* Eliminate paper records
* Quickly search customer measurements
* Track order progress
* Monitor paid and unpaid balances
* Reduce missed deadlines
* Store customer history permanently

⸻

Tech Stack

Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Vercel Deployment

Backend Services

* Supabase
    * PostgreSQL Database
    * Authentication
    * Storage (future)

⸻

MVP Features

Authentication

Login

* Email
* Password

Logout

⸻

Dashboard

Metrics

* Total Customers
* Active Orders
* Orders Due Today
* Unpaid Orders

Recent Activity

* Latest Orders
* Recently Added Customers

⸻

Customers

Customer List

* Search customer
* Pagination
* Sort by latest

Add Customer

Fields:

* Full Name
* Mobile Number
* Address (optional)
* Notes (optional)

Customer Details

Display:

* Customer Information
* Latest Measurements
* Order History
* Outstanding Balance

⸻

Measurements

Store customer measurements.

Fields:

* Chest
* Waist
* Hips
* Shoulder
* Sleeve Length
* Shirt Length
* Inseam
* Neck
* Notes

Features

* Add Measurements
* Update Measurements
* View Measurement History

⸻

Orders

Create Order

Fields:

* Customer
* Garment Type
* Description
* Due Date
* Total Amount
* Initial Payment

Order Status

* Pending
* In Progress
* Ready for Pickup
* Completed
* Cancelled

⸻

Order Details

Display:

* Customer
* Measurements Snapshot
* Total Amount
* Amount Paid
* Remaining Balance
* Due Date
* Notes

⸻

Payments

Record Payment

Fields:

* Order
* Amount
* Payment Date
* Notes

Auto Calculations

Remaining Balance =
Total Amount - Amount Paid

Payment Status:

* Unpaid
* Partially Paid
* Fully Paid

⸻

Database Schema

customers

* id
* full_name
* mobile_number
* address
* notes
* created_at

measurements

* id
* customer_id
* chest
* waist
* hips
* shoulder
* sleeve_length
* shirt_length
* inseam
* neck
* notes
* created_at

orders

* id
* customer_id
* garment_type
* description
* total_amount
* due_date
* status
* created_at

payments

* id
* order_id
* amount
* payment_date
* notes
* created_at

⸻

Future Features (V2)

Customer Photos

Store reference photos.

Receipt Generator

Generate printable receipts.

SMS Notifications

Reminder for pickup and balance.

File Uploads

Store design references and fabric images.

Analytics

* Monthly Revenue
* Top Customers
* Most Requested Garments

Multi-User Support

* Owner
* Staff
* Cashier

⸻

Success Criteria

A tailor should be able to:

1. Add a customer
2. Save measurements
3. Create an order
4. Record payments
5. Track order status
6. Search customer history in under 5 seconds

If these six tasks work smoothly, the MVP is successful.